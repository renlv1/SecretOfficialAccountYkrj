import axios from 'axios'
import qs from 'qs'
let lan = 'CN' // 默认为中文
let language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language
// // 获取浏览器配置语言 #括号内是个运算，运算过后赋值给lang，当?前的内容为true时把?后的值赋给lang，为False时把:后的值赋给lang
let langSub = language.substr(0, 2) // 获取lang字符串的前两位
if (window.localStorage.getItem('lang') === null) {
  if (langSub === 'zh') {
    localStorage.setItem('lang', 'CN')
    lan = 'CN'
  } else {
    localStorage.setItem('lang', 'EN')
    lan = 'EN'
  }
}
let ax = axios.create({
  // timeout: 30000, // 请求超时时间
  withCredentials: true, // 允许cookie
  baseURL: process.env.VUE_APP_BASE_PATH,
  headers:{
    'secret-language': lan.toLowerCase()
  }
})
export default {
  get: (url, params) => {
    return new Promise((resolve, reject) => {
      ax({
        url,
        method: 'get',
        params: params
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post: (url, params) => {
    return new Promise((resolve, reject) => {
      ax({
        method: 'post',
        url,
        data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  postFormdata: (url, params) => {
    return new Promise((resolve, reject) => {
      ax.post(url, params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
