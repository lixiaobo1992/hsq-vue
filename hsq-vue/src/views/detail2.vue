<template>
  <dwd-page class="page-detail2">
    <div class="header" :style="headerStyle">
      <div class="icon left-box" @click="goNext('back')">
        <img src="~assets/img/detail/arrow.png" class="left-arrow">
      </div>
      <div class="middle-text" />
      <div v-if="isGat" class="icon right-box" @click="goNext('index')">
        <img src="~assets/img/detail/home.png" class="left-arrow">
      </div>
    </div>

    <!-- swiper -->
    <dwd-swiper
      :ratio="ratio"
      :speed="500"
      :auto="3000"
      :default-index="0"
      :continuous="true"
      :show-indicators="true"
      @change="handleChange"
    >
      <dwd-swiper-item v-for="(item, index) in swiperList" :key="index" class="swiper-block">
        <img :src="item" alt="" class="swiper-image">
      </dwd-swiper-item>
    </dwd-swiper>

    <!--活动预热部分 -->
    <div
      v-if="showAct && activityPreheat.activityStatus == 'start'"
      class="activity-block"
      :class="[activityPreheat.activityStatus == 'start' ? 'activity-block-active' : '']"
    >
      <div
        v-if="activityPreheat.activityStock < 1 && descData.left_stock < 1"
        class="activity-no-stock"
      >
        <img src="https://img1.haoshiqi.net/miniapp/img/sold_a64f1921fd.png">
      </div>
      <div class="act-left">
        <div class="act-left-left">
          <div class="act-icon-box">
            <div class="icon-box">
              <img class="act-icon" src="~assets/img/detail/clock-icon.png">
            </div>
            <span class="text-right">
              {{ activityPreheat.activityType == 1 ? '活动价' : '秒杀价' }}
            </span>
          </div>
          <div class="act-left-right">
            <div class="act-ac-price">
              ￥{{ activityPreheat.price[0] }}.{{ activityPreheat.price[1] }}
            </div>
            <div class="act-mark-price">￥{{ activityPreheat.activityMarketPrice }}</div>
          </div>
          <div v-if="activityPreheat.activityStatus != 'end' ? 'true' : ''" class="act-inventory-box">
            <div class="act-stock">
              <span>{{ activityPreheat.activityStatus == 'start' ? '仅剩' : '限量' }}</span>{{ activityPreheat.activityStock }}件
            </div>
            <div v-if="activityPreheat.activityStatus == 'start' ? 'true' : ''" class="act-stock-rate">
              <div class="act-rate-box" :style="{ width: activityPreheat.rateNumber + '%' }" />
            </div>
          </div>
        </div>
      </div>
      <div class="act-right">
        <div class="act-right-top" :class="[activityPreheat.activityStatus == 'start' ? 'activity-block-text' : '']">
          {{ activityPreheat.activityCountTip }}
        </div>
        <div class="act-countdown">
          <div
            v-if="activityPreheat.activityTime.days > 0"
            class="count-number-day"
            :class="[activityPreheat.activityStatus == 'start' ? 'activity-block-text' : '']"
          >
            {{ activityPreheat.activityTime.days }}天
          </div>
          :
          <div
            class="count-number"
            :class="[activityPreheat.activityStatus == 'start' ? 'activity-block-bg' : '']"
          >
            {{ activityPreheat.activityTime.hours }}
          </div>
          :
          <div
            class="count-number"
            :class="[activityPreheat.activityStatus == 'start' ? 'activity-block-bg' : '']"
          >
            {{ activityPreheat.activityTime.minutes }}
          </div>
          :
          <div
            class="count-number"
            :class="[activityPreheat.activityStatus == 'start' ? 'activity-block-bg' : '']"
          >
            {{ activityPreheat.activityTime.seconds }}
          </div>
        </div>
      </div>
    </div>
    <!-- 商品基本信息 -->
    <div class="info">
      <div v-if="!showAct || activityPreheat.activityStatus == 'ready'" class="mt price-box">
        <span class="item item-rmb">
          {{ priceObj.price }}
        </span>
        <span class="item item-market-price">
          {{ priceObj.marketPrice }}
        </span>
      </div>
      <!-- 秒杀预告  -->
      <div
        v-show="activityPreheat.activityStatus == 'ready' && descData.left_stock > 0"
        class="mt seckill max-line-1"
      >
        <span
          class="title-border"
        >{{ activityPreheat.activityType == 1 ? '活动预告' : '秒杀预告' }}
        </span>
        {{ activityPreheat.activityStartTimeTip }}
        {{ activityPreheat.activityType == 1 ? '活动价' : '秒杀价' }}￥{{
          (activityPreheat.activityPrice / 100).toFixed(2)
        }}
      </div>
      <div class="mt info-title max-line-2">
        <span v-if="merchantInfo.merchantType == 2" class="title-zy">自营</span>
        {{ merchantInfo.name }}
      </div>
      <div class="mt info-desc">
        {{ merchantInfo.desc }}
      </div>
    </div>

    <!-- 领券信息 第一期不做-->
    <!-- <div class="coupon-desc mt">
      <div class="title">领券:</div>
      <div class="content nowrap">
        <span class="item text">
          直减1000元
        </span>
        <span class="item text">
          满100减10元
        </span>
      </div>
      <img class="more" src="https://img1.haoshiqi.net/wxapp/img/more_85508a3b09.png" />
    </div> -->

    <!-- 促销信息-->
    <div v-if="promotions.length" class="attrs mt" @click="handlePromotion">
      <div class="title">促销</div>
      <div class="promotions">
        <div v-for="(item, index) in promotions" :key="index" class="promotions-item">
          <span class="promotions-title">{{ item.title }}</span>
          <span class="promotions-text">{{ item.text }}</span>
        </div>
      </div>
      <img class="more" src="https://img1.haoshiqi.net/miniapp/more_85508a3b09.png">
    </div>

    <!-- 参数列表 @click="goNext('skuSelect')"-->
    <div class="attr-text mt">
      <span class="title">已选</span>
      <div class="params-box">
        <p v-if="!notSelectedAttrName">
          <template v-for="(item, index) in selectedAttrName">
            {{ index !== 0 ? '、' : '' }}【{{ item.attr_name }}】{{ item.value
            }}{{ item.type == 2 ? '到期' : '' }}
          </template>
        </p>
        <p v-else>请选择: {{ notSelectedAttrName }}</p>
      </div>
      <!-- 第一期没有箭头 -->
      <!-- <img class="more" src="https://img1.haoshiqi.net/wxapp/img/more_85508a3b09.png" /> -->
    </div>

    <!-- 运费信息 -->
    <div class="mt city" @click="onSelectCity">
      <div class="city-front">
        <label class="city-label">送至：</label>
        <img class="city-img" src="https://img1.haoshiqi.net/miniapp/address/location_e7c4dc70ce.png">
        <div class="city-name">{{ currentCity.currentAddress }}</div>
        <img class="city-arrow" src="https://img1.haoshiqi.net/wxapp/img/more_85508a3b09.png">
      </div>
    </div>
    <!-- 运费信息 -->
    <div class="white-bg">
      <div class="city white-bg city-cost">
        <label class="city-label">运费：</label>
        <div class="city-name" :class="{'cannot-delivery': !merchantInfo.canDelivery}">{{ merchantInfo.freightInfo }}</div>
      </div>
    </div>

    <!-- 质保标签 第一期没质保标签-->
    <!-- <div class="mt labels" v-if="labels.length">
      <div class="labels" v-for="(item, index) in labels" :key="index">
        <div class="label" data-type="正品保证">
          <img class="img" :src="item.icon" />
          <span class="text" style="font-size:13px;">
            {{ item.text }}
          </span>
        </div>
      </div>
    </div> -->

    <!-- 店铺信息 -->
    <div class="store">
      <div v-if="isGat" class="store-box" @click="goMerchant(merchantData.id)">
        <div class="store-info">
          <img class="store-img" :src="merchantData.logo">
          <div class="store-text">
            <div class="store-title">{{ merchantData.name }}</div>
            <!-- <div class="store-site">
            <span class="prov-text">江苏省</span>
            <span>苏州市</span>
          </div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 底部详情区域 -->
    <div class="mt padding-bg">
      <div class="sec-head-box">
        <div class="sec-head">商品详情</div>
      </div>
      <div class="detail-tap" v-html="detailHtml" />
      <div class="sec-head-box">
        <div class="sec-head">服务保障</div>
      </div>
      <ul class="detail-service" style="border-top:0;">
        <li><b>100%正品</b><span>所有商家均经过严格资质审核，请放心购买</span></li>
        <li>
          <b>售后保障</b><span>商品存在质量问题，可立即申请退款<br>质量问题包括：保质期不符、食品损坏、变质等</span>
        </li>
        <li>
          <b>发货承诺</b><span>商家将在承诺时间内发货<br>（每个商家承诺时间不同，具体请在商品详情页查看)</span>
        </li>
        <li>
          <b>PICC安全保障</b><span>您购买的每一件商品都由中国人民保险集团股份有限公司（PICC）为您承保</span>
        </li>
        <li>
          <b>标示价格说明</b><span>被划去的“价格”指同品牌同种等量规格的商品在国内大陆地区主流电商平台，但不仅限于电商平台上的标示价格、或厂家、供应商的指导价；商品实际售价为本平台实时销售价格</span>
        </li>
        <span class="footer-txt">已经达到底部啦~</span>
      </ul>
    </div>


    <!-- 尾部按钮 -->
    <!-- <template v-slot:footer> -->
    <div class="flex-grid buy-bar">
      <div class="flex-grid-cell u-2of0 buy-media" @click="goNext('service')">
        <img class="icon" src="~assets/img/detail/service.png">
        <div class="text">客服</div>
      </div>
      <!-- <view class="flex-grid-cell u-1of7 buy-media" onTap="toggleCollection">
        <image class="icon" src="{{collectionImg}}" mode="scaleToFill" />
        <view class="text">{{ is_like ? '已收藏' : '收藏' }}</view>
      </view> -->
      <div v-if="isGat" class="flex-grid-cell u-2of0 buy-media" @click="goMerchant(merchantData.id)">
        <img class="icon icon-merchant" src="~assets/img/detail/merchant.png">
        <div class="text">店铺</div>
      </div>
      <div
        v-if="activityPreheat.activityStatus !== 'ready' || descData.left_stock > 0"
        class="flex-grid-cell  btn-buy-commit"
        :class="[skuBtnStatus.isBtnActive ? 'active' : '']"
        @click="goBuyCommit"
      >
        立即购买
      </div>
      <!--活动未开始 -->
      <div v-else class="flex-grid-cell activity-ready">
        <div class="activity-price">
          {{ activityPreheat.activityType == 1 ? '活动价' : '秒杀价' }}￥{{
            (activityPreheat.activityPrice / 100).toFixed(2)
          }}
        </div>
        <div class="activity-time">
          {{ activityPreheat.activityStartTimeTip }}
        </div>
      </div>
    </div>
    <!-- </template> -->


    <!-- 返回顶部的按钮 -->
    <img
      src="~assets/img/detail/go-top.png"
      class="back-top"
      :class="{ topImg: topStatus }"
      @click="backTop"
    >

    <template v-slot:sub-block>
      <!-- 促销信息弹层 -->
      <promotion-card
        v-show="proStatus"
        :promotions="promotions"
        :promotion-title="'促销信息'"
        @handlePromotion="handlePromotion"
      />
      <!-- sku -->
      <dwd-sku-select
        v-model="isShowPopup"
        :norm-select-tag="normSelectTag"
        :sku-btn-status="skuBtnStatus"
        :attr-list="attrList"
        :sku-stocks-list="skuStocksList"
        :small-current-sku-data="smallCurrentSkuData"
        :max-buy-sum="maxBuySum"
        :current-sum="currentSum"
        @onSetParentData="onSetParentData"
        @onBtnClick="onBtnClick"
      />
      <!-- 切换城市 -->
      <select-city
        :did-show-city-selection.sync="didShowCitySelection"
        @selectingNewCity="selectingNewCity"
      />


    </template>
  </dwd-page>

