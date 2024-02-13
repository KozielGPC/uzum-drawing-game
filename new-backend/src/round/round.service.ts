import { Injectable } from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { UpdateRoundDto } from './dto/update-round.dto';

@Injectable()
export class RoundService {
  create(createRoundDto: CreateRoundDto) {
    return 'This action adds a new round';
  }

  findAll() {
    return `This action returns all round`;
  }

  findOne(id: number) {
    return `This action returns a #${id} round`;
  }

  update(id: number, updateRoundDto: UpdateRoundDto) {
    return `This action updates a #${id} round`;
  }

  remove(id: number) {
    return `This action removes a #${id} round`;
  }
}
