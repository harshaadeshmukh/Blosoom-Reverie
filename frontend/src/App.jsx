import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CollectionsPage from './pages/CollectionsPage';
import CustomOrder from './pages/CustomOrder';
import AboutPage from './pages/AboutPage';
import Connect from './pages/Connect';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/custom-order" element={<CustomOrder />} />
        <Route path="/our-story" element={<AboutPage />} />
        <Route path="/connect" element={<Connect />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
