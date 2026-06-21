import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Connect = lazy(() => import('./pages/Connect'));

export default function App() {
  // Preload routes in the background after the initial render so page transitions are instantly fast!
  useEffect(() => {
    import('./pages/CustomOrder');
    import('./pages/Connect');
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-rose-muted/20 border-t-rose-muted animate-spin"></div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/connect" element={<Connect />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}
