import env from '@/config/env'
import { mapTo } from './base'

const priceType = env.channel === 'huabei' ? '花呗价' : ''

// 处理拼团列表数据
export function dealPinList(list) {
  return mapTo(list, item => {
    let priceString = (item.price / 100).toFixed(2)
    let priceArray = priceString.split('.')
    return {
      ...item,
      price: {
        price_yuan: priceArray[0],
        price_fen: priceArray[1],
      },
      market_price: (item.market_price / 100).toFixed(2),
      tags: item.tags.splice(0, 2),
      link: `https://m.haoshiqi.net/v2/detail2?id=${item.biz_id}`,
    }
  })
}

// 处理支付宝积分列表数据
export function dealPointList(list) {
  return mapTo(list, item => {
    // const isShowDelivery = (!item.canDelivery && item.onLine && item.inStock)
    // const isShowLootAll = isShowDelivery || (item.canDelivery && !item.canBought)
    return {
      id: item.pSkuId,
      title: item.name,
      image: item.thumbnail,
      priceType,
      price: item.price,
      point: item.point,
      // nowPrice: {
      //   price: item.price,
      //   point: item.point,
      // },
      marketPrice: item.marketPrice,
      // isShowLootAll,
      // isShowDelivery,
      tags: item.tags && item.tags[0],
      inStock: item.inStock,
      // onLine: item.onLine,
      // soldout: !(item.onLine && item.inStock),
      endTime: item.endTime,
      showCountDownLimit: item.showCountDownLimit,
    }
  })
}
