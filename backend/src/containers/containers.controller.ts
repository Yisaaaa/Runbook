import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { CreateContainerDto } from './dto/create-container.dto';

@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post('create')
  async createContainer(@Body() data: CreateContainerDto): Promise<string> {
    console.log('Creating container for runtime: ', data.runtime);
    return this.containersService.createContainer(data.runtime);
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
}
