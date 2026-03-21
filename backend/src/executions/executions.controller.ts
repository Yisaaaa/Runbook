import { Body, Controller, Post, Res } from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import { Runtime } from 'src/common/enums/runtime.enum';
import type { Response } from 'express';
import { ExecBlockDto } from './dto/exec.dto';

@Controller('executions')
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Post('exec-block')
  async execBlock(
    @Body()
    execData: ExecBlockDto,
    @Res() res: Response,
  ) {
    console.log(execData);
    console.log('Executing block index: ', execData.blockIndex);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    const generator = this.executionsService.execBlock(
      execData.sessionId,
      execData.blockIndex,
      execData.runtime,
    );

    for await (const chunk of generator) {
      res.write(chunk + '\n');
    }

    res.end();
  }
}
