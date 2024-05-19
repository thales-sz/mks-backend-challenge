import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { makeMockCustomer } from '../../test/factory/customer.factory';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from '../database/models/customer.entity';
import { repositoryMockFactory } from '../../test/factory/repository.factory';
import { Repository } from 'typeorm';
import { Movie } from '../database/models/movie.entity';
import { makeMockMovie } from '../../test/factory/movie.factory';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: Repository<Customer>;
  let movieRepository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Movie),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    movieRepository = module.get(getRepositoryToken(Movie));
    customerRepository = module.get(getRepositoryToken(Customer));
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a list of customers', async () => {
    const mockCustomer = makeMockCustomer();

    jest
      .spyOn(customerRepository, 'find')
      .mockResolvedValue([mockCustomer, mockCustomer]);

    const response = await service.findAll();

    expect(response).toEqual([mockCustomer, mockCustomer]);
  });

  it('Should return a customer', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(mockCustomer);

    const response = await service.findOne('id');

    expect(response).toEqual(mockCustomer);
  });

  it('Should return a customer when updated', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(mockCustomer);
    jest.spyOn(customerRepository, 'save').mockResolvedValue(mockCustomer);

    const response = await service.update('id', mockCustomer);

    expect(response).toEqual(mockCustomer);
  });

  it('Should return a customer when removed', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(mockCustomer);
    jest
      .spyOn(customerRepository, 'softRemove')
      .mockResolvedValue(mockCustomer);

    const response = await service.remove('id');

    expect(response).toEqual(mockCustomer);
  });

  it('Should throw a NotFoundException when trying to remove a not found customer', async () => {
    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.remove('id')).rejects.toThrow(NotFoundException);
  });

  it('Should throw a NotFoundException when trying to update a not found customer', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.update('id', mockCustomer)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should add a movie to the favorites', async () => {
    const mockCustomer = makeMockCustomer();
    const movieMock = makeMockMovie();

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(mockCustomer);
    jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(movieMock);
    jest.spyOn(customerRepository, 'save').mockResolvedValue(mockCustomer);

    const response = await service.addFavorite('id', 'idMovie');

    expect(response).toEqual(mockCustomer);
  });

  it('Should throw a NotFoundException when trying to add to favorites a not found customer', async () => {
    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.addFavorite('id', 'idMovie')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should throw a NotFoundException when trying to add to favorites a not found movie', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(mockCustomer);
    jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.addFavorite('id', 'idMovie')).rejects.toThrow(
      NotFoundException,
    );
  });
});
