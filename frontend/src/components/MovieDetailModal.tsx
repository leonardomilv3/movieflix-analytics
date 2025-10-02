import { useEffect } from 'react';
import type { Movie } from '../types/movie';
import StarRating from './StarRating';

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onRatingSubmit: (movieId: number, rating: number, username: string) => Promise<void>;
}

const MovieDetailModal = ({ movie, isOpen, onClose, onRatingSubmit }: MovieDetailModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const genres = movie.genero ? movie.genero.split(',') : [];
  const countries = movie.pais ? movie.pais.split(',') : [];
  const actors = movie.atores ? movie.atores.split(',') : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-netflix-darkgray rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-64 md:h-80 bg-gradient-to-r from-netflix-gray to-netflix-darkgray">
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-darkgray via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{movie.titulo}</h2>
            <div className="flex items-center space-x-4 text-sm md:text-base">
              {movie.nota_media > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{movie.nota_media.toFixed(1)}</span>
                </div>
              )}
              <span>{movie.ano_lancamento}</span>
              {movie.qtd_avaliacoes > 0 && (
                <span className="text-gray-300">{movie.qtd_avaliacoes} reviews</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Details</h3>

              {movie.diretor && (
                <div className="mb-3">
                  <span className="text-gray-400">Director:</span>
                  <p className="text-white">{movie.diretor}</p>
                </div>
              )}

              {genres.length > 0 && (
                <div className="mb-3">
                  <span className="text-gray-400">Genres:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {genres.map((genre, idx) => (
                      <span
                        key={idx}
                        className="bg-netflix-red bg-opacity-70 px-3 py-1 rounded text-sm"
                      >
                        {genre.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {countries.length > 0 && (
                <div className="mb-3">
                  <span className="text-gray-400">Countries:</span>
                  <p className="text-white">{countries.map(c => c.trim()).join(', ')}</p>
                </div>
              )}
            </div>

            <div>
              {actors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-200">Cast</h3>
                  <ul className="space-y-1">
                    {actors.slice(0, 5).map((actor, idx) => (
                      <li key={idx} className="text-gray-300">
                        {actor.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Rate This Movie</h3>
            <StarRating
              movieId={movie.id}
              onSubmit={onRatingSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
