import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../database/entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  protected logger: Logger = new Logger(MovieService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create({ title, description, duration }: CreateMovieDto) {
    const movie = await this.movieRepository.findOneBy({ title });

    if (movie) {
      this.logger.error('Movie already exists');
      throw new ConflictException('Movie already exists');
    }

    const newMovie = new Movie({ title, description, duration });

    return this.movieRepository.save(newMovie);
  }

  async findAll() {
    return this.movieRepository.find();
  }

  async findOne(id: string) {
    return this.movieRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      this.logger.error('Movie not found');
      throw new NotFoundException('Movie not found');
    }

    return this.movieRepository.save({
      ...movie,
      ...updateMovieDto,
    });
  }

  async remove(id: string) {
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      this.logger.error('Movie not found');
      throw new NotFoundException('Movie not found');
    }

    return this.movieRepository.softRemove(movie);
  }
}
