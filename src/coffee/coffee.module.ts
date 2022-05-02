import { Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './coffee.entity';
import { CoffeeService } from './coffee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee])],
  controllers: [CoffeeController],
  providers: [CoffeeService],
})
export class CoffeeModule {}
