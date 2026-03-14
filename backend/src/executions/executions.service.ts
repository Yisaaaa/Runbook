import { Injectable, NotFoundException } from '@nestjs/common';
import { Runtime } from 'src/common/enums/runtime.enum';
import { ContainersService } from 'src/containers/containers.service';
import { RuntimeConfigService } from 'src/containers/runtime-config.service';
import { RunbooksService } from 'src/runbooks/runbooks.service';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class ExecutionsService {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly containersService: ContainersService,
    private readonly runbooksService: RunbooksService,
    private readonly runtimeConfigService: RuntimeConfigService,
  ) {}

  async *execBlock(
    sessionId: number,
    blockIndex: number,
    runtime: Runtime,
  ): AsyncGenerator<string> {
    const session = await this.sessionsService.getSessionById(sessionId);

    if (!session) {
      console.log('Session not found with id: ' + sessionId);
      throw new NotFoundException('Session not found with id: ' + sessionId);
    }

    const codeBlocks = this.runbooksService.getRunbookRunnableBlocks(
      session.runbookId,
    );
    const codeBlock = (await codeBlocks).find(
      (block) => block.index === blockIndex,
    );

    if (!codeBlock) {
      console.log('Code block not found with index: ' + blockIndex);
      throw new NotFoundException(
        'Code block not found with index: ' + blockIndex,
      );
    }

    const runtimeConfig = this.runtimeConfigService.getConfig(runtime);
    const filepath = await this.containersService.putCodeToFile(
      codeBlock.code,
      session.containerId,
      'code_block_' + blockIndex + runtimeConfig.extension,
    );

    // Get proper command based on filename and runtime
    const command = [...runtimeConfig.command, filepath];

    try {
      for await (const chunk of this.containersService.exec(
        session.containerId,
        command,
        runtimeConfig.timeoutMs,
      )) {
        yield chunk;
      }
    } finally {
      await this.sessionsService.updateLastActivity(sessionId);
    }
  }
}
