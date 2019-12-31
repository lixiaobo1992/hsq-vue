<template>
  <div class="tpl-default tpl-mobile">
    <router-view class="page-view" />
  </div>
</template>

<script>
export default {
  name: 'tpl-default',

  components: {},
}
</script>

<style lang="stylus" scoped>
.tpl-mobile {
  height: 100%;
  overflow: hidden;
}
.page-view {
  height: 100%;
  overflow-y: scroll;
}

.page-scroll {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 48px;
  .vue-header,
  .vue-tabbar {
    flex-shrink: 0;
  }

  .vue-pull-scroll {
    flex: 1;
  }
}
</style>
