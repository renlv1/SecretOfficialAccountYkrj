<template>
    <div class="wrap home" ref="wrap">
        <div class="main">
            <div class="head">{{$t('home.text1')}}</div>
            <div class="content-box">
                <!--文章列表-->
                <!--<cube-scroll></cube-scroll>-->
                <div class="content-list" id="getheight" ref="getheight">
                    <div class="item-li moreItem-li" v-show="item" v-for="(item,index) in newArr" :key="index">
                        <!-- 多条文章,数组中的item里,有多条文章 -->
                        <!--<div>开发............</div>-->
                        <div v-if="item.length > 1" v-for="(itemA,indexA) in item" :key="indexA+'A'">
                            <!--.poster 第一条文章,显示大背景图-->
                            <div class="poster" v-if="indexA === 0" @click="detailsFn(itemA,index)">
                                <div class="con" :class="{'active': itemA.articleType === 3}" :style="{backgroundImage: 'url(' + itemA.coverImage + ')'}"></div>
                                <div class="heading">{{itemA.title}}</div>
                            </div>
                            <!--.article-li 从第二条,显示小背景图-->
                            <div class="article-li" v-if="indexA >= 1" @click="detailsFn(itemA,index)">
                                <div class="title">{{itemA.title}}</div>
                                <div class="img" :class="{'active': itemA.articleType === 3}" :style="{backgroundImage: 'url(' + itemA.coverImage + ')'}"></div>
                            </div>
                        </div>
                         <!--单条文章, articleType// 文章类型 1 图文 2 pdf 3 视频-->
                        <div v-if="!item.length">
                            <div class="poster" @click="detailsFn(item,index)">
                                <div class="con" :class="{'active': item.articleType === 3}" :style="{backgroundImage: 'url(' + item.coverImage + ')'}"></div>
                            </div>
                            <div class="article-li" @click="detailsFn(item,index)">
                                <div class="title">{{item.title}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="menu" :class="{'active': activeShow}" @click.self="maskFn($event)">
                    <div class="loading" v-show="loadShow">
                        <img class="load-img" src="~@img/common/loading.gif" alt="">{{$t('home.text2')}}
                    </div>
                    <div class="tab-menu" @click="drawNav(index3)" v-for="(itemA,index3) in menuList" :key="index3">
                        <i class="icon" v-show="itemA.childOfficialMenuList.length > 0"></i>
                        <span v-if="lang === 'CN'">{{itemA.menuName}}</span>
                        <span v-else>{{itemA.menuEnglishName}}</span>
                        <div class="draw-box" v-show="activeIndex === index3 && activeShow">
                            <div class="draw-item" @click.stop="articleItem(indexIn,itemB)" v-for="(itemB,indexIn) in menus" :key="indexIn">
                                <div class="textp" v-if="lang === 'CN'">{{itemB.menuName}}</div>
                                <div class="textp" v-else>{{itemB.menuEnglishName}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  //import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        lang: localStorage.getItem('lang'),
        loadShow: true, // 加载
        menuList: [],
        activeIndex: -1,
        activeShow: false, // 二级菜单隐藏
        menus: [], // 二级菜单
        newArr: []
      }
    },
    created() {
        this.getMenu()
        if (this.menuList.length > 0) {
            this.loadShow = false
        }
    },
    watch: {
      newArr() {
        this.$nextTick(() => {
          if (this.newArr.length > 2) { // 文章列表大于2条滚动回底部
            this.toBottom() 
          }
        })
      }
    },
    activated () {
      this.toBottom()
    },
    mounted() {
        let delIndex  = this.$route.query.detailIndex // 从其他页面返回主页回底部
        if (delIndex) {
            this.toBottom()
        }
    },
    methods: {
        maskFn (e) {
            if (e.target) {  //点击空白隐藏二级菜单
                this.activeShow = !this.activeShow
                this.activeIndex = -1
            }
        },
      getMenu () {  // 获取一级主菜单
        this.loadShow = true;
        this.$fetch.post(`/officialarticle/queryOfficalMenuList`).then(res => {
          if (res.success) {
            let menuList = res.data.officialMenuList
            this.menuList = menuList
            // 默认展示id=13的文章
            this.$fetch.post(`/officialarticle/queryOfficalArticleList?menuId=13`).then(res => {
              if (res.success) {
                let articleList = res.data.officialArticleList
                if (articleList.length > 0 && articleList !== null && articleList !== undefined) {
                  if (articleList.length > 1) { // 多条内容
                    let arr = []
                    arr.push(...articleList)
                    this.newArr.push(arr)
                  } else {  // 一条内容
                    this.newArr.push(...articleList)
                  }
                }
                setTimeout(() => {
                  this.loadShow = false
                },500)
              }
            })
          }
        })
      },
      toBottom() { //回到页面底部
            let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.querySelector('.content-box').scrollHeight;
            let rollheight = scrollHeight - clientHeight; //超出盒子上界的值就是底部的scrolTop的值
            //document.documentElement.scrollTop += 280;
            document.querySelector('.content-box').scrollTop += rollheight;
            if (document.querySelector('.content-box').scrollTop + 1 <= rollheight) {//之所以+1，可以打印这两个值的日志就知道了，下面+1也是同理
                var c = setTimeout(() => this.toBottom(), 10);//调用setTimeout是为了“回到底部”这过程不是一瞬间
            } else {
                clearTimeout(c);
            }
        },
      drawNav (index) { // 菜单
        this.activeIndex = index
        this.activeShow = !this.activeShow
        for (let i in this.menuList){
          if (this.menuList[i].parentMenuId === 0) {
            this.menus = this.menuList[index].childOfficialMenuList  // 二级菜单
          }
          if (this.menuList[index].childOfficialMenuList.length <=0) { // 没有二级菜单,获取文章推送
            this.activeShow = false
            if (parseInt(index) === parseInt(i)) {
              this.articleItem(-1,this.menuList[i]) 
            }
          }
        }
      },
      articleItem (index,item) { // 获取文章,根据type判断文章推送或二级页面
        index = -1
        if (item) {
          this.activeShow = false
          if (item.id) {
                if (item.type !== 2) { // 文章推送
                    this.$fetch.post(`/officialarticle/queryOfficalArticleList?menuId=${item.id}`).then(res => {
                      if (res.success) {
                          let articleList = res.data.officialArticleList
                          if (articleList.length > 0 && articleList !== null && articleList !== undefined) {
                            this.loadShow = true;
                            if (articleList.length > 1) { // 多条内容
                              let arr = []
                              arr.push(...articleList)
                              this.newArr.push(arr)
                            } else {  // 一条内容
                              this.newArr.push(...articleList)
                            }
                            setTimeout(() => {
                              this.loadShow = false
                            },600)
                          }
                      }
                    })
                }
            }
            if (item.type === 2) { // 二级页面文章列表
              this.$router.push({
                path: '/moreArticles',
              })
              let obj = {
                itemObj: item,
                index: index
              }
              this.$store.commit('SET_LIST', obj) //二级页面的参数
            }
          }
          this.toBottom()
        },
      detailsFn (item,index) { // 点击文章跳详情或pdf
        let obj = {
          itemObj: item,
          index: index
        }
        this.$store.commit('SET_DETAIL', obj) // 存储详情item
        if (item.articleType === 2) { // 直接打开pdf页面
          if (item.content.substring(item.content.lastIndexOf('.')+1) === 'pdf') {
            this.$router.push({
              path: '/pdf',
              query: {
                pdfUrl: item.content,
                index: index,
                articleType: 2
              },
            }).catch(()=>{})
          }
          /*Dialog({
            content: 'pdf类型--:'+item.articleType,
            type: 'alert',
            okFn: () =>{
            }
          })*/
        } else {  // 去详情
          this.$router.push({
            path: '/articleDetail',
            query: {
              detailId: item.id,
              index: index
            }
          })
        }
      },
      },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .min-iosx{
        .head{
            padding-top: 40px;
        }
        .main{
            .content-box{
                padding: 94px 0 100px !important;
            }
        }
    }
    .iosx{
        .head{
            padding-top: 54px;
        }
        .menu{
            padding: 10px 0 40px 0 !important;
            .loading{
                bottom: 100px !important;
            }
        }
        .main{
            .content-box{
                padding: 110px 0 100px !important;
            }   
        }
    }
    .ios{}
    .home{
        width: 100vw;
        height: 100vh;
        background-color: #f5f5f5;
        .main{
            width: 100%;
            height: 100%;
            .head{
                width: 100%;
                line-height: 44px;
                background-color: #fff;
                text-align: center;
                font-size: 17px;
                color: #000;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 999;
            }
            /deep/ .cube-scroll-wrapper{
                height: 100%;
                .cube-scroll-list-wrapper{
                    min-height: 100%;
                    height: 100%;
                }
            }
            .content-box{
                position: absolute;
                width: 100%;
                height: 100vh;
                padding: 64px 0 86px;
                top: 0;
                left: 0;
                right: 0;
                z-index: 2;
                overflow: auto;
            }
            .content-list{
                width: 100%;
                padding: 0 20px;
                padding-bottom: 66px;
                background-color: #f5f5f5;
                .iosx & {
                    padding-bottom: 100px;
                }
                .item-li{
                    width: 100%;
                    background-color: #fff;
                    margin-bottom: 25px;
                    box-shadow: 0 0 3px 3px rgba(0,0,0, .02);
                    border-radius: 4px;
                    &:last-child{
                        margin-bottom: 0;
                    }
                    .poster{
                        width: 100%;
                        height: 190px;
                        font-size: 14px;
                        color: #fff;
                        display: flex;
                        align-items: flex-end;
                        justify-content: flex-start;
                        line-height: 1.5;
                        box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.03);
                        border-top-left-radius: 4px;
                        border-top-right-radius: 4px;
                        position: relative;
                        .con{
                            width: 100%;
                            height: 100%;
                            background-position: center;
                            background-repeat: no-repeat;
                            background-size: cover;
                            border-top-left-radius: 4px;
                            border-top-right-radius: 4px;
                            &.active{
                                width: 100%;
                                height: 100%;
                                position: relative;
                                &:before{
                                    display: block;
                                    content: '';
                                    width: 40px;
                                    height: 40px;
                                    background: url("../assets/img/common/play.svg") no-repeat center;
                                    background-size: cover;
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
                                    z-index: 1;
                                }
                            }
                            .img{
                                display: block;
                                width: 100%;
                                height: 100%;
                            }
                        }
                        &:after{
                            content: '';
                            display: block;
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 2;
                            background: linear-gradient(rgba(0,0,0,.5),rgba(255,255,255,0));
                            background-color: rgba(0,0,0,.1);
                            border-top-left-radius: 4px;
                            border-top-right-radius: 4px;
                        }
                        .bg-img{
                            display: block;
                            position: absolute;
                            background-size: cover;
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                            right: 0;
                            z-index: 1;
                            border-top-left-radius: 4px;
                            border-top-right-radius: 4px;
                        }
                        .heading{
                            display: block;
                            width: 100%;
                            position: absolute;
                            z-index: 4;
                            bottom: 20px;
                            padding: 0 15px;
                            left: 0;
                            font-size: 16px;
                            line-height: 1.5;
                            overflow : hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            word-wrap: break-word;
                        }
                    }
                    .article-li{
                        width: 100%;
                        height: 64px;
                        padding: 0 15px;
                        background-color: #fff;
                        border-bottom: 1px solid #f5f5f5;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        border-bottom-left-radius: 4px;
                        border-bottom-right-radius: 4px;
                        .title{
                            flex: 1;
                            font-size: 16px;
                            color: #000;
                            line-height: 1.5;
                            padding-right: 33px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            word-wrap: break-word;
                        }
                        .img{
                            width: 64px;
                            height: 44px;
                            background-color: #f5f5f5;
                            background-size: cover;
                            &.active{
                                width: 64px;
                                height: 44px;
                                position: relative;
                                &:before{
                                    display: block;
                                    content: '';
                                    width: 26px;
                                    height: 26px;
                                    background: url("../assets/img/common/play.svg") no-repeat center;
                                    background-size: cover;
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
                                    z-index: 1;
                                }
                            }
                            img{
                                display: block;
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
            .footer{
                width: 100vw;
                background-color: #fff;
                position: fixed;
                bottom: 0;
                right: 0;
                left: 0;
                z-index: 999;
                .menu{
                    width: 100%;
                    line-height: 34px;
                    padding: 6px 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 900;
                    &.active{
                        position: relative;
                        &:after{
                            display: block;
                            content: '';
                            width: 100%;
                            height: 100vh;
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background-color: rgba(0,0,0,.0);
                            z-index: -1;
                            .iosx &{
                                bottom: 84px;
                            }
                            .min-iosx & {
                                bottom: 66px;
                            }
                        }
                    }
                    .iosx & {
                        padding: 15px 0 34px 0;
                    }
                    .loading{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: absolute;
                        left: 50%;
                        bottom: 56px;
                        transform: translateX(-50%);
                        z-index: 900;
                        font-size: 14px;
                        color: #b1b1b1;
                        .load-img{
                            display: block;
                            width: 19px;
                            height: 19px;
                            margin-right: 5px;
                        }
                    }
                    .tab-menu{
                        flex: 1;
                        text-align: center;
                        border-right: 1px solid #d9d9d9;
                        font-size: 14px;
                        color: #000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        .icon{
                            display: block;
                            width: 10px;
                            height: 10px;
                            background: url("~@img/footer/menu.svg") no-repeat center;
                            background-size: cover;
                            margin-right: 5px;
                        }
                        span{
                            max-width: calc(100% - 20px);
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                        &:last-child{
                          border-right: none;
                        }
                        .draw-box{
                            width: 100%;
                            min-height: 34px;
                            max-height: 200px;
                            background-color: #fff;
                            position: absolute;
                            bottom: 50px;
                            left: 0;
                            right: 0;
                            z-index: 900;
                            box-shadow: 0 0 3px 3px rgba(0,0,0, .02);
                            .draw-item{
                                width: 100%;
                                min-height: 40px;
                                padding: 0 8px;
                                color: #000;
                                text-align: center;
                                border-bottom: 1px solid #f5f5f5;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                .textp{
                                    width: 100%;
                                    max-height: 100%;
                                    margin: 4px auto;
                                    line-height: 1.5;
                                    white-space: pre-wrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    text-align: center;
                                }
                            }
                        }
                        .submenu-box{
                            width: 100%;
                            min-height: 170px;
                            max-height: 204px;
                            background-color: #fff;
                            position: absolute;
                            right: -100%;
                            bottom: 54px;
                            z-index: 900;
                            box-shadow: 0 0 3px 3px rgba(0,0,0, .04);
                            .draw-item{
                                color: #000;
                                text-align: center;
                                border-bottom: 1px solid #f5f5f5;
                            }
                        }
                    }
                }
            }
        }
    }
</style>