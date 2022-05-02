import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './coffee.entity';
import { Repository } from 'typeorm';
import { CreateCoffeeDto, UpdateCoffeeDto } from './coffee.dto';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeePository: Repository<Coffee>,
  ) {}

  findAll() {
    return this.coffeePository.find();
  }

  async findOne(id: number) {
    debugger;
    const coffee = await this.coffeePository.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeePository.create(createCoffeeDto);
    return this.coffeePository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    debugger;
    const coffee = await this.coffeePository.preload({
      id: +id,
      ...updateCoffeeDto,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeePository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeePository.remove(coffee);
  }
}
