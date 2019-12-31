<template>
  <div>
    test-msg
    <div class="demo-block">
      <div class="demo-title">sku test</div>
      <div class="demo-content">
        <div>
          <input v-model="msg" class="demo-inpu-text" type="text" placeholder="msg">
        </div>

        <button class="test-btn" @click="sendEvent">发送消息</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'test-msg',

  data() {
    return {
      msg: '',
    }
  },
  methods: {
    sendEvent() {

      console.log(this.msg)
      // alert(wx)
      // wx.miniProgram.navigateBack({delta: 0});
      // wx.miniProgram.postMessage({ data: {msg: this.msg} });

      // wx.miniProgram.navigateTo({url: '/index/index'})
      // location.href = location.href
      // this.$forward('index')

    },
  },
}
</script>
<style lang="stylus" scoped>

.demo-block{
  padding: 12px;
}
.demo-block .demo-title{
  font-size:16px;
  color: #333;
}
.demo-block .demo-content{
  padding: 20rpx 10rpx;
  border: 1px solid #ccc;
}
.test-btn{
  display: inline-block;
  height: 30px;
  line-height: 30px;
  width: 100px;
  background-color: #999;
  color: #fff;
  margin-top: 10px;
}

</style>
