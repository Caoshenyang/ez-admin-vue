import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
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
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon'
        })
      ],
      dts: fileURLToPath(new URL('./auto-imports.d.ts', import.meta.url))
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep', 'ant-design', 'icon-park', 'icon-park-outline']
        })
      ],
      dts: fileURLToPath(new URL('./components.d.ts', import.meta.url))
    }),
    Icons({
      autoInstall: true
    }),
    Inspect(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [fileURLToPath(new URL('./src/assets/icons', import.meta.url))],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      /**
       * custom insert position
       * @default: body-last
       */
      inject: 'body-first',
      /**
       * custom dom id
       * @default: __svg__icons__dom__
       */
      customDomId: '__svg__icons__dom__'
    })
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
