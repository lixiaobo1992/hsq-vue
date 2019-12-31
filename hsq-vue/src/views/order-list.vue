<template>
  <dwd-page is-header>
    <dwd-scroll
      v-model="pullLoading"
      class="page-scroll"
      :finished="finished"
      :list-len="listData.length"
      :is-loading="isLoading"
      :finished-tip="finishedTip"
      :immediate-check="scrollCheck"
      @onScrollToLower="onScrollToLower"
    >
      <div class="page">
        <div class="page-header">
          <div
            v-for="type in typeList"
            :key="type.text"
            class="header-item"
            :class="{ active: pageType == type.typeIndex }"
            @click="switchHeader(type.typeIndex)"
          >
            <span>{{ type.text }}</span>
            <span v-if="countList[type.countType]">({{ countList[type.countType] }})</span>
          </div>

        </div>
        <div class="list-block">
          <div v-for="(order, orderIndex) in listData" :key="order.id" class="order-box">
            <div class="order-list">
              <div v-if="pageType == 4" class="order-id">
                <div><span>订单号：</span><span class="order-id">{{ order.id }}</span></div>
              </div>
              <div v-if="isGat" class="order-head flex-between" @click="goMerchant(order.merchantId)">
                <div class="order-shop v-center">
                  <i class="icon-shop" />
                  <div class="shop-text">{{ order.merchantName }}</div>
                  <i class="icon-right" />
                </div>
                <div v-if="pageType != 4" class="order-status fr">{{ order.statusDesc }}</div>
              </div>
              <div
                v-for="pitem in order.list"
                :key="pitem.id"
                class="order-item"
                @click="goOrderDetail(order.id)"
              >
                <img v-lazy="pitem.thumbnail" class="order-item-image">
                <div class="order-item-info">
                  <div class="order-title max-line-2">{{ pitem.name }}</div>
                  <div class="order-info flex-between">
                    <div class="order-price">¥ {{ pitem.price }}</div>
                    <div class="order-number"><span class="order-unit">x</span>{{ pitem.amount }}</div>
                  </div>
                  <div class="order-skus">
                    <div v-for="sku in pitem.skus" :key="sku" class="order-sku max-line-1 f11">{{ sku }}</div>
                  </div>
                  <div v-if="pageType != 4" class="order-refund">{{ pitem.refundStatusDesc }}</div>
                </div>
                <div v-if="pageType == 4" class="v-center oper-box">
                  <div class="order-refund">{{ pitem.refundStatusDesc }}</div>
                  <div
                    v-if="pitem.refundId > 0 && pageType == 4"
                    class="btn-info"
                    :data-orderid="pitem.id"
                    :data-refundid="pitem.refundId"
                    :data-refundprice="order.payPrice"
                    :data-index="orderIndex"
                    @click.stop="goRefundDetail(pitem)"
                  >
                    查看退款详情
                  </div>
                </div>
              </div>
              <div v-if="pageType != 4" class="sum-info">
                <span>共{{ order.total_amount }}件商品 小计:</span>
                <span class="sum-price">¥{{ order.payPrice }}</span>
              </div>
              <div v-if="pageType != 4" class="oper-box padding">
                <template v-for="btnType in btnTypeList">
                  <div
                    v-if="order[btnType]"
                    :key="btnType"
                    :class="getBtnOption(btnType).className"
                    @click="handleOrder({
                      ...order.btnOptions,
                      orderIndex,
                      btnType
                    })"
                  >
                    {{ getBtnOption(btnType).text }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <!-- list end -->
        <div v-if="!listData.length && !isLoading" class="no-data">
          <div>
            <img class="empty-img" src="../assets/img/not-search-result.png">
            <div class="empty-text">您还没有相关订单</div>
          </div>
        </div>
      </div>
    </dwd-scroll>
    <mt-actionsheet
      v-model="sheetVisible"
      :actions="cancelActions"
    />
  </dwd-page>
</template>
<script>
import PullListMixin from '@/mixins/pull-list'
import device from '@dwdjs/utils/lib/device'
import { Scroll, Header, Icon } from '@/ui'
import { mapTo } from '@/utils/base'
import env from '@/config/env'
import { Actionsheet } from 'mint-ui'

export default {
  name: 'order-list',
  components: {
    [Scroll.name]: Scroll,
    [Actionsheet.name]: Actionsheet,
  },
  mixins: [PullListMixin],
  data() {
    return {
      pageType: 0,
      typeList: [{
          text: '全部',
          typeIndex: 0,
        }, {
          text: '待付款',
          typeIndex: 1,
          countType: 'toPayNum',
        },
        // {
        //   text: '待分享',
        //   typeIndex: 5,
        //   countType: 'pinOrderNum',
        // },
        {
          text: '待收货',
          typeIndex: 2,
          countType: 'toReceiptNum',
        }, {
          text: '售后',
          typeIndex: 4,
        },
      ],
      countList: {},
      hideHeader: false,
      btnTypeList: ['canCancel', 'canPay', 'canViewDelivery', 'canConfirm', 'canRefund', 'refundId'],
      cancelActions: [],
      sheetVisible: false,
      finishedTip: '没有更多订单了~',
      // showMerchant: !device.gat,
      isGat: !env.isChannel('guanaitong'),
    }
  },
  computed: {
    getOrderFunction() {
      return this.pageType == '4' ? this.$api.getUserServiceOrders : this.$api.getUserOrders
    },
  },
  created() {
    this.pageType = this.$route.query.type || '0'
    this.refresh()
  },
  methods: {
    getOrderList() {
      this.initPullList()
      this.pullParams.weights = 1
      this.pullParams.type = this.pageType
      this.isLoading = true
      this.onScrollToLower()
    },
    pullModel(...rest) {
      this.getOrderFunction.apply(this, rest)
    },
    switchHeader(index) {
      if (this.pageType == index) {
        return
      }
      if(index != 5) {
        this.$router.replace({
          query: {
            type: index,
          },
        })
      }
      switch (index) {
        case 0://全部
        case 1://待付款
        case 2://待收货
        case 4://售后
          this.refreshList(index)
          break
        case 5:

          break
      }
    },
    refreshList(index){
      this.pageType = index
      this.refresh()
    },
    refresh() {
      this.getHeaderData()
      this.getOrderList()
      this.listData = []
    },
    afterPullData() {
      this.isLoading = false
    },
    getBtnOption(type) {
      let text = ''
      let func = ''
      let className = ''
      switch (type) {
        case 'canCancel':
          text = '取消订单'
          func = 'goCancelOrder'
          className = 'btn-info'
          break
        case 'canPay':
          text = '付款'
          func = 'goPay'
          className = 'btn-sure'
          break
        case 'canViewDelivery':
          text = '查看物流'
          func = 'goDelivery'
          className = 'btn-info'
          break
        case 'canConfirm':
          text = '确认收货'
          func = 'goConfirm'
          className = 'btn-sure'
          break
        case 'canRefund':
          text = '申请退款'
          func = 'goRefund'
          className = 'btn-info'
          break
        case 'refundId':
          text = '退款详情'
          func = 'goRefundDetail'
          className = 'btn-sure'
          break
      }
      return { text, func, className }
    },
    dealList(list) {
      return mapTo(list, item => {
        const products = mapTo(item.skuList, it => {
          return {
            name: it.name,
            thumbnail: it.sku_thumbnail,
            price: (it.unit_price*0.01).toFixed(2),
            amount: it.amount,
            refundId: it.refundId,
            refundStatusDesc: it.refundStatusDesc,
            id: it.subOrderId,
            skus: it.attrs_desc || [],
          }
        })
        return {
          id: item.orderId,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          total_amount: item.total_amount,
          statusDesc: item.status,
          list: products,
          payPrice: (item.need_pay_price*0.01).toFixed(2),
          status: item.order_status || item.statusCode,
          canCancel: item.canCancel,
          canPay: item.canPay,
          canRefund: item.canRefund,
          canViewDelivery: item.canViewDelivery,
          canConfirm: item.canConfirm,
          canComment: item.canComment,
          canApplyRefund: item.canApplyRefund,
          refundId: item.refundId || 0,
          refundStatusDesc: item.refundStatusDesc,
          btnOptions: {
            orderId: item.orderId,
            payPrice: item.payPrice,
            subOrderId: item.subOrderId,
            refundId: item.refundId,
            status: item.status,
            price: item.need_pay_price,
            pinActivitiesId: item.pin_activities_id,
            orderType: item.order_type,
            deliveryWay: item.deliveryWay,
            lastJoinCouple: ((item.pinCountLimit || 0) - (item.pinJoinCount || 0)) == 1,
          },
        }
      })
    },
    getHeaderData() {
      this.$api.getProfile({
        isLoading: false,
      }, res => {
        const { data } = res
        const toPayNum = data.toPayNum
        const toReceiptNum = data.toReceiptNum
        const toRefundNum = data.toRefundNum
        const pinOrderNum = data.pinOrderCnt
        this.countList = { pinOrderNum, toPayNum, toReceiptNum, toRefundNum }
        this.hideHeader = false
      }, err => {
        return true
      })
    },
    cancelOrder(item) {
      const that = this
      const { reason, orderId, clickIndex } = item
      const newDataList = [...this.listData]
      this.$showLoading({
        content: '订单正在取消...',
      })
      this.$api.orderCancel({
        orderId: orderId,
        reason: reason,
      }, (res) => {
        this.$hideLoading()
        setTimeout(() => {
            this.$showToast('取消成功！')
          }, 500)
        this.refresh()
        // if (this.pageType === '1') {
        //   this.refresh();
        // } else {
        //   const data = mapTo([res.data], (item) => {
        //     return {
        //       statusDesc: item.status,
        //       status: item.statusCode,
        //       canCancel: item.canCancel,
        //       canPay: item.canPay,
        //       canRefund: item.canRefund,
        //       refundId: item.refundId,
        //       canViewDelivery: item.canViewDelivery,
        //       canConfirm: item.canConfirm,
        //       canComment: item.canComment,
        //       refundStatusDesc: item.refundStatusDesc,
        //     };
        //   })[0];
        //   const newData = Object.assign({}, newDataList[clickIndex], data);
        //   this.$set(this.listData, clickIndex, newData);
        // }
      }, (err) => {
        this.$showToast('订单取消失败')
      })
    },
    handleOrder(options) {
      let { btnType } = options
      let { func } = this.getBtnOption(btnType)
      this[func](options)
      // console.log(options)
    },
    goMerchant(id) {
      this.$forward('merchant', {
        id,
      })
    },
    goOrderDetail(id) {
      this.$forward('order-detail', {
        id,
      })
    },
    goRefundDetail(options) {
      const { refundId } = options
      if (!refundId) {
        this.$showToast(`参数错误 refundId: ${refundId}`)
        return
      }
      this.$forward('order-refund-detail', {
        refundId,
      })
    },
    goCancelOrder(options){
      const { orderId } = options
      const clickIndex = options.orderIndex
      this.sheetVisible = true
      this.cancelActions = [{
        name: '我不想买了',
        method: this.cancelOrder,
        reason: 1,
        orderId,
        clickIndex,
      }, {
        name: '信息填写错误',
        method: this.cancelOrder,
        reason: 2,
        orderId,
        clickIndex,
      }, {
        name: '商品停售或缺货',
        method: this.cancelOrder,
        reason: 3,
        orderId,
        clickIndex,
      }, {
        name: '其他原因',
        method: this.cancelOrder,
        reason: 4,
        orderId,
        clickIndex,
      }]
    },
    goPay(options) {
      const { orderId, pinActivitiesId, lastJoinCouple, price, orderType } = options
      this.$forward(`${window.location.origin}/index.html#order_pay?orderIds=${orderId}&lastJoinCouple=${lastJoinCouple}&price=${price}&pinActivitiesId=${pinActivitiesId}&orderType=${orderType}`)
    },
    goDelivery(options) {
      const { orderId, deliveryWay } = options
      let url = deliveryWay == 2 ? 'order_delivery2b' : 'order_delivery'
      this.$forward(`${window.location.origin}/index.html#${url}?orderid=${orderId}`)
    },
    goConfirm(options) {
      const that = this
      let listType = this.pageType
      const { orderId } = options
      const newDataList = [...this.listData]
      this.$showConfirm({
        title: '确认已经收到货了吗？',
        message: '请务必在已收货的情况下进行确认！',
        confirmButtonText: '确认收货',
        cancelButtonText: '取消',
        callback(res) {
          if(res != 'cancel' && res != 'error') {
            that.$showLoading()
            that.$api.confirmReceived({
              orderId,
            }, (res) => {
              that.$hideLoading()
              setTimeout(function () {
                that.$showToast('确认收货成功！')
              }, 1000)
              that.refresh()
            }, (err) => {
              that.$showToast('确认收货失败')
              console.log(err)
            })
          }
        },
      })
    },
    goRefund(options) {
      let { orderId, subOrderId, refundPrice } = options
      this.$forward('order-refund', {
        orderId,
        subOrderId,
        refundPrice,
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.page-scroll {
  height: 100%;
}
.page-header {
  position: fixed;
  // top: 44px;
  left: 0;
  width: 100%;
  display: flex;
  line-height: 40px;
  font-size: 14px;
  color: #999;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  z-index: 1000;
}
.active {
  border-bottom: 2px solid #ed0000;
  color: #212121;
}
.order-box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 10px 0;
}
.list-block{
  padding-top: 40px;
}
.order-list{
  position: relative;
  margin: 0 20px;
  padding: 1px 0 1px 0;
  background: #fff;
}

.f12 {
  font-size: 12px;
}
.f11 {
  font-size: 12px;
  transform: scale(0.9);
  transform-origin: left center;
}
.f14 {
  font-size: 14px;
}

.order-id {
  padding: 10px 10px 0;
  font-size: 12px;
}
.order-id .order-id {
  color: #999;
}
.order-head {
  padding: 10px;
}
.order-item {
  padding: 10px 10px 1px 0;
  margin-bottom: 10px;
  margin-left: 10px;
  overflow: hidden;
}
.oper-box {
  margin: 10px 0;
}
.order-item .oper-box {
  margin-bottom: 0;
}
.oper-box.padding {
  padding: 0 10px;
}
.oper-box:empty {
  display: none;
}

.order-item + .order-item {
  border-top: 1px solid #F4F4F4;
}
.v-center {
  display: flex;
  align-items: center;
}
.icon-shop {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 4px;
  background-image: url('https://img1.haoshiqi.net/miniapp/shop_4245f8af22.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
}
.shop-text {
  font-size: 14px;
  color: #333;
}
.icon-right {
  width: 10px;
  height: 10px;
  background-image: url('https://img1.haoshiqi.net/miniapp/more_85508a3b09.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
}
.order-status {
  font-size: 12px;
  color: #F21833;
}

.order-item-image {
  float: left;
  width: 90px;
  height: 90px;
  margin-right: 10px;
  background-image: url('https://img1.haoshiqi.net/miniapp/not-img2_0056f25dcd.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
}
.order-item-info {
  overflow: hidden;
}
.order-title {
  font-size: 12px;
  line-height: 17px;
  color: #333;
}
.order-info {
  margin: 5px 0;
}
.order-price {
  font-size: 16px;
  color: #F21833;
}
.order-unit {
  font-size: 12px;
}
.order-number {
  font-size: 16px;
}
.order-skus {
  font-size: 12px;
  line-height: 16px;
  color: #999;
}
.order-refund {
  margin-top: 10px;
  text-align: right;
  font-size: 12px;
  color: #FF9B29;
}
.order-refund:empty {
  display: none;
}
.sum-info {
  margin-bottom: 10px;
  padding: 0 10px;
  text-align: right;
  font-size: 14px;
}
.sum-price {
  color: #F21833;
}
.oper-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.oper-box .order-refund {
  margin: 0;
}
.btn-info,
.btn-sure {
  font-size: 12px;
  border: 1px solid #CDCDCD;
  border-radius: 13px;
  padding: 0 10px;
  height: 26px;
  line-height: 26px;
  margin-left: 10px;
}
.btn-info {
  color: #666;
}
.btn-sure {
  color: #F73552;
  border-color: #F73552;
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
}
.empty-img {
  height: 300px;
  width: auto
}
.empty-text {
  text-align: center;
  font-size: 14px;
}
.page-scroll {
  &/deep/ .not-data {
    display: none;
  }
}
</style>
