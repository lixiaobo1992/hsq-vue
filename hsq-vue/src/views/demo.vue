<template>
  <div>
    <h1>demo</h1>
    <img src="~assets/img/logo.png" alt="Vue.js PWA">
    <!-- <p><KitIcon mode="svg" type="check" /></p> -->

    <dwd-float-msg class="index-msg" />
  </div>
</template>

<script>
// import { Icon } from 'kit-ui'
import floatMsg from '@/components/float-msg'

export default {
  components: {
    // [Icon.name]: Icon,
    [floatMsg.name]: floatMsg,
  },

  data() {
    return {
      list: [],
    }
  },

  created() {},
}
</script>
