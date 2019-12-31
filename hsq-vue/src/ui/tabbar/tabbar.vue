<template>
  <div class="dwd-tabbar" :class="{ 'is-fixed': fixed }">
    <slot />
  </div>
</template>

<script>
/**
 * tabbar
 * @module components/tabbar
 * @desc 底部 tab，依赖 tab-item
 * @param {boolean} [fixed = false] - 固定底部
 * @param {*} value - 返回 item component 传入的 id
 *
 * @example
 * <vue-tabbar v-model="selected" @click="handleClick">
 *   <vue-tab-item id="订单">
 *     <img slot="icon" src="http://placehold.it/100x100">
 *     <span slot="label">订单</span>
 *   </vue-tab-item>
 * </vue-tabbar>
 *
 * <vue-tabbar v-model="selected" fixed>
 *   <vue-tab-item :id="['传入数组', '也是可以的']">
 *     <img slot="icon" src="http://placehold.it/100x100">
 *     <span slot="label">订单</span>
 *   </vue-tab-item>
 * </vue-tabbar>
 */
export default {
  name: 'dwd-tabbar',

  props: {
    fixed: Boolean,
    value: {
      type: String,
      default: '',
    },
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../styles/var';

// 支付宝内滚动抖动，放在滚动元素外就OK了
.dwd-tabbar {
  border-top: 1PX solid #e2e2e2;

  // TODO: 不能用*，什么问题？
  // position: absolute * 0 0 0;
  position: absolute auto 0 0 0;
  z-index: 1;
  display: flex;
  height: 49PX;
  background-color: #fff;
  text-align: center;

  &.is-fixed {
    position: fixed auto 0 0 0;
  }

  // > .vue-tab-item.is-selected {
  //   // background-color: #eaeaea;
  //   // color: #26a2ff;
  // }
}
</style>
