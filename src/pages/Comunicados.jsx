import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase'; // Importa a ligação à Supabase

const Comunicados = () => {
    const [comunicados, setComunicados] = useState([]);
    const [comunicadoAberto, setComunicadoAberto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // --- BUSCAR DADOS À SUPABASE ---
    useEffect(() => {
        const fetchComunicados = async () => {
            try {
                // Vai à tabela 'comunicados', seleciona tudo ('*') e ordena pela data mais recente
                const { data, error } = await supabase
                    .from('comunicados')
                    .select('*')
                    .order('data', { ascending: false });

                if (error) {
                    throw error;
                }

                setComunicados(data);
            } catch (err) {
                console.error("Erro ao carregar comunicados:", err.message);
                setErro("Não foi possível carregar os comunicados neste momento.");
            } finally {
                setLoading(false);
            }
        };

        fetchComunicados();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Helmet>
                <title>Comunicados | Vitória Clube de Lisboa</title>
                <meta name="description" content="Acompanha as últimas notícias e comunicados oficiais do Vitória Clube de Lisboa." />
            </Helmet>

            {/* HEADER */}
            <div className="bg-[#7f1d1d] text-white py-16 px-4 text-center border-b-4 border-vcl-gold">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">Comunicados</h1>
                <p className="text-white/80 text-lg">As últimas notícias e novidades do nosso clube.</p>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-12">

                {/* ESTADOS DE LOADING E ERRO */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-vcl-red">
                        <Loader size={48} className="animate-spin mb-4" />
                        <p className="font-bold text-gray-500">A carregar notícias...</p>
                    </div>
                )}

                {erro && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center flex flex-col items-center">
                        <AlertCircle size={40} className="mb-2 opacity-50" />
                        <p className="font-bold">{erro}</p>
                    </div>
                )}

                {/* VISTA DE LEITURA DO COMUNICADO */}
                {!loading && !erro && comunicadoAberto ? (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
                        <button
                            onClick={() => setComunicadoAberto(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-vcl-red p-6 font-bold uppercase text-sm transition"
                        >
                            <ChevronRight className="rotate-180" size={16} /> Voltar aos comunicados
                        </button>

                        {comunicadoAberto.imagem && (
                            <img src={comunicadoAberto.imagem} alt="Capa" className="w-full h-64 md:h-96 object-cover" />
                        )}

                        <div className="p-6 md:p-10">
                            <div className="flex items-center gap-2 text-vcl-red font-bold text-sm mb-4">
                                <Calendar size={16} /> {comunicadoAberto.data}
                            </div>
                            <h2 className="text-3xl font-black text-vcl-black mb-8">{comunicadoAberto.titulo}</h2>

                            {/* MAGIA AQUI: Interpreta o HTML gerado pelo React Quill */}
                            <div
                                className="prose prose-red max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: comunicadoAberto.conteudo }}
                            />
                        </div>
                    </div>
                ) : (

                    /* LISTA DE COMUNICADOS */
                    !loading && !erro && (
                        comunicados.length > 0 ? (
                            <div className="space-y-6">
                                {comunicados.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setComunicadoAberto(item)}
                                        className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row cursor-pointer hover:shadow-xl transition duration-300 group"
                                    >
                                        {item.imagem && (
                                            <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                                                <img src={item.imagem} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                            </div>
                                        )}
                                        <div className="p-6 sm:w-2/3 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
                                                <Calendar size={14} /> {item.data}
                                            </div>
                                            <h3 className="text-xl font-bold text-vcl-black group-hover:text-vcl-red transition mb-3 line-clamp-2">
                                                {item.titulo}
                                            </h3>
                                            {/* Mostrar um pequeno resumo do conteúdo (removendo as tags HTML) */}
                                            <div
                                                className="text-gray-300 mb-6 line-clamp-3 leading-relaxed text-sm [&>p]:mb-0"
                                                dangerouslySetInnerHTML={{ __html: item.conteudo }}
                                            />
                                            <p className="text-vcl-red font-bold text-sm uppercase tracking-wider flex items-center gap-1 mt-auto">
                                                Ler Mais <ChevronRight size={16} />
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-xl font-bold mb-2">Sem comunicados</p>
                                <p>Ainda não foram publicados comunicados.</p>
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
};

export default Comunicados;