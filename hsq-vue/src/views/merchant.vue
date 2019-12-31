<template>
  <dwd-page is-header class="merchant-page">
    <!-- 浮标 -->
    <div v-if="shopAllBtnStatus && listData.length > 0" class="shop-all-btn" @click="allShopBtn">
      <div class="btn-text">全部商品</div>
      <div class="btn-e-text">PRODUCTS</div>
      <dwd-icon class="more-product-icon" type="more" :size="40" />
    </div>
    <dwd-scroll
      class="merchant-scroll"
      :finished="finished"
      :list-len="listData.length"
      :is-loading="isLoading"
      :finished-tip="finishedTip"
      :immediate-check="scrollCheck"
      @onScrollToLower="onScrollToLower"
      @getScrollTop="getScrollTop"
    >
      <div class="merchant-desc">
        <div class="merchant-top">
          <div
            class="merchant-head-bg"
            :style="{ backgroundImage: 'url(' + headerData.logo + '),center center no-repeat;' }"
          />
          <div class="merchant-name-block">
            <div class="merchant-name-left">
              <div class="merchant-img">
                <img :src="headerData.logo" alt="">
              </div>
              <div class="merchant-name-desc">
                <div class="merchant-name-text line-1">
                  {{ headerData.name }}
                </div>
                <div class="merchant-add-text line-1">
                  {{ headerData.province }} {{ headerData.city }}
                </div>
              </div>
            </div>
            <div v-if="isHSQ" class="favorite-merchant-btn" @click="toggleFavorite">
              <div class="favorite-icon">
                <dwd-icon :class="iconClass" :type="buttonType" :size="20" />
              </div>
              <div class="favorite-text">
                {{ favoriteText }}
              </div>
            </div>
          </div>
        </div>
        <div class="certificate-cell" @click="goShopaptitude">
          <div class="certificate-left">
            <img src="https://img1.haoshiqi.net/assets/hsqimg/certificate-icon.png" alt="">
            <div class="cer-text">工商资质</div>
          </div>
          <dwd-icon class="icon-more" type="more" :size="20" />
        </div>
        <div class="merchant-info">
          <!-- 店铺公告 -->
          <div v-if="headerData.notice" class="merchant-brand">
            <div class="brand-label">店铺公告：</div>
            <div class="brand-text">{{ headerData.notice }}</div>
          </div>
          <!-- 经营品牌 -->
          <div v-if="headerData.brand" class="merchant-brand">
            <div class="brand-label">经营品牌：</div>
            <div class="brand-text" :class="{ more: showdownArrow }">
              <span class="middle-text">{{ headerData.brand }}</span>
              <span v-if="arrowClick" class="border" />
            </div>
            <div v-if="arrowClick" class="left-arrow" @click="onShowAll">
              <span class="text">{{ showdownArrow ? '展开' : '收起' }}</span>
              <span class="arrow" :class="[showdownArrow ? '' : 'up']" />
            </div>
          </div>
        </div>
        <!-- 优惠券 -->
        <div
          v-if="couponList.length && couponVersionSts && isHSQ"
          class="copple-desc"
          @click="showCoupon"
        >
          <coupon :coupon-list="couponList" :couple-title="'店铺领券'" />
        </div>
        <div v-if="spikeList.length > 0" class="spike-block">
          <div class="list-header">秒杀专区 <span>SECONDS KILL ZONE</span></div>
          <div class="spike-list">
            <c-product-col1 :data="spikeData" @refresh="getMerchantInfo" />
          </div>
          <div v-if="hasMoreBtn" class="more-spike-list" @click="toggleShowAllSpike">
            <div>
              {{ moreText }}
            </div>
            <dwd-icon :class="triangleClass" type="triangle" :size="10" />
          </div>
        </div>
        <!-- 产品列表 -->
        <div class="product-block">
          <div class="list-header">商品列表 <span>PRODUCT LIST</span></div>
          <div class="product-list">
            <c-product-col2 :data="productListData" />
          </div>
        </div>
      </div>
    </dwd-scroll>
    <div v-if="showCoupons && coupons.length" class="popup-outbox" @click="onClose">
      <coupon-list :coupon="coupons" @close="onClose" @getCoupon="getCoupon" />
    </div>
    <conpon-toast v-show="sucToast" />
  </dwd-page>
