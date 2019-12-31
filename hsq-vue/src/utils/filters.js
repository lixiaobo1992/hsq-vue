import Vue from 'vue'
import { formatCountDown, formatDate } from '@/utils/base'
import { dealPrice } from './index'
// export function host(url) {
//   const hostUrl = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
//   const parts = hostUrl.split('.').slice(-3);
//   if (parts[0] === 'www') parts.shift();
//   return parts.join('.');
// }

// export function timeAgo(time) {
//   const between = Date.now() / 1000 - Number(time);
//   if (between < 3600) {
//     // ~ 是按位取反 ~~ 取反两次，就是去掉小数部分
//     // 因为位运算的操作值要求是整数，其结果也是整数，所以经过位运算的都会自动变成整数
//     // 出了 ~~n 外，n<<0 n>>0 n|0 都可以取整
//     return pluralize(~~(between / 60), ' minute');
//   } else if (between < 86400) {
//     return pluralize(~~(between / 3600), ' hour');
//   } else {
//     return pluralize(~~(between / 86400), ' day');
//   }
// }

// function pluralize(time, label) {
//   if (time === 1) {
//     return time + label;
//   }
//   return time + label + 's';
// }

// 距离
Vue.filter('distance', distance => {
  let str = ''
  const tempSistance = distance || 0
  if (tempSistance < 1000) {
    str = tempSistance + 'm'
  } else if (tempSistance >= 1000) {
    if (tempSistance >= 1000 * 100) {
      str = '>100km'
    } else {
      str = (tempSistance / 1000).toFixed(1) + 'km'
    }
  }
  return str
})

// 处理价格
Vue.filter('price', (price) => dealPrice(price, 100))

Vue.filter('formatCountDown', formatCountDown)
Vue.filter('formatDate', formatDate)

Vue.filter('url', url => {
  //
  var h5 = /^(https|http):\/\//i
  if (!h5.test(url)) return url
  //
  const protocol = location.protocol
  let tempUrl = url.split('://')
  return `${protocol}//${tempUrl[1]}`
})

Vue.filter('formatDel', (value, pre = '') => {
  // 返回处理后的值
  if (!value) return null
  return `${pre}${Number(value * 0.01).toFixed(2)}`
})
