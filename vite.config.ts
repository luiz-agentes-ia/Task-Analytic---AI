import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo (development/production)
  // O terceiro argumento '' permite carregar todas as variáveis, não apenas as que começam com VITE_
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Isso é necessário para que o SDK do Google GenAI consiga ler process.env.API_KEY
      // dentro do navegador, já que o Vite normalmente usa import.meta.env
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});