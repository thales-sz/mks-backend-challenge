import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { makeMockMovie } from '../../test/factory/movie.factory';

describe('MovieController', () => {
  let controller: MovieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create', () => {
    it('Should return a new movie when created with right data', async () => {
      const mockMovie = makeMockMovie();
      const createParams = {
        title: 'Movie Title',
        description: 'Movie Description',
        duration: 120,
      };

      jest.spyOn(controller, 'create').mockResolvedValue(mockMovie);

      const response = await controller.create(createParams);

      expect(response).toEqual(mockMovie);
    });
  });

  describe('Find All', () => {
    it('Should return a list of movies', async () => {
      const mockMovie = makeMockMovie();

      jest.spyOn(controller, 'findAll').mockResolvedValue([mockMovie]);

      const response = await controller.findAll();

      expect(response).toEqual([mockMovie]);
    });
  });

  describe('Find One', () => {
    it('Should return a movie when found by id', async () => {
      const mockMovie = makeMockMovie();
      const movieId = '1';

      jest.spyOn(controller, 'findOne').mockResolvedValue(mockMovie);

      const response = await controller.findOne(movieId);

      expect(response).toEqual(mockMovie);
    });
  });

  describe('Update', () => {
    it('Should return a updated movie when updated with right data', async () => {
      const mockMovie = makeMockMovie();
      const movieId = '1';
      const updateParams = {
        title: 'Movie Title',
        description: 'Movie Description',
        duration: 120,
      };

      jest.spyOn(controller, 'update').mockResolvedValue(mockMovie);

      const response = await controller.update(movieId, updateParams);

      expect(response).toEqual(mockMovie);
    });
  });

  describe('Remove', () => {
    it('Should return a removed movie when removed by id', async () => {
      const mockMovie = makeMockMovie();
      const movieId = '1';

      jest.spyOn(controller, 'remove').mockResolvedValue(mockMovie);

      const response = await controller.remove(movieId);

      expect(response).toEqual(mockMovie);
    });
  });
});
