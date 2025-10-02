import type { Movie } from '../types/movie';

interface HeroBannerProps {
  movie?: Movie;
  onPlayClick?: () => void;
}

const HeroBanner = ({ movie, onPlayClick }: HeroBannerProps) => {
  if (!movie) {
    return (
      <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center bg-gradient-to-r from-netflix-darkgray to-netflix-gray">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">MovieFlix Analytics</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover, rate, and analyze thousands of movies with comprehensive analytics
          </p>
        </div>
      </div>
    );
  }

  const genres = movie.genero ? movie.genero.split(',').slice(0, 3) : [];

  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-darkgray via-netflix-darkgray/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />

      <div className="relative h-full flex items-center px-4 md:px-8 lg:px-16 max-w-7xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
            {movie.titulo}
          </h1>

          <div className="flex items-center space-x-4 mb-6 text-sm md:text-base">
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

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="bg-netflix-red bg-opacity-80 px-3 py-1 rounded text-sm font-medium"
                >
                  {genre.trim()}
                </span>
              ))}
            </div>
          )}

          {movie.diretor && (
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Director:</span> {movie.diretor}
            </p>
          )}

          {onPlayClick && (
            <button
              onClick={onPlayClick}
              className="mt-6 bg-white text-black px-8 py-3 rounded font-bold text-lg hover:bg-opacity-80 transition-all flex items-center space-x-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              <span>View Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
