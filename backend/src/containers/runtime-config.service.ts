import { Injectable } from '@nestjs/common';
import { Runtime } from 'src/common/enums/runtime.enum';
import { RuntimeConfig } from './runtime.config';

@Injectable()
export class RuntimeConfigService {
  private readonly registry = new Map<Runtime, RuntimeConfig>([
    [Runtime.PYTHON, { command: ['python3'], timeoutMs: 30000 }],
    [Runtime.NODE, { command: ['node'], timeoutMs: 30000 }],
    [Runtime.GOLANG, { command: ['go', 'run'], timeoutMs: 30000 }],
    [Runtime.BASH, { command: ['bash'], timeoutMs: 15000 }],
  ]);

  getConfig(runtime: Runtime): RuntimeConfig {
    const config = this.registry.get(runtime);
    if (!config) {
      throw new Error(`Unsupported runtime: ${runtime}`);
    }
    return config;
  }
}
