import { Controller, Post, Body } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Customer } from '../database/entities/customer.entity';

type SignInResponse = {
  token: string;
};

type SignUpResponse = Customer;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    const token = await this.authService.signIn(signInDto);

    return { token };
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    const customer = await this.authService.signUp(signUpDto);

    return customer;
  }
}
