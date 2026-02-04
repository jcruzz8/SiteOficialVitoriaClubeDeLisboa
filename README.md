# Vitória Clube de Lisboa - Site Oficial

Site oficial do Vitória Clube de Lisboa, desenvolvido com React + Vite.

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **React Helmet Async** - Gerenciamento de meta tags
- **PapaParse** - Parsing de CSV
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🛠️ Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd vitoria-clube-site
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` e preencha com suas chaves reais:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=sua-chave-web3forms-aqui
   VITE_ADMIN_PASSWORD=sua-senha-admin-aqui
   VITE_GOOGLE_SHEETS_JOGOS=url-do-seu-google-sheets-jogos
   VITE_GOOGLE_SHEETS_TABELA=url-do-seu-google-sheets-tabela
   VITE_GOOGLE_SHEETS_PLANTEL=url-do-seu-google-sheets-plantel
   VITE_GOOGLE_SHEETS_EDICAO=url-do-seu-google-sheets-edicao
   ```

## 🔐 Configurações de Segurança

### Chaves e Senhas Protegidas

Todas as informações sensíveis são armazenadas em variáveis de ambiente:

- **Web3Forms API Key**: Para envio de formulários de contato
- **Senha de Admin**: Acesso à área administrativa
- **URLs do Google Sheets**: Links para dados públicos das planilhas

### Arquivos Ignorados pelo Git

O arquivo `.env` contém informações reais e **NUNCA** deve ser commitado. Ele já está no `.gitignore`.

## 🚀 Executando o Projeto

### Desenvolvimento:
```bash
npm run dev
```

### Build para produção:
```bash
npm run build
```

### Preview da build:
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
vitoria-clube-site/
├── public/              # Arquivos estáticos
├── src/
│   ├── assets/          # Imagens e recursos
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Ponto de entrada
├── .env                 # Variáveis de ambiente (não commitar)
├── .env.example         # Exemplo das variáveis necessárias
└── .gitignore           # Arquivos ignorados pelo Git
```

## 🔧 Funcionalidades

- ✅ Página inicial com próximos jogos
- ✅ Seção de futebol (resultados, tabela, plantel)
- ✅ Modalidades (Boxe e Muay Thai)
- ✅ História do clube
- ✅ Loja oficial com carrinho de compras
- ✅ Inscrição de sócios
- ✅ Área administrativa protegida
- ✅ SEO otimizado com React Helmet
- ✅ Design responsivo com Tailwind CSS

## 📞 Contato

Para dúvidas sobre o desenvolvimento ou configuração, entre em contato com a equipe técnica.

---

**Vitória Clube de Lisboa** - *A União Faz a Força*
