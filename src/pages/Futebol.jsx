import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Trophy, Calendar, Users, Shirt, Loader, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import vclLogo from '../assets/VCL.png';

const Futebol = () => {
  // --- ESTADOS ---
  const [jogos, setJogos] = useState([]);
  const [tabela, setTabela] = useState([]);
  const [plantel, setPlantel] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [escalaoAtivo, setEscalaoAtivo] = useState('Veteranos'); 
  const [vistaAtiva, setVistaAtiva] = useState('classificacao1');

  // --- LINKS DO GOOGLE SHEETS (Mantém os teus links aqui!) ---
  const LINK_JOGOS = import.meta.env.VITE_GOOGLE_SHEETS_JOGOS;
  const LINK_TABELA = import.meta.env.VITE_GOOGLE_SHEETS_TABELA;
  const LINK_PLANTEL = import.meta.env.VITE_GOOGLE_SHEETS_PLANTEL;

  // --- CARREGAR DADOS ---
  useEffect(() => {
    const carregarDados = async () => {
      try {
        Papa.parse(LINK_JOGOS, { download: true, header: true, complete: (res) => setJogos(res.data) });
        Papa.parse(LINK_TABELA, { download: true, header: true, complete: (res) => setTabela(res.data) });
        Papa.parse(LINK_PLANTEL, { download: true, header: true, complete: (res) => setPlantel(res.data) });
      } catch (error) {
        console.error("Erro ao carregar CSVs:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // --- FILTROS INTELIGENTES ---
  const normalizar = (str) => str ? str.trim().toLowerCase() : '';

  const filtrarJogos = (fase) => jogos.filter(j => 
    normalizar(j.escalao) === normalizar(escalaoAtivo) && j.fase === fase
  );

  const filtrarTabela = (fase) => tabela
    .filter(t => normalizar(t.escalao) === normalizar(escalaoAtivo) && t.fase === fase)
    .sort((a, b) => Number(a.pos) - Number(b.pos));

  const plantelFiltrado = plantel.filter(p => normalizar(p.escalao) === normalizar(escalaoAtivo));

  const listaEscaloes = [
    'Veteranos', 'Juniores', 'Juvenis', 'Iniciados A', 'Iniciados B', 
    'Infantis A', 'Infantis B', 'Benjamins'
  ];

  // --- HELPER TABELA (ATUALIZADO COM V-E-D) ---
  const renderTabela = (dados, faseTitulo) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-vcl-black flex items-center gap-2">
          <Trophy className="text-vcl-gold" /> Tabela: {escalaoAtivo} <span className="text-gray-400 text-sm font-normal">({faseTitulo})</span>
        </h2>
      </div>
      {dados.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-4 py-3 text-center">Pos</th>
                <th className="px-4 py-3 w-full">Clube</th>
                <th className="px-4 py-3 text-center" title="Jogos">J</th>
                
                {/* NOVAS COLUNAS */}
                <th className="px-3 py-3 text-center text-green-600" title="Vitórias">V</th>
                <th className="px-3 py-3 text-center text-yellow-600" title="Empates">E</th>
                <th className="px-3 py-3 text-center text-red-600" title="Derrotas">D</th>
                
                <th className="px-4 py-3 text-center text-vcl-black bg-gray-100">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {dados.map((row, idx) => (
                <tr key={idx} className={row.pos === '1' ? 'bg-yellow-50/50' : 'hover:bg-gray-50 transition'}>
                  <td className="px-4 py-3 font-bold text-gray-400 text-center">#{row.pos}</td>
                  <td className="px-4 py-3 font-bold text-vcl-black flex items-center gap-2">
                    {row.equipa && row.equipa.toLowerCase().includes('vitória') && (
                      <span className="w-2 h-2 rounded-full bg-vcl-red shrink-0 animate-pulse"></span>
                    )}
                    {row.equipa}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 font-medium">{row.j}</td>
                  
                  {/* DADOS V-E-D */}
                  <td className="px-3 py-3 text-center text-gray-500">{row.v}</td>
                  <td className="px-3 py-3 text-center text-gray-500">{row.e}</td>
                  <td className="px-3 py-3 text-center text-gray-500">{row.d}</td>
                  
                  <td className="px-4 py-3 text-center font-black text-lg text-vcl-black bg-gray-50/50">{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="p-10 text-center text-gray-500 flex flex-col items-center"><AlertCircle className="mb-2 opacity-50"/>Ainda não há dados para a {faseTitulo}.</div>}
    </div>
  );

  // --- HELPER JOGOS ---
  const renderJogos = (dados, faseTitulo) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-vcl-black mb-6 flex items-center gap-2">
        <Calendar className="text-vcl-red" /> Jogos: {escalaoAtivo} <span className="text-gray-400 text-sm font-normal">({faseTitulo})</span>
      </h2>
      {dados.length > 0 ? (
        <div className="space-y-4">
          {dados.map((jogo, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border hover:border-vcl-red transition group">
              <div className="text-center md:text-left w-32 mb-2 md:mb-0">
                <div className="text-xs font-bold text-gray-400 uppercase">{jogo.data}</div>
                <div className="text-xs font-bold text-vcl-red">{jogo.hora}</div>
              </div>
              <div className="flex-1 flex items-center justify-center gap-4 w-full">
                <span className={`font-bold text-right flex-1 ${jogo.casa && jogo.casa.includes('Vitória') ? 'text-vcl-black' : 'text-gray-500'}`}>{jogo.casa}</span>
                <div className="bg-vcl-black text-white px-3 py-1 rounded font-mono font-bold text-lg min-w-[80px] text-center group-hover:bg-vcl-red transition">
                  {jogo.g_casa && jogo.g_fora ? `${jogo.g_casa} - ${jogo.g_fora}` : 'VS'}
                </div>
                <span className={`font-bold text-left flex-1 ${jogo.fora && jogo.fora.includes('Vitória') ? 'text-vcl-black' : 'text-gray-500'}`}>{jogo.fora}</span>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="p-10 text-center text-gray-500 flex flex-col items-center"><AlertCircle className="mb-2 opacity-50"/>Sem jogos agendados para a {faseTitulo}.</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>Vitória Clube de Lisboa - Futebol</title>
        <meta name="description" content="Resultados, calendário e plantel do Vitória Clube de Lisboa. Acompanhe os jogos e classificações das nossas equipas." />
      </Helmet>
      
      {/* HEADER */}
      <div className="bg-vcl-black text-white py-12 px-4 border-b-4 border-vcl-red">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold uppercase tracking-wide">Futebol</h1>
          <p className="text-gray-400 mt-2">Centro de Resultados do Vitória</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        
        {/* SELETOR DE ESCALÕES */}
        <div className="bg-white rounded-lg shadow-lg p-2 flex overflow-x-auto space-x-2 mb-8 scrollbar-hide">
          {listaEscaloes.map((esc) => (
            <button
              key={esc}
              onClick={() => setEscalaoAtivo(esc)}
              className={`whitespace-nowrap px-6 py-3 rounded font-bold text-sm uppercase transition-all
                ${escalaoAtivo === esc ? 'bg-vcl-red text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {esc}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* MENU LATERAL */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-100 border-b font-bold text-vcl-black uppercase text-sm tracking-wider">
                {escalaoAtivo}
              </div>
              <nav className="flex flex-col text-sm">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase mt-2">Fase 1</div>
                <button onClick={() => setVistaAtiva('classificacao1')} className={`px-4 py-3 text-left flex items-center gap-3 border-l-4 transition-all hover:bg-gray-50 ${vistaAtiva === 'classificacao1' ? 'border-vcl-red text-vcl-red bg-red-50' : 'border-transparent text-gray-600'}`}> <Trophy size={16} /> Classificação </button>
                <button onClick={() => setVistaAtiva('jogos1')} className={`px-4 py-3 text-left flex items-center gap-3 border-l-4 transition-all hover:bg-gray-50 ${vistaAtiva === 'jogos1' ? 'border-vcl-red text-vcl-red bg-red-50' : 'border-transparent text-gray-600'}`}> <Calendar size={16} /> Calendário </button>
                
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase mt-2 border-t">Fase 2</div>
                <button onClick={() => setVistaAtiva('classificacao2')} className={`px-4 py-3 text-left flex items-center gap-3 border-l-4 transition-all hover:bg-gray-50 ${vistaAtiva === 'classificacao2' ? 'border-vcl-red text-vcl-red bg-red-50' : 'border-transparent text-gray-600'}`}> <Trophy size={16} /> Classificação </button>
                <button onClick={() => setVistaAtiva('jogos2')} className={`px-4 py-3 text-left flex items-center gap-3 border-l-4 transition-all hover:bg-gray-50 ${vistaAtiva === 'jogos2' ? 'border-vcl-red text-vcl-red bg-red-50' : 'border-transparent text-gray-600'}`}> <Calendar size={16} /> Calendário </button>
                
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase mt-2 border-t">Equipa</div>
                <button onClick={() => setVistaAtiva('plantel')} className={`px-4 py-3 text-left flex items-center gap-3 border-l-4 transition-all hover:bg-gray-50 ${vistaAtiva === 'plantel' ? 'border-vcl-red text-vcl-red bg-red-50' : 'border-transparent text-gray-600'}`}> <Users size={16} /> Plantel </button>
              </nav>
            </div>
          </div>

          {/* ÁREA PRINCIPAL */}
          <div className="lg:col-span-3">
            
            {vistaAtiva === 'classificacao1' && renderTabela(filtrarTabela('1'), 'Fase 1')}
            {vistaAtiva === 'jogos1' && renderJogos(filtrarJogos('1'), 'Fase 1')}
            
            {vistaAtiva === 'classificacao2' && renderTabela(filtrarTabela('2'), 'Fase 2')}
            {vistaAtiva === 'jogos2' && renderJogos(filtrarJogos('2'), 'Fase 2')}

            {vistaAtiva === 'plantel' && (
              <div className="animate-fade-in">
                 <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-vcl-black flex items-center gap-2"><Users className="text-vcl-red" /> Plantel {escalaoAtivo}</h2>
                 </div>
                 {plantelFiltrado.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {plantelFiltrado.map((jogador, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden group hover:-translate-y-1 transition duration-300">
                          <div className="h-64 bg-gray-200 relative overflow-hidden flex items-center justify-center border-b">
                            {jogador.foto_url ? (
                              <img src={jogador.foto_url} alt={jogador.nome} className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-500" />
                            ) : (
                              <img src={vclLogo} alt="VCL Logo" className="w-24 h-24 object-contain grayscale group-hover:grayscale-0 transition duration-500" />
                            )}
                            <div className="absolute top-2 right-2 bg-vcl-black text-white text-xs font-bold px-2 py-1 rounded shadow-sm">#{jogador.numero}</div>
                          </div>
                          <div className="p-4 text-center relative bg-white">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-10 bg-vcl-red"></div>
                            <h3 className="font-bold text-lg text-vcl-black mt-2 leading-tight">{jogador.nome}</h3>
                            <p className="text-vcl-red text-xs font-bold uppercase tracking-wider mt-1">{jogador.pos}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                 ) : (
                   <div className="p-10 text-center text-gray-500 bg-white rounded-xl border border-dashed">
                     <Users className="mx-auto mb-2 opacity-50"/> Plantel ainda não definido no Google Sheets.
                   </div>
                 )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Futebol;