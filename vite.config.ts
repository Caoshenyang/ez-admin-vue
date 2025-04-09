import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Inspect from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),

      ],
      dts: fileURLToPath(new URL('./auto-imports.d.ts', import.meta.url))
    }),
    Components({
      resolvers: [ ElementPlusResolver()],
      dts: fileURLToPath(new URL('./components.d.ts', import.meta.url))
    }),
    Inspect(),
  ],
  server: {
    // 服务启动时是否自动打开浏览器
    open: false,
    host: '0.0.0.0',
    port: 3333,
    // 本地跨域代理 -> 代理到服务器的接口地址
    proxy: {
      '/dev-api': {
        target: 'http://localhost:2222', // 后台服务器地址
        changeOrigin: true, // 是否允许不同源
        secure: false // 支持https
        // rewrite: (path) => path.replace(/^\/dev-api/, ''),
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
