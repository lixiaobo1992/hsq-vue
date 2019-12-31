<template>
  <dwd-tpl class="c-img" :data="data" :data-type="data.type">
    <div
      v-for="(item, index) in data.list"
      :key="index"
      class="c-img-item"
      :data-link="item.link"
      :data-index="index"
      :style="{ paddingTop: (item.image.h * 100) / item.image.w + '%' }"
      @click="$onUrlPage($event)"
    >
      <img class="image" :src="item.image.url" :preload="item.image.h / item.image.w">
    </div>
  </dwd-tpl>
</template>

<script>
// 单张图banner
import Tpl from './tpl'

const defaultData = {
  width: 5,
  height: 3,
  list: [{ image: { url: '', w: 0, h: 0 }, link: '' }],
}
export default {
  name: 'c-img',
  components: {
    [Tpl.name]: Tpl,
  },
  props: {
    data: {
      type: Object,
      default() {
        return { ...defaultData }
      },
    },
  },

  // data() {
  //   return {};
  // },

  computed: {
    //
  },
}
</script>

<style lang="stylus" scoped>
@import '../../style/var';

.c-img {
  overflow: hidden;
  // margin-bottom: 10px;

  .c-img-item{
    position: relative;
    left: 0;
    top: 0;
    line-height: 0;
    font-size: 0;
    overflow: hidden;
  }
  .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
    vertical-align: middle;
  }
}
</style>
