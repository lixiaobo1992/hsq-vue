<template>
  <div>
    <div 
      v-for="(item, index) in addresses" 
      :key="item.id" 
      class="address-item" 
      @click="onSelecting(item, index)"
    >
      <div class="address-item-left">
        <template v-if="item.currentAddress == currentCity.currentAddress">
          <img class="address-icon" src="https://img1.haoshiqi.net/miniapp/location_selected_8b4131351a.png">
        </template>
        <template v-else>
          <img class="address-icon" src="https://img1.haoshiqi.net/miniapp/location@3x_a034410ec3.png">
        </template>
        <label class="label-address">{{ item.currentAddress }}</label>
      </div>
    </div>
  </div>
</template>
<script>
import { clone } from '@/utils/base'
import { mapState } from 'vuex'
export default {
  props: {
    currentCity: Object,
  },
  data() {
    return {
      addresses: [],
    }
  },
  computed: {

  },
  created() {
    this.addresses = clone(this.$store.state.location.addresses)
  },
  methods: {
    //选择地址
    onSelecting(city, index) {
      const { addressInfo } = this.$store.state.location
      let oldCity = addressInfo
      if (oldCity.currentAddress != city.currentAddress) {
        this.$store.dispatch('setAddressInfo', city)
        this.handleAddresses(city, index)
      }
      this.$emit('selectingNewCity')
    },
    //处理地址列表，选中排第一个
    handleAddresses(city, index) {
      let addresses = this.addresses
      addresses.splice(index, 1)
      addresses.unshift(city)
      this.addresses = addresses
    },
  },

}
</script>
<style lang="stylus" scoped>
.address-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e2e2e2;
  background-color: #fff;
}

.address-item-left {
  display: flex;
  padding-bottom: 10px;
  padding-top: 10px;
}

.address-icon {
  width: 16px;
  height: 16px;
  margin-left: 10px;
  margin-right: 5px;
  flex-shrink: 0;
}

.label-address {
  font-size: 14px;
  margin-right: 8px;
}

.address-check {
  width: 15px;
  height: 15px;
  margin-right: 15px;
  margin-top: 12px;
  flex-shrink: 0;
}
</style>