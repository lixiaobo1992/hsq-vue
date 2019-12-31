<template>
  <a
    class="dwd-tab-item"
    :class="{ 'is-selected': $parent.value === id }"
    @click="$parent.$emit('tab-click', id, $event)"
  >
    <div class="item-icon">
      <img v-if="$parent.value !== id" :src="iconPath" class="icon-img" :alt="id">
      <img v-if="$parent.value === id" :src="activeIconPath" class="icon-img" :alt="id">
    </div>
    <div class="item-text"><slot /></div>
  </a>
</template>

<script>
/**
 * tab-item
 * @module components/tab-item
 * @desc 搭配 tabbar 或 navbar 使用
 * @param {*} id - 选中后的返回值，任意类型
 * @param {string} [id] - key
 * @param {string} [iconPath] - icon 图标路径
 * @param {string} [activeIconPath] - 选择高亮
 * @param {string} [text] - 文字
 *
 * @example
 * <vue-tab-item>
 *   <img slot="icon" src="http://placehold.it/100x100">
 *   订单
 * </vue-tab-item>
 */
export default {
  // 数据应以对象形式传入，点击时返回当前数据
  name: 'dwd-tab-item',

  props: {
    id: [Number, String],
    iconPath: String,
    activeIconPath: String,
    text: String,
  },
  beforeMount() {
    // console.log(this.icon)
  },
}
</script>

<style lang="stylus" scoped>
.dwd-tab-item {
  display: block;
  padding: 4PX 0 4PX;
  flex: 1;
  text-decoration: none;
  user-select: none;
  height: 100%;

  &.is-selected .item-icon {
    color: #fdf187;
  }

  .item-icon {
    size: 24PX;
    margin: 0 auto 4PX;
    color: #dbdbdb;

    &:empty {
      display: none;
    }

    & > * {
      display: block;
      size: 100%;
    }
  }

  .item-text {
    color: inherit;
    font-size: 12PX;
    line-height: 1;
  }
}
</style>
