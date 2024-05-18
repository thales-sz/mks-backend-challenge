import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../database/models/movie.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
