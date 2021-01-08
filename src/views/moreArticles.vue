<template>
    <div class="wrap home" ref="wrap">
        <div class="main">
            <div class="head">
                <div class="black" @click="backFn()"></div>
                <div class="title" v-if="lang === 'EN'">{{objItem.menuEnglishName}}</div>
                <div class="title" v-else>{{objItem.menuName}}</div>
            </div>
            <div class="content-box">
                <div class="null" v-show="nullData"></div>
                <cube-scroll
                        :options="options"
                        ref="cubeList"
                        :data="newArr"
                        @pulling-up="onPullingUp">
                        <!--二级页面,文章列表-->
                        <div class="content-list" id="getheight" ref="getheight">
                            <div class="item-li moreItem-li" :class="{active:index}" v-show="item" v-for="(item,index) in newArr" :key="index">
                                <!--.one 第一条文章,显示大背景图-->
                                <div class="poster one" v-if="index === 0" @click="detailsFn(item,index)">
                                    <div class="con" :class="{'active': item.articleType === 3}" :style="{backgroundImage: 'url(' + item.coverImage + ')'}">
                                    </div>
                                    <div class="heading">{{item.title}}</div>
                                </div>
                                <!--.article-li 从第二条开始,显示小背景图-->
                                <div class="article-li" v-if="index >= 1" @click="detailsFn(item,index)">
                                    <div class="title">{{item.title}}</div>
                                    <div class="img" :class="{'active': item.articleType === 3}" v-show="item.coverImage" :style="{backgroundImage: 'url(' + item.coverImage + ')'}"></div>
                                </div>
                            </div>
                        </div>
                </cube-scroll>
            </div>
            <div class="loading" v-show="loadShow">
                <img class="load-img" src="~@img/common/loading.gif" alt="">{{$t('home.text2')}}
            </div>
            <div class="menu">
            </div>
        </div>
    </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        lang: localStorage.getItem('lang'),
        loadShow: true, 
        newArr: [],
        nullData: false,
        oneArticle: {},
        objItem: this.$store.state.listObj.itemObj,
        index: this.$store.state.listObj.index,
        pageIndex: 1,
        pageSize: 15,
        options: {
          pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
            threshold: 0,
            txt: {
              more: '',
              noMore: this.$t('home.text11')
            }
          }
        }
      }
    },
    created() {
      this.articleItem()
    },
    watch: {
    },
    mounted() {
    },
    methods: {
      onPullingUp () {
        this.articleItem()
      },
      articleItem () { //文章列表
        let item = this.objItem //二级页面的请求参数
        let obj = {}
        obj.pageIndex = this.pageIndex
        obj.pageSize = this.pageSize
        obj.menuId = item.id
        if (item.type === 2) {
          if (item.id) {
            this.$fetch.post(`/officialarticle/queryOfficalArticleList`,obj).then(res => {
              if (res.success) {
                let articleList = res.data.officialArticleList
                this.loadShow = false
                if (articleList.length > 0 && articleList !== null && articleList !== undefined) {
                  if (articleList.length >= 1) { // 多条内容
                    this.newArr = articleList
                    this.pageIndex++
                  }
                } else {
                    if (this.pageIndex === 1 && articleList.length <= 0) {
                        this.nullData = true
                    }
                  this.$refs.cubeList.forceUpdate()
                }
              }
            })
          }
        }
      },
      detailsFn (item,index) { // 文章类型articleType=1,2,3. 判断文章是否删除
        this.$fetch.post(`/officialarticle/queryOfficalArticleDetail?articlId=${item.id}`).then(res => {
          if (res.success) {
            if (item.articleType === 2) { //pdf类型 直接打开pdf页面
              if(item.content.substring(item.content.lastIndexOf('.')+1) === 'pdf') {
                this.$router.push({
                  path: '/pdf',
                  query: {
                    pdfUrl: item.content,
                    moreArticles: 1  // 二级页面跳转
                  }
                })
              }
            } else {  // 去详情,传详情id
              this.$router.push({
                path: '/articleDetail',
                query: {
                  detailId: item.id,
                  moreArticles: 1,  // 二级页面跳转
                  index: index,
                }
              })
            }
          }else {  // 文章已刪除或不存在
            Dialog({
                  title: '',
                  content: res.msg,
                  okFn: ()=> {
                    this.$router.go(0)
                 }
            })
          }
        })
      },
      backFn () {
        this.$router.push({
          path: '/home',
          query: {
            detailIndex: 1
          }
        })
      }
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .min-iosx{
        .head{
            padding-top: 40px;
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
                padding: 89px 0 0 !important;
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
                .iosx &{
                    padding-top: 54px;
                }
                width: 100%;
                line-height: 44px;
                background-color: #fff;
                padding-right: 20px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                border-bottom: 1px solid #f5f5f5;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 9999;
                .black{
                    width: 50px;
                    height: 44px;
                    padding-left: 20px;
                    position: relative;
                    &:after{
                        display: block;
                        content: '';
                        width: 14px;
                        height: 16px;
                        background: url("~@img/common/back.svg") no-repeat center;
                        background-size: contain;
                        position: absolute;
                        left: 20px;
                        top: 50%;
                        z-index: 4;
                        transform: translate(0,-50%);
                    }
                }
                .title{
                    flex: 1;
                    font-size: 17px;
                    text-align: center;
                    margin-right: 50px;
                }
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
                padding: 46px 0 0;
                top: 0;
                left: 0;
                right: 0;
                z-index: 2;
                overflow: auto;
                .null{
                    width: 60px;
                    height: 60px;
                    margin: 50px auto;
                    background: url("../assets/img/common/empty.png") no-repeat center;
                    background-size: contain;
                }
                /deep/.after-trigger{
                    position: absolute;
                    left: 50%;
                    bottom: 10px;
                    transform: translatex(-50%);
                }
                /deep/.before-trigger{
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    transform: translatex(-50%);
                    font-size: 12px;
                    color: #000000;
                }
            }
            .content-list{
                width: 100%;
                padding: 0 20px;
                padding-bottom: 66px;
                background-color: #f5f5f5;
                //box-shadow: 0 0 3px 3px rgba(0,0,0, .02);
                .iosx & {
                    padding-bottom: 100px;
                }
                .item-li{
                    width: 100%;
                    background-color: #fff;
                    //margin-bottom: 25px;
                    border-radius: 4px;
                    &:first-child{
                        margin-top: 20px;
                    }
                    .min-iosx &:first-child{
                        margin-top: 50px;
                    }
                    &:not(:last-child){
                        border-bottom-left-radius: 0;
                        border-bottom-right-radius: 0;
                    }
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
                        &.active-one{
                           border-radius: 4px;
                            &:after{
                                border-radius: 4px;
                            }
                            .con{
                                border-radius: 4px;
                            }
                        }
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
            .loading{
                margin: 0 auto;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                z-index: 100;
                img{
                    display: block;
                    width: 36px;
                    height: 36px;
                    margin: 0 auto 4px;
                }
            }
        }
    }
</style>