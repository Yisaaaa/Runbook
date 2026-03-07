import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RuntimeRegistryService } from './runtime-registry.service';
import Docker from 'dockerode';
import { PassThrough } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContainersService {
  // This service is for Docker container management related operations, such as creating, starting, stopping, and removing containers.

  private readonly docker = new Docker();

  constructor(
    private readonly runtimeRegistryService: RuntimeRegistryService,
    private readonly configService: ConfigService,
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
          Memory: 512 * 1024 * 1024,
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

  async exec(
    containerId: string,
    command: string[],
    timeoutMs: number,
  ): Promise<any> {
    const container = this.docker.getContainer(containerId);
    let stdout = '';
    let stderr = '';

    try {
      const exec = await container.exec({
        Cmd: command,
        AttachStdout: true,
        AttachStderr: true,
      });
      const stream = await exec.start({ hijack: true, stdin: false });

      return new Promise<{ stdout: string; stderr: string; exitCode: number }>(
        (resolve, reject) => {
          const timeout = setTimeout(() => {
            stream.destroy();
            reject(
              new Error(`Command execution timed out after ${timeoutMs}ms`),
            );
          }, timeoutMs);

          const stdoutStream = new PassThrough();
          const stderrStream = new PassThrough();

          stdoutStream.on('data', (chunk) => (stdout += chunk.toString()));
          stderrStream.on('data', (chunk) => (stderr += chunk.toString()));

          container.modem.demuxStream(stream, stdoutStream, stderrStream);

          stream.on('end', async () => {
            clearTimeout(timeout);
            const inspect = await exec.inspect();
            console.log('inspect: ', inspect);
            resolve({
              stdout: stdout.trim(),
              stderr: stderr.trim(),
              exitCode: inspect.ExitCode ?? -1,
            });
          });

          stream.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
          });
        },
      );
    } catch (error) {
      console.error('Error executing command in container: ', error);
      this.handleDockerError(error, containerId, 'execute command in');
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
}
