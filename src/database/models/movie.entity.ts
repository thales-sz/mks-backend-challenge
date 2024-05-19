import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'movies' })
export class Movie extends AbstractEntity<Movie> {
  @ApiProperty()
  @Index()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Column({ nullable: false })
  description: string;

  @ApiProperty()
  @Column({ nullable: false })
  duration: number;
}
