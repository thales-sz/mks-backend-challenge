import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from '../../auth/dto/sign-up.dto';

export class UpdateCustomerDto extends PartialType(SignUpDto) {}
