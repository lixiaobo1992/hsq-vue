<template>
  <dwd-page is-header>
    <form class="order-refund">
      <div v-if="product.skuName" class="prod-box">
        <img class="prod-img" :src="product.imgUrl">
        <div class="prod-right">
          <div class="prod-name max-line-2">{{ product.skuName }}</div>
          <div v-for="(attr, attrIndex) in product.attrs" :key="attrIndex" class="prod-attrs">{{ attr }}</div>
        </div>
      </div>

      <div class="content">
        <div class="refund-style">
          <!-- <span class="refund badge">*</span> -->
          <div class="refund style-title">处理方式:</div>
          <div class="refund refund-value" :data-refundmothod="refundMethod">{{ refundMethodName }}</div>
        </div>
        <div class="refund-reason" @click="initActionsheet">
          <!-- <span class="refund badge">*</span> -->
          <div class="reason-content">
            <div class="refund reason-title">退款原因:</div>
            <div v-if="reason" class="refund refund-value" :data-reasonid="reasonId">{{ reason }}</div>
            <div v-else class="refund refund-value">请选择退款原因</div>
          </div>
          <div class="right">
            <img src="https://img1.haoshiqi.net/wxapp/img/more_85508a3b09.png" class="right-link">
          </div>
        </div>
        <div v-if="product.pay_price" class="refund-style refund-money">
          <!-- <span class="refund badge">*</span> -->
          <div class="refund style-title">退款金额:</div>
          <div class="refund refund-value">￥{{ product.pay_price }}</div>
        </div>
        <div class="refund-explain">
          <div class="explain">
            <div class="refund explain-title">退款说明:</div>
            <textarea 
              v-model="comment" 
              class="refund refund-textarea"
              style="min-height:17px;line-height:16px; font-size:12px; color:rgbrgb(153, 153, 153);" 
              placeholder="最多可填写500个字" 
              maxlength="500"
            />
          </div>
        </div>
        <div class="refund-img">
          <div class="img-title" :class="{ 'is-required': salesRefundType === 'AFTER_SALES' }">
            <span class="upload-title">最多可上传3张</span>
            <span class="upload-rule">（建议产品照片、内包装盒照片、含快递单的外包装箱照片各一张）</span>
          </div>
          <div class="upload-img">
            <div v-for="(img, imgIndex) in imageList" :key="imgIndex">
              <div class="img-view" @click="previewImage(img)">
                <img class="img" :src="img">
                <div class="clear-icon" @click.stop="clearImage(imgIndex)">
                  <dwd-icon type="delete" size="16" color="#999" bg="#fff" />
                </div>
              </div>
            </div>
            <div v-if="imageList.length < imageMax" class="upload" @click="uploadImage">
              <div class="line1" />
              <div class="line2" />
            </div>
            <input 
              ref="upload-img" 
              type="file" 
              class="file-input" 
              accept="image/*" 
              multiple 
              style="display: none" 
              @change="uploadChange"
            >
          </div>
        </div>
      </div>
      <button class="submit" :class="{'submit-ok' : reason }" @click.prevent="formSubmit">提交</button>
    </form>
    <div v-if="showBigPic" class="big-pic" @click="hideBigPic">
      <img class="big-pic-img" :src="currentSrc">
    </div>
    <mt-actionsheet
      v-model="sheetVisible"
      :actions="refundReason"
    />
  </dwd-page>
</template>
<script>
import { Actionsheet } from 'mint-ui'
import { dealPrice } from '@/utils'
import icon from '@/ui/icon'
import { ajaxFormData } from '@/api/request/axios'
let files = []
const qnInfo = {
  domain: 'https://img2.haoshiqi.net/',
}

