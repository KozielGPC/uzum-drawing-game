import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Post()
    async create(@Body() data: CreateMatchDto) {
        return this.matchService.create(data);
    }

    @Get()
    async findAll() {
        return this.matchService.findAll();
    }

    @Get(':match_id/rounds')
    findRoundsOfMatch(@Param('match_id') match_id: string) {
        return this.matchService.findRoundsOfMatch(match_id);
    }
}
