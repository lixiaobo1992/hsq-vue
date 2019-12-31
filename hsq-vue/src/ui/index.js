//
import Header from './header'
import { Swiper, SwiperItem } from './swiper'
import { TabBar, TabBarItem } from './tabbar'
import Icon from './icon'
// import Search from './Search';
import Scroll from './scroll'
// import Tags from './Tags';

const version = '0.0.01'
const install = function (Vue, config = {}) {
  if (install.installed) return
}

export {
  install, // 暂时不支持以插件的形式引入
  version,
  Header,
  Swiper,
  SwiperItem,
  TabBar,
  TabBarItem,
  Icon,
  // Search,
  Scroll,
  // Tags,
}