export default {
  components: {
    [Actionsheet.name]: Actionsheet,
    [icon.name]: icon,
  },
  data() {
    return {
      isLoading: true,
      imageList: [],
      imageMax: 3,
      showBigPic: false,
      imgUrl: '',
      product: {
        pay_price: 0,
      },
      refundMethodName: '',
      refundMethod: '',
      refundReason: [],
      salesRefundType: '',
      sheetVisible: false,
      reason: '',
      reasonId: 0,
      comment: '',
      currentSrc: '',
    }
  },
  computed: {
    subOrderId() {
      return this.$route.query.subOrderId
    },
    orderId() {
      return this.$route.query.orderId
    },
  },
  created() {
    this.getRefundInit()
  },
  methods: {
    getSubOrderInfo() { // 获取子订单详情
      const subOrderId = this.subOrderId || ''
      if (!subOrderId) {
        return
      }
      this.$api.subOrderInfo({
        subOrderId,
      }, (res) => {
        let product = {
          imgUrl: res.data.sku_thumbnail || res.data.skuThumbnail,
          skuName: res.data.sku_name,
          attrs: res.data.attrs_desc,
          pay_price: dealPrice(res.data.pay_price),
        }
        this.product = Object.assign({}, this.product, product)
      }, (err) => {
        console.log(err)
      })
    },

    getRefundInit() {
      const orderId = this.orderId || ''
      const subOrderId = this.subOrderId || ''
      if (!orderId) {
        this.$showToast('参数order_id错误')
        return
      }
      this.isLoading = true
      this.$api.refundInit({
        weights: 1,
        orderId,
        subOrderId,
      }, (res) => {
        const { data } = res
        this.isLoading = false
        this.refundMethodName = data.refundMethodList[0].name
        this.refundMethod = data.refundMethodList[0].id
        this.refundReason = data.reasonList
        this.salesRefundType = data.salesRefundType
        this.getSubOrderInfo()
      }, (err) => {
        console.log(err)
      })
    },
    initActionsheet() {
      this.sheetVisible = true
      this.refundReason.map(reason => reason.method = this.chooseReason)
    },
    //选择退款原因
    chooseReason(item) {
      let { name, id } = item
      this.reason = name
      this.reasonId = id
    },
    //上传图片
    uploadImage() {
      this.$refs['upload-img'].click()
    },
    getImageCount() {
      const count = this.imageMax - this.imageList.length
      return count > 0 ? count : 0
    },
    uploadChange(e) {
      let that = this
      files = e.target.files || []
      let length = this.imageList.length + files.length
      if(length > this.imageMax) {
        this.$refs['upload-img'].value = ''
        this.$showToast(`最多允许上传${this.imageMax}张`)
        return
      }
      for(let i = 0; i < files.length; i++) {
        let reader = new FileReader()
        reader.readAsDataURL(files[i])
        reader.onload = function (event){
          that.imageList.push(event.target.result)
        }
      }
      
    },
    //预览图片
    previewImage(src) {
      this.showBigPic = true
      this.currentSrc = src
    },
    hideBigPic() {
      this.showBigPic = false
    },
    clearImage(index) {
      this.imageList.splice(index, 1)
    },

    //点击提交
    formSubmit(e) {
      if (!this.reason) {
        this.$showToast('请选择退款原因！')
        return
      }
      if (this.salesRefundType === 'AFTER_SALES' && this.imageList.length <= 0) {
        this.$showToast('请上传图片！')
        return
      }
      this.$showConfirm({
        title: '提示', // confirm 框的标题
        message: '确认提交？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (res) => {
          if(res != 'cancel' && res != 'error') {
            this.upload()
          }
        },
      })
    },
    upload() {
      if (qnInfo.token) {
        this.uploadQiniu()
      } else {
        this.$api.getQiniuToken({}, (res) => {
          qnInfo.token = res.data.token
          this.uploadQiniu()
        }, (err) => {
          this.$showToast('获取图片上传权限失败，请重新操作')
        })
      }
    },
    //上传图片到七牛云
    uploadFile(file) {
      return new Promise((resolve, reject) => {
        let form = new FormData()
        form.append('file', file)
        ajaxFormData(qnInfo.token, form)
          .then(res => {
          const { data }= res
          const url = qnInfo.domain + data.hash + '?imageView2/0/q/70'
          console.log(url)
          resolve(url)
        }).catch(err => {
          reject(new Error('上传失败'))
          this.$showConfirm({
            title: '错误',
            message: '上传失败',
          })
        })
      })
    },


    uploadQiniu() {
      const imgs = files
      const uploadTasks = []
      for (let i = 0; i < imgs.length; i++) {
        uploadTasks.push(this.uploadFile(imgs[i]))
      }

      // // 这里有个问题，上传是异步操作，要全部执行完，再继续执行，需要封装下，等待执行完
      // // 这里封装为 Promise，使用 Promise.all 执行

      Promise.all(uploadTasks).then((res) => {
        // 全部上传完成后，继续提交动作
        this.afterUploadedImg(res)
      }, (err) => {
        console.log(err)
      })
    },
    afterUploadedImg(data) {
      const imgs = data.length > 0 ? JSON.stringify(data) : ''
      const orderId = this.orderId || ''
      const subOrderId = this.subOrderId || ''
      console.log(data)
      this.$api.refundApply({
        orderId,
        subOrderId,
        refundMethod: this.refundMethod,
        reasonId: this.reasonId,
        comment: this.comment,
        pics: imgs,
      }, (res) => {
        const { id } = res.data.refundInfo
        console.log(id)
        this.goRefundDetail(id)
      }, (err) => {
        console.log(err)
      })
    },

    goRefundDetail(id) {
      // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
      this.$forward('order-refund-detail', {
        refundId: id,
        replace: true,
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.order-refund {
  width: 100%;
  height: 100%;
  background: rgb(245, 245, 249);
}
.prod-box {
  display: flex;
  padding: 10px 10px 10px 15px;
  background: #fff;
}
.prod-img {
  width: 90px;
  height: 90px;
}

.prod-right {
  flex: 1;
  padding-left: 10px;
  box-sizing: border-box;
}

.prod-name {
  font-size: 12px;
  font-weight: bold;
  max-height: 34px;
  line-height: 17px;
  margin-bottom: 5px;
}

.prod-attrs {
  line-height: 16px;
  font-size: 11px;
  color: #999999;
}
.content {
  position: relative;
  width: 100%;
  margin-top: 10px;
  background: rgb(255, 255, 255);
}

.refund-style,
.refund-reason {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid rgb(226, 226, 226);
    padding: 0 10px 0 15px;
}
.refund-reason {
  justify-content: space-between;  
}
.refund-money .refund-value {
  color: #F73552;
}
.style-title, 
.reason-title {
  position: relative;
  margin-left: 12px;
  margin-right: 15px;
  font-size: 14px;
  text-align: right;
  color: rgb(33, 33, 33);
}
.is-required,
.style-title, 
.reason-title {
  &:before {
    content: '*';
    position: absolute;
    left: -10px;
    font-size: 2px;
    margin-left: 2px;
    color: rgb(255, 85, 85);
  }
}
.is-required:before {
  top: 2px;  
}
.reason-content {
  display: flex;
  align-items: center;
}

.refund-value {
  font-size: 12px;
  color: rgb(33, 33, 33);
}

.right {
  width: 15px;
  height: 15px;
}
.right-link {
  display: block;
  width: 100%;
  height: 100%;
}

.refund-explain {
  position: relative;
  width: 100%;
  min-height: 80px;
  line-height: 40px;
  border-bottom: 1px solid rgb(226, 226, 226);
  padding: 0 10px 0 15px;
}
.explain {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.explain-title {
  flex-shrink: 0;
  height: 20px;
  margin-left: 12px;
  font-size: 14px;
  text-align: right;
  color: rgb(33, 33, 33);
}
.refund-textarea {
  display: block;
  float: left;
  resize: none;
  border: none;
  outline: none
  width: 100%;
  height: 100%;
  margin: 9px 0 0 15px;
  padding-top: 2px;
  padding-bottom: 12px;
}
.clear-icon {
  position: absolute;
  top: -8px;
  right: -8px;
}

.btn {
  margin: 90px 15px 0 15px;
  height: 44px;
}

.submit {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 44px;
  line-height: 44px;
  overflow: hidden;
  background: #CCCCCC;
  font-size: 17px;
  color: #fff;
  margin: 0;
  border-radius: 0;
  display: block;
  z-index: 1;
  border: none;
}

.submit::after {
  border: none;
}

.submit-ok {
  background: #FB0438;
}

.refund-img {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
  padding: 10px 10px 0 15px;
}

.img-title {
  position: relative;
  margin-left: 12px;
}

.upload-title {
  font-size: 14px;
  text-align: right;
  color: rgb(33, 33, 33);
}

.upload-rule {
  position: relative;
  font-size: 14px;
  padding-top: 2px;
  text-align: right;
  color: rgb(255, 85, 85);
}

.upload-img {
    position: relative;
    display: flex;
    width: 100%;
}

.upload {
  position: relative;
  width: 75px;
  height: 75px;
  border: 1px solid rgb(229, 229, 229);
  margin: 10px 0 20px 12px;
}

.line1 {
    position: absolute;
    width: 15px;
    height: 3px;
    background: rgb(229, 229, 229);
    top: 36px;
    left: 30px;

}

.line2 {
  position: absolute;
  width: 3px;
  height: 15px;
  background: rgb(229, 229, 229);
  top: 30px;
  left: 36px;

}

.img-view {
  position: relative;
  width: 75px;
  height: 75px;
  margin: 10px 0 20px 12px;
}
.img {
  width: 100%;
  height: 100%;
}
.big-pic {
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  background: rgba(60, 60, 60, .55);
  z-index: 100;
  width: 100%;
  height: 100%;
}
.big-pic-img {
  width: 100%;  
}

</style>