<template>
  <div v-if="isValid" class="c-labels flex-around" :data-type="data.type">
    <div v-for="(item, index) in data.list" :key="index" :class="`item`">
      <img v-lazy="item.icon" class="image" :preload="1">
      <span class="text">{{ item.text }}</span>
    </div>
  </div>
</template>

<script>
// import vuetpl from './vuetpl'

// c-tofu
// 需要做 layout 检测，不存在的layout，则此模块不渲染
// 数字代表数据个数，- 分割多列，多位数表示多行

const defaultData = {
  width: 5,
  height: 3,
  list: [],
}
export default {
  name: 'c-labels',

  components: {
    // [vuetpl.name]: vuetpl,
  },

  filters: {},

  props: {
    data: {
      type: Object,
      default() {
        return { ...defaultData }
      },
      validator(value = {}) {
        if (process.env.VUE_ADMIN) {
          return true
        }
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
    isValid() {
      if (process.env.VUE_ADMIN) {
        return true
      }
      const { list } = this.data
      return list.length > 0
    },
    ratio() {
      const { width, height = 0 } = this.data
      return width ? height / width : 0
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../../style/var';

.c-labels {
  overflow: hidden;
  height: 40px;
  font-size: 12px;
  color: $color-text;
  background-color: #fff;
  border-bottom: 1px solid $color-border;

  .item {
    display: inline-flex;
    align-items: center;
  }

  .image {
    margin-right: 4px;
    size: 16px;
  }

}
</style>
