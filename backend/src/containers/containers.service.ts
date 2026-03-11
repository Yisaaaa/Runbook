import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Docker from 'dockerode';
import { PassThrough } from 'stream';
import { ConfigService } from '@nestjs/config';
import { Runtime } from 'src/common/enums/runtime.enum';
import { RuntimeConfigService } from './runtime-config.service';
import * as tar from 'tar-stream';

@Injectable()
export class ContainersService {
  // This service is for Docker container management related operations, such as creating, starting, stopping, and removing containers.

  private readonly docker = new Docker();

  constructor(
    private readonly configService: ConfigService,
    private readonly runtimeConfigService: RuntimeConfigService,
  ) {}

  private handleDockerError(
    error: unknown,
    containerId: string,
    action: string,
  ): never {
    const status = (error as any)?.statusCode;

    if (status === 404) {
      throw new NotFoundException(`Container with ID ${containerId} not found`);
    }

    throw new InternalServerErrorException(
      (error as any)?.message ||
        `Failed to ${action} container with ID ${containerId}`,
    );
  }

  async createContainer(): Promise<string> {
    try {
      const container = await this.docker.createContainer({
        Image: this.configService.get<string>('CONTAINER_IMAGE'),
        Cmd: ['sleep', 'infinity'],
        OpenStdin: true,
        HostConfig: {
          NanoCpus: 1_000_000_000, // 1 CPU
          Memory: 512 * 1024 * 1024, // 512MB
          NetworkMode: 'bridge',
        },
      });

      await container.start();
      return container.id;
    } catch (error: unknown) {
      console.log('Error creating container: ', error);
      throw new InternalServerErrorException(
        (error as any)?.message ?? 'Failed to create container',
      );
    }
  }

  async *exec(
    containerId: string,
    command: string[],
    timeoutMs: number,
  ): AsyncGenerator<string> {
    const container = this.docker.getContainer(containerId);

    const exec = await container.exec({
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: false });
    const combinedStream = new PassThrough();
    container.modem.demuxStream(stream, combinedStream, combinedStream);

    const timeout = setTimeout(() => {
      combinedStream.destroy(
        new Error(`Execution timed out after ${timeoutMs}ms`),
      );
    }, timeoutMs);

    stream.on('end', () => {
      combinedStream.end();
    });

    try {
      for await (const chunk of combinedStream) {
        yield JSON.stringify({ type: 'output', data: chunk.toString() });
      }

      const inspect = await exec.inspect();
      yield JSON.stringify({ type: 'exit', exitCode: inspect.ExitCode ?? -1 });
    } catch (error) {
      yield JSON.stringify({
        type: 'error',
        exitCode: -1,
        message: (error as any)?.message ?? 'An unknown error occured',
      });

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async stop(containerId: string): Promise<void> {
    const container = this.docker.getContainer(containerId);

    try {
      await container.stop();
    } catch (error: unknown) {
      console.error('Error stopping container: ', error);

      if ((error as any)?.statusCode === 304) {
        console.log(`Container with ID ${containerId} is already stopped`);
        return;
      }

      this.handleDockerError(error, containerId, 'stop');
    }
  }

  async remove(containerId: string) {
    const container = this.docker.getContainer(containerId);

    try {
      await container.remove({ force: true });
    } catch (error: unknown) {
      console.error('Error removing container: ', error);
      this.handleDockerError(error, containerId, 'remove');
    }
  }

  async isContainerAlive(containerId: string): Promise<boolean> {
    const container = this.docker.getContainer(containerId);

    try {
      const inspect = await container.inspect();
      return inspect.State.Running;
    } catch (error: unknown) {
      // we do this because handleDockerError will throw 404 if container is not found
      if ((error as any)?.statusCode === 404) {
        console.log(`Container with ID ${containerId} not found`);
        return false;
      }

      this.handleDockerError(error, containerId, 'check if alive');
    }
  }

  async putCodeToFile(
    runtime: Runtime,
    codeBlock: string,
    blockIndex: number,
    containerId: string,
  ) {
    const container = this.docker.getContainer(containerId);
    const runtimeConfig = this.runtimeConfigService.getConfig(runtime);
    let filename = `block_${blockIndex}${runtimeConfig.extension}`;
    const pack = tar.pack();
    pack.entry({ name: filename }, codeBlock, (err) => {
      if (err) throw err;
      pack.finalize();
    });

    try {
      await container.putArchive(pack, { path: '/tmp' });
    } catch (error: unknown) {
      console.error('Error putting code to file: ', error);
      this.handleDockerError(error, containerId, 'put code to file');
    }

    return `/tmp/${filename}`;
  }
}
