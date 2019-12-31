<template>
  <div v-if="isPopupShow" class="sku-select-popup">
    <div class="popup-mask" @click="$emit('input', false)" />
    <div class="sku-select-content">
      <!-- 商品信息 -->
      <div class="product-complex">
        <div class="sku-img">
          <img :src="currentSkuData.thumbnail" alt="">
        </div>
        <div class="complex-info">
          <p class="sku-price">¥{{ smallCurrentSkuData.priceText || currentSkuData.priceText }}</p>
          <p class="sku-info">库存: {{ currentSkuData.left_stock }}件</p>
          <p v-if="!notSelectedAttrName" class="sku-info">商品编号: {{ currentSkuData.skuid }}</p>
        </div>
        <dwd-icon
          class="sku-close"
          type="close"
          size="18"
          color="#666"
          @click.native="$emit('input', false)"
        />
      </div>
      <!-- sku 选择项 -->
      <div class="sku-warp">
        <div v-for="(item, index) in attrData" :key="item.attr_id" class="sku-group">
          <div class="sku-group-name">
            {{ item.attr_name }}:<span v-if="!item.active">请选择{{ item.attr_name }}</span>
          </div>
          <div class="sku-option">
            <span
              v-for="(childItem, childIndex) in item.list"
              :key="childItem.ids"
              class="sku-item"
              :class="{ active: childItem.active, disabled: childItem.disabled }"
              :data-index="childIndex"
              :data-parent-index="index"
              :data-disabled="childItem.disabled"
              @click.stop="attrSelect"
            >{{ childItem.value }}</span>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="sku-group sum-select">
          <div class="sku-group-name">数量:</div>
          <dwd-input-number
            :value="currentSum"
            :max="4"
            @onchange="countChangeVal"
          />
          <!-- <div class="sum-control">
            <div class="less">-</div>
            <span class="sum">{{ currentSum }}</span>
            <div class="add">+</div>
          </div> -->
        </div>
      </div>
      <!-- 底部按钮组 -->
      <div class="btns-group">
        <div
          v-if="normSelectTag == 0 || normSelectTag == 1"
          class="btn add-cart"
          :class="{ active: skuBtnStatus.isBtnActive }"
          data-type="addShoppingCart"
          @click="footerBtnClick"
        >
          {{ skuBtnStatus.cartBtnText }}
        </div>
        <div
          v-if="normSelectTag == 0 || normSelectTag == 2"
          class="btn buy-btn"
          :class="{ active: skuBtnStatus.isBtnActive }"
          data-type="buyBtn"
          @click="footerBtnClick"
        >
          {{ skuBtnStatus.buyBtnText }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Icon } from '@/ui'
import { dealPrice } from '@/utils'
import { isEmptyObject, clone } from '@/utils/base'
import inputNumber from '../input-number'
// import { getObjKeys, combInArray } from './sku-mixin';

// let SKUResult = {}; // 组合结果信息

// let SKUAttr = {}; // 处理后的attr // 全部的属性列表

