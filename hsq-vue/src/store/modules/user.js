import api from '@/api'
import { storage } from '@/utils/storage'
import Cookie from 'js-cookie'
import device from '@dwdjs/utils/lib/device'


let userInfo = storage.get('userInfo') || {}
let authorize_info = storage.get('authorize_info') || {
  token: '',
  user_id: 0,
  // is_bind_mobile: false,
}

let rechargeRecord = storage.get('rechargeRecord') || []

const cookieKey = 'dwdus_sid'
let isUseCookie = true // 是否使用cookie

if (['aliapp', 'wxapp', 'hsq'].includes(device.host.name)) {
  isUseCookie = false
}
function isLogin(data = {}) {
  // 判断逻辑
  // 1、区分环境 'aliapp', 'wxapp', 'hsq' 内使用token 作为登录态；其他使用cookie作为登录态
  if (!isUseCookie) {
    return !!(data.token)
  } else {
    return !!Cookie.get(cookieKey)
  }
  // return !!Cookie.get(cookieKey) || !!(data.token)
  // return !!(data.token && data.id)
  // return !!(data.token)
}


// console.log(userInfo);
const user = {
  state: {
    userInfo: userInfo,
    logged: isLogin(authorize_info),

    // 用于授权绑定 // 为什么把token单独维护？因为做授权扩展时方便单独维护
    authorize_info: authorize_info,

    rechargeRecord: rechargeRecord,
  },

  mutations: {
    // 全量更新
    SET_USERINFO: (state, data) => {
      state.userInfo = data
      // state.logged = isLogin(data)
      console.log('更新用户信息', data)
      api.setCommonParams({
        // token: (data && data.token) || '',
        user_id: (data && data.id) || (data && data.user_id) || '',
      })
      storage.set('userInfo', data, 86400 * 30)
    },
    SET_AUTHORIZE_INFO: (state, info) => {
      let tempInfo = { ...state.authorize_info, ...info }
      state.authorize_info = tempInfo
      state.logged = isLogin(tempInfo) // 有token 且 is_bind_mobile = true可以代表登录
      storage.set('authorize_info', tempInfo, 86400 * 30)
      api.setCommonParams({
        token: tempInfo.token || '',
      })
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_RECHARGE_RECORD: (state, records) => {
      state.rechargeRecord = records
      storage.set('rechargeRecord', records, 86400 * 30)
    },
  },

  actions: {
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.getUserInfo(
          {},
          res => {
            const { data } = res
            // 由于 mockjs 不支持自定义状态码只能这样hack
            if (!data) {
              reject('error')
            }
            commit('SET_USERINFO', data)
            commit('SET_AUTHORIZE_INFO', { token: data.token || '' })
            resolve(res)
          },
          err => {
            reject(err)
            // 这里统一鉴权提示报错
            return true
          }
        )
      })
    },

    // 登出
    // Logout({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     api.logout(
    //       {},
    //       res => {
    //         commit('SET_USERINFO', '')
    //         // removeToken();
    //         resolve()
    //       },
    //       err => {
    //         reject(err)
    //       }
    //     )
    //   })
    // },
    // 前端 登出
    fedLogout({ commit }) {
      commit('SET_AUTHORIZE_INFO', { token: ''})
      commit('SET_USERINFO', {})
    },

    updateRechargeRecord({ commit }, records = []) {
      commit('SET_RECHARGE_RECORD', records)
    },
  },
}

export default user
