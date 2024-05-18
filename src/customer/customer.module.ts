import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { AuthModule } from '../auth/auth.module';
import { Customer } from '../database/models/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../database/models/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Movie]), AuthModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
