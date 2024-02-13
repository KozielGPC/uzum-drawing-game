import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateRoundDto } from './dto/create-round.dto';
import { UpdateRoundDto } from './dto/update-round.dto';

@Injectable()
export class RoundService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateRoundDto) {
        const match = await this.prisma.match.findFirst({
            where: { id: data.match_id },
        });
        return this.prisma.round.create({
            data: {
                content: data.content,
                type: data.type,
                match_id: data.match_id,
                receiver_id: data.receiver_id,
                sender_id: data.sender_id,
            },
        });
    }

    async findAll() {
        return this.prisma.round.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    // findOne(id: number) {
    //   return `This action returns a #${id} round`;
    // }

    async update(data: UpdateRoundDto) {
        const round = await this.prisma.round.findFirst({
            where: {
                match_id: data.match_id,
                sender_id: data.sender_id,
            },
        });

        if (!round) {
        }

        return this.prisma.round.update({
            where: {
                id: round.id,
            },
            data: {
                content: data.content,
            },
        });
    }

    // remove(id: number) {
    //   return `This action removes a #${id} round`;
    // }
}
