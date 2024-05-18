import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Customer } from '../database/models/customer.entity';
import { Public } from './config/metadata';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

class SignInResponse {
  @ApiProperty()
  token: string;
}

type SignUpResponse = Customer;

@ApiTags('Authorization')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponse })
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    const token = await this.authService.signIn(signInDto);

    return { token };
  }

  @Post('signup')
  @ApiCreatedResponse({ description: 'Created', type: Customer })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.authService.signUp(signUpDto);
  }
}
