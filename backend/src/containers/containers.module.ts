import { Module } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { RuntimeConfigService } from './runtime-config.service';
import { ContainersController } from './containers.controller';

@Module({
  controllers: [ContainersController],
  providers: [ContainersService, RuntimeConfigService],
  exports: [ContainersService, RuntimeConfigService],
  imports: [],
})
export class ContainersModule {}
