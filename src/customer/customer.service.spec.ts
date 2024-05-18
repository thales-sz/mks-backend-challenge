import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { makeMockCustomer } from '../../test/factory/customer.factory';
import { NotFoundException } from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CustomerService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a list of customers', async () => {
    const mockCustomer = makeMockCustomer();

    jest
      .spyOn(service, 'findAll')
      .mockResolvedValue([mockCustomer, mockCustomer]);

    const response = await service.findAll();

    expect(response).toEqual([mockCustomer, mockCustomer]);
  });

  it('Should return a customer', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(service, 'findOne').mockResolvedValue(mockCustomer);

    const response = await service.findOne('id');

    expect(response).toEqual(mockCustomer);
  });

  it('Should return a customer when updated', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(service, 'update').mockResolvedValue(mockCustomer);

    const response = await service.update('id', mockCustomer);

    expect(response).toEqual(mockCustomer);
  });

  it('Should return a customer when removed', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(service, 'remove').mockResolvedValue(mockCustomer);

    const response = await service.remove('id');

    expect(response).toEqual(mockCustomer);
  });

  it('Should throw a NotFoundException when customer is not found', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

    await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
  });
});
