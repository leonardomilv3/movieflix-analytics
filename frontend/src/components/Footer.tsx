const Footer = () => {
  return (
    <footer className="bg-netflix-darkgray py-12 px-4 md:px-8 lg:px-16 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-netflix-red">MovieFlix Analytics</h3>
            <p className="text-gray-400 text-sm">
              Your comprehensive movie analytics platform powered by data insights.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/analytics" className="hover:text-white transition-colors">Analytics</a></li>
              <li><a href="/browse" className="hover:text-white transition-colors">Browse Movies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">About</h4>
            <p className="text-gray-400 text-sm">
              Built with React, TypeScript, and FastAPI for the DevOps ADA course project.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MovieFlix Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
