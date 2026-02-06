import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
// CORREÇÃO: Adicionei ChevronLeft, ChevronRight e AlertTriangle à lista de imports
import { ArrowRight, Trophy, Users, Heart, Star, ShoppingBag, ShieldCheck, Calendar, MapPin, Loader, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import campoImg from '../assets/campoVitoria.jpeg'; // Confirma se a imagem está aqui
import camisolaImg from '../assets/camisolaPrincipal.png';
import sponsor1 from '../assets/jfbeato.png';
import sponsor2 from '../assets/joma.png';

const Home = () => {
  // --- ESTADO PARA O PRÓXIMO JOGO ---
  const [slides, setSlides] = useState([]); // Array com o jogo mais próximo de CADA escalão
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  
  // --- ESTADO PARA O BOTÃO DE ALUGUER ---
  const [showEmail, setShowEmail] = useState(false);
  
  // --- COLA AQUI O TEU LINK CSV DOS JOGOS (O MESMO DO FUTEBOL.JSX) ---
  const LINK_CSV = import.meta.env.VITE_GOOGLE_SHEETS_JOGOS;

  // --- LÓGICA INTELIGENTE ---
  useEffect(() => {
    const fetchJogos = async () => {
      Papa.parse(LINK_CSV, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const jogos = results.data;
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          // 1. Filtrar Jogos Futuros e Converter Datas
          const jogosFuturos = jogos.filter(jogo => {
            if (!jogo.data) return false;
            try {
              let dataJogo;
              if (jogo.data.includes('/')) {
                const partes = jogo.data.split('/'); 
                dataJogo = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`); 
              } else {
                dataJogo = new Date(jogo.data);
              }
              if (isNaN(dataJogo.getTime())) return false;

              if (jogo.hora) {
                const [hora, min] = jogo.hora.split(':');
                dataJogo.setHours(parseInt(hora), parseInt(min));
              } else {
                dataJogo.setHours(23, 59);
              }
              return dataJogo >= hoje;
            } catch (e) { return false; }
          });

          // 2. Ordenar por Data (Mais próximos primeiro)
          jogosFuturos.sort((a, b) => {
            const d1 = a.data.split('/').reverse().join('-');
            const d2 = b.data.split('/').reverse().join('-');
            return new Date(d1) - new Date(d2);
          });

          // 3. Agrupar por Escalão (Pegar apenas no PRIMEIRO jogo futuro de cada escalão)
          const proximosPorEscalao = {};
          jogosFuturos.forEach(jogo => {
            // Se ainda não guardámos um jogo para este escalão, guardamos este (que é o mais próximo)
            if (!proximosPorEscalao[jogo.escalao]) {
              proximosPorEscalao[jogo.escalao] = jogo;
            }
          });

          // Converter objeto em array para o slideshow
          const slidesFinais = Object.values(proximosPorEscalao);
          
          setSlides(slidesFinais);
          setLoading(false);
        },
        error: (err) => {
          console.error("Erro CSV:", err);
          setErro("Erro ao ler dados.");
          setLoading(false);
        }
      });
    };

    fetchJogos();
  }, []);

  // --- 2. LÓGICA DO TEMPORIZADOR (AUTOPLAY) ---
  useEffect(() => {
    if (slides.length <= 1) return; // Não roda se só houver 1 jogo

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(timer);
  }, [slides.length]);

  // Funções manuais de navegação
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Jogo atual a mostrar
  const jogoAtual = slides[currentSlide];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Vitória Clube de Lisboa - Página Inicial</title>
        <meta name="description" content="Bem-vindo ao Vitória Clube de Lisboa, fundado em 1944. Descubra nossa história, modalidades, loja oficial e torne-se sócio." />
      </Helmet>
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[650px] w-full bg-vcl-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={campoImg} 
            alt="Campo do Vitória Clube de Lisboa" 
            className="w-full h-full object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vcl-black via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <div className="inline-flex items-center gap-2 border border-vcl-gold/30 bg-black/30 backdrop-blur-sm px-4 py-1 rounded-full mb-6">
            <Star size={14} className="text-vcl-gold fill-vcl-gold" />
            <span className="text-vcl-gold text-xs font-bold tracking-widest uppercase">DESDE 1944</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
            A UNIÃO <span className="text-transparent bg-clip-text bg-gradient-to-r from-vcl-red to-red-600">FAZ A FORÇA</span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Mais do que um clube, uma instituição de Lisboa. Formamos homens e atletas desde a fundação.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/socio" className="bg-vcl-red text-white px-8 py-4 rounded font-bold uppercase hover:bg-red-700 transition shadow-[0_0_20px_rgba(230,0,0,0.4)] flex items-center justify-center gap-2">
              Tornar-me Sócio <ArrowRight size={20}/>
            </Link>
            <Link to="/futebol" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded font-bold uppercase hover:bg-white hover:text-vcl-black transition">
              Ver Resultados
            </Link>
          </div>
        </div>
      </div>

      {/* 2. WIDGET PRÓXIMO JOGO (AUTOMÁTICO) */}
      <section className="relative -mt-16 z-20 px-4 mb-0">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-2 border-b-4 border-vcl-red">
          <div className="bg-zinc-900 text-white rounded-lg p-6 md:p-10 relative overflow-hidden min-h-[200px] flex items-center justify-center group">
             
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

             {loading ? (
               <div className="text-center z-10"><Loader className="animate-spin text-vcl-red mx-auto mb-2" size={32} /><p className="text-gray-400 text-sm">A procurar jogos...</p></div>
             ) : erro ? (
               <div className="text-center z-10 text-red-400"><AlertTriangle className="mx-auto mb-2" size={32} /><p>{erro}</p></div>
             ) : slides.length > 0 ? (
               <div className="w-full relative z-10">
                 
                 {/* Conteúdo do Jogo (Com Animação de Fade via Key) */}
                 <div key={currentSlide} className="flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in">
                    
                    {/* Data e Escalão */}
                    <div className="text-center md:text-left min-w-[200px]">
                      <div className="inline-block bg-vcl-red text-white text-xs font-bold px-3 py-1 rounded mb-2 uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        {jogoAtual.escalao}
                      </div>
                      <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Próximo Duelo</h3>
                      <div className="text-3xl font-bold capitalize flex items-center justify-center md:justify-start gap-2">
                        <Calendar size={24} className="text-vcl-gold"/> {jogoAtual.data}
                      </div>
                      <div className="text-xl text-gray-300 font-mono mt-1 flex items-center justify-center md:justify-start gap-2">
                        {jogoAtual.hora}H
                      </div>
                    </div>

                    {/* O Jogo (VS) */}
                    <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center w-full">
                      <div className="text-center flex-1">
                        <span className={`block text-xl md:text-2xl font-bold ${jogoAtual.casa.includes('Vitória') ? 'text-white' : 'text-gray-400'}`}>
                          {jogoAtual.casa}
                        </span>
                      </div>
                      
                      <div className="text-4xl font-black text-vcl-red font-mono italic">VS</div>
                      
                      <div className="text-center flex-1">
                        <span className={`block text-xl md:text-2xl font-bold ${jogoAtual.fora.includes('Vitória') ? 'text-white' : 'text-gray-400'}`}>
                          {jogoAtual.fora}
                        </span>
                      </div>
                    </div>

                    {/* Local */}
                    <div className="text-center md:text-right mt-4 md:mt-0 min-w-[150px]">
                      <div className="flex items-center justify-center md:justify-end gap-1 text-gray-400 text-sm mb-3">
                          <MapPin size={14}/> {jogoAtual.casa.includes('Vitória') ? 'Em Casa' : 'Fora'}
                      </div>
                      <Link to="/futebol" className="inline-block border border-white/30 hover:bg-white hover:text-black text-white px-6 py-2 rounded transition text-sm font-bold uppercase">
                        Ver Calendário
                      </Link>
                    </div>
                 </div>

                 {/* Setas de Navegação (Só aparecem se houver mais de 1 jogo) */}
                 {slides.length > 1 && (
                   <>
                     <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 bg-black/50 hover:bg-vcl-red p-2 rounded-full text-white transition backdrop-blur-sm hidden md:block">
                        <ChevronLeft size={24} />
                     </button>
                     <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 bg-black/50 hover:bg-vcl-red p-2 rounded-full text-white transition backdrop-blur-sm hidden md:block">
                        <ChevronRight size={24} />
                     </button>
                     {/* Indicadores (Bolinhas) */}
                     <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, idx) => (
                          <div key={idx} className={`h-2 w-2 rounded-full transition-all ${idx === currentSlide ? 'bg-vcl-red w-6' : 'bg-gray-600'}`}></div>
                        ))}
                     </div>
                   </>
                 )}

               </div>
             ) : (
               <div className="text-center z-10">
                 <Trophy className="text-gray-600 mx-auto mb-2" size={40} />
                 <h3 className="text-xl font-bold text-gray-300">Sem jogos agendados</h3>
                 <p className="text-gray-500 text-sm mt-2">Fica atento às novidades da próxima época.</p>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* 3. NÚMEROS DO CLUBE (VERMELHO) */}
      <section className="bg-vcl-red py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="p-4">
              <div className="text-5xl font-black text-white mb-2 drop-shadow-md">1944</div>
              <div className="text-white/80 uppercase text-xs font-bold tracking-widest">Ano de Fundação</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-black text-white mb-2 drop-shadow-md">500+</div>
              <div className="text-white/80 uppercase text-xs font-bold tracking-widest">SÓCIOS</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-black text-white mb-2 drop-shadow-md">7</div>
              <div className="text-white/80 uppercase text-xs font-bold tracking-widest">Escalões</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-black text-vcl-gold mb-2 drop-shadow-md">3</div>
              <div className="text-white/80 uppercase text-xs font-bold tracking-widest">Modalidades</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. O NOSSO ADN (DARK) */}
      <section className="py-24 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-vcl-red rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-vcl-gold rounded-full opacity-5 blur-3xl"></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">O NOSSO ADN</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-vcl-red to-vcl-gold mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Valores que passam de geração em geração. O Vitória é feito de pessoas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 p-8 rounded-xl hover:bg-zinc-800 transition duration-300 group">
              <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white group-hover:text-vcl-red group-hover:scale-110 transition border border-zinc-700 group-hover:border-vcl-red">
                <Trophy size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Cultura de Vitória</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                Entramos em campo sempre para ganhar, respeitando o adversário mas impondo o nosso jogo. A ambição faz parte do símbolo.
              </p>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 p-8 rounded-xl hover:bg-zinc-800 transition duration-300 group">
              <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white group-hover:text-vcl-red group-hover:scale-110 transition border border-zinc-700 group-hover:border-vcl-red">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Formação Humana</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                Mais do que jogadores, formamos cidadãos. A escola e o comportamento vêm sempre antes da bola.
              </p>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 p-8 rounded-xl hover:bg-zinc-800 transition duration-300 group">
              <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white group-hover:text-vcl-gold group-hover:scale-110 transition border border-zinc-700 group-hover:border-vcl-gold">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Paixão Comunitária</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                Somos o coração do bairro. Um clube feito de famílias, voluntários e sócios que vivem o VCL diariamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ALUGUER DO CAMPO */}
      <section className="py-24 relative overflow-hidden bg-zinc-800">
        {/* Fundo com gradiente sutil */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-800 via-zinc-800/90 to-zinc-900"></div>
        
        {/* Elementos decorativos dinâmicos */}
        <div className="absolute inset-0 z-0">
          {/* Orbs flutuantes */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-vcl-red rounded-full opacity-6 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-vcl-gold rounded-full opacity-3 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Padrão geométrico - Muito subtil */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.01]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="modernGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="1" fill="#fff"/>
                <path d="M 0 0 L 50 50 M 50 0 L 0 50" stroke="#fff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modernGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-vcl-gold font-bold uppercase tracking-widest mb-4 block flex items-center justify-center gap-2 text-sm">
              <MapPin size={18}/> Aluguer de Campo
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Reserve o Nosso <span className="text-transparent bg-clip-text bg-gradient-to-r from-vcl-red via-red-500 to-vcl-gold">Campo</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-vcl-red to-vcl-gold mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg font-light">
              Perfeito para treinos, partidas amigáveis e eventos desportivos. Infraestrutura moderna com toda a qualidade do Vitória.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-vcl-red/15 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"></div>
              <div className="relative bg-zinc-700/50 backdrop-blur-md border border-vcl-red/30 group-hover:border-vcl-red/60 rounded-2xl p-8 transition duration-300 shadow-lg hover:shadow-xl">
                <div className="bg-gradient-to-br from-vcl-red to-red-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition duration-300 shadow-md">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Infraestrutura de Qualidade</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Campo em relvado de alto desempenho, iluminação profissional e balneários completos.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-vcl-gold/15 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"></div>
              <div className="relative bg-zinc-700/50 backdrop-blur-md border border-vcl-gold/30 group-hover:border-vcl-gold/60 rounded-2xl p-8 transition duration-300 shadow-lg hover:shadow-xl">
                <div className="bg-gradient-to-br from-vcl-gold to-yellow-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition duration-300 shadow-md">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Disponibilidade Flexível</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Diversos horários disponíveis durante a semana e fins de semana para tua conveniência.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"></div>
              <div className="relative bg-zinc-700/50 backdrop-blur-md border border-white/20 group-hover:border-white/40 rounded-2xl p-8 transition duration-300 shadow-lg hover:shadow-xl">
                <div className="bg-gradient-to-br from-gray-400 to-gray-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition duration-300 shadow-md">
                  <Trophy size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ambiente Profissional</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Espaço seguro e bem mantido, ideal para todas as modalidades e faixas etárias.
                </p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-vcl-red/20 via-vcl-gold/15 to-vcl-red/20 rounded-2xl blur-lg group-hover:blur-xl transition duration-500 opacity-50 group-hover:opacity-70"></div>
            <div className="relative bg-zinc-700/60 backdrop-blur-md border border-vcl-red/40 group-hover:border-vcl-red/70 rounded-2xl p-8 md:p-12 text-center shadow-xl group-hover:shadow-2xl transition duration-300">
              <p className="text-gray-100 mb-8 text-lg">
                <span className="font-bold text-white">Interessado em alugar o campo?</span> Contacte nos para obter informações e agendar o seu aluguer.
              </p>
              <button 
                onClick={() => setShowEmail(!showEmail)}
                className="inline-block bg-gradient-to-r from-vcl-red to-red-600 text-white px-10 py-4 rounded-full font-bold uppercase hover:from-vcl-gold hover:to-yellow-500 hover:text-vcl-black transition duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95"
              >
                {showEmail ? 'marketing.vitoriacl@gmail.com' : 'Obter Informações'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOJA DESTAQUE */}
      <section className="relative py-24 md:py-32 bg-vcl-black overflow-hidden border-t border-zinc-800">
        {/* Imagem de fundo ambiente */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-vcl-black via-vcl-black/95 to-vcl-black/80"></div>

        {/* Contentor Principal - Agora com 3 colunas em Desktop */}
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* 1. ESQUERDA: Texto (Ocupa 5/12 do espaço) */}
          <div className="md:w-5/12 text-center md:text-left text-white z-20">
            <span className="text-vcl-gold font-bold uppercase tracking-wider mb-4 block flex items-center justify-center md:justify-start gap-2">
              <ShoppingBag size={18}/> Loja Oficial
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-6 italic leading-none tracking-tight">
              VESTE A PELE <br/>DO <span className="text-vcl-red">VITÓRIA</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto md:mx-0 font-light leading-relaxed">
              A nova camisola principal 2025/26. Design clássico, tecido de alta performance. Garante a tua.
            </p>
            <div className="flex justify-center md:justify-start">
              <Link to="/loja" className="bg-white text-vcl-black px-8 py-4 rounded-full font-bold uppercase hover:bg-vcl-red hover:text-white transition duration-300 flex items-center gap-3 shadow-lg hover:shadow-vcl-red/50">
                Comprar Agora <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* 2. MEIO: Imagem da Camisola (Ocupa 4/12 - Escondido em Mobile) */}
          <div className="hidden md:block md:w-4/12 relative z-10 group">
             {/* Efeito de "Glow" vermelho atrás da camisola */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-vcl-red blur-[100px] opacity-40 group-hover:opacity-60 transition duration-500 rounded-full"></div>
             
             {/* Imagem da Camisola com efeito flutuante */}
             <img 
               src={camisolaImg}   // <--- Usa a variável que importaste
               alt="Camisola Principal" 
               className="relative w-full h-auto object-contain drop-shadow-2xl transform group-hover:scale-105 group-hover:-rotate-2 transition duration-500 ease-in-out z-20"
             />
          </div>
          
          {/* 3. DIREITA: Bola de Preço (Ocupa 3/12 - Escondido em Mobile) */}
          <div className="hidden md:block md:w-3/12 text-right z-20">
            <div className="inline-flex bg-vcl-red/90 backdrop-blur-md text-white w-48 h-48 rounded-full flex-col items-center justify-center animate-bounce shadow-[0_0_40px_rgba(230,0,0,0.6)] border-4 border-white/10 transform hover:scale-110 transition duration-300 cursor-pointer">
              <span className="text-sm font-bold uppercase tracking-widest mb-1 opacity-80">Por apenas</span>
              <span className="text-6xl font-black tracking-tighter">20€</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SPONSORS */}
      <section className="py-16 relative overflow-hidden bg-zinc-800 border-t border-zinc-800">
        {/* Fundo com gradiente sutil */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-800 via-zinc-800/90 to-zinc-900"></div>
        
        {/* Elementos decorativos dinâmicos */}
        <div className="absolute inset-0 z-0">
          {/* Orbs flutuantes */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-vcl-red rounded-full opacity-6 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-vcl-gold rounded-full opacity-3 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Padrão geométrico - Muito subtil */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.01]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="modernGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="1" fill="#fff"/>
                <path d="M 0 0 L 50 50 M 50 0 L 0 50" stroke="#fff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modernGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          {/* Título ligeiramente mais claro */}
          <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-10">Parceiros Oficiais</p>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50">
            
            {/* Patrocinador 1 */}
            <img 
              src={sponsor1} 
              alt="Patrocinador Oficial 1" 
              className="h-32 md:h-40 w-auto object-contain grayscale hover:grayscale-0 transition duration-300 cursor-pointer" 
            />

            {/* Divisória vertical escura */}
            <div className="hidden md:block w-px h-24 bg-zinc-700"></div>

            {/* Patrocinador 2 */}
            <img 
              src={sponsor2} 
              alt="Patrocinador Oficial 2" 
              className="h-32 md:h-40 w-auto object-contain grayscale hover:grayscale-0 transition duration-300 cursor-pointer" 
            />

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;