import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'

import App from './App.vue'
import router from './router'

// 引入 Ant Design Vue 样式
import 'ant-design-vue/dist/reset.css'
// 引入 highlight.js 代码高亮样式
import 'highlight.js/styles/github.css'
// 引入全局样式
import './assets/styles/global.less'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
