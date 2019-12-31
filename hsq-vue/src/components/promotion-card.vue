<template>
  <div class="promotios">
    <div v-if="promotions.length" class="new-mask" @click="handlePromotion('close')" />
    <div class="new-container new-container-ani">
      <div class="container-title">{{ promotionTitle ? promotionTitle : '优惠信息' }}</div>
      <div class="container-content">
        <div v-for="(item, index) in promotions" :key="index" class="container-content-item">
          <div class="title">{{ item.title }}</div>
          <div v-if="!type" class="desc">{{ item.text }}</div>
          <div v-else class="desc">
            <span v-for="(textItem, index) in item.text" :key="index">
              <span>{{ textItem.first }}</span>
              <span>{{ textItem.second }}</span>
              <span v-if="textItem.text.length - 1 !== index">,</span>
            </span>
          </div>
        </div>
      </div>
      <div class="btn-know" @click="handlePromotion('close')">确认</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    promotions: {
      type: Array,
      require: true,
    },
    promotionTitle: {
      type: String,
      require: false,
    },
    type: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {}
  },

  created() {},
  methods: {
    handlePromotion(type) {
      console.log('关闭优惠券弹层')
      this.$emit('handlePromotion', { type })
    },
  },
}
</script>
<style lang="stylus" scoped>
.new-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.new-container {
  background-color: #fff;
  z-index: 1000;
  position: fixed;
  left: 0;
  width: 100%;
  bottom: -100%;
  height: 50%;
  transition: bottom 0.5s;
  font-size: 14px;
  color: rgb(33, 33, 33);
}

.new-container-ani{
  bottom: 0%;
}

.container-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin: 0 15px;
  border-bottom: 1px solid rgb(226, 226, 226);
  font-size: 19px;
  color: #212121;
}

.container-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 15px;
}

.container-content-item {
  display: flex;
  padding-bottom: 10px;
  flex-direction: row;
  font-size:15px;
}

.container-content-item .title {
  min-width: 80px;
  color:rgb(237, 0, 0);
  line-height:20px;
  margin-right:5px;
  white-space: nowrap;
}

.container-content-item .desc {
  color: #212121;
  display:inline-block;
  line-height:20px;
  text-align:left;
}

.btn-know {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10001;
  height: 49px;
  background-color: rgb(237, 0, 0);
  color: white;
  font-size: 17px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
