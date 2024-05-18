import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

@Entity({ name: 'movies' })
export class Movie extends AbstractEntity<Movie> {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  duration: number;
}
