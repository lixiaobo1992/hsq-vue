<template>
  <dwd-tpl class="c-tofu" :data="data" :data-type="data.type">
    <section class="c-tofu-box" :class="{ [`layout-${data.layout}`]: !!data.layout }">
      <div
        v-for="(item, index) in data.list"
        :key="index"
        :class="`c-tofu-item item-idx-${index} item-len-${data.list.length}`"
        :data-link="item.link"
        :data-index="index"
        @click="$onUrlPage($event)"
      >
        <img v-lazy="item.image.url" class="image" :preload="item.image.h / item.image.w">
      </div>
    </section>
  </dwd-tpl>
</template>

<script>
import Tpl from './tpl'

// c-tofu
// 需要做 layout 检测，不存在的layout，则此模块不渲染
// 数字代表数据个数，- 分割多列，多位数表示多行
const layouts = [
  '1-1', // 两列一行
  '1-11',
  '1-12', // 两列，第二列 1+2 两行
  '1-2-2',
  '2-2',
  '2-2-2',
]

const defaultData = {
  width: 5,
  height: 3,
  list: [],
}

export default {
  name: 'c-tofu',
  components: {
    [Tpl.name]: Tpl,
  },
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
  computed: {
    //
  },
}
</script>

<style lang="stylus" scoped>
@import '../../style/var';
.c-tofu {
  overflow: hidden;
  padding-top: 60%;
  // &:nth-of-type(2n+1) {
  //   border-right 1px solid $color-border
  // }

  .c-tofu-box{
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    overflow: hidden;
  }

  // 使用有边框以及下边框，为什么
  // 虽然不如左上边框实现简单，但如果存在部分数据缺失，边界完整
  .c-tofu-item {
    float left
    height 50%
    // border-right: 1px solid $color-border
    // border-bottom: 1px solid $color-border
  }

  .c-tofu-item:nth-of-type(1) {
    width 40%;
    height 100%;
  }

  .layout-1-1 {
    .c-tofu-item {
      width: 50%;
      height: 100%;
      border-bottom: none;
    }
    .c-tofu-item:nth-of-type(2) {
      border-right: none;
    }
  }
  .layout-1-11 {
    // n >= 0
    .c-tofu-item:nth-of-type(n+2) {
      width: 60%;
      border-right: none;
    }
    .c-tofu-item:nth-of-type(1),
    .c-tofu-item:nth-of-type(3) {
      border-bottom: none;
    }
  }
  .layout-1-12 {
    .c-tofu-item:nth-of-type(2) {
      width: 60%;
    }
    .c-tofu-item:nth-of-type(n+3) {
      width: 30%;
    }
    .c-tofu-item:nth-of-type(2),
    .c-tofu-item:nth-of-type(4) {
      border-right: none;
    }
    .c-tofu-item:nth-of-type(1),
    .c-tofu-item:nth-of-type(n+3) {
      border-bottom: none;
    }
  }
  .layout-1-2-2 {
    .c-tofu-item {
      width: 30%;
    }
    .c-tofu-item:nth-of-type(1) {
      width: 40%;
    }
    .c-tofu-item:nth-of-type(2n+3) {
      border-right: none;
    }
    .c-tofu-item:nth-of-type(1),
    .c-tofu-item:nth-of-type(n+4) {
      border-bottom: none;
    }
  }
  .layout-2-2 {
    .c-tofu-item {
      width: 50%;
      height: 50%;
    }
    .c-tofu-item:nth-of-type(2n) {
      border-right: none;
    }
    .c-tofu-item:nth-of-type(n+3) {
      border-bottom: none;
    }
  }
  .layout-2-2-2 {
    .c-tofu-item {
      width: 33.3333%;
      height: 50%;
    }
    .c-tofu-item:nth-of-type(3n) {
      border-right: none;
    }
    .c-tofu-item:nth-of-type(n+4) {
      border-bottom: none;
    }
  }

  .image {
    width 100%
    // height auto
    height 100%
  }
}
</style>
