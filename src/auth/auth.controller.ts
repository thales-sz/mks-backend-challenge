import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Customer } from '../database/entities/customer.entity';
import { Public } from './config/metadata';

type SignInResponse = {
  token: string;
};

type SignUpResponse = Customer;

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
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
