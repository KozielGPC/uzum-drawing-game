import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LogoffDto } from './dto/logoff.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async login(@Body() data: LoginDto) {
        return this.userService.create(data);
    }

    @Patch()
    async logoff(@Body() data: LogoffDto) {
        return this.userService.logoff(data);
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get('/:id')
    async findOne(@Param() param: { id: string }) {
        return this.userService.findOne(param.id);
    }

    @Post('/logout-all')
    async logoutAllPlayers() {
        return this.userService.logoutAllPlayers();
    }
}
