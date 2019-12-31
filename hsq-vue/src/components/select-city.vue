<template>
  <div v-show="didShowCitySelection" class="city-view">
    <!-- 30% -->
    <div class="transparent" @click="onCityView" />

    <!-- 8% -->
    <div class="city-view-title">
      <img v-show="showBack" class="address-back" src="https://img1.haoshiqi.net/miniapp/more_85508a3b09.png" @click="goBack">
      <span class="city-label sendto">配送至</span>
      <img class="close" src="https://img1.haoshiqi.net/miniapp/delete_4d67965d24.png" @click="onCityView">
    </div>

    <!-- 62% -->
    <swiper
      ref="swipe"
      class="city-type" 
      :default-index="swipeIndex" 
      :show-indicators="false"
      :auto="0"
      @change="onChangeSwiperIndex"
    >
      <swiper-item>
        <div v-if="addresses.length" class="swipe-item scroll-view">
          <address-list :current-city="currentCity" @selectingNewCity="selectingNewCity" />
          <div class="add-bottom" />
          <div class="choose-others" @click="chooseOthers">选择其他城市</div>
        </div>
      </swiper-item>

      <swiper-item>
        <div v-if="zones.length" class="swipe-item scroll-view">
          <city-list 
            :did-show-city-selection="didShowCitySelection"
            :is-select-province="isSelectProvince" 
            @selectCity="selectingNewCity" 
            @selectProvince="selectProvince"
          />
        </div>
      </swiper-item>
    </swiper>

  </div>
</template>
<script>
import { Swiper, SwiperItem } from '@/ui'
import AddressList from './address-list'
import CityList from './city-list'
import { mapState } from 'vuex'
import { clone } from '@/utils/base'
import { addClass, removeClass } from 'mint-ui/src/utils/dom'
export default {
  name: 'select-city',
  components: {
    Swiper,
    SwiperItem,
    AddressList,
    CityList,
  },
  props: {
    didShowCitySelection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSelectProvince: true,
      swipeIndex: 1,
      currentCity: {},
    }
  },
  computed: {
    ...mapState({
      zones: state => state.location.zones,
      fixedPosition: stats => state.location.fixedPosition,
    }),
    // 是否显示返回按钮
    showBack() {
      return (this.swipeIndex == 1 && !this.addresses.length && !this.isSelectProvince) || (this.swipeIndex != 0 && this.addresses.length)
    },
    addressInfo() {
      return this.$store.state.location.addressInfo
    },
    addresses() {
      return this.$store.state.location.addresses
    },
  },
  created() {
    if(this.addresses.length) {
      this.swipeIndex = 0
      this.$refs.swipe.prev()
    }
    this.setDefaultAddr()
  },
  watch: {
    'addresses.length'(nv, ov) {
      this.setDefaultAddr()
      if(nv) {
        this.swipeIndex = 0
        this.$refs.swipe.prev()
      }
    },
  },
  methods: {
    //有默认收货地址时使用默认收货地址
    setDefaultAddr() {
      this.currentCity = clone(this.addressInfo)
    },
    //选择地址
    selectingNewCity(province) {
      this.onCityView()
      this.$emit('selectingNewCity')
    },   

    //关闭地址选择
    onCityView() {
      if (this.didShowCitySelection) {
        this.isSelectProvince = true
        this.currentCity = clone(this.addressInfo)
        this.$emit('update:didShowCitySelection', false)
        if(this.swipeIndex == 1 && this.addresses.length) {
          this.$refs.swipe.prev()
        }
      }
    },

    //选择其它地址
    chooseOthers() {
      this.$refs.swipe.next()
    },
    goBack() {
      //有收货地址并且当前在选择省份页面，返回选择收货地址
      if(this.addresses.length && this.isSelectProvince && this.swipeIndex == 1) {
        this.$refs.swipe.prev()
      } else {
        this.isSelectProvince = true
      }
    },

    onChangeSwiperIndex(index) {
      this.swipeIndex = index
    },
    // 选择省份
    selectProvince(isSelectProvince) {
      this.isSelectProvince = isSelectProvince
    },
  },
}
</script>
<style lang="stylus" scoped>
.scroll-view {
  overflow-y: auto;
}
.city-view {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 7;
}

.city-view-title {
  background: #fff;
  width: 100%;
  height: 50px;
  padding: 15px;
  text-align: center;
  line-height: 1.3;
}

.sendto {
  font-size: 16px;
}

.close {
  position: absolute;
  right: 15px;
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.transparent {
  height: 30%;
  background-color: #000;
  opacity: 0.5;
}

.city-type {
  background-color: #fff;
  height: 62%;
  width: 100%;
}

.swipe-item {
  width: 100%;
  height: 100%;
}

.add-bottom {
  height: 70px;
}

.choose-others {
  position: fixed;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  width: 100%;
  background-color: #ed0000;
  text-align: center;
  font-size: 20px;
  color: #fff;
}

.address-back {
  position: absolute;
  left: 15px;
  width: 25px;
  height: 25px;
  transform: rotate(180deg);
}

</style>