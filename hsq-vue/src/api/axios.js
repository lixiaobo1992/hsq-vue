import env from '@/config/env'
import { storage } from '@/utils/storage'
import { compact } from '@/utils/base'
import { modelApis, commonParams, headers } from '@/api/api.config'
import request from '@/api/request'
console.warn('api axios.js')

let apiBaseUrl
apiBaseUrl = `${env.apiBaseUrl}`

const regHttp = /^https?/i

const isMock = false
// 如果方便的切换使用Mock数据
// const regMock = /^mock?/i;

// function request(url, options, success, fail) {
//   const originUrl = regHttp.test(url) ? url : `${apiBaseUrl}${url}`;
//   return _request(originUrl, compact(options), success, fail);
// }

// 仅限本地调试支持
// if (process.env.VUE_DEV && env.mock) {
if (env.isMode('dev') && isMock) {
  apiBaseUrl = `${env.scheme}//${env.apiMockUrl}`
  // Object.assign(modelApis, require('../mock'))
}

// 线上代理
if (env.isMode('dev') && env.proxy) {
  const proxyUrl = '/proxy'
  apiBaseUrl = `${env.scheme}//${env.host}${proxyUrl}`
}

const { width, height } = window.screen
const userInfo = storage.get('userInfo') || {}

// 公共参数
headers.init({
  // token: getToken(),
  // userId: userInfo.userId || '', // 用户唯一标志
})
commonParams.init({
  // token: userInfo.token,
  user_id: userInfo.id || userInfo.user_id, // || '1000001001', // 用户唯一标志
  uuid: userInfo.id, // 用户唯一标志
  udid: env.getUUID(), // 设备唯一标志
  // device: '', // 设备
  // net: '', // 网络
  timestamp: '', // 时间
  platform: 'h5', // 渠道
  channel: 'h5', // 渠道
  spm: 'h5',
  v: env.version, // 系统版本
  terminal: env.terminal, // 终端
  swidth: width, // 屏幕宽度 分辨率
  sheight: height, // 屏幕高度
  // location: '', // 地理位置
  zoneId: 857, // 必须
  cityId: 857,
})

const apiList = Object.keys(modelApis).reduce((api, key) => {
  const val = modelApis[key]
  const [url, methodType = 'GET'] = val.split(/\s+/).reverse()
  const method = methodType.toUpperCase()
  api[key] = function postRequest(params, success, fail) {
    const originUrl = regHttp.test(url) ? url : `${env.scheme}//${apiBaseUrl}${url}`

    const { isLoading = true } = params
    delete params.isLoading

    const temp = compact(Object.assign({}, commonParams.get(), params))
    const header = headers.get()
    return request({
      isLoading,
      url: originUrl,
      method,
      header,
      options: temp,
      success,
      fail,
    })
  }
  return api
}, {})

apiList.setCommonParams = commonParams.set
apiList.getCommonParams = commonParams.get
apiList.setHeader = headers.set
apiList.getHeader = headers.get
export default apiList
