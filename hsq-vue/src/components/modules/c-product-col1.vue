<template>
  <dwd-tpl class="c-product-col1" :data="data" :data-type="data.type">
    <div class="product-row1-box">
      <dl
        v-for="(item, index) in data.list"
        :key="index"
        class="shop-box"
        :data-bought="item.can_bought"
        :data-id="item.biz_id"
        :data-index="index"
        @click="goDetail(item)"
      >
        <dt class="img-box">
          <img class="shop-img" :src="item.thumbnail">
          <!-- 商品状态 抢光了 -->
          <img
            v-if="!item.left_stock || !item.can_bought"
            class="shop-status"
            src="https://img1.haoshiqi.net/miniapp/img/sold_a64f1921fd.png"
          >
          <img v-if="showAttImg(item)" :src="attentionImg" alt="" class="attention-img">
        </dt>
        <dd class="text-box">
          <div class="flex-start">
            <p class="max-line-2 shop-title">
              <span v-if="item.merchant_type == 2" class="title-tag">自营</span>
              <span>{{ item.title }}</span>
            </p>
            <div v-if="item.expired_date_text_one" class="ellipsis row-expire-day">{{ item.expired_date_text_one }}</div>
            <!-- :class="[{item.arrowClick?'tag-overflow':''} {tagH?'tagH':''}]" -->
            <div
              v-if="item.tags.length > 0"
              class="row2-tag-box"
              :class="[{ 'tag-overflow': item.arrowClick }]"
              :style="{ height: !item.showupArrow ? '100%' : '' }"
            >
              <span
                v-for="(tagData, tagIndex) in item.tags"
                :key="tagIndex"
                class="row2-text-tag"
                :style="{ color: tagData.color }"
              >
                {{ tagData.text }}</span>
              <div
                v-if="item.arrowClick"
                class="left-arrow"
                :data-type="'arrow'"
                :data-index="index"
                @click.stop="clickArrow(item)"
              >
                <!-- {!item.showupArrow?'up':'down'} -->
                <div class="arrow" :class="!item.showupArrow ? 'up' : 'down'" />
              </div>
            </div>
            <div v-if="item.is_spike && !item.hideCountDown" class="shop-timer-box">
              <div class="timer-countdown">
                <div class="timer-text">
                  {{ timerText(item) }}
                </div>
                <div v-if="item.countDownInfo.days > 0" class="count-number-day">
                  {{ item.countDownInfo.days }}天
                </div>
                <div class="count-number">
                  {{ item.countDownInfo.hours }}
                </div>
                :
                <div class="count-number">
                  {{ item.countDownInfo.minutes }}
                </div>
                :
                <div class="count-number">
                  {{ item.countDownInfo.seconds }}
                </div>
              </div>
            </div>
          </div>
          <div class="shop-price-box flex-end">
            <div class="price-box">
              <span class="price-integer">￥{{ item.price.price_yuan }}</span>
              <span class="price-decimals">.{{ item.price.price_fen }}</span>
              <span class="buy-btn" :class="buyBtnNew(item)" @click.stop="buttonClick(item)">{{
                buttonText(item)
              }}</span>
            </div>
            <div class="bottom-price">
              <div v-if="item.member_price > 0" class="row-vip-price">
                <div class="vip-bg"><img src="https://img1.haoshiqi.net/miniapp/vip-icon_1be7bb7dd2.png" class="img-vip">
                </div>
                <span class="vip-price">￥{{ item.member_price }}</span>
              </div>
              <span v-else class="market-price">￥{{ item.market_price }}</span>
              <span v-if="showStockProgress(item)" class="stock-progress-box">
                <span class="progress-text">{{ sellText(item) }}</span>
                <span class="progress-box">
                  <span class="current-progress" :style="{ width: item.rate_percent + '%' }" />
                </span>
              </span>
            </div>
          </div>
        </dd>
      </dl>
    </div>
  </dwd-tpl>
</template>

<script>
import Tpl from './tpl'
import CountManger from '@/utils/count-manger'
import { formatCountDownObj } from '@/utils/base/date'
import bridge from '@/utils/bridge'
import device from '@dwdjs/utils/lib/device'
import { loadImg } from '@/utils'

