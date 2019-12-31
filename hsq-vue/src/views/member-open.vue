<template>
  <dwd-page is-header is-footer class="open-member-page">
    <div class="user-card">
      <div class="user-pic">
        <i v-if="!userInfo.is_new_member" class="vip-tag-icon" />
        <div class="user-avatar jzimg"><img :src="userInfo.avatar" alt=""></div>
      </div>
      <div class="user-info">
        <p class="user-name">{{ userInfo.username }}</p>
        <div class="user-member-info">{{ userInfo.sub_content }}</div>
      </div>
    </div>

    <div class="member-card-box">
      <div v-for="(item, index) in cardList" :key="index" class="member-itme">
        <div class="member-item-top">
          <p class="card-name">{{ item.template_name }}</p>
          <div class="member-price">
            <span class="offer-tag">{{ item.template_tips }}</span>
            <span class="price">¥{{ item.price | price }}</span>
          </div>
        </div>
        <div class="member-desc">
          <p>{{ item.template_sub_content }}</p>
          <del>¥{{ item.market_price }}</del>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <div class="member-protocol">
        <p>开通即同意<span data-link="https://render.doweidu.com/p/hsq/member-service.html" @click="$onUrlPage($event)">《好食期·好会员服务协议》</span></p>
      </div>
      <div class="open-member-footer">
        <div class="total-price">
          <span>总价</span>
          <em>¥{{ currentCard.price | price }}</em>
          <del>¥{{ currentCard.market_price }}</del>
        </div>
        <div class="open-btn" @click="gotoOpen">{{ !userInfo.is_new_member ? '立即续费':'立即开通' }}</div>
      </div>
    </template>
    <template v-slot:sub-block>
      <div v-if="isShowPopup" class="pay-success-popup">
        <div class="popup-content">
          <img
            class="success-popup-bg"
            src="https://img1.haoshiqi.net/miniapp/windows@2x_429ea3747d.png
"
            alt=""
          >
          <dwd-icon
            class="close-popup"
            type="delete"
            color="#000"
            :size="24"
            @click.native="gotoMember(0)"
          />
          <div class="content-text">
            <p class="pay-status">{{ popupStauts ? '续费成功' : '开通成功' }}</p>
            <div v-if="!popupStauts" class="status-duration">有效期至：{{ memberTime.end_timeText }}快去享受会员权益吧！</div>
            <div v-else class="status-duration">有效期延长至：{{ memberTime.end_timeText }}</div>
            <div class="status-img">
              <img v-if="!popupStauts" class="status-open" src="https://img1.haoshiqi.net/miniapp/face@2x_bb0ca7c5ed.png" alt="">
              <img v-else class="status-renew" src="https://img1.haoshiqi.net/miniapp/diadema@2x_8288088a36.png" alt="">
            </div>
            <div v-if="popupStauts" class="duration-date">
              <span>{{ memberTime.start_time }}</span>
              <span>{{ memberTime.end_time }}</span>
            </div>

          </div>

          <div class="popup-btn" @click="gotoMember(1)">去会员中心看看></div>
        </div>
      </div>
    </template>
  </dwd-page>
</template>
<script>
import device from '@dwdjs/utils/lib/device'
import bridge from '@/utils/bridge'
import { dealPrice } from '@/utils'
import { stringify, urlfix, formatDate } from '@/utils/base'
import { Icon } from '@/ui'
import env from '@/config/env'
const titleTexts = ['购买好会员', '续费好会员']

