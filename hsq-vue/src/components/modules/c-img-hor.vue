<template>
  <dwd-tpl class="c-img-hor" :data="data" :data-type="data.type">
    <div class="c-img-box" :style="innerStyles">
      <div class="c-img-list">
        <div
          v-for="(item, index) in data.list"
          :key="index"
          class="c-img-item"
          :data-index="index"
          :data-link="item.link"
          @click="$onUrlPage($event)"
        >
          <img :src="item.image.url" :preload="item.image.h / item.image.w">
        </div>
      </div>
    </div>
  </dwd-tpl>
</template>

<script>
import Tpl from './tpl'

const defaultData = {
  width: 5,
  height: 3,
  list: [],
}

export default {
  name: 'c-img-hor',
  components: {
    [Tpl.name]: Tpl,
  },
  props: {
    data: {
      type: Object,
      default() {
        return defaultData
      },
      validator(value = {}) {
        return Array.isArray(value.list)
      },
    },
  },
  computed: {
    innerStyles() {
      const { width, height = 0, list = [] } = this.data
      const ratio = width ? height / width : 0
      return [ratio ? { paddingTop: `${(ratio * 100) / list.length}%` } : {}]
    },
  },
}
</script>

<style lang="stylus" scoped>
// style
// .c-img-hor{}
.c-img-box{
  position: relative;
}
.c-img-list{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  .c-img-item{
    height: 100%;
    flex: 1;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
