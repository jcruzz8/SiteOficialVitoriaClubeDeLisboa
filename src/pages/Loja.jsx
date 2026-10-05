import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Trash2, Check, Banknote, ShoppingBag, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// --- IMPORTA AS TUAS IMAGENS AQUI ---
// Certifica-te que os nomes dos ficheiros na pasta assets correspondem a estes imports
import camisolaVermelha from '../assets/CamisolaVermelha.png';
import camisolaBranca from '../assets/CamisolaBranca.png';
import camisolaGR from '../assets/CamisolaGR.png';
import kitJogo from '../assets/KitJogo.png';
import kitGR from '../assets/KitGR.png';
import kitTreino from '../assets/KitTreino.png';
import fatoTreino from '../assets/FatoTreino.png';
import cachecolVCL from '../assets/Cachecol_VCL.png';
import cachecolSub from '../assets/CachecolSublimado.png';
import camisolaBrevemente from '../assets/camisolaBrevemente.png';

const Loja = () => {
  // --- DADOS DOS PRODUTOS (Atualizado com a nova lista) ---
  // ---------------------------------------------------------------------------
  // LISTA DE PRODUTOS
  // ---------------------------------------------------------------------------
  // Esta secção centraliza todos os artigos da loja. Quando houver novidades,
  // basta adicionar mais objetos ao array para os mostrar automaticamente.
  // Neste momento, mantemos a página em destaque com a imagem de anúncio oficial
  // da nova coleção, que será substituída assim que os produtos estiverem prontos.
  const products = [
    // Escalão de Preços: 20€
    { id: 1, name: 'Camisola Principal (Vermelha)', price: 20, image: camisolaVermelha, type: 'wear', available: false },
    { id: 2, name: 'Camisola Alternativa (Branca)', price: 20, image: camisolaBranca, type: 'wear', available: false },
    { id: 3, name: 'Camisola Guarda-Redes', price: 20, image: camisolaGR, type: 'wear', available: false },
    
    // Kits e Conjuntos
    { id: 4, name: 'Kit de Jogo Completo', price: 35, image: kitJogo, type: 'wear', available: false },
    { id: 5, name: 'Kit de Guarda-Redes', price: 35, image: kitGR, type: 'wear', available: false },
    { id: 6, name: 'Kit de Treino', price: 25, image: kitTreino, type: 'wear', available: false },
    { id: 7, name: 'Fato de Treino', price: 40, image: fatoTreino, type: 'wear', available: false },

    // Acessórios
    { id: 8, name: 'Cachecol VCL Tradicional', price: 10, image: cachecolVCL, type: 'acc', available: true },
    { id: 9, name: 'Cachecol Sublimado', price: 7.50, image: cachecolSub, type: 'acc', available: true },
    // Destaque "em breve": imagem de anúncio oficial para novos artigos.
    { id: 10, name: 'Novos produtos por anunciar', price: 0, image: camisolaBrevemente, type: 'wear', available: false },
  ];

  // --- ESTADOS ---
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'form', 'success'
  
  // Dados do Comprador
  const [buyerData, setBuyerData] = useState({ 
    nome: '', 
    socioNum: '',
    telemovel: '' 
  });

  // --- FUNÇÕES DO CARRINHO ---
  
  const addToCart = (product, size) => {
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id && item.size === size 
          ? { ...item, qty: item.qty + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, size, qty: 1 }]);
    }
    setIsCartOpen(true); 
  };

  const removeFromCart = (itemId, itemSize) => {
    setCart(cart.filter(item => !(item.id === itemId && item.size === itemSize)));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // --- FINALIZAR COMPRA E ENVIAR EMAIL ---
  const handleFinalize = async (e) => {
    e.preventDefault();
    
    // 1. Formatar o carrinho para texto legível no email
    const resumoCarrinho = cart.map(item => 
      `- ${item.name} (Tam: ${item.size}) x${item.qty} | ${(item.price * item.qty).toFixed(2)}€`
    ).join('\n');

    // 2. Preparar dados para o Web3Forms
    const dataToSend = {
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
      subject: `Nova Encomenda Loja: ${buyerData.nome}`,
      from_name: "Site VCL Loja",
      buyer_name: buyerData.nome,
      buyer_phone: buyerData.telemovel, 
      buyer_socio_num: buyerData.socioNum || "Não Sócio",
      order_summary: resumoCarrinho,
      order_total: `${total.toFixed(2)}€`,
      message: `
        DADOS DO COMPRADOR:
        Nome: ${buyerData.nome}
        Telemóvel: ${buyerData.telemovel}
        Nº Sócio: ${buyerData.socioNum || "N/A"}
        
        ENCOMENDA:
        ${resumoCarrinho}
        
        ----------------
        TOTAL A PAGAR: ${total.toFixed(2)}€
      `
    };

    // 3. Enviar
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      const resData = await res.json();

      if (resData.success) {
        setCheckoutStep('success');
        setCart([]); 
      } else {
        alert("Ocorreu um erro ao enviar a encomenda. Tenta novamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão. Verifica a tua internet.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Loja Oficial | Vitória Clube de Lisboa</title>
        <meta name="description" content="Loja oficial do Vitória Clube de Lisboa. Compre camisolas, kits de treino e acessórios oficiais do clube." />
      </Helmet>

      {/* 1. HERO HEADER */}
      <div className="bg-vcl-black text-white py-20 px-4 text-center border-b-4 border-vcl-red">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-black/20 border border-red/10 px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
            <ShoppingBag size={16} className="text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-100">Loja Oficial</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-md">
            VESTE A NOSSA <span className="text-vcl-red">PELE</span>
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto font-light">
            Equipamentos oficiais e acessórios. Mostra as tuas cores onde quer que vás.
          </p>
        </div>
      </div>

      {/* 2. GRELHA DE PRODUTOS */}
      {/*
        Esta área está preparada para receber o catálogo real dos produtos.
        Por agora, mostramos o artwork de novidade em destaque para manter a página
        visualmente forte e alinhada com a comunicação do clube.
      */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8">
          {products.filter((product) => product.name === 'Novos produtos por anunciar').map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </div>

      {/* BOTÃO FLUTUANTE DO CARRINHO */}
      {!isCartOpen && cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 bg-vcl-red text-white p-4 rounded-full shadow-2xl z-40 hover:bg-red-700 transition animate-bounce"
        >
          <div className="relative">
            <ShoppingCart size={28} />
            <span className="absolute -top-3 -right-3 bg-black text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-white">
              {cart.reduce((a, c) => a + c.qty, 0)}
            </span>
          </div>
        </button>
      )}

      {/* 3. MODAL / SIDEBAR DO CARRINHO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in-right">
            
            <div className="bg-vcl-black text-white p-5 flex justify-between items-center shadow-md">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={20} className="text-vcl-red" /> 
                {checkoutStep === 'cart' ? 'O Teu Carrinho' : checkoutStep === 'form' ? 'Finalizar Encomenda' : 'Encomenda Confirmada'}
              </h2>
              <button onClick={() => {setIsCartOpen(false); setCheckoutStep('cart');}} className="hover:text-vcl-red transition"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              
              {/* PASSO 1: LISTA DE ITENS */}
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                      <ShoppingBag size={64} className="mb-4 opacity-20"/>
                      <p>O teu carrinho está vazio.</p>
                      <button onClick={() => setIsCartOpen(false)} className="mt-4 text-vcl-red font-bold hover:underline">Continuar a comprar</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item, idx) => (
                        <div key={`${item.id}-${item.size}-${idx}`} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4 border border-gray-100">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-100 rounded" />
                          <div className="flex-1">
                            <h3 className="font-bold text-sm text-vcl-black">{item.name}</h3>
                            <div className="text-xs text-gray-500 mt-1">Tamanho: <span className="font-bold">{item.size}</span></div>
                            <div className="text-vcl-red font-bold mt-1">{item.price.toFixed(2)}€ x {item.qty}</div>
                          </div>
                          <button onClick={() => removeFromCart(item.id, item.size)} className="text-gray-400 hover:text-red-600 transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* PASSO 2: FORMULÁRIO E PAGAMENTO */}
              {checkoutStep === 'form' && (
                <div className="animate-fade-in">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Dados do Comprador</h3>
                    <form id="checkout-form" onSubmit={handleFinalize} className="space-y-4">
                      
                      {/* NOME COMPLETO */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo <span className="text-red-500">*</span></label>
                        <input 
                          required 
                          type="text" 
                          value={buyerData.nome}
                          onChange={(e) => setBuyerData({...buyerData, nome: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:border-vcl-red outline-none" 
                        />
                      </div>

                      {/* TELEMÓVEL */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telemóvel <span className="text-red-500">*</span></label>
                        <input 
                          required 
                          type="tel" 
                          value={buyerData.telemovel}
                          onChange={(e) => setBuyerData({...buyerData, telemovel: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:border-vcl-red outline-none" 
                          placeholder="Ex: 910000000"
                        />
                      </div>

                      {/* Nº DE SÓCIO */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nº de Sócio (Opcional)</label>
                        <input 
                          type="text" 
                          value={buyerData.socioNum}
                          onChange={(e) => setBuyerData({...buyerData, socioNum: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:border-vcl-red outline-none" 
                        />
                      </div>
                    </form>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                      <Banknote size={18}/> Pagamento
                    </h3>
                    <p className="text-sm text-yellow-900 mb-3">Transferência Bancária</p>
                    <div className="bg-white p-3 rounded border border-yellow-300 font-mono font-bold text-center text-gray-700 select-all">
                      PT50 0036 0000 9910 5922 9832 5
                    </div>
                    <p className="text-xs text-center text-yellow-700 mt-2">Copia o IBAN acima.</p>
                  </div>
                </div>
              )}

              {/* PASSO 3: SUCESSO */}
              {checkoutStep === 'success' && (
                <div className="text-center py-10 animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-vcl-black mb-2">Encomenda Registada!</h3>
                  <p className="text-gray-600 mb-6">Obrigado pela tua compra, {buyerData.nome}.</p>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 text-left mb-6">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <AlertCircle size={18}/> Próximos Passos:
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                      <li>Realiza a transferência para o IBAN indicado.</li>
                      <li>
                        Envia o comprovativo para: <br/>
                        <span className="font-bold text-blue-600 select-all">marketing.vitoriacl@gmail.com</span>
                      </li>
                      <li>Levanta a tua encomenda na <span className="font-bold">Secretaria do Clube</span>.</li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => {setCart([]); setIsCartOpen(false); setCheckoutStep('cart');}}
                    className="bg-vcl-black text-white px-6 py-3 rounded-full font-bold w-full hover:bg-gray-800"
                  >
                    Fechar Loja
                  </button>
                </div>
              )}

            </div>

            {/* Footer do Carrinho (Total e Botões) */}
            {checkoutStep !== 'success' && (
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">Total a pagar</span>
                  <span className="text-2xl font-black text-vcl-red">{total.toFixed(2)}€</span>
                </div>

                {checkoutStep === 'cart' ? (
                  <button 
                    onClick={() => setCheckoutStep('form')}
                    disabled={cart.length === 0}
                    className="w-full bg-vcl-black text-white py-3 rounded-lg font-bold uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Finalizar Compra
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCheckoutStep('cart')}
                      className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                    >
                      Voltar
                    </button>
                    <button 
                      type="submit" 
                      form="checkout-form"
                      className="flex-[2] bg-vcl-red text-white py-3 rounded-lg font-bold uppercase hover:bg-red-700 transition"
                    >
                      Confirmar
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

// ---------------------------------------------------------------------------
// COMPONENTE DO CARTÃO DE PRODUTO
// ---------------------------------------------------------------------------
// Este componente foi mantido para preservar a estrutura da loja e permitir
// a futura evolução para produtos reais. No momento atual, usamos uma versão
// de destaque com a imagem promocional e sem ações de compra.
const ProductCard = ({ product, onAdd }) => {
  const [size, setSize] = useState('M'); // Tamanho padrão para produtos de vestuário.

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.12)] overflow-hidden group border border-gray-100 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-vcl-red/5 via-transparent to-transparent" />
      <div className="relative p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        <div className="relative flex-1 flex items-center justify-center min-h-[420px] w-full lg:w-auto">
          <div className="absolute inset-x-10 top-8 h-32 bg-vcl-red/10 blur-3xl rounded-full" />
          <div
            className="relative w-full max-w-[420px] transition-all duration-700 ease-out group-hover:scale-[1.03]"
            style={{
              transform: 'perspective(1200px) rotateX(10deg) rotateY(-18deg) rotateZ(-3deg)',
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 28px 26px rgba(136, 12, 20, 0.2))',
            }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-1"
                style={{ transform: 'rotateY(10deg) rotateX(6deg)' }}
              />
            ) : (
              <div className="text-gray-300 font-bold text-4xl">FOTO</div>
            )}
          </div>
        </div>

        <div className="relative flex-1 text-center lg:text-left max-w-xl">
          <span className="inline-block px-4 py-2 rounded-full bg-vcl-red/10 text-vcl-red text-xs font-black uppercase tracking-[0.24em] mb-5">
            Novo lançamento
          </span>
          <h3 className="font-black text-3xl md:text-5xl text-vcl-black leading-tight mb-4">
            {product.name}
          </h3>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
            Estamos a preparar a próxima coleção oficial do Vitória Clube de Lisboa. Fica atento às novidades e acompanha a nossa loja em breve.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <button
              disabled
              className="bg-vcl-black text-white px-6 py-3 rounded-full font-bold cursor-not-allowed opacity-80"
            >
              Em breve
            </button>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
              Por anunciar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loja;