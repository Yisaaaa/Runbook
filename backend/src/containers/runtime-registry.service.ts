import { Injectable } from '@nestjs/common';
import { Runtime } from 'src/common/enums/runtime.enum';
import { RuntimeConfig } from './runtime.config';
import { RUNTIME_IMAGES } from 'src/common/docker/runtime-images';

@Injectable()
export class RuntimeRegistryService {
  private readonly registry = new Map<Runtime, RuntimeConfig>([
    [
      Runtime.PYTHON,
      { image: RUNTIME_IMAGES.python, memoryMb: 128, timeoutMs: 30000 },
    ],
    [
      Runtime.NODE,
      { image: RUNTIME_IMAGES.node, memoryMb: 256, timeoutMs: 30000 },
    ],
    [
      Runtime.GOLANG,
      { image: RUNTIME_IMAGES.golang, memoryMb: 64, timeoutMs: 30000 },
    ],
    [
      Runtime.BASH,
      { image: RUNTIME_IMAGES.bash, memoryMb: 64, timeoutMs: 15000 },
    ],
  ]);

  getConfig(runtime: Runtime): RuntimeConfig {
    const config = this.registry.get(runtime);
    if (!config) {
      throw new Error(`Unsupported runtime: ${runtime}`);
    }
    return config;
  }
}
