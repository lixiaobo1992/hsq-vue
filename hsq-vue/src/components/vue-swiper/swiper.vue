<template>
  <section class="wh_content" @touchmove="fn">
    <div
      :class="className"
      class="wh_swiper"
      @touchstart="s"
      @touchmove="m"
      @touchend="e"
    >
      <slot />
    </div>
    <div v-if="showIndicator" class="wh_indicator">
      <div
        v-for="(tag, $index) in slidesLength"
        :key="$index"
        :class="{ wh_show_bgcolor: index - 1 == $index }"
        class="wh_indicator_item"
      />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    // 自动滑动
    autoPlay: {
      type: Boolean,
      default: true,
    },
    // actions一次滑动需要走多久，速度
    duration: {
      type: Number,
      default: 2000,
    },
    // 两次滑动间隔的时间
    interval: {
      type: Number,
      default: 6000,
    },
    showIndicator: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      slidesLength: 1,
      newWieth: 0,
      auto: true,
      slideing: true,
      timer1: '',
      className: '',
      dom: {},
      t: {
        sx: 0,
        s: 0,
        m: 0,
        e: 0,
      },
      index: 1,
    }
  },
  mounted() {
    this.className = `wh_swiper_${Math.random().toFixed(3) * 1000}`
    setTimeout(() => {
      // 克隆dom
      this.starDom()
      console.log('++++++++ ', this.newWieth)
      this.dom.transform = `translate3d(${this.newWieth * -1}px, 0px, 0px)`
      this.dom['-webkit-transform'] = `translate3d(${this.newWieth * -1}px, 0px, 0px)`
      this.dom['-ms-transform'] = `translate3d(${this.newWieth * -1}px, 0px, 0px)`
      if (this.autoPlay) {
        this.setTime()
      }
    }, 50)
  },
  methods: {
    s(x) {
      if (this.slideing) {
        this.clearTimeOut()
        this.t.sx = this.getTransform()
        this.t.s = x.touches[x.touches.length - 1].clientX
      }
    },
    m(x) {
      if (this.slideing && this.t.s != -1) {
        this.clearTimeOut()
        this.t.m = x.touches[x.touches.length - 1].clientX - this.t.s
        this.setTransform(this.t.m + this.t.sx)
      }
    },
    e(x) {
      if (this.slideing && this.t.s != -1) {
        this.clearTimeOut()
        this.setTransform(this.t.m + this.t.sx)
        var newX = this.getTransform()
        newX += this.t.m > 0 ? this.newWieth * 0.3 : this.newWieth * -0.3
        this.index = Math.round(newX / this.newWieth) * -1
        this.wh('touch')
      }
    },
    setTransform(num) {
      this.dom.transform = `translate3d(${num}px, 0px, 0px)`
      this.dom['-webkit-transform'] = `translate3d(${num}px, 0px, 0px)`
      this.dom['-ms-transform'] = `translate3d(${num}px, 0px, 0px)`
    },
    getTransform() {
      var x = this.dom.transform || this.dom['-webkit-transform'] || this.dom['-ms-transform']
      x = x.substring(12)
      x = x.match(/(\S*)px/)[1]
      return Number(x)
    },
    fn(e) {
      // e.preventDefault();
    },
    prevSlide() {
      this.clearTimeOut()
      this.index--
      this.wh()
    },
    nextSlide() {
      this.clearTimeOut()
      this.index++
      this.wh()
    },
    slideTo(index) {
      this.clearTimeOut()
      this.index = index + 1
      this.wh()
    },
    wh(type) {
      this.slideing = false
      this.dom.transition = type == 'touch' ? '250ms' : this.duration + 'ms'
      this.setTransform(this.index * -1 * this.newWieth)
      this.t.m = 0
      this.t.s = -1 //保证下次重新赋值
      if (this.autoPlay) {
        this.setTime()
      }
      var timeDuration = type == 'touch' ? '250' : this.duration
      setTimeout(() => {
        this.dom.transition = '0s'
        if (this.index >= this.slidesLength + 1) {
          this.index = 1
          this.setTransform(this.index * -1 * this.newWieth)
        }
        if (this.index <= 0) {
          this.index = this.slidesLength
          this.setTransform(this.index * -1 * this.newWieth)
        }
        this.$emit('transtionend', this.index - 1)
        this.auto = true
        this.slideing = true
      }, timeDuration)
    },
    setTime() {
      this.timer1 = window.setTimeout(() => {
        if (this.auto) {
          this.index++
          this.wh()
        } else {
          window.clearTimeout(this.timer1)
        }
      }, this.interval)
    },
    starDom() {
      var SlideDom = document
        .querySelector('.' + this.className)
        .getElementsByClassName('wh_slide')
      this.slidesLength = SlideDom.length
      if (this.slidesLength > 1) {
        var cloneDom1 = SlideDom[0].cloneNode(true) //向最后append
        var cloneDom2 = SlideDom[this.slidesLength - 1].cloneNode(true) //向最前append
        document.querySelector('.' + this.className).insertBefore(cloneDom2, SlideDom[0])
        document.querySelector('.' + this.className).appendChild(cloneDom1)
        this.newWieth = document.querySelector('.' + this.className).offsetWidth
        this.dom = document.querySelector('.' + this.className).style
      }
    },
    clearTimeOut() {
      this.auto = false
      window.clearTimeout(this.timer1)
    },
  },
}
</script>

<style>
.wh_content {
  position: relative;
  z-index: 1;
  overflow: hidden;
  width: 100%;
}

.wh_swiper {
  width: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -moz-transition-duration: 0s linear;
  -webkit-transition-duration: 0s linear;
  -o-transition-duration: 0s linear;
  transition-duration: 0s linear;
}

.wh_indicator {
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  background: 0 0;
}

.wh_indicator_item {
  display: inline-block;
  width: 8px;
  height: 3px;
  margin: 0 3px;
  cursor: pointer;
  border-radius: 2px;
  background: #fff;
}

.wh_show_bgcolor {
  background: #fe0137;
}
</style>
