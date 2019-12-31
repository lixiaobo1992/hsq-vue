<template>
  <div class="row2-box">
    <div class="row2-container">
      <div class="row2-img-box">
        <img class="row2-img" :src="data.image">
        <!-- <img class="row2-tag-img" src=""/> -->
        <!--  -->
        <div class="img-label">
          <!-- <img
            class="icon-img"
            :style="{ width: item.sub_icon.w + 'px' }"
            :src="item.sub_icon.url"
          /> -->
        </div>
        <!-- 商品状态 -->
        <img
          class="row2-status-img"
          src="https://img1.haoshiqi.net/miniapp/img/sold_a64f1921fd.png"
        >
      </div>
      <div class="row2-text-box">
        <p class="row2-title max-line-2">
          <span v-if="data.merchant_type == 2" class="title-tag">自营</span>
          {{ data.title }}
        </p>
        <span
          v-for="(tagData, index) in data.tags"
          :key="index"
          class="row2-text-tag"
          :style="{ background: tagData.background }"
        >{{ tagData.text }}</span>
        <p class="row2-price-box">
          <span class="row2-price">
            <span class="price-integer">￥{{ data.price[0] }}</span>
            <span class="price-decimals">.{{ data.price[1] }}</span>
          </span>
          <span class="row2-market">￥{{ data.marketPrice }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vue-list-item',
  props: {
    data: Object,
  },
  beforeMount() {
    console.log(this.data)
  },
  methods: {
    goNext(e) {
      const { id } = e.currentTarget.dataset
      // debugger
      this.$forward('couple_detail', { id })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../style/var';

.row2-box{
  width: 175px;
  float: left;
  box-sizing: border-box;
  padding-bottom: 5px;
  border-radius: 5px;
}
.row2-box:nth-of-type(odd){
  margin-right: 5px;
}
.row2-container{
  width: 175px;
  background: #fff;
  border-radius: 5px;
}
.row2-img-box{
  position: relative;
  width: 175px;
  padding-bottom: 100%;
  border-radius: 5px;
}
.row2-img{
  position: absolute;
  border-radius: 5px 5px 0 0;
  left: 0;
  top: 0;
  width: 175px;
  height: 175px;
}
.img-label{
  position: absolute;
  top: 0;
  left: 0;
  width: 175px;
  height: 175px;
  z-index: 2;
  overflow: hidden;
  .icon-img{
    width: 100%;
  }
}
.row2-tag-img{
  position: absolute;
  left: 2px;
  top: 0;
  width: 28px
  height: 28px
}
.row2-status-img{
  position: absolute;
  width: 40%;
  height: 40%;
  left: 30%;
  top: 30%;
}
.row2-text-box{
  margin-top: 10px;
  padding: 0 10px;
}
.row2-title{
  color: rgb(0, 0, 0)
  font-size: 14px
  line-height: 18px
  height: 36px;
  margin-bottom: 10px;
  .title-tag{
    height: 15px;
    line-height: 15px;
    padding: 0 7px;
    background: #F21833;
    color: #ffffff;
    font-size: 10px;
    border-radius: 2px;
  }
}
.row2-text-tag{
  height: 12px;
  border: 1px solid #EA594C;
  border-radius: 2px;
  padding: 0 4px;
  font-size: 10px;
}
.row2-price-box{
  white-space: nowrap;
  padding: 10px 0 5px 0;
  text-overflow: ellipsis;
  overflow: hidden;
}
.row2-price{
  display: inline-block;
  color: #FB0438;
  .price-integer{
    font-size: 20px;
    height: 28px;
    font-weight: bold;
  }
  .price-decimals{
    font-size: 12px;
  }
}
.row2-market{
  font-size: 10px
  margin-left: 5px;
  color: #999;
  text-decoration: line-through
}
</style>
