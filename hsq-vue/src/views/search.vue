<template>
  <div class="page">
    <div class="search">
      <div class="btn-search fr" @click="goBack">
        取消
      </div>
      <div class="search-input">
        <dwd-icon class="icon-index-search flex-shrink" type="search" :size="14" />
        <form class="search-block" action="javascript:void 0">
          <input 
            v-model="inputValue" 
            class="input" 
            type="search"
            :placeholder="placeholder"
            :focus="focus"
            :data-link="hotSearch.url"
            @input="onInputValue"
            @keyup.13="(hotSearch.url && !inputValue) ? $onUrlPage($event) : onInputSearch($event)"
          >
        </form>
        <div v-if="inputValue.length > 1" class="clear-icon" @click.stop="clearInput">
          <dwd-icon class="icon-content flex-shrink" type="delete" color="#999" :size="14" />
        </div>
      </div>
    </div>
    <!-- 搜索建议 -->
    <div v-if="searchList.length" class="search-suggest">
      <div 
        v-for="(search, searchIndex) in searchList" 
        :key="searchIndex" 
        class="search-suggest-item"
        :data-value="search.keywords"
        :data-link="search.link"
        :data-index="searchIndex"
        @click="search.link ? $onUrlPage($event) : onHotSearch($event)"
      >
        <div class="search-suggest-keywords">
          <div v-html="search.highlight.keywords" />
        </div>
        <div class="search-suggest-num">
          <div v-html="search.highlight.item_num" />
        </div>
      </div>
    </div>

    <template v-else>
      <!-- 热门搜索 -->
      <div v-if="hotSearchList.length" class="hotSearch">
        <div class="section">
          <span class="section-text">热门搜索</span>
        </div>
        <div class="row">
          <div
            v-for="(hotSearch, index) in hotSearchList"
            :key="index"
            class="item"
            :data-link="hotSearch.url"
            :data-index="index"
            :data-value="hotSearch.value"
            :class="hotSearch.url ? 'url' : ''"
            @click="hotSearch.url ? $onUrlPage($event) : onHotSearch($event)"
          >{{ hotSearch.value }}
          </div>
        </div>
      </div>

      <!-- 最近搜索 -->
      <div class="history">
        <div class="section">
          <span class="section-text">最近搜过</span>
          <div v-if="historyList && historyList.length" class="garbage" @click="onGarbage">
            <img class="garbage-img" src="https://img1.haoshiqi.net/miniapp/img/icon_garbage_af9fc75f34.png">
          </div>
        </div>
        <div class="row">
          <div
            v-for="history in historyList"
            :key="history"
            class="item"
            @click="onClickHistory(history)"
          >{{ history }}
          </div>
        </div>

        <div v-if="!historyList.length" class="tip">暂无搜索记录</div>
      </div>
    </template>
    
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { Icon } from '@/ui'
import { debounce } from '@/utils'
import { storage } from '@/utils/storage'

