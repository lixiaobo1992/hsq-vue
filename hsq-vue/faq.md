
## 常见问题

```bash
# gh-pages 发布要增加参数

{
  tag: '3.5.3',  // 版本号
  message: 'Auto-generated commit', // 当前开发分支的commit号
}
```

serviceWorker的立即注册会block住网络请求，延迟注册
Chrome 产品经理 Owen 写过一篇 Reactive Web Design: The secret to building web apps that feel amazing，谈到两种改进感知体验的手段：一是使用骨架屏（Skeleton Screen）来实现瞬间加载；二是预先定义好元素的尺寸来保证加载的稳定。
https://link.zhihu.com/?target=https%3A//medium.com/%40owencm/reactive-web-design-the-secret-to-building-web-apps-that-feel-amazing-b5cbfe9b7c50
骨架屏（Skeleton Screen）https://zhuanlan.zhihu.com/p/27853228

比较了两家公司针对PWA改造的优化，都是从构建体积、缓存（这个是最明显的）、组件优化、框架代码，充分利用浏览器提供的特性来，如异步、requestAnimationFrame等来出发，是一步逐步累积的过程。文中的一句话很适合

Most changes tend to be small, but they add up, and the end result is that we have one of the largest and fastest


- Charles debugging proxy not connecting to localhost

https://blog.csdn.net/salmonellavaccine/article/details/75332654
解决方案
官方提供了两个解决方案：
- 执行 webpack-dev-server 命令时手动添加 --public 选项，取值为授权的 host，这是官方建议的做法，目的是为了安全。
- 设置 webpack-dev-server 的配置项 disableHostCheck 为 true 以禁用这一检测，如果开发者使用了代理，或在开发环境中不 care 这些安全问题，该设置可以直接斩草除根。


