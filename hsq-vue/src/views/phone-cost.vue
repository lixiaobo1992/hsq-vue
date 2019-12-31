<template>
  <dwd-page>
    <div class="phone-cost-page">
      <div class="phone-box" :class="{'focus-phone-box': showHistoryNum}">
        <div class="phone-number-box">
          <div class="phone-number">
            <input
              v-model.trim="rechargeTel"
              class="num-input"
              :class="{focus: showHistoryNum}"
              type="number"
              placeholder="请输入手机号码"
              maxlength="11"
              @focus="animateFocus"
              @blur="onClickShade"
            >
          </div>
          <div v-show="showHistoryNum" class="history-num-box view-scroll">
            <div class="num-list">
              <div v-for="(item, index) in historyNum" :key="index" class="num-item" @click="onSelectHistoryNum(item)">{{ item }}</div>
            </div>
            <div class="clear-history" @click="onClearHistoryNum">
              <dwd-icon class="trash-icon" type="trash" />
              清空历史记录
            </div>
          </div>
        </div>
        <div v-show="showHistoryNum" class="shade" @click="onClickShade" />
      </div>
      <div class="phone-cost-box" :class="{'focus-phone-cost': showHistoryNum}">
        <div
          v-for="(item, index) in phoneCostList"
          :key="index"
          class="phone-cost"
          :class="{'selected-cost': selectedCostIndex === index, 'unselected-cost': isSelected && selectedCostIndex !== index}"
          @click="goRecharge(item, index)"
        >
          <p class="market-price">{{ item.spec }}</p>
          <p class="sale-price">售价{{ item.price | dealPrice }}元</p>
        </div>
      </div>
      <template v-for="(item, index) in couponList">
        <div :key="index" class="member-box">
          <div class="member-head">
            <p class="amount">{{ item.value }}</p>
          </div>
          <div class="member-content">
            <div class="desc-box">
              <p class="coupon-title">{{ item.title }}</p>
              <p class="coupon-desc">{{ item.desc }}</p>
            </div>
            <div class="member-btn" @click="onClickMember(item)">{{ item.btnText }}</div>
          </div>
        </div>
      </template>
      <div class="customer-service" @click="goCustomerService">
        <dwd-icon type="customer-service" />
      </div>
      <div v-for="item in modulesList" :key="item.id" class="tpl-modules" :data-type="item.type">
        <dwd-modules :ref="item.id" :data="item" />
      </div>
    </div>
  </dwd-page>
</template>
<script>
import icon from '@/ui/icon'
import { mapGetters, mapActions } from 'vuex'
import env from '@/config/env'
import device from '@/utils/device'
import { regMobile } from '@/utils/validate'
import bridge from '@/utils/bridge'
import { stringify, urlfix, formatDate, isArray } from '@/utils/base'
import { loadJs } from '@/utils/dload'
import modules from '@/components/modules/index'
import { dealPrice } from '@/utils'

