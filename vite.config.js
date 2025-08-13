import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteImagemin from 'vite-plugin-imagemin';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // 将 /api 开头的请求代理到后端服务器
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 必须设置为 true，以确保正确的源头
        // 如果后端API本身没有/api前缀，可以在这里重写路径
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 65 },
      pngquant: { quality: [0.65, 0.9], speed: 4 },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
    }),
    visualizer({
        open: true, // 在构建完成后自动打开分析报告
        filename: 'dist/stats.html', // 分析报告的输出路径
        gzipSize: true, // 显示Gzip后的大小
        brotliSize: true, // 显示Brotli压缩后的大小
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }
})