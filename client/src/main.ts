import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
// 引入 pinia
import { createPinia } from 'pinia'
import * as ElIcons from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// pinia 数据持久化插件
import piniaPersist from 'pinia-plugin-persist'
import * as ElementUI from 'element-plus'

const app = createApp(App)
// 创建 Pinia 实例
const pinia = createPinia()
pinia.use(piniaPersist)

for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component)
}

// 挂载到 App 根实例
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// 定义全局变量
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $Alert: (params: string) => Promise<void>
    $Confirm: (params: string) => Promise<void>
    $Notify: (params: string) => Promise<void>
  }
}
app.config.globalProperties.$Alert = ElementUI.ElMessageBox.alert
app.config.globalProperties.$Confirm = ElementUI.ElMessageBox.confirm
app.config.globalProperties.$Notify = ElementUI.ElNotification
