import React, { useState } from 'react';
import { Lock, FileSpreadsheet, ExternalLink, ShieldCheck, ImagePlus, Loader, CheckCircle, Copy } from 'lucide-react';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // --- CONFIGURAÇÃO ---
  const SENHA_SECRETA = import.meta.env.VITE_ADMIN_PASSWORD;
  const LINK_EDICAO_SHEETS = import.meta.env.VITE_GOOGLE_SHEETS_EDICAO;

  // DADOS DO CLOUDINARY (PREENCHE ISTO COM OS TEUS DADOS DO PASSO 1)
  const CLOUDINARY_CLOUD_NAME = "dksousivl"; // Ex: 'dpkreativ'
  const CLOUDINARY_UPLOAD_PRESET = "vcl_uploads"; // Ex: 'vcl_uploads'

  // --- ESTADOS DO UPLOAD DE IMAGEM ---
  const [imageSelected, setImageSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === SENHA_SECRETA) setAdminView(); else setError('Senha incorreta.');
  };
  const setAdminView = () => { setIsLoggedIn(true); setError(''); };

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
        setImageSelected(null); // Limpa a seleção
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
    alert("Link copiado! Agora cola na coluna 'foto_url' do Google Sheets.");
  };

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
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Inserir Senha" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red focus:outline-none"/>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button type="submit" className="w-full bg-vcl-red text-white py-3 rounded font-bold uppercase hover:bg-red-700 transition">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-8 border-vcl-red flex justify-between items-center">
          <div><h1 className="text-3xl font-bold text-vcl-black mb-2">Painel de Controlo</h1><p className="text-gray-500">Bem-vindo, Administrador.</p></div>
          <ShieldCheck size={48} className="text-green-500" />
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
                <p className="text-xs text-gray-500 mb-2">Copia este link e cola no Excel:</p>
                <div className="flex gap-2">
                  <input type="text" value={uploadedUrl} readOnly className="w-full p-2 text-xs bg-white border rounded text-gray-600 overflow-hidden" />
                  <button onClick={copyToClipboard} className="bg-gray-200 hover:bg-gray-300 p-2 rounded" title="Copiar"><Copy size={18}/></button>
                </div>
                <div className="mt-4 flex justify-center">
                  <img src={uploadedUrl} alt="Preview" className="h-24 w-24 object-cover rounded-full border-2 border-vcl-gold shadow-md" />
                </div>
              </div>
            )}
          </div>

          {/* GESTÃO DE GOOGLE SHEETS */}
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-vcl-black">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-green-100 text-green-700 rounded-lg"><FileSpreadsheet size={32} /></div>
              <div><h3 className="text-xl font-bold text-vcl-black">2. Base de Dados (Excel)</h3><p className="text-sm text-gray-500">Cola o link da foto na coluna 'foto_url'.</p></div>
            </div>
            <p className="text-gray-600 mb-6">Abre o Google Sheets para editar jogadores, resultados e colar os links das fotos novas.</p>
            <a href={LINK_EDICAO_SHEETS} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-vcl-black text-white py-3 rounded font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
              Abrir Google Sheets <ExternalLink size={18}/>
            </a>
            <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
              <strong>Dica:</strong> Depois de colares o link no Excel, aguarda 1 minuto e atualiza o site para ver a nova foto.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;