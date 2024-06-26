import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { makeMockCustomer } from '../../test/factory/customer.factory';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            addFavorite: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return a list of customers', async () => {
    const mockCustomer = makeMockCustomer();

    jest
      .spyOn(service, 'findAll')
      .mockResolvedValue([mockCustomer, mockCustomer]);

    const response = await controller.findAll();

    expect(response).toEqual([mockCustomer, mockCustomer]);
  });

  it('Should return a customer', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(service, 'findOne').mockResolvedValue(mockCustomer);

    const response = await controller.findOne('id');

    expect(response).toEqual(mockCustomer);
  });

  it('Should return a customer when updated', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(service, 'update').mockResolvedValue(mockCustomer);

    const response = await controller.update('id', mockCustomer);

    expect(response).toEqual(mockCustomer);
  });

  it('Should return a customer when removed', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(service, 'remove').mockResolvedValue(mockCustomer);

    const response = await controller.remove('id');

    expect(response).toEqual(mockCustomer);
  });

  it('Should favorite a movie', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(service, 'addFavorite').mockResolvedValue(mockCustomer);

    const response = await controller.addFavorite('id', 'idMovie');

    expect(response).toEqual(mockCustomer);
  });
});
