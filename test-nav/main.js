import App from './App'

// #ifndef VUE3
import Vue from 'vue'
// ... (这部分不用动)
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export function createApp() {
  const app = createSSRApp(App)

  // 使用 Element Plus
  app.use(ElementPlus)

  return {
    app
  }
}
// #endif