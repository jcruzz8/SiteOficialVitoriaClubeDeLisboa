import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Trash2, Check, Banknote, ShoppingBag, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// --- IMPORTA AS TUAS IMAGENS AQUI ---
// Certifica-te que os nomes dos ficheiros na pasta assets correspondem a estes imports
import camisolaVermelha from '../assets/CamisolaVermelha.png';
import camisolaBranca from '../assets/CamisolaBranca.png';
import camisolaPreta from '../assets/CamisolaPreta.png';
import camisolaGR from '../assets/CamisolaGR.png';
import kitJogo from '../assets/KitJogo.png';
import kitGR from '../assets/KitGR.png';
import kitTreino from '../assets/KitTreino.png';
import fatoTreino from '../assets/FatoTreino.png';
import impermeavel from '../assets/Impermeavel.png';
import cachecolVCL from '../assets/Cachecol.png';
import cachecolSub from '../assets/CachecolSublimado.png';
import malaViagem from '../assets/MalaViagem.png';

const Loja = () => {
  // --- DADOS DOS PRODUTOS (Atualizado com a nova lista) ---
  const products = [
    // Escalão de Preços: 20€
    { id: 1, name: 'Camisola Principal (Vermelha)', price: 20, image: camisolaVermelha, type: 'wear' },
    { id: 2, name: 'Camisola Alternativa (Branca)', price: 20, image: camisolaBranca, type: 'wear' },
    { id: 3, name: 'Camisola Alternativa (Preta)', price: 20, image: camisolaPreta, type: 'wear' },
    { id: 4, name: 'Camisola Guarda-Redes', price: 20, image: camisolaGR, type: 'wear' },
    
    // Kits e Conjuntos
    { id: 5, name: 'Kit de Jogo Completo', price: 35, image: kitJogo, type: 'wear' },
    { id: 6, name: 'Kit de Guarda-Redes', price: 35, image: kitGR, type: 'wear' },
    { id: 7, name: 'Kit de Treino', price: 25, image: kitTreino, type: 'wear' },
    { id: 8, name: 'Fato de Treino', price: 40, image: fatoTreino, type: 'wear' },
    { id: 9, name: 'Impermeável', price: 25, image: impermeavel, type: 'wear' },

    // Acessórios
    { id: 10, name: 'Cachecol VCL Tradicional', price: 10, image: cachecolVCL, type: 'acc' },
    { id: 11, name: 'Cachecol Sublimado', price: 7.50, image: cachecolSub, type: 'acc' },
    { id: 12, name: 'Mala de Viagem', price: 30, image: malaViagem, type: 'acc' },
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
        <title>Vitória Clube de Lisboa - Loja Oficial</title>
        <meta name="description" content="Loja oficial do Vitória Clube de Lisboa. Compre camisolas, kits de treino e acessórios oficiais do clube." />
      </Helmet>

      {/* 1. HERO HEADER */}
      <div className="bg-[#7f1d1d] text-white py-20 px-4 text-center border-b-4 border-vcl-gold">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-black/20 border border-white/10 px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
            <ShoppingBag size={16} className="text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-100">Loja Oficial</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-md">
            VESTE A NOSSA <span className="text-black">ALMA</span>
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto font-light">
            Equipamentos oficiais e acessórios. Mostra as tuas cores onde quer que vás.
          </p>
        </div>
      </div>

      {/* 2. GRELHA DE PRODUTOS */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
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

// --- COMPONENTE DO CARTÃO DE PRODUTO ---
const ProductCard = ({ product, onAdd }) => {
  const [size, setSize] = useState('M'); // Tamanho default

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:-translate-y-1 transition duration-300 border border-gray-100 flex flex-col">
      <div className="relative h-64 bg-gray-100 overflow-hidden flex items-center justify-center p-4">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-auto object-contain group-hover:scale-110 transition duration-500" />
        ) : (
          <div className="text-gray-300 font-bold text-4xl">FOTO</div>
        )}
        <div className="absolute top-3 right-3 bg-vcl-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {product.price.toFixed(2)}€
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-vcl-black mb-2 leading-tight flex-1">{product.name}</h3>
        
        <div className="mt-4 flex items-center gap-3">
          {product.type === 'wear' ? (
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value)}
              className="bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-vcl-red focus:border-vcl-red block p-2.5 font-bold outline-none cursor-pointer"
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          ) : (
            <div className="text-sm text-gray-400 font-bold px-2">Tamanho Único</div>
          )}

          <button 
            onClick={() => onAdd(product, product.type === 'wear' ? size : 'Único')}
            className="flex-1 bg-vcl-black text-white hover:bg-vcl-red focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-2 transition duration-300"
          >
            <Plus size={16}/> Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loja;