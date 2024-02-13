import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MatchService } from 'src/match/match.service';
import { PrismaService } from 'src/database/PrismaService';
import { RoundService } from 'src/round/round.service';
import { RoomService } from 'src/room/room.service';

@Module({
    providers: [MessagesGateway, MessagesService, MatchService, PrismaService, RoundService, RoomService],
})
export class MessagesModule {}
