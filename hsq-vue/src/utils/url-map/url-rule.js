/**
 * url映射规则rule
 * @param {any} rules [h5ToHsq, h5ToIqg, mini, other]
 */

const targetToH5Rules = {
  zt2: {
    target: 'zt_template',
    params: {
      id: 'topic_code',
    },
  },
  'couple-search-list': {
    target: 'couple_search_list',
    params: {
      q: 'search',
      category: 'category',
    },
  },
  detail: {
    target: 'detail',
    params: {
      id: 'sid',
    },
  },
  'couple-detail': {
    target: 'couple_detail',
    params: {
      id: 'pinactivitiesid',
    },
  },
  'zl-list': {
    target: 'zl_list',
    params: {},
  },
  'lottery-list': {
    target: 'lottery_list',
    params: {},
  },
  'lottery-detail': {
    target: 'lottery_detail',
    params: {
      id: 'pinactivitiesid',
    },
  },
}

// 逆向转换映射规则
function reverseRules(rule) {
  const targetRules = {}
  const { hasOwnProperty } = Object.prototype
  for (const key in rule) {
    if (hasOwnProperty.call(rule, key)) {
      const item = rule[key]
      targetRules[item.target] = {
        target: key,
        params: {},
      }
      for (const key2 in item.params) {
        if (hasOwnProperty.call(item.params, key2)) {
          const param = item.params[key2]
          targetRules[item.target].params[param] = key2
        }
      }
    }
  }
  return targetRules
}

const h5ToTargetRules = reverseRules(targetToH5Rules)

const urlRules = {
  // targetToH5Rules,
  h5ToTargetRules,
  h5HsqToH5Rules: targetToH5Rules,
}

export default urlRules
