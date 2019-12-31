import { stringify } from '@dwdjs/utils'
// import Cookie from 'js-cookie';
import env from '@/config/env'
import router from '@/router'
import store from '@/store'
import { storage } from '@/utils/storage'
import tongji from '@/utils/tongji'
import mini from '@/utils/mini'
import bridge from '@/utils/bridge'
import device from '@dwdjs/utils/lib/device'
import api from '@/api'
// import jsReport from '@/config/js-report'
import { loadJs } from '@/utils/dload'


// no redirect whitelist
const whiteList = ['login', 'authredirect']
const defaultPage = 'index'
const limitPages = {
  master: ['/', `/${defaultPage}`],
  alipay: [``],
}

let { spm, channel } = api.getCommonParams()


// function dealAdParams(query = {}) {
//   const { aid, channel: aidChannel, cid, wi, target } = query;
//   if (!aid) return;
//   // 60*60*24*30 30天
//   // cookie_cps_in
//   const cookieVal = {
//     aid,
//     channel: aidChannel,
//     cid,
//     wi,
//     // target,
//   };
//   Cookie.set('cookie_cps_in', cookieVal, { expires: 30, path: '/', domain: '.haoshiqi.net' });
//   console.log('cookie_cps_in get', Cookie.get('cookie_cps_in'));
// }

