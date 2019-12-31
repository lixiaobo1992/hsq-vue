<template>
  <dwd-page is-header :is-footer="isGat">
    <!-- slot 只能在 template or 组件 上使用 -->
    <!-- 自定义slot -->
    <!-- <template v-slot:header>
      <div class="index-header">
        <div class="logo">
          <img class="img" src="~assets/img/logo-small.png" alt="logo" />
        </div>
        <div
          class="search ellipsis"
          data-index="1"
          data-link="https://m.haoshiqi.net/v2/search"
          @click="$onUrlPage"
        >
          <vue-icon class="icon-index-search flex-shrink" type="search" :size="14"></vue-icon>
          <div class="keywords ellipsis">{{ hotSearch }}</div>
        </div>
      </div>
    </template> -->
    <dwd-float-msg class="index-msg" :msg-data="newMsg" />

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
      <div v-for="item in tplList" :key="item.id" class="tpl-modules" :data-type="item.type">
        <dwd-modules :data="item" />
      </div>
      <div class="pro-list list-type-card">
        <c-product-col2 :data="indexListData" />
      </div>
    </dwd-scroll>
  </dwd-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PullListMixin from '@/mixins/pull-list'
import { dealPinList } from '@/utils/data-util'
import bridge from '@/utils/bridge'
import env from '@/config/env'
import { Scroll, Header, Icon } from '@/ui'
import cProductCol2 from '@/components/modules/c-product-col2'
import floatMsg from '@/components/float-msg'
import modules from '@/components/modules/index'
// import ModulesData from '@/components/modules/data' // mock 数据
import ModuleMixin from '@/mixins/dealModule'

export default {
  name: 'index',
  components: {
    [Header.name]: Header,
    [modules.name]: modules,
    [cProductCol2.name]: cProductCol2,
    [Icon.name]: Icon,
    [Scroll.name]: Scroll,
    // [Page.name]: Page,
    [floatMsg.name]: floatMsg,
  },
  mixins:[PullListMixin],

  data() {
    return {
      selected: '首页',
      tplList: [],
      isGat: !env.isChannel('guanaitong'),
    }
  },

  computed: {
    ...mapState({
      appConfig: state => state.app.appConfig,
      newMsg: state => state.msg.newMsg,
    }),
    // this.$store.state.app.config === {},
    hotSearch() {
      return (
        (this.appConfig && this.appConfig.hotSearch && this.appConfig.hotSearch.value) ||
        '搜索您想找的商品'
      )
    },
    indexListData() {
      const that = this
      return {
        list: this.listData,
        eventClick: function (items) {
          let { biz_id, can_bought, left_stock, link } = items
          if (can_bought && left_stock && link) {
            // console.log(link)
            that.$forward(link)
          }
        },
      }
    },
  },

  created() {

    this.initData()
    // 此处为注释
    // this.showLoading()
    // api.getCoupleList({}, (res) => {
    //   console.log(res)
    //   that.proList = dealPinList(res.data.list || [])
    //   this.showToast('test')
    // }, (err) => {
    //   console.log(err)
    // })
  },

  mounted() {
    // console.log(this.config)
  },

  methods: {
    ...mapActions(['startPollingMsg', 'stopPollingMsg', 'getGeo']),
    ...ModuleMixin,
    initData() {
      this.getIndexNew(() => {
        this.getListData()
      })

      bridge.setShare()
    },
    getIndexNew(callBack) {
      this.$api.getIndexNew(
        {
          // sourceType: 1, // 会自动根据 terminal 判断
        },
        res => {
          // this.tplList = this.dealModuleList(ModulesData.list);
          this.tplList = this.dealModuleList(res.data.list)
          // that.scrollCheck = true;
          callBack && callBack()
        },
        err => {}
      )
    },

    pullModel(...rest) {
      this.$api.getCoupleList.apply(this, rest)
    },
    getListData() {
      this.$showLoading()
      this.initPullList()
      this.onScrollToLower()
    },
    dealList(list) {
      return dealPinList(list)
    },
    goNext(e) {
      console.log(e)
      const { type } = e.currentTarget.dataset
      console.log(type)
      switch (type) {
        case 'logo':
          this.$forward('debug?xx=1', { sss: 2 })
          break
        case 'search':
          // 新的h5链接 老的页面
          this.$forward('https://m.haoshiqi.net/v2/couple-search-list?q=%e7%89%9b%e5%a5%b6')
          // this.$forward('https://m.haoshiqi.net/v2/detail?id=xxx');
          break
        case 'city':
        case 'zt':
          this.$forward(type)
          break
        default:
      }
    },
  },
  activated() {
    console.log('index.vue activated')
    this.startPollingMsg()
  },
  deactivated() {
    console.log('index.vue deactivated')
    this.stopPollingMsg()
  },
}
</script>

<style lang="stylus" scoped>
@import '../style/var';

.tpl-modules {
  overflow: hidden;
}

.img-badge.soldout {
  position: absolute;
  size: 100%;
  background: url('~assets/img/soldout.png') center no-repeat;
  background-size: 66.6%;
}

.index-msg{
  top: 60px !important;
}

.index-header {
  position: fixed;
  top: 0;
  left: 0;
  width 100%;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  line-height: 1;
  background: #fff;
  font-size: 12px;
  .logo {
    width: 60px;
    height: 18px;
    img{
      height: 18px;
    }
  }
  .search {
    height: 30px;
    flex: 1;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    color: #999;
    background: #f7f8f4;
    margin-left: 5px;
    .keywords{
      margin-left: 5px;
      line-height: 20px;
    }
  }
}

.list-type-card {
  width: 100%;
  overflow: hidden;
}
.shop-price-box .price-box{
  display:flex;
}
.tpl-modules {
    overflow: hidden;
}
</style>
