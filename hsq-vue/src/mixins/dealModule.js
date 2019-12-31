const dealModule = {
  dealModuleList(list = []) {
    const types = [
      'c-img',
      'c-img-hor',
      'c-swiper',
      'c-category',
      'c-tofu',
      'c-product-col1',
      'c-product-col2',
      'c-product-col3',
      'c-product-slider',
      // 'c-product-seckill'
    ]
    const tempList = list.filter(item => {
      return types.includes(item.type)
    })
    const tplList = tempList.map(item => {
      const result = {
        ...item,
      }
      switch (item.type) {
        case 'c-product-col1':
          return Object.assign(result, this.dealCProduct(item))
        case 'c-product-col2':
          return Object.assign(result, this.dealCProduct(item))
        case 'c-product-col3':
          return Object.assign(result, this.dealCProduct(item))
        case 'c-product-slider':
          return Object.assign(result, this.dealCProduct(item))
        default:
          return result
      }
    })
    return tplList
  },
  dealCProduct(item) {
    const that = this
    return {
      eventClick: function (items) {
        let { biz_id, can_bought, left_stock, link } = items
        if (can_bought && left_stock && link) {
          that.$forward(link)
        }
      },
      list: this.dealProductList(item),
    }
  },
  dealProductList(moduleItem) {
    const list = moduleItem.list || []
    return list.map(item => {
      let retaData = parseInt(((item.all_stock - item.left_stock) / item.all_stock) * 100)
      return {
        ...item,
        tags: item.tags || [],
        market_price: (item.market_price / 100).toFixed(2),
        price: this.productPrice((item.price / 100).toFixed(2)),
        member_price: (item.member_price / 100).toFixed(2),
        rate_percent: retaData,
        showupArrow: true,
        arrowClick: item.tags.toString().length > 48,
      }
    })
  },
  //处理价格
  productPrice(price) {
    let priceArray = price.split('.')
    return {
      price_yuan: priceArray[0],
      price_fen: priceArray[1],
    }
  },
}
export default dealModule
