import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import i18n from '@/i18n'
import installElementPlus from './plugins/element'
import JsonViewer from 'vue-json-viewer'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 初始化样式表
import '@/styles/index.scss'
// 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 自定义暗黑模式
import '@/styles/theme/element-dark.scss'
// 字体
import '@/styles/font.scss'
// 导入 svgIcon
import installIcons from '@/icons'
// 自定义指令
import installDirective from '@/directives'
// 自定义过滤器
import installFilter from '@/filters'
// 导入路由鉴权
import './permission'

import 'highlight.js/styles/an-old-hope.css'

import AdminTitle from '@/components/adminTitle'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('AdminTitle', AdminTitle)

installElementPlus(app)
installIcons(app)
installFilter(app)
installDirective(app)
app.use(store).use(router).use(i18n).use(JsonViewer).mount('#app')
