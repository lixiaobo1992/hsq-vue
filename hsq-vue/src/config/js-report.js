import Vue from 'vue';
import axios from 'axios';
import env from '@/config/env';
import device from '@dwdjs/utils/lib/device';
import { stringify } from '@dwdjs/utils';
// import api from '@/api';

// fundebug.notify("Test", "Hello, Fundebug!");
// const caches = {};

// const filters = [
//   {
//     // name: /^ReferenceError$/,
//     message: /WeixinJSBridge is not defined/,
//   },
//   {
//     // name: /^ReferenceError$/,
//     message: /window\.local_obj/,
//   },
// ];

function formatComponentName(vm) {
  if (vm.$root === vm) return 'root';
  /* eslint no-underscore-dangle: 0 */
  const name = vm._isVue
    ? (vm.$options && vm.$options.name) ||
      (vm.$options && vm.$options._componentTag)
    : vm.name;
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options && vm.$options.__file
      ? ' at ' + (vm.$options && vm.$options.__file)
      : '')
  );
}

// axios.post('https://tongji.doweidu.com/log.php', {
//   platform: 'hsq-newbee',
//   value: 'test',
// });

function stringifyObj(obj = '', deep) {
  if (typeof obj === 'string') return obj;
  const result = {};
  if (deep-- > 0) {
    for (const key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        result[key] = stringifyObj(obj[key], deep);
      }
    }
    return result;
  } else {
    return stringify(obj);
  }
}

const jsReport = err => {
  // const errString = JSON.stringify(err.value);
  // console.error(`js-report: ${err}`);
  // if (!env.isMode('prod')) return;
  // if (useCache && caches[errString]) return;
  err = stringifyObj(err, 1);
  const data = stringify({
    ...err,
    project: env.appName,
    appName: env.appName,
    page: location.href.replace(location.origin, ''),
    ua: navigator.userAgent,
    ...device.getSystemInfo(),
  });
  axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: 'https://tongji.doweidu.com/log.php',
    data,
  }).catch(err => {
    console.log(err);
  });
  // caches[errString] = true;
};
// js-tracking
// 错误收集，线上和beta环境
Vue.config.errorHandler = (err, vm, info) => {
  const componentName = formatComponentName(vm);
  const propsData = vm.$options && vm.$options.propsData;

  const message = {
    value: err ? err.message : err,
    metaData: {
      componentName,
      propsData,
      info,
    },
    stack: err && err.stack,
  };
  jsReport(message);
};
window.onerror = (msg, url, lineNo, columnNo, error) => {
  const string = msg.toLowerCase();
  const substring = 'script error';
  if (string.indexOf(substring) > -1) {
    console.error('Script Error: See Browser Console for Detail');
  } else {
    // const message = {
    //   Message: msg,
    //   URL: url,
    //   Line: lineNo,
    //   Column: columnNo,
    //   'Error object': error,
    // };
    jsReport({
      value: msg,
      position: [
        'Message: ' + msg,
        'URL: ' + url,
        'Line: ' + lineNo,
        'Column: ' + columnNo,
        'Error object: ' + JSON.stringify(error),
      ],
    });
  }
  return false;
};

export default jsReport;
