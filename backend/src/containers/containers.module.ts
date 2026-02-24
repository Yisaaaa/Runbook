import { Module } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { RuntimeRegistryService } from './runtime-registry.service';

@Module({
  controllers: [],
  providers: [ContainersService, RuntimeRegistryService],
  exports: [],
  imports: [],
})
export class ContainersModule {}
