<template>
  <dwd-page is-header>
    <div class="order-page" :class="{ 'order-page-pb': !showFooterIndex }">
      <!-- 公告 -->
      <div v-if="msgStatus" class="scroll-view-border">
        <div class="msg-img-box">
          <img class="msg-img" src="https://img1.haoshiqi.net/miniapp/horn_9d0f9ebd2c.png">
        </div>
        <div class="msg-content-box">
          <div class="srcoll-view">{{ msgContent.content || '' }}</div>
        </div>
      </div>
      <div class="banner">
        <img v-if="orderInfo.statusLogo" :src="orderInfo.statusLogo" alt="" class="logo">
        <div class="state-box">
          <div class="state">{{ orderInfo.status || orderInfo.statusDesc }}</div>
          <div v-if="orderInfo.canPay" class="countdown">{{ countDownInfo }}</div>
        </div>
      </div>

      <div class="user-info-box">
        <div class="user-name-phone" :class="{ 'phone-cost': orderInfo.order_type === 16 }">
          <div class="user-name">{{ orderInfo.consignee }}</div>
          <div class="user-phone">{{ orderInfo.phone }}</div>
        </div>
        <div class="user-address">{{ orderInfo.address }}</div>
      </div>

      <div class="main-content">
        <div class="prod-box">
          <div v-if="isGat" class="prod-mc" :data-link="orderInfo.schema" @click="$onUrlPage">
            <img class="prod-mc-logo" src="https://img1.haoshiqi.net/miniapp/img/merchant_icon_25a2d95ce6.png">
            <div class="prod-mc-name">{{ orderInfo.merchantName }}</div>
          </div>
          <div
            v-for="(product, productIndex) in productDesc"
            :key="productIndex"
            :data-link="product.schema"
            class="prod-item"
            @click="$onUrlPage"
          >
            <img class="prod-item-img" :src="product.imgUrl">
            <div class="prod-item-right">
              <div class="prod-item-name max-line-2">{{ product.skuName }}</div>
              <div class="prod-item-info">
                <span class="price">￥{{ product.price }}</span>
                <span class="num">x{{ product.amount }}</span>
              </div>
              <div v-for="(attr, attrIndex) in product.attrs" :key="attrIndex" class="prod-item-attrs">{{ attr }}</div>
              <div class="prod-item-btns">
                <div
                  v-if="product.canRefund"
                  class="prod-btn"
                  @click.stop="goRefund(product.orderId, product.subOrderId)"
                >申请退款</div>
                <div
                  v-if="product.refundId > 0"
                  class="prod-btn prod-btn-red"
                  :data-suborderid="product.subOrderId"
                  :data-orderstatus="product.status"
                  :data-refundid="product.refundId"
                  @click.stop="goRefundDetail(product.refundId)"
                >{{ product.refundStatus }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="msg-box">
          <div class="msg-title">买家留言：</div>
          <div class="msg-content">{{ orderInfo.note }}</div>
        </div>
        <div class="amount-box">
          <div v-for="(price, priceIndex) in priceDesc" :key="priceIndex" class="amount-item">
            <span>{{ price.name }}</span><span class="amount-item-vaule">{{ price.icon + price.value }}</span>
          </div>
          <!-- <div class="amount-item amount-total">订单总价<span>￥{{needPayPrice}}</span></div> -->
          <div class="amount-item amount-real">
            <span>实付款</span><span class="amount-real-val">￥{{ orderInfo.needPayPrice }}</span>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="order-msg">
          <div class="order-num">
            订单号：{{ orderInfo.id }}
            <div class="order-num-copy" @click="handleCopy">复制</div>
          </div>
          <div v-for="(step, stepIndex) in orderInfo.stepList" :key="stepIndex" class="order-time">
            {{ step }}
          </div>
        </div>
        <div class="mc-btns">
          <div class="mc-btn">
            <div class="mc-btn-txt mc-btn-l" @click="makePhoneCall">联系卖家</div>
          </div>
          <div class="mc-btn">
            <div class="mc-btn-txt mc-btn-r" @click="goService">在线客服</div>
          </div>
        </div>
      </div>

      <template v-if="showFooterIndex == 1">
        <div v-if="orderInfo.statusCode == 1 && orderInfo.savePrice" class="save-money">付款后即节省￥{{ orderInfo.savePrice }}</div>
        <div v-if="orderInfo.hasBottom" class="order-footer">
          <div v-if="orderInfo.canConfirm" class="btn-normal btn-red" @click="confirmReceipt">确认收货</div>
          <div v-if="orderInfo.canPay" class="btn-normal btn-red" @click="payOrder">付款</div>
          <div v-if="orderInfo.canCancel" class="btn-normal" @click="goCancelOrder">取消订单</div>
          <div v-if="orderInfo.canRefund" class="btn-normal" @click="goRefund(orderInfo.id, undefined, orderInfo.needPayPrice)">申请退款</div>
          <div v-if="orderInfo.refundId" class="btn-normal btn-red" @click="goRefundDetail(orderInfo.refundId)">退款详情</div>
          <div v-if="orderInfo.canViewDelivery" class="btn-normal" @click="goDelivery">查看物流</div>
        </div>
      </template>
      <template v-else-if="showFooterIndex == 2">
        <div v-if="orderInfo.pinStatusDesc" class="div-share">
          <template v-if="orderInfo.coupleStatus == 1">
            <button class="btn-share" open-type="share">{{ orderInfo.pinStatusDesc }}</button>
          </template>
          <template v-else>
            <button class="btn-share" @click="onLotterList">{{ orderInfo.pinStatusDesc }}</button>
          </template>
        </div>
      </template>
    </div>
    <mt-actionsheet
      v-model="sheetVisible"
      :actions="cancelActions"
    />
  </dwd-page>
</template>
<script>
import { formatDate } from '@/utils/base/date'
import CountManger from '@/utils/count-manger'
import { formatCountDown } from '@/utils/base/date'
import { Actionsheet } from 'mint-ui'
import { dealPrice } from '@/utils'
import env from '@/config/env'

let timeStamp
let endTime

export default {
  name: 'order-detail',
  components: {
    [Actionsheet.name]: Actionsheet,
  },
  data() {
    return {
      isLoading: true,
      msgStatus: false,
      orderInfo: {
        savePrice: '',
        phone: '',
        address: '',
        needPayPrice: '',
      },
      productDesc: [],
      priceDesc: [],
      leftTime: 0,
      countDownInfo: '',
      sheetVisible: false,
      cancelActions: [],
      msgContent: '',
      isGat: !env.isChannel('guanaitong'),
      //showMerchant: !device.gat, //关爱通不显示店铺入口

    }
  },
  computed: {
    orderId() {
      return this.$route.query.id
    },
    // invoiceDesc() {
    //   let invoiceText
    //   if (this.orderInfo.invoice_type === 2) {
    //     invoiceText = '个人'
    //   } else if (this.orderInfo.invoice_type === 3) {
    //     invoiceText = '公司'
    //   } else {
    //     invoiceText = '不需要发票'
    //   }
    //   return {
    //     title: invoiceText,
    //     type:this.orderInfo.invoice_type,
    //     desc: this.orderInfo.invoiceTitle || this.orderInfo.invoice_title,
    //   }
    // },
    showFooterIndex() {
      //0普通订单, 1拼团中, 2拼团成功, 3拼团失败, 4付款后拼团订单, 5拼团未付款取消订单
      let showFooterIndex = 0
      switch (this.orderInfo.coupleStatus) {
        case 1:
          if (this.orderInfo.canPay || this.orderInfo.canCancel) {
            showFooterIndex = 1
          }else {
            showFooterIndex = 2
          }
        break
        case 3:
        case 4:
          showFooterIndex = 2
        break
        default:
          if (this.orderInfo.hasBottom) {
            showFooterIndex = 1
          }
        break
      }
      return showFooterIndex
    },
  },
  created() {
    this.refresh()
  },
  beforeDestroy() {
    this.clearPageData()
  },
  methods: {
    refresh() {
      const params = {
        orderId: this.orderId,
      }
      this.isLoading = true
      this.getData(params)
    },
    getData(params) {
      this.$api.orderDetail(
        Object.assign({}, params, { weights: 1 }), (res) => {
        const { data } = res
        this.orderInfo = Object.assign({}, this.orderInfo, data)
        this.dealOrderInfo(data)
        timeStamp = res.timestamp
        endTime = data.created_at + 3600
        let msgEndTime = data.message && data.message.end_time || 0
        if (endTime * 1000 > timeStamp && data.canPay) {
          this.countDown()
        }
        // 公告展示判断
        if(timeStamp < msgEndTime){
          this.msgStatus = true
          this.msgContent = data.message || {}
        }
        this.productDesc = []
        if (data.skuList) {
          this.dealSku(data.skuList)
        }
        this.dealPrise(data)
        this.isLoading = false
      }, (err) => {
        console.log(err)
      })
    },
    dealOrderInfo(data) {
      let city = data.deliveryCity || data.delivery_city
      let address = data.delivery_province
      address += city + data.delivery_district
      address += data.delivery_detail_address
      let orderStatus = {}
      orderStatus = {
        canPay: data.canPay || false,
        canCancel: data.canCancel || false,
        canRefund: data.canRefund && data.delivery_status === 1,
        canViewDelivery: data.canViewDelivery || false,
        canConfirm: data.canConfirm || false,
        refundId: data.refundId || 0,
        note: data.note || '无留言',
        savePrice: dealPrice(data.saved_money),
        phone: data.consigneePhone || data.consignee_phone,
        needPayPrice: dealPrice(data.need_pay_price),
        address: address,
        consignee: this.orderInfo.order_type === 16 ? '充值手机号' : this.orderInfo.consignee,
      }
      orderStatus.hasBottom = orderStatus.canPay || orderStatus.canCancel || orderStatus.canRefund ||
                              (orderStatus.refundId > 0) || orderStatus.canViewDelivery || orderStatus.canConfirm
      this.orderInfo = Object.assign({}, this.orderInfo, orderStatus)
    },
    dealSku(list) {
      list.forEach((item) => {
        const price = dealPrice(item.unit_price)
        this.productDesc.push({
          subOrderId: item.id,
          pinId: item.pin_activities_id || this.orderInfo.pin_activities_id,
          skuId: item.sku_id, // 普通商品
          skuName: item.sku_name,
          imgUrl: item.skuThumbnail,
          price,
          amount: item.amount,
          attrs: item.attrs_desc,
          schema: item.schema,
          orderId: item.order_id,
          status: item.status,
          refundId: item.refundId,
          canRefund: item.subCanRefund,
          refundStatus: item.refundStatusDesc || '退款详情',
        })
      })
    },
    dealPrise(data) {
      this.priceDesc = []
      this.priceDesc.push({
        name: '商品总额',
        value: dealPrice(data.productsPrice),
        icon: '￥',
      })
      // data.delivery_price = data.isFreeDelivery ? 0 : data.delivery_price;
      this.priceDesc.push({
        name: '运费',
        value: dealPrice(data.delivery_price),
        icon: '+￥',
      })
      data.merchant_discount = data.merchant_discount || 0
      this.priceDesc.push({
        name: '商家优惠',
        value: dealPrice(data.merchant_discount),
        icon: '-￥',
      })
      data.platform_discount = data.platform_discount || 0
      this.priceDesc.push({
        name: '平台优惠',
        value: dealPrice(data.platform_discount),
        icon: '-￥',
      })
    },
    countDown() {
      const that = this
      const diffTime = (timeStamp * 1000) - (+new Date())
      const localEndTime = (endTime * 1000) + diffTime

      this.countDownManger = new CountManger({
        times: 1000,
        dataList: [{}], // this.data.leftTime,
        set() {
          if (localEndTime - new Date() > 0) {
            this.start()
          } else {
            that.leftTime = 0
          }
        },
        callback() {
          const leftTime = localEndTime - new Date()
          if (leftTime > 0) {
            const countDown = formatCountDown(leftTime, 'F分S秒')
            that.countDownInfo = `剩余${countDown}自动关闭`
          } else {
            that.countDownInfo = '剩余00分00秒自动关闭'
            this.clear()
          }
          console.log()
        },
      })
    },
    goRefund(orderId, subOrderId, refundPrice) {
      this.$forward('order-refund', {
        orderId,
        subOrderId,
        refundPrice,
      })
    },
    // 查看退款详情
    goRefundDetail(refundId) {
      this.$forward('order-refund-detail', {
        refundId,
      })
    },
    goCancelOrder(){
      const orderId = this.orderInfo.id
      console.log(orderId)
      this.sheetVisible = true
      this.cancelActions = [{
        name: '我不想买了',
        method: this.cancelOrder,
        reason: 1,
        orderId,
      }, {
        name: '信息填写错误',
        method: this.cancelOrder,
        reason: 2,
        orderId,
      }, {
        name: '商品停售或缺货',
        method: this.cancelOrder,
        reason: 3,
        orderId,
      }, {
        name: '其他原因',
        method: this.cancelOrder,
        reason: 4,
        orderId,
      }]
    },
    cancelOrder(item) {
      const { reason, orderId, clickIndex } = item
      this.$showLoading({
        content: '订单正在取消...',
      })
      this.$api.orderCancel({
        orderId: orderId,
        reason: reason,
      }, (res) => {
        this.$hideLoading()
        setTimeout(() => {
          this.$showToast('订单取消成功')
        }, 500)
        setTimeout(() => {
          if (this.countDownManger) {
            this.countDownManger.clear()
          }
          this.getData({
            orderId,
          })
        }, 1000)
      }, (err) => {
        this.$showToast('订单取消失败')
      })
    },
    payOrder() {
      const { orderId, orderType, need_pay_price, pin_activities_id } = this.orderInfo
      const lastJoinCouple = ((this.orderInfo.pinCountLimit || 0) - (this.orderInfo.pinJoinCount || 0)) == 1
      this.$forward(`${window.location.origin}/index.html#order_pay?orderIds=${orderId}&lastJoinCouple=${lastJoinCouple}&price=${need_pay_price}&pinActivitiesId=${pin_activities_id}&orderType=${orderType}`)
    },
    goDelivery() {
      const { orderId, deliveryWay } = this.orderInfo
      let url = deliveryWay == 2 ? 'order_delivery2b' : 'order_delivery'
      this.$forward(`${window.location.origin}/index.html#${url}?orderid=${orderId}`)
    },
    // 确认收货
    confirmReceipt() {
      console.log('确认收货订单号为' + this.orderInfo.id + '的订单')
      const that = this
      const { id } = this.orderInfo
      this.$showConfirm({
        title: '确认已经收到货了吗？',
        message: '请务必在已收货的情况下进行确认！',
        confirmButtonText: '确认收货',
        cancelButtonText: '取消',
        callback(res) {
          if(res != 'cancel' && res != 'error') {
            that.$showLoading()
            that.$api.confirmReceived({
              orderId: id,
            }, (res) => {
              that.$hideLoading()
              setTimeout(function () {
                that.$showToast('确认收货成功！')
              }, 1000)
              setTimeout(() => {
                that.getData({orderId:id})
              }, 2000)
            }, (err) => {
              that.$showToast('确认收货失败')
              console.log(err)
            })
          }
        },
      })
    },
    clearPageData() {
      if (this.countDownManger) {
        this.countDownManger.clear()
      }
    },
    // 跳转到抽奖团列表
    onLotterList() {
      const orderType = this.orderInfo.orderType
      if (orderType == 2 || orderType == 3) {
        this.forward('index', {})
      } else if (orderType == 4 || orderType == 5) {
        this.forward('lottery-list', {})
      }
    },

    handleCopy() {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', this.orderInfo.id)
      input.select()
      document.execCommand('copy')
      input.style.display = 'none'
      this.$showToast('复制成功')
    },

    // 联系卖家
    makePhoneCall() {
      window.location.href = 'tel://' + (this.orderInfo.serviceTel || '')
    },
    goService() {
      location.href = window.location.origin + '/index.html#service'
    },
  },
}
</script>
<style lang="stylus" scoped>
.order-page {
  margin: 0;
  font-size: 12px;
  padding-bottom: 95px;
  overflow: scroll;
}
.order-page-pb {
  padding-bottom: 50px;
}
.msg-img-box {
  height: 32px;
  width: 45px;
}

.msg-img {
  width: 20px;
  height: 20px;
  margin-top: 6px;
  margin-left: 17px;
}

.msg-content-box {
  position: relative;
  flex: 1;
  overflow: hidden;
}
.srcoll-view {
  position: absolute;
  top: 0;
  height: 32px;
  white-space: nowrap;
  line-height: 32px;
  color: #ffffff;
  animation: myfirst 20s linear infinite;
}
@keyframes myfirst {
  0% {margin-left: 330px;}
  100% {margin-left: -600px;}
}
.scroll-view-border {
  position: fixed;
  display: flex;
  left: 0;
  // top: 44px;
  width: 100%;
  background: rgba(0, 0, 0, .6);
  height: 32px;
  z-index: 1;
  overflow: hidden;
}

.banner {
  background-color: #FB0438;
  height: 140px;
  width: 100%;
  position: relative;
}
.state-box {
  position: absolute;
  left: 20px;
  top: 80px;
  line-height: 24px;
  color: #fff;
  font-size: 18px;
  white-space: nowrap;
  transform: translate3d(0%, -50%, 0);
}
.countdown {
  font-size: 14px;
  line-height: 21px;
}
.banner .logo {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 140px;
  width: 180px;
}

.user-info-box {
  padding: 15px 20px;
  background: #ffffff;
}

.user-name-phone {
  display: flex;
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
}

.user-name {
  font-size: 18px;
  padding-right: 15px;
}

.user-phone {
  flex: 1;
}

.phone-cost {
  justify-content: center;
  color: #333333;
}

.phone-cost .user-phone {
  flex: none;
  font-size: 18px;
  color: #151515;
}

.user-address {
  line-height: 17px;
  color: #999999;
  margin-top: 3px;
}

.main-content {
  border-radius: 3px;
  margin: 10px 10px 0;
  background: #ffffff;
}

.prod-box {
  padding-top: 10px;
}

.prod-mc {
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  font-weight: bold;
  height: 20px;
  line-height: 20px;
  padding: 0 10px;
}

.prod-mc-logo {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  margin-top: -2px;
}

.prod-mc-name {
  display: inline-block;
  padding-right: 11px;
  background-image: url("https://img1.haoshiqi.net/miniapp/more_97c7eecf32.png");
  background-repeat: no-repeat;
  background-size: 10px 10px;
  background-position: 100% 50%;
}

.prod-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #F4F4F4;
}

