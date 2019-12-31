<template>
  <div class="layout-column2">
    <div class="title">{{ coupleTitle }}：</div>
    <div class="content nowrap">
      <div v-for="(item, index) in couponList" :key="'box' + index" class="item">
        <span class="text">{{ item.coupon_desc }}</span>
      </div>
    </div>
    <!-- <image class="more" src="https://img1.haoshiqi.net/wxapp/img/more_85508a3b09.png" mode="aspectFill" /> -->
    <img src="https://img1.haoshiqi.net/wxapp/img/more_85508a3b09.png" class="more">
  </div>
</template>
<script>
export default {
  name: 'coupon',
  // data() {
  //   return {
  //     list: '',
  //   };
  // },
  props: {
    couponList: {
      type: Array,
      // required: true,
    },
    coupleTitle: {
      type: String,
      default: '领券',
    },
  },
}
</script>
<style lang="stylus">
/* 领取优惠券 */
.layout-column2 {
  position: relative;
  display: flex;
  padding: 14px 10px;
  background-color: #fff;
  font-size: 12px;
  align-items: center;
  overflow: hidden;
}
.layout-column2 .title{
  align-self: flex-start;
  flex-shrink: 0;
  flex-grow: 0;
  white-space: nowrap;
  color: #333;
  margin-top:3px;
}
.layout-column2 .content{
  flex: 1;
  overflow: hidden;
}
.layout-column2 .more{
  justify-self: flex-end;
  flex-shrink: 0;
  flex-grow: 0;
  width: 18px;
  height: 18px;
}

.layout-column2 .item {
  display: inline-block;
  margin-left:7.5px;
  white-space: nowrap;
  color: #fff;
  background: #FB0438;
}
.layout-column2 .item .text{
  font-size:10px;
  padding: 0 5px;
  position:relative;
  height:15px;
  line-height:15px;
  display:block;
  overflow:hidden;
}
.layout-column2 .item .text::before{
  content: '';
  display:block;
  position:absolute;
  left:0;
  top:0;
  width:0;
  height:0;
  border-top:8px solid transparent;
  border-bottom:8px solid transparent;
  border-left:2.5px solid #fff;
  z-index:2;
}
.layout-column2 .item .text::after{
  content: '';
  display:block;
  position:absolute;
  right:0;
  top:0;
  width:0;
  height:0;
  border-top:8px solid transparent;
  border-bottom:8px solid transparent;
  border-right:2.5px solid #fff;
  z-index:2;
}
</style>
