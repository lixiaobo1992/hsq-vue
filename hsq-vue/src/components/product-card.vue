<template>
  <div
    class="product-item exposure-item"
    :class="`product-${listMode}`"
    :data-link="data.link"
    @click="onTapNext($event, data)"
  >
    <div class="product-row">
      <div
        v-if="data.image"
        class="product-media"
      >
        <img
          v-lazy="data.image"
          class="product-img"
        >
        <!-- 已停售 -->
        <img
          v-if="data.isShowLootAll == 1"
          class="image-lootAll"
          src="https://img1.haoshiqi.net/miniapp/yitingshou_6b85cdec95.png"
        >
        <!-- 已抢光 -->
        <img
          v-if="data.isShowLootAll == 2"
          class="image-lootAll"
          src="https://img1.haoshiqi.net/wxapp/img/icon_lootAll_9264ebba09.png"
        >
      </div>

      <div
        v-if="data.countDownInfo"
        class="product-countdown"
      >
        {{ data.countDownInfo }} 结束
      </div>
    </div>
    <div class="product-intro">
      <div class="product-info">
        <div class="product-title max-line-2">
          <span
            v-if="data.merchantType == 2"
            class="title-zy"
          >自营</span>
          {{ data.title }}
        </div>
        <div
          v-if="data.desc"
          class="product-desc"
        >{{ data.desc }}</div>
      </div>
      <div v-if="data.tags.length > 0" class="product-tags">
        <template>
          <span
            v-for="(tag, tagIndex) in (data.tags).slice(0, 2)"
            :key="tagIndex"
            class="tags"
          >{{ tag.text }}</span>
        </template>
        <span
          v-if="data.remainTime"
          class="remain-time"
        >{{ data.remainTime }}</span>
      </div>
      <div class="row-expire-day">
        <span
          v-if="data.expired_date_text"
          class="row-left-day"
        >{{ data.expired_date_text }}</span>
      </div>
      <div class="product-sub">
        <p class="row2-price-box">
          <span class="row2-price">
            <span class="price-integer">{{ data.price.price_yuan }}</span>
            <span class="price-decimals">.{{ data.price.price_fen }}</span>
          </span>
          <span class="row2-market">{{ data.market_price }}</span>
        </p>
        <span
          v-if="data.num"
          class="product-num"
        >x {{ data.num }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dwd-card',
  props: {
    data: Object,
    listMode: {
      type: String,
      default: 'list',
    },
  },
  methods: {
    onTapNext(e, data) {
      if(data.onLine && data.inStock && data.link) {
        this.$onUrlPage(e)
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.product-list.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-list .product-row {
  height: 100%;
}

.product-media {
  width: 100px;
  height: 100px;
}

// .product-card {
//   display: flex;
//   flex-wrap: wrap;
// }

.product-card.product-item {
  display: flex;
  flex-direction: column;
  width: 50%;
  border: 1px solid rgb(226, 226, 226);
  border-top: none;
  border-left: none;
  &:nth-of-type(even) {
    border-right: none;
  }
}

.product-card .product-row {
  width: 100%;
}
.product-card .product-media {
  width: 80%;
  padding-top: 80%;
  margin: 0 0 10px 0;
}
.product-card .product-num {
  display: none;
}

.product-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(226, 226, 226);
  background-color: #fff;
}

 .product-row {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
}

.product-media {
  position: relative;
  flex-shrink: 0;
  margin: 0 20px 0 10px;
}

.product-media .product-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.product-media .image-lootAll{
  position: absolute;
  width:70%;
  height:70%;
  left:15%;
  top:15%;
}

.product-intro {
  width: 100%;
  padding: 8px;
  flex-shrink: 1;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-info {
  line-height: 1.4;
  min-height: 45px;
  flex: 1;
}

.product-title {
  font-size: 14px;
  max-height: 72px;
  overflow: hidden;
  line-height: 1.5em;
}

.product-info .title-zy {
  font-size: 12px;
  color: #ed0000;
  border: 1px solid #ed0000;
  margin-right: 5px;
  border-radius: 2px;
  padding: 0 2px;
}

.product-desc {
  font-size: 12px;
}

.product-sub {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.product-tags {
  margin-bottom: 5px;
  line-height 24px;
}

.product-tags .tags {
  font-size: 12px;
  border: 1px solid rgb(237, 0, 0);
  color: rgb(237, 0, 0);
  padding: 0 2px;
  margin-right: 8px;
  border-radius: 2px;
  white-space: nowrap;
}

.product-tags .remain-time {
  color: #ed0000;
  font-size: 12px;
  border: 1px solid #ed0000;
  border-radius: 2px;
  padding:0 2px;
}

.product-countdown {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 24px;
  background-color: rgba(53, 53, 53, 0.6);
  text-align: center;
  line-height: 24px;
  color: white;
  font-size: 12px;
}
.row-expire-day{
  height:14px;
  line-height:14px;
  font-size:10px;
  color: #999999;
  width:100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.row2-price-box{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
}
.row2-price{
  display: inline-block;
  color: #FB0438;
  .price-integer{
    font-size: 16px;
    height: 28px;
    // font-weight: bold;
  }
  .price-decimals{
    font-size: 16px;
  }
}
.price-integer, 
.row2-market {
  &:before {
    content: '¥';
    top: 0;
  }
}
.row2-market{
  font-size: 10px
  margin-left: 5px;
  color: #999;
  text-decoration: line-through;
}
</style>