router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);

  // alert(JSON.stringify(to))
  const { meta = {} } = to
  // const { needAuth = false, title = '', desc = '' } = meta;

  // 解决拦截 router-link 跳转问题
  if (meta.status === -1) {
    return next(false)
  }

  // 路由拦截
  // 如果是支付宝，则拦截受限制页面
  // 如果不是支付宝，则拦截支付宝页面
  const blockAliPages = !device.alipay && limitPages.alipay.indexOf(to.path) > -1
  const blockNotAliPages = device.alipay && limitPages.master.indexOf(to.path) > -1
  if (blockAliPages || blockNotAliPages) {
    let nextPath = '/'
    // 直接跳转到拼团小程序
    if (device.alipay) {
      console.log('跳转到小程序')
      const aliappUrl =
        'alipays://platformapi/startApp?appId=2017112000051610&page=pages%2Findex%2Findex&query=spm%3Dh5vue'
      location.replace(aliappUrl)
      nextPath = '/error?jump=couple-miniapp'
    }
    return next({
      path: nextPath,
      query: { ...to.query },
      replace: true,
    })
  }

  if (meta.title) {
    document.title = meta.title
  }
  if (meta.desc) {
    // ...
  }
  // hack: 在微信等webview中无法修改 document.title 的情况
  // let $iframe = $('<iframe src="/isLive.action" style="display:none;"></iframe>');
  // $iframe.on('load',function() {
  //   setTimeout(function() {
  //     $iframe.off('load').remove();
  //   }, 0);
  // }).appendTo($body);

  if (to.query.spm && to.query.spm != spm) {
    api.setCommonParams({ spm: to.query.spm })
    spm = to.query.spm
  }
  if (to.query.channel_id && to.query.channel_id != channel) {
    api.setCommonParams({ channel: to.query.channel_id })
    channel = to.query.channel_id
  }

  // 获取亿起发推广参数
  // dealAdParams(to.query);
  // store.dispatch('GetUserInfo')
  // console.log(store);
  let {
    logged = false,
    userInfo = {},
  } = store.state.user
  let {
    token = '',
    target = '',
  } = to.query

  // 这里做一下 本地的token 和 目前链接上的token 是否相同
  // 第一次登录和第二次登录的token 可能是不一样的 需要更新
  if ((token != '' && userInfo.token != token)) {
    logged = false
  }
  // app不传token，为了每次重新获取用户信息，故改变登录状态为false
  if (device.hsq && !token) {
    logged = false
  }
  console.log('logged:', logged)
  if (logged) {
    // 当前状态为登录，但是没有用户信息
    if (!userInfo.user_id) {
      store.dispatch('GetUserInfo')
    }
    // 用户通过直接访问 做拦截
    if (to.name === 'authorize' || to.name === 'login') {
      // 已登录，直接回到来源页面（是否应该使用back）
      // 删除存储的目标地址
      storage.remove('aimsUrl')
      next({
        path: from.path,
        query: from.query,
        replace: true,
      })
    }
  } else if (to.name === 'authorize') {

    // http://m.dev.haoshiqi.net/v2/authorize?token=xx&target=http%3A%2F%2Fm.dev.haoshiqi.net%2Fv2%2Findex
    let tempRouter = {
      replace: true,
      path: '/index',
      query: to.query,
    }
    if (token) {
      store.commit('SET_AUTHORIZE_INFO', {
        token,
      })
      delete tempRouter.query.token
      delete tempRouter.query.target
      // 获取上次存储的目标地址
      // let url = storage.get('aimsUrl');

      let url = target // 这个位置不需要做任何新老地址逻辑判断，forward 内部已经做啦
      // 删除存储的目标地址
      // storage.remove('aimsUrl');
      if (!url || url.indexOf('/authorize') != -1) {
        tempRouter.path = '/index'
      } else {
        if (url == '/') {
          url = '/index'
        }
        tempRouter.path = decodeURIComponent(url)
      }
    }
    // tempRouter.path = '/login';
    // next(tempRouter);
    mini.forward(tempRouter.path, { replace: true, ...tempRouter.query })
    return
  } else if (meta.needAuth && !whiteList.includes(to.name)) {

    // this route requires auth, check if logged in
    // if not, redirect to login page.
    console.warn('app login')
    console.log('token:', token)
    console.log('device.hsq:', device.hsq)
    // if (device.wxapp && token) {
    if (token) {
      store.commit('SET_USERINFO', {})
      store.commit('SET_AUTHORIZE_INFO', {
        token,
      })
      // 这里去getuserinfo 可能会有问题，没有区分他是以什么作为登录态 cookie 还是token?
      // 请求接口时 token 比 cookie 里的用户标记高
      store.dispatch('GetUserInfo')
      next()
      return
    }

    if (device.hsq) {
      // 获取用户信息
      bridge.ready(() => {
        bridge.getUserInfo({
          success(res) {
            console.log('获取getUserInfo 修改store:', res.data)
            const { data } = res
            // app端已将res.data中的userId改为id
            store.commit('SET_USERINFO', data)
            // 判断是否真的未登录
            if (data.user_id && data.token) {
              store.commit('SET_AUTHORIZE_INFO', {
                token: data.token,
                user_id: data.user_id,
              })
              next()
            } else {
              bridge.login({
                success(res) {
                  console.log('登陆成功～～～～' + res.data)
                  const { data = {} } = res
                  if (data.user_id && data.token) {
                    store.commit('SET_USERINFO', data)
                    store.commit('SET_AUTHORIZE_INFO', {
                      token: data.token,
                      user_id: data.user_id,
                    })
                  } else {
                    bridge.navigateBack()
                  }
                },
                fail(err) {},
              })
            }
          },
          fail(err) {
            console.log('获取 getUserInfo 失败！', err)
            next()
          },
          complete(ret) {},
        })
      })
      return
    }
    if (device.wechat) {
      mini.goToAuthorize(to.fullPath)
      return
    }
    // mini.forward('/login', { c_redirect: to.fullPath })


    let mode = ''
    if (['dev', 'beta'].includes(env.apiEnv)) {
      mode = env.apiEnv + '.'
    }
    const tempUrl = `https://m.${mode}haoshiqi.net/index.html#quick_login`
    // mini.forward(tempUrl, {})
    return
  }

  // 判断是否需要缓存组件，如果是添加组件名到数组
  if (meta.keepAlive) {
    const { keepAliveList } = store.getters
    if (!keepAliveList.includes(to.name)) {
      keepAliveList.push(to.name)
    }
    store.commit('SET_KEEPALIVELIST', keepAliveList)
  }

  let currentPath = to.path.replace(/^\//, '') || defaultPage
  currentPath = currentPath + '?' + stringify(to.query)
  // const currentPath = location.href.replace(location.origin, '');

  tongji.pv(currentPath)

  // 跳转页面之前动态设置转场动画?
  // store.commit('SET_TRANSNA', to.meta.index < from.meta.index);
  // 确保一定要调用 next()
  next()
})
router.beforeResolve((to, from, next) => {
  // console.log(to, from);
  next()
})
router.afterEach((to, from) => {
  console.log(`进入${to.name}页面`)
  // 获取微信签名
  if (device.wechat) {
    // console.log(bridge.config());
    console.log('permission:1')

    Promise.resolve().then(() => {
      console.log('permission:2')
      console.warn('[当前url]', JSON.stringify(location.href))
      if (device.android) {
        bridge.jsBridgeReady()
      } else if (device.iphone) {
        bridge.setShare()
      }
    })
  }
})

if (device.alipay) {
  document.addEventListener(
    'back',
    e => {
      /* eslint no-alert: 0 */
      // alert(window.history.length)
      // window.alert('111' + window.location.href)
      // var urlReg = /[\?\&]backUrl\=[\w\%\.\_]*/;
      // var url = window.location.href.match(urlReg);
      // // 限定只有入口url可以使用backUrl修改返回地址，否则从提单页进入详情分享后会出问题
      // if (url && url[0]) {
      //   url = decodeURIComponent(decodeURIComponent(decodeURIComponent(url[0].split('=')[1])));
      //   // alert(url)
      //   if (url == 'exit') {
      //     // window.alert('exit')
      //     ('AlipayJSBridge' in window) && AlipayJSBridge.call('exitApp');
      //   } else {
      //     // window.alert('222' + window.location.href)
      //     window.location.href = '#' + url;
      //   }
      //   e.preventDefault();
      // }
    },
    false
  )
}
