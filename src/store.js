import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accountList: {},
    userInfo: {},
    mStatus: {}, // 商户状态
    mCount: 0, // 待确认的赏金单条数
    loading: false,
    errorMsg: '',
    lang: 'CN',
    piBalance: '',
    cartStatus: true,
    merchantUserAddress:'',
    type: 0,
    status:4,
    typeShop:0,
    balance: '', //
    currency: '', // 币种
    totalExistence: 0,
    detailObj: {}, // 文章详情item
    detailData: {},
    listObj: {},
    articleListMore: [],
    votePageState: { // 记录选项卡的位置
      head: 0,
      foot: 0
    },
    device : Number
  },
  getters: {
    accountList: state => state.accountList,
    userInfo: state => state.userInfo,
    piBalance: state => state.piBalance,
    balance: state => state.balance,
    type: state => state.type,
    status: state => state.status,
    typeShop: state => state.typeShop,
    currency: state => state.currency
  },
  mutations: {
    ACCOUNT (state, data) {
      state.accountList = data
      state.currency = data.currency
      state.balance = data.balance
    },
    TYPE (state, data) {
      state.type = data
    },
    TYPESHOP (state, data) {
      state.typeShop = data
    },
    STATUS (state, data) {
      state.status = data
    },
    USER_INFO (state, data) {
      state.userInfo = data
    },
    SET_STATUS (state, data) {
      state.mStatus = data
    },
    SET_mapData (state, data) {
      state.mCount = data
    },
    SET_LOADING (state, data) {
      state.loading = data
    },
    CART_TOTAL_NUM (state, data) {
      state.cartStatus = data
    },
    SET_ADDRESS(state,data) {
      state.merchantUserAddress = data
    },
    SET_ERROR (state, data) {
      state.errorMsg = data
    },
    SET_LANG (state, data) {
      state.lang = data
    },
    SET_TAB_RECORD (state, data) {
      state.votePageState = data
    },
    SET_TOTAL_NUM (state, data) {
      state.totalExistence = data
    },
    SET_MENUNAV (state, data) {
        state.menuNav = data
    },
    SET_ARTICLELIST_MORE (state, data) {
      state.articleListMore = data
    },
    SET_DETAIL (state,data) {
      state.detailObj = data
    },
    SET_LIST (state,data) {
      state.listObj = data
    },
    SET_DETAILDATA (state,data) {
      state.detailData = data
    },
    // 分享
    SET_DEVICE (state, data) {
      state.device = data
    }
  },
  actions: {
    getAccountList ({commit}) {
      api.post('/user/balance').then(res => {
        if (res.success) {
          commit('USER_INFO', res.data.user)
          commit('ACCOUNT', res.data.accountList[0])
        }
      })
    }
  }
})
