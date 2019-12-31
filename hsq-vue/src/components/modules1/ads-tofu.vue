<template>
  <section class="vue-ads-tofu">
    <vue-tpl
      v-for="(item, index) in $props.data.list"
      :key="index"
      class="ads-tofu-inner"
      :ratio="ratio"
    >
      <section>
        <div
          v-for="(it, idx) in item"
          :key="idx"
          :class="`item item-idx-${idx} item-len-${item.length}`"
          :data-link="it.link"
          :data-index="`${index}-${idx}`"
          @click="$goLink($event)"
        >
          <img v-lazy="it.image.url" class="image" :preload="it.image.h / it.image.w">
        </div>
      </section>
    </vue-tpl>
  </section>
</template>

<script>
// 豆腐块
import vuetpl from './vuetpl'

const defaultData = {
  // preLoad: 0.5,
  // list: [
  //   {
  //     url: '',
  //     image: '',
  //   }
  // ],
}
export default {
  name: 'vue-tofu',

  components: {
    [vuetpl.name]: vuetpl,
  },

  filters: {},

  props: {
    data: {
      type: Object,
      default() {
        return { ...defaultData }
      },
      validator(value = {}) {
        // const isArray = Array.isArray(value.list)
        // const len = isArray && value.list.length
        // return isArray && value.preLoad
        return Array.isArray(value.list)
      },
    },
  },

  data() {
    return {}
  },

  computed: {
    ratio() {
      const { width, height = 0 } = this.$props.data
      return width ? height / width : 0
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../../style/var';

.vue-ads-tofu {
  overflow hidden

  .ads-tofu-inner {
    margin-top -1px
    border-top 1px solid $color-border
    float left
    width 50%
    padding-top 50%;
    background #fff

    &:nth-of-type(2n+1) {
      border-right 1px solid $color-border
    }

    .item {
      width 100%
      float left

      &.item-len-1 {
        height 100%
      }
      &.item-len-2 {
        height 50%
      }
      &.item-idx-0.item-len-2 {
        border-bottom 1px solid $color-border
      }
      &.hor.item-len-2 {
        width 50%
        height 100%
      }
      &.hor.item-idx-0.item-len-2 {
        border-bottom none
        border-right 1px solid $color-border
      }
    }

    .image {
      width 100%
      // height auto
      height 100%
    }
  }
}
</style>
