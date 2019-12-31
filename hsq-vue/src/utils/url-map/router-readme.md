## h5 路由

| 页面名 | 页面备注 | query |
|:---------|:---------|:--------|
| **tab页** |||
| index | 首页 |  |
| category | 分类页 |  |
| new-product | 今日新品页 |  |
| profile | 个人中心页 |  |
| **支付流程部分** |||
| shopping-cart | 购物车页 |  |
| search | 搜索页 |  |
| couple-detail | 拼团详情 | ` {  id: 111, // 拼团id }` |
| detail | 单品详情 | ` {  id: 111, // sukid }` |
| rule | 拼团规则页 |  |
| merchant | 商家主页 | ` {  id: 111, // 商家id }`  |
| order-commit | 订单确认页(支付页) |  `{  "amount": 111, // 购买数量(件数)  "pinEventId": 1, // 拼团事件id  "eventId": 1, // 事件id 助力免单那边过来的参数  "skuId": 1, // skuId  "orderType": 3, // 订单类型  "pinActivitiesId": 111, // 拼团id "id": 111, // 活动ID（助力免单）  "zlFlag": 1, // 是否是助力免单 }` |
| available-coupon-list | 可用优惠券列表页（下单时优惠券选择页） | `{ "skusInfo": "牛奶", // sku json 信息 "orderType": "3", // 订单类型  "id": 111, // 拼团id}`|
| couple-share | 拼团分享页 | `{ "id": 111, // 拼团事件id, orderId: xx, // 订单id }` |
| couple-search-list | 搜索结果页 | `{ q: '牛奶', // 搜索关键字 category: '休闲零食', // 分类名称 }` |
| service  | 客服页 |  |
| **个人中心部分** |||
| coupon-sku-list | 优惠券可使用 产品列表 | `{ "q": '牛奶', // 搜索关键字 } `  |
| coupon-list | 优惠券列表页 ||
| coupon-desc | 优惠券使用说明页||
| coupon-invalid-list | 已实效优惠券列表页||
| favorite-list | 我的收藏页 ||
| couple-order-list | 我的拼团页 |`{  "type": 1, // tab 分类项  "hideTabs": true, // 是否隐藏 tab header }`|
| about | 关于我们||
| view-history | 浏览历史页||
| address-list | 地址列表页 | `{ "orderAddress": 1, // 从订单支付跳转过来的标识 }`|
| address-update | 地址编辑页 |`{ "id": 11, // 地址id "orderAddress": 1, // 从订单支付跳转过来的标识 }`|
| **订单部分** |||
| order-list | 订单列表页 |`{  "type": 1, // tab 分类项 }`|
| order-detail | 订单详情页 |`{ "id": 1, // 订单id }`|
| delivery | 物流信息页 |`{ "id": 1, // 订单id }`|
| order-refund | 申请退款页 |`{  "orderId": 22, // 订单id "subOrderId": 11, // 子订单id }`|
| order-refund-detail | 退款详情页 |`{ "refundId": 1, // 退款id }`|
| **助力免单** |||
| complaint | 投诉类型选择页 ||
| complaint-submit | 投诉提交页 | `{ "id": 1, // 投诉类型id }` |
| zl-list | 助力免单列表 ||
| zl-rule | 助力免单规则||
| zl-task | 我的助力免单||
| zl-detail | 助力详情|`{ "id": 1, // 活动id }`|
| zl-invite | 我的助力详情|`{  "eid": 1, // 事件id }`|
| zl-late | 助力结束页 ||
| zl-codeimg | 生成分享二维码页 |`{  "eid": 1, // 事件id }`|
| **抽奖团** |||
| lottery-list | 抽奖团列表 ||
| lottery-win-list | 中奖详情 |`{  "id": 1, // 拼团id  }`|
| lottery-detail | 抽奖详情 |`{  "id": 1, // 拼团id  "index": 1, // 下标 }`|
| lottery-detail-share | 抽奖团分享 |`{  "id": 1, // 拼团id  }`|
| **其他页** |||
| login | 登录 ||
| city | 城市选择页||
| message | 消息页||
| comment-list | 评论列表||
| download | 下载页||
| topic | h5专题（webview）||
| error | 错误页||
| zt | 专题页|`{ id: 111, // 专题id }`|
| zt2 | 老专题页|`{ id: 111, // 专题id }`|

## 哪些需要做映射的页面

  > - 拼团详情 (couple-detail)
  > - 单品详情 (detail)
  > - 专题（zt,topic）
  > - 邀请好友
  > - 助力免单列表(zl-list)
  > - 抽奖团列表 (lottery-list)
  > - 搜索结果页（一折两折的按钮 couple-search-list）

## 给app 一套页面名称和参数规范

## 做一份新的h5 到老的h5的映射
``` js
  // 老专题
  {
    zt2: {
      target: 'zt_template',
      params: {
        id: 'topic_code',
      },
    },
  }
```
``` js
  // 拼团搜索结果页
  {
    'couple-search-list': {
      target: 'couple_search_list',
      params: {
        q: 'search',
        category:'category',
      }
    }
  }
```

``` js
  // 单品详情
  {
    detail: {
      target: 'detail',
      params: {
        id: 'sid',
      },
    },
  }
```

``` js
  // 拼团详情
  {
    'couple-detail': {
      target: 'couple_detail',
      params: {
        id: 'pinactivitiesid',
      }
    }
  }
```

``` js
  // 抽奖团列表
  {
    'lottery-list': {
      target: 'lottery_list',
      params: {}
    }
  }
```

``` js
  // 抽奖团详情
  {
    'lottery-detail': {
      target: 'lottery_detail',
      params: {
        id: 'pinactivitiesid'
      }
    }
  }
```

``` js
  // 助力免单列表
  {
    'zl-list': {
      target: 'zl_list',
      params: {}
    }
  }
```


### 配置链接事例

- https://m.haoshiqi.net/v2/<新页面名称>?<key=value>

> 注：跳转本项目(好食期拼团h5) 一律使用新的链接格式
> 跳转 非本项目 一律使用源链接
---------

- 老专题配置链接 `http://m.dev.haoshiqi.net/#zt_template?topic_code=f0757ea80248c343c77712ddbc0db426`

> 新配置链接 `https://m.haoshiqi.net/v2/zt2?id=f0757ea80248c343c77712ddbc0db426`

- 新专题一律配置源链接

>  `https://topic.dev.doweidu.com/?id=5b1f9e63cb8826be262c1ad51198515c&origin=hsq_h5`
>  `https://topic.dev.doweidu.com/zt?id=e4efb8ba4c72834252a037ff10915912`

### 例

  > - 拼团详情 (couple-detail) `https://m.haoshiqi.net/v2/couple-detail?id=xxx`
  > - 单品详情 (detail) `https://m.haoshiqi.net/v2/detail?id=xxx`
  > - zt专题 `https://m.haoshiqi.net/v2/zt?id=f0757ea80248c343c77712ddbc0db426`
  > - topic专题 `https://topic.dev.doweidu.com/?id=5b1f9e63cb8826be262c1ad51198515c&origin=hsq_h5`
