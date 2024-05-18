import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../database/entities/customer.entity';
import { Repository } from 'typeorm';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    return this.customerRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.customerRepository.save({
      ...customer,
      ...updateCustomerDto,
    });
  }

  async remove(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.customerRepository.softRemove(customer);
  }
}
