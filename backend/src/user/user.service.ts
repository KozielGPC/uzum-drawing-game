import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UUIDv4 } from 'uuid-v4-validator';
import { LoginDto } from './dto/login.dto';
import { LogoffDto } from './dto/logoff.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(data: LoginDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                username: data.username,
            },
            include: {
                adm_rooms: true,
                rooms: true,
                adm_matches: true,
                matches: true,
                receiver_rounds: true,
                sender_rounds: true,
            },
        });

        if (!user) {
            return this.prisma.user.create({
                data: {
                    username: data.username,
                },
                include: {
                    adm_rooms: true,
                    rooms: true,
                    adm_matches: true,
                    matches: true,
                    receiver_rounds: true,
                    sender_rounds: true,
                },
            });
        } else if (user.active == false) {
            return this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    active: true,
                    updated_at: new Date(),
                },
                include: {
                    adm_rooms: true,
                    rooms: true,
                    adm_matches: true,
                    matches: true,
                    receiver_rounds: true,
                    sender_rounds: true,
                },
            });
        } else {
            throw new HttpException('User already connected', 400);
        }
    }

    async logoff(data: LogoffDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: data.user_id,
            },
        });

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        return this.prisma.user.update({
            data: {
                active: false,
            },
            where: {
                id: data.user_id,
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            include: {
                adm_matches: true,
                matches: true,
                adm_rooms: true,
                rooms: true,
                receiver_rounds: true,
                sender_rounds: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async findOne(user_id: string) {
        if (!UUIDv4.validate(user_id)) {
            throw new HttpException('Invalid id', 400);
        }

        const user = await this.prisma.user.findFirst({
            where: {
                id: user_id,
            },
            include: {
                adm_matches: true,
                matches: true,
                adm_rooms: true,
                rooms: true,
                receiver_rounds: true,
                sender_rounds: true,
            },
        });

        if (!user) {
            throw new HttpException('User not found', 404);
        }
        return user;
    }

    async logoutAllPlayers() {
        const transactionArray = [];
        transactionArray.push(
            this.prisma.room.updateMany({
                data: {
                    active: false,
                },
            }),
        );

        transactionArray.push(
            this.prisma.roomHasUsers.updateMany({
                data: {
                    active: false,
                    updated_at: new Date(),
                },
            }),
        );

        transactionArray.push(
            this.prisma.user.updateMany({
                data: {
                    active: false,
                },
            }),
        );

        return this.prisma.$transaction(transactionArray);
    }
}