</template>

<script>
import PullListMixin from '@/mixins/pull-list'
import cProCol2 from '@/components/modules/c-product-col2'
import cProCol1 from '@/components/modules/c-product-col1'
import coupon from '@/components/coupon'
import couponList from '@/components/coupon-list'
import conponToast from '@/components/coupon-toast'
import { Scroll, Icon } from '@/ui'
import bridge from '@/utils/bridge'
import device from '@dwdjs/utils/lib/device'
import { formatDate } from '@/utils/base/date'

export default {
  name: 'merchant',
  components: {
    [Scroll.name]: Scroll,
    [Icon.name]: Icon,
    [cProCol2.name]: cProCol2,
    [cProCol1.name]: cProCol1,
    coupon,
    couponList,
    conponToast,
  },
  mixins: [PullListMixin],

  data() {
    return {
      headerData: {
        logo: '',
        name: '',
        province: '',
        city: '',
        notice: '',
        brand: '',
        favorited: false,
      },
      listData: [],
      spikeList: [],
      showAllSpike: false,
      pullParams: {},
      shopAllBtnStatus: true, // 是否显示全部商品
      isHSQ: device.hsq,
      couponList: [], //显示领券的信息
      showArrow: false,
      coupleTitle: '店铺领券',
      showdownArrow: false,
      arrowClick: false,
      showCoupons: false, //是否显示优惠券列表
      sucToast: false, // 显示领取成功的toast
      coupons: [],
      couponVersionSts: false,
    }
  },
  computed: {
    buttonType() {
      return this.headerData.favorited ? 'favorite-active' : 'favorite'
    },
    favoriteText() {
      return this.headerData.favorited ? '已收藏' : '收藏'
    },
    iconClass() {
      return this.headerData.favorited ? 'favorite-active' : 'favorite-no-active'
    },
    hasMoreBtn() {
      return this.spikeList.length > 2
    },
    moreText() {
      return this.showAllSpike ? '收起' : '点击展开更多'
    },
    triangleClass() {
      return this.showAllSpike ? 'triangle-top' : ''
    },
    productListData() {
      const that = this
      return {
        type: 'c-product-col2', // 一行两列铺品
        comment: '一行两列铺品',
        margin_bottom: 0,
        margin_lr: 0,
        margin_top: 0,
        bg_color: '',
        width: 200,
        height: 200,
        list: this.listData || [],
        eventClick: function (items) {
          console.log('跳转到详情页')
          that.goDetail(items)
        },
      }
    },
    spikeData() {
      const that = this
      return {
        type: 'c-product-col1', // 一行一列铺品
        comment: '一行一列铺品',
        margin_bottom: 0,
        margin_lr: 0,
        margin_top: 0,
        bg_color: '',
        width: 200,
        height: 200,
        is_spike: true,
        list: this.showAllSpike ? this.spikeList : this.spikeList.slice(0, 2),
        eventClick: function (items) {
          console.log('跳转到秒杀详情页')
          that.goDetail(items)
        },
      }
    },
  },
  created() {
    this.pullParams = {
      merchantId: this.$route.query.id || 138,
    }
    this.getMerchantInfo()
    this.getListData()
    if (this.isHSQ) {
      if (this.$version.gt('3.8.8')) {
        this.couponVersionSts = true
      }
    } else {
      this.couponVersionSts = true
    }
  },
  mounted() {},
  methods: {
    pullModel(...rest) {
      this.$api.getMerchantList.apply(this, rest)
    },
    getListData() {
      this.$showLoading()
      this.initPullList()
      // this.pullParams.pageLimit = 10;
      this.onScrollToLower()
    },
    // 获取店铺信息
    getMerchantInfo() {
      this.$api.getMerchantInfo(
        {
          merchantId: this.$route.query.id || 138,
          topicId: this.$route.query.topic_id,
          skuId: this.$route.query.sku_id,
        },
        res => {
          const { data = {} } = res
          let brandTextList = []
          data.brandList &&
            data.brandList.forEach(item => {
              brandTextList.push(item.name)
            })
          this.headerData = {
            logo: data.logo,
            name: data.name,
            province: data.province,
            city: data.city,
            notice: data.notice,
            brand: brandTextList.join('，'),
            favorited: data.is_like,
          }
          if (this.headerData.brand.length > 30) {
            this.arrowClick = true
            this.showdownArrow = true
          }
          this.spikeList = this.dealSpikeList(data.activityList, res.timestamp * 1000 - Date.now())
          this.couponList = data.coupons || []
          console.log(this.couponList, 'data')
        },
        err => {
          console.log(err)
        }
      )
    },
    // 展示全部品牌消息
    onShowAll() {
      this.showdownArrow = !this.showdownArrow
    },
    showCoupon() {
      console.log('打开优惠券列表')
      this.showCoupons = true
      this.getCouponList()
    },
    // 处理秒杀列表数据
    dealSpikeList(list = [], diffTime = 0) {
      return list.map((item, index) => {
        let retaData = parseInt(((item.all_stock - item.left_stock) / item.all_stock) * 100)
        let buttonText = ''
        let buttonStatus = 1
        if (item.start_time * 1000 + diffTime > Date.now()) {
          buttonText = item.is_subscribe ? '取消提醒' : '提醒我'
          buttonStatus = 1
        } else {
          buttonText = '马上抢'
          buttonStatus = 2
        }
        return {
          ...item,
          index,
          tags: item.tags || [],
          market_price: (item.market_price / 100).toFixed(2),
          price: this.productPrice((item.price / 100).toFixed(2)),
          rate_percent: retaData,
          snappedUp: item.all_stock - item.left_stock,
          is_spike: true,
          diffTime,
          title: item.name,
          countDownInfo: {
            d: 0,
            h: 0,
            f: 0,
            s: 0,
          },
          buttonText,
          buttonStatus, // 1: 可点击状态，2：不可点击状态
          pinActivitiesId: item.biz_id,
          hideCountDown: false,
          showupArrow: true,
          arrowClick: item.tags.toString().length > 48,
          expired_date_text: item.expired_date_text_one,
        }
      })
    },
    // 处理底部列表数据
    dealList(list = []) {
      return list.map(item => {
        let retaData = parseInt(((item.all_stock - item.left_stock) / item.all_stock) * 100)
        return Object.assign({}, item, {
          merchant_type: item.merchant_type,
          tags: (item.tags || []).splice(0, 2),
          market_price: (item.marketPrice / 100).toFixed(2),
          price: this.productPrice((item.couplePrice / 100).toFixed(2)),
          member_price: (item.member_price/100).toFixed(2),
          rate_percent: retaData,
          sku_id: item.skuId,
          thumbnail: item.skuPic,
          pin_activities_id: item.pinActivitiesId,
          title: item.coupleTitle,
          couple_price: this.productPrice((item.couplePrice / 100).toFixed(2)),
          can_bought: item.canBought,
          left_stock: item.left_stock || item.inStock,
          count_limit: item.countLimit,
          expired_date_text: item.expired_date_text_two,
        })
      })
    },
    productPrice(price) {
      let priceArray = price.split('.')
      return {
        price_yuan: priceArray[0],
        price_fen: priceArray[1],
      }
    },
    // 跳转到工商资质
    goShopaptitude() {
      const merchantId = this.$route.query.id || 138
      this.$forward(`https://m.haoshiqi.net/index.html#shopaptitude?id=${merchantId}`)
    },
    toggleShowAllSpike() {
      this.showAllSpike = !this.showAllSpike
      console.log('当前是否显示全部秒杀商品：', this.showAllSpike)
      if (!this.showAllSpike) {
        window.scrollTo(0, 250)
      }
    },
    toggleFavorite() {
      const that = this
      if (this.isHSQ) {
        bridge.getUserInfo({
          success(res) {
            if (res.data.user_id) {
              that.toggleFavoriteFunc()
            } else {
              bridge.login({
                success(res) {
                  console.log(res) // 登录成功并返回用户数据
                },
                fail() {
                  // 登录失败或用户取消
                },
              })
            }
          },
        })
      } else {
        this.toggleFavoriteFunc()
      }
    },
    toggleFavoriteFunc() {
      if (this.headerData.favorited) {
        // this.$set(this.headerData, 'favorited', false)
        // 点击取消收藏
        this.$api.setUnLikeMerchant(
          {
            merchantIds: this.$route.query.id || 138,
          },
          res => {
            this.$showToast('取消收藏成功！')
            this.$set(this.headerData, 'favorited', false)
          },
          err => {}
        )
      } else {
        // 点击收藏
        this.$api.setLikeMerchant(
          {
            merchantId: this.$route.query.id || 138,
          },
          res => {
            this.$showToast('收藏成功！')
            this.$set(this.headerData, 'favorited', true)
          },
          err => {}
        )
        // this.$set(this.headerData, 'favorited', true)
      }
    },
    allShopBtn() {
      let top = 0
      const el = this.$el
      top += el.querySelector('.merchant-top').scrollHeight
      top += el.querySelector('.certificate-cell').scrollHeight
      top += el.querySelector('.merchant-info').scrollHeight
      top += el.querySelector('.spike-block').scrollHeight
      window.scrollTo(0, top)
    },
    goDetail(items) {
      if (this.isHSQ) {
        if (this.$version.gt('3.9.5')) {
          bridge.navigateTo({
            url: items.link,
          })
        }else if(this.$version.gt('3.7.6')){
          bridge.navigateTo({
            url: `https://m.haoshiqi.net/v2/couple-detail?id=${items.pinActivitiesId}`,
          })
        } else {
          location.href = `haoshiqi://com.doweidu/couplesbuydetail?pinActivityId=${items.pinActivitiesId}`
        }
      } else {
        if(items.link) {
          this.$forward(items.link)
        } else {
          this.$forward(`detail2`, { id: items.pinActivitiesId })
        }
      }
    },
    getScrollTop(value) {
      if (this.spikeList.length < 1) {
        this.shopAllBtnStatus = false
        return
      }
      let top = 0
      const el = this.$el
      top += el.querySelector('.merchant-top').scrollHeight
      top += el.querySelector('.certificate-cell').scrollHeight
      top += el.querySelector('.merchant-info').scrollHeight
      top += el.querySelector('.spike-block').scrollHeight
      if (value >= top) {
        this.shopAllBtnStatus = false
      } else {
        this.shopAllBtnStatus = true
      }
    },
    onClose() {
      this.showCoupons = false
    },
    //获取券列表信息
    getCouponList() {
      console.log(this, 'merchantData data')
      const merchantId = this.$route.query.id || 139
      // const skuId = this.data.skuId;
      this.$api.getMerchantCouponlist(
        {
          merchantId,
        },
        res => {
          console.log(res, 'res data')
          const data = res.data
          let coupons = data.list || []
          if (coupons.length) {
            coupons = coupons.map(item => {
              return {
                isRedeem: item.usable_num,
                code: item.code,
                desc: item.usage_desc,
                title: item.title,
                subTitle: item.sub_title,
                value: item.value / 100,
                time: item.enabled_time_display,
              }
            })
          }
          this.coupons = coupons
        },
        err => {
          console.log(err, 'err')
        }
      )
    },
    //领取券
    getCoupon(item, index) {
      console.log(item, index, 'data')
      if (this.isHSQ) {
        const that = this
        bridge.getUserInfo({
          success(res) {
            if (!res.data.user_id) {
              bridge.login({
                success(res) {
                  console.log(res) // 登录成功并返回用户数据
                },
                fail() {
                  // 登录失败或用户取消
                },
              })
            } else {
              that.conponRedeem(item, index)
            }
          },
        })
      } else {
        this.conponRedeem(item, index)
      }
    },
    conponRedeem(item, index) {
      const itemobj = this.coupons[index]
      console.log(this.coupons, 'data3', itemobj)
      if (!item.isRedeem) return
      this.$api.codeRedeem(
        {
          // token: '160ef6d86cb31b8dad9a3235176a4c3d',
          code: item.code,
          type: '0',
        },
        res => {
          item.isRedeem = item.isRedeem - 1
          itemobj.isRedeem = item.isRedeem
          this.sucToast = true
          setTimeout(() => {
            this.hideToast()
          }, 2000)
        },
        err => {
          console.log(err, 'err')
          if (err.errno === 9310009) {
            item.isRedeem = item.item - 1
            itemobj.isRedeem = item.isRedeem
            this.sucToast = true
            setTimeout(() => {
              this.hideToast()
            }, 2000)
            return true
          }
        }
      )
    },
    hideToast() {
      this.sucToast = false
    },
  },
}
</script>

