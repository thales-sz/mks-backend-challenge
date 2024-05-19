import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { makeMockCustomer } from '../../test/factory/customer.factory';

describe('AuthService', () => {
  let service: JwtService;
  let jwtService: NestJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestJwtService,
          useValue: {
            signAsync: jest.fn(),
            compare: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtService = module.get<NestJwtService>(NestJwtService);
    service = module.get<JwtService>(JwtService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a token string when called with right credentials', async () => {
    const mockCustomer = makeMockCustomer();

    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token-string');

    const response = await service.generateToken({
      ...mockCustomer,
    });

    expect(response).toEqual('token-string');
  });

  it('Should validate a password', async () => {
    const response = await service.isPasswordValid(
      'password',
      'wrong-password',
    );

    expect(response).toEqual(false);

    const hashedPassword = service.encodePassword('password');
    const response2 = await service.isPasswordValid('password', hashedPassword);

    expect(response).toEqual(false);
    expect(response2).toEqual(true);
  });

  it('Should encode a password', async () => {
    const response = service.encodePassword('password');

    expect(response).not.toBe('password');
  });

  it('Should verify a valid token', async () => {
    const mockCustomer = makeMockCustomer();
    const token = 'token-string';

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockCustomer);

    const response = await service.verify(token);
    expect(response).toBe(mockCustomer);
  });
});
