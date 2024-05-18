import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Username', minLength: 4, maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  username: string;

  @ApiProperty({ example: 'email@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password#123', minLength: 5, maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  password: string;
}
