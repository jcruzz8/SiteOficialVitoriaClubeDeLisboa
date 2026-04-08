import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // O hook useLocation "escuta" em que página o utilizador está
  const { pathname } = useLocation();

  useEffect(() => {
    // Sempre que o pathname (o link) mudar, faz scroll imediato para o topo (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  // Este componente não renderiza nada no ecrã, funciona apenas nos bastidores
  return null;
};

export default ScrollToTop;