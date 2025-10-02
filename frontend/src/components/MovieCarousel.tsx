import { useRef, useState } from 'react';
import type { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieCarousel = ({ title, movies, onMovieClick }: MovieCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="relative group mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-8 lg:px-16">
        {title}
      </h2>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all px-2 md:px-4 opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto space-x-4 px-4 md:px-8 lg:px-16 scrollbar-hide pb-4"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => onMovieClick(movie)}
            />
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all px-2 md:px-4 opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCarousel;
