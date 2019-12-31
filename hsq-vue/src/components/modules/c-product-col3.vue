<template>
  <dwd-tpl class="c-product-col3" :data="data" :data-type="data.type">
    <div class="col3-box">
      <div
        v-for="(item, index) in data.list"
        :key="index"
        class="row3-box"
        :data-id="item.biz_id"
        :data-bought="item.can_bought"
        :data-index="index"
        @click="goDetail(item)"
      >
        <div class="row3-container">
          <div class="row3-img-box">
            <!-- 商品图片 -->
            <img class="row3-img" :src="item.thumbnail">
            <!-- 商品状态 -->
            <img
              v-if="!item.left_stock || !item.can_bought"
              class="row3-status-img"
              src="https://img1.haoshiqi.net/miniapp/img/sold_a64f1921fd.png"
            >
            <!-- <img class="row3-status-img" src="" alt=""> -->
          </div>
          <div class="row3-text-box">
            <p class="row3-title max-line-2">{{ item.title }}</p>
            <div class="row3-price-box">
              <span class="row3-price">
                <span class="price-integer">￥{{ item.price.price_yuan }}</span>
                <span class="price-decimals">.{{ item.price.price_fen }}</span>
              </span>
              <div v-if="item.member_price > 0" class="row-vip-price">
                <div class="vip-bg"><img src="https://img1.haoshiqi.net/miniapp/vip-icon_1be7bb7dd2.png" class="img-vip">
                </div>
                <span class="vip-price">￥{{ item.member_price }}</span>
              </div>
              <span v-else class="row3-market">￥{{ item.market_price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dwd-tpl>
</template>

<script>
import Tpl from './tpl'

export default {
  name: 'c-product-col3',
  components: {
    [Tpl.name]: Tpl,
  },
  props: {
    data: {
      type: Object,
    },
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
.c-product-col3{
  width: 100%;
  overflow: hidden;
  padding: 0 10px;
  .col3-box{
    display: flex;
    position: relative;
    flex-wrap: wrap;
    margin-bottom: -.5%;
    .row3-box{
      width: 33.3%;
      margin-top: 5px;
      position: relative;
      line-height: 0;
    }
    .row3-container{
      background: #fff;
      min-height:202px;
    }
    .row3-img-box{
      position: relative;
      width: 100%;
      padding-bottom: 100%;
    }
    .row3-img{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .img-label{
      position: absolute;
      top: 0;
      left: 0;
      width: 117px;
      height: 117px;
      z-index: 2;
      overflow: hidden;
      .icon-img{
        width: 100%;
      }
    }
    .row3-tag-img{
      position: absolute;
      left: 2px;
      top: 0;
      width: 24px
      height: 24px
    }
    .row3-status-img{
      position: absolute;
      width: 40%;
      height: 40%;
      left: 30%;
      top: 30%;
    }
    .row3-text-box{
      padding: 0px 5px
    }
    .row3-title{
      margin-top: 5px
      color: rgb(0, 0, 0)
      font-size: 12px
      line-height: 16px
      height: 32px
      text-align:left
    }
    .row3-price-box{
      white-space: nowrap;
      padding: 5px 0;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align:left;
    }
    .row3-price{
      color: #F21833;
      line-height: 22px;
      .price-integer{
        font-size: 16px;
        height: 22px;
        font-weight: bold;
      }
      .price-decimals{
        font-size: 10px;
      }
    }
    .row3-market{
      font-size: 10px
      color: #999999
      text-decoration: line-through
      display:block
      margin-top:10px
    }
  }
}
/* 会员价 */
.row3-price-box .row-vip-price{
  display:block;
  font-size:12px;
  transform :scale(0.85);
  line-height:22px;
  transform-origin: left
}
.row3-price-box .vip-bg{
  background: #333;
  line-height:12px;
  display:inline-block;
  border-top-left-radius:2px;
  border-bottom-left-radius:2px;
}
.row3-price-box .img-vip{
  width:12px;
  height:12px;
  border-radius: 2px;
  display:inline-block;
}
.row3-price-box .vip-price {
  font-size:12px;
  color:#333;
  background: #FDFBEB;
  height:12px;
  padding:0 2px;
  border-radius:2px;
}
</style>
