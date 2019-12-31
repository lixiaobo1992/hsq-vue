<script>
/**
 * Icon
 * @module packages/Icon
 * @desc 图标集，支持字体图标以及svg图标
 * @desc 语义化的矢量字体图标。
 * @rules 每个图标请使用语义化的命名，部分规则如下
 *   - 根据不同需要，选择不同的图标模式 mode
 *   - 实心和描线图标保持同名，用 -o 来区分，比如 question-circle（实心） 和 question-circle-o（描线）；
 *   - 命名顺序：[图标名]-[形状?]-[描线?]-[方向?]。
 * @param {string} [mode] - 传入图标类型 [font, svg, canvas, custom]
 * @param {string} type - icon 的 Name
 * @param {number} [size] - 尺寸, svg 传入宽高逗号间隔，iconfont 传入字体大小
 * @param {color} [color] - 传入颜色值
 * @param {string} [prefixCls] - icon名 前缀
 *
 * @example
 * <Icon mode="svg" type="String" />
 * <Icon mode="font" type="String" />
 * <Icon mode="custom" type="String" />
 * <Icon mode="custom" type="arrow-right"></Icon>
 */

export default {
  name: 'dwd-icon',

  props: {
    prefixCls: String, // icon 前缀
    type: {
      type: String,
      required: true,
    }, // icon的name
    spin: Boolean,
    size: [String, Number],
    mode: {
      type: String,
      validator(v) {
        return ['svg', 'font', 'canvas', 'custom'].includes(v)
      },
      default: 'svg',
    },
    shape: {
      type: String,
      validator(v) {
        return ['circle', 'radius', 'square'].includes(v)
      },
    },
    bg: String,
    color: String,
    reverse: Boolean,
  },

  computed: {
    classes() {
      const { mode, type, spin, shape, reverse } = this.$props

      let { prefixCls = 'icon' } = this.$props
      prefixCls = mode ? `${prefixCls}-${mode}` : `${prefixCls}-svg`
      // this.prefixCls = prefixCls
      return {
        // icon: true,
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: !!type,
        [`${prefixCls}-${reverse}`]: reverse,
        [`is-${shape}`]: !!shape,
        [`is-spin`]: spin || type === 'loading',
      }
    },
    styles() {
      const { size, color, bg } = this.$props
      return {
        fontSize: `${size / 100}rem`,
        color: !!color,
        backgroundColor: !!bg,
      }
    },
    iconType() {
      const { mode, type } = this.$props
      if (mode !== 'svg') return

      const warnMsg = `Icon ${type} is invalid, have you set svg-sprite-loader correctly? see https://github.com/kisenka/svg-sprite-loader`
      if (!type || typeof type !== 'string') {
        console.error(warnMsg)
        return null
      }

      let xlinkHref = this.renderSvg()
      // if (!/^#/.test(xlinkHref || type)) {
      //   console.error(warnMsg)
      // }
      // let outerIcon
      if (!xlinkHref) {
        // outerIcon = true
        xlinkHref = `icon-${type}`
      } else {
        xlinkHref = `#icon-${type}`
      }
      // console.log(xlinkHref)
      return xlinkHref
      // return `#icon-${type}`;
    },
    // 目前单位用 px
    svgStyles() {
      const { size, color } = this.$props
      let sizeStyle = {}
      if (size) {
        // var size = '280, 70'
        // console.log(size.split(/\s*,\s*| +/))
        let width
        let height
        if (typeof size === 'number') {
          [width, height] = [size, size]
        } else {
          [width, height = width] = size.split(/\s*,\s*| +/)
        }
        sizeStyle = {
          width, // svg 不需要单位
          height,
        }
      }
      return {
        color,
        ...sizeStyle,
      }
    },
  },

  methods: {
    renderSvg() {
      const { type, mode } = this.$props
      if (mode !== 'svg') return
      let svg
      try {
        svg = import(`@/icons/svg/${type}.svg`)
      } catch (e) {
        svg = {}
        // console.log(e)
      } finally {
        /* eslint no-unsafe-finally: 0 */
        return svg // .default
      }
    },
  },

  render(h) {
    // const $default = this.$slots.default
    // const $data = $default.$data
    const { mode } = this.$props
    // const { mode, ...props } = this.$props

    let iconNode = null
    // 这里如何塞入 slot 呢
    switch (mode) {
      case 'font': {
        // 通过{}实现块区域，隔离 const 变量
        const { classes, styles } = this
        iconNode = <i class={classes} style={styles} />
        break
      }
      // case 'canvas': {
      //   iconNode = 'IconCanvas'
      //   break
      // }
      case 'custom': {
        // 通过 css 实现的icon
        const { classes } = this
        const { size } = this.$props
        const styles = {
          transform: size ? `scale(${size})` : false,
        }
        iconNode = <span class={classes} style={styles} />
        break
      }
      case 'svg':
      default: {
        const { classes, svgStyles, iconType } = this
        iconNode = (
          <svg class={classes} style={svgStyles} title={iconType} aria-hidden="true">
            <use xlinkHref={iconType} />
          </svg>
        )
      }
    }

    return iconNode
  },
}
</script>

<style lang="stylus" scoped>
// icons.styl 中的 .icon-svg 样式放在这里，竟然没提取到公共样式中，引起覆盖 bug
// TODO 即使目前，.avatar-mask 样式也未提取到公共样式，这是很严重的问题
</style>
