import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { makeMockCustomer } from '../../test/factory/customer.factory';
import { Repository } from 'typeorm';
import { Customer } from '../database/models/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../test/factory/repository.factory';
import { JwtService } from './jwt.service';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let customerRepository: Repository<Customer>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            generateToken: jest.fn(),
            isPasswordValid: jest.fn(),
            encodePassword: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Customer),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    customerRepository = module.get(getRepositoryToken(Customer));
    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a token string when called with right credentials', async () => {
    const mockCustomer = makeMockCustomer();
    const signInParams = {
      email: 'email@email.com',
      password: 'password123',
    };

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(mockCustomer);
    jest.spyOn(jwtService, 'isPasswordValid').mockResolvedValue(true);
    jest.spyOn(jwtService, 'generateToken').mockResolvedValue('token-string');

    const response = await service.signIn(signInParams);

    expect(response).toEqual('token-string');
  });

  it('Should throw a NotFoundException when customer is not found', async () => {
    const signInParams = {
      email: 'email@email.com',
      password: 'password123',
    };

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.signIn(signInParams)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should throw a UnauthorizedException when a wrong password is provided', async () => {
    const mockCustomer = makeMockCustomer();
    const signInParams = {
      email: 'email@email.com',
      password: 'password123',
    };

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(mockCustomer);
    jest.spyOn(jwtService, 'isPasswordValid').mockResolvedValue(false);

    await expect(service.signIn(signInParams)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('Should throw a ConflictException when try to sign up with an already used email', async () => {
    const signUpParams = {
      username: 'username',
      email: 'used-email@email.com',
      password: 'wrongPass123',
    };

    jest
      .spyOn(customerRepository, 'findOneBy')
      .mockResolvedValue(makeMockCustomer());

    await expect(service.signUp(signUpParams)).rejects.toThrow(
      ConflictException,
    );
  });

  it('Should be able to sign up a new Customer', async () => {
    const mockCustomer = makeMockCustomer();

    const signUpParams = {
      username: 'username',
      email: 'used-email@email.com',
      password: 'Pass123',
    };

    jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(customerRepository, 'save').mockResolvedValue(mockCustomer);
    jest.spyOn(jwtService, 'encodePassword').mockReturnValue('hashedPassword');

    const response = await service.signUp(signUpParams);

    expect(response).toBe(mockCustomer);
  });

  it('Should throw UnauthorizedException with a invalid token', async () => {
    const token = 'token-string';

    jest
      .spyOn(jwtService, 'verify')
      .mockRejectedValue(new JsonWebTokenError('Invalid token'));

    await expect(service.validateToken(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('Should throw ForbiddenException with a expired token', async () => {
    const token = 'token-string';

    jest
      .spyOn(jwtService, 'verify')
      .mockRejectedValue(new TokenExpiredError('Expired token', new Date()));

    await expect(service.validateToken(token)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('Should throw Error with a unexpected token', async () => {
    const token = 'token-string';

    jest.spyOn(jwtService, 'verify').mockRejectedValue(new Error());

    await expect(service.validateToken(token)).rejects.toThrow(Error);
  });
});
