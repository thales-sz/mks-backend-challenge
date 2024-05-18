import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Movie } from '../database/models/movie.entity';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiCreatedResponse({
    description: 'Created Sucessfully',
    type: Movie,
    isArray: false,
  })
  @ApiBearerAuth()
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @ApiOkResponse({ description: 'Movie List', type: Movie, isArray: true })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @ApiOkResponse({ description: 'Single Movie', type: Movie })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @ApiOkResponse({ description: 'Updated Movie', type: Movie })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(id, updateMovieDto);
  }

  @ApiOkResponse({ description: 'Deleted Movie', type: Movie })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
