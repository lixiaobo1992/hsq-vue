<template>
  <dwd-page is-header :is-footer="isGat">
    <template v-slot:header>
      <div class="page-header">
        <div
          class="search ellipsis"
          data-index="1"
          data-link="https://m.haoshiqi.net/v2/search"
          @click.stop="$onUrlPage"
        >
          <dwd-icon class="icon-index-search flex-shrink" type="search" :size="14" />
          <div class="keywords ellipsis">{{ hotSearch }}</div>
        </div>
      </div>
    </template>
    <div class="sort-main">
      <div class="sort-left fl">
        <div
          v-for="(category, categoryIndex) in categoryList"
          :key="category.id"
          class="sort-left-item"
          :class="{ active: currentCategory.id == category.id }"
          @click.stop="clickCategory(categoryIndex)"
        >
          <div class="left-item-block">
            <span class="left-item-text">{{ category.name }}</span>
          </div>
        </div>
      </div>
      <div class="sort-right">
        <div class="inner-box">
          <div
            v-if="leftClassAd[currentCategory.id]"
            class="category-ad"
            :data-url="leftClassAd[currentCategory.id].redirect_url"
            @click.stop="$onUrlPage"
          >
            <img v-lazy="leftClassAd[currentCategory.id].banner_url" class="ad-image">
          </div>
          <div
            v-for="subcategory in currentCategory.subCategories"
            :key="subcategory.id"
            class="sort-box overhidden"
          >
            <div class="tit fonticon">
              <span class="sort-name">{{ subcategory.name }}</span>
            </div>
            <div class="sort-right-list">
              <div v-for="sub in subcategory.subCategories" :key="sub.id" class="item fl" @click.stop="goSearch(sub)">
                <div class="item-img">
                  <img class="img-content" :src="sub.thumbnail" :alt="sub.name">
                </div>
                <div class="item-name max-line-2">
                  {{ sub.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dwd-page>
</template>
<script>
import icon from '@/ui/icon'
import { mapState, mapActions } from 'vuex'

import env from '@/config/env'

export default {
  name: 'sort-search',
  components: {
    [icon.name]: icon,
  },
  data() {
    return {
      categoryList: [],
      currentCategory: {},
      leftClassAd: {},
      categoryIndex: 0,

      isGat: !env.isChannel('guanaitong'),
    }
  },
  computed: {
    ...mapState({
      appConfig: state => state.app.appConfig,
      newMsg: state => state.msg.newMsg,
    }),
    hotSearch() {
      return (
        (this.appConfig && this.appConfig.hotSearch && this.appConfig.hotSearch.value) ||
        '中国制造，智慧全球'
      )
    },
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      this.$api.getCategory(
        {},
        res => {
          const { data } = res
          this.categoryList = this.categoryList.concat(data.list)
          this.currentCategory = Object.assign({}, this.categoryList[0])
          this.getCategoryAd()
        },
        err => console.log(err)
      )
    },
    goSearch(sub) {
      let { name: category, id: categoryId } = sub
      this.$forward('couple-search-list', {
        category,
        categoryId,
      })
    },
    clickCategory(categoryIndex) {
      this.currentCategory = this.categoryList[categoryIndex]
      this.getCategoryAd()
    },
    getCategoryAd() {
      const item = this.currentCategory
      this.$api.getCategoryAd(
        {
          categoryId: item.id,
        },
        res => {
          const { list = [] } = res.data
          if (list && list.length) {
            const ad = list[0] || {}
            this.leftClassAd[item.id] = { ... ad }
          }
        },
        err => {
          return true
        }
      )

    },
  },
}
</script>
<style lang="stylus" scoped>
.page-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 960;
  transform: translate3d(0,0,0);
  background-color: #fff;
  padding: 0 10px;
  .search {
    height: 30px;
    flex: 1;
    display: inline-flex;
    width: 100%;
    align-items: center;
    padding: 0 8px;
    color: #999;
    background: #f7f8f4;
    .keywords{
      margin-left: 5px;
      line-height: 20px;
    }
  }
}
.sort-main {
  height: 100%;
}
.sort-left {
  width: 72px;
  background-color: #fafaf8;
  height: 100%;
  display: inline;
  overflow: auto;
  .sort-left-item {
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    background-color: #F5F5F9;
    display: flex;
    align-items: center;
  }
  .left-item-block {
    width: 100%;
    min-height: 30px;
    padding-left: 3px;
    padding-right: 3px;
    transition: all 0.5s 0s;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left-item-text {
    word-break: break-all;
    line-height: 17px;
    white-space: normal;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }
  .left-item-block {
    border-left: 2px solid #F5F5F9;
  }
  .active {
    background-color: #fff;
    color: #ED0000;
    font-weight: bold;
    .left-item-block {
      border-left: 2px solid #ED0000;
    }
  }
}
.sort-right {
  overflow-y: scroll;
  height: 100%;
  background-color: #fff;
  .sort-box {
    width: 100%;
    padding-top: 15px;
    overflow: hidden;
    &:first-child {
      padding-top: 20px;
    }
    .tit {
      position: relative;
      line-height: 20px
      height: 20px;
      padding:0 15px;
      margin-bottom: 3px;
    }
  }
}
.sort-name {
  font-size: 14px;
  color: #666666;
  padding-left: 15px;
  position: relative;
  &:before {
    content: '';
    display: block;
    width: 5px;
    height: 5px;
    background-color: #f00;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -3px;
  }
}
.sort-right-list {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  .item {
    position: relative;
    display: inline-block;
    width: 33%;
    text-align: center;
    .item-img {
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      .img-content {
        width: 100%;
      }
    }
  }
}
.item-name {
  color: #252525;
  margin-top: 5px;
  font-size: 12px;
  margin-top: 5px;
}
.list-type-card {
  width: 100%;
  overflow: hidden;
}
.category-ad{
  width: 100%;
  position: relative;
  padding-top: 32.8%;
  margin-bottom: 10px;
}
.category-ad .ad-image{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
