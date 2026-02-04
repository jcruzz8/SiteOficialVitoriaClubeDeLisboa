import React from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-vcl-black text-white pt-16 pb-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* AQUI ESTÁ A CORREÇÃO: grid-cols-4 e todos os filhos ocupam apenas 1 coluna */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-sm">
          
          {/* 1. SOBRE O CLUBE */}
          <div>
            <h3 className="text-2xl font-black italic mb-4">VCL<span className="text-vcl-red">1944</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              O orgulho do bairro, a força de uma comunidade.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/vitoriaclubelisboa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-zinc-800 p-2 rounded-full hover:bg-[#1877F2] hover:text-white transition duration-300 group"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/vitoriaclubedelisboa/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-zinc-800 p-2 rounded-full hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:text-white transition duration-300 group"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* 2. LINKS RÁPIDOS */}
          <div>
            <h4 className="font-bold text-vcl-gold uppercase tracking-widest text-xs mb-6">Explorar</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Início</Link></li>
              <li><Link to="/futebol" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Futebol</Link></li>
              <li><Link to="/loja" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Loja Oficial</Link></li>
              <li><Link to="/socio" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Ser Sócio</Link></li>
            </ul>
          </div>

          {/* 3. CONTACTOS (Agora ocupa apenas 1 coluna para caber na linha) */}
          <div>
            <h4 className="font-bold text-vcl-gold uppercase tracking-widest text-xs mb-6">Contactos</h4>
            <div className="flex flex-col gap-4 text-gray-400">
              <div className="flex items-center gap-3">
                <Mail className="text-vcl-red shrink-0" size={18} />
                <span className="truncate">marketing.vitoriacl@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-vcl-red shrink-0" size={18} />
                <span>+351 xxx xxx xxx</span>
              </div>
            </div>
          </div>

          {/* 4. LOCALIZAÇÃO (Fica na 4ª coluna da mesma linha) */}
          <div>
            <h4 className="font-bold text-vcl-gold uppercase tracking-widest text-xs mb-6">Onde Estamos</h4>
            <div className="flex flex-col gap-4 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="text-vcl-red shrink-0 mt-1" size={18} />
                <span>R. Silveira Peixoto 7<br/><span className="text-xs text-gray-500">(SEDE)</span></span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-vcl-red shrink-0 mt-1" size={18} />
                <span>Calçada Carrascal 189<br/><span className="text-xs text-gray-500">(CAMPO)</span></span>
              </div>
            </div>
          </div>

        </div>

        {/* BARRA DE COPYRIGHT */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Vitória Clube de Lisboa. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            A <span className="text-vcl-red font-bold"> UNIÃO </span> FAZ A <span className="text-vcl-red font-bold"> FORÇA </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;