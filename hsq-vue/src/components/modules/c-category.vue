<template>
  <dwd-tpl class="c-category" :data="data" :data-type="data.type">
    <div class="category-temp-box" :class="boxClassName">
      <section ref="categoryBox" class="c-category-scroll" :class="boxClassName">
        <div ref="categoryWrapper" class="category-wrapper">
          <div
            v-for="(itemList, listIndex) in categoryData"
            :key="listIndex"
            class="category-list"
            :class="listClassName"
          >
            <div
              v-for="(item, index) in itemList"
              :key="item.label + index"
              class="category-item"
              :data-link="item.link"
              :data-index="index"
              @click="$onUrlPage($event)"
            >
              <div class="label-image">
                <img v-lazy="item.image.url" class="full" :preload="1">
              </div>
              <div class="label-text">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-show="isShowSchedule" class="schedule-box">
      <div ref="scheduleBar" class="schedule-bar">
        <span ref="scheduleBarThumb" :style="scheduleSpanStyle" />
      </div>
    </div>
  </dwd-tpl>
</template>

<script>
import Tpl from './tpl'
import scroll from '@/utils/scroll'
import { on, off } from '@/utils/event'
// row 行
// col 列
export default {
  name: 'c-category',
  components: {
    [Tpl.name]: Tpl,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
      validator(value = {}) {
        return Array.isArray(value.list)
      },
    },
  },
  data() {
    return {
      // categoryData: [],
      // 滚动条样式
      scheduleSpanStyle: {
        width: '50%',
        left: 0,
      },
    }
  },
  computed: {
    innerStyles() {
      return []
    },
    boxClassName() {
      return this.data.row == 1 ? 'row1' : 'row2'
    },
    listClassName() {
      return this.data.col == 4 ? 'col4' : ''
    },
    categoryData() {
      // 这里行数写死了，1 or 2
      const { list = [], row = 1 } = this.data
      let categoryData = []
      if (row == 1) {
        categoryData.push(list)
      } else {
        // let sum = Math.ceil(list.length / 2);
        // sum = sum < col ? col : sum;
        // const firstRow = list.slice(0, sum);
        // const lastRow = list.slice(sum, list.length);
        const firstRow = [],
          lastRow = []
        list.forEach((it, i) => {
          if (i % 2 == 0) {
            firstRow.push(it)
          } else {
            lastRow.push(it)
          }
        })
        categoryData = [firstRow, lastRow]
      }
      return categoryData
    },
    isShowSchedule() {
      const { list = [], col = 5, row = 1 } = this.data
      if ((col == 4 || col == 5) && ((row == 1 || row == 2) && list.length > col * row)) {
        return true
      }
      return false
    },
  },
  watch: {
    categoryData(newVal) {
      // this.$nextTick(() => {
      //   this.updatedScheduleBar();
      // });
    },
  },
  created() {
    //
    // this.categoryBox = this
  },
  mounted() {
    // this.scroller = scroll.getScrollEventTarget(this.$refs.categoryBox);
    // console.log(this.$refs);
    this.$nextTick(() => {
      this.categoryBox = this.$refs.categoryBox
      this.categoryWrapper = this.$refs.categoryWrapper

      this.scheduleBar = this.$refs.scheduleBar
      this.scheduleBarThumb = this.$refs.scheduleBarThumb
      this.updatedScheduleBar()
    })

    this.handler(true)
  },
  // updated() {
  //   this.$nextTick(() => {
  //     this.updatedScheduleBar();
  //   });
  // },
  methods: {
    //
    handler(bind) {
      /* istanbul ignore else */
      if (this.binded !== bind) {
        this.binded = bind;
        (bind ? on : off)(this.$refs.categoryBox, 'scroll', this.onScheduleScroll)
      }
    },
    onScheduleScroll() {
      const element = this.$refs.categoryBox
      let scrollLeft = 'scrollLeft' in element ? element.scrollLeft : element.pageXOffset
      // console.log('scrollLeft', scrollLeft);
      const conentWidth = this.categoryWrapper.scrollWidth
      const scheduleBarWidth = this.scheduleBar.getBoundingClientRect().width
      const scheduleBarThumbWidth = this.scheduleBarThumb.getBoundingClientRect().width
      // console.log(`(${scrollLeft}/${conentWidth})*${scheduleBarWidth}`);
      // const scale = ;
      scrollLeft = Math.floor(((scrollLeft * 2) / conentWidth) * scheduleBarWidth) * 2
      // console.log(scrollLeft);
      if (scrollLeft > scheduleBarWidth - scheduleBarThumbWidth) {
        scrollLeft = scheduleBarWidth - scheduleBarThumbWidth
      }
      this.scheduleSpanStyle.left = scrollLeft + 'px'
    },
    updatedScheduleBar() {
      // const { overflowX } = scroll.getComputedStyle(this.categoryBox);
      // console.log(overflowX);
      // if (overflowX == 'scroll' || overflowX == 'auto') {
      //   this.isShowSchedule = true;
      // }
      const visibleWidth = this.categoryBox.getBoundingClientRect().width
      const conentWidth = this.categoryWrapper.scrollWidth
      const scheduleBarWidth = this.scheduleBar.getBoundingClientRect().width
      // console.log(
      //   'conentWidth',
      //   conentWidth,
      //   'visibleWidth',
      //   conentWidth,
      //   'scheduleBarWidth',
      //   scheduleBarWidth
      // );
      const scheduleBarThumbWidth = Math.ceil((visibleWidth / conentWidth) * scheduleBarWidth) / 2
      // console.log('scheduleBarThumbWidth', scheduleBarThumbWidth);
      this.scheduleSpanStyle.width = `${scheduleBarThumbWidth}px`
    },
  },
}
</script>

<style lang="stylus" scoped>
.c-category{
  background-color: #fff;
}
.category-temp-box {
  overflow: hidden;
  &.row1{
    height: 76px;
  }
  &.row2{
    height: 152px;
  }
}
.c-category-scroll{
  width: 100%;
  overflow-x:auto;
  overflow-y:hidden;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }
  &.row1{
    height: 91px;
  }
  &.row2{
    height: 167px;
  }
  .category-list{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    .category-item{
      flex: 0 0 20%;
      margin: 5px 0;
      max-width: 20%;
      display: flex;
      align-content: flex-start;

      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      .label-image{
        width: 45px;
        height: 45px;
      }
      .label-text{
        display: block;
        width: 100%;
        font-size: 12px;
        text-align: center;
        color: #666;
        margin-top: 4px;
        line-height: 17px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
      }
    }

    &.col4{
      .category-item{
        flex: 0 0 25%;
        max-width: 25%;
      }
    }
  }

}
.schedule-box{
  width: 100%;
  position: relative;
  padding: 5px 0;

  .schedule-bar{
    width: 40px;
    height: 3px;
    margin: 0 auto;
    background-color: #ccc;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    span{
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 15px;
      height: 3px;
      border-radius: 3px;
      background-color: #FE0137;
    }
  }
}
</style>
