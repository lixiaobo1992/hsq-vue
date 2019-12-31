<template>
  <dwd-tabbar class="tabbar" fixed :value="value" @tab-click="handleTabClick">
    <dwd-tab-item
      v-for="(item, index) in tabBar"
      :id="item.id"
      :key="item.id"
      :data-index="index"
      :data-link="item.link"
      :icon-path="item.iconPath"
      :active-icon-path="item.activeIconPath"
    >
      {{ item.text }}
    </dwd-tab-item>
  </dwd-tabbar>
</template>

<script>
import { TabBar, TabBarItem, Icon } from '@/ui'

const tabBarData = [
  {
    id: 'index',
    iconPath: 'https://img1.haoshiqi.net/miniapp/img/home-page-nor_af23204882.png',
    activeIconPath: 'https://img1.haoshiqi.net/miniapp/img/home-page-selected_0c0449db21.png',
    text: '首页',
  },
  {
    id: 'new-product',
    iconPath: 'https://img1.haoshiqi.net/miniapp/img/recomment-nor_f89ae8d1e5.png',
    activeIconPath: 'https://img1.haoshiqi.net/miniapp/img/recommend-selected_aa14164aa5.png',
    text: '新品推荐',
  },
  {
    id: 'category',
    iconPath: 'https://img1.haoshiqi.net/miniapp/img/classify-nor_0964a595f3.png',
    activeIconPath: 'https://img1.haoshiqi.net/miniapp/img/classify-selected_9b2a6a9e9d.png',
    text: '分类',
  },
  {
    id: 'profile',
    iconPath: 'https://img1.haoshiqi.net/miniapp/img/me-nor_71c11f0d57.png',
    activeIconPath: 'https://img1.haoshiqi.net/miniapp/img/me-selected_512fca90a6.png',
    text: '我的',
  },
]

export default {
  name: 'dwd-tabbar-box',

  components: {
    [TabBar.name]: TabBar,
    [TabBarItem.name]: TabBarItem,
  },

  props: {
    value: {
      type: String,
      default: 'index',
    },
  },

  data() {
    return {
      tabBar: tabBarData,
    }
  },

  created() {},

  mounted() {},

  methods: {
    handleTabClick(...rest) {
      console.log(rest)
      const [id, e] = rest
      console.log(id)
      if (id === this.value) return
      // const { link } = e.currentTarget.dataset;
      switch (id) {
        case 'index':
        case 'profile':
        case 'new-product':
        case 'category':
        
          console.log(id)
          this.$forward('https://m.haoshiqi.net/v2/' + id)
          break
        // case 'new-product':
        // case 'category':
        //   this.$forward(id)
        //   break
        default:
          // do nothing
          console.log('nothing')
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../style/var';
</style>
