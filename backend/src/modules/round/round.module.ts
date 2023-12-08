import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [RoundController],
  providers: [RoundService, PrismaService]
})
export class RoundModule { }
