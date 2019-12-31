<template>
  <div v-if="isValid" class="dwd-tpl-wrapper" :style="styles">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'dwd-tpl',

  components: {
    // [swiper.name]: swiper,
  },

  props: {
    data: {
      type: Object,
    },
  },

  data() {
    return {}
  },

  computed: {
    isValid() {
      const { list } = this.data
      return list && list.length
    },
    styles() {
      const { bg, bg_color, margin_bottom, margin_top, margin_lr } = this.data

      return [
        bg ? { backgroundImage: `url(${bg.url})` } : {},
        bg_color ? { backgroundColor: bg_color } : {},
        margin_top ? { marginTop: `${margin_top}px` } : {},
        margin_bottom ? { marginBottom: `${margin_bottom}px` } : {},
        margin_lr ? { marginLeft: `${margin_lr}px` } : {},
        margin_lr ? { marginRight: `${margin_lr}px` } : {},
      ]
    },
  },

  methods: {},
}
</script>

<style lang="stylus" scoped>
@import '../../style/var';

.dwd-tpl-wrapper {
  position: relative;
  // height: 0;
  overflow: hidden;
  // background-size: 100% auto;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  // background-color: #fff;
}
</style>
