
import api from '@/api/index'

import { storage } from '@/utils/storage'
import { GD_MAP_AK } from '@/config/index'
// let userInfo = storage.get('userInfo') || {};
import { clone } from '@/utils/base'
import axios from 'axios'
import user from './user'


const defaultInfo = {
  currentProvinceId: '857', 
  currentAddress: '上海 上海市', 
  addressId: null, 
  cityId: 857,
}
let addresses = []
let zones = storage.get('zones') || []
let addressInfo = defaultInfo
let fixedPosition = storage.get('fixedPosition') || null

const defaultState = {
  fixedPosition: clone(defaultInfo),            //定位最终需要的信息
  geoInfo: {}, // 定位原始信息
  locationState: {
    code: 1, // 1 定位中，2 定位成功， 3 定位失败
    text: '定位中...',
    time: 0,
  },
  addresses: addresses,           //所有收货地址
  zones: zones,                   //全国省份信息
  addressInfo: addressInfo,                    //当前地址信息
}
const mutations = {

  // 修改当前定位状态
  ['SET_LOCATED_STATE'](state, payload) {
    const { stateCode } = payload
    let newState = ''
    let time = 0
    switch (stateCode) {
      case 1: // 定位中...
        newState = '定位中...'
        time = 0
        break
      case 2: // 定位成功
        newState = '定位成功'
        time = new Date().getTime()
        break
      case 3: // 定位失败
        newState = '定位失败'
        time = 0
        break
      default:
        newState = '定位中...'
        time = 0
    }
    // state.locationStateCode = state
    const locationState = {
      code: stateCode,
      text: newState,
      time,
    }
    state.locationState = locationState
  },
  // 修改定位信息
  ['SET_GEO_INFO'](state, payload) {
    const { geoInfo = {} } = payload
    state.geoInfo = geoInfo
    let currentAddress = geoInfo.province + ' ' + geoInfo.city
    state.fixedPosition = { 
      currentProvinceId: geoInfo.provinceId, 
      currentAddress: currentAddress, 
      addressId: null, 
      cityId: geoInfo.cityId ,
    }
  },
  ['SET_ADDRESSES'](state, address) {
    state.addresses = address
  },
  ['SET_ZONES'](state, zoneList) {
    state.zones = zoneList
  },
  ['SET_ADDRESS_INFO'](state, address) {
    api.setCommonParams({
      zoneId: address.currentProvinceId || '857',
      cityId: address.cityId || '857',
    })
    state.addressInfo = address

  },
}

// let geoEvent;
// 定位请求队列
let geoEventList = []
let isLocation

