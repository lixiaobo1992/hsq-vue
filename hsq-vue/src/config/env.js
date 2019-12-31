// ENV
import { debug } from '@dwdjs/utils';
import device from '@dwdjs/utils/lib/device';
// import mini from '@/utils/mini';
import { storage } from '@/utils/storage';
import { uuid } from '@/utils';
import { stringify } from '@dwdjs/utils'
import Cookie from 'js-cookie';

let version = process.env.VUE_APP_VERSION;
if (device.hsq) {
  version = device.host.version;
}
// console.log(version, 'version');
const debugInfo = storage.get('debugInfo') || {
  xx: '',
  // debug 参数会开启一些错误日志等
  // debug: debug.debug,
  // apiEnv: 'prod',
  // api 可以动态切换接口请求环境
  // apiBaseUrl: '',
};

const modes = {
  development: 'dev',
  production: 'prod',
  test: 'testing',
};
const currentMode = process.env.NODE_ENV || 'production';

// 自动判断环境，支持 debug 调试
// 取参数以及debug调试
const { location } = window;
const { params } = debug;

// env.channel 这个变量不能取url上的channel做初始化
let channel = 'h5' //params.channel || ;
let terminal = 'wap';
if (device.alipay) {
  channel = params.channel_id || 'alipay_ant' // huabei
  terminal = 'alipay'
}

if (['aliapp', 'wxapp', 'hsq'].includes(device.host.name)) {
  terminal = device.host.name;
}

if (device.gat) {
  channel = 'guanaitong';
}

var cookie_cps_in = Cookie.get('cookie_cps_in'); // => 'value'
// console.log('cookie_cps_in:', JSON.parse(cookie_cps_in));
if (cookie_cps_in) {
  cookie_cps_in = JSON.parse(cookie_cps_in);
  if (cookie_cps_in.channel) {
    channel = cookie_cps_in.channel;    //渠道
  }
}

const defaultShareInfo = {
  title: '好食期',
  desc: '好食期——一个专门做食品特卖的电商平台',
  link: location.origin,
  imgUrl: 'https://img1.haoshiqi.net/hsq/img/icons/android-chrome-512x512.png',
};

// https://tower.im/projects/9dc0e68edc64436aa73e8f0fa0a8ffad/docs/738f14ee9afa45df8d01846e3f3e0010/
const tongjiConfig = {
  appName: 'hsq-vue',
  siteId: '2', // 2 用来测试
  // googleAnalyticsId: 'UA-XXXXX-X',
  // baiduAnalyticsId: 'UA-XXXXX-X',
};

console.info('version:', version)
console.info('channel:', channel)
console.info('terminal:', terminal)

// 参考以下配置，各个环境必须配置对应的 环境名称、H5域host、api接口域
// 域格式 xx.xxx.com:8000 不带协议头，本地配置使用正则匹配
export const ENV = {
  prod: {
    stage: 'prod',
    baseUrl: 'm.haoshiqi.net',
    apiBaseUrl: 'm.api.haoshiqi.net',
  },
  dev: {
    stage: 'dev',
    baseUrl: 'm.dev.haoshiqi.net',
    apiBaseUrl: 'm.devapi.haoshiqi.net',
  },
  beta: {
    stage: 'beta',
    baseUrl: 'm.beta.haoshiqi.net',
    apiBaseUrl: 'm.betaapi.haoshiqi.net',
  },
  testing: {
    stage: 'testing',
    // routerMode: 'hash',
    baseUrl: location.host, // 当前地址ip 可以取当前 location.host
    apiBaseUrl: 'm.devapi.haoshiqi.net',
  },
  local: {
    stage: 'local',
    // routerMode: 'hash',
    baseUrl: location.host, // localhost
    apiBaseUrl: 'm.devapi.haoshiqi.net',
    // apiBaseUrl: 'm.betaapi.haoshiqi.net',
    // apiBaseUrl: 'm.api.haoshiqi.net',
  },
};

let tempApi = {};
for (let key in ENV) {
  const api = ENV[key].apiBaseUrl;
  if (!tempApi[api]) {
    tempApi[api] = key;
  }
}

