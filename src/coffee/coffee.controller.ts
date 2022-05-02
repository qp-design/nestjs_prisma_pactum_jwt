import {
  Body,
  Controller,
  Param,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto, UpdateCoffeeDto } from './coffee.dto';

@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) {}

  @Get('/query')
  async findAll() {
    return await this.coffeeService.findAll();
  }

  @Get('/single-query')
  async find(@Query() id: number) {
    return await this.coffeeService.findOne(id);
  }

  @Post('/create')
  async create(@Body() createCoffee: CreateCoffeeDto) {
    return await this.coffeeService.create(createCoffee);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: number) {
    return await this.coffeeService.remove(id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() updateCoffee: UpdateCoffeeDto) {
    debugger;
    return await this.coffeeService.update(id, updateCoffee);
  }
}
