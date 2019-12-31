<template>
  <div class="box">
    <span class="overlay" @click="onClose" />
    <div class="popup-box">
      <span class="title">优惠券</span>
      <span class="close-box" @click="onClose">
        <img src="~assets/img/close.png" class="close-img">
      </span>
      <div class="popup-box-list">
        <span class="list-title">可领取的优惠券</span>
        <div
          v-for="(item, index) in coupon"
          :key="'item' + index"
          class="popup-box-item flex-between"
        >
          <div class="pc-info">
            <div class="pc-tit">
              <span class="pc-num">¥{{ item.value }}</span>
              <span class="pc-text">{{ item.title }}</span>
            </div>
            <span class="pc-desc">{{ item.subTitle }}</span>
            <span class="pc-time">{{ item.time }}</span>
          </div>
          <span
            class="pc-btn"
            :class="[!item.isRedeem ? 'disabled' : '']"
            @click.stop="getCoupon(item, index)"
          >{{ !item.isRedeem ? '已领取' : '立即领取' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'coupon-list',
  props: {
    coupon: {
      type: Array,
      require: true,
    },
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    getCoupon(item, index) {
      this.$emit('getCoupon', item, index)
    },
  },
}
</script>
<style lang="stylus" scoped>

.overlay {
  z-index: 60;
  background: rgba(0,0,0,0.5);
}
.popup-box {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 120;
  width: 100%;
  min-height: 70%;
  background: #fff;
}
.popup-box .title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  line-height:48px;
  text-align: center;
  font-size:16px;
  color:#333;
  box-shadow: 0 2px 4px 0 rgba(115,115,115,0.50);
}
.popup-box .close-box{
  width:24px;
  height:24px;
  border-radius:50%;
  position: absolute;
  top: 13px;
  right: 15px;
  border:1px solid #333;
  display:flex;
  justify-content: center;
  align-items: center;
  /* background: url('../../img/icon_search.png'); */
}
.popup-box .close-img{
  width:12px;
  height:12px;
}
.popup-box-list {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 40px;
  padding: 12px;
  overflow-x: hidden;
  overflow-y: auto;
}
.popup-box-list .list-title{
  color:#333;
  font-weight:bold;
  display:block;
  height:17px;
  line-height:17px;
  margin-bottom:20px;
  font-size:12px;
}
.popup-box-item {
  margin: 10px 0;
  padding:6px 7px;
  border-bottom: 1px solid #f7f7f7;
  border-radius:5px;
  background: rgba(251,4,56,0.05);
}
.popup-box-item:first-child{
  margin-top:10px;
}
.pc-info{
  border-right:1px dotted #EA594C;
  padding:6px;
  position: relative;
}
.pc-info:after{
  content:'';
  position:absolute;
  bottom:-8px;
  right:-8px;
  width:16px;
  height:8px;
  background-color:#fff;
  border-radius:8px 8px 0 0;
}
.pc-info:before{
  content:'';
  position:absolute;
  top:-8px;
  right:-8px;
  width:16px;
  height:8px;
  background-color:#fff;
  border-radius:0 0 8px 8px;
}
.popup-box .pc-tit {
  font-weight: 500;
  color: #EA594C;
  width:216px;
  height:36px;
  line-height:36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.popup-box .pc-text {
  font-size: 14px;
  margin-left: 4px;
  color: #EA594C;
  font-weight: normal;
  width:100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.popup-box .pc-num{
  font-size: 30px;
}
.popup-box .pc-desc {
  margin: 4px 0;
  font-size: 12px;
  color: #EA594C;
  display:block;
}
.popup-box .pc-time {
  font-size: 12px;
  color: #EA594C;
}
.popup-box .pc-btn {
  background:#EA594C;
  color: #fff;
  border-radius: 17px;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  width:81px;
  text-align:center;
}
.popup-box .pc-btn.disabled {
  background-color: #fff;
  box-shadow: 0 2px 4px 0 #F8B5AF;
  color:#FB0443;
}
.popup-box .close {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: #ed0000;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 16px;
}
.pop-suc{
  background: rgba(0,0,0,0.80);
  border-radius:5px;
  width:172px;
  height:86px;
  display:flex;
  flex-direction: column;
  justify-content: center;
  position:fixed;
  left:0;
  right:0;
  margin:43px auto;
  top:50%;
  z-index:999;
}
.pop-suc .icon-suc{
  width:33px;
  height:33px;
  display:block;
  margin: 0 auto;
}
.pop-suc .sub-text{
  font-size:16px;
  height:22px;
  line-height:22px;
  color:#fff;
  text-align:center;
  margin-top:5px;
}
</style>
