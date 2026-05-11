export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#B4A17A',
        goldDark: '#8E7C59',
        ivory: '#FBF9F5'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.06)'
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        nav: ['var(--font-nav)', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
