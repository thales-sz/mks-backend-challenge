import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { makeMockCustomer } from '../../test/factory/customer.factory';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a token string when called with right credentials', async () => {
    const signInParams = {
      email: 'email@email.com',
      password: 'password123',
    };

    jest.spyOn(service, 'signIn').mockResolvedValue('token-string');

    const response = await service.signIn(signInParams);

    expect(response).toEqual('token-string');
  });

  it('Should throw a NotFoundException when customer is not found', async () => {
    const signInParams = {
      email: 'email@email.com',
      password: 'password123',
    };

    jest.spyOn(service, 'signIn').mockRejectedValue(new NotFoundException());

    await expect(service.signIn(signInParams)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should throw a UnauthorizedException when a wrong password is provided', async () => {
    const signInParams = {
      email: 'email@email.com',
      password: 'wrongPass123',
    };

    jest
      .spyOn(service, 'signIn')
      .mockRejectedValue(new UnauthorizedException());

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

    jest.spyOn(service, 'signUp').mockRejectedValue(new ConflictException());

    await expect(service.signUp(signUpParams)).rejects.toThrow(
      ConflictException,
    );
  });

  it('Should be able to sign up a new Customer', async () => {
    const mockCustomer = makeMockCustomer();

    const signUpParams = {
      username: 'username',
      email: 'used-email@email.com',
      password: 'wrongPass123',
    };

    jest.spyOn(service, 'signUp').mockResolvedValue(mockCustomer);

    const response = await service.signUp(signUpParams);

    expect(response).toBe(mockCustomer);
  });
});