/*
# nginx

location / {
  index index.html;
  try_files $uri $uri/ /index.html;
}

# 指定v2子目录时
location /v2 {
  alias v2 /data/hsq/v2;
  index index.html;
  try_files $URI $uri/ /v2/index.html;
}
*/
const baseEnv = {
  appName: 'h5-newbee',
  ...ENV['prod'],
  ...debug,
  version, // 应用版本
  channel, // 渠道信息
  terminal, // 终端
  defaultShareInfo, // 默认分享数据
  tongjiConfig, // 统计相关配置数据
  // 正则判断当前站点url
  baseUrl: location.host,
  regBaseUrl: /(\.haoshiqi\.net)/i,
  mode: modes[currentMode] || 'prod', // 运行/编译模式
  stage: 'prod', // 发行版本
  apiEnv: 'prod', // api 环境
  spm: '', // spm
  port: location.port,
  host: location.host,
  // scheme: location.protocol,
  scheme: 'https:',
  routerBase: '/v2/',
  routerMode: 'history',
  publicPath: '',
  isMode(current) {
    const { mode } = this;
    return (
      mode === current || (Array.isArray(current) && current.indexOf(mode) > -1)
    );
  },
  isEnv(current) {
    const { stage } = this;
    return (
      stage === current ||
      (Array.isArray(current) && current.indexOf(stage) > -1)
    );
  },
  isChannel(current) {
    const { channel } = this;
    return (
      current === channel ||
      (Array.isArray(current) && current.indexOf(channel) > -1)
    );
  },
  // 关于 apiEnv，由 `ENV` 数据自动生成配置
  switchApi(apiEnv, apiUrl) {
    if (!apiEnv) return;
    // 切换环境（指切换api）
    if (Object.keys(ENV).indexOf(apiEnv) > -1) {
      this.apiBaseUrl = ENV[apiEnv].apiBaseUrl;
      this.apiEnv = debugInfo[this.apiBaseUrl];
    } else if (apiUrl && tempApi[apiUrl]) {
      this.apiEnv = tempApi[apiUrl];
      this.apiBaseUrl = apiUrl;
    } else {
      if (!apiUrl) {
        window.alert('请输入有效URL');
        return;
      }
      this.apiEnv = apiEnv;
      this.apiBaseUrl = apiUrl;
    }
    console.log(this);
    storage.set(
      'debugInfo',
      {
        apiEnv: this.apiEnv,
        apiBaseUrl: this.apiBaseUrl,
      },
      86400
    );
    setTimeout(() => {
      location.reload();
    }, 500);
  },
  getUUID() {
    let uid = storage.get('uuid');
    if (!uid) {
      uid = uuid(32);
      storage.set('uuid', uid, 0);
      // $log.set({is_first_open: true});
    }
    console.warn(':::uuid:', uid);
    return uid;
  },
  // envDebug(...rest) {
  //   console.warn('仅限临时使用');
  //   if (!rest) return false;
  //   // 传入期望的环境，返回true，默认prod为false
  //   return rest.indexOf('dev') > -1;
  // },
};

const regLocal = /^(localhost|127\.)/i;
const regLocalIp = /^(10\.|192\.)/i;
// const { protocol, host = ENV.prod.host, origin = ENV.prod.baseUrl } = location

function createEnv(opts = {}) {
  const { host = ENV.baseUrl } = location;
  let current = { ...baseEnv, ...ENV.prod };
  if (host === ENV['prod'].baseUrl) {
    return current;
  }
  if (host === ENV['beta'].baseUrl) {
    current = { ...baseEnv, ...ENV.beta, ...debugInfo };
  }

  if (host === ENV['dev'].baseUrl) {
    current = { ...baseEnv, ...ENV.dev, ...debugInfo };
  }

  const isLocal = host.match(regLocal);
  const isLocalIp = host.match(regLocalIp);
  if (isLocal || isLocalIp) {
    current = {
      ...baseEnv,
      ...ENV.local,
      // baseUrl: `${origin}/#`,
      // apiBaseUrl: `${origin}`,
      ...debugInfo,
    };
  }
  Object.assign(current, {
    apiEnv: tempApi[current.apiBaseUrl] || 'custom',
  });
  // __TEST__
  return current;
}

const currentEnv = createEnv({
  // env,
});

console.log(currentEnv);

// 默认会有个 api 配置，之后会读取 store
export default currentEnv;
