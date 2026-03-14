import { Body, Controller, Post, Res } from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import { Runtime } from 'src/common/enums/runtime.enum';
import type { Response } from 'express';

@Controller('executions')
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Post('exec-block')
  async execBlock(
    @Body()
    execData: { sessionId: number; blockIndex: number; runtime: Runtime },
    @Res() res: Response,
  ) {
    console.log('Executing block index: ', execData.blockIndex);
    res.setHeader('Content-Type', 'text/plain');

    const generator = this.executionsService.execBlock(
      execData.sessionId,
      execData.blockIndex,
      execData.runtime,
    );

    for await (const chunk of generator) {
      res.write(chunk);
    }

    res.end();
  }
}
