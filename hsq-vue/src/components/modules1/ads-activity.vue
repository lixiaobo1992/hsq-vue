<template>
  <section v-if="$props.data.list.length" class="vue-activity">
    <div
      v-for="(item, index) in $props.data.list"
      :key="index"
      class="item"
      :data-link="item.jump_url"
      @click="$goLink($event)"
    >
      <img v-lazy="item.image.url" class="image" :preload="item.image.h / item.image.w">
      <div v-if="item.label" class="text ellipsis">{{ item.label }}</div>
    </div>
  </section>
</template>

<script>
// banner
// import { Swipe, SwipeItem } from 'mint-ui'
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
  name: 'vue-activity',

  components: {
    [vuetpl.name]: vuetpl,
  },

  props: {
    data: {
      type: Object,
      default() {
        return { ...defaultData }
      },
      validator(value = {}) {
        return Array.isArray(value.list)
      },
    },
    // preLoad: VueTypes.number.def(1),
    // list: VueTypes.array,
  },

  data() {
    return {
      // swiperInfo: {
      //   preLoad: 0.5,
      //   list: [
      //     {
      //       url: '',
      //       image: '',
      //     }
      //   ],
      // },
    }
  },

  computed: {
    // ratio() {
    //   const { width, height } = this.$props.data
    //   return height / width
    // },
  },

  created() {
    // console.log(this.data)
  },

  mounted() {
    // console.log(this.data)
  },
}
</script>

<style lang="stylus" scoped>
@import '../../style/var';

.vue-activity {
  .item {
    background: #fff;

    & + .item {
      margin-top: 5px;
    }
  }

  .text {
    padding: 8px 10px 12px 16px;
    font-size: 15px;
  }

  .image {
    width: 100%;
  }
}
</style>