export default {
  name: 'c-product-col1',
  components: {
    [Tpl.name]: Tpl,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      isHSQ: device.hsq,
      attentionImg: loadImg('attention.png'),
    }
  },
  computed: {
    sellText() {
      return function (item) {
        return `已抢${item.rate_percent}%`
      }
    },
    showStockProgress() {
      return function (item) {
        if (item.is_spike && item.buttonStatus != 2) {
          return false
        }
        return true
      }
    },
    buttonText() {
      return function (item) {
        if (!item.is_spike) {
          return '去抢购'
        }
        return item.buttonText || '马上抢'
      }
    },
    buyBtnNew() {
      return function (item) {
        if (item.buttonText == '取消提醒' && item.buttonStatus != 3) {
          return 'btn-no-fill'
        } else if (item.buttonStatus == 3) {
          return 'btn-no-active'
        }
      }
    },
    showAttImg() {
      return function (item) {
        return item.is_spike && item.is_subscribe && item.buttonStatus != 2
      }
    },
    timerText() {
      return function (item) {
        return item.buttonText == '马上抢' ? '距结束' : '距开始'
      }
    },
  },
  watch: {
    data(newValue) {
      this.clearCountDown()
      this.startCountDown()
    },
  },
  created() {
    if (this.data.is_spike) {
      this.startCountDown()
    }
  },
  beforeDestroy() {
    this.clearCountDown()
  },
  methods: {
    startCountDown() {
      const that = this
      const activityList = this.data.list || []
      const countDownOptions = {
        times: 1000,
        dataList: activityList,
        set() {
          this.localEndTime = this.data.end_time * 1000 + that.data.list[this.index].diffTime
          this.localStartTime = this.data.start_time * 1000 + that.data.list[this.index].diffTime
          if (this.localEndTime - Date.now() > 0 && this.data.is_spike) {
            this.start()
          } else {
            that.$set(that.data.list[this.data.index], 'hideCountDown', true)
            that.$emit('refresh')
          }
        },
        callback() {
          const localEndLeftTime = this.localEndTime - Date.now()
          const localStartLeftTime = this.localStartTime - Date.now()
          const nowIndex = this.data.index
          if (localStartLeftTime > 0) {
            // const timeInfo = formatCountDown(localEndLeftTime, format);
            let timeInfo = formatCountDownObj(localStartLeftTime, true)
            that.$set(that.data.list[nowIndex], 'countDownInfo', timeInfo)
            // 大于五分钟
            if (localStartLeftTime > 300000) {
              that.$set(
                that.data.list[nowIndex],
                'buttonText',
                this.data.is_subscribe ? '取消提醒' : '提醒我'
              )
              that.$set(that.data.list[nowIndex], 'buttonStatus', 1)
            } else {
              that.$set(
                that.data.list[nowIndex],
                'buttonText',
                this.data.is_subscribe ? '取消提醒' : '提醒我'
              )
              that.$set(that.data.list[nowIndex], 'buttonStatus', 3)
            }
          } else if (localEndLeftTime > 0) {
            let timeInfo = formatCountDownObj(localEndLeftTime, true)
            that.$set(that.data.list[nowIndex], 'countDownInfo', timeInfo)
            that.$set(that.data.list[nowIndex], 'buttonText', '马上抢')
            that.$set(that.data.list[nowIndex], 'buttonStatus', 2)
          } else {
            that.$set(that.data.list[nowIndex], 'hideCountDown', true)
            that.$emit('refresh')
            this.clear()
          }
        },
      }
      if (!this.countManger) {
        this.countManger = new CountManger(countDownOptions)
      } else {
        this.countManger.add(countDownOptions)
      }
    },
    clearCountDown() {
      if (this.countManger) {
        this.countManger.clear()
        this.countManger = null
      }
    },
    goDetail(item) {
      this.data.eventClick(item)
    },
    clickArrow(item) {
      console.log(item, 'item')
      item.showupArrow = !item.showupArrow
    },
    buttonClick(item) {
      const that = this
      console.log(item)
      // 秒杀，且距离开始超过五分钟
      if (item.is_spike && item.buttonStatus == 3) {
        this.$showToast(`秒杀快开始啦，请摆好正确的秒杀姿势~`)
        return
      }
      if (item.is_spike && item.buttonStatus == 1) {
        if (this.isHSQ) {
          bridge.getUserInfo({
            success(res) {
              if (res.data.user_id) {
                bridge.checkPermission({
                  authKey: 'notify',
                  success(res) {
                    if (res.data.granted) {
                      that.toggleSubscribe(item)
                    } else {
                      bridge.requestPermission({
                        authKey: 'notify',
                        title: '权限申请',
                        message: '需要打开通知权限才能使用此功能',
                        success(res) {
                          if (res.data.granted) {
                            that.toggleSubscribe(item)
                          }
                        },
                      })
                    }
                  },
                })
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
          this.toggleSubscribe(item)
        }
      } else {
        this.goDetail(item)
      }
    },
    toggleSubscribe(item) {
      const that = this
      let hitText = ''
      if (!item.is_subscribe) {
        hitText = '已成功设置提醒，开场前5分钟会通知您'
      } else {
        hitText = '您已取消提醒，无法收到该商品秒杀通知'
      }
      this.$api.setActivitySubscribe(
        {
          activityId: item.topic_id,
          activityType: 4,
          subscribe: !item.is_subscribe ? 1 : 2,
          itemId: item.sku_id,
        },
        res => {
          const nowStatus = !item.is_subscribe
          const nowIndex = item.index
          this.$showToast(`${hitText}`)
          this.$set(that.data.list[nowIndex], 'buttonText', nowStatus ? '取消提醒' : '提醒我')
          this.$set(that.data.list[nowIndex], 'is_subscribe', nowStatus)
        },
        err => {
          this.$showToast(`操作失败，请重试`)
        }
      )
    },
  },
}
</script>

<style lang="stylus" scoped>
// style
.c-product-col1{
  overflow: hidden;
  padding: 0 10px;
  .product-row1-box{
    width: 100%;
    overflow: hidden;
    .shop-box{
      background: #fff;
      width: 100%;
      margin-bottom: 10px;
      overflow: hidden;
      display: flex;
      .img-box{
        float: left;
        width: 140px;
        height: 140px;
        position: relative;
        .shop-img{
          width: 140px;
          height: 140px;
        }
        .shop-status{
          position: absolute;
          top: 50%;
          left: 50%;
          width: 64px;
          height: 64px;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .attention-img{
          width: 64px;
          height: 64px;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-top: -32px;
          margin-left: -32px;
        }
        .img-label{
          position: absolute;
          top: 0;
          left: 0;
          width: 140px;
          height: 140px;
          z-index: 1;
          .icon-img{
            width: 100%;
          }
        }
      }
      .text-box{
        margin-left: 0.1rem;
        position: relative;
        flex: 1;
        min-height:140px;
        display:flex;
        flex-flow:row wrap;
        overflow: hidden;
        text-align:left;
        .shop-title{
          margin-top: 10px;
          font-size: 14px;
          color: #333;
          line-height: 18px;
          overflow: hidden;
          .title-tag{
            display: inline-block;
            height: 15px;
            line-height: 15px;
            padding: 0 7px;
            background-color: #EA594C;
            color: #fff;
            font-size: 10px;
            border-radius: 2px;
            margin-right: 5px;
          }
          span{
            vertical-align: middle;
          }
        }
        .row2-tag-box{
          overflow: hidden;
          margin-top:4px;
          display: flex;
          padding-right:15px;
          height:20px;
          .row2-text-tag{
            line-height: 17px;
            border: 1px solid #EA594C;
            box-sizing: border-box;
            // 兼容低版本1px的px2rem转化问题
            border:1PX solid #EA594C;
            border-radius: 2px;
            color: #EA594C;
            padding: 0 4px;
            font-size: 10px;
            margin-right: 2px;
            height:18px;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            min-width: 20px;
            max-width:220px;
            &:first-child{
              flex-shrink: 0;
            }
          }
        }
        .shop-date{
          margin-top: 10px;
          display: inline-block;
          height: 14px;
          line-height: 14px;
          padding: 0 5px;
          color: #EA594C;
          border: 1px solid #EA594C;
          border-radius: 2px;
          font-size: 10px;
          margin-right: 2px;
        }
        .shop-price-box{
          overflow: hidden;
          width: 100%;
          left: 0;
          bottom: 0;
          width:260px;
          .price-box{
            color: #F21833;
            height: 28px;
            line-height: 28px;
            position: relative;
            display:flex;
            align-self:flex-end;
            justify-content :flex-start;
            .price-integer{
              font-size: 20px;
              height: 28px;
              font-weight: bold;
            }
            .price-decimals{
              font-size: 16px;
              align-self: flex-end
            }
            .buy-btn{
              position: absolute;
              right: 10px;
              bottom: 0;
              width: 65px;
              height: 25px;
              line-height: 25px;
              font-size: 14px;
              background: #FE0137;
              border-radius: 16.5px;
              color: #fff;
              text-align: center;
            }
            .btn-no-fill{
              background-color: #fff;
              border: 1px solid #fe0137;
              color: #fe0137;
              font-size: 12px;
            }
            .btn-no-active{
              background-color: #ccc;
              color: #fff;
            }
          }
          .bottom-price{
            margin-bottom: 8px;
            position: relative;
            display:flex;
            .market-price{
              font-size: 10px;
              color: #999;
              text-decoration: line-through;
            }
            .stock-progress-box{
              position: absolute;
              right: 10px;
              .progress-text{
                font-size: 10px;
                color: #666;
              }
              .progress-box{
                margin-left: 10px;
                display: inline-block;
                width: 64px;
                height: 5px;
                background: #FFB0A0;
                box-shadow: 0 0 1px 0 rgba(255,176,160,0.53);
                border-radius: 5px;
                position: relative;
                .current-progress{
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 0%;
                  background-image: linear-gradient(90deg, #FBA592 29%, #F38371 84%);
                  border-radius: 2.5px;
                  height: 5px;
                }
              }
            }
          }
        }
      }
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
}
.shop-timer-box{
  flex: 1;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  font-size: 12px;
  padding:5px 0;
  .timer-countdown{
    display:flex;
    font-size: 12px;
    align-items:flex-end;
    color: #333333;
    line-height: 16px;
  }
  .timer-text{
    color:#333333;
    font-weight: bold;
    font-size:  12px;
  }
  .count-number-day{
    font-size:  12px;
    color: #333;
    font-weight: bold;
    margin-left: 3px;
  }
  .count-number{
    width:16px;
    height:16px;
    text-align:center;
    line-height:16px;
    color:#fff;
    font-size: 10px;
    background-color:#171900;
    border-radius:2px;
    margin:0 3px;
    flex-shrink: 0;
  }
}
.row-expire-day{
  height:14px;
  line-height:14px;
  font-size:10px;
  color: #999999;
  width:100%;
}
.tag-overflow {
  display:inline-block !important;
  position: relative;
}

.left-arrow {
  width:100%;
  height:40px;
  display:inline-block;
  position: absolute;
  right:0;
  top:0;
}
.arrow{
  position: absolute;
  width:12px;
  height:12px;
  background:url('https://img1.haoshiqi.net/wxapp/img/more_85508a3b09.png') no-repeat center;
  background-size: 100% auto;
  right:4px;
  top:3px;
}
.arrow.up {
  transform: rotate(-90deg);
}
.arrow.down {
  transform: rotate(90deg);
}
.tagH{
  height:20px;
}
.flex-start{
  align-self:flex-start;
  overflow: hidden;
}
.flex-end{
  align-self:flex-end;
}

/* 会员价 */
.bottom-price .row-vip-price{
  display:block;
  font-size:12px;
  line-height:22px;
}
.bottom-price .vip-bg{
  background: #333;
  line-height:12px;
  display:inline-block;
  border-top-left-radius:2px;
  border-bottom-left-radius:2px;
}
.bottom-price .img-vip{
  width:12px;
  height:12px;
  border-radius: 2px;
  display:inline-block;
}
.bottom-price .vip-price {
  font-size:12px;
  color:#333;
  background: #FDFBEB;
  height:12px;
  padding:0 2px;
  border-radius:2px;
}
</style>
