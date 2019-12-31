import { copy } from '@dwdjs/utils'

/**
 * API 命名规则
 * - 使用 camelCase 命名格式（小驼峰命名）
 * - 命名尽量对应 RESTful 风格，`${动作}${资源}`
 * - 假数据增加 fake 前缀
 * - 便捷易用大于规则，程序是给人看的
 */
let params = {}
let reqHeaders = {}

// api 列表
export const modelApis = {
  // 初始化配置
  test: 'https://easy-mock.com/mock/5aa79bf26701e17a67bde1d7/',
  getConfig: '/common/initconfig',
  getWxSign: '/common/getwxsign',
  // 积分兑换
  getPointIndex: '/point/index',
  getPointList: '/point/skulist',
  getPointDetail: '/point/iteminfo',
  getPointDetaiMore: '/product/productdetail',
  getRList: '/point/recommenditems',
  // 专题
  getPointTopicInfo: '/point/topicinfo',
  getPointTopicList: '/point/topicbuskulist',
  // 主站专题
  getTopicInfo: '/product/topicskusinfo',
  getTopicList: '/product/topicskulist',
  // 个人中心
  getProfile: '/user/usercenter',

  getUserInfo: '/user/userinfo',
  // 拼团相关
  getCoupleList: '/product/coupleskulist_v1',

  getCoupleDetail: '/product/coupleskudetail', //拼团商详页接口
  coupleOrderInit: 'POST /order/coupleorderinit',
  coupleOrderList: '/user/usercouplelist',
  coupleOrderDetail: '/user/usercoupleorderdetail',
  coupleUserList: '/market/pinactivitiesuserlist', // 分享页拼团头像列表
  coupleShareDetail: '/user/coupleactivitiedetail', // 分享详情

  // 首页
  getIndex: '/common/index',
  getIndexNew: '/common/index_v2', // index_v1
  getHotSearch: '/common/hotsearchsug',

  getRecentpinevents: '/common/recentpinevents', // 首页顶部浮动轮播消息

  // 搜索页
  getSearchSuggest: '/market/searchsuggest',  //搜索建议
  coupleSearchlist: '/market/pinactivitiessearch', // 拼团搜索、分类结果页

  // 主流程
  orderInit: 'POST /order/orderinit',
  orderSubmit: 'POST /order/submitorder',
  orderPay: 'POST /order/orderpay',
  orderPayConfirm: '/order/orderpayconfirm', // 确认支付状态
  getUserOrders: '/order/getuserorders', // 订单列表
  getNeedCommentOrders: '/order/waitcommentlist', // 待评论
  getUserRefundorders: '/order/userrefundorder', // 退款
  getUserServiceOrders: '/order/userserviceorders', // 售后
  orderCancel: 'POST /order/cancelorder', // 取消订单
  orderDetail: '/order/orderdetail',
  subOrderInfo: '/tradecenter/suborderinfo', // 子订单详情
  confirmReceived: 'POST /order/userorderconfirm', // 确认收货
  orderComplaint: 'POST /refund/complaint', // 订单申诉
  // 普通订单相关
  orderInitV1: 'POST /order/orderinit_v1', //普通购订单初始化
  submitOrderV1: 'POST /order/submitorder_v1', // 普通购提交订单
  // 普通订单回调完成
  getOrderResult: '/tradecenter/ordersuccess_v1',

  checkDelivery: '/product/checkdelivery', //查询运费信息
  // 积分订单相关
  pointOrderInit: 'POST /tradecenter/pointorderpreview',
  pointOrderSubmit: 'POST /tradecenter/pointordersubmit',
  pointOrderCancel: 'POST /tradecenter/ordercancel',
  pointOrderList: '/tradecenter/orderlist',
  pointOrderDetail: '/tradecenter/orderinfo',
  pointOrderSuccess: '/tradecenter/ordersuccess',
  // 店铺详情
  getMerchantInfo: '/merchant/merchantinfo',
  getMerchantList: '/merchant/coupleskulist',
  setUnLikeMerchant: 'POST /user/unlikemerchant',
  setLikeMerchant: 'POST /user/likemerchant',
  setActivitySubscribe: 'POST /activity/subscribe',

  getMerchantCouponlist: '/reward/merchantcouponlist', //优惠券
  codeRedeem: 'POST /reward/coderedeem', //券码核销

  // 退款相关
  refundInit: '/refund/init',
  refundDetail: '/refund/detail',
  refundApply: 'POST /refund/apply',

  hsqMemberPayInit: '/member/hsqmemberpayinit', // 好会员开通/续费支付页面
  getMemberCenter: '/member/membercenter', // 会员中心
  getOrderPaySuccessPopup: '/order/orderpaysuccesspopup', // 好会员支付成功弹窗

  receiveMemberCoupon: 'POST /user/lightmemberbenefitexchange', // 领取会员券


  getNewTopicInfo: '/market/specialtopic/topicinfo', // 获取专题信息

  // 登录注销
  login: 'POST /user/login',
  logout: 'POST /user/logout',
  // 地址管理
  addressList: '/user/addresslist',
  addAddress: 'POST /user/addaddress',
  updateAddress: 'POST /user/updateaddress',
  setDefaultAddress: 'POST /user/setdefaultaddress',
  deleteAddress: 'POST /user/deleteaddress',
  provinceList: '/nation/provincelist',
  cityList: '/nation/citylist',
  districtList: '/nation/districtlist',
  getCityId: '/common/gpstogeo',
  // 查看物流
  getDelivery: '/order/deliverymessage',
  // 获取七牛 token
  getQiniuToken: '/common/qiniutoken',
  //新品推荐
  getNewProduct: '/market/newskulist',
  //分类
  getCategory: '/category/categorylist_v1',
  getCategoryAd: '/category/categoryadlist', // 获取分类下的banner

  // 话费充值接口
  getPreaidList: '/product/prepaidlist', // 话费充值列表
}

export const commonParams = {
  init(data) {
    params = copy(data)
  },
  set(obj) {
    Object.assign(params, obj)
  },
  get(key) {
    return key ? copy(params[key]) : copy(params)
  },
}

export const headers = {
  init(data) {
    reqHeaders = copy(data)
  },
  set(obj) {
    Object.assign(reqHeaders, obj)
  },
  get(key) {
    return key ? copy(reqHeaders[key]) : copy(reqHeaders)
  },
}

// const apiConfig = ;
