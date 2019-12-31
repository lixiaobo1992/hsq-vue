<template>
  <div
    class="dwd-header"
    :class="{
      'is-fixed': fixed && !absolute,
      'is-absolute': absolute && !fixed,
    }"
  >
    <div class="dwd-header-left">
      <slot name="default-left">
        <i v-show="_leftOptions.showBack" class="left-arrow" @click="onClickBack" />
        <a v-show="_leftOptions.showBack" class="dwd-header-back" @click="onClickBack">
          {{ typeof _leftOptions.backText === 'undefined' ? '返回' : _leftOptions.backText }}
        </a>
      </slot>
      <!-- 自定义 -->
      <slot name="left" />
    </div>
    <!-- 标题 -->
    <h1 class="dwd-header-title" @click="$emit('on-click-title')">
      <slot>
        <span> {{ title }} </span>
      </slot>
    </h1>
    <div class="dwd-header-right">
      <a
        v-if="rightOptions.showMore"
        class="dwd-header-more"
        @click.prevent
        @click.exact="$emit('on-click-more')"
      />
      <slot name="right" />
    </div>
  </div>
</template>

<script>
/**
 * dwd-header
 * @module components/header
 * @desc 顶部导航
 * @param {boolean} [fixed=false] - 固定顶部
 * @param {string} [title] - 标题
 * @param {Object} [left-options] left选项
 * {
 *    showBack: [boolean], // 是否显示左侧返回按钮
 *    backText: [string] // 是否显示 左侧文本
 * }
 * @param {Object} [right-options] right选项
 * {
 *    showMore: [boolean],
 * }
 * @param {slot} [default-left] - 显示在左侧的默认区域
 * @param {slot} [left] - 显示在左侧区域
 * @param {slot} [right] - 显示在右侧区域
 *
 * @example
 * <dwd-header title="我是标题" fixed>
 * </dwd-header>
 */

export default {
  name: 'dwd-header',

  props: {
    fixed: Boolean,
    absolute: Boolean,
    title: String,
    leftOptions: Object,
    rightOptions: {
      type: Object,
      default: function () {
        return {
          showMore: false,
        }
      },
    },
  },
  computed: {
    _leftOptions() {
      return Object.assign(
        {
          showBack: true,
          // preventGoBack: false
        },
        this.leftOptions || {}
      )
    },
  },
  methods: {
    onClickBack() {
      // console.log(this._events);
      if (Object.keys(this._events).indexOf('on-click-back') > -1) {
        this.$emit('on-click-back')
      } else {
        const { history } = window
        // 处理当第一次进入页面时候返回首页
        if (history.length === 1) {
          this.$forward('index')
        } else {
          this.$router ? this.$router.back() : window.history.back()
        }
      }
    },
  },
}
</script>

<style lang="stylus">
/*scoped ???*/
@import './styles/fn.styl';
@import './styles/var.styl';

.dwd-header{
  position: relative;
  z-index: 500;
  padding: 2px 0;
  box-sizing: border-box;
  background-color: $header-background-color;
  &:after {
    setBottomLine(#e1e1e1);
  }
  &.is-fixed {
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom: auto;
  }
  &.is-absolute {
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom: auto;
  }
  .dwd-header-left,.dwd-header-right {
    position: absolute;
    top: 0px;
    height: 100%;
    display: block;
    font-size: 14px;
    // line-height: 20px;
    display: flex;
    align-items: center;
    color: $header-text-color;
  }
  .dwd-header-left a,.dwd-header-left button,.dwd-header-right a,.dwd-header-right button{
    float: left;
    margin-right: 8px;
    color: $header-text-color;
  }
  .dwd-header-left a:active,.dwd-header-left button:active,.dwd-header-right a:active,.dwd-header-right button:active{
    opacity: .5
  }
  // 左侧
  .dwd-header-left{
    left: 15px;
    .dwd-header-back{
      padding-left: 16px;
    }

    .left-arrow {
      position: absolute;
      width: 30px;
      height: 30px;
      left: -5px;
      top: 8px;
      &:before {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        border: 1px solid $header-arrow-color;
        border-width: 2px 0 0 2px;
        transform: rotate(315deg);
        top: 8px;
        left: 7px;
      }
    }

  }
  // 标题
  .dwd-header-title {
    margin: 0 88px;
    line-height: 40px;
    height: 40px;
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    color: $header-title-color;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    >span{
      vertical-align: middle;
    }
  }
  // 右侧
  .dwd-header-right {
    right: 15px;
    a,button{
      float: right;
      margin-left: 8px;
      margin-right: 0;
    }
    .dwd-header-more:after {
      content: "\2022\0020\2022\0020\2022\0020";
      font-size: 12px;
    }
  }

}
</style>
