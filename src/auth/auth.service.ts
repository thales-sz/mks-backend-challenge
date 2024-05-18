import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from './jwt.service';
import { Repository } from 'typeorm';
import { Customer } from '../database/models/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  protected logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<string> {
    const customer = await this.customerRepository.findOneBy({ email });

    if (!customer) {
      this.logger.error(`Customer not found for provided email: ${email}`);
      throw new NotFoundException('Customer not found for provided email');
    }

    const isPasswordValid = await this.jwtService.isPasswordValid(
      password,
      customer.password,
    );

    if (!isPasswordValid) {
      this.logger.error('Invalid password');
      throw new UnauthorizedException('Invalid password');
    }

    delete customer.password;

    return this.jwtService.generateToken(customer);
  }

  async signUp(signUpDto: SignUpDto): Promise<Customer> {
    await this.validateSignUpRequest(signUpDto);

    const hashedPassword = this.jwtService.encodePassword(signUpDto.password);

    const newCustomer = new Customer({
      ...signUpDto,
      password: hashedPassword,
    });

    return this.customerRepository.save(newCustomer);
  }

  async validateToken(token: string): Promise<Customer> {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        this.logger.error('Token expired');
        throw new ForbiddenException('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        this.logger.error('Invalid token');
        throw new UnauthorizedException('Invalid token');
      }
      this.logger.error(error);
      throw new Error(error);
    }
  }

  private async validateSignUpRequest({ email }: Pick<SignUpDto, 'email'>) {
    const user = await this.customerRepository.findOneBy({ email });

    if (user) throw new ConflictException('This email already exists.');
  }
}
