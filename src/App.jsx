import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Futebol from './pages/Futebol';
import Modalidades from './pages/Modalidades';
import Historia from './pages/Historia';
import Loja from './pages/Loja';     // <--- NOVO
import Socio from './pages/Socio';   // <--- NOVO
import Admin from './pages/Admin';
import Footer from './components/Footer';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="bg-gray-50 min-h-screen font-sans text-vcl-black">
          {/* Navbar Fixa no topo */}
          <Navbar />

          {/* Conteúdo das Páginas */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/futebol" element={<Futebol />} />
            <Route path="/modalidades" element={<Modalidades />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/socio" element={<Socio />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;