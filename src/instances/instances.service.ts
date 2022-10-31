import { Injectable } from '@nestjs/common';
import { CreateInstanceDto } from 'src/instances/dto';

@Injectable()
export class InstancesService {
  async create(createInstanceDto: CreateInstanceDto) {
    console.log(createInstanceDto);
  }
}
