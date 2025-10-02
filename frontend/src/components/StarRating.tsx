import { useState } from 'react';

interface StarRatingProps {
  movieId: number;
  onSubmit: (movieId: number, rating: number, username: string) => Promise<void>;
}

const StarRating = ({ movieId, onSubmit }: StarRatingProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(movieId, rating, username.trim());
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setUsername('');
      }, 3000);
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-4 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-400 font-semibold">Rating submitted successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <svg
                className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-600'
                }`}
                fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <span className="text-gray-300 ml-2">{rating} / 5</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full bg-netflix-gray border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red transition-colors"
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </form>
  );
};

export default StarRating;