export default {
  name: 'member-open',
  components: {
    [Icon.name]: Icon,
  },
  data() {
    return {
      type: 2,
      isShowPopup: false,
      userInfo: {},
      cardList: [],
      currentCard: {
        price: 0,
        market_price: 0,
      },

      payment_id: 0,

      popupStauts: 0, // 0 开通，1续费
      memberTime: {
        start_time: '',
        end_time: '',
      },
    }
  },
  created() {

    const { type = 1, payment_id } = this.$route.query
    this.type = type == 1 ? 2 : 1
    this.setTitle(type-1)
    this.getInitData()
    if (payment_id) {
      this.payment_id = payment_id
      this.getOrderPaySuccessPopup()
    }
  },
  methods: {
    gotoMember(tag) {
      if (tag) {
        // const url = location.origin + '/v2/member-center'
        let mode = ''
        if (['dev', 'beta'].includes(env.apiEnv)) {
          mode = env.apiEnv + '.'
        }
        const url = `https://m.${mode}haoshiqi.net/v2/member-center`
        const that = this
        if (device.hsq) {
          if (!this.$route.query.open_tag) {
            bridge.redirectTo({
              url: url,
              success(res) {
                console.log(res)
              },
            })
          } else {
            bridge.navigateBack({
              deep: 1,
              success(res) {
                console.log(res)
              },
            })
          }
          return
        } else if(device.wxapp){
          bridge.ready(function (wx) {
            if (!that.$route.query.open_tag) {
              wx.miniProgram.redirectTo({ url: '/pages/redirect/redirect?url=' + encodeURIComponent(url)})
            } else {
              wx.miniProgram.navigateBack()
            }
          })
          return
        }
        this.$forward('member-center')
      } else {
        if (device.hsq) {
          bridge.navigateBack({
            deep: 1,
            success(res) {
              console.log(res)
            },
          })
        } else if(device.wxapp){
          bridge.ready(function (wx) {
            wx.miniProgram.navigateBack()
          })
        }
      }


    },
    setTitle(index) {
      document.title = titleTexts[index]

      if (device.hsq) {
        bridge.setNavigationBar({
          title: titleTexts[index],
          color: '#ffffff',
          backgroundColor: '#333333',
          // background: 'nav_yellow_grid_bg',
          success(res) {
            console.log(res)
          },
        })
      }
    },
    gotoOpen() {
      const that = this
      if (device.hsq) {
        console.log('hsq来了')
        // bridge.ready(function () {
          // alert(JSON.stringify(wx))
          // template_id,
          const ids = [that.currentCard.template_id]

          bridge.cashier({
            'id': ids.toString(), // '业务Id, 多个逗号隔开',
            'price': that.currentCard.price,
            'type': '1',
            success: function (res) {
              console.log('支付成功回调：', res)
              if (res.data.result != 'failed') {
                console.log('xxxxxx', res)
                // that.back()

                if (res.data.paymentId) {
                  that.payment_id = res.data.paymentId
                  that.getOrderPaySuccessPopup()
                } else {
                  bridge.navigateBack({
                    deep: 1,
                    success(res) {
                      console.log(res)
                    },
                  })
                }
              }
            },
            fail: function (err) {
              console.log('支付失败回调：', res)
            },
          })
        // })
      } else if(device.wxapp){
        console.log('wxapp来了')
        // alert(wx.miniProgram.navigateTo)
        bridge.ready(function (wx) {
          // alert(JSON.stringify(wx))
          // template_id,
          let url = '/pages/pay/pay'
          const params = {
            // 这里后续需要添加参数
            template_id: that.currentCard.template_id,
            pay_type: 'open-member',
          }
          console.log('url:', url)
          url = urlfix(url, stringify(params))
          wx.miniProgram.navigateTo({ url })
        })
      } else {
        // 暂不支持其他环境跳转
      }


    },
    getInitData() {

      this.$api.hsqMemberPayInit({
        type: this.type,
      }, res => {
        //
        const { avatar = '', username = '', sub_content = '', is_new_member = 1, list = [] } = res.data

        this.setTitle(!is_new_member ? 1 : 0)

        this.userInfo = {
          is_new_member,
          avatar,
          username,
          sub_content,
        }

        if (!list || !list.length) return
        this.cardList = (list || []).map((item) => {
          return {
            ...item,
            market_price: dealPrice(item.market_price),
          }
        })

        this.currentCard = this.cardList[0]

      }, err => {
        //

      })

    },
    getOrderPaySuccessPopup() {

      if (!this.payment_id) return
      this.$api.getOrderPaySuccessPopup({
        paymentId: this.payment_id,
      }, res => {
        console.log('天窗',res)

        this.isShowPopup = true
        const { renewal_status, start_time, end_time } = res.data
        // renewal_status 1 续费 0开通
        this.memberTime = {
          start_time: formatDate(start_time, 'Y.M.D'),
          end_time: formatDate(end_time, 'Y.M.D'),
          end_timeText: formatDate(end_time, 'Y.M.D H:F:S'),
        }
        this.popupStauts = renewal_status
      }, err => {
        return true
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.test-btn{
  height: 50px;
  width: 100px;
  border: 1px solid #ff0000;
}

.open-member-page{
  padding-bottom: 86px !important;
}

.user-card{
  padding: 30px 15px 15px;
  background: #333333;
  display: flex;
  align-items: center;
  background: url('~assets/img/vip/vip-open-header-bg.png') no-repeat center bottom;
  background-size: 100% auto;
  .user-pic{
    width: 48px;
    height: 48px;
    position: relative;
    .user-avatar{
      width: 48px;
      height: 48px;
      border: 2px solid #E9D9AA;
      border-radius: 100%;
      overflow: hidden;
    }

    .vip-tag-icon{
      display: block;
      width: 25px;
      height: 21px;
      position: absolute;
      left: -4px;
      top: -6px;
      background: url('~assets/img/vip/vip-tag-icon.png') no-repeat center center;
      background-size: 100%;
    }
  }

  .user-info{
    flex: 1;
    margin-left: 12px;
    .user-name{
      font-size: 18px;
      color: #E9D9AA;
      margin-bottom: 5px;
    }
    .user-member-info{
      font-size: 12px;
      color: #E9D9AA;
    }
  }
}

.member-card-box{
  padding: 20px 12px 12px;
  .member-itme{
    padding: 15px;
    border-radius: 12px;
    background-color: #FFFBE9;
    border: 1px solid #F3DC93;
    box-shadow: 0 1px 6px 0 #F3DC93;
    margin-bottom: 20px;
    .member-item-top{
      display: flex;
      align-items: center;
      .card-name{
        font-size: 20px;
        color: #5E3C02;
        flex:1;
        font-weight: bold;
      }
      .member-price{
        .offer-tag{
          position: relative;
          display: inline-block;
          background-image: linear-gradient(-90deg, #550CDB 0%, #D500EE 100%);
          box-shadow: 0 1px 5px 0 rgba(66,22,242,0.26);
          border-radius: 4px;
          font-size: 10px;
          color: #FFFFFF;
          padding: 4px;
          margin-right: 10px;
          vertical-align: middle;

          &:before{
            content: '';
            display: block ;
            position: absolute;
            right: -5px;
            top: 50%;
            width: 0;
            height: 0;
            transform: translateY(-50%);
            border-top: 4px solid transparent;
            border-left: 5px solid #550CDB;
            border-bottom: 4px solid transparent;
          }
        }

        .price{
          font-size: 26px;
          color: #FF0000;
          vertical-align: middle;
          font-weight: bold;
        }
      }
    }
    .member-desc{
      display: flex;
      align-items: center;
      margin-top: 5px;
      p{
        flex:1;
        font-size: 14px;
        color: #5E3C02;
      }
      del{
        font-size: 14px;
        color: #666666;
      }
    }
  }

}

.member-protocol{
  position: fixed;
  left: 0;
  bottom : 50px;
  width: 100%;
  height: 37px;
  line-height: 37px;
  font-size: 11px;
  color: #333333;
  padding: 0 15px;
  span{
    text-decoration: underline;
    color: #0071FF;
  }
}
.open-member-footer{
  position: fixed;
  left: 0;
  bottom : 0;
  width: 100%;

  height: 50px;
  background-color: #FFFFFF;
  box-shadow: 0 -1px 6px 0 rgba(0,0,0,0.17);

  display: flex;

  .total-price{
    flex: 1;
    padding-left: 15px;
    line-height: 50px;
    span{
      font-size: 14px;
      color: #333333;
    }
    em{
      font-size: 24px;
      color: #FF0000;
      font-style: normal;
      font-weight: bold;
      margin: 0 2px;
    }
    del{
      font-size: 14px;
      color: #999999;
    }
  }
  .open-btn{
    width: 142px;
    background-color: #333;
    font-size: 16px;
    color: #E9D9AA;
    line-height: 50px;
    text-align: center;


  }
}

.pay-success-popup{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0, 0.7);
  .popup-content{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    overflow: hidden;
    transform: translate(-50%, -50%);
    .success-popup-bg{
      width: 100%;
      height: auto;
      margin-left: -5px;
    }

    .close-popup{
      position: absolute;
      right: 0;
      top: 0;
      background-color: #fff;
      border-radius: 100%;
      overflow: hidden;
    }

    .content-text{
      position: absolute;
      left: 0;
      top: 110px;
      width: 100%;
      padding: 0 30px;
      .pay-status{
        background-image: linear-gradient(-242deg, #9E683F 22%, #C3824C 73%);
        -webkit-background-clip:text;
        color: transparent;
        font-size: 30px;
        text-align: center;
        font-weight: bold;
      }
      .status-duration{
        font-size: 14px;
        color: #9E683F;
        padding: 0 30px;
        margin-top: 10px;
      }
      .status-img{
        text-align: center;
        margin-top: 10px;
        .status-renew{
          width: 80%;
        }
        .status-open{
          width: 50%;
        }
      }
      .duration-date{
        display: flex;
        width: 78%;
        margin: -10px auto 0 auto;
        font-size: 14px;
        color: #514943;
        padding-right: 5px;
        font-weight: bold;
        span{
          flex: 1;
          &:last-child{
            text-align: right
          }
        }
      }
    }

    .popup-btn{
      width: 169px;
      height: 42px;
      background-image: linear-gradient(-249deg, #F9DABE 15%, #E5BD9E 69%, #E5BD9E 69%);
      box-shadow: 0 9px 7px 0 rgba(0,0,0,0.50);
      border-radius: 28.5px;

      font-size: 16px;
      color: #9E683F;
      line-height: 42px;
      text-align: center;
      position: absolute;
      left: 50%;
      bottom: 75px;
      transform: translate(-50%, 0);
    }
  }


}
</style>
