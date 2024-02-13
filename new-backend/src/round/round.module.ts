import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';

@Module({
  controllers: [RoundController],
  providers: [RoundService],
})
export class RoundModule {}
