import { Injectable } from '@nestjs/common';
import { Runtime } from 'src/common/enums/runtime.enum';
import { RuntimeRegistryService } from './runtime-registry.service';
import Docker from 'dockerode';

@Injectable()
export class ContainersService {
  // This service is for Docker container management related operations, such as creating, starting, stopping, and removing containers.

  private readonly docker = new Docker({
    socketPath: '/var/run/docker.sock',
  });

  constructor(
    private readonly runtimeRegistryService: RuntimeRegistryService,
  ) {}

  async createContainer(runtime: Runtime): Promise<string> {
    const runtimeConfig = this.runtimeRegistryService.getConfig(runtime);
    try {
      const container = await this.docker.createContainer({
        Image: runtimeConfig.image,
        Cmd: ['sleep', 'infinity'],
        HostConfig: {
          Memory: runtimeConfig.memoryMb * 1024 * 1024,
          NetworkMode: 'none',
        },
      });

      await container.start();
      return container.id;
    } catch (error: unknown) {
      console.error('Error creating container:', error);
      throw error;
    }
  }

  async exec(
    containerId: number,
    command: string[],
    timeoutMs: number,
  ): Promise<any> {}

  async stop(containerId: string) {
    const container = this.docker.getContainer(containerId.toString());
    try {
      await container.stop();
    } catch (error: unknown) {
      console.error('Error stopping container: ', error);
      throw error;
    }
  }

  async remove(containerId: string) {
    const container = this.docker.getContainer(containerId);
    try {
      await container.remove({ force: true });
    } catch (error: unknown) {
      console.error('Error removing container: ', error);
      throw error;
    }
  }
}
