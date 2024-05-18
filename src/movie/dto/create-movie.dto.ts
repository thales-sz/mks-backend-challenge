import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 2000)
  description: string;

  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  duration: number;
}
