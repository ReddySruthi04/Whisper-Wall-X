module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#2563EB',
          background: '#FAFAFA',
          foreground: '#18181B',
          card: '#FFFFFF',
          border: '#E5E5E5',
          'primary-foreground': '#FFFFFF',
          'muted-foreground': '#71717A',
          ring: '#BFDBFE',
        },
      },
    },
    plugins: [],
  }