export default {
  components: {
    [icon.name]: icon,
    [modules.name]: modules,
  },
  data() {
    return {
      rechargeTel: '',
      isSelected: false,
      selectedCostIndex: '',
      phoneCostList: [],
      historyNum: [],
      showHistoryNum: false,
      orderIds: [],
      needPayPrice: '',
      couponList: [],
      defaultSkuId: '',
      topic_id: '',
      modulesList: [],
    }
  },
  computed: {
    ...mapGetters(['rechargeRecord']),
  },
  filters: {
    dealPrice(price) {
      return (price / 100).toFixed(2)
    },
  },
  created() {
    this.historyNum = this.rechargeRecord
    this.getPhoneCost()
  },
  methods: {
    ...mapActions(['updateRechargeRecord']),
    getPhoneCost() {
      this.$api.getPreaidList({}, res => {
        const { data = {} } = res
        this.phoneCostList = data.skuList || []
        this.defaultSkuId = data.defaultSkuId
        this.couponList = this.dealCouponList(data.couponList || [])
        this.topic_id = data.topicId
        const { openCardConfig = {} } = data
        if (!data.isHsqUserMember) {
          this.couponList.unshift({
            value: openCardConfig.price,
            title: openCardConfig.title,
            desc: openCardConfig.subTitle,
            btnText: '开通领取',
            url: openCardConfig.url,
            isToOpen: true,
          })
        }
        if (data.topicId) {
          this.gettopic()
        }
      }, err => {
        this.$showToast(err.errmsg)
        return true
      })
    },
    dealCouponList(list = []) {
      return list.map(item => {
        return {
          value: `${item.value / 100}元`,
          title: item.title,
          desc: `有效期:${formatDate(item.start_at, 'Y.M.D')}-${formatDate(item.end_at, 'Y.M.D')}`,
          couponCode: item.coupon_code,
          btnText: '立即使用',
          isToOpen: false,
          status: item.status,
        }
      })
    },
    // 点击话费块，充值话费
    goRecharge(item, index) {
      if (!this.rechargeTel) {
        return this.$showToast('请输入手机号码')
      }
      if (!regMobile.test(this.rechargeTel)) {
        return this.$showToast('请输入正确的手机号码')
      }
      this.setNumHistory()
      this.selectedCostIndex = index
      this.isSelected = true
      this.orderInit([{
        skuId: item.sku_id,
        amount: 1,
        price: item.price,
      }])
    },
    // 处理输入号码写入历史记录
    setNumHistory() {
      // 过滤和当前输入号码相同的号码，重新写入
      let newRecordList = this.historyNum.filter(num => {
        return num !== this.rechargeTel
      })
      // 历史记录只存最新的10条，最新一条记录在最上面
      if (newRecordList.length === 10) {
        newRecordList.splice(0, 1, this.rechargeTel)
      } else {
        newRecordList.unshift(this.rechargeTel)
      }
      this.updateRechargeRecord(newRecordList)
    },
    // 初始化订单
    orderInit(skuInfo = [], couponCodeInfo = [] ) {
      if (device.hsq && this.$version.lt('3.9.10')) {
        return this.$showToast('请更新最新版本')
      }
      // const skusInfo = [{'skuId':35208,'amount':1,'price':60}]
      couponCodeInfo = couponCodeInfo.length ? JSON.stringify(couponCodeInfo) : ''
      this.$api.orderInitV1({
        skusInfo: JSON.stringify(skuInfo),
        couponCodeInfo,
        isCheckedMember: 0,
        isFastbuy: 1,
        addressId: 0,
      }, res => {
        console.log(res)
        const { data = {} } = res
        const { packageInfo = {} } = data
        this.needPayPrice = packageInfo.needPayPrice
        const { platformCouponList = [] } = packageInfo
        // 处理选择的优惠券信息
        let selectedCouponInfo = []
        if (platformCouponList.length) {
          platformCouponList.forEach(item => {
            if (item.selected) {
              selectedCouponInfo.push({
                merchantId: item.merchant_id,
                couponCode: item.coupon_code,
                status: 1,
                memberCoupon: item.member_coupon,
              })
            }
          })
        }
        this.submitOrder(data.confirmSid, selectedCouponInfo)
      }, err => {})
    },
    // 提交订单
    submitOrder(confirmSid, couponCodeInfo) {
      this.$api.submitOrderV1({
        confirmOrderSerialId: confirmSid,
        addressId: 0,
        isCheckedMember: 0,
        consigneePhone: this.rechargeTel,
        couponCodeInfo: JSON.stringify(couponCodeInfo),
      }, res => {
        console.log(res)
        const { data: { orderIds = [], needPay = true } } = res
        this.orderIds = orderIds
        if (needPay) {
          this.goPay()
        } else {
          if (device.aliapp) {
            bridge.ready(function () {
              my.navigateTo({ url: '../order-list/order-list' })
            })
            return
          }
          let mode = ''
          if (['dev', 'beta'].includes(env.apiEnv)) {
            mode = env.apiEnv + '.'
          }
          const tempUrl = `https://m.${mode}haoshiqi.net/v2/order-list?type=0`
          this.$forward(tempUrl, {})
        }
        this.getPhoneCost() // 充值话费后重新刷新页面数据，更新优惠券列表
        const timer = setTimeout(() => {
          this.selectedCostIndex = ''
          this.isSelected = false
          clearTimeout(timer)
        }, 500)
      }, err => {})
    },
    // 唤起支付
    goPay() {
      const that = this
      if (device.hsq) {
        bridge.cashier({
          'id': this.orderIds.join(','),
          'price': this.needPayPrice,
          'type': 0,
          success: function (res) {},
          fail: function (err) {},
        })
        return
      }

      const params = {
        // 这里后续需要添加参数
        pay_type: 'phone-cost', // 支付类型：话费充值
        orderIds: that.orderIds.join(','),
        notMember: true, // 是否是开通好会员， 区分好会员
      }
      if (device.wxapp) {
        // window.alert(JSON.stringify(this.orderIds));
        bridge.ready(function (wx) {
          // alert(JSON.stringify(wx))
          // template_id,
          let url = '/pages/pay/pay'
          url = urlfix(url, stringify(params))
          console.log('url' + url)
          wx.miniProgram.navigateTo({ url })
        })
      }
      if (device.aliapp) {
        let url = '../pay/pay'
        url = urlfix(url, stringify(params))
        bridge.ready(function () {
          my.navigateTo({ url })
        })
      }
    },
    // 获取专题信息
    gettopic() {
      this.$api.getNewTopicInfo(
        {
          code: this.topic_id, //
        },
        res => {
          // this.tplList = this.dealModuleList(ModulesData.list);
          this.modulesList = this.dealModuleList(res.data.list)

          const that = this
          this.$nextTick(function () {
            // console.log(that.$refs)
            that.dealModuleRefs()
          })
        },
        err => {}
      )
    },
    dealModuleRefs() {
      // that.$refs
      // const modulesAttr = [];
      // const anchorPointKeys = Object.keys(this.anchorPoint);
      // console.log(this.anchorPoint)
      this.anchorPointArray = []
      for (let key in this.anchorPoint) {
        // console.log('key:', key);
        let el = this.$refs[key]
        // 这里需要注意 因为绑定的方式不一样，有的是获取的节点数组，有的是组件
        // 需要做区分
        if (el) {
          if (isArray(el)) {
            el = this.$refs[key][0]
            if (el._isVue) {
              el = el.$el
            }
          }
          // console.log(el)
          const refInfo = el.getBoundingClientRect() || { top: 0 }
          // console.log(key,refInfo);
          const tempTop = refInfo.top - this.fixedLabel.height - (this.headerObj && this.headerObj.height || 0)

          const tmepModule = { top : Math.round(tempTop), modules_id: key }
          this.anchorPoint[key] = tmepModule
          this.anchorPointArray.push(tmepModule)
        }
      }

      this.anchorPointArray.sort((a, b) => a.top - b.top)

      // console.log('this.anchorPoint:', this.anchorPoint)
      // console.log('this.anchorPointArray:', this.anchorPointArray)


    },
    dealModuleList(list = []) {
      const types = [
        'c-img',
        'c-img-hor',
        'c-swiper',
        'c-category',
        'c-tofu',
        'c-product-col1',
        'c-product-col2',
        'c-product-col3',
        'c-product-slider',
        // 'c-product-seckill'
      ]
      const tempList = list.filter(item => {
        return types.includes(item.type)
      })
      const tplList = tempList.map(item => {
        const result = {
          ...item,
        }
        switch (item.type) {
          case 'c-product-col1':
            return Object.assign(result, this.dealCProduct(item))
          case 'c-product-col2':
            return Object.assign(result, this.dealCProduct(item))
          case 'c-product-col3':
            return Object.assign(result, this.dealCProduct(item))
          case 'c-product-slider':
            return Object.assign(result, this.dealCProduct(item))
          default:
            return result
        }
      })
      return tplList
    },
    dealCProduct(item) {
      const that = this
      return {
        eventClick: function (items) {
          let { biz_id, can_bought, left_stock, link } = items
          if (can_bought && left_stock && link) {
            that.$forward(link)
          }
        },
        list: this.dealProductList(item),
      }
    },
    dealProductList(moduleItem) {
      const list = moduleItem.list || []
      return list.map(item => {
        let retaData = parseInt(((item.all_stock - item.left_stock) / item.all_stock) * 100)
        return {
          ...item,
          tags: item.tags.splice(0, 3) || [],
          market_price:  dealPrice(item.market_price),
          price: this.productPrice(dealPrice(item.price)),
          rate_percent: retaData,
        }
      })
    },
    productPrice(price) {
      let priceArray = price.split('.')
      return {
        price_yuan: priceArray[0],
        price_fen: priceArray[1],
      }
    },
    // 输入框聚焦
    animateFocus() {
      console.log('获取焦点')
      this.showHistoryNum = true
    },
    // 选择历史手机号
    onSelectHistoryNum(num) {
      this.rechargeTel = num
      this.showHistoryNum = false
    },
    // 清除历史记录
    onClearHistoryNum() {
      this.historyNum = []
      this.updateRechargeRecord([])
      console.log('删除')
    },
    // 点击遮罩层
    onClickShade() {
      const shadeTimeId = setTimeout(() => {
        this.showHistoryNum = false
        clearTimeout(shadeTimeId)
      }, 100)
    },
    // 点击会员
    onClickMember(item) {
      if (item.isToOpen) {
        if (device.aliapp) {
          my.postMessage({url: item.url, type: 'url'})
          return
        }
        this.$forward(item.url)
        return
      }
      if (!this.rechargeTel) {
        return this.$showToast('请输入手机号码')
      }
      let skuInfo = {
        amount: 1,
      }
      this.phoneCostList.forEach(cost => {
        if (cost.sku_id === this.defaultSkuId) {
          skuInfo.price = cost.price
          skuInfo.skuId = cost.sku_id
        }
      })
      this.orderInit([{ ...skuInfo }], [{
        couponCode: item.couponCode,
        status: item.status,
      }])
    },
    // 点击客服
    goCustomerService() {
      if (device.aliapp) {
        bridge.ready(function () {
          my.navigateTo({ url: '../service/service' })
        })
        return
      }
      let mode = ''
      if (['dev', 'beta'].includes(env.apiEnv)) {
        mode = env.apiEnv + '.'
      }
      const tempUrl = `https://m.${mode}haoshiqi.net/v2/service`
      this.$forward(tempUrl, {})
    },
  },
}
</script>
<style lang="stylus" scoped>
.phone-cost-page {
  position: relative;
  background: #FFF;
  padding-bottom: 30px;
}
.phone-box {
  font-size: 24px;
  color: #333;
  z-index: 1000;
  .phone-number-box {
    padding: 23px 24px 0 24px;
    position: relative;
    background: #FFF;
  }
  .shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.80);
    z-index: -1;
    overflow: hidden;
  }
  .phone-number {
    padding-bottom: 6px;
    border-bottom: 1PX solid #CCC;
    .num-input {
      width: 100%;
      border-style: none;
    }
    .num-input::-webkit-input-placeholder {
      color: #333;
    }
    .num-input::-webkit-outer-spin-button,
    .num-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    .num-input[type="number"]{
      -moz-appearance: textfield;
    }
    .focus::-webkit-input-placeholder {
      font-size: 18px;
      color: #ccc;
    }
  }
  .history-num-box {
    max-height: 210px;
    overflow-y: scroll;
    .num-list {
      list-style-type: none;
      margin: 0;
      padding: 20px 0 17px 0;
    }
    .num-item {
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
      line-height: 25px;
    }
    .clear-history {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    .trash-icon {
      margin-right: 2px;
    }
  }
  .history-num-box::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .history-num-box::-webkit-scrollbar-thumb { // 滚动条里面小方块
    display: block;
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .history-num-box::-webkit-scrollbar-track { // 滚动条里面轨道
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
}
.focus-phone-box {
  position: fixed;
  left: 0;
  right: 0;
}

.phone-cost-box {
  padding: 30px 18px 10px 24px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: row;
  .phone-cost {
    margin: 6px 6px 0 0;
    border: 1PX solid #CCC;
    width: 105px;
    height: 105px;
    color: #999;
    text-align: center;
    .market-price {
      margin-top: 28px;
      font-size: 20px;
    }
    .sale-price {
      margin-top: 2px;
      font-size: 14px;
    }
  }
  .selected-cost {
    background: #FB0438;
    color: #FFF;
    border: none;
  }
  .unselected-cost {
    border: 1px solid rgba(251,4,56,0.50);
    .market-price {
      color: #333;
    }
    .sale-price {
      color: #666;
    }
  }
}

.focus-phone-cost {
  padding-top: 103px;
}

.member-box {
  padding: 0 16PX;
  display: flex;
  align-items: center;
  height: 100px;
  margin-top: 10px;
  .member-head {
    height: 100%;
    width: 120px;
    background: url('~assets/img/coupon_head.png') round round;
    text-align: center;
    line-height: 90px;
    .amount {
      font-size: 24px;
      color: #FFF;
    }
  }
  .member-content {
    height: 100%;
    width: 227px;
    background: url('~assets/img/coupon_content.png') round round;
    display: flex;
    align-items: center;
    .desc-box {
      flex: 1;
      color: #FFF;
      margin-left: -16px;
    }
    .coupon-title {
      font-size: 18px;
    }
    .coupon-desc {
      margin-top: 3px;
      font-size: 10px;
      transform: scale(0.8);
      transform-origin: left bottom;
      opacity: 0.8;
    }
    .member-btn {
      width: 70px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      background: #FFF;
      border-radius: 5px;
      margin: 0 20px 0 5px;
      color: #F21833;;
      font-size: 14px;
    }
  }
  .merber-head, .merber-content {
    height: 100%;
    background-size: cover;
  }
}
.customer-service {
  position: fixed;
  width: 44px;
  height: 44px;
  right: 16px;
  bottom: 100px;
  border-radius: 44px;
  font-size: 30px;
  text-align: center;
  line-height: 175%;
  color: #1996DB;
  background: #FFF;
  box-shadow: 0 2px 4px 0 rgba(39,39,39,0.50);
  z-index: 1000;
}
</style>
