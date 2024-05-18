import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  Relation,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Movie } from './movie.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'customers' })
export class Customer extends AbstractEntity<Customer> {
  @ApiProperty()
  @Column({ nullable: false })
  username: string;

  @ApiProperty()
  @Index()
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ isArray: true, type: Movie })
  @ManyToMany(() => Movie, (movie) => movie.id, { cascade: true, eager: true })
  @JoinTable()
  favoriteMovies: Relation<Movie[]>;
}