</template>

<script>
import { Swiper, SwiperItem } from '@/ui'
import bridge from '@/utils/bridge'
import device from '@dwdjs/utils/lib/device'
import { dealPrice } from '@/utils/index'
import api from '@/api'
import { clone } from '@/utils/base'
import { mapState, mapActions } from 'vuex'
import env from '@/config/env'
import { formatDate } from '@/utils/base'
import { formatCountDownObj } from '@/utils/base/date'
import CountManger from '@/utils/count-manger'
import promotionCard from '@/components/promotion-card'
import skuSelect from '@/components/sku-select/sku-select'
import skuMixin from '@/components/sku-select/sku-mixin'
import selectCity from '@/components/select-city'
export default {
  name: 'detail2',
  components: {
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
    promotionCard,
    [skuSelect.name]: skuSelect,
    [selectCity.name]: selectCity,
  },
  mixins: [skuMixin],

  data() {
    return {
      ratio: 1, // swiper 显示比例
      swiperList: [],
      merchantInfo: {},
      timestamp: '',
      priceObj: {
        price: '',
        point: '',
        marketPrice: '',
      }, //价格区域
      skuInfo: '',
      // sku
      isShowPopup: false, // v-model
      normSelectTag: 0,
      currentSum: 1,
      maxBuySum: 100,

      skuBtnStatus: {
        isBtnActive: true, // 按钮否可用
        buyBtnText: '立即购买',
        cartBtnText: '加入购物车',
      },
      attrList: [],
      skuStocksList: {}, // 属性ID 对应 sku列表
      skuId: 0,
      currentSkuData: {}, // 当前skuData
      smallCurrentSkuData: {},
      selectedAttrName: [], // 已选择 attr
      notSelectedAttrName: '', // 未选择属性提示
      promotions: [], //促销
      labels: [],
      merchantData: {}, //店铺信息
      productId: 0,
      detailHtml: '', //富文本
      showAct: false, // 活动状态
      activityPreheat: {}, //活动区域
      descData: {}, //商品简介
      proStatus: false, //促销弹层
      headerStyle: {
        backgroundColor: 'rgba(255,255,255,0)',
      },
      topStatus: false, //到顶箭头是否显示
      didShowCitySelection: false,
      isGat: !env.isChannel('guanaitong'),
      // showMerchant: !device.gat, //关爱通不显示店铺入口
      isInit: true,
    }
  },
  computed: {
    ...mapState({
      fixedPosition: state => state.location.fixedPosition,
    }),
    currentCity() {
      return clone(this.$store.state.location.addressInfo)
    },
    addressInfo() {
      return this.$store.state.location.addressInfo
    },
    addresses() {
      return this.$store.state.location.addresses
    },
  },
  async created() {
    this.refresh()
    console.log(device.gat,'device')
    await this.$store.dispatch('getZones')
    await this.$store.dispatch('getAddresses')
  },
  mounted() {
    if (this.acticityType) {
      this.startActivityCountDown()
    }
    window.addEventListener('scroll', this.scrollToTop)
  },
  beforeDestroy() {
    this.clearCountDown()
  },
  methods: {
    ...mapActions([
      'getGeo',
    ]),
    setDefaultAddr() {
      let defaultAddr = this.addresses.find(addr => addr.isDefault)
      let oldCity = this.addressInfo
      if (oldCity.currentAddress != defaultAddr.currentAddress) {
        this.$store.dispatch('setAddressInfo', defaultAddr)
      }
    },
    getGeoLocation() {
      this.isInit = false
      // 获取地址位置
      this.getGeo({
        name: 'app',
        success: res => {
          this.$store.dispatch('setAddressInfo', this.fixedPosition)
          this.getDelivery()
        },
        fail: err => {
          this.$store.dispatch('setAddressInfo', this.fixedPosition)
          this.getDelivery()
        },
        hasLocation: () => {
          if(this.addresses.length) {
            this.setDefaultAddr()
          } else {
            this.$store.dispatch('setAddressInfo', this.fixedPosition)
          }
          this.getDelivery()
        },
      })
    },
    scrollToTop() {
      var scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 100) {
        this.topStatus = true
      } else {
        this.topStatus = false
      }
    },
    refresh(query = this.$route.query) {
      const { id = '1299' } = query
      if (id) {
        this.getSkuinfotDetail(id)
      }
    },
    handleChange(index) {
      this.curIndex = index + 1
    },
    onBtnClick(e) {
      const { type } = e

      switch (type) {
        case 'buyBtn':

          this.toOrder(this.currentSkuData, this.currentSum)
          this.setData({
            isShowPopup: false,
          })
          break
      }
    },
    skuDataOnChange(skuData) {
      if (!skuData.skuid) return
      this.refresh({ id: skuData.pinactivitiesid })
    },
    getSkuinfotDetail(id) {
      this.$api.getCoupleDetail(
        {
          pinActivitiesId: id,
        },
        res => {
          const data = res.data
          this.skuId = data.skuId
          this.swiperList = data.pics
          this.timestamp = res.timestamp
          this.merchantInfo = {
            merchantType: data.merchant_type || 1,
            name: data.name,
            desc: data.description,
            canDelivery: data.canDelivery || false,
            freightInfo: data.freightInfo,
          }
          this.priceObj = {
            rmb: 1,
            price: dealPrice(data.couplePrice, 100),
            marketPrice: dealPrice(data.market_price, 100),
          }

          this.promotions = data.merchantInfo.promotions || []
          this.labels = data.labels || []
          const newMerchantData = {
            id: data.merchantInfo.id,
            name: data.merchantInfo.name,
            logo: data.merchantInfo.logo,
            province: data.merchantInfo.province,
            city: data.merchantInfo.city,
            notice: data.merchantInfo.notice,
          }
          this.merchantData = newMerchantData || {}
          this.productId = data.product_id || 138

          function mapObj(obj, cb) {
            const result = {}
            const temp = {}
            for (const key in obj) {
              result[key] = cb(obj[key], key)
            }
            return result
          }

          const stocksList = mapObj(data.attrDatas || {}, item => {
            return {
              id: item.id,
              name: item.name,
              thumbnail: item.thumbnail,
              price: item.price,
              priceText: dealPrice(item.price),
              market_price: item.market_price,
              left_stock: item.left_stock,
              skuid: item.id,
              max_buy_num: item.left_stock,
              pinactivitiesid: item.pinactivitiesid,
            }
          })

          this.attrList = data.attrKeys || []
          this.skuStocksList = stocksList

          this.maxBuySum = data.maxCartSkuCnt

          const smallCurrentSkuData = {
            priceText: dealPrice(data.couplePrice),
            price: data.couplePrice,
          }
          this.smallCurrentSkuData = smallCurrentSkuData

          // 处理活动预热模块数据
          let showAct = false
          const activityPreheat = data.activityPreheat
          let tempActivityPreheat = {
            activityType: (activityPreheat && activityPreheat.activityType) || 0, // 营销活动类型：1 普通 2 秒杀
          }
          // 判断是否有秒杀活动
          if (activityPreheat) {
            let tempPrice = activityPreheat.activityPrice || 0

            tempActivityPreheat.price = dealPrice(tempPrice).split('.')
            tempActivityPreheat.activityStock = activityPreheat.activityStock || 0
            tempActivityPreheat.activityMarketPrice = dealPrice(activityPreheat.marketPrice)
            showAct = true
            if (
              res.timestamp > activityPreheat.startTime &&
              res.timestamp <= activityPreheat.endTime
            ) {
              // 活动中
              tempActivityPreheat.activityCountTip = '距离结束还有'
              tempActivityPreheat.activityStatus = 'start'
            } else if (res.timestamp <= activityPreheat.startTime) {
              // 活动还没开始
              tempActivityPreheat.activityCountTip = '距离开始还有'
              tempActivityPreheat.activityStatus = 'ready'
            } else {
              tempActivityPreheat.activityStatus = 'end'
              showAct = false
            }

            // 活动进度条展示
            tempActivityPreheat.rateNumber =
              100 -
              (parseInt((tempActivityPreheat.activityStock / activityPreheat.allStock) * 100) || 0)

            tempActivityPreheat.activityPrice = activityPreheat.activityPrice || 0
            tempActivityPreheat.activityStartTimeTip = `${formatDate(
              activityPreheat.startTime || 0,
              'M月D日H:F'
            )}`
            tempActivityPreheat.activityStartTime = activityPreheat.startTime || 0
            tempActivityPreheat.activityEndTime = activityPreheat.endTime || 0
          }
          this.showAct = showAct
          this.activityPreheat = tempActivityPreheat
          this.enabled = data.enabled || false
          this.left_stock = data.left_stock || 0
          this.skuBtnStatus.isBtnActive = this.enabled && this.left_stock ? true : false // 按钮否可用
          this.descData = {
            merchant_type: data.merchant_type,
            title: data.name,
            pricePrefix: data.pricePrefix,
            desc: (data.description || '').replace(/[\r\n]/g, ''),
            restriction_amount: data.restriction_amount || 0,
            left_stock: data.left_stock,
            is_show_stock: data.left_stock <= 30 && data.left_stock >= 0 ? true : false,
          }
          if (showAct && tempActivityPreheat.activityStatus == 'ready') {
            this.acticityType = 1
            this.startActivityCountDown()
          } else if (showAct && tempActivityPreheat.activityStatus == 'start') {
            this.acticityType = 2
            this.startActivityCountDown()
          }

          if (device.wechat) {
            bridge.setShare({
              title: data.name,
              weixin_timeline: {
                title: data.name,
              },
              desc: data.description,
              link: `${location.href}`,
              imgUrl: data.thumbnail,
            })
          }
          if(this.isInit) {
            this.getGeoLocation()
          }
          this.getProductDetail()
        },
        err => {
          this.pageError = true
        }
      )
    },
    //活动倒计时
    startActivityCountDown(type = this.acticityType) {
      const { activityPreheat } = this
      const that = this
      const diffTime = Date.now() - this.timestamp * 1000
      this.diffTime = diffTime
      const localStartTime = activityPreheat.activityStartTime * 1000 + diffTime
      this.localStartTime = localStartTime
      const localEndTime = activityPreheat.activityEndTime * 1000 + diffTime
      this.localEndTime = localEndTime

      if (this.activityCountManager && this.activityCountManager.clear) {
        this.activityCountManager.clear()
      }

      this.activityCountManager = new CountManger({
        times: 1000,
        dataList: [{}],
        set() {
          // 剩余结束时间
          const leftEndTimes = that.localEndTime - Date.now()
          // 剩余开始时间
          const leftStartTimes = that.localStartTime - Date.now()
          if (leftEndTimes > 0 || leftStartTimes > 0) {
            this.start()
          } else {
            this.clear()
          }
        },
        callback() {
          let leftEndTimes = that.localEndTime - Date.now()
          let leftStartTimes = that.localStartTime - Date.now()
          // 没开始的状态，且还没到开始时间
          if (leftStartTimes > 0 && type == 1) {
            // 活动还没开始，倒计时
            that.$set(that.activityPreheat, 'activityStatus', 'ready')
            that.$set(that.activityPreheat, 'activityCountTip', '距离开始还有')
            that.$set(that.activityPreheat, 'activityTime', formatCountDownObj(leftStartTimes, true) || 0)
          } else if (leftStartTimes <= 0 && type == 1) {
            // 没开始的状态，且到了开始时间，清除倒计时，重新调接口
            this.clear()
          } else if (leftEndTimes > 0 && type != 1) {
            // 活动开始了的状态，且活动还没结束，倒计时
            that.$set(that.activityPreheat, 'activityStatus', 'start')
            that.$set(that.activityPreheat, 'activityCountTip', '距结束还有')
            that.$set(that.activityPreheat, 'activityTime', formatCountDownObj(leftEndTimes, true) || 0)
          } else if (leftEndTimes <= 0 && type != 1) {
            // 活动开始的状态，且活动已结束，清除倒计时，重新调接口
            this.clear()
          }
        },
      })
    },
    //清除活动倒计时
    clearCountDown() {
      if (this.activityCountManager) {
        this.activityCountManager.clear()
        this.activityCountManager = null
      }
    },
    //部分点击事件
    goNext(type) {
      switch (type) {
        case 'back':
          this.$back()
          break
        case 'index':
          this.$forward('index')
          break
        case 'skuSelect':
          console.log('弹出sku选择框')
          break
        case 'service':
          location.href = window.location.origin + '/index.html#service'
          break
        default:
          break
      }
    },
    //进入店铺页
    goMerchant(id) {
      this.$forward('merchant', { id })
    },
    //底部商品详情
    getProductDetail() {
      this.$api.getPointDetaiMore(
        {
          productId: this.productId,
          sourceType: 4,
        },
        res => {
          const data = res.data
          // console.log(data.graphicDetail, 'res.data')
          this.detailHtml = data.graphicDetail || ''
        },
        err => {}
      )
    },
    goBuyCommit(params, amount) {
      if (!this.skuBtnStatus.isBtnActive) return
      this.isShowPopup = true
      this.normSelectTag = 2
    },
    toOrder(params, amount) {
      if (!params.skuid) return
      const nextUrl =
        window.location.origin +
        `/index.html#order_commit?skuId=${params.skuid}&amount=${amount}&price=${this.smallCurrentSkuData.price}&pinActivitiesId=${params.pinactivitiesid}&orderType=3&buyflag=couple&sourceType=2`
      location.href = nextUrl
    },
    handlePromotion() {
      const toggleStatus = this.proStatus
      this.proStatus = !toggleStatus
    },
    backTop() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },

    //打开选择城市面板
    onSelectCity() {
      this.didShowCitySelection = true
    },

    selectingNewCity() {
      this.getDelivery()
    },
    getDelivery() {
      this.$api.checkDelivery({
        skuId: this.skuId,
      }, res => {
        const { data = {} } = res
        const { canDelivery, freightInfo = '' } = data
        this.merchantInfo.canDelivery = canDelivery
        this.merchantInfo.freightInfo = freightInfo
      }, err => {
        console.log(err)
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.page-detail{
  width:100%;
  padding-bottom:50px;
}
.max-line-2 {
  -webkit-line-clamp: 2;
}
.max-line-2, .max-line-3 {
  word-break: break-all;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1;
}
.mt{
  margin-top:10px;
}
.more{
  width:15px;
  height:15px;
  align-self :center;
}
.swiper-image{
  width: 100%;
  height: 100%;
}
.swiper-indi{
  position: absolute;
  right: 15px;
  bottom: 10px;
  background: rgba(35,24,21,0.50);
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  padding: 0 12px;
  z-index: 60;
}
.info{
  padding: 10px;
  background-color: #fff;
  .info-title {
    font-size: 16px;
    line-height:20px;
    color:#333;
  }
  .info-desc {
    color: #B4B4B4;
    font-size:10px;
    transform:scale(0.85);
    transform-origin: left
  }
  .title-zy {
    font-size: 11px;
    color: #ea594c;
    border: 1px solid #ea594c;
    margin-right: 5px;
    border-radius: 4px;
    padding: 0 2px;
    position: relative;
    top: -2px;
    left: 0;

  }
}
.price-box {
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-end;
  font-weight: normal;
  line-height: 1;
  font-size: 12px;
  color: rgb(136, 136, 136);
  .item-type {
    font-size:14px;
  }
  .item {
    font-size:16px;
    color: #F21833 ;
  }
  .item-rmb{
    font-size:26px;
    font-weight:bold;
    &::before{
      content: '¥';
      font-size: 20px;
    }
  }
  .item-market-price {
    margin-left: 5px;
    position: relative;
    font-size: 14px;
    text-decoration: line-through;
    color: #999;
    &::before {
      content: '¥';
      top: 0;
    }
  }
}
.attr-text {
  display: flex;
  padding: 10px;
  background-color: #fff;
  font-size: 12px;
  line-height:20px;
  .title{
    align-self: flex-start;
    flex-shrink: 0;
    flex-grow: 0;
    white-space:nowrap;
    color: #B4B4B4;
    width:46px;
  }
  .params-box{
    flex: 1;
    color:#212121;
  }
}
.coupon-desc {
  position: relative;
  display: flex;
  padding: 14px 10px;
  background-color: #fff;
  font-size: 12px;
  align-items: center;
  overflow: hidden;
  .title{
    align-self: flex-start;
    flex-shrink: 0;
    flex-grow: 0;
    white-space: nowrap;
    color: #333;
    margin-top: 2px;
  }
  .content {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
  }
  .item {
    display: inline-block;
    margin-left: 7.5px;
    white-space: nowrap;
    color: #fff;
    background: #FB0438;
  }
  .text{
    font-size: 10px;
    padding: 0 5px;
    position: relative;
    height: 15px;
    line-height: 15px;
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      border-top: 7.5px solid transparent;
      border-bottom: 7.5px solid transparent;
      border-left: 3px solid #fff;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      width: 0;
      height: 0;
      border-top: 7.5px solid transparent;
      border-bottom: 7.5px solid transparent;
      border-right: 3px solid #fff;
    }
  }
}
.attrs {
  display: flex;
  padding: 10px;
  background-color: #fff;
  font-size: 12px;
  .title {
    width: 46px;
    color: #B4B4B4;
    white-space: nowrap;
  }
  .promotions {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .promotions-item {
    display: flex;
    align-items: left;
    flex: 1;
  }
  .promotions-title {
    font-size: 10px;
    color: #ea594c;
    border: 1px solid #ea594c;
    height:15px;
    line-height: 15px;
    margin-right: 5px;
    padding: 0 2px;
    transform:scale(0.85);
    border-radius:2px;
    transform-origin: left;
  }
  .promotions-text {
    width: 230px;
    flex: 1;
    overflow: hidden;
    line-height: 16px;
    display: flex;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-align: left;
    font-size:12px;
  }
}
.city {
  position: relative;
  padding: 8px 10px;
  background-color: #fff;
  margin-bottom: 1px;
  .city-front {
    display: flex;
    align-items: center;

  }
  .city {
    display: flex;
    align-items: center;
  }
  .city-img {
    flex: 0 0 auto;
    width: 9.5px;
    height: 11px;
    margin-right: 2px;
    position: relative;
    margin-left:5px;
  }
  .city-name {
    font-size: 12px;
    color: black;
    margin-right: 40px;
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    margin-left: 5px;
  }
  .city-label{
    flex: 0 0 auto;
    font-size: 12px;
    color: #999999;
  }
  .canDelivery {
    color: #f00;
    padding-left: 53px;
    margin-top: 2px;
    line-height: 1;
  }
  .city-arrow{
    position: absolute;
    right: 10px;
    top: 8px;
    width: 15px;
    height: 15px;
  }
}
/* 运费信息 */
.city-front,
.city-cost {
  display: flex;
  align-items: center;
}
.city-cost {
  padding: 8px 10px;
  padding-left: 0;
  margin-left: 8px;
  border-top: 1px #E2E2E2 solid;
}
.cannot-delivery {
  color: #F21833 !important;
}

.labels {
  display: flex;
  height: 40px;
  width: 100%;
  background: white;
  position: relative;
  align-items: center;
  justify-content: space-around;
  color: #666;
  border-bottom: 1px solid #e2e2e2;
  margin-top: 0;
  padding-right: 5px;
  .label {
    display: inline-flex;
    align-items: center;
  }
  .text {
    font-size: 14px;
    margin-left: 4px;
    white-space: nowrap;
  }
  .img {
    width: 12px;
    height: 12px;
    vertical-align:middle;
  }
}
.store{
  padding: 5px 10px;
  background: #fff;
  border-top:1px solid #e2e2e2;
}
.store-box{
  width: 100%;
  margin: 5px 0;
  display: flex;
  .store-info{
    display:flex;
    flex: 1;
    color: #333;
    height: auto;
    align-items :center;
  }
  .store-img {
    width: 40px;
    height: 40px;
    margin-right: 7.5px;
    float: left;
  }
  .store-text {
    float: left;
    font-size: 12px;
  }
  .store-title {
    margin-top: 5px;
    font-size: 12px;
  }
  .store-site{
    font-size: 12px;
    margin-top: 5px;
    color: #959595;
  }
  .prov-text {
    margin-right: 5px;
  }
  .store-icon {
    margin-top: 12.5px;
    width:68px;
    height:24px;
    line-height:24px;
    border-radius:12px;
    font-size:12px;
    color:#fff;
    background-image: linear-gradient(-270deg, #FF2A56 4%, #FB0438 100%);
    text-align:center;
  }
  .store-more{
    width: 15px;
    height: 15px;
  }
}
.white-bg {
  background: #fff;
  overflow: hidden;
}
.padding-bg {
  background: #fff;
  padding-bottom:50px;
}
.sec-head {
  padding: 10px;
  background-color: #fff;
  display: block;
  text-align:center;
  position: relative;
  color:#333;
  font-weight:bold;
  padding-top:30px;
  &::after{
    content: '';
    position:absolute;
    border-radius:2px;
    bottom:10px;
    left:50%;
    margin-left:-37px;
    width:74px;
    height:4px;
    background-image: linear-gradient(-269deg, #FB0438 0%, #FFA5B7 100%);
    opacity:0.8;
  }
  span{
    position:absolute;
    width:80px;
    height:20px;
    bottom:9px;
    left:50%;
    margin-left:-40px;
    z-index:1;
  }
}
.header {
  position:fixed;
  top:0;
  left:0;
  width:100%;
  z-index:2;
  display:flex;
  justify-content :space-between;
  .icon {
    width:33px;
    height:33px;
    background :#FD6888;
    border-radius:50%;
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:5px 0;
  }
  .left-box {
    margin-left:10px;
    &::before{
      position:absolute;
      width: 7px;
      height: 7px;
      border-top: 2px solid #ff0000;
      border-right: 2px solid #ff0000;
    }
    .left-arrow {
      transform :rotate(180deg);
      width:14px;
      height:14px;
    }
  }
  .right-box {
    margin-right:10px;
    .left-arrow {
      width:17.5px;
      height:17.5px;
      margin:7px;
    }
  }
}
/* 活动预热倒计时 */
.activity-block{
  display:flex;
  height:44px;
  width:100%;
  background-image: linear-gradient(74deg, #FF8427 32%, #FC9548 98%);
  position: relative;
}
.activity-block-active{
  background-image: linear-gradient(90deg, #F21833 16%, #FB0438 94%) !important;
}

.activity-block-text{
  color: #F21833 !important;
}

.activity-block-bg{
  background: #F21833 !important;
}

.act-left{
  width: 242px;
  padding:5px 0;
  padding-left: 3px;
  line-height: 1;
}
.act-left-left{
  width: 100%;
  color:#fff;
  font-weight: bold;
  flex-shrink:0;
  position: relative;
}

.act-icon-box{
  width: 62px;
  height: 20px;
  margin-top: 9px;
  line-height: 20px;
  border: 1px solid #ffffff;
  border-radius: 9.5px;
  float: left;
  overflow: hidden;
  font-size:10px;
}

.icon-box{
  width: 21px;
  height: 19px;
  background: #fff;
  float: left;
}
.text-right {
  font-size:10px;
  transform:scale(0.83);
  padding-left:2px;
}
.act-icon{
  width: 15px;
  height: 15px;
  margin-left: 3.5px;
  float: left;
  margin-top: 1.5px;
}

.act-icon-text{
  font-size: 10px;
  margin-left: 2px;
  transform:scale(0.85);
}

.act-left-right{
  height: 40px;
  margin-left:10px;
  color:#fff;
  font-size:10px;
  float: left;
  transform:scale(0.85);
}
.act-ac-price{
  font-size: 24px;
}
.act-mark-price{
  text-decoration:line-through;
  line-height: 1.2;
  font-size:12px;
  transform:scale(0.85);
}

.act-inventory-box{
  position: absolute;
  right: 8px;
  top: 10px;
}

.act-left-stock{
  line-height: 1.5;
}
.act-stock{
  margin-bottom: 2.5px;
  font-size: 12px;
}

.act-stock span{
  white-space:nowrap;
  color:#fff;
  text-align: center;
}
.act-stock-rate{
  background: rgba(255,255,255,0);
  width: 47px;
  height: 6px;
  border: 1px solid #ffffff;
  position: relative;
  border-radius: 5px;
  margin: 0 auto;
}
.act-rate-box{
  position: absolute;
  left: 0;
  top: 0;
  height: 5px;
  border-radius: 5px;
  background: #fff;
}


.act-right{
  flex: 1;
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  font-size:12px;
  align-items: center;
  padding:5px 0;
  background: #F8E8E9;
}
.act-right-top{
  color:#FF8427;
}
.act-right-top-active {
  font-size: 14px;
  color: #f00;
}
.act-countdown{
  display:flex;
  font-size:13px;
  line-height: 18px;
  align-items:flex-end;
  color: #FF8427;
}
.count-number-day{
  color:#FF8427;
  font-size:12px;
}
.count-number{
  padding:0 3px;
  height:18px;
  text-align:center;
  line-height:18px;
  color:#fff;
  font-size:12px;
  background-color:#FF8427;
  border-radius:2px;
  margin:0 2.5px;
  flex-shrink: 0;
  transform:scale(0.85);
}
.activity-desc{
  margin-right:10px;
  flex:1;
  color: #ED0000;
  font-size:14px;
}
.act-container-title{
  border: none;
  font-size:19px;
}
.container-content-item .act-container {
  font-size:15px;
  color:#ed0000;
  flex-shrink: 0;
  line-height:1;
}
.container-content-item .act-container-desc {
  font-size: 15px;
  color: #212121;
}
.container-content-item .color-red{
  color: #ed0000;
}
.act-container-animator{
  bottom: 0;
}
.activity-no-stock{
  width:120px;
  height:120px;
  position:absolute;
  right:130px;
  top:-240px;
}
.activity-no-stock img{
  width: 100%;
  height: 100%;
}
.flex-grid{
  display: flex;
  list-style: none;
}
.buy-bar{
  position:fixed;
  width: 100%;
  height: 50px;
  box-shadow: 0rpx -1px 1px #e2e2e2;
  bottom: 0;
  left: 0;
  background-color: #fff;
  z-index:2;

}
.flex-grid-cell {
  flex: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.flex-grid-cell.u-1of7 {
  flex: 0 0 14.2857%;
}
.flex-grid-cell.u-2of0 {
  flex: 0 0 20%;
}

.buy-media {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #666;
  font-size: 12px;
  border-right: 1px solid #fafaf8;
  padding:8px 0;
}
.activity-ready{
  flex: 4;
  background: #FF6D18;
  justify-content: space-evenly;
  color:#fff;
  flex-direction: column;

}
.activity-ready .activity-price{
  font-size: 15px;
  display:block;
}
.activity-ready .activity-time{
  font-size: 12px;
  display:block;
}

.buy-media .icon {
  display: block;
  width: 20px;
  height: 18px;
  margin: 0 auto;
  line-height: 0;
  margin-bottom: 4px;
}
.buy-media .text {
  display: block;
  font-size:10px;
  transform:scale(0.85);
}
.btn-buy-commit {
  font-size: 16px;
  color: #fff;
  background-color: rgba(153, 153, 153, 1);
}
.btn-buy-commit.active{
  background-color: #fc0438;
}
.seckill {
  line-height:20px;
  color: #f21833;
  font-size:14px;
  .title-border {
    font-size:11px;
    color: #ed0000;
    border: 0.01rem solid #ed0000;
    margin-right: 0.05rem;
    border-radius: 0.02rem;
    padding: 0 0.02rem;
    position: relative;
    top: -0.01rem;
    left: 0;
  }
}
.back-top {
  width:32px;
  height:32px;
  position:fixed;
  bottom:-40px;
  right:20px;
}
.footer-txt{
  display:block;
  text-align:center;
  font-size:12px;
  color:#acacac;
  padding:10px 0;
}
>>>.mint-swipe-indicator{
  background:#000;
}
>>>.mint-swipe-indicator.is-active{
  background:#fff;
  border:1px solid #000;
}
.topImg{
  bottom:60px;
}
.page-error{
  margin-top:20%;
}
.errImg{
  width:163.5px;
  height:206.5px;
  background: url(https://img1.haoshiqi.net/assets/hsqimg/new_error.png) center no-repeat;
  background-size: 163.5px 206.5px;
  text-align:center;
  margin:0 auto;
}
.errorTxt {
  margin-top:20px;
  display:block;
  text-align:center;
  color:#ccc;
}
ul.detail-service{
  margin: 0 10px;
}
ul.detail-service li{
  position:relative;
  border-top:none !important;
  &:before {
    content: "  ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: #e2e2e2;
    transform:scaleY(.5);
  }
}
ul.detail-service li:first-child:before{
  height: 0;
}
</style>
