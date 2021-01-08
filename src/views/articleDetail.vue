<template>
    <div class="wrap articleDetail">
        <div class="main">
            <div class="head">
                <!--// 秘密分享外访页面打包注释,外访的页面打包放在秘密官网域名新建目录之下-->
                <div class="black" @click="backFn()" v-if="!$route.query.app"></div>
                <div class="title apptitle" v-if="parseInt($route.query.app) === 1">{{$t('home.text1')}}</div>
                <div class="title" v-else>{{$t('home.text3')}}</div>
            </div>
            <div class="content" >
                <div class="loading" v-show="loadShow">
                    <img class="load-img" src="~@img/common/loading.gif" alt="">{{$t('home.text2')}}
                </div>
                <h4 class="title">{{detailObj.title}}</h4>
                <div class="update-date">{{$t('home.text4')}} {{$changeDate(detailObj.updateAt,'.',5)}}</div>
                <p class="article articleHtml" id="pdf" ref="articleHtml" @click="pdfRoute($event)" v-show="detailObj.articleType !==3" v-html="detailObj.content">
                </p>
                <div class="article article-video" v-show="detailObj.articleType ===3">
                    <video width="100%" ref="video" controls="controls" :src="detailObj.content">
                        <!--<source :src="detailObj.content" type="video/mp4">-->
                        <!--<source src="http://image.lyquanhao.com/QINIUSecretdb8545f3a10c4f3b4c8c0074941c9404.mp4" type="video/mp4">-->
                    </video>
                    <div class="mask" @click="playFn"></div>
                </div>
            </div>
            <!--内嵌富文本的pdf链接模板-->
            <!--<p class="ql-align-center">
                <span class="hljs-attr">pdf地址</span>
                <span class="ql-font-serif">pdf文件名</span>   
            </p>-->
        </div>
        <v-share></v-share>
    </div>
</template>

