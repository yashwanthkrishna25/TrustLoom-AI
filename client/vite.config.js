import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], preview: { port: 3000, proxy: { '/api': 'http://localhost:5050' } }, server: { port: 3000, proxy: { '/api': 'http://localhost:5050' } } });
