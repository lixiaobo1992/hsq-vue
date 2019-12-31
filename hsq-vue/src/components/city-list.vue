<template>
  <!--components/zone-list.wxml-->
  <div class="city-list">
    <div class="select-header">
      <div
        class="select-title"
        :class="{ 'no-data': isSelectProvince }"
        @click="cancelSelect"
      >
        {{ currentProvince.currentAddress ? currentProvince.currentAddress : '请选择' }}
      </div>
      <div v-if="currentProvince.currentAddress" class="select-title " :class="{ 'no-data': !isSelectProvince }">
        请选择
      </div>
    </div>
    <!-- 选择省份 -->
    <div v-if="isSelectProvince" class="scroll-view zone-list">
      <div v-for="item in zones" :key="item.id" class="zone-item" @click="selectProvince(item)">
        <img v-if="item.currentAddress == currentProvince.currentAddress" class="select-icon" src="https://img2.haoshiqi.net/item_detail_check@3x.png">
        <label class="zone-label">{{ item.currentAddress }}</label>
      </div>
    </div>
    <!-- 选择城市 -->
    <div v-else class="scroll-view zone-list">
      <div v-for="item in cityList" :key="item.id" class="zone-item" @click="selectCity(item)">
        <label class="zone-label">{{ item.city }}</label>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
let citys = {}                         //城市对象
export default {
  props: {
    isSelectProvince: {
      type: Boolean,
      default: true,
    },
    didShowCitySelection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentProvince: {},
      cityList: [],
      currentCity: {},
    }
  },
  computed: {
    ...mapState({
      zones: state => state.location.zones,
    }),
  },
  created() {

  },
  watch: {
    didShowCitySelection(nv) {
      if(!nv) {
        this.currentProvince = {}
      }
    },
  },
  methods: {
    //选择地址
    selectProvince(province) {
      this.currentProvince = province
      this.$emit('selectProvince', false)
      let provinceId = province.currentProvinceId + ''
      if (!citys[provinceId]) {
        this.getCityList(provinceId)
        return
      }

      this.cityList = citys[provinceId]
    },
    // 获取当前省份城市列表
    getCityList(provinceId) {
      this.$api.cityList({ provinceId }, (res) => {
        const cityListArr = res.data.list
        citys[provinceId] = cityListArr
        this.cityList = cityListArr
      }, (err) => {
        console.log(err)
      })
    },
    cancelSelect() {
      // if (this.currentProvince.currentAddress) {
      //   this.currentProvince = {}
      // }
      this.$emit('selectProvince', true)
    },
    selectCity(city) {
      this.currentCity = city
      this.$store.dispatch('setAddressInfo', {
        'currentProvinceId': this.currentProvince.currentProvinceId,
        'currentAddress': this.currentProvince.currentAddress + ' ' + city.city,
        'addressId': null,
        'cityId': city.id,
      })
      this.$emit('selectCity')
    },
  },
}
</script>
<style lang="stylus" scoped>
.scroll-view {
  overflow-y: auto;
}
.city-list {
  height: 100%;
  padding: 0 12px;
}
.zone-list {
  height: calc(100% - 28px);
  overflow: visible;
}

.select-header {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #333333;
  margin-bottom: 8px;
}
.select-title {
  padding-bottom: 3px;
  margin: 0 12px;
  font-family: PingFangSC-Regular;
}
.no-data {
  margin: 0 12px;
  font-family: PingFangSC-Medium;
  border-bottom: 2px #FB0737 solid;
}
.zone-item {
  padding: 0;
  position: relative;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  background-color: #fff;
  &:last-child {
    margin-bottom: 10px;
  }
}

.zone-label {
  height: 30px;
  line-height: 30px;
  padding-left: 12px;
}

.zone-arrow {
  float: right;
  width: 20px;
  height: 20px;
  margin-right: 15px;
  margin-top: 7px;
}
.select-icon {
  position: absolute;
  width: 13px;
  height: 9px;
  top: 12px;
  left: -3px;
}

</style>
