import { useState, useMemo } from 'react';
import type { Movie } from '../types/movie';
import { useMovies } from '../hooks/useMovies';
import { movieApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';

const Browse = () => {
  const { movies, loading, error } = useMovies(200);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'rating'>('title');

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

  const genres = useMemo(() => {
    const allGenres = new Set<string>();
    movies.forEach((movie) => {
      if (movie.genero) {
        movie.genero.split(',').forEach((g) => allGenres.add(g.trim()));
      }
    });
    return Array.from(allGenres).sort();
  }, [movies]);

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies.filter((movie) => {
      const matchesSearch = movie.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre =
        !selectedGenre ||
        (movie.genero && movie.genero.toLowerCase().includes(selectedGenre.toLowerCase()));
      return matchesSearch && matchesGenre;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.titulo.localeCompare(b.titulo);
        case 'year':
          return b.ano_lancamento - a.ano_lancamento;
        case 'rating':
          if (b.nota_media === a.nota_media) {
            return b.qtd_avaliacoes - a.qtd_avaliacoes;
          }
          return b.nota_media - a.nota_media;
        default:
          return 0;
      }
    });

    return filtered;
  }, [movies, searchTerm, selectedGenre, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-netflix-red mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movies...</p>
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

  return (
    <>
      <div className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Browse Movies</h1>

          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red transition-colors"
              />
            </div>

            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full md:w-48 bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-netflix-red transition-colors"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'year' | 'rating')}
              className="w-full md:w-48 bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-netflix-red transition-colors"
            >
              <option value="title">Sort by Title</option>
              <option value="year">Sort by Year</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          {(searchTerm || selectedGenre) && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400">
                {filteredAndSortedMovies.length} movie{filteredAndSortedMovies.length !== 1 ? 's' : ''} found
              </p>
              {(searchTerm || selectedGenre) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenre('');
                  }}
                  className="text-netflix-red hover:text-red-400 text-sm font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {filteredAndSortedMovies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No movies found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAndSortedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
              ))}
            </div>
          )}
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

export default Browse;
