import React from 'react';
import { Clock, User, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Modalidades = () => {
  const modalidades = [
    {
      id: 'boxe',
      nome: 'Boxe',
      descricao: 'A nobre arte. Melhora a tua condição física, disciplina e técnica com os nossos treinadores certificados.',
      treinador: 'Mestre Carlos Silva',
      horario: 'Seg, Qua, Sex: 19:00',
      img: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop'
    },
    {
      id: 'muaythai',
      nome: 'Muay Thai',
      descricao: 'A arte das oito armas. Usa punhos, cotovelos, joelhos e canelas num treino intenso e completo.',
      treinador: 'Kru Ricardo Gomes',
      horario: 'Ter, Qui: 19:30 | Sáb: 10:00',
      img: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=2000&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Vitória Clube de Lisboa - Modalidades</title>
        <meta name="description" content="Descubra as modalidades do Vitória Clube de Lisboa: Boxe e Muay Thai. Treine com treinadores certificados e forme-se como atleta." />
      </Helmet>
      
      {/* HEADER */}
      <div className="bg-vcl-black text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900 opacity-20"></div> {/* Efeito de fundo */}
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl font-bold uppercase tracking-wide mb-4">Modalidades</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Não é só futebol. No Vitória Clube de Lisboa formamos atletas e guerreiros.
          </p>
        </div>
      </div>

      {/* LISTA DE MODALIDADES */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid gap-12">
          {modalidades.map((mod, index) => (
            <div key={mod.id} className={`flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Imagem */}
              <div className="lg:w-1/2 h-64 lg:h-auto relative">
                <img src={mod.img} alt={mod.nome} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
                <h2 className="absolute bottom-4 left-4 text-3xl font-bold text-white lg:hidden">{mod.nome}</h2>
              </div>

              {/* Conteúdo */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="hidden lg:block text-4xl font-bold text-vcl-black mb-4">{mod.nome}</h2>
                <p className="text-gray-600 text-lg mb-6">{mod.descricao}</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="text-vcl-red" />
                    <span className="font-semibold">Treinador:</span> {mod.treinador}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="text-vcl-red" />
                    <span className="font-semibold">Horário:</span> {mod.horario}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="text-vcl-red" />
                    <span>Primeira aula experimental grátis</span>
                  </div>
                </div>

                <Link to="/socio" className="inline-flex items-center justify-center gap-2 bg-vcl-black text-white px-8 py-3 rounded font-bold uppercase hover:bg-vcl-red transition-colors w-fit">
                  Inscrever Agora <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modalidades;