.prod-item-img {
  width: 90px;
  height: 90px;
}

.prod-item-right {
  flex: 1;
  padding-left: 10px;
  box-sizing: border-box;
}

.prod-item-name {
  font-size: 12px;
  font-weight: bold;
  max-height: 34px;
  line-height: 17px;
}

.prod-item-info {
  color: #F73552;
  font-size: 16px;
  font-weight: bold;
  height: 22px;
  line-height: 22px;
  padding: 3px 0;
  box-sizing: content-box;
}

.prod-item-info .num {
  color: #333333;
  float: right;
}

.prod-item-attrs {
  line-height: 16px;
  font-size: 12px;
  color: #999999;
}

.prod-btn {
  float: right;
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  padding: 0 16px;
  border: 1px solid #CDCDCD;
  border-radius: 13px;
  box-sizing: content-box;
}

.prod-btn-red {
  color: #F21833;
  border: 1px solid #FB0438;
}

.msg-box {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #F4F4F4;
}

.msg-title {
  display: inline-block;
}

.msg-content {
  flex: 1;
}

.amount-box {
  padding: 10px 0 20px 10px;
}

.amount-item {
  color: #999999;
  line-height: 24px;
  padding-right: 10px;
}

.amount-item .amount-item-vaule {
  float: right;
}

