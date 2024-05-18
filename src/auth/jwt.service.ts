import { Injectable } from '@nestjs/common';
import { Customer } from '../database/models/customer.entity';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  public async generateToken(
    payload: Omit<Customer, 'password'>,
  ): Promise<string> {
    return this.jwtService.signAsync({ ...payload });
  }

  public isPasswordValid(
    password: string,
    customerPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, customerPassword);
  }

  public encodePassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public async verify(token: string): Promise<Customer> {
    return this.jwtService.verifyAsync<Customer>(token);
  }
}
