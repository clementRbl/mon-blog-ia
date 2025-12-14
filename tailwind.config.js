/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [], 
  theme: {
    extend: {
      colors: {
        // Palette Vintage "Papier Ancien"
        om: {
          sepia: '#8B7355',     // Brun sépia pour les accents
          gold: '#BEA064',      // Or vintage
          dark: '#2C2416',      // Noir encre vieillie
          paper: '#Fdfbf7',     // Blanc cassé papier
          paperDark: '#F2efe6', // Beige papier ancien
          rust: '#A0522D',      // Rouille pour les détails
          ink: '#3D3026',       // Encre brune
          // Palette Mode Sombre
          darkBg: '#1A1612',    // Fond sombre principal
          darkPaper: '#252018', // Fond sombre papier
          darkText: '#E5DFD4',  // Texte clair
          darkGold: '#D4B574',  // Or lumineux pour le mode sombre
          darkSepia: '#B89968', // Sépia clair
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lora"', 'sans-serif'],        
        mono: ['"JetBrains Mono"', 'monospace'], 
      },
      boxShadow: {
        // Ombres vintage prononcées et colorées
        'retro': '5px 5px 0px 0px rgba(160, 82, 45, 0.25), 10px 10px 20px -5px rgba(139, 115, 85, 0.15)', 
        'retro-hover': '8px 8px 0px 0px rgba(160, 82, 45, 0.35), 15px 15px 30px -5px rgba(139, 115, 85, 0.25)', 
        'paper': '3px 3px 12px rgba(44, 36, 22, 0.15), 1px 1px 3px rgba(160, 82, 45, 0.1)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}