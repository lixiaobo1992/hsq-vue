(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["x-26"],{"2f21":function(t,e,i){"use strict";var s=i("79e5");t.exports=function(t,e){return!!t&&s((function(){e?t.call(null,(function(){}),1):t.call(null)}))}},"45a8":function(t,e,i){},"55dd":function(t,e,i){"use strict";var s=i("5ca1"),o=i("d8e8"),r=i("4bf8"),n=i("79e5"),c=[].sort,a=[1,2,3];s(s.P+s.F*(n((function(){a.sort(void 0)}))||!n((function(){a.sort(null)}))||!i("2f21")(c)),"Array",{sort:function(t){return void 0===t?c.call(r(this)):c.call(r(this),o(t))}})},f3e8:function(t,e,i){"use strict";var s=i("45a8"),o=i.n(s);o.a},fc2c:function(t,e,i){"use strict";i.r(e);var s,o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("dwd-page",[i("div",{staticClass:"phone-cost-page"},[i("div",{staticClass:"phone-box",class:{"focus-phone-box":t.showHistoryNum}},[i("div",{staticClass:"phone-number-box"},[i("div",{staticClass:"phone-number"},[i("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.rechargeTel,expression:"rechargeTel",modifiers:{trim:!0}}],staticClass:"num-input",class:{focus:t.showHistoryNum},attrs:{type:"number",placeholder:"请输入手机号码",maxlength:"11"},domProps:{value:t.rechargeTel},on:{focus:t.animateFocus,blur:[t.onClickShade,function(e){return t.$forceUpdate()}],input:function(e){e.target.composing||(t.rechargeTel=e.target.value.trim())}}})]),i("div",{directives:[{name:"show",rawName:"v-show",value:t.showHistoryNum,expression:"showHistoryNum"}],staticClass:"history-num-box view-scroll"},[i("div",{staticClass:"num-list"},t._l(t.historyNum,(function(e,s){return i("div",{key:s,staticClass:"num-item",on:{click:function(i){return t.onSelectHistoryNum(e)}}},[t._v(t._s(e))])})),0),i("div",{staticClass:"clear-history",on:{click:t.onClearHistoryNum}},[i("dwd-icon",{staticClass:"trash-icon",attrs:{type:"trash"}}),t._v("\n            清空历史记录\n          ")],1)])]),i("div",{directives:[{name:"show",rawName:"v-show",value:t.showHistoryNum,expression:"showHistoryNum"}],staticClass:"shade",on:{click:t.onClickShade}})]),i("div",{staticClass:"phone-cost-box",class:{"focus-phone-cost":t.showHistoryNum}},t._l(t.phoneCostList,(function(e,s){return i("div",{key:s,staticClass:"phone-cost",class:{"selected-cost":t.selectedCostIndex===s,"unselected-cost":t.isSelected&&t.selectedCostIndex!==s},on:{click:function(i){return t.goRecharge(e,s)}}},[i("p",{staticClass:"market-price"},[t._v(t._s(e.spec))]),i("p",{staticClass:"sale-price"},[t._v("售价"+t._s(t._f("dealPrice")(e.price))+"元")])])})),0),t._l(t.couponList,(function(e,s){return[i("div",{key:s,staticClass:"member-box"},[i("div",{staticClass:"member-head"},[i("p",{staticClass:"amount"},[t._v(t._s(e.value))])]),i("div",{staticClass:"member-content"},[i("div",{staticClass:"desc-box"},[i("p",{staticClass:"coupon-title"},[t._v(t._s(e.title))]),i("p",{staticClass:"coupon-desc"},[t._v(t._s(e.desc))])]),i("div",{staticClass:"member-btn",on:{click:function(i){return t.onClickMember(e)}}},[t._v(t._s(e.btnText))])])])]})),i("div",{staticClass:"customer-service",on:{click:t.goCustomerService}},[i("dwd-icon",{attrs:{type:"customer-service"}})],1),t._l(t.modulesList,(function(t){return i("div",{key:t.id,staticClass:"tpl-modules",attrs:{"data-type":t.type}},[i("dwd-modules",{ref:t.id,refInFor:!0,attrs:{data:t}})],1)}))],2)])},r=[],n=(i("8e6e"),i("456d"),i("28a5"),i("b54a"),i("55dd"),i("6762"),i("2fdb"),i("ac6a"),i("bd86")),c=(i("7f7f"),i("035f")),a=i("2f62"),u=i("51be"),d=i("9377"),l=i.n(d),h=l.a,p=/^(1[3-9][0-9])\d{8}$/,f=i("4183"),v=i("2ddd"),m=(i("a229"),i("2eba")),b=i("ed08");function g(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,s)}return i}function y(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?g(i,!0).forEach((function(e){Object(n["a"])(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):g(i).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var C={components:(s={},Object(n["a"])(s,c["a"].name,c["a"]),Object(n["a"])(s,m["a"].name,m["a"]),s),data:function(){return{rechargeTel:"",isSelected:!1,selectedCostIndex:"",phoneCostList:[],historyNum:[],showHistoryNum:!1,orderIds:[],needPayPrice:"",couponList:[],defaultSkuId:"",topic_id:"",modulesList:[]}},computed:y({},Object(a["c"])(["rechargeRecord"])),filters:{dealPrice:function(t){return(t/100).toFixed(2)}},created:function(){this.historyNum=this.rechargeRecord,this.getPhoneCost()},methods:y({},Object(a["b"])(["updateRechargeRecord"]),{getPhoneCost:function(){var t=this;this.$api.getPreaidList({},(function(e){var i=e.data,s=void 0===i?{}:i;t.phoneCostList=s.skuList||[],t.defaultSkuId=s.defaultSkuId,t.couponList=t.dealCouponList(s.couponList||[]),t.topic_id=s.topicId;var o=s.openCardConfig,r=void 0===o?{}:o;s.isHsqUserMember||t.couponList.unshift({value:r.price,title:r.title,desc:r.subTitle,btnText:"开通领取",url:r.url,isToOpen:!0}),s.topicId&&t.gettopic()}),(function(e){return t.$showToast(e.errmsg),!0}))},dealCouponList:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return t.map((function(t){return{value:"".concat(t.value/100,"元"),title:t.title,desc:"有效期:".concat(Object(v["d"])(t.start_at,"Y.M.D"),"-").concat(Object(v["d"])(t.end_at,"Y.M.D")),couponCode:t.coupon_code,btnText:"立即使用",isToOpen:!1,status:t.status}}))},goRecharge:function(t,e){return this.rechargeTel?p.test(this.rechargeTel)?(this.setNumHistory(),this.selectedCostIndex=e,this.isSelected=!0,void this.orderInit([{skuId:t.sku_id,amount:1,price:t.price}])):this.$showToast("请输入正确的手机号码"):this.$showToast("请输入手机号码")},setNumHistory:function(){var t=this,e=this.historyNum.filter((function(e){return e!==t.rechargeTel}));10===e.length?e.splice(0,1,this.rechargeTel):e.unshift(this.rechargeTel),this.updateRechargeRecord(e)},orderInit:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];if(h.hsq&&this.$version.lt("3.9.10"))return this.$showToast("请更新最新版本");i=i.length?JSON.stringify(i):"",this.$api.orderInitV1({skusInfo:JSON.stringify(e),couponCodeInfo:i,isCheckedMember:0,isFastbuy:1,addressId:0},(function(e){var i=e.data,s=void 0===i?{}:i,o=s.packageInfo,r=void 0===o?{}:o;t.needPayPrice=r.needPayPrice;var n=r.platformCouponList,c=void 0===n?[]:n,a=[];c.length&&c.forEach((function(t){t.selected&&a.push({merchantId:t.merchant_id,couponCode:t.coupon_code,status:1,memberCoupon:t.member_coupon})})),t.submitOrder(s.confirmSid,a)}),(function(t){}))},submitOrder:function(t,e){var i=this;this.$api.submitOrderV1({confirmOrderSerialId:t,addressId:0,isCheckedMember:0,consigneePhone:this.rechargeTel,couponCodeInfo:JSON.stringify(e)},(function(t){var e=t.data,s=e.orderIds,o=void 0===s?[]:s,r=e.needPay,n=void 0===r||r;if(i.orderIds=o,n)i.goPay();else{if(h.aliapp)return void f["a"].ready((function(){my.navigateTo({url:"../order-list/order-list"})}));var c="";["dev","beta"].includes(u["a"].apiEnv)&&(c=u["a"].apiEnv+".");var a="https://m.".concat(c,"haoshiqi.net/v2/order-list?type=0");i.$forward(a,{})}i.getPhoneCost();var d=setTimeout((function(){i.selectedCostIndex="",i.isSelected=!1,clearTimeout(d)}),500)}),(function(t){}))},goPay:function(){var t=this;if(h.hsq)f["a"].cashier({id:this.orderIds.join(","),price:this.needPayPrice,type:0,success:function(t){},fail:function(t){}});else{var e={pay_type:"phone-cost",orderIds:t.orderIds.join(","),notMember:!0};if(h.wxapp&&f["a"].ready((function(t){var i="/pages/pay/pay";i=Object(v["k"])(i,Object(v["i"])(e)),t.miniProgram.navigateTo({url:i})})),h.aliapp){var i="../pay/pay";i=Object(v["k"])(i,Object(v["i"])(e)),f["a"].ready((function(){my.navigateTo({url:i})}))}}},gettopic:function(){var t=this;this.$api.getNewTopicInfo({code:this.topic_id},(function(e){t.modulesList=t.dealModuleList(e.data.list);var i=t;t.$nextTick((function(){i.dealModuleRefs()}))}),(function(t){}))},dealModuleRefs:function(){for(var t in this.anchorPointArray=[],this.anchorPoint){var e=this.$refs[t];if(e){Object(v["e"])(e)&&(e=this.$refs[t][0],e._isVue&&(e=e.$el));var i=e.getBoundingClientRect()||{top:0},s=i.top-this.fixedLabel.height-(this.headerObj&&this.headerObj.height||0),o={top:Math.round(s),modules_id:t};this.anchorPoint[t]=o,this.anchorPointArray.push(o)}}this.anchorPointArray.sort((function(t,e){return t.top-e.top}))},dealModuleList:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=["c-img","c-img-hor","c-swiper","c-category","c-tofu","c-product-col1","c-product-col2","c-product-col3","c-product-slider"],s=e.filter((function(t){return i.includes(t.type)})),o=s.map((function(e){var i=y({},e);switch(e.type){case"c-product-col1":return Object.assign(i,t.dealCProduct(e));case"c-product-col2":return Object.assign(i,t.dealCProduct(e));case"c-product-col3":return Object.assign(i,t.dealCProduct(e));case"c-product-slider":return Object.assign(i,t.dealCProduct(e));default:return i}}));return o},dealCProduct:function(t){var e=this;return{eventClick:function(t){t.biz_id;var i=t.can_bought,s=t.left_stock,o=t.link;i&&s&&o&&e.$forward(o)},list:this.dealProductList(t)}},dealProductList:function(t){var e=this,i=t.list||[];return i.map((function(t){var i=parseInt((t.all_stock-t.left_stock)/t.all_stock*100);return y({},t,{tags:t.tags.splice(0,3)||[],market_price:Object(b["a"])(t.market_price),price:e.productPrice(Object(b["a"])(t.price)),rate_percent:i})}))},productPrice:function(t){var e=t.split(".");return{price_yuan:e[0],price_fen:e[1]}},animateFocus:function(){this.showHistoryNum=!0},onSelectHistoryNum:function(t){this.rechargeTel=t,this.showHistoryNum=!1},onClearHistoryNum:function(){this.historyNum=[],this.updateRechargeRecord([])},onClickShade:function(){var t=this,e=setTimeout((function(){t.showHistoryNum=!1,clearTimeout(e)}),100)},onClickMember:function(t){var e=this;if(t.isToOpen)return h.aliapp?void my.postMessage({url:t.url,type:"url"}):void this.$forward(t.url);if(!this.rechargeTel)return this.$showToast("请输入手机号码");var i={amount:1};this.phoneCostList.forEach((function(t){t.sku_id===e.defaultSkuId&&(i.price=t.price,i.skuId=t.sku_id)})),this.orderInit([y({},i)],[{couponCode:t.couponCode,status:t.status}])},goCustomerService:function(){if(h.aliapp)f["a"].ready((function(){my.navigateTo({url:"../service/service"})}));else{var t="";["dev","beta"].includes(u["a"].apiEnv)&&(t=u["a"].apiEnv+".");var e="https://m.".concat(t,"haoshiqi.net/v2/service");this.$forward(e,{})}}})},w=C,_=(i("f3e8"),i("2877")),O=Object(_["a"])(w,o,r,!1,null,"2ababcd7",null);e["default"]=O.exports}}]);