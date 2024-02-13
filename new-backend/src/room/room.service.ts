import { PrismaService } from 'src/database/PrismaService';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { UUIDv4 } from 'uuid-v4-validator';
import { ExitRoomDto } from './dto/exit-room.dto';

@Injectable()
export class RoomService {
    constructor(private prisma: PrismaService) {}

    async join(data: JoinRoomDto) {
        let room = await this.prisma.room.findFirst({
            where: {
                room_code: data.room_code,
            },
        });

        if (!room) {
            room = await this.prisma.room.create({
                data: {
                    room_adm_id: data.user_id,
                    room_code: data.room_code,
                },
            });
        }

        if (!room.active) {
            await this.prisma.room.update({
                where: {
                    id: room.id,
                },
                data: {
                    active: true,
                    room_adm_id: data.user_id,
                    updated_at: new Date(),
                },
            });
        }

        const userInRoom = await this.prisma.roomHasUsers.findFirst({
            where: {
                room_id: room.id,
                user_id: data.user_id,
            },
        });

        if (!userInRoom) {
            return this.prisma.roomHasUsers.create({
                data: {
                    user_id: data.user_id,
                    room_id: room.id,
                },
                select: {
                    room: {
                        include: {
                            matches: true,
                            room_adm: true,
                            users: true,
                        },
                    },
                },
            });
        }

        return this.prisma.roomHasUsers.update({
            where: {
                room_id_user_id: {
                    room_id: room.id,
                    user_id: data.user_id,
                },
            },
            data: {
                active: true,
                updated_at: new Date(),
            },
            select: {
                room: {
                    include: {
                        matches: true,
                        room_adm: true,
                        users: true,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.room.findMany({
            include: {
                room_adm: true,
                matches: true,
                users: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async findOne(id) {
        if (!UUIDv4.validate(id)) {
            throw new HttpException('Invalid id', 400);
        }
        const room = this.prisma.room.findFirst({
            where: {
                id: id,
            },
            include: {
                room_adm: true,
                matches: true,
                users: true,
            },
        });

        if (!room) {
            throw new HttpException('Room not found', 404);
        }
        return room;
    }

    async getPlayers(id) {
        if (!UUIDv4.validate(id)) {
            throw new HttpException('Invalid id', 400);
        }
        const room = this.prisma.room.findFirst({
            where: {
                id: id,
            },
            select: {
                room_adm: true,
                users: {
                    where: {
                        active: true,
                    },
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!room) {
            throw new HttpException('Room not found', 404);
        }
        return room;
    }

    async exit(data: ExitRoomDto) {
        const room = await this.prisma.room.findFirst({
            where: {
                id: data.room_id,
            },
            include: {
                users: {
                    where: {
                        active: true,
                    },
                },
            },
        });

        if (!room) {
            throw new HttpException('Room not found', 404);
        }

        if (!room.active) {
            throw new HttpException('Cannot exit of an inactive room', 400);
        }

        const player = await this.prisma.user.findFirst({
            where: {
                id: data.player_id,
            },
        });

        if (!player) {
            throw new HttpException('User not found', 404);
        }

        if (!player.active) {
            throw new HttpException('Inactive user', 400);
        }

        const userInRoom = await this.prisma.roomHasUsers.findFirst({
            where: {
                room_id: room.id,
                user_id: data.player_id,
            },
        });

        if (!userInRoom) {
            throw new HttpException('User never has joined the room', 400);
        }

        if (!userInRoom.active) {
            throw new HttpException('User is already out of the room', 400);
        }

        if (room.users.length == 1) {
            await this.prisma.room.update({
                where: {
                    id: room.id,
                },
                data: {
                    active: false,
                },
            });
        } else {
            if (room.room_adm_id == player.id) {
                const room_adm_id = room.users.filter((user) => user.user_id !== player.id)[0];
                await this.prisma.room.update({
                    where: {
                        id: room.id,
                    },
                    data: {
                        room_adm_id: room_adm_id.user_id,
                    },
                });
            }
        }

        return this.prisma.roomHasUsers.update({
            where: {
                room_id_user_id: {
                    room_id: room.id,
                    user_id: data.player_id,
                },
            },
            data: {
                active: false,
                updated_at: new Date(),
            },
            select: {
                room: {
                    include: {
                        matches: true,
                        room_adm: true,
                        users: true,
                    },
                },
            },
        });
    }

    async update(data: UpdateRoomDto) {
        const room_user = await this.prisma.roomHasUsers.findFirst({
            where: { room_id: data.room_id, user_id: data.player_id },
        });
        if (!data.entering) {
            if (!room_user) {
                throw new HttpException('This user or room does not exist', 404);
            }

            if (!room_user.active) {
                throw new HttpException('This user is already out of the room', 400);
            }
            await this.prisma.roomHasUsers.update({
                where: {
                    room_id_user_id: {
                        room_id: data.room_id,
                        user_id: data.player_id,
                    },
                },
                data: {
                    active: false,
                    updated_at: new Date(),
                },
            });

            return this.findOne(data.room_id);
        }

        if (room_user && room_user.active) {
            throw new HttpException('This user is already in the room', 409);
        }
        return this.prisma.roomHasUsers.create({
            data: {
                room_id: data.room_id,
                user_id: data.player_id,
            },
            select: {
                room: {
                    include: {
                        matches: true,
                        room_adm: true,
                        users: {
                            include: {
                                user: true,
                                room: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
