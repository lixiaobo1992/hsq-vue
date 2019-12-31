<template>
  <dwd-tpl class="c-swiper" :data="data" :data-type="data.type">
    <div class="c-swiper-boc" :style="innerStyles">
      <div class="c-swiper" :style="blockStyle">
        <Swiper
          ref="swipe"
          :interval="auto"
          :duration="speed"
          :auto-play="continuous"
          :show-indicator="showIndicators"
          @transtionend="changeIndex"
        >
          <Slide
            v-for="(item, index) in data.list"
            :key="index"
            :class="{
              'layout-1': data.layout == 1,
            }"
          >
            <div class="swiper-image" :data-link="item.link" @click="$onUrlPage($event)">
              <img :src="item.image.url" :preload="item.image.h / item.image.w">
            </div>
          </Slide>
        </Swiper>
      </div>
    </div>
  </dwd-tpl>
</template>

<script>
import { Swiper, Slide } from '../vue-swiper'
import Tpl from './tpl'

const defaultData = {
  width: 5,
  height: 3,
  list: [],
}

export default {
  name: 'c-swiper',
  components: {
    [Tpl.name]: Tpl,
    Swiper,
    Slide,
  },
  props: {
    // speed: {
    //   // 动画持时（毫秒）
    //   type: Number,
    //   default: 1000,
    // },
    // auto: {
    //   // 自动播放的时间间隔（毫秒）
    //   type: Number,
    //   default: 6000,
    // },
    // continuous: {
    //   // 是否可以循环播放
    //   type: Boolean,
    //   default: true,
    // },
    // showIndicators: {
    //   type: Boolean,
    //   default: true,
    // },
    data: {
      type: Object,
      default() {
        return { ...defaultData }
      },
      validator(value = {}) {
        return Array.isArray(value.list)
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    // 是否显示 indicators
    showIndicators() {
      return !!this.data.dots
    },
    continuous() {
      return !!this.data.auto
    },
    auto() {
      return +this.data.interval + 1000
    },
    speed() {
      return this.data.speed || 1000
    },
    innerStyles() {
      const { width, height = 0, layout } = this.data
      const containerWidth = layout == 1 ? window.innerWidth - 32 : window.innerWidth
      const newHeight = width ? (height * containerWidth) / width : 0
      return [newHeight ? { paddingTop: `${newHeight}px` } : {}]
    },
    blockStyle() {
      const { list, layout } = this.data
      if (!list || !list.length) {
        return
      }
      if (layout == 1) {
        return [{ padding: `0 12px` }]
      } else {
        return []
      }
    },
  },
  methods: {
    changeIndex(index) {
      const { list = [] } = this.data
      if (list.length <= 1) {
        return
      }
      this.$emit('change', index)
    },
  },
}
</script>

<style lang="stylus" scoped>
.c-swiper-container{
  background-color: transparent;
}
.c-swiper-boc{
  position: relative;
  .c-swiper{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    .swiper-image{
      width: 100%;
      height: 100%;
      img{
        box-shadow: rgba(224, 224, 224, 0.5) 0px 4px 8px 0px;
        width: 100%;
        height: 100%;
      }
    }
    >>>.wh_swiper{
      width: 100%;
      height: 100%;
    }
    >>>.wh_content{
      width: 100%;
      height: 100%;
      overflow: unset;
    }
    >>>.layout-1{
      padding: 0 2px 0;
      .swiper-image{
        img{
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
