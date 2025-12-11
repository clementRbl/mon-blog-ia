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
        // Ombre style papier ancien
        'retro': '4px 4px 0px 0px rgba(139, 115, 85, 0.2)', 
        'retro-hover': '6px 6px 0px 0px rgba(139, 115, 85, 0.4)', 
        'paper': '2px 2px 8px rgba(44, 36, 22, 0.1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}