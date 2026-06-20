import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CustomOrder from './pages/CustomOrder';
import Connect from './pages/Connect';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/custom-order" element={<CustomOrder />} />
        <Route path="/connect" element={<Connect />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
