import './public-path'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'normalize.css'
import './registerServiceWorker'
import router from './router'
import store from './store'

import App from './App.vue'
// import mockjs from 'mockjs'
// require('./mock/mock')
let instance: any = null
console.log(222222222222)
function render(props = { container: '' }) {
  console.log(111111111)
  const container: any = props?.container
  instance = createApp(App)
  instance.use(router)
  instance.use(store)
  instance.use(ElementPlus, {
    locale: zhCn,
  })
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    instance.component(key, component)
  }
  instance.mount(container ? container.querySelector('#app') : '#app')
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render()
}

// 生命周期
export async function bootstrap(): Promise<void> {
  console.log('[vue] vue app bootstraped')
}

export async function mount(props: any | undefined): Promise<void> {
  console.log('[vue] props from main framework', props)
  render(props)
}

export async function unmount(): Promise<void> {
  console.log('我离开啦')
  instance.unmount()
  instance._container.innerHTML = ''
  instance = null
}
