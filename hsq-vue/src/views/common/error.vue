<template>
  <div class="page-error">
    <b>好食期小程序</b>有更多优惠哦！

    <div class="btn-aliapp" @click="goNext">去看看</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goNext() {
      const aliappUrl =
        'alipays://platformapi/startApp?appId=2017112000051610&page=pages%2Findex%2Findex&query=spm%3Dh5vuebtn'
      location.replace(aliappUrl)
    },
  },
}
</script>

<style lang="stylus" scoped>
.page-error {
  padding-top: 100px;
  text-align: center;
}
.btn-aliapp {
  border: 1px solid #eee;
  padding: 10px;
  width: 260px;
  font-size: 14px;
  margin: 20px auto;
}
</style>
