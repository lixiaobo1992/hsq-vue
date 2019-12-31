<template>
  <div id="app" class="page-container">
    <!-- <router-view class="page-tpl"></router-view> -->
    <transition :name="transition">
      <keep-alive :include="$store.getters.keepAliveList">
        <router-view id="rootContainer" class="router-view" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  // mapActions,
  mapState,
  // mapGetters,
} from 'vuex'
export default {
  name: 'app',
  components: {},
  data() {
    return {
      transition: '',
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      console.log('App.vue watch: route:', newVal)
      if (newVal.name !== 'index') {
        // 目前暂停 轮询在index.vue deactivated生命周期内做了
        // this.stopPollingMsg();
      }
      // if (!this.isLocation) {
      //   this.getLocation(this.$route);
      // }
      // this.getLocation();
      // console.log(this);
    },
  },
  created() {
    // api.getConfig({}, (res) => {

    // }, (err) => {

    // })
    console.log('api: init config')
  },
  computed: {
    ...mapState({
      route: state => state.route,
      userInfo: state => state.user.userInfo,
    }),
    // header
    title() {
      return (this.route.meta && this.route.meta.title) || ''
    },
    
  },
  methods: {
    ...mapActions(['stopPollingMsg']),
  },
}
</script>

<style lang="stylus">
@import './style/var';
@import './style/index';

.router-view{
  position: relative;
  width: 100%;
  height: 100%;
}


.dug-control{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 11;
  .console-box{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    display: flex;
    .dug-content{
      flex: 1;
    }
    .close-btn{
      height: 40px;
      border: 1px solid #e7e7e7;
    }
  }
}
</style>
