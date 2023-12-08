import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MatchService } from 'src/modules/match/match.service';
import { PrismaService } from 'src/database/PrismaService';
import { RoundService } from 'src/modules/round/round.service';
import { RoomService } from 'src/modules/room/room.service';

@Module({
    providers: [MessagesGateway, MessagesService, MatchService, PrismaService, RoundService, RoomService],
})
export class MessagesModule {}