<style lang="stylus" scoped>
.merchant-page{
  background-color: #f8f8f8;
}
.favorite-active{
  color: #ed0000;
}
.merchant-top{
  height: 92px;
  width: 100%;
  position: relative;
  overflow: hidden;
  .merchant-head-bg{
    &:before{
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.5);
      position: absolute;
    }
    height: 92px;
    width: 100%;
    background-size: 100% auto;
    filter: blur(50px);
  }
  .merchant-name-block{
    position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    left: 0;
    .merchant-name-left{
      display: flex;
      flex: 1;
      .merchant-name-desc{
        flex-shrink: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        justify-content: space-around;
        color: #fff;
        .line-1{
          width: 100%;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          white-space: normal;
          text-overflow: ellipsis;
        }
        .merchant-name-text{
          font-size: 16px;
          font-weight: bold;
        }
        .merchant-add-text{
          font-size: 12px;
        }
      }
      .merchant-img{
        flex-shrink:0;
        img{
          width: 45px;
          height: 45px;
          margin-right: 10px;
        }
      }
    }
  }
  .favorite-merchant-btn{
    flex-shrink: 0;
    width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #fff;
    font-size: 12px;
    .favorite-text{
      color: #fff;
    }
    .favorite-active{
      color: #ed0000;
    }
    .favorite-no-active{
      color: #fff;
    }
  }
}
.certificate-cell{
  background-color: #fff;
  display: flex;
  padding: 0 10px;
  font-size: 13px;
  color: #333;
  height: 40px;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  justify-content: space-between;
  img{
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .certificate-left{
    display: flex;
    align-items: center;
  }
}
.merchant-info{
  margin-bottom: 10px;
  border-bottom: 1px solid #f1f1f1;
  background-color: #fff;
  .merchant-brand{
    display: flex;
    font-size: 13px;
    padding: 10px;
    .brand-label{
      font-size: 13px;
      color: #959595;
      flex-shrink: 0;
      width:80px;
    }
    .brand-text{
      word-break: break-all;
      position:relative;
      padding-right:4px;
      flex:1;
    }
    .more{
      height:16px;
      line-height:16px;
      overflow:hidden;
      .border{
        height:70%;
        top:15%;
      }
    }
    .left-arrow{
      color:#666;
      font-size:12px;
      width:50px;
      line-height:16px;
      padding-left:3px;
      display:flex;
    }
    .border{
      display:block;
      position:absolute;
      width:1px;
      height:90%;
      right:1px;
      top:5%;
      background: #C1C1C1;
      z-index:22;
    }
    .arrow{
      width:18px;
      height:18px;
      background:url('https://img1.haoshiqi.net/wxapp/img/more_85508a3b09.png') no-repeat center;
      background-size: 100% auto;
      display:inline-block;
      transform: rotate(90deg);
      &.up{
        transform: rotate(-90deg);
      }
    }
  }
}
.list-header{
  padding: 0 10px;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  font-weight: bold;
  line-height: 36px;
  span{
    font-size: 12px;
    color: #CCCCCC;
    letter-spacing: 0;
    font-weight: normal;
    line-height: 36px;
    display: inline-block;
  }
}
.spike-list{
  >>>.c-product-col1{
    padding: 0;
  }
  >>>.product-row1-box{
    background-color: #fff;
    .shop-box{
      margin-left: 10px;
      border-bottom: 1px solid #f4f4f4;
      padding: 10px 10px 10px 0;
    }
  }
}
.more-spike-list{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 50px;
  background-color: #fff;
  color: #333;
  font-size: 12px;
  .triangle-top{
    transform: rotate(180deg);
  }
}
.shop-all-btn{
  position: fixed;
  right: 14px;
  top: 75%;
  width: 64px;
  height: 64px;
  background: rgba(0,0,0,0.8);
  border-radius: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  .btn-text{
    font-size: 12px;
    color: #fff;
    width: 100%;
    text-align: center;
    margin-top: 14px;
  }
  .btn-e-text{
    font-size: 10px;
    margin-top: 5px;
    color: rgba(255, 255, 255, .5);
    width: 100%;
    text-align: center;
  }
  .more-product-icon{
    color: #fff;
    transform: rotate(90deg);
  }
}
.copple-desc{
  margin-top:8px;
}
.popup-outbox,.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 120;
  height:100%;
  background:rgba(0,0,0,0.2);
}
</style>
