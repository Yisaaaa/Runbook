import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { Runtime } from 'src/common/enums/runtime.enum';
import type { Response } from 'express';

@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post('create')
  async createContainer(): Promise<string> {
    return this.containersService.createContainer();
  }

  @Delete('stop/:id')
  async stopContainer(@Param('id') id: string) {
    console.log('Stopping container with ID: ', id);
    return this.containersService.stop(id);
  }

  @Delete('remove/:id')
  async removeContainer(@Param('id') id: string) {
    console.log('Removing container with ID: ', id);
    return this.containersService.remove(id);
  }

  @Post('exec/:id')
  async execCommand(
    @Param('id') id: string,
    @Body() data: { command: string[]; timeoutMs: number },
  ) {
    console.log('Executing command in container with ID: ', id);
    console.log('Command: ', data.command, 'Timeout (ms): ', data.timeoutMs);
    return this.containersService.exec(id, data.command, data.timeoutMs);
  }

  @Post('putCodeToFile/:id')
  async putCodeToFile(
    @Param('id') id: string,
    @Body()
    data: {
      codeBlock: string;
      blockIndex: number;
      filename: string;
    },
  ) {
    console.log('Putting code to file in container with ID: ', id);
    return await this.containersService.putCodeToFile(
      data.codeBlock,
      data.filename,
      id,
    );
  }

  @Post('stream-exec')
  async streamExec(
    @Body() data: { containerId: string; command: string[]; timeoutMs: number },
    @Res() res: Response,
  ) {
    console.log(
      'Streaming execution of command in container with ID: ',
      data.containerId,
    );
    res.setHeader('Content-Type', 'text/plain');

    const generator = this.containersService.exec(
      data.containerId,
      data.command,
      data.timeoutMs,
    );

    for await (const chunk of generator) {
      res.write(chunk);
    }

    res.end();
  }
}
