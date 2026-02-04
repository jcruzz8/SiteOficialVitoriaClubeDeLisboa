import React from 'react';
import { Star, Award, Scroll } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Historia = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Vitória Clube de Lisboa - A Nossa História</title>
        <meta name="description" content="Conheça a história do Vitória Clube de Lisboa, fundado em 1944. Tradição, orgulho e formação desportiva desde sempre." />
      </Helmet>
      
      {/* HERO SIMPLES */}
      <div className="bg-vcl-black text-vcl-gold py-20 px-4 text-center">
        <Star size={48} className="mx-auto mb-4 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-widest uppercase">Nossa História</h1>
        <p className="text-white mt-4 font-sans tracking-wide">Orgulho, Tradição e Glória desde 19XX</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        
        {/* INTRODUÇÃO */}
        <div className="text-center mb-16">
          <p className="text-xl text-gray-700 leading-relaxed">
            O <strong>Vitória Clube de Lisboa</strong> nasceu do sonho de um grupo de amigos que queriam criar mais do que um clube de futebol: queriam criar uma família. Localizado no coração de Lisboa, o clube tornou-se um símbolo de resistência e formação desportiva.
          </p>
        </div>

        {/* TIMELINE */}
        <div className="relative border-l-4 border-vcl-red ml-4 md:ml-0 space-y-12">
          
          {/* Evento 1 */}
          <div className="relative pl-8 md:pl-12">
            <div className="absolute -left-3 top-0 bg-vcl-black border-4 border-vcl-red w-6 h-6 rounded-full"></div>
            <span className="text-vcl-red font-bold text-xl block mb-2">19XX - A Fundação</span>
            <h3 className="text-2xl font-bold text-vcl-black mb-2">O Início de Tudo</h3>
            <p className="text-gray-600">
              O clube é fundado oficialmente na sede antiga. As cores vermelho, preto e branco são escolhidas para representar o sangue (paixão), a terra (firmeza) e a paz (desportivismo).
            </p>
          </div>

          {/* Evento 2 */}
          <div className="relative pl-8 md:pl-12">
            <div className="absolute -left-3 top-0 bg-vcl-black border-4 border-vcl-red w-6 h-6 rounded-full"></div>
            <span className="text-vcl-red font-bold text-xl block mb-2">1985 - A Primeira Glória</span>
            <h3 className="text-2xl font-bold text-vcl-black mb-2">Campeões Distritais</h3>
            <p className="text-gray-600">
              Uma equipa lendária conquista o primeiro troféu oficial do clube, subindo de divisão num jogo memorável decidido nos últimos minutos.
            </p>
          </div>

          {/* Evento 3 */}
          <div className="relative pl-8 md:pl-12">
            <div className="absolute -left-3 top-0 bg-vcl-black border-4 border-vcl-red w-6 h-6 rounded-full"></div>
            <span className="text-vcl-red font-bold text-xl block mb-2">2010 - Expansão</span>
            <h3 className="text-2xl font-bold text-vcl-black mb-2">Novas Modalidades</h3>
            <p className="text-gray-600">
              O clube inaugura o novo pavilhão e abre as secções de Boxe e Muay Thai, trazendo novos atletas e sócios para a família vitoriana.
            </p>
          </div>

          {/* Evento 4 */}
          <div className="relative pl-8 md:pl-12">
            <div className="absolute -left-3 top-0 bg-vcl-black border-4 border-vcl-red w-6 h-6 rounded-full"></div>
            <span className="text-vcl-red font-bold text-xl block mb-2">Hoje</span>
            <h3 className="text-2xl font-bold text-vcl-black mb-2">O Futuro</h3>
            <p className="text-gray-600">
              Com centenas de atletas na formação, o Vitória Clube de Lisboa continua a crescer, mantendo-se fiel ao seu lema: "A União Faz a Força".
            </p>
          </div>
        </div>

      </div>

      {/* PALMARÉS */}
      <div className="bg-gray-100 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-vcl-black mb-10 flex justify-center items-center gap-3">
            <Award className="text-vcl-gold" size={40} /> Sala de Troféus
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow-sm">
              <Scroll className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-2xl text-vcl-black">3x</div>
              <div className="text-sm text-gray-500 uppercase">Campeão Distrital</div>
            </div>
            <div className="bg-white p-6 rounded shadow-sm">
              <Scroll className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-2xl text-vcl-black">5x</div>
              <div className="text-sm text-gray-500 uppercase">Taça de Honra</div>
            </div>
             <div className="bg-white p-6 rounded shadow-sm">
              <Scroll className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-2xl text-vcl-black">2x</div>
              <div className="text-sm text-gray-500 uppercase">Campeão Boxe Regional</div>
            </div>
             <div className="bg-white p-6 rounded shadow-sm">
              <Scroll className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-2xl text-vcl-black">12+</div>
              <div className="text-sm text-gray-500 uppercase">Torneios Formação</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Historia;