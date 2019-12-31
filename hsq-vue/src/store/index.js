import Vue from 'vue'
import Vuex from 'vuex'
// import api from '@/api';

import app from './modules/app'
import user from './modules/user'
import msg from './modules/msg'
import location from './modules/location'

Vue.use(Vuex)

// store 去中心化
// const reqModules = require.context('../views', true, /^\.(\/([\s\S])+)?\/store\.js$/)
// console.log(reqModules)
// const modules = reqModules.keys().reduce((module, key) => {
//   // export default 语法导出不友好，特殊处理
//   const name = key // .replace('.', '').replace('/', '')
//   module[name] = reqModules(key).default
//   return module
// }, {})


// initial state
const state = {
  test: '',
}

// getters
const getters = {
  config: state => state.app.config,
  // token: state => state.user.token,
  // userInfo: state => state.user.userInfo,
  logged: state => state.user.logged,
  keepAliveList: state => state.app.keepAliveList,
  rechargeRecord: state => state.user.rechargeRecord,
}


const debug = process.env.VUE_DEV

export default new Vuex.Store({
  strict: debug,
  state,
  // actions,
  getters,
  // mutations,
  modules: {
    app,
    user,
    msg,
    location,
    // ...modules,
  },
})
