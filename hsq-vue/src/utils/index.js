// function uuid1(userId) {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0
//     const v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   })//.toUpperCase();
// }

// exports.url =
//   '_~0123456789' +
//   'abcdefghijklmnopqrstuvwxyz' +
//   'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// https://github.com/ai/nanoid/blob/master/non-secure.js
export function random(size) {
  const result = []
  while (0 < size--) {
    result.push(Math.floor(Math.random() * 256))
  }
  return result
}

export function uuid(size = 21) {
  const url = '_~getRandomVcryp0123456789bfhijklqsuvwxzABCDEFGHIJKLMNOPQSTUWXYZ'
  let id = ''
  let bytes = []
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    bytes = crypto.getRandomValues(new Uint8Array(size))
    console.warn(':::uuid crypto:', bytes.join(','))
  } else {
    bytes = random(size)
    console.warn(':::uuid random:', bytes.join(','))
  }
  // const bytes = typeof crypto !== 'undefined' && crypto.getRandomValues ?
  //   crypto.getRandomValues(new Uint8Array(size)) :
  //   random(size);
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return id
}

export function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}
// 截流
export function throttle(func, wait, options) {
  /* eslint no-multi-assign: 0 */
  let context
  let args
  let result
  let timeout = null
  let previous = 0

  if (!options) options = {}
  const later = () => {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) {
      context = args = null
    }
  }

  return (...rest) => {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    args = rest
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) {
        context = args = null
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
// 防抖
export function debounce(func, wait, immediate) {
  let timeout
  let args
  let context
  let timestamp
  let result

  const later = () => {
    const last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return (...rest) => {
    context = this
    args = rest
    timestamp = Date.now()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = []
  nodeList.forEach(node => {
    const item = node
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/')
    item.exact = true
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path))
    } else {
      if (item.children && item.component) {
        item.exact = false
      }
      arr.push(item)
    }
  })
  return arr
}

/**
 * Create a cached version of a pure function.
 */
export function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    /* eslint no-return-assign: 0 */
    return hit || (cache[str] = fn(str))
  }
}

// 以下简单转化命名格式

/**
 * Camelize a hyphen-delimited string.
 * camelCase 小驼峰命名
 */
const camelizeRE = /-(\w)/g
const camelize = cached(function (str) {
  /* eslint func-names: 0 */
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : ''
  })
})

/**
 * Converts the first character of string to upper case.
 * 首字母大写
 */
const capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * Hyphenate a camelCase string.
 * kebabCase 连字符命名 eg: kebab-case
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

export const upperFirst = capitalize
export const kebabCase = hyphenate
export const camelCase = camelize

export function merge(target) {
  /* eslint no-plusplus: 0 */
  /* eslint prefer-rest-params: 0 */
  /* eslint no-prototype-builtins: 0 */
  /* eslint no-param-reassign: 0 */
  for (let i = 1, j = arguments.length; i < j; i++) {
    const source = arguments[i] || {}
    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        const value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }

  return target
}

/**
 * 处理价格，默认是元，分第二个参数传100
 * dealPrice(5) => 5.00；dealPrice(500, 100) => 5.00；
 */
export function dealPrice(x, d = 100, issupp = true) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return
  }
  if (f == 0) {
    return f
  }
  d = d ? d * 100 : 100
  f = Math.round(f * 100) / d
  var s = f.toString()
  var rs = s.indexOf('.')
  if (rs < 0 && issupp) {
    rs = s.length
    s += '.'
  }
  if (issupp) {
    while (s.length <= rs + 2) {
      s += '0'
    }
  }
  return s
}

export function loadImg(img) {
  return require(`@/assets/img/${img}`)
}
