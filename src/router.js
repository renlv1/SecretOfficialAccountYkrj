import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
/*eslint-disable*/
export default new Router({
    routes: [
        // 秘密分享外访页面打包注释,外访的页面打包放在秘密官网域名新建目录之下
        {
            path: '/',
            redirect: '/home'
        },
        // 秘密分享外访页面打包注释
        {  
            path: '/home',
            name: 'home',
            component: resolve => require(['./views/home.vue'], resolve),
            meta: {
              keepAlive: true
            }
        },
        {
          path: '/articleDetail',
          name: 'articleDetail',
          component: resolve => require(['./views/articleDetail.vue'],resolve),
        },
        {
          path: '/pdf',
          name: 'pdf',
          component: resolve => require(['./views/pdf.vue'],resolve),
        },
        // 秘密分享外访页面打包注释
        {
          path: '/moreArticles',
          name: 'moreArticles',
          component: resolve => require(['./views/moreArticles.vue'],resolve),
        }
    ]
})
