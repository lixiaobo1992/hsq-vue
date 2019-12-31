<template>
  <div class="pop-suc">
    <div>
      <img src="~assets/img/smile-icon.png" class="icon-suc">
    </div>
    <span class="sub-text">恭喜领取成功！</span>
  </div>
</template>
<script>
export default {
  name: 'conpon-toast',
}
</script>
<style lang="stylus" scoped>
.pop-suc{
  background: rgba(0,0,0,0.80);
  border-radius:5px;
  width:171px;
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
