# 好食期 v2 项目 vue 版

暂定基于 vant 开发

## 项目规划

- 此项目规划在好食期项目子目录 `/v2` 下
- 该目录下所有路由，都由服务器 `nginx` 配置指向该根目录 `/v2`
- 此项目规划由 vue2.x + vue-router + vuex + webpack 实现
- 项目暂时用于活动页面
- 项目支持按需加载

test

好食期h5重构主要功能模块统计

## 模块

目前能够提取的模块暂时都放在 @dwdjs/utils 下

- 首页 √
- 商户 √
  - 商户入口
  - 商户详情
  - 商户收藏
- 今日新品
- 分类
- 个人中心
- 客服页面
- 收藏功能
  - 收藏列表
  - 详情页收藏功能
- 详情页展示（普通，拼团，tob）
  - 定位（暂无）  @dwdjs/utils/geo
  - 多sku选择（拼团和积分换购）
- 下单流程
  - 确认订单
  - 支付
  - 支付后的跳转
待定
  - 优惠券
    - 领券
    - 优惠券列表
    - 优惠券产品列表包括搜索
    - 下单选择使用优惠券
  - 收获地址
  - 账户管理
  - 登录（第三方登录）
    - 微信登录
    - 支付宝授权登录
    - 手机号验证码登录
    - 密码登录
  - 积分相关
  -

- 错误上报 @dwdjs/utils/report
- 统计 @dwdjs/utils/tongji
- 分享模块
- 客服 UDESK @dwdjs/utils/udesk
- 页面跳转方式
  - 各种链接的跳转

- 支付宝积分换购和微信h5

- 购物车
  - 普通商品加入购物车功能

- 下单流程
  - 确认订单
  - 支付
  - 支付后的跳转

- hsq hybrid X
  - @dwdjs/utils/bridge
  - @dwdjs/utils/hybrid

- 助力免单(微信)
  - 列表
  - 详情
  - 下单

- 专题（old X）
  - 专题列表
  - 专题活动页面
- 参团功能
  - 我的拼团
  - 分享页面
- 抽奖团
  - 抽奖团列表
  - 抽奖团详情
  - 下单流程（和拼团下单可以复用）
- 搜索
  - 搜索页面
  - 搜索结果页面
  - 分类搜索页
- 订单相关
  - 订单列表
  - 订单详情
- 收货地址模块
  - 新建
  - 列表

## 业务功能说明

- api 调用

```
  this.$api[接口名](
    {
      // isLoading: false, // 默认 isLoading == true 如果接口不需要显示loading 传false
    },
    res => {
      // 业务逻辑
    },
    err => {}
  );
```

## 升级

[为什么要重构爱抢购项目？](http://tucao.doweidu.com/?/question/13)

现有项目是一个两年前规划实现的方案（在前端的世界），虽然经过几次调整，支持以下功能，但如果想支持更强的功能，则改动成本很大，不如支持更新为已经成熟的框架，技术栈更新

已经完成的工作

- 前后端分离
- 支持cdn
- 增量发布
- 按需加载
- 支持md5文件指纹
- 支持debug 调试模式

还存在的问题，主要是脱离最新技术栈，性能优化提升受到限制，并且应用集成最新的技术存在难度

升级后将在支持以上功能的情况下，还可以做的更多

- 开发更加便捷
- 模块化更容易
- 使用ES6开发，兼容小程序语法
- 技术栈统一，有力开发维护
- 支持条件编译，针对不同场景编译不同的代码
- 支持按需加载更为彻底，以前不需要的公共文件，处理不够细致
- 支持PWA
  - ！Service Worker (离线缓存)
  - ！Manifest （应用清单）
  - Push Notification（推送通知）
- 便于支持骨架屏

而重构并不是简单地使用新框架、新写法重新实现一遍业务，实质上还有更多的功能需要去做以支持新特性，获得新的体验

由于需要，将继续推进全站https，封禁http

如果需要，后期实现服务端渲染SSR也更为容易

- 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
- 更快的内容到达时间(time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。

```bash
# https://segmentfault.com/a/1190000007820338

# 获取short commit id（如：14123c8）
git rev-parse --short HEAD

# 获取当前分支名
git symbolic-ref --short -q HEAD

# gh-pages 发布dist目录，提交当前分支的 commit 号
# 此方式不严谨，因为发布的dist，并不一定是当前的分支编译输出的
# 可以编译输出时，打包文件到dist目录，记录当前输出的相关信息
git rev-parse --short HEAD | xargs gh-pages -d dist --message
```

性能评分基于以下测度得出：

- First Contentful Paint （页面中内容元素首次渲染时间）
- First Meaningful Paint （页面中有意义的内容元素首次渲染时间）
- Speed Index （页面加载过程视觉上的变化速度）
- First CPU Idle （到 CPU 首次空闲的时间）
- Time to Interactive　（到页面可交互的时间）
- Estimated Input Latency （预计输入延迟）

详见 [Lighthouse](https://developers.google.com/web/tools/lighthouse/v3/scoring) 评分指南。

