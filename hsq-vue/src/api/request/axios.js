import axios from 'axios'
import { compactObject, stringify } from '@dwdjs/utils'
import env from '@/config/env'
import { clone } from '@/utils/base'
import mini from '@/utils/mini'
// import device from '@dwdjs/utils/lib/device';
// import bridge from '@/utils/bridge';
// import store from '@/store';
import jsReport from '@/config/js-report'

// 创建axios实例
function noop() {
  console.warn('异常流程，不应该进入这里')
}

function checkStatus(res = {}) {
  console.log('check')
  const { status } = res
  if (status >= 200 && status < 300) {
    return res
  }
}

const defaultOptions = {
  url: '',
  method: 'get',
  baseURL: '',
  headers: {
    // 'Content-Type': 'application/json; charset=utf-8',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  params: {},
  data: {},
  responseType: 'json',
  withCredentials: true,
}

export default function request({
  isLoading = true,
  url,
  method,
  header,
  options = {},
  success = noop,
  fail = noop,
}) {
  const newOptions = clone(defaultOptions)
  newOptions.url = url
  newOptions.headers = {
    ...newOptions.headers,
    ...header,
  }

  if (method === 'GET') {
    newOptions.method = 'get'
    newOptions.params = compactObject({ ...options })
  } else {
    newOptions.method = 'post'
    // let query = new URLSearchParams();
    // for (let key in options) {
    //   query.append(key, options[key]);
    // }
    // newOptions.data = query;
    newOptions.data = stringify(options)
  }

  const successCallBack = data => {
    isLoading && mini.hideLoading()
    if (typeof success === 'function') {
      success(data)
    }
  }
  const errorCallBack = (err = {}) => {
    isLoading && mini.hideLoading()
    if (typeof fail === 'function' && fail(err)) {
      return
    }
    const { errmsg = '网络异常，请稍后重试', errno = 'err' } = err
    console.warn(JSON.stringify(err))
    // 510010 未登录
    if (errno === 510010) {
      // store.dispatch('FedLogout');
      // if (device.msf) {
      //   bridge.login({
      //     success(res) {
      //       //..
      //       console.log(res);
      //       const { data } = res;
      //       store.commit('SET_USERINFO', data);
      //     },
      //     fail(err) {
      //       console.log('app 登录失败！', err);
      //       // mini.forward('/index');
      //       mini.showToast('登录失败，请重试！');
      //     },
      //   });
      // } else {
      //   // 要带来源页面，便于返回
      //   // debugger;
      // }


      // mini.forward('/login', {
      //   c_redirect: location.href,
      // })

      let mode = ''
      if (['dev', 'beta'].includes(env.apiEnv)) {
        mode = env.apiEnv + '.'
      }
      const tempUrl = `https://m.${mode}haoshiqi.net/index.html#quick_login`
      // mini.forward(tempUrl, {})

    } else {
      // const message = `${errno}: ${errmsg}`;
      const message = `${errmsg}`
      console.log('errmsg:', message)
      mini.showToast(errmsg)
    }
  }

  function log(res) {
    // console.log('44444444');
    console.log(`api: ${method} ${res.status} ${url}`)
    return res
  }

  if (isLoading) {
    mini.showLoading()
  }

  axios(newOptions)
    .then(log)
    .then(checkStatus)
    .then(res => {
      // console.log(JSON.stringify(res));
      if (res.data.errno === 0) {
        successCallBack(res.data)
      } else {
        errorCallBack({
          errno: res.data.errno,
          errmsg: res.data.errmsg,
        })
      }
    })
    .catch(err => {
      // alert(JSON.stringify(err));
      // console.log(err.response);
      const message = {
        api: url,
        errno: err.statusCode,
        errmsg: err.message,
        value: `${err.statusCode || -1} ${err.message}`,
        params: options,
      }
      console.error(message)
      jsReport(message)
      errorCallBack(message)
    })
}

//以formData形式上传七牛
export function ajaxFormData(token, formData) {
  return new Promise(function (resolve, reject) {
    axios
      .post(`https://up.qbox.me?token=${token}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
