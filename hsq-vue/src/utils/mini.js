import { stringify, parse } from '@dwdjs/utils'
import { Toast, Indicator, MessageBox } from 'mint-ui'
import { getTargetUrl, getUrlType, hashUrl } from './url-map/index'
import router from '@/router'
import env from '@/config/env'
import { wxappId } from '@/config'
// import tongji from '@/utils/tongji';
import store from '@/store'
import { storage } from '@/utils/storage'
import { compact, trim, urlfix } from '@/utils/base'
import { Version } from '@/utils/version'
import device from '@dwdjs/utils/lib/device'
import bridge from '@/utils/bridge'
console.warn('[mini.js]')
const { location } = window
// console.log(env);
// 透传参数白名单
const passRoutes = ['d_debug', 'd_host', 'd_console', 'spm', 'channel_id']

// 为简单起见，路由不要嵌套或过于复杂了，方便做映射
// 遍历 routes，拿到 pages 映射
// TIP: 暂不要 alias，每个路由必须配置name
// const pages = {
//   index: 1,
// };
// const { routes = [] } = router.options;
// routes.forEach(item => {
//   if (item.children) {
//     item.children.forEach(cItem => {
//       pages[cItem.name] = `${item.path}${cItem.path}`;
//     });
//   } else {
//     pages[item.name] = `${item.path}`;
//   }
// });
// console.log(routes);

// const nextPage = router.match('/zt')

// console.log(nextPage)

// const pages = {}
// function getRoutesMap(arr) {
//   arr.forEach((item, index) => {

//     const path = item.path.split('/').reverse()[0]
//     if (path) {
//       pages[path] = item.path
//     }

//   })
// }
// function getH5Url(pageUrl) {
//   let { origin, pathname } = location;
//   pathname = '/index.html';
//   if (process.env.VUE_DEV && env.isEnv('local')) {
//     ({ origin } = env);
//     pathname = '/t.html';
//   }
//   pageUrl = urlfix(pageUrl, stringify(getChannel()));
//   return `${origin}${pathname}#${pageUrl}`;
// }


export function getAuthorUrl() {
  // '/user/logincallback?oauth_appid=xxx&callback=xxx'
  // 'token=xxx&step=1'

  let callUrl = getUrlInfo(`${window.location.origin}/authorize`, {
    // share_code: store.state.user.shareCode || '',
  })
  console.log(callUrl)

  // 这个位置需要做环境判断，跟进环境确定授权跳转链接
  let url = `${env.scheme}//${
    env.apiBaseUrl
  }/user/logincallback?oauth_appid=${wxappId}&callback=${encodeURIComponent(
    callUrl.link
  )}&type=user`
  return url
}

