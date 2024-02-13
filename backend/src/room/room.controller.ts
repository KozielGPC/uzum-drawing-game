import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ExitRoomDto } from './dto/exit-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    async join(@Body() data: JoinRoomDto) {
        return this.roomService.join(data);
    }

    @Get('/:id/players')
    async getPlayers(@Param() param: { id: string }) {
        return this.roomService.getPlayers(param.id);
    }

    @Patch()
    async exit(@Body() data: ExitRoomDto) {
        return this.roomService.exit(data);
    }

    @Get()
    async findAll() {
        return this.roomService.findAll();
    }

    @Get('/:id')
    async findOne(@Param() param: { id: string }) {
        return this.roomService.findOne(param.id);
    }

    @Patch()
    async update(@Body() data: UpdateRoomDto) {
        return this.roomService.update(data);
    }
}
