import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../database/models/customer.entity';
import { Repository } from 'typeorm';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Movie } from '../database/models/movie.entity';

@Injectable()
export class CustomerService {
  protected logger: Logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
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
      this.logger.error('Customer not found');
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
      this.logger.error('Customer not found');
      throw new NotFoundException('Customer not found');
    }

    return this.customerRepository.softRemove(customer);
  }

  async addFavorite(customerId: string, movieId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({
      id: customerId,
    });

    if (!customer) {
      this.logger.error('Customer not found');
      throw new NotFoundException('Customer not found');
    }

    const movie = await this.movieRepository.findOneBy({ id: movieId });

    if (!movie) {
      this.logger.error('Movie not found');
      throw new NotFoundException('Movie not found');
    }

    customer.favoriteMovies.push(movie);

    return this.customerRepository.save(customer);
  }
}