const mini = {
  version: new Version(env.version),
  // event: tongji.event,
  showToast(msg, callback) {
    Toast(msg)
    setTimeout(() => {
      callback && callback()
    }, 3000)
  },
  showAlert(title, msg, callback) {
    MessageBox.alert(msg, title)
      .then(res => {
        callback && callback('confirm')
      })
      .catch(err => {
        callback && callback('error')
      })
  },
  showConfirm(opts) {
    if (!opts.title && !opts.message) return
    MessageBox({
      title: opts.title || '',
      message: opts.message || '',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: opts.confirmButtonText || '确定',
      cancelButtonText: opts.cancelButtonText || '取消',
    })
      .then(res => {
        opts.callback && opts.callback(res)
      })
      .catch(err => {
        opts.callback && opts.callback('error')
      })
  },
  showLoading: (opts = {}) => {
    let op = {
      content: '',
      type: 'fading-circle',
    }
    if (typeof opts === 'string') {
      op.content = opts
    }
    if (typeof opts === 'object') {
      Object.assign(op, opts)
    }

    Indicator.open(
      compact({
        text: op.content,
        spinnerType: op.type || 'fading-circle',
      })
    )
  },
  hideLoading: (times = 0) => {
    setTimeout(() => Indicator.close(), times)
  },

  back(n = -1) {
    let deep = window.history.length
    if (deep > 1) {
      router.go(n)
    } else {
      router.push({
        path: '/',
      })
    }
  },
  onUrlPage(e) {
    e.preventDefault()
    // console.log('onUrlPage:', e)
    let { link, index } = e.currentTarget.dataset
    link = trim(link + '') // 去除前后空格
    if (!link) return

    // console.log(`onUrlPage: link ==${link}, ${index}`);

    const urlType = getUrlType(link)
    // console.log('onUrlPage: urlType ==', urlType)
    if (urlType.indexOf('h5') >= 0) {
      mini.forward(link)
    } else {
      console.warn('目前只支持h5链接', link)
    }
  },
  // forward仅用于站内跳转
  forward(url, query = {}) {
    // alert(page,url);
    if (!url) return

    // url 可以传path，也可以传name，建议path
    const urlInfo = getUrlInfo(url, query)
    const urlType = getUrlType(url)
    // console.log('=====urlType', urlType);
    console.log('===urlInfo',urlInfo, urlType)

    // 这里会存在一些问题
    // 微信小程序内的页面内可能不存在当前路径，所以需要走站内跳转
    // 正常应该维护一个小程序页面名称集，跳转之前做查询，目前是反向处理的
    const wxapPage = ['member-open', 'service'] // !!临时处理
    // const aliPage = ['order-result']
    // android 微信小程序目前有个bug web-view 内地址发生改变，调用wx.miniProgram内方法不起作用
    // 这里 判断是安卓就不走站内跳，从新打开一个webview
    // if (device.wxapp && (!wxapPage.includes(urlInfo.pathname) || device.android)) { // 微信小程序
    if (device.wxapp) { // 微信小程序
      bridge.ready(function (wx) {
        console.log('走了，wx')
        wx.miniProgram.navigateTo({ url: '/pages/redirect/redirect?url=' + encodeURIComponent(urlInfo.link)})
      })
      return
    }

    if (device.aliapp) { // 支付宝小程序
      bridge.ready(function () {
        console.log('走了，aliapp')
        my.postMessage({url: urlInfo.link, type: 'url'})
      })
      return
    }

    if (device.hsq && (urlType.indexOf('h5') >= 0 || urlType == 'other')) {
      console.log(urlInfo.link, 'urlInfo.link')
      const tempUrl = urlType == 'other' ? urlInfo.link : url
      bridge.navigateTo({
        url: tempUrl,
      })
      return
    }

    if (urlInfo.urlType === 'other') {
      mini.goRouter(urlInfo.path, urlInfo.query)
    } else {
      location.href = urlInfo.link
    }
  },
  goRouter(path, query) {
    const { replace, back } = query
    delete query.replace
    delete query.back
    if (back) return mini.back()
    const type = !replace ? 'push' : 'replace'
    router[type](
      {
        path: path,
        query: query,
      },
      res => {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  },
  goToAuthorize(path) {
    // path = location.pathname + location.search
    if (path) {
      storage.set('aimsUrl', path, 3600)
    }
    // 前端登出
    store.dispatch('fedLogout')
    setTimeout(() => {
      window.location.replace(getAuthorUrl())
    }, 100)
  },
}

// 处理url和query
export function getUrlInfo(url, query = {}) {
  const params = {
    ...router.currentRoute.query,
  }
  // 需要透传的参数
  const passParams = {}
  for (let key in params) {
    if (passRoutes.includes(key)) {
      passParams[key] = params[key]
    }
  }
  // this.$forward1('city?xx=1', { sss: 2 }); // !! 当前项目内链接
  // this.$forward1('https://m.haoshiqi.net/v2/couple-search-list?q=%e7%89%9b%e5%a5%b6') // !!当前项目不存在的页面
  // this.$forward1('https://m.haoshiqi.net/v2/debug?q=%e7%89%9b%e5%a5%b6') // !!当前项目存在的页面
  // this.$forward1('https://m.haoshiqi.net/v2/detail?id=xx', { xx:1 }) // !!当前项目存在的页面

  let info = {}
  let urlQuery = {}
  let urlType = getUrlType(url)
  info.urlType = urlType

  // 是否是老版本 好食期 h5的url
  info.isOld = false
  if (urlType.indexOf('h5') >= 0) {
    if (urlType !== 'h5Hsq') {
      urlQuery.target_type = 'h5'
    } else {
      // console.log(router.options.routes);
      const routesName = []
      router.options.routes.forEach(route => {
        if (route.name) routesName.push(route.name)
      })
      // console.log(routesName);
      let { pathname = '', query: hashQuery } = hashUrl(url)
      pathname = pathname.replace(/^v2(\/)?/i, '')
      if (pathname == '') pathname = 'index'
      // 查看当前路由是否存在当前路径
      // 主要查看当前页面是否是 本项目内存在的
      // 不存在就走老的h5
      // 这时候 urlType == h5Hsq
      if (!routesName.includes(pathname)) {
        if (['aliapp', 'wxapp', 'hsq'].includes(device.host.name)) {
          const tempQuery = Object.assign({}, passParams, query)
          info.link = urlfix(url, tempQuery)
        } else {
          info.isOld = true
          const targetUrl = getTargetUrl(url, 'h5')
          // console.log(targetUrl);
          info.urlType = 'h5' // 输出 urlType
          if (targetUrl.page) {
            pathname = targetUrl.page
          }
          const tempQuery = Object.assign({}, passParams, targetUrl.query, query)
          const queryString = stringify(tempQuery)
          let mode = ''
          if (['dev', 'beta'].includes(env.apiEnv)) {
            mode = env.apiEnv + '.'
          }
          const tempUrl = `https://m.${mode}haoshiqi.net/index.html#${pathname}`
          info.link = queryString ? urlfix(tempUrl, queryString) : tempUrl
        }

      } else {
        // 当前项目存在 此路径
        urlType = 'other' // 修改类型 交给下面方法继续处理
        const queryString = stringify(hashQuery)
        url = queryString ? pathname + '?' + queryString : pathname
      }
    }
  }

  if (urlType === 'h5' || urlType === 'h5Topic') {
    let tempQuery = Object.assign({}, passParams, urlQuery, query)
    const { token = '' } = store.state.user.authorize_info
    if (urlType === 'h5Topic' && token) {
      tempQuery = Object.assign({}, tempQuery, { token })
    }
    info.link = urlfix(url, stringify(tempQuery))
  }

  if (urlType === 'other') {
    const reg = /^\//
    if (!reg.test(url)) {
      url = '/' + url
    }
    if (url === '/') {
      url = '/index'
    }
    // 兼容 /detail?id=3 格式
    if (url.indexOf('?') >= 0) {
      urlQuery = parse(url.split('?')[1])
      url = url.split('?')[0]
    }
    info.urlType = urlType
    info.path = url
    info.pathname = info.path.substr(1)
    info.query = Object.assign({}, passParams, urlQuery, query)
    const queryString = stringify(info.query)
    const tmepLink = window.location.origin + '/v2' + url
    info.link = queryString
      ? tmepLink + '?' + queryString
      : tmepLink
  }

  return info
}

// debugger
// if (device.alipay) {
//   // 这里不行
//   // console.log(1111111)
//   // // location.replace(getH5Url('ali_portal'))
//   // mini.forward('alipay', {
//   //   replace: true,
//   // })
// }

export default mini
