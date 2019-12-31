<template>
  <dwd-page is-header>
    <template v-slot:header>
      <dwd-header ref="header" fixed :title="title" />
    </template>
    <dwd-scroll
      v-model="pullLoading"
      class="search-scroll"
      :finished="finished"
      :list-len="1"
      :is-loading="isLoading"
      :finished-tip="finishedTip"
      :immediate-check="scrollCheck"
      @onScrollToLower="onScrollToLower"
    >
      <div
        v-if="categoryList && categoryList.length > 0"  
        class="category-list" 
        :class="{ 'more-oneline': categoryList && categoryList.length > 4 }"
      >
        <div v-for="(category, categoryIndex) in categoryList" :key="categoryIndex" class="category-item-block">
          <div 
            class="category-item"
            :class="{ active: seleCategoryIndex == categoryIndex }"
            @click="goSearchText(category, categoryIndex)"
          >
            <span>{{ category }}</span>
          </div>
        </div>
      </div>
      
      <div class="view-list">
        <!-- 使用注意事项， card 不实现背景，自己外层盒子实现 -->
        <div v-if="listData && listData.length" class="product-card">
          <dwd-card v-for="product in listData" :key="product.id" :data="product" list-mode="card" />
        </div>
        <div v-if="!listData.length && !isLoading" class="no-data">
          <div>
            <img class="empty-img" src="../assets/img/not-search-result.png">
            <div class="empty-text">暂无结果</div>
          </div>
        </div>
      </div>

      <!-- 推荐商品列表 -->
      <div v-if="recommendList.length" class="product-list">
        <div class="list-text">
          <span class="chn-text">猜你喜欢</span>
          <span class="eng-text">GUESS YOU LIKE</span>
        </div>
        <c-product-col2 :data="indexListData" />
      </div>
    </dwd-scroll>
    <div class="view-tab" :class="{tab1: !showSort}">
      <!-- 综合排序、销量 -->
      <div class="tab">
        <div 
          v-for="(tab, tabIndex) in tabs" 
          :key="tab.text" 
          class="tab-sub" 
          :data-index="tabIndex"
          @click="onClickTab"
        >
          <div class="view-tap">
            <span class="sub-title" :class="{'sub-title-red': clickIndex == tabIndex}">
              {{ tab.text }}
            </span>
            <div v-if="tab.topImg || tab.botImg" class="img-block">
              <div v-if="tab.topImg">
                <img
                  class="sub-img top"
                  :src="clickIndex == tabIndex ? tab.topImg : icons"
                >
              </div>
              <div v-if="tab.botImg">
                <img
                  class="sub-img bottom"
                  :src="clickIndex == tabIndex ? tab.botImg : icons"
                >
              </div>
            </div>
          </div>
        </div>
        <div class="tab-sub" @click="toggleViewSort">
          <div class="view-tap no-border">
            <span 
              class="sub-title"
              :class="{ 'sub-title-red': expiryIndex > 0 || showSort, 'no-active': searchHasExpiryDate == 1 }"
            >
              {{ expiryIndex > 0 ? sortList[expiryIndex] : lastTab.text }}
            </span>
            <div class="img-block">
              <img
                v-show="showSort"
                class="sub-img top"
                :src="lastTab.topImg"
              >
              <img
                v-show="!showSort"
                class="sub-img bottom"
                :src="lastTab.botImg"
              >
            </div>
          </div>
        </div>
      </div>
      <!--  综合排序、价格从高到低、价格从低到高  -->
      <div v-if="showSort" class="view-sort">
        <div class="bg-alpha" @click="toggleViewSort" />
        <div 
          v-for="(sort, sortIndex) in sortList" 
          :key="sort" 
          class="sort" 
          :data-index="sortIndex"
          @click="onClickSort"
        >
          <span class="sort-title" :class="{ 'sort-title-red': sortClickIndex == sortIndex }">{{ sort }}</span>
          <img v-if="sortClickIndex == sortIndex" class="sort-img" :src="iconSelected">
        </div>
      </div>
    </div>
  </dwd-page>
