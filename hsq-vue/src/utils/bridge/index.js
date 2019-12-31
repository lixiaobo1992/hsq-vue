import device from '@dwdjs/utils/lib/device'
import env from '@/config/env'
console.warn('[bridge.js]')
// import alipay from './alipay'
// import wechat from './wechat'
// import alipay from './alipay'
// import env from '@/config/env'
// import { getAppId } from '@/config'
// import api from '@/api'

const noop = () => {}
const fnList = ['setShare', 'showShare', 'showOptionMenu', 'hideOptionMenu']
const bridge = {}

fnList.forEach(key => {
  bridge[key] = noop
})
// alert(navigator.userAgent)
switch (device.host.name) {
  case 'aliapp':
  case 'alipay':

    Object.assign(bridge, require('@/utils/bridge/alipay').default)
    // alert(JSON.stringify(bridge))
    if (env.isEnv(['prod', 'beta'])) {
      bridge.hideOptionMenu()
    }
    console.log('alipay bridge', bridge)
    break
  case 'wxapp':
  case 'wechat':
    Object.assign(bridge, require('@/utils/bridge/wechat').default)
    console.log('wechat bridge', bridge)
    break
  case 'hsq': {
    require('@dwdjs/utils/lib/bridge/WebViewJavascriptBridge')
    const Bridge = require('@/utils/bridge/bridge').default
    Object.assign(bridge, Bridge, window.WebViewJavascriptBridge)
    console.log('app bridge', bridge)
    break
  }
  default:
  // do nothing...
}

export default bridge
