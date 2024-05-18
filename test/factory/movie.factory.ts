import { Movie } from '../../src/database/models/movie.entity';

export function makeMockMovie(): Movie {
  return new Movie({
    id: '46278856-590c-4307-9bc0-2f4e2dc76065',
    title: 'Fake Movie Title',
    description: 'Fake Movie Description',
    duration: 1500,
    updatedAt: new Date(),
    createdAt: new Date(),
    deletedAt: null,
  });
}
