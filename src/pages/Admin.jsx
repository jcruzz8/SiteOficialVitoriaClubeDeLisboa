import React, { useState, useEffect } from 'react';
import { Lock, FileSpreadsheet, ExternalLink, ShieldCheck, ImagePlus, Loader, CheckCircle, Copy, Pencil, Trash2, X, AlertCircle, Calendar, LogOut } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '../supabase'; // A nossa ligação mágica à base de dados
import { useNavigate } from 'react-router-dom';

// --- COMPONENTE DOS COMUNICADOS ---
const SecaoAdminComunicados = () => {
  const [titulo, setTitulo] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Novos Estados
  const [comunicados, setComunicados] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  
  // Estado para a nossa Notificação Bonita
  const [notificacao, setNotificacao] = useState(null); // { tipo: 'sucesso' | 'erro', texto: '' }

  // Função para mostrar a notificação e escondê-la após 3 segundos
  const mostrarNotificacao = (tipo, texto) => {
    setNotificacao({ tipo, texto });
    setTimeout(() => setNotificacao(null), 3000);
  };

  const modulos = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  // Carregar os comunicados que já existem na base de dados
  const fetchComunicados = async () => {
    try {
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) throw error;
      setComunicados(data || []);
    } catch (error) {
      console.error("Erro ao carregar comunicados:", error);
    }
  };

  // Corre assim que a secção aparece no ecrã
  useEffect(() => {
    fetchComunicados();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();
    
    if (!titulo || !conteudo || conteudo === '<p><br></p>') {
      mostrarNotificacao('erro', "Por favor, preenche o título e o conteúdo.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (modoEdicao) {
        // ATUALIZAR UM EXISTENTE
        const { error } = await supabase
          .from('comunicados')
          .update({ titulo: titulo, imagem: imagemUrl, conteudo: conteudo })
          .eq('id', idEdicao);

        if (error) throw error;
        mostrarNotificacao('sucesso', "Comunicado atualizado com sucesso!");
      } else {
        // CRIAR UM NOVO
        const { error } = await supabase
          .from('comunicados')
          .insert([
            { 
              titulo: titulo, 
              imagem: imagemUrl, 
              conteudo: conteudo, 
              data: new Date().toISOString().split('T')[0] 
            }
          ]);

        if (error) throw error;
        mostrarNotificacao('sucesso', "Comunicado publicado com sucesso!");
      }
      
      // Limpar formulário
      cancelarEdicao();
      fetchComunicados(); // Atualiza a tabela em baixo

    } catch (error) {
      console.error("Erro da Supabase:", error.message);
      mostrarNotificacao('erro', "Erro ao gravar: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditar = (com) => {
    setTitulo(com.titulo);
    setImagemUrl(com.imagem || '');
    setConteudo(com.conteudo);
    setModoEdicao(true);
    setIdEdicao(com.id);
    // Faz scroll suave até ao topo do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setTitulo('');
    setImagemUrl('');
    setConteudo('');
    setModoEdicao(false);
    setIdEdicao(null);
  };

  const handleApagar = async (id) => {
    if (!window.confirm("Atenção! Tens a certeza que queres apagar este comunicado definitivamente?")) return;

    try {
      const { error } = await supabase
        .from('comunicados')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      mostrarNotificacao('sucesso', "Comunicado apagado com sucesso!");
      fetchComunicados(); // Atualiza a tabela
    } catch (error) {
      console.error("Erro ao apagar:", error);
      mostrarNotificacao('erro', "Erro ao apagar o comunicado.");
    }
  };

  return (
    <div className="relative">
      {/* --- A NOSSA NOTIFICAÇÃO BONITA (TOAST) --- */}
      {notificacao && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl text-white font-bold animate-fade-in ${notificacao.tipo === 'sucesso' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notificacao.tipo === 'sucesso' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          {notificacao.texto}
        </div>
      )}

      {/* --- FORMULÁRIO --- */}
      <div className={`bg-white p-8 rounded-xl shadow-md border-t-4 mt-8 transition-colors ${modoEdicao ? 'border-blue-500' : 'border-vcl-gold'}`}>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-vcl-black">
            {modoEdicao ? 'Editar Comunicado' : 'Novo Comunicado'}
          </h2>
          {modoEdicao && (
            <button onClick={cancelarEdicao} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition">
              <X size={18} /> Cancelar Edição
            </button>
          )}
        </div>
        
        <form onSubmit={handleGuardar} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título do Comunicado</label>
            <input 
              required 
              type="text" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Link da Fotografia (Opcional)</label>
            <input 
              type="text" 
              value={imagemUrl} 
              onChange={(e) => setImagemUrl(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" 
              placeholder="Cola aqui o link do Cloudinary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Conteúdo do Comunicado</label>
            <div className="bg-white">
              <ReactQuill 
                theme="snow" 
                value={conteudo} 
                onChange={setConteudo} 
                modules={modulos}
                className="h-64 mb-12" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-white px-6 py-4 rounded-lg font-bold uppercase transition flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : (modoEdicao ? 'bg-blue-600 hover:bg-blue-700' : 'bg-vcl-black hover:bg-vcl-red')}`}
          >
            {isSubmitting ? <><Loader size={20} className="animate-spin"/> A gravar...</> : (modoEdicao ? 'Atualizar Comunicado' : 'Publicar Comunicado')}
          </button>
        </form>
      </div>

      {/* --- TABELA DE GESTÃO DE COMUNICADOS --- */}
      <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-gray-300 mt-8">
        <h2 className="text-xl font-bold text-vcl-black mb-6">Comunicados Publicados</h2>
        
        {comunicados.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Ainda não existem comunicados publicados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="p-4 rounded-tl-lg">Data</th>
                  <th className="p-4">Título</th>
                  <th className="p-4 text-right rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody>
                {comunicados.map((com) => (
                  <tr key={com.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={14}/> {com.data}
                    </td>
                    <td className="p-4 font-bold text-vcl-black">
                      {com.titulo}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleEditar(com)}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleApagar(com.id)}
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                          title="Apagar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ADMIN ---
const Admin = () => {
  const navigate = useNavigate();

  // --- ESTADOS DE AUTENTICAÇÃO (SUPABASE) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erroLogin, setErroLogin] = useState('');

  // --- CONFIGURAÇÃO ---
  const LINK_EDICAO_SHEETS = import.meta.env.VITE_GOOGLE_SHEETS_EDICAO;

  // DADOS DO CLOUDINARY
  const CLOUDINARY_CLOUD_NAME = "dksousivl"; 
  const CLOUDINARY_UPLOAD_PRESET = "vcl_uploads"; 

  // --- ESTADOS DO UPLOAD DE IMAGEM ---
  const [imageSelected, setImageSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // 1. VERIFICA SE O UTILIZADOR JÁ FEZ LOGIN ANTES (Guarda a sessão)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    };
    checkSession();
  }, []);

  // 2. FUNÇÃO DE LOGIN COM A SUPABASE
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErroLogin('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Erro de login:", error.message);
      setErroLogin('Email ou Senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  // 3. FUNÇÃO DE LOGOUT
  const handleLogout = async () => {
    navigate('/');
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  // 4. FUNÇÃO DO CLOUDINARY
  const uploadImage = async () => {
    if (!imageSelected) return alert("Selecione uma imagem primeiro!");
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
        setImageSelected(null); 
      } else {
        alert("Erro no upload. Verifica as configurações do Cloudinary.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao conectar ao Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    alert("Link copiado! Agora podes colar na caixa abaixo ou no Excel.");
  };

  // --- ECRÃ DE LOGIN (SEGURO COM SUPABASE) ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-vcl-black flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-vcl-black" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-vcl-black mb-2">Área de Admin</h1>
          <p className="text-gray-500 mb-6">Acesso restrito à direção do clube.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email de Administrador" 
              className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red focus:outline-none"
              required
            />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Palavra-Passe" 
              className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red focus:outline-none"
              required
            />
            
            {erroLogin && <p className="text-red-500 text-sm font-bold">{erroLogin}</p>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-vcl-red text-white py-3 rounded font-bold uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {loading ? <><Loader size={18} className="animate-spin"/> A verificar...</> : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ECRÃ DO PAINEL DE ADMINISTRAÇÃO ---
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* CABEÇALHO DO PAINEL */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-8 border-vcl-red flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-vcl-black mb-2 flex items-center justify-center sm:justify-start gap-3">
              Painel de Controlo <ShieldCheck size={32} className="text-green-500" />
            </h1>
            <p className="text-gray-500">Bem-vindo, Administrador.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg font-bold transition"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* FERRAMENTA DE UPLOAD DE FOTOS */}
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-vcl-red">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-100 text-vcl-red rounded-lg"><ImagePlus size={32} /></div>
              <div><h3 className="text-xl font-bold text-vcl-black">1. Upload de Foto</h3><p className="text-sm text-gray-500">Carrega a foto e gera um link.</p></div>
            </div>

            <div className="space-y-4">
              <input 
                type="file" 
                onChange={(e) => setImageSelected(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-vcl-red hover:file:bg-red-100"
              />
              <button 
                onClick={uploadImage} 
                disabled={uploading || !imageSelected}
                className={`w-full py-3 rounded font-bold uppercase transition flex items-center justify-center gap-2 ${uploading || !imageSelected ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-vcl-red text-white hover:bg-red-700'}`}
              >
                {uploading ? <><Loader className="animate-spin" size={20}/> A Carregar...</> : 'Gerar Link da Foto'}
              </button>
            </div>

            {uploadedUrl && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                  <CheckCircle size={20} /> Foto carregada com sucesso!
                </div>
                <p className="text-xs text-gray-500 mb-2">Copia este link e usa onde precisares:</p>
                <div className="flex gap-2">
                  <input type="text" value={uploadedUrl} readOnly className="w-full p-2 text-xs bg-white border rounded text-gray-600 overflow-hidden" />
                  <button onClick={copyToClipboard} className="bg-gray-200 hover:bg-gray-300 p-2 rounded" title="Copiar"><Copy size={18}/></button>
                </div>
              </div>
            )}
          </div>

          {/* GESTÃO DE GOOGLE SHEETS */}
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-vcl-black">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-green-100 text-green-700 rounded-lg"><FileSpreadsheet size={32} /></div>
              <div><h3 className="text-xl font-bold text-vcl-black">2. Base de Dados (Excel)</h3><p className="text-sm text-gray-500">Apenas para futebol e modalidades.</p></div>
            </div>
            <p className="text-gray-600 mb-6">Abre o Google Sheets para editar jogadores, resultados e tabelas de classificação.</p>
            <a href={LINK_EDICAO_SHEETS} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-vcl-black text-white py-3 rounded font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
              Abrir Google Sheets <ExternalLink size={18}/>
            </a>
          </div>

        </div>

        {/* COMUNICADOS */}
        <SecaoAdminComunicados />

      </div>
    </div>
  );
};

export default Admin;