uncaught error
nebula work error：{msg=ServiceWorker failed to install: ServiceWorker failed to handle event (event.waitUntil Promise rejected), event=OnReportException, url=https://m.haoshiqi.net/v2/sw.js}

Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
    at Object.fetchAndCache (sw.js:1)
    at sw.js:1

Loading chunk 31 failed.
  https://segmentfault.com/q/1010000011592623
  应该是webpack的问题，好像webpack4.2+版本已经修复此问题
  几番周折终于找到原因了
  万恶的中国局域网电信劫持了DNS
  在本地网络设置里，把DNS设置成阿里云的即可，
  阿里DNS： 223.5.5.5 223.6.6.6
  感谢原回答主，各种技术论坛都没解决这个问题，居然在一个小网站上搜到了，感谢
  webpack - NG 4 项目，每日第一次访问报错，Error:Loading chunk 0 failed

Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode

Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
    at Object.fetchAndCache (sw.js:1)
    at sw.js:1


TypeError
TypeError: undefined is not an object (evaluating 'document.getElementsByName("description")[0].content')

TypeError
TypeError: undefined is not an object (evaluating 'document.getElementsByName("share-icon")[0].content')

js 错误

3 android 4.4.4 micromessenger 6.6.5.1280
SyntaxError
Failed to execute 'querySelectorAll' on 'Document': '[object SVGElementInstance]' is not a valid selector.
at Object._WXJS.qsa (<anonymous>:283:19)
at Object._WXJS.init (<anonymous>:247:26)
at $ (<anonymous>:258:20)
at HTMLBodyElement.<anonymous> (<anonymous>:1515:20)
at HTMLBodyElement.proxyfn (<anonymous>:779:33)
at HTMLBodyElement.function.t.__injected__.t.__injected__ (https://img1.haoshiqi.net/static/js/vendor.943265297229e39cd85b.js:20:6365)

36
堆栈信息
TypeError
object is not a function
TypeError: object is not a function
at M.t (https://img1.haoshiqi.net/static/js/app.d896811eda0746b7acef.js:1:34537)
at M (https://img1.haoshiqi.net/static/js/app.d896811eda0746b7acef.js:1:34548)
at t.getParams (https://img1.haoshiqi.net/static/js/app.d896811eda0746b7acef.js:1:31673)
at x (https://img1.haoshiqi.net/static/js/app.d896811eda0746b7acef.js:1:40106)
at b (https://img1.haoshiqi.net/static/js/app.d896811eda0746b7acef.js:1:39526)
at I.goH5Url [as $goH5Url] (https://img1.haoshiqi.net/static/js/app.d896811eda0746b7acef.js:1:40979)
at e.default.methods.handleTabClick (https://img1.haoshiqi.net/static/js/8.3599f91d34c99d07dc07.js:1:67935)
at e (https://img1.haoshiqi.net/static/js/vendor.943265297229e39cd85b.js:7:12135)
at t.$emit (https://img1.haoshiqi.net/static/js/vendor.943265297229e39cd85b.js:7:31374)
at <error: illegal access>
错误信息
名称
TypeError
信息
object is not a function
文件
https://img1.haoshiqi.net/static/js/app.d896811eda0746b7acef.js
行号
1
列号
34537


14
resourceError
资源信息
outerHTML
<script type="text/javascript" charset="utf-8" async="" crossorigin="anonymous" src="https://img1.haoshiqi.net/static/js/0.1604b7b72fe4d7dd5966.js"></script>
src
https://img1.haoshiqi.net/static/js/0.1604b7b72fe4d7dd5966.js
tagName
SCRIPT
type
text/javascript
XPath
/html/head/script[7]
selector
HTML > HEAD:nth-child(1) > SCRIPT:nth-child(65)
timeStamp
736.3900000000001


5
堆栈信息
Error
Loading chunk 22 failed.
at HTMLScriptElement.c (https://m.haoshiqi.net/v2/?channel_id=wx_hong_caidan&spm=h5:1:3312)
1	=null,clearTimeout(t);var e=i[a];0!==e&&(e&&e[1](n e w Error("Loading chunk "+a+" failed.")),i[a]=void
错误信息
名称
Error
信息
Loading chunk 22 failed.
文件
https://m.haoshiqi.net/v2/
行号
1
列号
3312

3
堆栈信息
Error
Uncaught Error: The installing service worker became redundant.
at ServiceWorker.o.onstatechange (https://m.haoshiqi.net/v2/?channel_id=wx_hong_caidan&spm=h5:1:7371)
1	ate){case"installed":break;case"redundant":throw n e w Error("The installing service worker became red
错误信息
名称
Error
信息
Uncaught Error: The installing service worker became redundant.
行号
1
列号
7365

3
堆栈信息
SyntaxError
Failed to execute 'querySelectorAll' on 'Document': '[object SVGElementInstance]' is not a valid selector.
at apply (webpack:///node_modules/fundebug-javascript/release/fundebug.0.3.6.min.js:1:240)
1	e:(e.__injected__||(e.__injected__=function(){try{ r eturn e.apply(this,arguments)}catch(e){throw s(e)
错误信息
名称
SyntaxError
信息
Failed to execute 'querySelectorAll' on 'Document': '[object SVGElementInstance]' is not a valid selector.
文件
https://img1.haoshiqi.net/static/js/vendor.943265297229e39cd85b.js
行号
20
列号
6365


在前端方面有哪些识别唯一设备或用户的方法（设备指纹跟踪）？

https://www.zhihu.com/question/47283095/answer/109510287
https://github.com/Valve/fingerprintjs2/blob/master/fingerprint2.js
https://github.com/Valve/fingerprintjs/blob/master/fingerprint.js

https://zhuanlan.zhihu.com/p/25292194
https://panopticlick.eff.org/tracker?aat=1
http://yinzhicao.org/TrackingFree/crossbrowsertracking_NDSS17.pdf
http://uniquemachine.org/
https://github.com/Song-Li/cross_browser
