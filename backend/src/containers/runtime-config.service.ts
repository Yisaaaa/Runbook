import { Injectable } from '@nestjs/common';
import { Runtime } from 'src/common/enums/runtime.enum';
import { RuntimeConfig } from './runtime.config';

@Injectable()
export class RuntimeConfigService {
  private readonly registry = new Map<Runtime, RuntimeConfig>([
    [
      Runtime.PYTHON,
      { command: ['python3', '-u'], timeoutMs: 30000, extension: '.py' },
    ],
    [Runtime.NODE, { command: ['node'], timeoutMs: 30000, extension: '.js' }],
    [
      Runtime.GOLANG,
      { command: ['go', 'run'], timeoutMs: 30000, extension: '.go' },
    ],
    [Runtime.BASH, { command: ['bash'], timeoutMs: 15000, extension: '.sh' }],
  ]);

  getConfig(runtime: Runtime): RuntimeConfig {
    const config = this.registry.get(runtime);
    if (!config) {
      throw new Error(`Unsupported runtime: ${runtime}`);
    }
    return config;
  }
}