</template>
<script>
import PullListMixin from '@/mixins/pull-list'
import { dealPinList } from '@/utils/data-util'
import ListItem from '@/components/list-item.vue'
import ProductCard from '@/components/product-card.vue'
import { mapTo } from '@/utils/base'
import cProductCol2 from '@/components/modules/c-product-col2'
import { Header } from '@/ui'

import { clone } from '@/utils/base'
import { dealPrice } from '@/utils'

// import { Header } from '@/ui';
// import icon from '@/ui/icon'

import { Scroll, Icon } from '@/ui'
const sortIcons = {
  normal: 'https://img1.haoshiqi.net/miniapp/couple-search-list/category_normal_edc58e8934.png',
  select: 'https://img1.haoshiqi.net/miniapp/couple-search-list/icon_selected_f4e98109b4.png',
  active: 'https://img1.haoshiqi.net/miniapp/couple-search-list/category_down_60852c36b2.png',
}
let paramers = {
  sort: '',
  sortType: 0,
  expiryDate: '',
  category: '',
  sortPriceType: '1',
  sortDiscountType: '1',
}
export default {
  components: {
    [Scroll.name]: Scroll,
    [Icon.name]: Icon,
    [ListItem.name]: ListItem,
    [ProductCard.name]: ProductCard,
    [cProductCol2.name]: cProductCol2,
    [Header.name]: Header,
  },
  mixins: [PullListMixin],
  data() {
    return {
      tabs: [{
        text: '综合',
      }, {
        text: '价格',
        topImg: sortIcons.normal,
        botImg: sortIcons.active,
      }, {
        text: '折扣',
        topImg: sortIcons.normal,
        botImg: sortIcons.active,
      }],
      lastTab: {
        text: '效期',
        botImg: sortIcons.normal,
        topImg: sortIcons.active,
      },
      sortList: ['全部', '1个月效期', '2~3个月效期', '4~5个月效期', '6个月及以上效期'],
      icons: sortIcons.normal,
      iconSelected: sortIcons.select,
      showSort: false,    // 是否显示综合排序选择项页面
      clickIndex: 0,      // 综合排序、销量选中index
      sortClickIndex: 0,  // 综合排序选择项选中index
      expiryIndex: 0,
      searchHasExpiryDate: 0,
      categoryList: [],
      seleCategoryIndex: -1,
      noResult: false,    // 暂无结果
      swiperInfo: {},
      hasRecommendProduct: false,           //是否有推荐商品（有推荐商品需要释放出list）
      totalCnt: 0,
      // preSearchList: [],
      isRecommend: false,
      recommendList: [],
    }
  },
  computed: {
    title() {
      return this.$route.query.category || this.$route.query.q || '好食期'
    },
    indexListData() {
      const that = this
      return {
        list: this.recommendList,
        eventClick: function (items) {
          let { biz_id, can_bought, left_stock, link } = items
          if (can_bought && left_stock && link) {
            that.$forward(link)
          }
        },
      }
    },
  },
  created() {
    this.getListData()
  },
  beforeDestroy() {
    paramers = {
      sort: '',
      sortType: 0,
      expiryDate: '',
      category: '',
      sortPriceType: '1',
      sortDiscountType: '1',
    }
  },
  methods: {
    pullModel(...rest) {
      this.$api.coupleSearchlist.apply(this, rest)
    },
    initParams() {
      paramers = Object.assign(paramers, this.$route.query)
      this.isRecommend = false
      this.isLoading = true
      this.hasRecommendProduct = false
      this.pullParams.weights = 1
      this.pullParams = Object.assign({}, this.pullParams, paramers, {frontCategoryId: paramers.categoryId})

    },
    getListData() {
      this.$showLoading()
      this.initPullList()
      this.initParams()
      this.onScrollToLower()
    },
    afterPull(res) {
      const { data } = res
      const { list } = data
      this.isLoading = false
      if (!list || list.length <= 0) {
        this.noResult = true
      }
      if (this.pullParams.pageNum > 1) {
        return
      }
      // 第二页不属于主接口
      delete this.pullParams.scope
      delete this.pullParams.weights
      
      if(data.category) {
        const { banner = {}, category = [], searchHasExpiryDate, totalCnt = 0 } = data
        const swiperList = mapTo(banner.list || [], (item,index) => {
          return {
            image: item.image.url,
            url: item.link,
          }
        })
        const paddingTop = (banner.height / banner.width).toFixed(2) * 100
        const height = banner.height
        const swiperInfo = {
          list: swiperList, // 如果数据不符合格式，可以使用 mapTo 方法
          paddingTop,
          goUrlPage: 'goUrlPage',
          height: height,
        }

        let lastTab = this.lastTab
        lastTab.botImg = searchHasExpiryDate != 1 ? lastTab.botImg : 'https://img1.haoshiqi.net/miniapp/couple-search-list/category_disabled_533c061ded.png'
        this.lastTab = Object.assign({}, lastTab)
        this.searchHasExpiryDate = searchHasExpiryDate
        this.categoryList = category
        this.swiperInfo = Object.assign({}, swiperInfo)
        this.totalCnt = totalCnt
      }
    },
    // dealwith data
    dealList(list = []) {
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
          thumbnail: item.thumbnail,
          market_price:  dealPrice(item.market_price || item.marketPrice),
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
    //数据处理完成后判断是否需要请求推荐商品
    afterPullData(list) {
      if (this.totalCnt <= 20) {
        this.getRecommendProduct()
      }
    },
    getRecommendProduct() {
      this.$api.getCoupleList({
        personalization: true,
        pageNum: 1,
        pageLimit: 20,
        needPagination: 1,
      }, res => {
        const { data } = res
        const { list } = data
        this.recommendList = this.dealRecList(list)
      }, err => {
        console.log(err)
      })
    },
    dealRecList(list) {
      return mapTo(list, (item, index) => {
        const isShowLootAll = !item.onLine || !item.inStock
        return {
          ...item,
          id: item.pinActivitiesId,
          image: item.skuPic,
          thumbnail: item.thumbnail,
          market_price: (item.market_price / 100).toFixed(2),
          price: this.productPrice(((item.price || item.couplePrice) / 100).toFixed(2)),
          isShowLootAll,
          tags: item.tags || [],
          inStock: item.inStock,
          onLine: item.onLine,
          endTime: item.endTime,
          showCountDownLimit: item.showCountDownLimit,
          remainTime: item.remainTime || '',
          merchant_type: item.merchant_type,
          expired_date_text: item.expired_date_text_two,
        }
      })
    },
    // 按分类筛选
    goSearchText(text, index) {
      this.seleCategoryIndex = index
      paramers.category = text
      this.getListData()
    },
    // 点击排序
    onClickTab(e) {
      const { index } = e.currentTarget.dataset
      
      if (index == this.clickIndex && index == 0) {
        return
      } else if (index == this.clickIndex) {
        const bottomImg = this.tabs[index].botImg == sortIcons.normal ? sortIcons.active : sortIcons.normal
        const topImg = this.tabs[index].topImg == sortIcons.normal ? sortIcons.active : sortIcons.normal
        this.clickIndex = index
        this.tabs[index].botImg = bottomImg
        this.tabs[index].topImg = topImg
        let sortPriceType = paramers.sortPriceType
        let sortDiscountType = paramers.sortDiscountType
        if(index == 1) {
          paramers.sortPriceType = sortPriceType == '0' ? '1' : '0'
          paramers.sort = 'price'
          paramers.sortType = paramers.sortPriceType
          this.getListData()
        } else if (index == 2 ){
          paramers.sortDiscountType = sortDiscountType == '0' ? '1' : '0'
          paramers.sort = 'discount'
          paramers.sortType = paramers.sortDiscountType
          this.getListData()
        }
      } else {
        this.clickIndex = index
        switch (index){
          case '0':
            paramers.sort = ''
            paramers.sortType = ''
            break
          case '1':
            paramers.sort = 'price'
            paramers.sortType = paramers.sortPriceType
            break
          case '2':
            paramers.sort = 'discount'
            paramers.sortType = paramers.sortDiscountType
            break
        }
        this.getListData()
      }
    },
    // 点击效期筛选
    toggleViewSort() {
      if (this.searchHasExpiryDate == 1) {
        return
      }
      this.showSort = !this.showSort
    },
    // 按效期筛选
    onClickSort(e) {
      const { index } = e.currentTarget.dataset
      // tab 重置
      let botImg = this.lastTab.botImg
      if (index == 0) {
        botImg = sortIcons.normal
      } else {
        botImg = sortIcons.active
      }
      
      switch (index) {
        case '0':
          // 全部
          paramers.expiryDate = ''
          break
        case '1':
          console.log('123')
          // 1个月效期
          paramers.expiryDate = 1
          break
        case '2':
          // 2-3个月效期
          paramers.expiryDate = 2
          break
        case '3':
          // 4-5个月效期,
          paramers.expiryDate = 3
          break
        case '4':
          // 6个月及以上效期
          paramers.expiryDate = 4
          break
      }
      this.sortClickIndex = index
      this.showSort = false
      this.expiryIndex = index
      this.lastTab.botImg = botImg
      this.getListData()
    },
  },
}
</script>
<style lang="stylus" scoped>
.search-scroll {
  padding-top: 44px;
}
.content {
  padding-top: 44px;
}
.product-card {
  display: flex;
  flex-wrap: wrap;  
}
.view-tab {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
}

.tab1 {
  position: absolute;
  left: 0;
  top: 0;
  height: 44px;
}

/* 综合排序、销量  */
.tab {
  font-size: 14px;
  position: fixed;
  // top: 44px;
  left:0;
  display: flex;
  width: 100%;
  height: 44px;
  background-color: white;
  text-align: center;
  align-items: center;
  z-index: 100;
  // border-top: 1px solid rgb(226, 226, 226);
  border-bottom: 1px solid rgb(226, 226, 226);
}

.tab-sub {
  width: 50%;
  height: 100%;
  display: flex;
  text-align: center;
  align-items: center;
}

 .view-tap {
  width: 100%;
  border-right: 1px solid rgb(226, 226, 226);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
}

.no-border {
  border: none;
  padding:0 10px;
}
.no-border .bottom, .no-border .top {
  margin-top: -2px;
}

.img-block {
  height: 30px;
  justify-content: center;
  width: 8px;
  position: relative;
  flex-shrink: 0;
}
.sub-title {
  font: 14px;
  color: #666;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.sub-title-red {
  color: rgb(237, 0, 0);
}

.sub-img {
  width: 8px;
  height: 5px;
  margin-left: 2px;
  /* margin-bottom: 8rpx; */
}
.top {
  transform: scaleY(-1);
  position: absolute;
  top: 50%;
  margin-top: -7px;
  left: 3px;
}
.bottom {
  position:absolute;
  top: 50%;
  left: 3px;
  margin-top: 1px;
}
/* 综合排序、价格从高到低、价格从低到高  */
.view-sort {
  height: 100%;
  width: 100%;
  padding-top: 88px;
}

.bg-alpha {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
}

.sort {
  position: relative;
  line-height: 44px;
  border-bottom: 1px solid rgb(226, 226, 226);
  background-color: white;
  padding-left: 15px;
  z-index: 90;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sort-title {
  font-size: 14px;
  color: rgb(153, 153, 153);
}

.sort-title-red {
  color: rgb(237, 0, 0);
}

.sort-img {
  width: 15px;
  height: 11px;
  margin-right: 15px;
}

.view-list {
  position: relative;
}
.category-list {
  background-color: #fff;
  display: flex;
  padding: 15px 15px 0 15px;
  color: #666;
  font-size: 14px;
  flex-wrap: wrap;
  justify-content: space-around;
}
.more-oneline {
  justify-content: flex-start;
}
.category-item-block {
  width: 25%;
  display: flex;
  justify-content: center;
}
.category-item {
  width: 75px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: #f5f5f9;
  border-radius: 3px;
  flex-shrink: 0;
  margin-bottom: 15px;
  border: 1px solid #f5f5f9;
  overflow: hidden;
}
.active {
  color: #ed0000;
  border: 1px solid #ed0000;
  background-color: #f9f9fa;
}
.no-active {
  color: #DDD;
}
.list-text {
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
}
.chn-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.eng-text {
  font-size: 12px;
  color: #ccc;
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
}
.empty-img {
  height: 180px;
  width: auto
}
.empty-text {
  text-align: center;
  font-size: 12px;
}

</style>