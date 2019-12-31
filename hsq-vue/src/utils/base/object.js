/**
 * object 操作
 *
 * @export
 * @param {*} obj
 * @returns
 */

import { isObject, isDef } from './is'

/**
 * 获取对象值
 *
 * @export
 * @param {*} obj = []
 * @returns Array
 */
export function values(obj = []) {
  let tempArray = []
  if (isObject(obj)) {
    for (let key in obj) {
      tempArray.push(obj[key])
    }
  }
  return tempArray
}

// copy & clone
export function clone(obj = '') {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj
}

const { hasOwnProperty } = Object.prototype

function assignKey(to, from, key) {
  const val = from[key]

  if (!isDef(val) || (hasOwnProperty.call(to, key) && !isDef(to[key]))) {
    return
  }

  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val
  } else {
    to[key] = assign(Object(to[key]), from[key])
  }
}

export function assign(to, from) {
  for (const key in from) {
    if (hasOwnProperty.call(from, key)) {
      assignKey(to, from, key)
    }
  }
  return to
}

export function compact(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'undefined') delete obj[key]
  }
  return obj
}

const objectUtil = {
  values,
  clone,
  assign,
  compact,
}

export default objectUtil
