import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // AutoImport({
    //   imports: ['vue'],
    //   resolvers: [ElementPlusResolver()]
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()]
    // })
  ],
  // 设置端口号
  server: {
    port: 3000,
    // 跨域设置
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080/',
        // target: 'http://127.0.0.1:4523/m1/1219901-0-default/',
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': join(__dirname, '/src')
    }
  },
  css: {
    // css 预处理
    preprocessorOptions: {
      scss: {
        // 引入 variables.scss 全局预定义变量
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  }
})
