import Vue from 'vue'
import Router from 'vue-router'
import env from '@/config/env'
import Index from '@/views/index.vue'
// import marchant from '@/views/merchant.vue'
// import Detail2 from '@/views/detail2.vue';
// import PageError from '@/views/Error.vue';

// const _import = require('./_import_' + process.env.NODE_ENV);
const lazyLoad = // env.isMode('prod')
  process.env.NODE_ENV === 'production'
    ? file => () => import(/* webpackChunkName: "x-[index]" */ '@/views/' + file + '.vue')
    : file => require('@/views/' + file + '.vue').default

Vue.use(Router)

// const isComming = {
//   template: `
//     <div>isComming</div>
//   `,
// };

const routes = [
  // 处理特殊路由
  {
    path: '/error',
    name: 'error',
    meta: { title: '提示', needAuth: false },
    component: lazyLoad('common/error'),
  },
  {
    path: '*',
    redirect: '/',
    // redirect: {
    //   name: 'index',
    // },
  },
]

if (!env.isEnv('prod')) {
  routes.unshift({
    path: '/bridge',
    name: 'bridge',
    meta: { title: 'JSBridge 调试' },
    component: lazyLoad('common/bridge'),
  })
  routes.unshift({
    path: '/debug',
    name: 'debug',
    meta: { title: 'Debug 调试页面', needAuth: false },
    component: lazyLoad('common/debug'),
  })
  routes.unshift({
    path: '/test-code',
    name: 'test-code',
    meta: { title: '授权中转页面', needAuth: false },
    component: lazyLoad('common/test-code'),
  })
  routes.unshift({
    path: '/test-msg',
    name: 'test-msg',
    meta: { title: 'test-msg', needAuth: false },
    component: lazyLoad('common/test-msg'),
  })
}

const hsqRoutes = [
  {
    path: '',
    name: 'index',
    alias: '/index',
    meta: {
      title: '好食期',
    },
    component: Index,
  },
  {
    path: '/member-center',
    name: 'member-center',
    meta: {
      title: '会员中心',
      needAuth: true,
    },
    component: lazyLoad('member-center'),
  },
  {
    path: '/member-open',
    name: 'member-open',
    meta: {
      title: '购买好会员',
      needAuth: true,
    },
    component: lazyLoad('member-open'),
  },
  {
    path: '/merchant',
    name: 'merchant',
    meta: {
      title: '店铺详情',
      needAuth: false,
    },
    component: lazyLoad('merchant'),
  },
  {
    path: '/demo',
    name: 'demo',
    meta: {
      title: '好食期',
    },
    component: lazyLoad('demo'),
  },
  {
    path: '/private-policy',
    name: 'private-policy',
    alias: '/private_policy',
    meta: {
      title: '好食期',
    },
    component: lazyLoad('private-policy'),
  },
  {
    path: '/detail2',
    name: 'detail2',
    meta: {
      title: '商品详情页',
    },
    component: lazyLoad('detail2'),
  },
  {
    path: '/order-result',
    name: 'order-result',
    meta: {
      title: '支付结果',
    },
    component: lazyLoad('order-result'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      // needAuth: true,
    },
    component: lazyLoad('login'),
  },
  {
    path: '/authorize',
    name: 'authorize',
    meta: {
      title: '登录中...',
      // needAuth: true,
    },
    component: lazyLoad('authorize'),
  },
  {
    path: '/order-list',
    name: 'order-list',
    meta: {
      title: '订单列表',
    },
    component: lazyLoad('order-list'),
  },
  {
    path: '/order-detail',
    name: 'order-detail',
    meta: {
      title: '订单详情',
    },
    component: lazyLoad('order-detail'),
  },
  {
    path: '/order-refund',
    name: 'order-refund',
    meta: {
      title: '申请退款',
    },
    component: lazyLoad('order-refund'),
  },
  {
    path: '/order-refund-detail',
    name: 'order-refund-detail',
    meta: {
      title: '退款详情',
    },
    component: lazyLoad('order-refund-detail'),
  },
  {
    path: '/phone-cost',
    name: 'phone-cost',
    meta: {
      title: '话费充值',
      needAuth: true,
    },
    component: lazyLoad('phone-cost'),
  },
  {
    path: '/search',
    name: 'search',
    meta: {
      title: '好食期',
    },
    component: lazyLoad('search'),
  },
  {
    path: '/couple-search-list',
    name: 'couple-search-list',
    meta: {
      title: '',
    },
    component: lazyLoad('couple-search-list'),
  },
  {
    path: '/new-product',
    name: 'new-product',
    meta: {
      title: '今日新品',
    },
    component: lazyLoad('new-product'),
  },
  {
    path: '/category',
    name: 'category',
    meta: {
      title: '好食期',
    },
    component: lazyLoad('category'),
  },
]

const alipayRoutes = [
  {
    path: '/alipay-transfer',
    name: 'alipay-transfer',
    alias: '/alipay_transfer',
    meta: {
      title: '好食期',
    },
    component: lazyLoad('alipay/alipay-transfer'),
  },
]

const router = new Router({
  // debug: process.env.VUE_DEV ? env.debug : false,
  mode: env.routerMode,
  base: env.routerBase,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [...hsqRoutes, ...alipayRoutes, ...routes],
})

export default router
