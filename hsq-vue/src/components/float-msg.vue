<template>
  <div class="msg-box">
    <transition v-for="(item, index) in msgData" :key="index" name="fade">
      <div v-if="index == activeIndex" class="msg-item" @click="gotoDetail(item)">
        <div class="msg-pic">
          <img class="full" :src="item.thumbnail" alt="">
        </div>
        <p class="msg-text">{{ item.text }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
let tempIndex = -1
let interTime = null
export default {
  name: 'dwd-float-msg',
  props: {
    msgData: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      activeIndex: -1,
      duration: 7000,
    }
  },
  computed: {
    // msgData() {
    //   return [
    //     {
    //       avatar: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
    //       user_name: 'xxx1',
    //     },
    //     {
    //       avatar: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
    //       user_name: 'xxx2',
    //     },
    //     {
    //       avatar: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
    //       user_name: 'xxx3',
    //     },
    //     {
    //       avatar: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
    //       user_name: 'xxx4',
    //     },
    //     {
    //       avatar: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
    //       user_name: 'xxx5',
    //     },
    //   ];
    // },
  },
  watch: {
    msgData(newVal, oldVal) {
      // console.log('来新数据了', newVal);
      this.startCarousel()
    },
  },
  mounted() {
    this.startCarousel()
  },
  updated() {
    // console.log('float-msg updated');
  },
  methods: {
    startCarousel() {
      // console.log('开始');
      if (this.msgData.length) {
        this.start()
      } else {
        this.stop()
      }
    },
    start() {
      this.stop()
      this.activeIndex = -1
      tempIndex = -1
      this.change()
      this.interTime = setInterval(() => {
        this.change()
      }, this.duration)
    },
    stop() {
      clearInterval(this.interTime)
    },
    change() {
      // console.log('change:', tempIndex, parseInt(new Date().getTime() / 1000));
      if (tempIndex == this.msgData.length - 1) {
        tempIndex = -1
        this.stop()
      } else {
        tempIndex++
      }
      console.log(tempIndex)
      if (tempIndex == 0 && this.activeIndex < this.msgData.length - 1) {
        this.activeIndex = tempIndex
      } else {
        this.activeIndex = -1
        // 这个时间是延迟多久显示
        setTimeout(() => {
          this.activeIndex = tempIndex
        }, 1000)
      }
    },
    gotoDetail(item) {
      this.$forward('https://m.haoshiqi.net/v2/couple_detail', { id: item.pin_activities_id })
    },
  },
}
</script>

<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 1s;
  transform: translateY(0px);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(10px);
}

.msg-box{
  max-width: 40%;
  height: 24px;
  line-height: 0;
  position: fixed;
  top: 80px;
  left: 10px;
  z-index: 3;
  box-sizing: border-box;
}

.msg-item{
  height: 24px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  background-color: transparent;
}


.msg-box .msg-item .msg-pic{
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 100%;
  overflow: hidden;
}
.msg-box .msg-item .msg-pic image{
  width: 100%;
  height: 100%;
}

.msg-box .msg-item .msg-text{
  position: relative;
  z-index: 1;
  flex: 1;
  line-height: 24px;
  height: 24px;
  padding: 0 10px 0 20px;
  margin-left: -12px;
  color: #fff;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0 12px 12px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
}
</style>
