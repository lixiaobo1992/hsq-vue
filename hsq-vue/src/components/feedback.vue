<template>
  <a class="btn-feedback" href="tel://4001858058">
    <img src="~assets/img/feedback.png" class="full">
  </a>
</template>

<script>
export default {
  name: 'vue-feedback',
}
</script>

<style lang="stylus" scoped>
.btn-feedback {
  position: fixed;
  z-index: 200;
  right: 0;
  bottom: 200px;
  width: 27px;
  height: 95px;
  overflow: hidden;

  img.full {
    width: 100%;
    height: 100%;
  }
}
</style>
