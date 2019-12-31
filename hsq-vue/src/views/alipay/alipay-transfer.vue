<template>
  <div class="page">
    <!-- <div class="page-transfer ">
      <img src="~assets/img/transfer_bows.png" alt="" v-if="!isWechat">
      <img src="~assets/img/transfer_wechat.png" alt="" v-else>
    </div> -->
    <div v-if="isWechat" class="mask">
      <img src="~assets/img/zl-mask.png" alt="">
    </div>
    <div class="title">
      <img src="~assets/img/zl-title.png" alt="">
    </div>
    <div class="icon-image">
      <img src="~assets/img/zl-image.png" alt="">
    </div>
    <div class="title-1">
      一波商品免费领取，帮我助力吧~
    </div>
    <div class="btn-block">
      <div class="btn" @click="forwardAlipay">
        打开支付宝
      </div>
    </div>
  </div>
</template>

<script>
import device from '@dwdjs/utils/lib/device'

// console.log(device);

export default {
  components: {},

  filters: {},

  data() {
    return {
      isWechat: false,
    }
  },

  computed: {},

  created() {
    console.log('device.wechat', device.wechat)
    if (device.wechat || device.qq) {
      this.isWechat = true
    } else {
      this.isWechat = false
      this.forwardAlipay()
    }
  },

  mounted() {},

  methods: {
    forwardAlipay() {
      window.location.href =
        'alipays://platformapi/startApp?appId=2017112000051610&page=pages%2Findex%2Findex%3Fjumplink%3Dzl-invite%3Feid%3D' +
        this.$route.query.eid +
        '%26minishare%3D1'
    },
  },
}
</script>

<style lang="stylus" scoped>
.page-transfer img{
  width 100%
  display block
}
.title{
  width: 100%;
  margin: 45px 0;
}
.title img{
  width: 280px;
  display: block;
  margin: auto;
}
.icon-image{
  width 100%
  margin-bottom 55px
}
.icon-image img{
  width: 185px;
  height: 185px;
  display: block;
  margin: auto;
}
.title-1{
  text-align: center;
  font-size: 17px;
  line-height: 24px;
}
.btn-block{
  width: 100%;
  padding: 0 15px;
  text-align: center;
  margin-top: 15px;
}
.btn{
  background-color: #FD4C3C;
  line-height: 44px;
  border-radius: 4px;
  font-size: 17px;
  color: #fff;
}
.mask{
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.8);
}
.mask img{
  width: 100%;
  display: block;
}
</style>
