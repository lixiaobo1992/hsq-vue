<template>
  <section ref="wrapper" class="infinite-wrapper" :style="{ height: `100vh` }">
    <div
      v-infinite-scroll="loadMore"
      class="scoll-list"
      :infinite-scroll-disabled="loading"
      :infinite-scroll-distance="distance"
    >
      <slot />
    </div>
    <div v-show="$props.loading" class="page-infinite-loading">
      <mt-spinner type="fading-circle" /> 加载中...
    </div>
    <div v-if="loadoverTip" class="scroll-loadover">{{ loadoverTip }}</div>
  </section>
</template>

<script>
import { Spinner } from 'mint-ui'

export default {
  name: 'vue-scroll',

  components: {
    [Spinner.name]: Spinner,
  },

  props: {
    loading: Boolean,
    loadoverTip: String,
    distance: {
      type: Number,
      default: 200,
    },
  },

  data() {
    return {
      // list: [],
      // loading: false,
      // allLoaded: false,
      wrapperHeight: 0,
    }
  },

  mounted() {
    // 可见区域高度 - 元素顶部相对视窗的位置
    this.wrapperHeight =
      document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
    console.log(this.wrapperHeight)
  },

  methods: {
    loadMore() {
      // console.log(1111)
      // this.loading = true
      this.$emit('scrolltolower')
    },
  },
}
</script>
