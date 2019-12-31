<template>
  <div class="vue-pull-scroll view-scroll">
    <div class="vue-pull-refresh__track">
      <div class="vue-pull-refresh__head" />
      <div class="vue-pull-list">
        <slot />
        <!-- <div class="van-list__loading" v-show="pullLoading">
          <slot name="loading">
            <span class="van-list__loading-text">{{ loadingTip }}</span>
          </slot>
        </div> -->
        <!-- 当前列表无数据 切 页面在load 显示无数据提示 -->
        <slot v-if="!listLen && !isLoading" name="not-data">
          <p class="not-data">暂无数据！</p>
        </slot>
        <div v-else class="pull-loading-status">
          <div v-show="pullLoading" class="pull-loading flex-center">
            <mt-spinner type="fading-circle" :size="20" />
            <div class="pull-loading-tip">{{ loadingTip }}</div>
          </div>
          <slot v-if="listLen && finished" name="finishedTip">
            <div class="pull-finished">{{ finishedTip }}</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * model pullLoading
 * 属性:
 * pullLoading        [boolean]    // v-model绑定
 * isLoading          [boolean]   // 页面是否存在loading
 * finished           [boolean]   // 是否到底部 显示提示
 * listLen            [number]    // 列表长度
 * immediate-check    [boolean]   // 是否初始化完成后调用
 * offset             [number]    // 当 上滑到达底部剩余距离
 * loadingTip         [string]    // 翻页加载提示
 * finishedTip        [string]    // 到底提示
 * ///
 * 事件:
 * @onScrollToLower               // 滚动到最底部时调用

 * ///
 * 插槽:
 * not-data                      // 当 第一页请求 无数据时显示
 * ///
 * 方法:
 * 暂无
 */

import scroll from '@/utils/scroll'
import { on, off } from '@/utils/event'
import { debounce } from '@/utils'
import { Spinner } from 'mint-ui'
//import searchDefault from '@/assets/img/Nothing.png'; // 缺省页

export default {
  name: 'dwd-scroll',

  components: {
    [Spinner.name]: Spinner,
  },

  props: {
    isLoading: {
      type: Boolean,
      default: true,
    }, // 页面是否存在loading
    listLen: {
      type: Number,
      default: 0,
    }, // 列表长度
    pullLoading: Boolean, // 翻页load
    finished: Boolean, // 是否到底部 显示提示
    immediateCheck: Boolean, // 是否初始化完成后调用
    offset: {
      type: Number,
      default: 300,
    }, // 当 上滑到达底部剩余距离
    loadingTip: {
      type: String,
      default: '加载中...',
    }, // 翻页加载提示
    finishedTip: {
      type: String,
      default: '没有更多数据了',
    }, // 到底提示
  },

  model: {
    prop: 'pullLoading', // 自定义model prop
  },

  data() {
    return {
      // imgItem: {
      //   src: searchDefault,
      //   width: 250,
      //   height: 212,
      // },
      // fontItem: {
      //   width: 240,
      //   desc: '小蜜酱搜索不到,试试别的关键字吧~',
      // },
    }
  },

  computed: {
    // v-show 反应好像慢了点，改用这个效果也差不多
    // classPullStatus() {
    //   const { pullLoading, finished } = this.$props
    //   return {
    //     'is-loading': pullLoading,
    //     'is-finished': finished,
    //   }
    // },
  },

  mounted() {
    this.scroller = scroll.getScrollEventTarget(this.$el)
    this.handler(true)
    // console.log(this);
    if (this.immediateCheck) {
      this.$nextTick(this.onScroll)
    }
  },

  destroyed() {
    this.handler(false)
  },

  activated() {
    /* istanbul ignore next */
    this.handler(true)
  },

  deactivated() {
    /* istanbul ignore next */
    this.handler(false)
  },

  watch: {
    pullLoading() {
      // this.$nextTick(this.onScroll)
    },

    finished() {
      // this.$nextTick(this.onScroll)
    },
  },

  methods: {
    onScroll() {
      // console.log('onscroll');
      if (this.pullLoading || this.finished) {
        return
      }

      const el = this.$el
      const { scroller, offset } = this
      const visibleHeight = scroll.getVisibleHeight(scroller)

      /* istanbul ignore next */
      if (!visibleHeight) {
        return
      }

      const scrollTop = scroll.getScrollTop(scroller)
      console.log(scrollTop)

      this.$emit('getScrollTop', scrollTop)

      const targetBottom = scrollTop + visibleHeight

      let reachBottom = false
      // const reachBottom = scrollHeight - (scrollTop + visibleHeight|clientHeight) < offset

      /* istanbul ignore next */
      if (el === scroller) {
        reachBottom = scroller.scrollHeight - targetBottom < offset
      } else {
        const elBottom =
          scroll.getElementTop(el) - scroll.getElementTop(scroller) + scroll.getVisibleHeight(el)
        reachBottom = elBottom - visibleHeight < offset
      }

      // console.log(reachBottom)
      /* istanbul ignore else */
      if (reachBottom) {
        // console.log('onScrollToLower')
        // 是否需要
        // this.$emit('input', true);
        this.$emit('onScrollToLower')
      }
    },

    handler(bind) {
      /* istanbul ignore else */
      if (this.binded !== bind) {
        this.binded = bind;
        // const $root = document.querySelector('#root')
        // const $body = document.body
        // const scroller = $body;
        // NOTE: this.scroller 不行?
        // 1 浏览器对 window以及div 对象 的scroll事件全兼容
        // 2 scroll事件需要侦听对象存在滚动条，this.scroller 如果没有滚动条则不存在其对应的scroll事件触发
        (bind ? on : off)(this.scroller, 'scroll', debounce(this.onScroll, 200))
        // (bind ? on : off)(window, 'scroll', this.onScroll)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>

.vue-pull-scroll {
  // padding-top: 44px;
  // height: 100%;
  // height: 100vh;
  // overflow-y: scroll;

  .not-data{
    padding: 15px;
    text-align: center;
  }

  .pull-loading-status {
    min-height: 40px;
    // &.is-loading .pull-loading {
    //   opacity: 1;
    // }
    // &.is-finished .pull-finished {
    //   opacity: 1;
    // }
  }
  .pull-loading {
    // opacity: 0;
    padding: 8px 0;
  }
  .pull-loading-tip {
    font-size: 12px;
    margin: 0 8px;
  }
  .pull-finished {
    // opacity: 0;
    padding: 16px 0;
    font-size: 12px;
    text-align: center;
  }
}
.vue-pull-refresh__track {
  position: relative;
  transition: 0;

  // 这个属性会影响 fixed
  // transform: translate3d(0, 0, 0);
}
.vue-pull-refresh__head {
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>
