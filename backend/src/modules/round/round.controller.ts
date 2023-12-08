import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoundService } from './round.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { UpdateRoundDto } from './dto/update-round.dto';

@Controller('round')
export class RoundController {
    constructor(private readonly roundService: RoundService) {}

    @Post()
    create(@Body() createRoundDto: CreateRoundDto) {
        return this.roundService.create(createRoundDto);
    }

    @Get()
    findAll() {
        return this.roundService.findAll();
    }

    @Patch('/update')
    update(@Body() data: UpdateRoundDto) {
        return this.roundService.update(data);
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.roundService.findOne(+id);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.roundService.remove(+id);
    // }
}