let historyType = ''
export default {
  components: {
    [Icon.name]: Icon,
  },
  data() {
    return {
      historyList: [], // 历史搜索记录
      inputValue: '',
      couponId: '',
      focus: true,
      hotSearchList: [],
      searchList: [],     //原始搜索建议列表
    }
  },
  computed: {
    ...mapState({
      appConfig: state => state.app.appConfig,
    }),
    placeholder() {
      return (
        (this.appConfig && this.appConfig.hotSearch && this.appConfig.hotSearch.value) ||
        (this.isPinSku ? '搜索可使用券的商品' : '搜索您想找的商品')
      )
    },
    hotSearch() {
      return this.appConfig && this.appConfig.hotSearch
    },
    // 从单品sku列表跳转过来为true，其它情况为false
    isPinSku() {
      return this.$route.query.ref == 'couple_list'
    },
  },
  created() {
    this.getHistory()
    this.onFecthData()
  },
  methods: {
    // 获取热门搜索数据
    onFecthData() {
      this.$api.getHotSearch({
      }, (res) => {
        let { data: { list } } = res
        this.hotSearchList = list
      }, (err) => {
        console.log(err)
      })
    },
    // 获取本地储存的搜索历史
    getHistory() {
      historyType = this.isPinSku ? 'skuHistoryList' : 'historyList'
      this.historyList = storage.get(historyType) || []
    },
    clearInput() {
      this.inputValue = ''
      this.searchList = []
    },

    // 获取input value
    onInputValue(e) {
      if (this.inputValue) {
        debounce(this.getSearchSuggest.bind(this), 300)()
      } else {
        this.searchList = []
      }
    },
    // 获取搜索建议
    getSearchSuggest() {
      this.$api.getSearchSuggest({
        isLoading: false,
        keywords: this.inputValue,
      }, res => {
        let { data: { list } } = res
        this.searchList = list
      }, err => {
        console.log(err)
      })
    },

    // 热门搜索
    onHotSearch(e) {
      const { value, index } = e.currentTarget.dataset
      this.$forward('couple-search-list', {
        q: value,
      })
      this.onSaveLocal(value)
    },
    goBack() {
      this.$back()
    },
    // 搜索
    onInputSearch() {
      let value = this.inputValue
      if (!this.hotSearch.url && this.hotSearch.value && !this.value) {
        value = this.hotSearch.value
      }

      if (!value.length) {
        this.$showToast('关键字不能为空')
        return
      }
      this.onSaveLocal(value)
      this.$forward('couple-search-list', {
        q: value,
      })
      // this.onForward(e.currentTarget.dataset.id, value, isPinSku);
    },
    // 清空搜索记录
    onGarbage() {
      let that = this
      this.$showConfirm({
        title: '提示',
        message: '确定清空搜索历史吗？',
        callback(res) {
          if(res != 'cancel' && res != 'error') {
            that.historyList = []
            storage.remove(historyType)
          }
        },
      })
    },
    // 添加当前搜索历史到第一个
    addHistory(value) {
      let index = this.historyList.indexOf(value)
      if (index > -1) {
        this.historyList.splice(index, 1)
      }
      this.historyList.splice(0, 0, value)
    },
    onClickHistory(value) {
      this.addHistory(value)
      this.$forward('couple-search-list', {
        q: value,
      })
      this.onSaveLocal(value)
    },
    // 搜索历史保存到本地
    onSaveLocal(value) {
      if(this.historyList.length) {
        this.addHistory(value)
      } else {
        this.historyList.push(value)
      }
      if(this.historyList.length > 10) {
        const array = this.historyList.slice(0, 10)
        this.historyList = array
      }
      storage.set(historyType, this.historyList, 0)
      // localStorage.setItem(historyType, JSON.stringify(this.historyList))
    },
  },
}
</script>
<style lang="stylus" scoped>
.page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 搜索框 */
.search {
  width: 100%;
  height: 44px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(231,231,231,0.50);
  transform: translate3d(0,0,0);
}

.search-input {
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 50px 0 15px;
  border-radius: 6px;
  height: 100%;
  flex: 1;
}
.icon-index-search {
  position: absolute;
  left: 10px;
  color: #b4b4b4;
}

.search-input .icon-search {
  width: 30px;
  height: 30px;
  padding-right: 10px;
  
}
.clear-icon {
  width: 30px;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
}
input[type="search"]::-webkit-search-cancel-button {
  display: none;
}
.search-block {
  width: 100%;  
}

.input {
  display: block;
  width: 100%;
  height: 24px;
  padding: 5px 10px 5px 30px;
  border: none;
  border-radius: 12px;
  color: #212121;
  background-color: #fafaf8;
}

.btn-search {
  color: #333;
  font-size: 14px;
  padding: 0 10px;
  height: 100%;
  display: flex;
  align-items: center;
}

/* 最近搜过 */
.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 10px 15px;
}

.section .section-text {
  font-size: 14px;
  color: rgb(102, 102, 102);
}

.garbage {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 30px;
}

.garbage .garbage-img {
  width: 15px;
  height: 15px;
}

.row {
  padding: 0 15px; 
  display: flex;
  flex-wrap: wrap;
}

.item {
  color: rgb(33, 33, 33);
  font-size: 14px;
  border-radius: 3px;
  border: 1px solid rgb(153, 153, 153);
  padding: 0 10px;
  line-height: 30px;
  margin-right: 15px;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; 
}

.url {
  border: 1px solid rgb(237, 0, 0);
  color: rgb(237, 0, 0);
}

/* 暂无搜索记录 */
.tip {
  padding: 0 15px;
  color: rgb(33, 33, 33);
  font-size: 15px;
}
/* 搜索建议 */
.search-suggest {
  height: 100%;
  padding: 15px 10px 15px 10px;
  background-color: #fff;
  div {
    color: #3F3F3F;
  }
  &/deep/ b {
    color: #151515;
  }
}
.search-suggest-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #F4F4F4;
}
.search-suggest-num {
  min-width: 100px;
}
</style>