const actions = {

  getGeo({ commit, state }, payload = {}) {
    console.log('location.js getGeo 进来了。。。')

    // 赋值 回调方法
    // geoEvent = payload;
    let index = -1
    // 检查是否存在重复添加
    for (let i = 0; i < geoEventList.length; i++) {
      if (geoEventList[i]['name'] === payload.name) {
        index = i
        break
      }
    }
    // 删除重复订阅
    if (index !== -1) {
      geoEventList.splice(index, 1)
    }
    geoEventList.push(payload)
    if(state.addresses.length) {
      if (geoEventList.length) {
        for (let i = 0; i < geoEventList.length; i++) {
          geoEventList[i]['hasLocation'].call(this)
        }
        geoEventList = []
      }
      return
    }
    // 如果缓存中有定位信息
    if(!!fixedPosition) {
      commit({ type: 'SET_GEO_INFO', geoInfo: fixedPosition })
      isLocation = true
    }
    // 判断 在此之前是否有定位
    if (!isLocation) {
      isLocation = true
      commit({ type: 'SET_LOCATED_STATE', stateCode: 1 })

      getLocation({
        success: res => {
          
          // console.log('location.js',res.coords)
          baiduMapGeoInfo(res).then(res => {
            if(res.errno == 0) {
              commit({ type: 'SET_LOCATED_STATE', stateCode: 2 })
              // console.log('逆地理编码 成功:', res);
              commit({ type: 'SET_GEO_INFO', geoInfo: res })
              storage.set('fixedPosition', res, 60 * 15)

              if (geoEventList.length) {
                for (let i = 0; i < geoEventList.length; i++) {
                  geoEventList[i]['success'].call(this, res)
                }
                geoEventList = []
              }
            } else {
              commit({ type: 'SET_LOCATED_STATE', stateCode: 3 })
              if (geoEventList.length) {
                for (let i = 0; i < geoEventList.length; i++) {
                  geoEventList[i]['fail'].call(this, res)
                }
                geoEventList = []
              }
            }

          }, (err) => {
            console.log('解析失败', err)
            commit({ type: 'SET_LOCATED_STATE', stateCode: 3 })
            if (geoEventList.length) {
              for (let i = 0; i < geoEventList.length; i++) {
                geoEventList[i]['fail'].call(this, err)
              }
              geoEventList = []
            }
          })
        },
        fail: err => {
          console.log('获取定位信息 失败:', err)
          commit({ type: 'SET_LOCATED_STATE', stateCode: 3 })
          if (geoEventList.length) {
            for (let i = 0; i < geoEventList.length; i++) {
              geoEventList[i]['fail'].call(this, err)
            }
            geoEventList = []
          }
        },
      })

    } else {
      if (geoEventList.length) {
        for (let i = 0; i < geoEventList.length; i++) {
          geoEventList[i]['hasLocation'].call(this)
        }
        geoEventList = []
      }
    }
  },
  // 获取用户收货地址信息
  async getAddresses({ commit, state }) {
    if(state.addresses.length) {
      return
    }
    console.log(user)
    if (!user.state.logged) {
      commit('SET_ADDRESSES', [])
    } else {
      await prepareAddressList().then(res => {
        commit('SET_ADDRESSES', res)
        if(res.length) {
          let defaultAddr = res.find(addr => addr.isDefault)
          let oldCity = state.addressInfo
          if (oldCity.currentAddress != defaultAddr.currentAddress) {
            commit('SET_ADDRESS_INFO', defaultAddr)
          }
        }
      }).catch(err => {
        commit('SET_ADDRESSES', [])
      })
    }
  },
  async getZones({ commit, state }) {
    if(state.zones.length) {
      return
    }
    await api.provinceList({}, (res) => {
      const results = res.data.list
      let resultsNew = []
      results.map(result => {
        let resultNew = {}
        resultNew.currentProvinceId = result.id
        resultNew.currentAddress = result.province
        resultNew.addressId = null
        resultsNew.push(resultNew)
      })
      storage.set('zones', resultsNew, 86400 * 30)
      commit('SET_ZONES', resultsNew)
    }, (err) => {
      return true
    })
  },
  setAddressInfo({ commit, state }, address) {
    commit('SET_ADDRESS_INFO', address)
  },
}

// 获取定位信息
function getLocation({ success, fail }) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        success && success(res)
      }, 
      (err) => {
        fail && fail(err)
      }, 
      { enableHighAcuracy: true, timeout: 10000, maximumAge: 0 })  // 这里设置超时为2000毫秒
  } else {     
    fail && fail(err)
  }
}

// 根据高德定位的城市名，获取在本地缓存的城市列表中匹配，
// 将高德的cityCode转换为好食期cityId
function baiduMapGeoInfo(pos) {

  return new Promise((resolve, reject) => {
    console.log('逆地址解析')
    axios({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      method: 'GET',
      withCredentials: false,
      params: {
        key: GD_MAP_AK,
        location: pos.coords.longitude + ',' + pos.coords.latitude,
        output: 'json',
      },
    }).then(res => {
      const { regeocode } = res.data
      console.log('逆地理编码数据:', res.data)
      const { addressComponent = {} } = regeocode
      let geoInfo = {}
      api.getCityId({
        aMapId: addressComponent.citycode,
      }, res => {
        geoInfo = res.data
        resolve(geoInfo)
      }, err => {
        resolve(err)
      })
    }).catch(err => {
      reject(err)
    })
  })
}
function prepareAddressList() {
  return new Promise(function (resolve, reject) {
    api.addressList({}, (res) => {
      const results = res.data.list.slice(0, 10)
      let resultsNew = []
      results.map(result => {
        let resultNew = {}
        let address = result.province + result.city + result.district + result.detail_address
        if (result.province == result.city) {
          address = result.city + result.district + result.detail_address
        }
        resultNew.currentProvinceId = result.province_id
        resultNew.currentAddress = address
        resultNew.addressId = result.id
        resultNew.cityId = result.city_id
        resultNew.isDefault = result.is_default
        resultsNew.push(resultNew)
      })
      resolve(resultsNew)
    }, (err) => {
      return true
    })
  })
}

export default {
  state: defaultState,
  mutations,
  actions,
}