<script>
  //import Dialog from '@/components/dialog/dialog'
  import share from '@/components/share'
  export default {
    data() {
      return {
        loadShow: true,
        videoShow: false,
        playShow: true,
        viderUrl: '',
        detailObj: {},
        detailId: this.$route.query.detailId,
        index: this.$store.state.detailObj.index,
      }
    },
    created() {},
    mounted() {
      this.getDetail()
      this.defaultOpen()
      //let noChildNodes = document.querySelectorAll('.ql-align-center')
      let articleHtml = document.querySelectorAll('.articleHtml .ql-align-center')
      for (let i in articleHtml) {
        if (articleHtml[i].innerText && !articleHtml[i].firstElementChild) {
          articleHtml[i].style.color = '#000' 
        }
      }
    },
    methods: {
      defaultOpen() {
        if (this.detailObj.articleType === 3) { // 文章是视频类型,播放
          this.playFn()
        }
        /*let arr = document.querySelectorAll('.video') // 嵌套富文本中的视频
        if (arr.length) {
          for (let i in arr) {
            if (this.playShow) {
              arr[i].addEventListener('click',() => {
                arr[i].play()
              })
              this.playShow = false
            } else {
              arr[i].addEventListener('click',() => {
                arr[i].pause()
              })
              this.playShow = true
            }
          } 
        }*/
      },
      playFn () {
        if (this.playShow) {
          this.$refs.video.play()
          this.playShow = false
        } else {
          this.$refs.video.pause()
          this.playShow = true
        }
      },
      pdfRoute (event) {  // dom找pdf元素,获取并打开pdf
        let _this =this
        let more = this.$route.query.more
        let pdfBox = document.getElementById('pdf')
        let children = pdfBox.children
        let state = false
        for (let i in children) {
          if (children[i].className === 'ql-align-center') {
           let pdfs = children[i].children
            for (let j in pdfs) {
              if (pdfs[j].className === 'hljs-attr') { // 获取富文本模板下,子元素的pdf路径
                let pdfurl = pdfs[j]
                if (pdfurl.innerText.substring(pdfurl.innerText.lastIndexOf('.')+1) === 'pdf') {
                  if (event.target.className === 'hljs-attr') {
                    state = true
                    if (state) {
                      event.target.nextElementSibling.style.color = '#000'
                      _this.$router.push({
                         path: '/pdf',
                         query: {
                           pdfUrl: pdfurl.innerText, // pdf路径
                           detailMore: more || '',
                           detailId: this.detailId //详情id
                         },
                      })
                    }
                  }
                }
              }
            }
          }
        }
      },
      //app不兼容
      /*pdfFn (event) {
        let more = this.$route.query.more
        if (event.target.getAttribute('class') === 'hljs-attr') {
            event.target.nextElementSibling.style.color = '#000'
          this.$router.push({
            path: '/pdf',
            query: {
              pdfUrl:  event.target.parentElement.children[0].innerHTML, // pdf路径
              detailMore: more || ''
            },
          })
        }
      },*/
      getDetail () {  // 详情api
        this.$fetch.post(`/officialarticle/queryOfficalArticleDetail?articlId=${this.detailId}`).then(res => {
          if (res.success) {
            this.detailObj = res.data.officialArticle
            this.viderUrl = res.data.officialArticle.content
            this.loadShow = false
          }
        })
      },
      backFn () { 
        this.$refs.video.pause()
        this.playShow = true
        let moreArticles = this.$route.query.moreArticles // 二级页面跳转
        let detailMore = this.$route.query.detailMore  // pdf-->详情--> 二级页面
        if (parseInt(moreArticles) === 1 || parseInt(detailMore) === 1) {
          this.$router.push({
            path: '/moreArticles',
          })
        } else {
          this.$router.push({
            path: '/home',
            query: {
              detailIndex: this.index
            }
          }) 
        }
      }
    },
    components: {
      vShare: share
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .iosx &{
        .head{
            padding-top: 54px;   
        }
    }
    .min-iosx{
        .head{
          padding-top: 40px;   
        }
    }
    .articleDetail{
        width: 100vw ;
        min-height: calc(100vh - 44px);
        background-color: #fff;
        .iosx &{
            min-height: calc(100vh - 88px);
        }
        .main{
            width: 100%;
            background-color: #fff;
            .head{
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
                .apptitle{
                    margin-left: 50px;
                    padding-left: 20px;
                }
            }
            .content{
                width: 100%;
                padding: 0 20px;
                margin-top: 44px;
                padding-bottom: 10px;
                .iosx &{
                    margin-top: 88px;
                }
                .min-iosx & {
                    margin-top: 85px;
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
                .title{
                    font-size: 18px;
                    line-height: 1.5;
                    color: #000;
                    padding-top: 16px;
                    text-align: left;
                    word-wrap:break-word;
                }
                .update-date{
                    font-size: 14px;
                    color: #ababab;
                    padding: 10px 0 10px 0;
                }
                .article-video{
                    width: 100%;
                    position: relative;
                    .mask{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 900;
                    }
                    .play{
                        display: block;
                        width: 50px;
                        height: 50px;
                        background-color: #fff;
                        border-radius: 50%;
                        position: absolute;
                        left: 50%;
                        top: 36%;
                        z-index: 100;
                        transform: translate(-50%,-50%);
                    }
                    video{
                        margin: 0 auto !important;
                    }
                    //播放按钮
                    video::-webkit-media-controls-play-button {
                        display: none;
                    }
                    //播放按钮
                    video::-media-controls-play-button {
                        display: none;
                    }
                    //播放按钮
                    video::controls-play-button {
                        display: none;
                    }
                }
                .img{
                    width: 100%;
                    height: auto;
                    background-color: #fff;
                    padding-bottom: 10px;
                    img{
                        display: block;
                        width: 100%;
                    }
                }
            }
        }
    }

</style>