export default {
  name: 'dwd-sku-select',
  components: {
    [Icon.name]: Icon,
    [inputNumber.name]: inputNumber,
  },
  model: {
    prop: 'isPopupShow',
  },
  props: {
    isPopupShow: {
      type: Boolean,
      default: false,
    },
    // 0 显示两个按钮 1 添加购物车 2 立即购买
    normSelectTag: {
      type: Number,
      default: 0,
    },
    // 当前 已选产品数量
    currentSum: {
      type: Number,
      default: 1,
    },
    // 规格信息
    attrList: {
      type: Array,
      default() {
        return []
      },
    },
    // 可用skulist
    skuStocksList: {
      type: Object,
      default() {
        return {}
      },
    },
    smallCurrentSkuData: {
      type: Object,
      value: {
        priceText: 0,
      },
    },
    skuBtnStatus: {
      type: Object,
      value: {
        isBtnActive: true, // 按钮否可用
        buyBtnText: '确认',
        cartBtnText: '确认',
      },
    },
    maxBuySum: {
      type: Number,
      value: 100,
    },
  },
  data() {
    return {
      notSelectedAttrName: '', // 未选择属性名
      selectedAttrName: [],

      currentSkuData: {},
      attrData: [],
    }
  },
  watch: {
    skuStocksList: function (newVal, oldVal) {
      if (!isEmptyObject(newVal)) {
        return
      }
      this.$nextTick(function () {
        console.log('被调了')
        this.initSku()
      })
    },
  },
  beforeCreate() {
    this.__data = {
      attrMap: {},
      cachedSkuList: {},
      selectdSkuAttrData: [],
    }
  },
  created() {
    // console.log(this);
    // 初始化 临时data
  },
  methods: {
    countChangeVal({ value = 1 }) {
      console.log(value)
      this.$emit('onSetParentData', { currentSum: value })
    },
    footerBtnClick(e) {
      const { type } = e.currentTarget.dataset

      if (!this.skuBtnStatus.isBtnActive) return
      if (this.notSelectedAttrName == '') {
        // type: 'buyBtn' 'confirmBtn' 'addShoppingCart',
        console.log('footerBtnClick - type:', type)
        this.$emit('onBtnClick', { type })
      } else {
        this.$showToast(`请选择规格`)
      }
    },
    attrSelect(e) {
      const { parentIndex, index, disabled = false } = e.currentTarget.dataset

      const { attrData = [] } = this
      // console.log(e);
      if (!disabled) {
        //
        const parentAttr = attrData[parentIndex] || {}
        const currentAttr = (parentAttr.list && parentAttr.list[index]) || ''

        if (!currentAttr) return

        const isBeing = this.getIsSelectAttr(parentAttr.attr_id, currentAttr)

        // console.log('isBeing:', isBeing);

        if (isBeing) {
          delete this.__data.selectdSkuAttrData[parentAttr.attr_id]
        } else {
          // 判断当前元素是否是同级
          if (this.__data.selectdSkuAttrData[parentAttr.attr_id]) {
            delete this.__data.selectdSkuAttrData[parentAttr.attr_id]
          }
          this.__data.selectdSkuAttrData[parentAttr.attr_id] = {
            attr_id: parentAttr.attr_id,
            attr_name: parentAttr.attr_name,
            ids: currentAttr.ids,
            value: currentAttr.value,
          }
        }

        this.dealNewAttr()
        this.getSelectdAttrSkuId()
        this.setNotOrSelectedAttrName()
      }
    },
    dealNewAttr() {
      // console.log('func dealNewAttr:: this.__data == selectdSkuAttrData:', this.__data.selectdSkuAttrData);
      // 根据已选属性 更新 attrList
      const { attrData = [] } = this
      const { selectdSkuAttrData = {}, cachedSkuList = {} } = this.__data
      const selectdSkuAttrDataKeys = Object.keys(selectdSkuAttrData)
      // console.log('func dealNewAttr:: selectdSkuAttrDataKeys:', selectdSkuAttrDataKeys);
      const cachedSkuListKeys = Object.keys(cachedSkuList)
      for (let i = 0; i < attrData.length; i++) {
        let attrItem = attrData[i]
        if (!selectdSkuAttrData[attrItem.attr_id]) {
          delete attrItem.active
        } else {
          // attrItem.active = true;
          this.$set(attrItem, 'active', true)
        }

        // console.log('item:========', attrItem.attr_id);
        for (let s = 0; s < attrItem.list.length; s++) {
          let tempItem = attrItem.list[s]
          // 存在已选项
          if (selectdSkuAttrDataKeys.length) {
            // 是否存在
            let isBeing = this.getIsSelectAttr(attrItem.attr_id, tempItem)
            if (isBeing) {
              // tempItem.active = true;
              this.$set(tempItem, 'active', true)
            } else {
              delete tempItem.active

              let isDisabled = true

              let tempSelectdSkuAttrData = clone(selectdSkuAttrData)
              tempSelectdSkuAttrData[attrData[i].attr_id] = {
                attr_id: attrItem.attr_id,
                attr_name: attrItem.attr_name,
                ids: tempItem.ids,
                value: tempItem.value,
              }

              let currentSelectAttrValue = this.getSelectAttrValue(tempSelectdSkuAttrData)
              currentSelectAttrValue = currentSelectAttrValue.join(';')
              // console.log('====currentSelectAttrValue:', currentSelectAttrValue);
              // 判断 当前项是否可选
              // console.log(cachedSkuList[currentSelectAttrValue]);
              if (cachedSkuList[currentSelectAttrValue]) {
                isDisabled = false
              }
              if (isDisabled) {
                tempItem.disabled = true
              } else {
                delete tempItem.disabled
              }
            }
          } else {
            delete tempItem.active
            // 判断 当前项是否可选
            let isDisabled = true
            for (let j = 0; j < cachedSkuListKeys.length; j++) {
              const tempKey = cachedSkuListKeys[j]
              if (tempKey.includes(tempItem.value)) {
                isDisabled = false
                break
              }
            }
            if (isDisabled) {
              tempItem.disabled = true
            } else {
              delete tempItem.disabled
            }
          }
        }
      }

      // console.log('func dealNewAttr:: new attrData:', attrData)
      this.attrData = attrData
    },
    // 获取当前选择项的值
    getSelectAttrValue(selectdSkuAttrData) {
      // const { selectdSkuAttrData = {} } = this.__data;
      const selectdSkuAttrDataKeys = Object.keys(selectdSkuAttrData)
      // 排序 这里注意 目前是根据 属性的顺序 index 作为id, 如果后面后台生成的id排序会有问题
      selectdSkuAttrDataKeys.sort((a, b) => {
        return parseInt(a) - parseInt(b)
      })

      // console.log('func getSelectAttrValue:: selectdSkuAttrDataKeys: ', selectdSkuAttrDataKeys);

      let tempstr = []
      for (let i = 0; i < selectdSkuAttrDataKeys.length; i++) {
        const key = selectdSkuAttrDataKeys[i]
        tempstr.push(selectdSkuAttrData[key].value)
      }

      return tempstr
    },
    // 根据已选项获取当前sku
    getSelectdAttrSkuId() {
      const { selectdSkuAttrData = {} } = this.__data

      const { currentSkuData = {}, attrData = [] } = this

      const selectdSkuAttrDataKeys = Object.keys(selectdSkuAttrData)
      if (!selectdSkuAttrDataKeys.length) return
      if (selectdSkuAttrDataKeys.length !== attrData.length) return

      let tempstr = this.getSelectAttrValue(this.__data.selectdSkuAttrData)
      tempstr = tempstr.join(';')

      // console.log('func getSelectdAttrSkuId:: tempstr:', tempstr);
      const currentAttrIds = this.__data.cachedSkuList[tempstr]
      const newCurrentSkuData = this.skuStocksList[currentAttrIds] || {}
      // console.log('func getSelectdAttrSkuId:: newCurrentSkuData:', newCurrentSkuData);

      if (
        newCurrentSkuData.skuid &&
        currentSkuData &&
        currentSkuData.skuid === newCurrentSkuData.skuid
      ) {
        return
      }

      this.currentSkuData = newCurrentSkuData
      this.$emit('onSetParentData', { currentSkuData: newCurrentSkuData })
    },
    setNotOrSelectedAttrName() {
      const { selectdSkuAttrData = {} } = this.__data
      const { attrData = [] } = this
      let notAttrName = ''
      let selectedAttrName = []
      for (let i = 0; i < attrData.length; i++) {
        const attrItem = attrData[i]
        if (!selectdSkuAttrData[attrItem.attr_id]) {
          notAttrName += ' ' + attrItem.attr_name
        } else {
          selectedAttrName.push({
            type: attrItem.attr_name == '保质期' ? 2 : 1,
            attr_name: attrItem.attr_name,
            value: selectdSkuAttrData[attrItem.attr_id].value,
          })
        }
      }
      // console.log('func setNotOrSelectedAttrName:: notSelectedAttrName:', notAttrName);
      // console.log('func setNotOrSelectedAttrName:: selectedAttrName:', selectedAttrName);

      this.notSelectedAttrName = notAttrName
      this.selectedAttrName = selectedAttrName

      this.$emit('onSetParentData', {
        notSelectedAttrName: notAttrName,
        selectedAttrName,
      })
    },
    getIsSelectAttr(key_id, attr) {
      const { selectdSkuAttrData = {} } = this.__data
      const tempAttr = selectdSkuAttrData[key_id] || {}
      if (tempAttr.value == attr.value) {
        return true
      }
      return false
    },

    initSku() {
      // console.log(this.props);
      const { attrList = [], skuStocksList = {} } = this
      // console.log('func initsku:: attrList:', attrList);
      // console.log('func initsku:: skuStocksList:', skuStocksList);
      let attrMap = {}
      let cachedSkuList = {}
      let selectdSkuAttrData = {}

      // 处理一个新的属性列表
      let newAttrList = []
      for (let i = 0; i < attrList.length; i++) {
        const attr = attrList[i]
        if (!attr || !attr.list) {
          continue
        }
        // 定义新的属性项
        let attrItem = {}
        attrItem['attr_id'] = i
        attrItem['attr_name'] = attr.name
        attrItem['list'] = []

        let map = {}
        if (attr.name) {
          map['attr_id'] = attrItem['attr_id']
          map['attr_name'] = attr.name
          map['value'] = attr.defaultAttr || attr.default_attr
          for (let s = 0; s < attr.list.length; s++) {
            let item = attr.list[s]
            for (let entry in item) {
              if (map['value'] == entry) {
                map['ids'] = item[entry]
              }
            }
          }
        }
        // 记录已选项
        selectdSkuAttrData[attrItem['attr_id']] = map
        // 遍历每一个属性
        for (let s = 0; s < attr.list.length; s++) {
          const tempItem = attr.list[s]
          for (let key in tempItem) {
            attrItem['list'].push({
              ids: tempItem[key],
              value: key,
            })
            // 将属性的key&value交换 同时转换为map
            attrMap[tempItem[key]] = key
          }
        }

        newAttrList.push(attrItem)
      }

      for (let key in skuStocksList) {
        const tempArray = key.split(';')
        let nameList = []
        for (let i = 0; i < tempArray.length; i++) {
          const attrName = getAttrNameByAttrId(tempArray[i])
          if (attrName) {
            nameList.push(attrName + '')
          }
        }
        mapAttr('', 0, nameList, key, cachedSkuList)
      }

      this.__data.attrMap = attrMap
      this.__data.selectdSkuAttrData = selectdSkuAttrData
      this.__data.cachedSkuList = cachedSkuList

      // console.log(
      //   'func initsku::cachedSkuList:',
      //   Object.keys(cachedSkuList).length,
      //   this.__data.cachedSkuList
      // );
      // console.log('func initsku::attrMap:', this.__data.attrMap);
      // console.log('func initsku::selectdSkuAttrData:', this.__data.selectdSkuAttrData);
      // console.log('func initsku::newAttrList:', newAttrList);

      this.attrData = newAttrList

      this.getSelectdAttrSkuId()
      this.setNotOrSelectedAttrName()
      this.dealNewAttr()

      function getAttrNameByAttrId(attrid) {
        for (let key in attrMap) {
          if (key.includes(attrid)) {
            return attrMap[key]
          }
        }
        return null
      }

      function mapAttr(key, index, attrNames, skuKey, map) {
        if (index == attrNames.length) {
          return
        }

        for (let i = index; i < attrNames.length; i++) {
          if (key && !key.endsWith(';')) {
            key += ';'
          }
          let newkey = key + attrNames[i]
          map[newkey] = skuKey
          index++
          mapAttr(newkey, index, attrNames, skuKey, map)
        }
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
//
.sku-select-popup{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9;

  .popup-mask{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(0,0,0,0.7);
  }

  .sku-select-content{
    padding-left: 15px;
    padding-bottom: 49px;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 2;
    background-color: #fff;
  }
}

/* sku 产品信息 */
.product-complex{
  display: flex;
  padding-bottom: 15px;
  padding-top: 10px;
  padding-right: 30px;
  border-bottom: 1px solid #e1e1e1;
  position: relative;

  .sku-img{
    width: 125px;
    height: 125px;
    border: 2px solid #eee;
    border-radius: 10px;
    margin-right: 14px;
    background-color: #e1e1e1;
    margin-top: -42px;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .complex-info{
    flex: 1;
    .sku-price{
      font-size: 24px;
      color: #F73552;
      line-height: 33px;
    }
    .sku-info{
      color: #333;
      font-size: 12px;
      line-height: 17px;
    }
  }
  .sku-close{
    position: absolute;
    right: 10px;
    top: 10px;
  }
}

/* sku 选择组 */

.sku-warp{
  width: 100%;
  max-height: 300px;
  min-height: 200px;
  padding-bottom: 50px;
  position: relative;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.sku-warp .sku-group{
  border-bottom: 1px solid #e1e1e1;
  padding-top: 12px;
  padding-bottom: 5px;
}

.sku-warp .sku-group .sku-group-name{
  font-size: 14px;
  color: #212121;
  display: flex;
  align-items: center;
}
.sku-warp .sku-group .sku-group-name span{
  font-size: 12px;
  color: #F40000;
  display: inline-block;
  margin-left: 5px;
}

.sku-warp .sku-group .sku-option{
  margin-top: 10px;
}

.sku-option .sku-item{
  display: inline-block;
  line-height: 18px;
  vertical-align: middle;
  border-radius: 25px;
  border: 1px solid #F0EFEF;
  padding: 5px 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #212121;
}
.sku-option .sku-item.active{
  color: #F73552;
  border-color: #F73552;
}
.sku-option .sku-item.disabled{
  color: #e1e1e1;
  border-color: #e1e1e1;
}
/* 保质期样式 */
.sku-group.shelf-lefe .active{
  background-color: #F73552;
  color: #fff;
  border-color: #F73552;
}
/* 数量添加按钮 */

.sku-group.sum-select{
  display: flex;
  padding-right: 15px;
  align-items: center;
  justify-content: space-between;
  border-bottom: none;
}


/* 添加购物车／立即购买按钮 */
.sku-select-content .btns-group{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  display: flex;
  align-items: center;
}
.sku-select-content .btns-group .btn{
  flex: 1;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
  text-align: center;
  font-size: 16px;
  border-radius: 0;
  color: #FFFFFF;
}
.sku-select-content .btns-group .btn.add-cart{
  background-color: rgba(153, 153, 153, 0.6);
}
.sku-select-content .btns-group .add-cart.active{
  background-color: #FEA40D;
}
.sku-select-content .btns-group .btn.buy-btn{
  background-color: rgb(153, 153, 153);
}
.sku-select-content .btns-group .buy-btn.active{
  background-color: #F40000;
}
</style>
