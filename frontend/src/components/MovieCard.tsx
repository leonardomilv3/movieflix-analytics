import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const genres = movie.genero ? movie.genero.split(',').slice(0, 2) : [];

  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 w-48 md:w-56 cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative aspect-[2/3] bg-netflix-gray rounded-md overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-1">
            {movie.titulo}
          </h3>

          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <span>{movie.ano_lancamento}</span>
            {movie.nota_media > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.nota_media.toFixed(1)}
                </span>
              </>
            )}
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-netflix-red bg-opacity-70 px-2 py-0.5 rounded"
                >
                  {genre.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-netflix-red opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black bg-opacity-70 rounded-full p-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
