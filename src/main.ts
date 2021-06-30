import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import 'highlight.js/styles/xcode.css'
import './code.css'

// @ts-ignore
import VueQuillEditor from "vue-quill-editor"

// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import router from './router'
import GLOBAL from "@/globalData";
Vue.config.productionTip = false
import store from "@/store";

Vue.use(Antd)
Vue.use(VueQuillEditor)
Vue.prototype.$global = GLOBAL


new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$global.username = window.localStorage.username
  }
}).$mount('#app')
