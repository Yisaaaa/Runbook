import { Injectable } from '@nestjs/common';
import { Runtime } from 'src/common/enums/runtime.enum';
import { RuntimeConfig } from './runtime.config';

@Injectable()
export class RuntimeRegistryService {
  private readonly registry = new Map<Runtime, RuntimeConfig>([
    [
      Runtime.PYTHON,
      { image: 'python:3.12-slim', memoryMb: 128, timeoutMs: 30000 },
    ],
    [
      Runtime.NODE,
      { image: 'node:lts-bookworm-slim', memoryMb: 256, timeoutMs: 30000 },
    ],
    [
      Runtime.GOLANG,
      { image: 'golang:1.26-bookworm', memoryMb: 64, timeoutMs: 30000 },
    ],
    [Runtime.BASH, { image: 'bash:alpine', memoryMb: 64, timeoutMs: 15000 }],
  ]);

  getConfig(runtime: Runtime): RuntimeConfig {
    const config = this.registry.get(runtime);
    if (!config) {
      throw new Error(`Unsupported runtime: ${runtime}`);
    }
    return config;
  }
}
