import React, { useState } from 'react';
import { Clock, User, CheckCircle, ArrowRight, X, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Modalidades = () => {
  const [modalSelecionado, setModalSelecionado] = useState(null);

  const modalidades = [
    {
      id: 'boxe',
      nome: 'Boxe',
      descricao: 'O caminho para o sucesso começa no primeiro passo.',
      treinador: 'Nelson Barros',
      telefone: '+351 966 860 775',
      horario: 'Seg: 18:00-19:30 | 19:30-21:00\nQua: 19:30-21:00\nSex: 18:00-19:30 | 19:30-21:00',
      img: 'https://media.istockphoto.com/id/1006291908/pt/foto/red-boxing-glove.jpg?s=612x612&w=0&k=20&c=wy34as4iqvkoVxD5zULCAqAqCjobY9hTp44U0oQL4YU='
    },
    {
      id: 'muaythai',
      nome: 'Muay Thai',
      descricao: 'A arte das oito armas. Usa punhos, cotovelos, joelhos e canelas num treino intenso e completo. A partir dos 12 anos...',
      treinador: 'Mestre Tita',
      telefone: '+351 965 086 676',
      horario: 'Ter e Qui: 19:30-20:30 | 20:30-21:30\nSáb: 11:00-12:30',
      img: 'https://wallpapers.com/images/featured/muay-thai-afmej6sv4s7qagbz.jpg'
    },
    {
      id: 'kickboxing',
      nome: 'Kickboxing',
      descricao: 'Combina técnicas de boxe com chutes poderosos. Um desporto explosivo que desenvolve velocidade, força e resistência cardiovascular. A partir dos 12 anos...',
      treinador: 'Mestre Tita',
      telefone: '+351 965 086 676',
      horario: 'Ter e Qui: 19:30-20:30 | 20:30-21:30\nSáb: 11:00-12:30',
      img: 'https://www.teamduramuk.pt/wp-content/uploads/2022/10/sessao-duran-mobile_2.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Vitória Clube de Lisboa - Modalidades</title>
        <meta name="description" content="Descubra as modalidades do Vitória Clube de Lisboa: Boxe e Muay Thai. Treine com treinadores certificados e forme-se como atleta." />
      </Helmet>
      
      {/* HEADER (matching 'Torne-se Sócio' background) */}
      <div className="bg-[#7f1d1d] text-white py-20 px-4 text-center border-b-4 border-vcl-gold">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold uppercase tracking-wide mb-4">Modalidades</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
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
                  <div className="flex gap-3 text-gray-700">
                    <Clock className="text-vcl-red flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Horário:</span>
                      <p className="whitespace-pre-line">{mod.horario}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="text-vcl-red" />
                    <span>Primeira aula experimental grátis</span>
                  </div>
                </div>

                <button onClick={() => setModalSelecionado(mod)} className="inline-flex items-center justify-center gap-2 bg-vcl-black text-white px-8 py-3 rounded font-bold uppercase hover:bg-vcl-red transition-colors w-fit">
                  Inscrever Agora <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE CONTACTO */}
      {modalSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setModalSelecionado(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-vcl-black mb-6">Contacta {modalSelecionado.treinador}</h3>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-vcl-red" size={24} />
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Telemóvel</p>
                  <a href={`tel:${modalSelecionado.telefone.replace(/\s/g, '')}`} className="text-xl font-bold text-vcl-black hover:text-vcl-red transition-colors">
                    {modalSelecionado.telefone}
                  </a>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-center mb-6">
              Liga ou envia mensagem para o treinador de <span className="font-semibold">{modalSelecionado.nome}</span>
            </p>

            <button 
              onClick={() => setModalSelecionado(null)}
              className="w-full bg-vcl-black text-white px-6 py-3 rounded font-bold uppercase hover:bg-vcl-red transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modalidades;