.amount-total {
  color: #333333;
}

.amount-real {
  position: relative;
  color: #333333;
  font-size: 14px;
  padding-top: 5px;
  margin-top: 4px;
  border-top: 1px solid #cccccc;
  &:after {
    content: "";
    display: block;
    position: absolute;
    right: 29px;
    top: -5px;
    width: 8px;
    height: 8px;
    border-top: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
    background: #ffffff;
    transform: rotate(45deg);
  }
}

.amount-real .amount-real-val {
  color: #F21833;
}

.order-msg {
  margin-left: 10px;
  padding: 10px 10px 13px 0;
  border-bottom: 1px solid #F4F4F4;
}

.order-num {
  line-height: 24px;
}

.order-num-copy {
  float: right;
  height: 21px;
  line-height: 21px;
  width: 54px;
  text-align: center;
  box-sizing: content-box;
  border-radius: 11px;
  border: 1px solid #CDCDCD;
}

.order-time {
  color: #3F3F3F;
  line-height: 24px;
}

.mc-btns {
  display: flex;
  padding: 7px 0;
  text-align: center;
}

.mc-btn {
  flex: 1;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
}

.mc-btn:first-of-type {
  border-right: 1px solid #CCCCCC;
}

.mc-btn-txt {
  display: inline-block;
  padding-left: 28px;
  background-repeat: no-repeat;
  background-size: 20px 20px;
  background-position: left center;
}

