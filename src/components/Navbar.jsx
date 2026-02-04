import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/VCL.png'; // Confirma se o caminho está correto

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Futebol', path: '/futebol' },
    { name: 'Modalidades', path: '/modalidades' },
    { name: 'História', path: '/historia' },
    { name: 'Loja', path: '/loja' },
  ];

  return (
    // ALTERAÇÃO AQUI: 'border-black' em vez de 'border-red-800'
    <nav className="bg-[#df0000] text-white sticky top-0 z-50 shadow-lg border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO E NOME */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="VCL Logo" className="h-14 w-auto transition-transform group-hover:scale-105 drop-shadow-md" />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wide leading-none text-white">VITÓRIA</span>
              <span className="text-xs text-white/90 font-medium tracking-wider">CLUBE DE LISBOA</span>
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-black hover:bg-white/20 px-3 py-2 rounded-md text-sm font-bold uppercase transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {/* Botão Sócio */}
              <Link
                to="/socio"
                className="bg-white text-[#df0000] hover:bg-black hover:text-white px-4 py-2 rounded-md text-sm font-bold uppercase shadow-md transform hover:-translate-y-0.5 transition-all"
              >
                Faz-te Sócio
              </Link>
            </div>
          </div>

          {/* BOTÃO MOBILE */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-black hover:bg-white/20 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-[#b30000] border-t border-black animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white hover:bg-black/20 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/socio"
              className="bg-white text-[#df0000] block px-3 py-2 rounded-md text-base font-bold mt-4 text-center hover:bg-black hover:text-white transition"
              onClick={() => setIsOpen(false)}
            >
              FAZ-TE SÓCIO
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;