<template>
  <dwd-page is-header :is-footer="isGat">
    <dwd-scroll
      v-model="pullLoading"
      class="page-scroll"
      :finished="finished"
      :list-len="listData.length"
      :is-loading="isLoading"
      :finished-tip="finishedTip"
      :immediate-check="scrollCheck"
      @onScrollToLower="onScrollToLower"
    >
      <div v-if="listData && listData.length" class="product-card">
        <dwd-card v-for="product in listData" :key="product.id" :data="product" list-mode="card" />
      </div>
    </dwd-scroll>
  </dwd-page>
</template>
<script>
import PullListMixin from '@/mixins/pull-list'
import { Scroll } from '@/ui'
import cProductCol2 from '@/components/modules/c-product-col2'
import ProductCard from '@/components/product-card.vue'
import { mapTo } from '@/utils/base'
import { dealPrice } from '@/utils'

import env from '@/config/env'

export default {
  name: 'new-product',
  components: {
    [Scroll.name]: Scroll,
    [cProductCol2.name]: cProductCol2,
    [ProductCard.name]: ProductCard,
  },
  data() {
    return {

      isGat: !env.isChannel('guanaitong'),
    }
  },
  mixins: [PullListMixin],
  created() {
    this.getNewProduct()
  },
  methods: {
    pullModel(...rest) {
      this.$api.getNewProduct.apply(this, rest)
    },
    getNewProduct() {
      this.$showLoading()
      this.initPullList()
      this.onScrollToLower()
    },
    dealList(list) {
      return mapTo(list, (item) => {
        let isShowLootAll = 0
        if(!item.onLine){
          isShowLootAll = 1
        } else if(!item.inStock) {
          isShowLootAll = 2
        }
        return {
          id: item.pinActivitiesId,
          title: item.coupleTitle || item.title,
          image: item.skuPic,
          market_price: dealPrice(item.market_price || item.marketPrice),
          price: this.productPrice(dealPrice(item.price || item.couplePrice)),
          isShowLootAll,
          tags: item.tags || [],
          inStock: item.inStock,
          onLine: item.onLine,
          endTime: item.endTime,
          showCountDownLimit: item.showCountDownLimit,
          remainTime: item.remainTime || '',
          merchantType: item.merchant_type,
          expired_date_text:item.expired_date_text_two,
          link: item.link,
        }
      })
    },
    productPrice(price) {
      let priceArray = price.split('.')
      return {
        price_yuan: priceArray[0],
        price_fen: priceArray[1],
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.page-scroll {
  &/deep/ .product-card {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
