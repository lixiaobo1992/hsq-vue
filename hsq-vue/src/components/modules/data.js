// 数据结构
// !! 注： 产品列表内字段以实际后台返回为准
// 主要模块
/**
  "type": "c-img", // 图片竖向平铺
  "type": "c-img-hor", //豆腐块
  "type": "c-swiper", //轮播图
  "type": "c-category", // 分类导航(小按钮)
  "type": "c-tofu", // 豆腐块
  "type": "c-product-col1", // 一行一列铺品
  "type": "c-product-col2", // 一行两列铺品
  "type": "c-product-col3", // 一行三列铺品
  "type": "c-product-slider", // 横向滑动铺品
 */

const modulesData = {
  list: [
    // 图片竖向平铺
    {
      id: 'banner4673764',
      type: 'c-img',
      comment: '图片竖向平铺',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 320,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      list: [
        {
          id: '11',
          image: {
            w: 320,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
          },
          link: 'https://m.haoshiqi.net/v2/couple-search-list?q=%e7%89%9b%e5%a5%b6',
        },
      ],
    },
    // 图片横行平铺，等分屏幕宽度
    {
      id: 'img-hor893874',
      type: 'c-img-hor', // 图片横行平铺，等分屏幕宽度
      comment: '图片横向均分平铺',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      list: [
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link:
            'https://topic.doweidu.com/zt?id=b4ae3bd3243ff605deb753273b80df03&channel_id=hsq_ios&spm=hsq_ios/td7j4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
          },
          link: 'https://m.haoshiqi.net/v2/debug?xxx=%e7%89%9b%e5%a5%b6',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
          },
          link: 'https://www.baidu.com/',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    // swiper 轮播图
    {
      id: 'swiper38798439',
      type: 'c-swiper', //轮播图
      comment: '轮播图',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 320,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      auto: true, // 自动轮播
      interval: 5000, // 轮播间隔
      dots: true, // 指示点
      speen: 1000, // 轮播速度
      layout: 1, // 1:两边有空隙，2：正常的swiper
      list: [
        {
          id: 24,
          image: {
            w: 320,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 320,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 320,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma4714b05d19c44784c44fd551242e78b1.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    // 分类导航(小按钮)
    {
      id: '893874',
      type: 'c-category', // 分类导航(小按钮)
      comment: '分类导航',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      row: 2, // 行
      col: 5, // 列（一屏显示数量）

      list: [
        {
          id: 24,
          label: '效期1个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期2个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期3个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期4个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期5个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期6个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期7个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期8个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期9个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期10个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期11个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          label: '效期12个月',
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    // 豆腐块
    {
      id: 'c-tofu_1',
      type: 'c-tofu', // 豆腐块
      comment: '豆腐块',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      layout: '1-1', // 豆腐块样式

      list: [
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    {
      id: 'c-tofu_7',
      type: 'c-tofu', // 豆腐块
      comment: '豆腐块',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      layout: '2-2', // 豆腐块样式

      list: [
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    {
      id: 'c-tofu_2',
      type: 'c-tofu', // 豆腐块
      comment: '豆腐块',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      layout: '2-2-2', // 豆腐块样式

      list: [
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    {
      id: 'c-tofu_3',
      type: 'c-tofu', // 豆腐块
      comment: '豆腐块',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      layout: '1-2-2', // 豆腐块样式

      list: [
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    {
      id: 'c-tofu_4',
      type: 'c-tofu', // 豆腐块
      comment: '豆腐块',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      layout: '1-11', // 豆腐块样式

      list: [
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    {
      id: 'c-tofu_5',
      type: 'c-tofu', // 豆腐块
      comment: '豆腐块',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      layout: '1-12', // 豆腐块样式

      list: [
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
        {
          id: 24,
          image: {
            w: 200,
            h: 200,
            url: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          },
          link: 'https://m.api.haoshiqi.net/product/productdetail?productId=48447&sourceType=4',
        },
      ],
    },
    // 一行一列铺品
    {
      id: 'xxsss111',
      type: 'c-product-col1', // 一行一列铺品
      comment: '一行一列铺品',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      sourceId: '', // 数据源id
      pageSize: '', // 限制个数

      list: [
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 2222,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 4444,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
      ],
    },
    // 一行两列铺品
    {
      id: 'xxss211',
      type: 'c-product-col2', // 一行两列铺品
      comment: '一行两列铺品',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      sourceId: '', // 数据源id
      pageSize: '', // 限制个数

      list: [
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
      ],
    },
    // 一行三列铺品
    {
      id: 'xxss1d1',
      type: 'c-product-col3', // 一行三列铺品
      comment: '一行三列铺品',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      sourceId: '', // 数据源id
      pageSize: '', // 限制个数

      list: [
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
      ],
    },
    // 横向滑动铺品
    {
      id: 'xxss1f11',
      type: 'c-product-slider', // 横向滑动铺品
      comment: '一行三列铺品',
      margin_bottom: 0,
      margin_lr: 0,
      margin_top: 0,
      bg_color: '',
      width: 200,
      height: 200,

      enable: true, // 是否启用（前端是否可见）
      flow: 'all', // 人群可见，服务端区别

      sourceId: '', // 数据源id
      pageSize: '', // 限制个数

      more: {
        // 更多
        image: {
          url: '',
          w: 0,
          h: 0,
        },
        link: '',
      },

      bg: { url: '', w: 0, h: 0 }, // 背景图

      list: [
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
        {
          sku_id: 123,
          sku_pic: 'http://img2.haoshiqi.net/ma9ab6cf32723a86af05f4498656ba9cb0.jpg',
          pin_activities_id: 456,
          couple_title: '这个是商品名称1',
          couple_price: 1234,
          market_price: 3000, //划线价
          sub_title: '保质期余1月 约省31.42',
          can_bought: true,
          left_stock: 3458,
          all_stock: 3456,
          count_limit: 2,
          corner_mark_image: 'https://www.baidu.com', // 角标icon 链接
          master_label: '我是主标签',
          slave_label: '我是副标题',
        },
      ],
    },
  ],
}

export default modulesData
