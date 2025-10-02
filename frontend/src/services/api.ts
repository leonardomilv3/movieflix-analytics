import axios from 'axios';
import type { Movie, MovieCreate, RatingCreate, RatingResponse, HealthResponse } from '../types/movie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log('API_BASE_URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = {
  health: async (): Promise<HealthResponse> => {
    const { data } = await apiClient.get<HealthResponse>('/health');
    return data;
  },

  listMovies: async (limit: number = 50, offset: number = 0): Promise<Movie[]> => {
    const { data } = await apiClient.get<Movie[]>('/movies', {
      params: { limit, offset },
    });
    console.log('API returned movies:', data);
    return data;
  },

  getMovie: async (movieId: number): Promise<Movie> => {
    const { data } = await apiClient.get<Movie>(`/movies/${movieId}`);
    return data;
  },

  createMovie: async (movie: MovieCreate): Promise<Movie> => {
    const { data } = await apiClient.post<Movie>('/movies', movie);
    return data;
  },

  submitRating: async (rating: RatingCreate): Promise<RatingResponse> => {
    const { data } = await apiClient.post<RatingResponse>('/ratings', rating);
    return data;
  },

  refreshMaterializedViews: async (): Promise<{ refreshed: boolean }> => {
    const { data } = await apiClient.post<{ refreshed: boolean }>('/admin/refresh-materialized-views');
    return data;
  },
};

export default apiClient;
