import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 重要: GitHub Pagesなどのサブディレクトリでのデプロイに対応するため相対パスにする
  base: './',
});