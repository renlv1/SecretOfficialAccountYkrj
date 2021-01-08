import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill' // 兼容ie
import router from './router'
import store from './store'
import Cube from 'cube-ui'
import fetch from './api/api'
import fastClick from 'fastclick'
fastClick.attach(document.body) // 使用fastClick.自带的方法绑定body的内容

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.prototype.$toastD = function (text) {
  this.toast = this.$createToast({
    txt: text,
    time: 2000,
    type: 'txt'
  })
  this.toast.show()
}

import { i18n } from './i18n/config'
import enUSMessages from '@/assets/js/en-US' // cube-ui 内置

import axios from 'axios'


import appHeader from '@/components/appHeader'



const Locale = Cube.Locale
Vue.use(Cube)
if (localStorage.getItem('lang') === 'EN') {
    Locale.use('en-US', enUSMessages)
}
axios.defaults.withCredentials = true // 存cookie
Vue.prototype.$http = axios
Vue.prototype.$fetch = fetch
Vue.prototype.$api = process.env.VUE_APP_BASE_PATH // 接口地址

// 在package.json增加了两条命令：
// npm run serve-diff   本地开发使用正式环境的配置；
// npm run build-diff  打包使用测试环境的配置；

// 原先的 npm run serve 默认使用测试环境配置；
// 原先的 npm run build 默认使用正式环境配置；

// 测试环境和正式环境的相关配置分别放在了根目录 .env.development ， .env.production 文件中；

// 以后更改配置请使用相关命令，不要再手动改了。
Vue.config.productionTip = false

Vue.component('app-header', appHeader)

// 时间戳转换
Vue.prototype.$changeDate = function (time, str = '/', type = 1) {
    function ifTime(value) { // 判断时间是否是个位数
        if (value < 10) {
            return '0' + value
        }
        return value
    }

    if (time) {
        let newTime = new Date(time)
        let day = newTime.getDate()
        let month = newTime.getMonth() + 1
        let year = newTime.getFullYear()
        let hours = newTime.getHours()
        let min = newTime.getMinutes()
        let sec = newTime.getSeconds()
        switch (type) {
            case 1:
                return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
            case 2:
                return year + str + ifTime(month) + str + ifTime(day) + ' 00:00:00'
            case 3:
                return year + str + ifTime(month) + str + ifTime(day) + ' 23:59:59'
            case 4:
                return year + str + ifTime(month) + str + ifTime(day)
            case 5:
                return year + str + ifTime(month) + str + ifTime(day)
            case 6:
                return ifTime(hours) + ':' + ifTime(min)
            case 7:
                return ifTime(hours) + '.' + ifTime(min) + '.' + ifTime(sec)
        }
    }
}
Vue.prototype.toastD = function (text) {
    this.toast = this.$createToast({
        txt: text,
        time: 2000,
        type: 'txt'
    })
    this.toast.show()
}
/*new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')*/
router.afterEach(() => {
  document.body.scrollTop = 0
})
sc.init(data => {
  axios.defaults.headers = {
    'session-id': data.sessionId,
    'official-open-id': data.openId
  }
  new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
