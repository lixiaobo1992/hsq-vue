<!-- 基础模板 -->
<template>
  <section class="layout-base" :class="{ 'is-header': isShowHeader, 'is-tabbar': isShowTabBar }">
    <cm-header
      v-if="isShowHeader"
      slot="header"
      class="layout-header"
      :class="{ show: isShowHeader }"
      absolute
      :title="title"
    />
    <transition :name="transition">
      <keep-alive :include="$store.getters.keepAliveList">
        <div class="router-container">
          <router-view id="rootContainer" class="router-view page-container" />
        </div>
      </keep-alive>
    </transition>
    <tabbar
      v-if="isShowTabBar"
      slot="bottom"
      class="layout-tabbar"
      :class="{ show: isShowTabBar }"
      :value="tabbarVal"
    />
    <ShareShade :order-comment-shade="orderCommentShade" />
  </section>
</template>

<script>
import {
  // mapActions,
  mapState,
  // mapGetters,
} from 'vuex'
import device from '@dwdjs/utils/lib/device'
import { Header, ViewBox } from '@/ui'
import TabBar from '@/components/tabbar.vue'
import ShareShade from '@/components/ShareShade'
// console.log(device);
const hideHeader = [
  'index',
  'profile',
  'search-article',
  'shop',
  'product',
  'shop-detail',
  'setup',
  'search-shop',
  'login',
  'publish',
  'product-detail',
  'bargain',
  'honey-note',
  'invite-register',
  'message-index',
  'comment-list',
  'message',
]
const showTabBar = ['index', 'shop', 'product', 'message-index', 'message', 'profile']
export default {
  name: 'layout',
  components: {
    [Header.name]: Header,
    [ViewBox.name]: ViewBox,
    [TabBar.name]: TabBar,
    [ShareShade.name]: ShareShade,
  },
  props: {
    keepAlList: Array,
  },
  data() {
    return {
      transition: '',
      // tabbarVal: 'index',
      // isMsf
      ismsf: device.msf, // 是否是蜜
      // orderCommentShade: {},
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      name: state => state.route.name,
      ani: state => state.app.ani,
      userInfo: state => state.user.userInfo,
      orderCommentShade: state => state.app.orderCommentShade,
    }),
    // 是否显示header
    isShowHeader() {
      if (device.msf) {
        return false
      }
      if (hideHeader.indexOf(this.name) > -1) {
        return false
      }
      return true
    },
    // 是否显示tabbar
    isShowTabBar() {
      if (device.msf) {
        return false
      }
      const otherUserId = this.$route.query.id || ''
      const isSelf = (otherUserId && this.userInfo.id == otherUserId) || !otherUserId
      if (showTabBar.indexOf(this.name) > -1) {
        if (this.name == 'profile' && !isSelf) return false
        return true
      }
      return false
    },
    tabbarVal() {
      if (showTabBar.indexOf(this.name) > -1) {
        return this.name
      }
      return 'index'
    },
    // header
    title() {
      return (this.route.meta && this.route.meta.title) || ''
    },
  },
  // watch $route 决定使用哪种过渡
  watch: {
    $route(to, from) {
      // 暂时不启用转场动画
      // 参见 README.md 转场动画约定
      // const toDepth = to.path.split('/').length;
      // const fromDepth = from.path.split('/').length;
      // const isForward = toDepth < fromDepth;
      // const toIndex = to.meta.index;
      // const fromIndex = from.meta.index || 0;
      // const isBack = toIndex < fromIndex;
      // if (!isUnDef(toIndex)) {
      //   this.transition = '';
      // } else {
      //   this.transition = isBack ? 'slide-right' : 'slide-left';
      // }
    },
  },
}
</script>

<style lang="stylus" scoped>
.layout-base{
  &.is-header .router-container {
    padding-top: 46px;
  }
  &.is-tabbar .router-container {
    padding-bottom: 49px;
  }
}
.layout-header,.layout-tabbar{
  display: none;
  &.show{
    display: block;
  }
}

.transition-box {
  position: absolute;
  z-index: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  transition: transform 0.4s cubic-bezier(.55,0,.1,1);

  // height: 100%;
  height: 100vh;
}

.slide-left-enter-active,
.slide-right-enter-active,
.slide-right-leave-active {
  background-color: #fff;
}

.slide-right-leave-to {
  z-index: 10;
}
.slide-right-enter {
  z-index: -1;
}

.slide-right-leave-to,
.slide-left-enter {
  transform: translate3D(100%, 0, 0);
}
.slide-right-enter,
.slide-left-leave-to
{
  transform: translate3D(-20%, 0, 0);
}
.slide-right-enter-active,
.slide-left-leave-active {
  &:after {
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.1);
    width: 100%;
    bottom: 0;
    content: '';
    z-index: 10000;
    transition: opacity 0.4s cubic-bezier(.55,0,.1,1);
  }
}
.slide-right-enter:after {
  opacity: 1;
}
.slide-right-enter-to:after {
  opacity: 0;
}
.slide-left-leave:after {
  opacity: 0;
}
.slide-left-leave-to:after {
  opacity: 1;
}
// .slide-left-leave-active,
// .slide-right-enter{
//   opacity: 0;
//   transform: translate3D(-20%, 0, 0);
// }
</style>
