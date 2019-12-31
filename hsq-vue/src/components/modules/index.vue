<template>
  <component :is="data.type" :data="data" />
</template>

<script>
// "type": "c-img", // 图片竖向平铺
// "type": "c-img-hor", //豆腐块
// "type": "c-swiper", //轮播图
// "type": "c-category", // 分类导航(小按钮)
// "type": "c-tofu", // 豆腐块
// "type": "c-product-col1", // 一行一列铺品
// "type": "c-product-col2", // 一行两列铺品
// "type": "c-product-col3", // 一行三列铺品
// "type": "c-product-slider", // 横向滑动铺品

import cImg from './c-img'
import cImgHor from './c-img-hor'
import cSwiper from './c-swiper'
import cCategory from './c-category'
import cTofu from './c-tofu'
import cProductCol1 from './c-product-col1'
import cProductCol2 from './c-product-col2'
import cProductCol3 from './c-product-col3'
import cProductRowSlider from './c-product-slider'

export default {
  name: 'dwd-modules',
  components: {
    [cImg.name]: cImg,
    [cImgHor.name]: cImgHor,
    [cSwiper.name]: cSwiper,
    [cCategory.name]: cCategory,
    [cTofu.name]: cTofu,
    [cProductCol1.name]: cProductCol1,
    [cProductCol2.name]: cProductCol2,
    [cProductCol3.name]: cProductCol3,
    [cProductRowSlider.name]: cProductRowSlider,
  },
  props: {
    data: {
      type: Object,
    },
  },
}
</script>
