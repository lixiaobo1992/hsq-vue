<template>
  <dwd-tpl class="c-product-slider" :data="data" :data-type="data.type">
    <div class="slider-box" :class="data.bg.url ? 'padding10' : ''">
      <div class="slider-goods-box">
        <dl
          v-for="(item, index) in data.list"
          :key="index"
          class="goods-box"
          :data-index="index"
          :data-bought="item.can_bought"
          :data-id="item.biz_id"
          @click="goDetail(item)"
        >
          <dt class="goods-img-box">
            <img :src="item.thumbnail" class="img-box" alt="">
            <!-- 商品状态 -->
            <img
              v-if="!item.left_stock || !item.can_bought"
              class="row3-status-img"
              src="https://img1.haoshiqi.net/miniapp/img/sold_a64f1921fd.png"
            >
          </dt>
          <dd class="goods-text-box">
            <p class="goods-title max-line-2">{{ item.title }}</p>
            <span class="goods-price-box">
              <span class="price-integer">￥{{ item.price.price_yuan }}</span>
              <span class="price-decimals">.{{ item.price.price_fen }}</span>
            </span>
            <div v-if="item.member_price > 0" class="row-vip-price">
              <div class="vip-bg"><img src="https://img1.haoshiqi.net/miniapp/vip-icon_1be7bb7dd2.png" class="img-vip">
              </div>
              <span class="vip-price">￥{{ item.member_price }}</span>
            </div>
            <span v-else class="market-price">￥{{ item.market_price }}</span>
          </dd>
        </dl>
        <div
          v-if="data.more.link"
          class="more-box"
          :data-link="data.more.link"
          @click="$onUrlPage($event)"
        >
          <img :src="data.more.image.url" class="img-box" :style="{ width: data.more.image.w }">
        </div>
      </div>
    </div>
  </dwd-tpl>
</template>

<script>
import Tpl from './tpl'

export default {
  name: 'c-product-slider',
  components: {
    [Tpl.name]: Tpl,
  },
  props: {
    data: {
      type: Object,
    },
  },
  beforeMount() {
    console.log(this.data)
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
.padding10{
  padding-left: 10px;
}
.c-product-slider{
   width: 100%;
   overflow: hidden;
   .slider-box{
     width: 100%;
     overflow: hidden;
     .slider-goods-box{
       width: auto;
       overflow-x: auto;
       display: flex;
       white-space:nowrap;
       flex-flow:row nowrap;
       justify-content: flex-start;
       min-height:192px;
       .goods-box{
         flex: 0 0 auto;
         overflow: hidden;
         background: #ffffff;
         margin-right: 2px;
         margin-block-start: 0px;
         margin-block-end: 0px;
         .goods-img-box{
           width: 100px;
           height: 100px;
           position: relative;
           .img-box{
             width: 100%;
             height: 100%;
           }
           .row3-status-img{
            position: absolute;
            width: 48px;
            height: 48px;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            z-index: 3;
          }
          .img-label{
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            z-index: 2;
            overflow: hidden;
            .icon-img{
              width: 100%;
            }
          }
         }
         .goods-text-box{
           margin-inline-start: 0px;
           margin-top: 5px;
           margin-bottom: 5px;
           width: 100px;
           text-align:left;
           .goods-title{
            font-size: 12px;
            color: #333;
            height: 32px;
            line-height: 16px;
            padding: 0 5px;
           }
           .goods-price-box{
            color: #F21833;
            line-height: 20px;
            .price-integer{
              font-size: 14px;
              height: 20px;
              font-weight: bold;
            }
            .price-decimals{
              font-size: 8px;
            }
           }
           .market-price{
             font-size: 10px
             color: #999999
             text-decoration: line-through
             display:block
             margin-top:10px
           }
         }
       }
       .more-box{
         width: 100px;
         background: #ffffff;
         margin-block-start: 0;
         margin-block-end: 0;
        .img-box{
          width: 0.5rem;
          height: 0.5rem;
          margin: 0.55rem 0.25rem 0;
        }
       }
     }
   }
}

/* 会员价 */
.goods-text-box .row-vip-price{
  display:block;
  font-size:12px;
  transform :scale(0.85);
  line-height:22px;
  margin-left:5px;
  transform-origin: left
}
.goods-text-box .vip-bg{
  line-height:12px;
  display:inline-block;
  border-top-left-radius:2px;
  border-bottom-left-radius:2px;
}
.goods-text-box .img-vip{
  width:12px;
  height:12px;
  border-radius: 2px;
  display:inline-block;
}
.goods-text-box .vip-price {
  font-size:12px;
  color:#333;
  background: #FDFBEB;
  height:12px;
  padding:0 2px;
  border-radius:2px;
}
</style>
