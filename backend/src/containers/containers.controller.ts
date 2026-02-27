import { Body, Controller, Post } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { Runtime } from 'src/common/enums/runtime.enum';
import { CreateContainerDto } from './dto/create-container.dto';

@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post('create')
  async createContainer(@Body() data: CreateContainerDto): Promise<string> {
    console.log('Creating container for runtime: ', data.runtime);
    return this.containersService.createContainer(data.runtime);
  }
}
