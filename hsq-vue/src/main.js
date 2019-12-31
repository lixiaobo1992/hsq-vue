import 'mint-ui/lib/style.css'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'

// 处理老版本链接
// 如果 url 是一个 hash 的链接，而当前项目不存在该 hash 的预期，则跳转到老项目
// 这里相当于是一个老 H5 转新版 H5 的处理，但此时实施不太好，因为新版本只有一个页面（首页）

import router from '@/router'
import store from '@/store'
import api from '@/api'

import '@/utils/bridge/bridgeready'
import '@/registerServiceWorker'
import '@/permission'

// 外部样式在前面引入，我们的样式在App.vue 中后引入
// import '@/style/index.styl';
import '@dwdjs/utils/lib/rem' // 与老版本同界面显示有高度差等问题
import '@/utils/filters' // 注册过滤器
// import '@/plugins/directive';
import '@/icons'
import '@/config/js-report'

import env from '@/config/env'
import mini, { getUrlInfo } from '@/utils/mini'
import { loadJs } from '@/utils/dload'

import App from '@/App.vue'
import Page from '@/components/page.vue'

// test
// import Lazyload from 'vue-lazyload';
import { Lazyload } from 'mint-ui' // 内部使用的就是 vue-lazyload
import imgError from '@/assets/img/error.svg'
// console.warn('[main.js]');

// 拦截跳转到老版本
function checkOld(callback) {
  const info = getUrlInfo(location.href)
  // const info = getUrlInfo('https://m.dev.haoshiqi.net/v2');
  // 新连接转老连接
  if (info.isOld) {
    location.replace(info.link)
    return true
  } else {
    callback && callback()
  }
}

Vue.use(Lazyload, {
  lazyComponent: true,
  preLoad: 2, // 预加载高度比例
  error: imgError, // 图片路径错误时加载图片
  // loading: imgLoading, // 预加载图片
  attempt: 3, // 尝试加载图片数量s
  filter: {
    progressive(listener, options) {
      const isCDN = /img2.haoshiqi.net/
      if (isCDN.test(listener.src) && listener.src.indexOf('?') < 0) {
        // listener.el.setAttribute('lazy-progressive', 'true');
        // '?imageView2/2/format/webp';
        listener.src = listener.src + '?imageView2/1/q/75'
        listener.loading = listener.src
      }
    },
  },
})

Vue.config.productionTip = false

// 添加全局依赖方法
Object.keys(mini).forEach(key => {
  /* eslint no-multi-assign: 0 */
  Vue.prototype[`$${key}`] = mini[key]
})

Vue.prototype[`$api`] = api

sync(store, router) // 同步路由数据到 store内;
Vue.component(Page.name, Page)
// 环境变量
// console.log(process.env);

store.dispatch('initAppConfig')

function initVue(time = 0) {
  // 把初始化渲染放到 setTimeout 里，延迟vue初始化，兼顾骨架屏
  setTimeout(() => {
    console.info('init Vue')
    new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app')
  }, time)
}

if (!env.console) {
  checkOld(initVue)
} else {
  const vConsole = 'https://unpkg.com/kit-debug@latest'
  loadJs(vConsole, {
    // async: true,
    // defer: true,
    first: true,
    onload() {
      /* eslint no-undef: 0 */
      if (typeof VConsole !== 'undefined') {
        window.vConsole = new VConsole()
      }
      console.info('vConsole loaded')

      checkOld(initVue)
    },
  })
}
