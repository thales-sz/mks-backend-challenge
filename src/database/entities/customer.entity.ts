import { Column, Entity, ManyToMany, Relation } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Movie } from './movie.entity';

@Entity({ name: 'customers' })
export class Customer extends AbstractEntity<Customer> {
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @ManyToMany(() => Movie, (movie) => movie.id, { cascade: true, eager: true })
  favoriteMovies: Relation<Movie[]>;
}
