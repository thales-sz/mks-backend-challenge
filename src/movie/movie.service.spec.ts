import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { makeMockMovie } from '../../test/factory/movie.factory';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../database/models/movie.entity';
import { repositoryMockFactory } from '../../test/factory/repository.factory';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('MovieService', () => {
  let service: MovieService;
  let movieRepository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepository = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a new movie when created with right data', async () => {
    const mockMovie = makeMockMovie();

    const createMovieParams = {
      title: 'Movie Title',
      description: 'Movie Description',
      duration: 120,
    };

    jest.spyOn(movieRepository, 'save').mockResolvedValue(mockMovie);

    const response = await service.create(createMovieParams);

    expect(response).toEqual(mockMovie);
  });

  it('Should return a list of movies', async () => {
    const mockMovie = makeMockMovie();

    jest
      .spyOn(movieRepository, 'find')
      .mockResolvedValue([mockMovie, mockMovie]);

    const response = await service.findAll();

    expect(response).toEqual([mockMovie, mockMovie]);
  });

  it('Should return a movie', async () => {
    const mockMovie = makeMockMovie();

    jest.spyOn(movieRepository, 'findOne').mockResolvedValue(mockMovie);

    const response = await service.findOne('1');

    expect(response).toEqual(mockMovie);
  });

  it('Should return a updated movie', async () => {
    const mockMovie = makeMockMovie();

    const updateMovieParams = {
      title: 'Movie Title',
      description: 'Movie Description',
      duration: 120,
    };

    jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(mockMovie);
    jest.spyOn(movieRepository, 'save').mockResolvedValue(mockMovie);

    const response = await service.update('1', updateMovieParams);

    expect(response).toEqual(mockMovie);
  });

  it('Should throw NotFoundExeception when movie is not found', async () => {
    const updateMovieParams = {
      title: 'New Movie Title',
      description: 'New Movie Description',
      duration: 120,
    };

    jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.update('1', updateMovieParams)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should throw ConflictExeception when movie is already created', async () => {
    const movieParams = {
      title: 'New Movie Title',
      description: 'New Movie Description',
      duration: 120,
    };

    jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(makeMockMovie());

    await expect(service.create(movieParams)).rejects.toThrow(
      ConflictException,
    );
  });

  it('Should throw NotFoundExeception when trying to find a single movie with the wrogn id', async () => {
    jest.spyOn(movieRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('wrong-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should soft delete a movie', async () => {
    const mockMovie = makeMockMovie();

    jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(mockMovie);
    jest.spyOn(movieRepository, 'softRemove').mockResolvedValue(mockMovie);

    const response = await service.remove('123');

    expect(response).toBe(mockMovie);
  });

  it('Should throw NotFoundExeception when trying to remove a movie that does not exist', async () => {
    jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.remove('wrong-id')).rejects.toThrow(NotFoundException);
  });
});
