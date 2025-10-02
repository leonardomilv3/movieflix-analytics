import { useState } from 'react';
import type { Movie } from '../types/movie';
import { useMovies } from '../hooks/useMovies';
import { movieApi } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieCarousel from '../components/MovieCarousel';
import MovieDetailModal from '../components/MovieDetailModal';

const Home = () => {
  const { movies, loading, error } = useMovies(100);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <p className="text-gray-400 mt-2">Please make sure the API is running</p>
        </div>
      </div>
    );
  }

  const featuredMovie = movies.find(m => m.qtd_avaliacoes > 0) || movies[0];

  const topRatedMovies = [...movies]
    .filter(m => m.nota_media > 0)
    .sort((a, b) => b.nota_media - a.nota_media)
    .slice(0, 20);

  const recentMovies = [...movies]
    .sort((a, b) => b.ano_lancamento - a.ano_lancamento)
    .slice(0, 20);

  const actionMovies = movies.filter(m => m.genero && m.genero.toLowerCase().includes('action')).slice(0, 20);
  const comedyMovies = movies.filter(m => m.genero && m.genero.toLowerCase().includes('comedy')).slice(0, 20);
  const dramaMovies = movies.filter(m => m.genero && m.genero.toLowerCase().includes('drama')).slice(0, 20);

  return (
    <>
      <HeroBanner
        movie={featuredMovie}
        onPlayClick={() => handleMovieClick(featuredMovie)}
      />

      <div className="py-8">
        {topRatedMovies.length > 0 && (
          <MovieCarousel
            title="Top Rated Movies"
            movies={topRatedMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        {recentMovies.length > 0 && (
          <MovieCarousel
            title="Recent Releases"
            movies={recentMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        {actionMovies.length > 0 && (
          <MovieCarousel
            title="Action Movies"
            movies={actionMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        {comedyMovies.length > 0 && (
          <MovieCarousel
            title="Comedy Movies"
            movies={comedyMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        {dramaMovies.length > 0 && (
          <MovieCarousel
            title="Drama Movies"
            movies={dramaMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        <MovieCarousel
          title="All Movies"
          movies={movies.slice(0, 30)}
          onMovieClick={handleMovieClick}
        />
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

export default Home;
