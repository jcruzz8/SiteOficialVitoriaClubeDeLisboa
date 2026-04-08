import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HardHat, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Historia = () => {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>História | Vitória Clube de Lisboa</title>
        <meta name="description" content="A página da história do Vitória Clube de Lisboa encontra-se em construção." />
      </Helmet>

      <div className="text-center max-w-lg mx-auto mt-10 mb-20 animate-fade-in">
        
        {/* Ícone Animado/Decorativo */}
        <div className="bg-red-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-100 relative shadow-inner">
          <HardHat size={56} className="text-vcl-red" />
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-gray-100 animate-bounce">
            <Clock size={28} className="text-vcl-gold" />
          </div>
        </div>
        
        {/* Texto */}
        <h1 className="text-4xl md:text-5xl font-black text-vcl-black uppercase mb-6 tracking-tight">
          Em Construção
        </h1>
        
        <div className="w-16 h-1 bg-gradient-to-r from-vcl-red to-vcl-gold mx-auto rounded-full mb-6"></div>
        
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          Estamos a recolher os arquivos e a redigir a história oficial do Vitória Clube de Lisboa. 
          <br className="hidden md:block" /> Esta página estará disponível muito em breve!
        </p>
        
        {/* Botão de Voltar */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 bg-vcl-black text-white px-8 py-4 rounded-xl font-bold uppercase hover:bg-vcl-red transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <ArrowLeft size={20} /> Voltar ao Início
        </Link>
        
      </div>
    </div>
  );
};

export default Historia;