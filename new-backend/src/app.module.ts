import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';
import { UserModule } from './user/user.module';
import { RoundModule } from './round/round.module';
import { RoomModule } from './room/room.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [MatchModule, UserModule, RoundModule, RoomModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
