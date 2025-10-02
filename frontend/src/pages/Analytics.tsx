import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import { movieApi } from '../services/api';
import type { Movie } from '../types/movie';
import MovieDetailModal from '../components/MovieDetailModal';

const Analytics = () => {
  const { movies, loading, error } = useMovies(200);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefreshViews = async () => {
    setRefreshing(true);
    try {
      await movieApi.refreshMaterializedViews();
      window.location.reload();
    } catch (err) {
      console.error('Failed to refresh views:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async (movieId: number, rating: number, username: string) => {
    await movieApi.submitRating({
      movie_id: movieId,
      usuario: username,
      rating,
    });

    const updatedMovie = await movieApi.getMovie(movieId);
    setSelectedMovie(updatedMovie);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-netflix-red mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  const totalMovies = movies.length;
  const ratedMovies = movies.filter(m => m.qtd_avaliacoes > 0);
  const averageRating = ratedMovies.length > 0
    ? ratedMovies.reduce((sum, m) => sum + m.nota_media, 0) / ratedMovies.length
    : 0;
  const totalReviews = movies.reduce((sum, m) => sum + m.qtd_avaliacoes, 0);

  const top10Movies = [...movies]
    .filter(m => m.qtd_avaliacoes > 0)
    .sort((a, b) => {
      if (b.qtd_avaliacoes === a.qtd_avaliacoes) {
        return b.nota_media - a.nota_media;
      }
      return b.qtd_avaliacoes - a.qtd_avaliacoes;
    })
    .slice(0, 10);

  const comedyMovies = movies
    .filter(m => m.genero && m.genero.toLowerCase().includes('comedy') && m.qtd_avaliacoes > 0)
    .sort((a, b) => {
      if (b.qtd_avaliacoes === a.qtd_avaliacoes) {
        return b.nota_media - a.nota_media;
      }
      return b.qtd_avaliacoes - a.qtd_avaliacoes;
    })
    .slice(0, 10);

  const animationMovies = movies
    .filter(m => m.genero && m.genero.toLowerCase().includes('animation') && m.qtd_avaliacoes > 0)
    .sort((a, b) => {
      if (b.qtd_avaliacoes === a.qtd_avaliacoes) {
        return b.nota_media - a.nota_media;
      }
      return b.qtd_avaliacoes - a.qtd_avaliacoes;
    })
    .slice(0, 10);

  return (
    <>
      <div className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Analytics Dashboard</h1>
            <button
              onClick={handleRefreshViews}
              disabled={refreshing}
              className="bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded font-semibold transition-colors flex items-center space-x-2"
            >
              <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-netflix-darkgray p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Total Movies</p>
              <p className="text-4xl font-bold text-white">{totalMovies}</p>
            </div>

            <div className="bg-netflix-darkgray p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Total Reviews</p>
              <p className="text-4xl font-bold text-white">{totalReviews}</p>
            </div>

            <div className="bg-netflix-darkgray p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Average Rating</p>
              <p className="text-4xl font-bold text-white">{averageRating.toFixed(1)}</p>
            </div>

            <div className="bg-netflix-darkgray p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Rated Movies</p>
              <p className="text-4xl font-bold text-white">{ratedMovies.length}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-netflix-darkgray p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-netflix-red">Top 10 Movies</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">#</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Title</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Year</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Rating</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top10Movies.map((movie, idx) => (
                      <tr
                        key={movie.id}
                        onClick={() => handleMovieClick(movie)}
                        className="border-b border-gray-800 hover:bg-netflix-gray cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-2 text-netflix-red font-bold">{idx + 1}</td>
                        <td className="py-3 px-2">{movie.titulo}</td>
                        <td className="py-3 px-2 text-gray-400">{movie.ano_lancamento}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{movie.nota_media.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-400">{movie.qtd_avaliacoes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {comedyMovies.length > 0 && (
              <div className="bg-netflix-darkgray p-6 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-netflix-red">Top Comedy Movies</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">#</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">Title</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">Year</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">Rating</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">Reviews</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comedyMovies.map((movie, idx) => (
                        <tr
                          key={movie.id}
                          onClick={() => handleMovieClick(movie)}
                          className="border-b border-gray-800 hover:bg-netflix-gray cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-2 text-netflix-red font-bold">{idx + 1}</td>
                          <td className="py-3 px-2">{movie.titulo}</td>
                          <td className="py-3 px-2 text-gray-400">{movie.ano_lancamento}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>{movie.nota_media.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-400">{movie.qtd_avaliacoes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {animationMovies.length > 0 && (
              <div className="bg-netflix-darkgray p-6 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-netflix-red">Top Animation Movies</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">#</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">Title</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">Year</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">Rating</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-semibold">Reviews</th>
                      </tr>
                    </thead>
                    <tbody>
                      {animationMovies.map((movie, idx) => (
                        <tr
                          key={movie.id}
                          onClick={() => handleMovieClick(movie)}
                          className="border-b border-gray-800 hover:bg-netflix-gray cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-2 text-netflix-red font-bold">{idx + 1}</td>
                          <td className="py-3 px-2">{movie.titulo}</td>
                          <td className="py-3 px-2 text-gray-400">{movie.ano_lancamento}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>{movie.nota_media.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-400">{movie.qtd_avaliacoes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRatingSubmit={handleRatingSubmit}
      />
    </>
  );
};

export default Analytics;
