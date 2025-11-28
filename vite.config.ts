import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to avoid TS error 'Property cwd does not exist on type Process'
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // 重要: GitHub Pagesなどのサブディレクトリでのデプロイに対応するため相対パスにする
    base: './', 
    define: {
      // process.env.API_KEY をコード内で使えるようにする
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || ''),
      // その他の process.env 参照によるエラーを防ぐ
      'process.env': {}
    }
  };
});