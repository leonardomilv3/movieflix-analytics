const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-black">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-netflix-red rounded-full opacity-25"></div>
          <div className="absolute inset-0 border-4 border-netflix-red rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
