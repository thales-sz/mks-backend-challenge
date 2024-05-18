import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { makeMockCustomer } from '../../test/factory/customer.factory';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Sign In', () => {
    it('Should return a token when signed in with right credentials', async () => {
      const signInParams = {
        email: 'email@email.com',
        password: 'password123',
      };

      jest
        .spyOn(controller, 'signIn')
        .mockResolvedValue({ token: 'token-string' });

      const response = await controller.signIn(signInParams);

      expect(response).toEqual({ token: 'token-string' });
    });
  });

  describe('Sign Up', () => {
    it('Should return a new customer when signed up with right credentials', async () => {
      const mockCustomer = makeMockCustomer();

      const signUpParams = {
        username: 'username',
        email: 'email@email.com',
        password: 'password123',
      };

      jest.spyOn(controller, 'signUp').mockResolvedValue(mockCustomer);

      const response = await controller.signUp(signUpParams);

      expect(response).toEqual(mockCustomer);
    });
  });
});
