<template>
  <div class="input-number" :class="inputNumberClass">
    <div class="btn-less" @click.stop="clickEvent(0)" />
    <input
      :ref="refId"
      class="input-bar"
      type="number"
      :value="num"
      @keyup="inputChange"
      @blur="onBlur"
    >
    <div class="btn-add" @click.stop="clickEvent(1)" />
  </div>
</template>

<script>
export default {
  name: 'dwd-input-number',
  props: {
    value: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: 'normal',
    },
    styleType: {
      type: String,
      default: 'not-border',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      num: 1,
    }
  },
  computed: {
    inputNumberClass: function () {
      return `nput-number-${this.size} input-number-${this.styleType} ${
        this.disabled ? 'disabled' : ''
      }`
    },
    refId: function () {
      return 'inputNumber_' + this._uid
    },
  },
  watch: {
    value(newVal, oldVal) {
      this.num = newVal
    },
  },
  created() {
    // console.log(this)
  },
  methods: {
    inputChange(e) {
      let num = +e.key
      if (!isNaN(num)) {
        this.delNum(num)
      }
    },
    delNum(num) {
      if (num > this.num) {
        if (this.max > 0 && num > this.max) {
          num = this.max
          this.$showToast(`最多只能买${this.max}件哦！`)
          // return;
        }
      } else {
        if (this.min > 0 && num < this.min) {
          num = this.min
          this.$showToast(`最少买${this.min}件哦！`)
          // return;
        }
      }

      // console.log(num);
      if (num == this.num) {
        // console.log(this.$refs, this.refId)
        // console.log(this.$refs[this.refId].target.value);
        this.$refs[this.refId].value = num
      } else {
        this.num = num
        this.$emit('onchange', { value: num })
      }
    },
    clickEvent(tag) {
      if (tag == 1) {
        // 加
        this.delNum(this.num + 1)
      } else {
        // 减
        this.delNum(this.num - 1)
      }
    },

    onBlur(e) {
      // console.log(e);
      const val = e.target.value
      // console.log(val)
      if (!val) {
        if (val == this.num) {
          e.target.value = this.num
        } else {
          this.delNum(val)
        }
      }
    },
  },
}
</script>
<style lang="stylus" scoped>

.input-number{
  width: 120px;
  border: 1px solid #E2E2E2;
  border-radius: 3px;
  height: 30px;
  padding: 0 35px;
  overflow: hidden;

  position: relative;

  .btn-less, .btn-add{
    position: absolute;
    top: 0;

    text-align: center;
    width: 35px;
    height: 30px;
    font-size: 15px;
    color: #999999;
  }
  .btn-less{
    left: 0;
  }

  .btn-add{
    right: 0;
  }
  .btn-less:before,.btn-add:before,.btn-add:after{
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    border-radius: 1px;
    background-color: #333;
  }

  .btn-less:before, .btn-add:before{
    width: 15px;
    height: 1px;
  }
  .btn-add:after{
    width: 1px;
    height: 15px;
  }


  .input-bar{
    width: 100%;
    height: 30px;
    border: none;
    background: none;
    text-align: center;
    font-size: 14px;
    color: #212121;
    border-left: 1px solid #E2E2E2;
    border-right: 1px solid #E2E2E2;
    padding: 0;
    margin: 0;
  }
}
</style>
