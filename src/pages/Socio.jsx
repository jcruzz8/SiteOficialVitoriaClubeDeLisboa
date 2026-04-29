import React, { useState } from 'react';
import { Check, CreditCard, Heart, FileText, UserPlus, ChevronLeft, ChevronRight, Star, X, Loader, Send, AlertCircle, Banknote, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Socio = () => {
  const [startIndex, setStartIndex] = useState(0);

  // --- ESTADOS DO FORMULÁRIO (MODAL) ---
  const [showModal, setShowModal] = useState(false);
  const [tipoInscricao, setTipoInscricao] = useState('novo'); 
  const [formStatus, setFormStatus] = useState('idle'); 
  
  // --- ESTADO DO BOTÃO DE EMAIL (NOVO) ---
  const [showEmail, setShowEmail] = useState(false);

  // Estado para guardar os dados do formulário
  const [formData, setFormData] = useState({
    plano: 'Homens Efetivos',
    numSocio: '',
    nome: '',
    cartaoCidadao: '',
    sexo: 'Masculino',
    estadoCivil: 'Solteiro',
    naturalidade: '',
    dataNascimento: '',
    nomePai: '',
    nomeMae: '',
    socioProponente: '',
    habilitacoes: '',
    profissao: '',
    empresa: '',
    morada: '',
    localidade: '',
    pais: 'Portugal',
    telefone: '',
    telemovel: '',
    email: ''
  });

  // --- DADOS DOS PLANOS ---
  const planosOriginais = [
    { categoria: "Pessoa Colectiva", mensal: "3.00€", anual: "39,00€", obs: "Empresas e Associações.", destaque: false },
    { categoria: "Homens Efetivos", mensal: "1.50€", anual: "19,50€", obs: "Adultos do sexo masculino.", destaque: true },
    { categoria: "Mulheres Efetivas", mensal: "0.75€", anual: "9,75€", obs: "Adultos do sexo feminino." },
    { categoria: "Homens Reformados", mensal: "0.75€", anual: "9,75€", obs: "Jovens de espírito." },
    { categoria: "Homens Menores", mensal: "0.50€", anual: "6,50€", obs: "Dos 10 aos 18 anos." },
    { categoria: "Mulheres Reformadas", mensal: "0.50€", anual: "6,50€", obs: "Senhoras reformadas." },
    { categoria: "Mulheres Menores", mensal: "0.50€", anual: "6,50€", obs: "Dos 10 aos 18 anos." },
  ];

  // Helper para converter "19,50€" em numero 19.50
  const getPrecoNumerico = (precoStr) => {
    return parseFloat(precoStr.replace('€', '').replace(',', '.'));
  };

  // Helper para obter o preço do plano selecionado
  const getPrecoPlanoSelecionado = () => {
    const plano = planosOriginais.find(p => p.categoria === formData.plano);
    return plano ? getPrecoNumerico(plano.anual) : 0;
  };

  const planosParaRenderizar = [...planosOriginais, ...planosOriginais.slice(0, 3)];

  const nextSlide = () => setStartIndex((prev) => (prev >= planosOriginais.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setStartIndex((prev) => (prev <= 0 ? planosOriginais.length - 1 : prev - 1));

  // --- LÓGICA DO FORMULÁRIO ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Prepara os dados para o Web3Forms
    const object = {
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
      subject: `Nova Inscrição Sócio: ${formData.nome}`,
      from_name: "Site VCL Inscrições",
      ...formData, // Envia todos os campos do formulário
      // Campos extra calculados
      _total_pagar: `${(getPrecoPlanoSelecionado() + (tipoInscricao === 'novo' ? 7.50 : 0)).toFixed(2)}€`,
      _tipo_inscricao: tipoInscricao
    };

    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      
      const resData = await res.json();

      if (resData.success) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  const resetForm = () => {
    setFormStatus('idle');
    setFormData(prev => ({
      ...prev,
      numSocio: '', nome: '', cartaoCidadao: '', sexo: 'Masculino', estadoCivil: 'Solteiro',
      naturalidade: '', dataNascimento: '', nomePai: '', nomeMae: '', socioProponente: '',
      habilitacoes: '', profissao: '', empresa: '', morada: '', localidade: '',
      pais: 'Portugal', telefone: '', telemovel: '', email: ''
    }));
  };

  // --- CÁLCULOS FINAIS ---
  const valorPlano = getPrecoPlanoSelecionado();
  const custoExtra = tipoInscricao === 'novo' ? 7.50 : 0; // Jóia + Cartão
  const totalPagar = tipoInscricao === 'novo' ? valorPlano + custoExtra : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>Sócios | Vitória Clube de Lisboa</title>
        <meta name="description" content="Junte-se ao Vitória Clube de Lisboa. Torne-se sócio e faça parte da nossa família. Planos acessíveis e benefícios exclusivos." />
      </Helmet>
      
      {/* 1. HERO HEADER */}
      <div className="bg-vcl-black text-white py-20 px-4 text-center border-b-4 border-vcl-red">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
            <Heart size={16} className="text-white fill-white animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">Paixão Eterna</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-md uppercase">
            FAZ-TE <span className="text-vcl-red">SÓCIO</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            A tua quota mantém o clube vivo. Junta-te à família vitoriana e contribui para o futuro dos nossos atletas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        
        {/* 2. CARROSSEL DE PLANOS */}
        <div className="relative group">
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-30 bg-white text-vcl-black p-3 rounded-full shadow-lg hover:bg-vcl-red hover:text-white transition border border-gray-100"><ChevronLeft size={24} /></button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-30 bg-white text-vcl-black p-3 rounded-full shadow-lg hover:bg-vcl-red hover:text-white transition border border-gray-100"><ChevronRight size={24} /></button>

          <div className="overflow-hidden py-10 px-2">
            <div className="flex transition-transform duration-500 ease-in-out gap-6" style={{ transform: `translateX(-${startIndex * (window.innerWidth >= 768 ? 33.33 : 100)}%)` }}>
              {planosParaRenderizar.map((plano, index) => (
                <div key={index} className="min-w-full md:min-w-[calc(33.333%-1rem)]">
                  <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 h-full flex flex-col relative transition-all duration-300 ${plano.destaque ? 'border-vcl-red shadow-red-100 scale-105 z-10' : 'border-transparent hover:border-gray-200'}`}>
                    {plano.destaque && (<div className="bg-vcl-red text-white text-xs font-bold text-center py-1 uppercase tracking-widest flex items-center justify-center gap-1"><Star size={12} className="fill-white"/> Mais Popular</div>)}
                    <div className="p-8 flex-grow flex flex-col justify-between">
                      <div><h3 className={`text-xl font-bold mb-2 ${plano.destaque ? 'text-vcl-red' : 'text-vcl-black'}`}>{plano.categoria}</h3><p className="text-gray-400 text-sm mb-6">{plano.obs}</p></div>
                      <div>
                        <div className="flex items-baseline gap-1 mb-2"><span className="text-4xl font-black text-vcl-black">{plano.anual}</span><span className="text-gray-500 font-medium">/ano</span></div>
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 inline-block w-full text-center">{plano.mensal} <span className="text-gray-400">x 13 meses</span></div>
                      </div>
                    </div>
                    <div className="px-8 pb-8">
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-green-500 shrink-0" /> Cartão De Sócio</li>
                        <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-green-500 shrink-0" /> Voto Assembleias</li>
                        <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-green-500 shrink-0" /> Apoio ao clube</li>
                      </ul>
                      <button 
                        onClick={() => {
                          setFormData(prev => ({...prev, plano: plano.categoria}));
                          setShowModal(true);
                        }} 
                        className={`w-full py-3 rounded-lg font-bold uppercase transition shadow-lg ${plano.destaque ? 'bg-vcl-red text-white hover:bg-red-700' : 'bg-vcl-black text-white hover:bg-gray-800'}`}
                      >
                        Escolher
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-2">{planosOriginais.map((_, idx) => (<button key={idx} onClick={() => setStartIndex(idx)} className={`h-2 rounded-full transition-all ${idx === startIndex ? 'bg-vcl-red w-6' : 'bg-gray-300 w-2'}`}/>))}</div>
        </div>

        {/* 3. INFORMAÇÃO NOVOS SÓCIOS */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg border-l-8 border-vcl-red p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="bg-red-50 p-4 rounded-full text-vcl-red hidden sm:block"><UserPlus size={32} /></div>
            <div>
              <h3 className="text-2xl font-bold text-vcl-black mb-2">Novo Sócio?</h3>
              <p className="text-gray-600 max-w-xl">Se te estás a inscrever pela primeira vez, existe um custo único de entrada (Jóia + Cartão).</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg"><span className="block text-xs text-gray-500 uppercase font-bold">Jóia</span><span className="text-lg font-bold text-vcl-black">6,00€</span></div>
                <div className="flex items-center text-gray-400">+</div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg"><span className="block text-xs text-gray-500 uppercase font-bold">Cartão</span><span className="text-lg font-bold text-vcl-black">1,50€</span></div>
                <div className="flex items-center text-gray-400">=</div>
                <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-lg"><span className="block text-xs text-vcl-red uppercase font-bold">Total Extra</span><span className="text-lg font-black text-vcl-red">7,50€</span></div>
              </div>
            </div>
          </div>
          <div className="text-right min-w-[200px]"><div className="text-sm text-gray-500 mb-1 font-bold">Nota Importante</div><div className="text-xs text-gray-400 italic">O pagamento das quotas é sempre feito anualmente (referente a 13 meses).</div></div>
        </div>

        {/* 4. TERMOS & CTA */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="md:col-span-2 bg-gray-100 rounded-xl p-8 border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-gray-400 font-bold uppercase text-xs tracking-widest"><FileText size={14} /> Regulamento Interno</div>
            <h4 className="font-bold text-vcl-black mb-3">Sócios Reformados & Quotas Diferenciadas</h4>
            <p className="text-sm text-gray-600 leading-relaxed text-justify">Os sócios efectivos reformados, cuja pensão de reforma ou outra seja inferior a um salário mínimo nacional, fazendo prova anual, com documento comprovativo do valor da sua pensão, até ao final do mês de Novembro ou quando solicitado pela Direção, terão uma quota diferenciada do valor da quota estipulada para os sócios efetivos, não podendo nunca ser superior a 50% da quota mais elevada que estiver estipulada para os sócios efetivos.</p>
          </div>
          <div className="md:col-span-1 bg-vcl-red text-white rounded-xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <Heart size={48} className="mb-4 animate-pulse" />
            <h4 className="font-bold text-xl mb-2 uppercase">Compromisso de Honra</h4>
            <p className="italic font-serif text-lg opacity-90">"Prometo amar este clube com todo o meu coração."</p>
          </div>
        </div>

        {/* 5. CTA FINAL */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-vcl-black mb-6">Pronto para fazer parte da história?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setShowModal(true)} className="bg-vcl-black text-white px-8 py-4 rounded-full font-bold uppercase hover:bg-gray-800 transition shadow-xl flex items-center justify-center gap-2">
              <CreditCard size={20}/> Preencher Ficha de Sócio
            </button>
            
            {/* BOTÃO QUE MUDA O TEXTO */}
            <button 
              onClick={() => setShowEmail(!showEmail)} 
              className="bg-white text-vcl-black border border-gray-300 px-8 py-4 rounded-full font-bold uppercase hover:bg-gray-50 transition flex items-center justify-center gap-2 min-w-[280px]"
            >
              {showEmail ? (
                <>
                  <Mail size={20} className="text-vcl-red"/>
                  <span className="text-sm lowercase">marketing.vitoriacl@gmail.com</span>
                </>
              ) : (
                "Contactar Secretaria"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL DO FORMULÁRIO --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* CABEÇALHO */}
            <div className="bg-vcl-black text-white p-6 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-vcl-red" /> Ficha de Inscrição
              </h2>
              <button onClick={() => {setShowModal(false); resetForm();}} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
            </div>

            {/* CONTEÚDO COM SCROLL */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              
              {/* SUCESSO */}
              {formStatus === 'success' ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={48} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-vcl-black mb-2">Pedido Enviado com Sucesso!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Agradecemos o teu interesse em fazer parte da família vitoriana. A Direção irá analisar o teu pedido brevemente.
                  </p>
                  
                  {/* INSTRUÇÕES FINAIS (FOTO + TRANSFERÊNCIA) */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-xl mx-auto text-left mb-8 shadow-sm">
                    <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-4 text-lg">
                      <AlertCircle size={20} /> Passos para Finalizar:
                    </h4>
                    <p className="text-blue-800 mb-3">Para {tipoInscricao === 'novo' ? 'emitirmos o teu cartão e validarmos a inscrição' : 'atualizarmos os teus dados'}, envia os seguintes documentos para o nosso email:</p>
                    
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-blue-700 font-bold">
                        <Check size={16} /> Uma Foto (Atual) Tipo Cartão De Cidadão Ou Passe
                      </li>
                      {tipoInscricao === 'novo' && (
                        <li className="flex items-center gap-2 text-blue-700 font-bold">
                          <Check size={16} /> O Comprovativo da Transferência Bancária
                        </li>
                      )}
                    </ul>

                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-xs text-blue-500 uppercase font-bold mb-1">Email para envio:</p>
                      <div className="bg-white p-3 rounded border border-blue-200 text-center font-mono text-blue-600 font-bold select-all">
                        marketing.vitoriacl@gmail.com
                      </div>
                    </div>
                  </div>

                  <button onClick={() => {setShowModal(false); resetForm();}} className="bg-vcl-black text-white px-8 py-3 rounded-lg font-bold uppercase hover:bg-gray-800">
                    Fechar Janela
                  </button>
                </div>
              ) : (
                /* FORMULÁRIO */
                <form onSubmit={handleSubmit}>
                  
                  {/* SELEÇÃO DO TIPO */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-gray-100 p-2 rounded-lg">
                    <button type="button" onClick={() => setTipoInscricao('novo')} className={`flex-1 py-3 px-4 rounded-md font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 ${tipoInscricao === 'novo' ? 'bg-vcl-red text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}><UserPlus size={18} /> Novo Sócio</button>
                    <button type="button" onClick={() => setTipoInscricao('atualizar')} className={`flex-1 py-3 px-4 rounded-md font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 ${tipoInscricao === 'atualizar' ? 'bg-vcl-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}><FileText size={18} /> Atualização de Dados</button>
                  </div>

                  {/* SELEÇÃO DE PLANO DESEJADO */}
                  <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <label className="block text-xs font-bold text-yellow-800 uppercase mb-2">Plano Desejado</label>
                    <select name="plano" value={formData.plano} onChange={handleInputChange} className="w-full p-3 border border-yellow-300 rounded focus:border-vcl-red outline-none bg-white font-bold text-vcl-black">
                      {planosOriginais.map((p, idx) => (
                        <option key={idx} value={p.categoria}>{p.categoria} ({p.anual}/ano)</option>
                      ))}
                    </select>
                    <p className="text-xs text-yellow-700 mt-2 italic">O preço total será calculado no final do formulário.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campos de Identificação */}
                    {tipoInscricao === 'atualizar' && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nº Atual de Sócio</label>
                        <input required name="numSocio" value={formData.numSocio} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-black outline-none bg-gray-50" placeholder="Ex: 1234" />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                      <input required name="nome" value={formData.nome} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" />
                    </div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cartão de Cidadão</label><input required name="cartaoCidadao" value={formData.cartaoCidadao} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data de Nascimento</label><input required name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} type="date" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sexo</label><select name="sexo" value={formData.sexo} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none bg-white"><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option></select></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado Civil</label><select name="estadoCivil" value={formData.estadoCivil} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none bg-white"><option value="Solteiro">Solteiro(a)</option><option value="Casado">Casado(a)</option><option value="Divorciado">Divorciado(a)</option><option value="Viuvo">Viúvo(a)</option></select></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Naturalidade</label><input required name="naturalidade" value={formData.naturalidade} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    
                    {/* Filiação */}
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Pai</label><input required name="nomePai" value={formData.nomePai} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Mãe</label><input required name="nomeMae" value={formData.nomeMae} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    
                    {tipoInscricao === 'novo' && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sócio Proponente (Opcional)</label>
                        <input name="socioProponente" value={formData.socioProponente} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" placeholder="Nome ou Nº de quem te convidou" />
                      </div>
                    )}

                    {/* Dados Profissionais e Morada */}
                    <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2"><p className="text-sm font-bold text-vcl-black mb-4 uppercase tracking-wider">Dados Profissionais</p></div>
                    <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Habilitações Literárias</label><input required name="habilitacoes" value={formData.habilitacoes} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profissão</label><input required name="profissao" value={formData.profissao} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Empresa</label><input required name="empresa" value={formData.empresa} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>

                    <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2"><p className="text-sm font-bold text-vcl-black mb-4 uppercase tracking-wider">Morada e Contactos</p></div>
                    <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Morada Completa</label><input required name="morada" value={formData.morada} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Localidade</label><input required name="localidade" value={formData.localidade} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">País</label><input required name="pais" value={formData.pais} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone Fixo (Opcional)</label><input name="telefone" value={formData.telefone} onChange={handleInputChange} type="tel" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telemóvel</label><input required name="telemovel" value={formData.telemovel} onChange={handleInputChange} type="tel" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                    <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full p-3 border border-gray-300 rounded focus:border-vcl-red outline-none" /></div>
                  </div>

                  {/* RESUMO DE PAGAMENTO */}
                  {totalPagar > 0 && (
                    <div className="mt-8 bg-zinc-100 rounded-xl p-6 border border-zinc-200">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-vcl-black"><Banknote size={20} /> Resumo de Contas</h3>
                      <div className="flex flex-col gap-2 mb-4 text-sm text-gray-700">
                        <div className="flex justify-between"><span>Quota Anual ({formData.plano}):</span><span className="font-bold">{valorPlano.toFixed(2).replace('.', ',')}€</span></div>
                        {tipoInscricao === 'novo' && (<div className="flex justify-between text-vcl-red"><span>Jóia + Cartão (Taxa Única):</span><span className="font-bold">7,50€</span></div>)}
                        <div className="border-t border-gray-300 my-1"></div>
                        <div className="flex justify-between text-lg font-black text-vcl-black"><span>TOTAL A PAGAR:</span><span>{totalPagar.toFixed(2).replace('.', ',')}€</span></div>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-300">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Método de Pagamento: Transferência Bancária</p>
                        <p className="text-sm mb-2 text-gray-600">Por favor realiza a transferência para o seguinte IBAN:</p>
                        <div className="font-mono text-lg font-bold text-center bg-gray-50 p-2 rounded tracking-wider border border-gray-200 select-all">PT50 0036 0000 9910 5922 9832 5</div>
                        <p className="text-xs text-center text-gray-400 mt-2">Copia este IBAN para o teu Homebanking</p>
                      </div>
                    </div>
                  )}

                  {totalPagar === 0 && (
                    <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                      <h3 className="font-bold text-lg mb-2 text-green-800">Atualização Gratuita</h3>
                      <p className="text-green-700">A atualização dos dados de sócio não tem qualquer custo associado.</p>
                    </div>
                  )}

                  {formStatus === 'error' && <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-6 text-sm font-bold text-center">Ocorreu um erro ao enviar.</div>}

                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                    <button type="button" onClick={() => {setShowModal(false); resetForm();}} className="flex-1 px-6 py-3 rounded-lg font-bold uppercase text-gray-500 hover:bg-gray-100 transition">Cancelar</button>
                    <button type="submit" disabled={formStatus === 'submitting'} className="flex-[2] bg-vcl-black text-white px-6 py-3 rounded-lg font-bold uppercase hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                      {formStatus === 'submitting' ? <><Loader className="animate-spin" /> A Enviar...</> : <><Send size={18} /> Enviar Proposta</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Socio;