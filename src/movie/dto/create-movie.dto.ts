import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Movie title' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  title: string;

  @ApiProperty({ example: 'Movie description' })
  @IsNotEmpty()
  @IsString()
  @Length(5, 2000)
  description: string;

  @ApiProperty({
    example: 1500,
    type: 'number',
    description: 'Duration in seconds',
  })
  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  duration: number;
}
