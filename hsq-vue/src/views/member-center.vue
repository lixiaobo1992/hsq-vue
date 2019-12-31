<template>
  <dwd-page is-header>
    <div class="member-header">
      <div class="member-card">
        <div class="user-info">
          <div class="user-pic">
            <img :src="userCardInfo.avatar" alt="">
          </div>
          <div class="user-detail">
            <p class="ellipsis user-name">{{ userCardInfo.username }}</p>
            <div class="vip-end-time"><span>{{ userCardInfo.expire_date }}</span><i class="vip-rule" @click="isRuleShow=true" /></div>
          </div>
        </div>
        <div class="renewalfee-entr-btn" @click="gotoRenewalfee">立即续费</div>
        <div class="member-status">
          <div class="member-status-item" @click="anchorPointEvent({modules_id: 'one-module'})">
            <span>{{ userCardInfo.coupon_num }}张</span>
            <p><em>{{ userCardInfo.coupon_num_text }}</em><i class="left-arrow" /></p>
          </div>
          <div class="member-status-item">
            <span>{{ userCardInfo.total_discount_amount }}元</span>
            <p>累计已省</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签 -->
    <div class="privilege-box">
      <div ref="fixedLabel" class="privilege-content" :class="{ 'is-fixed': isFiexd }">
        <div class="privilege-list">
          <div v-for="(item, index) in recommendList" :key="index" class="privilege-item" @click="anchorPointEvent(item)">
            <div class="privilege-icon jzimg">
              <img :src="item.logo" alt="">
            </div>
            <div class="ellipsis privilege-name">{{ item.tag_name }}</div>
            <div v-if="currentModuleId == item.modules_id" class="privilege-tag" />
          </div>

        </div>
      </div>
    </div>

    <template v-for="(item, index) in gftList">
      <!-- 天天领神券 -->
      <div :key="item.item_name + index" class="rights-list-header">
        <div v-if="index==0" ref="one-module" class="rights-title">
          <p>每天领神券</p>
          <span>领神券购物更便宜</span>
        </div>
        <div class="rights-tip">
          <!-- <i class="icon-laba"></i> -->
          <dwd-icon type="laba" size="18" />
          <p>每期领神券，花掉即赚本钱</p>
        </div>
      </div>

      <div :key="item.user_benefit_Id" class="rights-coupon-box">
        <div class="rights-item">
          <!-- 头部header -->
          <div class="rights-cycle-header">
            <div class="rights-cycle-list">
              <div
                v-for="(it, i) in item.list"
                :key="it.title"
                class="cycle-item"
                :class="{ 'active' : item.currentIndex == i}"
                @click="rightsTabBtnEvent(item, i)"
              >
                <div class="cycle-item-content">
                  <span>{{ it.title }}</span>
                  <i :class="{ 'cur': item.currentIndex == i && it.cycleStatus.code == 1 }">{{ it.cycleStatus.text }}</i>
                </div>
              </div>
            </div>
          </div>
          <!-- 券列表 -->
          <div class="rights-coupon-list">
            <div class="rights-coupon-item">
              <div class="rights-coupon-tip" v-html="item.list[item.currentIndex].tipText" />
              <div class="rights-coupon-content">
                <!-- 券 -->
                <div
                  v-for="coupon in item.list[item.currentIndex].list"
                  :key="coupon.coupon_code"
                  class="coupon-item"
                  :class="{ 'invalid': coupon.status.statusCode == 2 }"
                  @click="receiveCouponEvent(coupon, item)"
                >
                  <div class="coupon-left">
                    <p class="coupon-price">¥<em>{{ coupon.valueText }}</em></p>
                    <span class="coupon-sub">{{ coupon.at_least_title }}</span>
                  </div>
                  <div class="coupon-right">{{ coupon.status.statusText }}</div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-for="item in modulesList" :key="item.id" class="tpl-modules" :data-type="item.type">
      <dwd-modules :ref="item.id" :data="item" />
    </div>

    <template v-slot:sub-block>
      <div v-show="isRuleShow" class="dwd-popup">
        <div class="dwd-popup-mask" />
        <div
          class="dwd-popup-content dwd-popup--center rule-popup-conent"
          :class="{ 'show': isRuleShow }"
        >
          <div class="rule-title">好会员使用规则</div>
          <div class="rule-conent">
            <div class="rule-html" v-html="tips" />
          </div>
          <div class="rule-tel">如有疑问请联系客服：<a href="tel:4001858058">400-1858058</a></div>
          <div class="rule-btn" @click="isRuleShow=false">我知道了</div>
        </div>
      </div></template>

  </dwd-page>
