<template>
  <div>
    <div>{{ code }}</div>
    <p>表着急，表乱动，等待5秒啦</p>
  </div>
</template>
<script>
export default {
  name: 'test-code',
  data() {
    return {
      code: '',
    }
  },
  computed: {},
  created() {
    this.code = this.$route.query.code
    const c_redirect = this.$route.query.c_redirect
    const jumpUrl = this.$route.query.jumpUrl
    const url = jumpUrl + '?code=' + this.code + '&c_redirect=' + c_redirect
    location.replace(url)
  },
  methods: {},
}
</script>
