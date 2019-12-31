<template>
  <dwd-page is-header>
    <div class="refund-detail">
      <div class="refund-banner">
        <div class="banner-title">{{ title }}</div>
        {{ content }}
      </div>
      <template v-if="auditList.length">
        <div v-for="(audit, auditIndex) in auditList" :key="auditIndex" class="audit-list">
          <div class="refund-title">
            <img 
              class="img" 
              :src="audit.type == 1 ? 'https://img1.haoshiqi.net/wxapp/img/seller_816481ce34.png' : audit.type == 2 ? 'https://img1.haoshiqi.net/wxapp/img/user_service_5c54fac867.png' : userImg"
            >
            <span class="name">{{ audit.type == 1 ? '卖家' : audit.type == 2 ? '好食期' : '我' }}</span>
            <span class="time">{{ audit.auditTime }}</span>
          </div>
          <div class="audit-content">
            <div>
              <span>{{ audit.statusDesc }}</span>
            </div>
            <div v-if="audit.status === 2">
              <span>退款金额：<span>¥{{ audit.amount / 100 }}</span></span>
            </div>
            <div v-if="audit.note">
              <span>说明：<span>{{ audit.note }}</span></span>
            </div>
          </div>
        </div>
      </template>
      <div class="refund-info">
        <div class="refund-title">
          <img class="img" :src="userImg">
          <span class="name">我</span>
          <span class="time">{{ applyTime }}</span>
        </div>
        <div class="refund-content">
          <div class="refund-reason">
            <span>退款原因：<span>{{ refundInfo.reason }}</span></span>
          </div>
          <div class="refund-style">
            <span>处理方式：<span>{{ refundInfo.method }}</span></span>
          </div>
          <div class="refund-style">
            <span>退款金额：<span>{{ refundInfo.amountDesc }}</span></span>
          </div>
          <div class="refund-explain">
            <span>退款说明：<span>{{ refundInfo.note }}</span></span>
          </div>
          <div v-if="refundInfo.pics" class="explain">
            <img 
              v-for="(img, imgIndex) in refundInfo.pics" 
              :key="imgIndex" 
              :src="img"
              class="explain-img"
              @click="previewImage(img)"
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="refundInfo.canComplaint" class="complain">
      <div class="complain-btn" @click="getCanComplaint">申请平台介入</div>
    </div>
    <div v-if="showBigPic" class="big-pic" @click="hideBigPic">
      <img class="big-pic-img" :src="currentSrc">
    </div>
  </dwd-page>
</template>
<script>
import {
  mapState,
} from 'vuex'
import { formatDate } from '@/utils/base/date'
import userImg from '@/assets/img/ic_aliprofile.png'

export default {
  name: 'order-refund-detail',
  data() {
    return {
      isLoading: false,
      refundInfo: {},
      title: '',
      applyTime: '',
      auditList: [],
      content: '',
      showBigPic: false,
      currentSrc: '',
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    }),
    refundOrderId() {
      return this.$route.query.refundId
    },
    userImg() {
      return this.userInfo.avatar || userImg
    },
  },
  created() {
    this.getRefundDetail()
  },
  methods: {
    getRefundDetail() {
      let refundOrderId = this.refundOrderId
      this.isLoading = true
      this.$api.refundDetail({
        weights: 1,
        refundOrderId,
      }, (res) => {
        this.setPageData(res)
      }, (err) => {
        console.log(err)
      })
    },
    setPageData(res) {
      const { data } = res
      this.applyTime = formatDate(data.refundInfo.applyTime * 1000, 'Y-M-D H:F:S')
      if (data.auditList.length > 0) {
        for (let index = 0; index < data.auditList.length; index++) {
          const auditTime = formatDate(data.auditList[index].time * 1000, 'Y-M-D H:F:S')
          data.auditList[index] = Object.assign({ ...data.auditList[index] }, { auditTime })
        }
      }
      this.isLoading = false
      this.refundInfo = Object.assign({}, data.refundInfo)
      this.title = data.title
      this.auditList = data.auditList
      this.content = data.content
    },
    //预览图片
    previewImage(src) {
      this.showBigPic = true
      this.currentSrc = src
    },
    hideBigPic() {
      this.showBigPic = false
    },

    //申诉
    getCanComplaint() {
      const refundId = this.refundOrderId
      this.$showConfirm({
        title: '提示', // confirm 框的标题
        message: '确认申诉？',
        callback: (res) => {
          if(res != 'cancel' && res != 'error') {
            this.$api.orderComplaint({
              refundOrderId: refundId,
            }, (res) => {
              this.setPageData(res)
            }, (err) => {

            })
          }
        },
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.refund-detail {
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
}

.refund-banner {
  color: rgba(255, 255, 255, .6);
  font-size: 12px;
  padding: 27px 80px 15px 30px;
  background: #FB0438;
  line-height: 17px;
}

.banner-title {
  color: #fff;
  font-size: 17px;
  line-height: 24px;
}

.audit-list, 
.refund-info {
    position: relative;
    width: 100%;
    background: rgb(255, 255, 255);
}

.refund-title {
    display: flex;
    position: relative;
    height: 40px;
    line-height: 40px;
    margin: 0 15px;
    border-bottom: 1px solid rgb(226, 226, 226);

}

.img {
    display: block;
    width: 20px;
    height: 20px;
    margin: 10px 0;
}

.name {
    margin-left: 10px;
    font-size: 14px;
    color: rgb(33, 33, 33);
}

.time {
    position: absolute;
    right: 0;
    font-size: 12px;
    color: rgb(153, 153, 153);
}

.audit-content {
    position: relative;
    width: 100%;
    line-height: 20px;
    text-align: left;
    font-size: 14px;
    color: rgb(153, 153, 153);
    padding: 10px 15px;
}

.refund-content {
    position: relative;
    padding: 10px 15px;
    font-size: 14px;
    color: rgb(153, 153, 153);
}

.refund-reason, 
.refund-style {
    position: relative;
    margin-bottom: 2px;
}

.explain {
    display: flex;
    position: relative;
    margin: 10px 0 4px 0;
}

.explain-img {
    display: block;
    width: 75px;
    height: 75px;
    margin-right: 15px;
}
.complain {
    position: absolute;
    width: 100%;
    height: 50px;
    background: #ED0000;
    color: rgb(255, 255, 255);
    left: 0;
    bottom: 0;
}
.complain-btn {
    height: 100%;
    font-size: 17px;
    line-height: 50px;
    text-align: center;
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