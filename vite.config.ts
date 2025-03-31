import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [fileURLToPath(new URL('./src/assets/icons', import.meta.url))],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  server: {
    // 服务启动时是否自动打开浏览器
    open: true,
    host: '0.0.0.0',
    port: 3333,
    // 本地跨域代理 -> 代理到服务器的接口地址
    proxy: {
      '/dev-api': {
        target: 'http://localhost:2222', // 后台服务器地址
        changeOrigin: true, // 是否允许不同源
        secure: false, // 支持https
        // rewrite: (path) => path.replace(/^\/dev-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
