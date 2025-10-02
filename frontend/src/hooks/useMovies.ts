import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';
import { movieApi } from '../services/api';

export const useMovies = (limit: number = 50, offset: number = 0) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieApi.listMovies(limit, offset);
        setMovies(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch movies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [limit, offset]);

  return { movies, loading, error };
};
