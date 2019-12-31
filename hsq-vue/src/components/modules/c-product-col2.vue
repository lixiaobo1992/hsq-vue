<template>
  <dwd-tpl class="c-product-col2" :data="data" style="padding: 0 0.1rem" :data-type="data.type">
    <div class="col2-box">
      <div v-for="(item, index) in data.list" :key="index" class="row2-box" @click="goDetail(item)">
        <div class="row2-container">
          <div class="row2-img-box">
            <img class="row2-img" :src="item.thumbnail">
            <!-- <img class="row2-tag-img" src=""/> -->
            <!-- 商品状态 -->
            <img
              v-if="!item.left_stock || !item.can_bought"
              class="row2-status-img"
              src="https://img1.haoshiqi.net/miniapp/img/sold_a64f1921fd.png"
            >
          </div>
          <div class="row2-text-box">
            <p class="row2-title max-line-2">
              <span v-if="item.merchant_type == 2" class="title-tag">自营</span>
              {{ item.title }}
            </p>
            <div class="row2-tag-box">
              <span
                v-for="(tagData, tagIndex) in (item.tags).slice(0, 2)"
                :key="tagIndex"
                class="row2-text-tag"
                :style="{ color: tagData.color }"
              >
                {{ tagData.text }}</span>
            </div>
            <div v-if="item.expired_date_text_two" class="row-expire-day">
              <span class="row-left-day">{{ item.expired_date_text_two }}</span>
            </div>
            <div class="row2-price-box">
              <span class="row2-price">
                <span class="price-integer">￥{{ item.price.price_yuan }}</span>
                <span class="price-decimals">.{{ item.price.price_fen }}</span>
              </span>
              <div v-if="item.member_price > 0" class="row-vip-price">
                <div class="vip-bg"><img src="https://img1.haoshiqi.net/miniapp/vip-icon_1be7bb7dd2.png" class="img-vip">
                </div>
                <span class="vip-price">￥{{ item.member_price }}</span>
              </div>
              <span v-else class="row2-market">￥{{ item.market_price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dwd-tpl>
</template>

<script>
import Tpl from './tpl'
import device from '@dwdjs/utils/lib/device'
export default {
  name: 'c-product-col2',
  components: {
    [Tpl.name]: Tpl,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      expireVersionSts: false,
    }
  },
  created() {
    if (device.hsq) {
      if (this.$version.gt('3.9.0')) {
        this.expireVersionSts = true
      }
    } else {
      this.expireVersionSts = true
    }
  },
  methods: {
    goDetail(item) {
      this.data.eventClick(item)
    },
  },
}
</script>

<style lang="stylus" scoped>
// style
.c-product-col2{
  position: relative;
  overflow: hidden;
  .col2-box{
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .row2-box{
      width: 50%;
      box-sizing: border-box;
      padding-bottom: 5px;
      border-radius: 5px;
      &:nth-of-type(odd){
        padding-right: 3px;
      }
      &:nth-of-type(2n){
        padding-left: 3px;
      }
    }
    .row2-container{
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 5px;
    }
    .row2-img-box{
      position: relative;
      width: 100%;
      padding-bottom: 100%;
      border-radius: 5px;
    }
    .row2-img{
      position: absolute;
      border-radius: 5px 5px 0 0;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .img-label{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
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
      position: relative;
      height: 102px;
    }
    .row2-title{
      color: rgb(0, 0, 0)
      font-size: 14px
      line-height: 18px
      height: 36px;
      margin-bottom: 5px;
      text-align:left;
      .title-tag{
        height: 15px;
        line-height: 18px;
        padding: 0 7px;
        background: #EA594C;
        display: inline-block;
        color: #ffffff;
        font-size: 10px;
        border-radius: 2px;
      }
    }
    .row2-tag-box{
      width: 100%;
      overflow: hidden;
      height: 18px;
      display: flex;
      .row2-text-tag{
        line-height: 16px;
        border: 1px solid #EA594C;
        border-radius: 2px;
        color: #EA594C;
        padding: 0 4px;
        font-size: 10px;
        margin-right: 2px;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        min-width: 20px;
        &:first-child{
          flex-shrink: 0;
        }
      }
    }
    .row2-price-box{
      white-space: nowrap;
      padding: 10px 0 5px 0;
      text-overflow: ellipsis;
      overflow: hidden;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align:left;
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
  }
}
.row-expire-day{
  height:14px;
  line-height:14px;
  font-size:12px;
  transform :scale(0.85);
  color: #999999;
  width:100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align:left;
  transform-origin: left
}
/* 会员价 */
.row2-price-box .row-vip-price{
  display:inline-block;
  font-size:12px;
  line-height:22px;
  margin-left:5px;
}
.row2-price-box .vip-bg{
  line-height:12px;
  display:inline-block;
  border-top-left-radius:2px;
  border-bottom-left-radius:2px;
}
.row2-price-box .img-vip{
  width:12px;
  height:12px;
  border-radius: 2px;
  display:inline-block;
}
.row2-price-box .vip-price {
  font-size:12px;
  color:#333;
  background: #FDFBEB;
  height:12px;
  padding:0 2px;
  border-radius:2px;
}
</style>
