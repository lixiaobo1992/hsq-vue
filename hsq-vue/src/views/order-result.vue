<template>
  <dwd-page is-header>
    <div class="page page-result">
      <div class="result-desc" :class="[higePage ? 'hidden' : '']">
        <div class="result-tit">
          <img src="https://img1.haoshiqi.net/miniapp/icon-success_0ad47518c9.jpg" class="icon">
          <div class="order-status-text">支付成功</div>
        </div>
        <div v-if="payPrice" class="price">￥{{ payPrice }}</div>
        <div class="btn-box block-center">
          <div class="btn-sure" @click="goContinue">
            继续购物
          </div>
          <div class="btn-info" @click="goOrderlist">
            查看订单
          </div>
        </div>
      </div>

      <!-- 专题 -->
      <div v-for="item in modulesList" :key="item.id" class="tpl-modules module-item" :data-type="item.type">
        <dwd-modules :data="item" />
      </div>
    </div>
  </dwd-page>
</template>
<script>
import device from '@dwdjs/utils/lib/device'
import modules from '@/components/modules/index'
import { dealPrice } from '@/utils'
import { loadJs } from '@/utils/dload'
import env from '@/config/env'
import ModuleMixin from '@/mixins/dealModule'

export default {
  components: {
    [modules.name]: modules,
  },

  data() {
    return {
      payPrice: 0,
      higePage: true,
      modulesList: [],
      topic_id:0,
      isHSQ: device.hsq,
    }
  },

  created() {
    const { id = '' } = this.$route.query
    const that = this
    if (!id) {
      setTimeout(() => {
        this.$showToast('参数错误, 返回首页')
      }, 300)
      setTimeout(() => {
        this.$forward('index')
      }, 2000)
      return
    }
    this.refresh()
  },
  methods: {
    ...ModuleMixin,
    refresh() {
      this.getOrderResult()
    },
    getOrderResult() {
      let { id = '', token = '' } = this.$route.query
      id = decodeURIComponent(id)
      id = id.split('?')
      // 这里最后调用一个接口获得
      this.$api.getOrderResult(
        {
          orderIds: id[0],
          token,
        },
        res => {
          const totalPrice = res.data.totalPrice ? res.data.totalPrice : 0
          this.payPrice = (totalPrice / 100).toFixed(2)
          this.higePage = false
          // this.topicId = res.data.topicId;
          if(res.data.topicId) {
            this.gettopic(res.data.topicId)
          }
        },
        err => {}
      )
    },
    goContinue() {
      //gat 去专题页,其余去首页
      if(env.isChannel('guanaitong')) {
        location.href='https://topic.doweidu.com/?id=2d0d821ba4d166914ccff48136ccae69&origin=hsq_h5'
      } else {
        this.$forward('index')
      }
    },
    goOrderlist() {
      this.$forward('order-list')
    },
    //取专题接口
    gettopic(id) {
      let topic_id = id
      this.$api.getNewTopicInfo(
        {
          code: topic_id,
        },
        res => {
          // debugger;
          this.modulesList = this.dealModuleList(res.data.list)
        },
        err => {}
      )
    },
  },
}
</script>
<style lang="stylus" scoped>
.page {
  height: 100vh;
  background: #fff;
  text-align: center;
  padding: 40px 0 0;
}

.hidden {
  display: none;
}

.result-tit .icon {
  display: block;
  margin: 0 auto 10px;
  width: 120px;
  height: 120px;
}

.order-status-text {
  font-size: 16px;
  color: #000;
}

.price {
  margin: 10px 0;
  font-size: 27px;
  color: #333;
  font-weight:bold;
}

.btn-info,
.btn-sure {
  font-size: 12px;
  border: 1px solid #CDCDCD;
  border-radius: 13px;
  padding: 0 15px;
  height: 26px;
  line-height: 26px;
}
.btn-info {
  margin-left: 15px;
  color: rgb(167, 157, 157);
}
.btn-sure {
  color: #F73552;
  border-color: #F73552;
}

.btn-box {
  margin-top: 40px;
  display:flex;
  flex-direction:row;
  justify-content: center;
}
.module-item {
  margin-top:10px;
}
.tpl-modules {
  overflow: hidden
}
</style>
