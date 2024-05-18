import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from './jwt.service';
import { Repository } from 'typeorm';
import { Customer } from '../database/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<string> {
    const customer = await this.customerRepository.findOneBy({ email });

    if (!customer) {
      throw new NotFoundException('Customer not found for provided email');
    }

    if (!this.jwtService.isPasswordValid(password, customer.password)) {
      throw new UnauthorizedException('Invalid password');
    }

    delete customer.password;

    return this.jwtService.generateToken(customer);
  }

  async signUp(signUpDto: SignUpDto): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({
      email: signUpDto.email,
    });

    if (customer) {
      throw new UnauthorizedException('This email is already in use');
    }

    const hashPassword = this.jwtService.encodePassword(signUpDto.password);

    const newCustomer = new Customer({
      ...signUpDto,
      password: hashPassword,
    });

    return this.customerRepository.save(newCustomer);
  }

  async validateToken(token: string): Promise<Customer> {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ForbiddenException('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw new Error(error);
    }
  }
}