.mc-btn-l {
  background-image: url("https://img1.haoshiqi.net/miniapp/tel_b459f1e09b.png");
}

.mc-btn-r {
  background-image: url("https://img1.haoshiqi.net/miniapp/service_3838fc4c66.png");
}


.order-footer {
  width: 100%;
  height: 50px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  color: #666666;
  padding: 10px 18px 14px;
  border-top: 1px solid #F4F4F4;
}
.btn-normal {
  height: 25px;
  line-height: 25px;
  font-size: 13px;
  border: 1px solid #CDCDCD;
  border-radius: 13px;
  float: right;
  padding: 0 15px;
  margin-left: 10px;
  text-align: center;
  box-sizing: content-box;
}
.btn-red {
  color: #FB0438;
  border: 1px solid #FB0438;
}
.save-money {
  width: 100%;
  height: 35px;
  position: fixed;
  bottom: 50px;
  line-height: 35px;
  text-align: center;
  font-size: 14px;
  color: #F56D36;
  background-color: #FEFCED;
  left:0;
}

/* 邀请好友参团 */
.div-share {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid rgb(226, 226, 226);
  overflow: hidden;
}

.btn-share {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  margin-bottom: 0;
  color: #FB0438;
  background-color: white;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

 /* 去除边框  */
 .btn-share::after {
  border: none;
}
</style>
