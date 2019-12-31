// import device from '@dwdjs/utils/lib/device'
import api from '@/api'
import { storage } from '@/utils/storage'

const app = {
  state: {
    keepAliveList: [],
    appConfig: {},
  },
  // 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  mutations: {
    ['SET_KEEPALIVELIST'](state, payload = []) {
      // console.log(payload);
      state.keepAliveList = payload
    },
    // 初始化app配置
    ['INIT_APP_CONFIG'](state, payload = {}) {
      // console.log(payload);
      const { configInfo } = payload
      state.appConfig = configInfo
      // 存储到本地
      storage.set('app-config', configInfo, 864000)
    },
  },
  actions: {
    // 初始化app配置
    initAppConfig({ commit, state }, payload = {}) {
      // console.log(state);
      api.getConfig(
        {
          // loc_type: 'amap', // 高德
          isLoading: false,
        },
        res => {
          // console.log(this.$store.state);
          // console.log(res);
          commit({ type: 'INIT_APP_CONFIG', configInfo: res.data })
        },
        err => {
          console.log(err)
        }
      )
    },
    setAppConfig({ commit, state }, payload = {}) {
      commit({ type: 'INIT_APP_CONFIG', configInfo: payload })
    },
  },
}

export default app
