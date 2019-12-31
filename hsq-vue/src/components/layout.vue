//!! 暂时用不到
<template>
  <section clsas="page-container">
    <transition :name="transition">
      <keep-alive :include="$store.getters.keepAliveList">
        <router-view id="rootContainer" class="router-view" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import {
  // mapActions,
  mapState,
  // mapGetters,
} from 'vuex'
export default {
  name: 'dwd-layout',
  data() {
    return {
      transition: '',
    }
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
}
</script>

<style lang="stylus" scoped>
.page-container{
  height: 100%;
  display: flex;
  justify-content: center;
}

.router-view{}
</style>
