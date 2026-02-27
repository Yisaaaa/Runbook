import { Module } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { RuntimeRegistryService } from './runtime-registry.service';
import { ContainersController } from './containers.controller';

@Module({
  controllers: [ContainersController],
  providers: [ContainersService, RuntimeRegistryService],
  exports: [],
  imports: [],
})
export class ContainersModule {}
