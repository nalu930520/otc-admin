import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Bg from 'bignumber.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import store from './store/index.ts'
import '@/icons' // icon
// import '@/permission.ts' // permission control
// import '../mock' // simulation data

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

const VUE = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

Vue.filter('formatBitsAmount', function (value) {
  if (value === 0) return 0
  if (!value) return ''
  return new Bg(value / 100).toFormat(2, 1)
})

Vue.filter('formatUSDAmount', function (value) {
  if (value === 0) return 0
  if (!value) return ''
  return new Bg(value / 100000000).toFormat(2, 1)
})
Vue.filter('formatUSDAmountFee', function (value) {
  if (value === 0) return 0
  if (!value) return ''
  return new Bg(value / 100000000).toFormat(8, 1)
})

Vue.filter('filterCrypto', function (value) {
  switch (value) {
    case 'usdt':
      return 'Tether'
    default:
      return value.toUpperCase()
  }
})
Vue.filter('filterAmount', function (value) {
  if (value === 0) return 0
  if (!value) return ''
  return new Bg(value).toFormat(2, 1)
})

Vue.filter('transactionType', function (value) {
  switch (value) {
    case 3:
      return '支付'
    case 4:
      return '系统退款'
    case 5:
      return 'offchain转账'
    case 6:
      return 'onchain转出'
    case 7:
      return 'onchain充值'
    case 9:
      return '平台转账'
    case 11:
      return '币种兑换'
    case 12:
      return '兑换撤销'
    case 13:
      return 'WC支付'
    case 14:
      return '卡月费'
    case 15:
      return 'twitter发送'
    case 16:
      return 'twitter退款'
    case 17:
      return 'payment withdraw'
    case 18:
      return 'wavecrest deposit'
    case 19:
      return 'otc send'
    case 20:
      return 'otc refund'
    default:
      return ''
  }
})

Vue.filter('transactionStatus', function (value) {
  switch (value) {
    case 1:
      return '待付款'
    case 2:
      return '已付款'
    case 3:
      return '处理中'
    case 4:
      return '已完成'
    case 5:
      return '已取消'
    case 6:
      return '账号不存在'
    case 7:
      return '无效'
    case 8:
      return '未确认'
    case 9:
      return '确认中'
    case 10:
      return '拒绝'
    case 11:
      return '延迟'
    default:
      return ''
  }
})
