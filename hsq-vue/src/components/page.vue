<template>
  <div class="page-box" :class="{ 'is-header': isShowHeader, 'is-footer': isShowFooterBar && leftOptions.showBack }">
    <header v-if="isShowHeader">
      <slot name="header">
        <dwd-header ref="header" fixed :title="title" :left-options="leftOptions" />
      </slot>
    </header>
    <section id="content" class="content">
      <slot />
    </section>
    <footer v-if="isShowFooterBar && leftOptions.showBack" class="footer-bar">
      <slot name="footer">
        <dwd-tabbar-box :value="tabbarVal" />
      </slot>
    </footer>
    <slot name="sub-block" />
  </div>
</template>

<script>
/**
 * dwd-page 所有页面引入此组件
 * @module components/Page
 * @desc props
 * @param {boolean} [isHeader=false] - 显示默认header
 * @param {Object} [right-options] right选项
 *
 * @desc slot
 * v-slot:sub-block 自定义内容
 * v-slot:header // 自定义header
 * v-slot:footer // 自定义底部
 * slot:default // 内容
 *
 * @example
 *  <dwd-page isheader>
      <template v-slot:header>
        <p>header</p>
      </template>
      <p>内容</p>
      <template v-slot:footer>
        <p>footer</p>
      </template>
    </dwd-page>
 */

import {
  // mapActions,
  mapState,
  // mapGetters,
} from 'vuex'
import { Header } from '@/ui'
import TabBar from '@/components/tabbar'
import device from '@dwdjs/utils/lib/device'
import env from '@/config/env'

const showTabBar = ['index', 'new-product', 'category', 'profile']

export default {
  name: 'dwd-page',
  components: {
    [TabBar.name]: TabBar,
    [Header.name]: Header,
  },
  props: {
    isHeader: {
      type: Boolean,
      default: false,
    },
    isFooter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      xx: 1,
      leftOptions:{
        showBack: !env.isChannel('guanaitong'),
      },
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      userInfo: state => state.user.userInfo,
    }),

    tabbarVal() {
      if (showTabBar.indexOf(this.route.name) > -1) {
        return this.route.name
      }
      return 'index'
    },
    // header
    title() {
      return (this.route.meta && this.route.meta.title) || ''
    },

    // 计算当前是否显示header
    isShowHeader() {
      const { header: tempHeader } = this.$slots
      let isShowHeader = tempHeader || this.isHeader
      // 微信环境下 且 页面没有自定义自己的header
      if (device.wechat && !tempHeader) {
        isShowHeader = false
      }
      if (device.hsq && !tempHeader) {
        isShowHeader = false
      }
      return isShowHeader ? true : false
    },
    isShowFooterBar() {
      const { footer: tempFooter } = this.$slots
      return tempFooter || this.isFooter ? true : false
    },
  },
  created() {
    // console.log(this.$slots);
    // console.log(this.$refs)
  },
  methods: {},
}
</script>

<style lang="stylus" scoped>
.page-box{
  position: relative;
  display: flex;
  justify-content: center;
  &.is-header{
    padding-top: 44px;
  }
  &.is-footer{
    padding-bottom: 49px;
  }
}
.content{
  position: relative;
  min-height: 100%;
  width: 100%;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.footer-bar{
  // height: 49px;
}
</style>
