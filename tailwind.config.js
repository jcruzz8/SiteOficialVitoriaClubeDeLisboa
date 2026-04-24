/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores extraídas/baseadas no logo do VCL
        'vcl-red': '#E60000',    // Vermelho vibrante
        'vcl-black': '#0a0a0a',  // Preto quase total (melhor para ecrãs)
        'vcl-gold': '#D4AF37',   // Dourado da coroa
        'vcl-white': '#ffffff',
      },
      fontFamily: {
        // Vamos usar a fonte padrão por enquanto, depois podemos mudar
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}