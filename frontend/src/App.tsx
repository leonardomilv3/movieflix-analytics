import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Browse from './pages/Browse';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
