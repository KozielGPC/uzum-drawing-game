import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MatchService } from 'src/match/match.service';
import { RoundService } from 'src/round/round.service';
import { RoundType } from 'prisma/@generated';
import { RoomService } from 'src/room/room.service';
import { logger } from 'src/utils/logger';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly matchService: MatchService,
        private readonly roundService: RoundService,
        private readonly roomService: RoomService,
    ) {}

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('SocketGateway');

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client Connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client Disconnected: ${client.id}`);
    }

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: string): void {
        this.server.emit('msgToClient', payload, client.id);
    }

    @SubscribeMessage('sendMessage')
    chatMessage(client: Socket, payload: string): void {
        logger.info(`ClientId: ${client.id} - Recebido mensagem no socket [sendMessage] com payload: ${payload}`);
        this.server.emit('messageReceived', payload, client.id);
    }

    @SubscribeMessage('updateRoomPlayers')
    async updateRoomPlayers(client: Socket, payload: string): Promise<void> {
        logger.info(`Recebido mensagem no socket [updateRoomPlayers] com payload: ${payload}`);
        const roomPlayers = await this.roomService.getPlayers(payload);
        if (roomPlayers) {
            logger.info(
                `ClientId: ${client.id} - Recebido mensagem no socket [updateRoomPlayers] - RoomPlayers: ${roomPlayers}`,
            );
        } else {
            logger.warning(
                `ClientId: ${client.id} - Recebido mensagem no socket [updateRoomPlayers] - RoomPlayers Vazio: ${roomPlayers}`,
            );
        }
        this.server.emit('updatePlayers', roomPlayers, client.id);
    }

    @SubscribeMessage('sendNextRound')
    async sendNextRound(client: Socket, payload: string): Promise<void> {
        logger.info(`ClientId: ${client.id} - Recebido mensagem no socket [sendNextRound] com payload: ${payload}`);
        const rounds = await this.matchService.findRoundsOfMatch(payload);

        if (rounds) {
            logger.info(`ClientId: ${client.id} - Recebido mensagem no socket [sendNextRound] - Rounds: ${rounds}`);
            const lastRound = rounds[0];
            this.server.emit('receiveRound', lastRound, client.id);
        } else {
            logger.warning(
                `ClientId: ${client.id} - Recebido mensagem no socket [sendNextRound] - Rounds Vazio: ${rounds}`,
            );
        }
    }

    @SubscribeMessage('sendRound')
    async sendRound(
        client: Socket,
        payload: {
            match_id: string;
            content: string;
            sender_id: string;
            type: RoundType;
        },
    ): Promise<void> {
        logger.info(
            `ClientId: ${client.id} - Recebido mensagem no socket [sendRound] com payload: ${JSON.stringify(payload)}`,
        );
        const match = await this.matchService.findOne(payload.match_id);

        const receiver_id = this.matchService.findNextReceiver(match.sort, payload.sender_id);

        const round = await this.roundService.create({
            type: payload.type,
            match_id: payload.match_id,
            content: payload.content,
            sender_id: payload.sender_id,
            receiver_id: receiver_id,
        });

        logger.info(`ClientId: ${client.id} - Recebido mensagem no socket [sendRound] com receiver_id: ${receiver_id}`);

        if (receiver_id) {
            this.server.emit('receiveRound', round, client.id);
        } else {
            const rounds = await this.matchService.findRoundsOfMatch(payload.match_id);
            console.log('rounds:', rounds);

            logger.info(
                `ClientId: ${client.id} - Recebido mensagem no socket [sendRound] com rounds: ${rounds.toString()}`,
            );
            this.server.emit('endMatch', payload.match_id, client.id);
        }
    }

    @SubscribeMessage('addShowRound')
    async addShowRound(client: Socket): Promise<void> {
        logger.info(`ClientId: ${client.id} - Recebido mensagem no socket [addShowRound]`);
        this.server.emit('showNext', client.id);
    }

    @SubscribeMessage('restartGame')
    async restartGame(client: Socket, payload: any): Promise<void> {
        logger.info(`ClientId: ${client.id} - Recebido mensagem no socket [restartGame] com payload: ${payload}`);
        this.server.emit('restartGame', payload, client.id);
    }
}