</template>
<script>
import { Icon } from '@/ui'
import scroll from '@/utils/scroll'
import { on, off } from '@/utils/event'
import { debounce, dealPrice } from '@/utils'
import { isArray, formatCountDown } from '@/utils/base'
import modules from '@/components/modules/index'
import ModuleMixin from '@/mixins/dealModule'
export default {
  components: {
    [Icon.name]: Icon,
    [modules.name]: modules,
  },
  data() {
    return {
      //..
      isFiexd: false,

      isRuleShow: false,

      userCardInfo: {},

      currentModuleId: 'one-module',
      recommendList: [],

      gftList: [],

      modulesList: [],
      tips: '',
    }
  },
  created(){
    this.getMemberCenterData()

    if (bridge.hsq) {
      bridge.onPageShow({
        success(res) {
          this.getMemberCenterData()
        },
      })
    }

  },
  mounted() {
    // console.log(document.getElementById('content'))
    this.scroller = scroll.getScrollEventTarget(document.getElementById('content'))
    // this.handler(true)
    // console.log(this);
    // if (this.immediateCheck) {
    //   this.$nextTick(this.onScroll)
    // }
    this.handlerScroll(true)

    const tempfixedLabel = this.$refs.fixedLabel.getBoundingClientRect()
    this.fixedLabel = { top: tempfixedLabel.top, height: tempfixedLabel.height }
    // console.log('fixedLabel', this.fixedLabel);
    const oHeader = this.$children[0].$refs.header

    if (oHeader) {
      this.headerObj = oHeader.$el.getBoundingClientRect()

      this.fixedLabel.top = this.fixedLabel.top - this.headerObj.height
    }

    console.log(this.fixedLabel)
  },
  destroyed() {
    this.handlerScroll(false)
  },
  beforeDestroy() {
    if (device.hsq) {
      bridge.offPageShow({})
    }
  },
  activated() {
    /* istanbul ignore next */
    this.handlerScroll(true)
  },

  deactivated() {
    /* istanbul ignore next */
    this.handlerScroll(false)
  },
  methods: {
    ...ModuleMixin,
    gotoRenewalfee() {
      this.$forward('member-open', {type: 2, open_tag: 1 })
    },
    // 领取权益券
    receiveCouponEvent(coupon, currentRights) {

      if (coupon.status.statusCode != 0) {
        return
      }
      const params = {
        serialNo: this.userCardInfo.center_request_no,
        benefitId: currentRights.user_benefit_Id,
        activityCode: coupon.reward_code,
      }
      this.$api.receiveMemberCoupon(
        params,
        res => {
          console.log(res)
          this.$showToast('优惠券领取成功，快去使用吧！')
          if (!coupon.is_allow_repeat_exchange) {
            const newStatus = {
              statusText: '已领取',
              statusCode: 1,
            }
            this.$set(coupon, 'status', newStatus)
          }
        },
        err => {

        }
      )
    },
    anchorPointEvent(item) {
      console.log(item.modules_id)
      const currentModule = this.anchorPoint[item.modules_id]
      // !!临时test
      // const currentModule = this.anchorPoint['c-product-col1_1']
      console.log(currentModule)
      if (currentModule && currentModule.top) {
        this.currentModuleId = item.modules_id
        scroll.setScrollTop(this.scroller, currentModule.top)
      }
    },
    //  权益周期切换
    rightsTabBtnEvent(item, i) {
      this.$set(item, 'currentIndex', i)
    },
    handlerScroll(bind) {
      /* istanbul ignore else */
      (bind ? on : off)(this.scroller, 'scroll', this.onScroll)
    },
    onScroll(){

      const { scroller } = this
      const visibleHeight = scroll.getVisibleHeight(scroller)

      /* istanbul ignore next */
      if (!visibleHeight) {
        return
      }

      const scrollTop = scroll.getScrollTop(scroller)
      console.log(scrollTop)

      if (scrollTop > this.fixedLabel.top) {
        if (!this.isFiexd) this.isFiexd = true
      } else {
        if (this.isFiexd) this.isFiexd = false
      }


      this.selectAnchorPointItem(scrollTop)
    },

    // 跟进当前 scrollTop 计算当前锚点选中项
    selectAnchorPointItem(scrollTop) {
      let currentModuleId = this.currentModuleId
      for (let i = 0; i < this.anchorPointArray.length; i++) {
        let currVal = this.anchorPointArray[i]
        let nextVal = this.anchorPointArray[i + 1]
        if (scrollTop > currVal.top && scrollTop < nextVal.top) {
          currentModuleId = currVal.modules_id
          break
        }
      }
      if (currentModuleId !== this.currentModuleId) {
        this.currentModuleId = currentModuleId
      }
    },

    getMemberCenterData(){
      this.$api.getMemberCenter({
        //
      }, res => {

        const { topic_id = 0, user_info = {}, list = [], recommend_list =[], tips = '' } = res.data
        if (tips) {
          this.tips = tips
        }
        this.timestamp = res.timestamp // 当前服务器时间

        let coupon_num = user_info.can_receive_coupon_num
        let coupon_num_text = '待领券'
        if (coupon_num == 0) {
          coupon_num = user_info.received_coupon_num
          coupon_num_text = '已领券'
        }

        this.userCardInfo = {
          ...user_info,
          coupon_num,
          coupon_num_text,
          expire_date: user_info.expire_date,
          total_discount_amount: dealPrice(user_info.total_discount_amount || '0'),
        }

        let anchorPoint = {}
        // const temp = ['','c-product-col1_1', 'c-product-col2_2']
        this.recommendList = (recommend_list || []).map((item, index) => {
          if (index == 0) {
            anchorPoint['one-module'] = {}
          }
          // if (item.modules_id && index != 0 && temp[index]) {
          //   anchorPoint[temp[index]] = {}
          // }
          if (item.modules_id && index != 0) {
            anchorPoint[item.modules_id] = {}
          }

          return {
            ...item,
            modules_id: index == 0 ? 'one-module' : item.modules_id,
          }
        })

        this.anchorPoint = anchorPoint
        const templist = user_info.agreement_status == 1 ? list.gift_list : list
        let dealSuccess = {}
        if (user_info.agreement_status == 1) {
          dealSuccess = this.dealRightsListData(list)
        } else {
          dealSuccess = this.dealNotOpenRightsListData(list)
        }


        this.gftList = dealSuccess.list

        const that = this
        this.$nextTick(function () {
          // console.log(that.$refs)
          that.dealModuleRefs()
        })

        if (topic_id) {

          this.topic_id = topic_id// '56df3f5d913b52c9431c1fa384d39bc9'// topic_id

          this.gettopic()
        }
      })
    },
    dealNotOpenRightsListData(list = []) {

      // const dealList = (list || []).map((item) => {
      //   return {
      //     list: item.gift_list,
      //   }
      // })

      const dealSuccess = this.dealRightsListData(list)

      return {
        list : dealSuccess.list,
      }

    },
    // 处理已开通会员展示的券列表
    dealRightsListData(list = []) {

      const couponStatus = ['领取', '已领取', '已过期', '待生效']

      const rightsListData = (list || []).map((item, index) => {
        let currentIndex = 0
        const tempList = (item.list || []).map((childItem, childIndex) => {
          if (childItem.is_current) {
            currentIndex = childIndex
          }

          let cycleStatus = {
            text: '',
            code: 0,
          }

          let tipText = ''

          const { end_time = 0, start_time = 0 } = childItem
          if (this.timestamp > end_time) {
            cycleStatus.text = '已结束'
            cycleStatus.code = 3
            tipText = `${childItem.title}领券时间已截止`
          } else if(this.timestamp < start_time) {
            cycleStatus.text = '待开放'
            cycleStatus.code = 2
            const laveTime = start_time - this.timestamp
            let day = formatCountDown(laveTime*1000, 'd')
            if (laveTime % 86400){
              day = Number(day) + 1
            }
            tipText = `距离${childItem.title}神券开放领取还有<em>${day}</em>天`
          } else {
            cycleStatus.text = '可领券'
            cycleStatus.code = 1
            const laveTime = end_time - this.timestamp
            let day = formatCountDown(laveTime*1000, 'd')
            if (laveTime % 86400){
              day = Number(day) + 1
            }
            tipText = `本期领券时间剩余<em>${day}</em>天`
          }

          if (this.userCardInfo.agreement_status !== 1) {
            cycleStatus.text = '待开放'
            cycleStatus.code = 2
            tipText = '需续费后才生效哦~'
          }

          const tempCouponList = (childItem.list || []).map((coupon, i) => {
            let status = coupon.status != null ? coupon.status : 3
            return {
              ...coupon,
              valueText: dealPrice(coupon.value, 100, false),
              status: {
                statusCode: status,
                statusText: couponStatus[status],
              },
            }
          })

          return {
            ...childItem,
            list: tempCouponList,
            tipText,
            cycleStatus, //可领券 已结束 待开放
          }
        })
        return {
          ...item,
          list: tempList,
          currentIndex,
        }
      })

      return {
        list: rightsListData,
      }

    },
    gettopic() {
      this.$api.getNewTopicInfo(
        {
          code: this.topic_id,
        },
        res => {
          this.modulesList = this.dealModuleList(res.data.list)

          const that = this
          this.$nextTick(function () {
            // console.log(that.$refs)
            that.dealModuleRefs()
          })
        },
        err => {
          return true
        }
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

      console.log('this.anchorPoint:', this.anchorPoint)
      console.log('this.anchorPointArray:', this.anchorPointArray)


    },

  },
}
</script>
<style lang="stylus" scoped>


.is-header .is-fixed{
  top: 44px;
}

.member-header{
  width: 100%;
  background: url('https://img1.haoshiqi.net/miniapp/vip-header-bg_5848831894.png') no-repeat top center;
  background-size: 100% auto;
  padding-top: 30px;

}
/* card */
.member-card{
  position: relative;
  width: 314px;
  height: 171px;
  background: url('https://img1.haoshiqi.net/miniapp/vip-card_303e9030e9.png') no-repeat top center;
  background-size: 100% 100%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 10px 10px 0 0;


  .user-info{
    display: flex;
    align-items: center;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 20px;
    position: relative;
    .user-pic{
      width: 40px;
      height: 40px;
      border: 1px solid #fff;
      border-radius: 100%;
      overflow: hidden;
      background-color: #ccc;
      img{
        width: 40px;
        height: 40px;
        border-radius: 100%;
        overflow: hidden;
      }
    }

    .user-detail {
      flex: 1;
      margin-left: 9px;
      transform: translateY(2px);
      overflow: hidden;
      .user-name{
        font-size: 16px;
        color: #5E3C02;
        margin-right: 85px;
      }
      .vip-end-time{
        font-size: 12px;
        color: #5E3C02;
        span{
          vertical-align: middle;
        }
        .vip-rule{
          display: inline-block;
          width: 22px;
          height: 22px;
          margin-left: 5px;
          vertical-align: middle;
          background: url('https://img1.haoshiqi.net/miniapp/icon-rule_6bf757e3b3.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
  }

  .renewalfee-entr-btn{
    position: absolute;
    right: 10px;
    top: 15px;
    width: 80px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    background-image: linear-gradient(-90deg, #F5DCA8 19%, #FDF4E2 83%);
    box-shadow: 0 2px 4px 0 #DCBA75;
    border-radius: 5px;
    font-size: 14px;
    color: #5E3C02;
  }

  .member-status{
    display: flex;
    align-items: center;
    margin-top: 20px;

    .member-status-item{
      flex: 1;
      text-align: center;
      padding: 5px 0;

      &:first-child{
        border-right: 1px solid rgba(97,61,0,0.12);
      }
    }
    .member-status-item span{
      font-size: 18px;
      color: #5E3C02;
      font-weight: bold;
    }
    .member-status-item p{
      font-size: 14px;
      color: #5E3C02;
      margin-top: 10px;
      em{
        font-style: normal;
        vertical-align: middle;
      }
      i.left-arrow{
        display: inline-block;
        width: 8px;
        height: 8px;
        border-top: 1px solid #5E3C02;
        border-right: 1px solid #5E3C02;
        transform: rotate(45deg);
        vertical-align: middle;
      }
    }
  }


}

.privilege-box{
  height: 67px;
  overflow :hidden;
}
.privilege-content{
  width: 100%;
  padding-top: 5px;
  height: 67px;

  &.is-fixed{
    background-color: #fff;
  }
}
.privilege-list{
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  align-items: top;
  padding-left: 15px;
  .privilege-item{
    flex-shrink: 0;
    text-align: center;
    width: 69px;
    position: relative;
    padding-bottom: 10px;
    .privilege-icon{
      width: 35px;
      height: 35px;
      margin: 0 auto;
    }

    .privilege-name{
      font-size: 11px;
      color: #333;
      font-weight: bold;
      margin-top: 5px;
    }

    @media screen and (max-width: 320px) {
      .privilege-name{
        font-size: 9px;
      }
    }

    .privilege-tag{
      position: absolute;
      left: 10%;
      bottom: 5px;
      width: 80%;
      height: 1px;
      background-image: linear-gradient(-270deg, rgba(94,60,2,0.00) 0%, rgba(94,60,2,0.79) 14%, #5E3C02 51%, rgba(94,60,2,0.93) 86%, rgba(94,60,2,0.00) 100%);


      &::before{
        content: "";
        display: block;
        width: 0;
        height: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #000;
      }
    }
  }
}

.rights-list-header{
  padding: 0 12px;
  margin-top: 10px;
  .rights-title{
    display: flex;
    align-items: center;
    height: 46px;
    border-bottom: 1px solid #DEDEDE;
    p{
      flex:1;
      font-size: 18px;
      color: #000000;
    }
    span{
      font-size: 14px;
      color: #666666;
    }
  }

  .rights-tip{
    display: flex;
    align-items: center;
    height: 42px;
    .icon-laba{
      display: inline-block;
      width: 20px;
      height: 16px;
      background-color:#ccc;
    }
    p{
      flex:1;
      font-size: 14px;
      color: #333333;
      margin-left: 10px;
    }
  }
}

.rights-coupon-box{
  margin-bottom: 20px;
  .rights-item{
    background: #FFFFFF;
    box-shadow: 0 9px 8px 0 #F6EBD9;
    border-radius: 15px;
    overflow: hidden;
    .rights-cycle-header{
      height: 58px;
      background-color: #F5DDAE;
      // padding: 8px 10px 0 10px;
      padding-top:8px;
      position: relative;
      border-bottom: 1px solid #EBCD8D;
      .rights-cycle-list{
        display: flex;
        padding: 0 5px;
        position: relative;
        margin-bottom: -2px;
        .cycle-item{
          flex: 1;
          max-width: 25%;
          line-height: 20px;
          text-align: center;

          color: #C66F00;
          padding: 0 5px;
          .cycle-item-content{
            border-radius: 8px 8px 0 0;
            background-color: rgba(255,255,255,0.27);
            height: 49px;
            padding-top: 6px;
            span{
              display: block;
              font-size: 14px;
            }
            i{
              display: inline-block;
              font-size: 12px;
              &.cur{
                display: inline-block;
                background-color: #000;
                line-height: 18px;
                color: #fff;
                padding: 0 5px;
                border-radius: 10px;
              }
            }
          }

          &.active .cycle-item-content{
            background-color: #fff;
            color: #333;
          }
        }
      }


    }

    .rights-coupon-list{

      .rights-coupon-item{

        .rights-coupon-tip{
          font-size: 14px;
          color: #333333;
          line-height 20px;
          padding: 14px;
          text-align: center;
          >>>em{
            font-size: 16px;
            font-weight: bold;
            color: #f00;
            font-style: normal;
            margin: 0 5px;
          }
        }
        .rights-coupon-content{
          overflow: hidden;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;

          .coupon-item{
            width: 157px;
            height: 60px;
            display: flex;
            margin-bottom: 20px;
            border-radius: 4px;
            overflow: hidden;
            .coupon-left{
              color: #98650C;
              background-color: #FAF3E7;
              height: 100%;
              flex: 1;
              text-align: center;
              .coupon-price{
                font-size: 18px;
                font-weight: bold;
                margin-top: 2px;
                em{
                  font-style: normal;
                  font-size: 30px;
                  margin-right: 3px;
                }
              }
              .coupon-sub{
                font-size: 12px;
                color: #98650C;
              }
            }

            .coupon-right{
              font-size: 18px;
              width: 68px;
              padding-left: 4px;
              background: url('https://img1.haoshiqi.net/miniapp/icon-voucher_dde4223333.png') repeat-y left top;
              background-size: 4px auto;
              background-color: #F3D294;
              color: #5E3C02;
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
            }

            &.invalid{
              .coupon-left{
                background-color: #F5F5F5;
                color: #999999;
              }
              .coupon-right{
                background-color: #E9E9E9;
                color: #999999;
              }
            }

          }

        }

      }

    }


  }


}

.dwd-popup{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;

  .dwd-popup-mask{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.7)
  }

  .dwd-popup-content{
    top: 110%;
    left: 50%;
    position: fixed;
    max-height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    background-color: #fff;
    -webkit-overflow-scrolling: touch;
    z-index: 1;

    transition-property: all;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
    &.dwd-popup--center {
      -webkit-transform: translate3d(-50%, -50%, 0);
      transform: translate3d(-50%, -50%, 0);
    }
    &.show{
      top: 50%;
    }
  }

}

.rule-popup-conent{
  width: 80%;
  height: 363px;

  background-color: #F4F1EC !important;
  border-radius: 12px;
  padding: 10px;

  .rule-title{
    font-size: 20px;
    color: #333333;
    text-align: center;
    margin: 15px 0;
  }
  .rule-conent{
    border: 1px solid #D9BC8C;
    border-radius: 8px;
    height: 205px;
    padding: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    background: url('https://img1.haoshiqi.net/miniapp/vip-rule-bg_ccec0389c6.png
') no-repeat right bottom #fff;
    background-size: 80% auto;

    .rule-html{
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
  }

  .rule-tel{
    font-size: 10px;
    color: #98650C;
    text-align: center;
    margin: 15px 0;
    a{
      color: #0071FF;
    }
  }

  .rule-btn{
    width: 100%;
    height: 40px;
    line-height : 40px;
    background: #333333;
    text-align: center;
    color: #fff;
    border-radius: 20px;
  }


}

</style>

