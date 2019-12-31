<template>
  <mt-swipe-item class="dwd-swiper-item"> <slot /> </mt-swipe-item>
</template>

<script>
import { SwipeItem } from 'mint-ui'
export default {
  name: 'dwd-swiper-item',
  components: {
    [SwipeItem.name]: SwipeItem,
  },
  created() {
    this.swipeItemCreated = this.$parent.swipeItemCreated
    this.swipeItemDestroyed = this.$parent.swipeItemDestroyed
  },
  // methods: {

  // },
}
</script>

<style lang="stylus" scoped></style>
