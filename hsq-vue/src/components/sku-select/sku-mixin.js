export default {
  methods: {
    // 提供给子组件 修改父组件data 的方法
    onSetParentData(data) {
      console.log('setCurrentData', data)
      const { currentSkuData } = data
      if (currentSkuData) {
        const { currentSkuData: oldCurrentSkuData } = this
        if (
          oldCurrentSkuData.skuid &&
          currentSkuData.skuid &&
          currentSkuData.skuid !== oldCurrentSkuData.skuid
        ) {
          this.skuDataOnChange && this.skuDataOnChange(currentSkuData)
        }
      }

      for (let tempKey in data) {
        this[tempKey] = data[tempKey]
      }
    },
  },
}
