<template>
    <div class="wrap">
        <div class="head">
            <div class="box">
                <!--// 秘密分享外访页面打包注释-->
                <div class="black" @click="backFn()" v-if="!$route.query.app"></div>
                <div class="title apptitle" v-if="parseInt($route.query.app) === 1">{{$t('home.text1')}}</div>
                <div class="progress" ref="progress" :class="{'active': loadedRatio}"></div>
            </div>
        </div>
        <div class="wrap-progress" :class="{'active': loadedRatio === 100}" style="height: 160px;">
            <circle-progressbar
                    :id="1"
                    barColor="#2176ff"
                    backgroundColor="rgba(0,0,0,0.4)"
                    :width="100"
                    :radius="10"
                    :progress="progress"
                    :isAnimation="false">
            </circle-progressbar>
        </div>
        <div class="loading" v-show="loadShow">
            <img class="load-img" src="~@img/common/loading.gif" alt="">{{$t('home.text2')}}
        </div>
        <!--:page-loaded="loadShow = false"-->
        <div class="pdf-box">
            <v-pdf
                ref="pdf"
                class="pdf-canvas"
                v-for="i in numPages"
                @page-loaded="loadShow = false"
                @num-pages="pageCount=$event"
                :key="i"
                :page="i"
                :src="pdfUrl" style="width: 100%; height: auto;">
            </v-pdf>
        </div>
        <div class="page-box">
            <button class="prePage zoom" :disabled="isDisable" :class="{'select':idx===0}" @click="scaleD">
                <i></i>
                <i></i>
            </button>
            <button v-show="minShow" class="nextPage zoom" :disabled="isDisable" :class="{'select':idx===1}"  @click="scaleX">
                <p class="small-p"></p>
            </button>
        </div>
        <v-share></v-share>
    </div>
</template>

<script>
  import pdf from 'vue-pdf'
  import share from '@/components/share'
  import circleProgressbar from 'vue-circleprogressbar';
  //import Dialog from '@/components/dialog/dialog'
  export default {
    name: "pdf",
    data() {
      return {
        scale: 100,
        idx: -1,
        isDisable: false,
        detailId: this.$route.query.detailId,
        minShow: false,
        detailObj: this.$store.state.detailObj,
        //url: 'https://daishengloda.github.io/review/dist/static/pdf/p1.pdf',
        url: this.$route.query.pdfUrl,
        loadShow: true,
        pageCount:0,
        loadedRatio:0, // 加载进度pdf每页[canvas]部分加载完为1
        pageNum: 1,
        pdfUrl:'',
        numPages:0,
        currentPage: 0,
        pageTotalNum: 1,
        progress: 0,
      };
    },
    components:{
      vPdf: pdf,
      vShare: share,
      circleProgressbar
    },
    created() {
      this.pdfUrl = pdf.createLoadingTask(this.url); // 获取pdf路径
      this.loadPdfHandler();
      this.pdfUrl.onProgress = e => { // 进度
        let floatNum = e.loaded / e.total
        let num = parseInt(floatNum.toFixed(2) * 100)
        this.loadedRatio = num
        //圆环进度
        this.progress = 0;
        var that = this;
        that.progress = parseInt(that.progress) + this.loadedRatio;
        if (that.progress === 100) {
          if (String(that.progress) === "100") {
            that.dialogComputedVisible = false;
          }
        }
      }
    },
    watch: {
      loadedRatio: 'changeData'
    },
    updated () {},
    mounted() {
      /*Dialog({
        content: 'pdf地址--:'+this.url+'类型--:'+this.$route.query.articleType,
        type: 'alert',
      })*/
    },
    methods: {
      changeData () { // 加载进度条
        let pdf = this.$refs.progress
        pdf.style.width = this.loadedRatio + '%'
        let h = pdf.style.width
        if (String(h) === '100%') {
          setTimeout(() => {
            pdf.style.display = 'none'
          },400)
        }
      },
      loadPdfHandler () {  // pdf总页数
        this.pdfUrl.promise.then(res => {
          this.numPages = res.numPages;
        }).catch(err => {})
      },
      // 返回
      backFn() {
        this.pdfUrl = ''
        this.url = ''
        let moreArticles = this.$route.query.moreArticles // 二级页面
        //let detailMore = this.$route.query.detailMore // -->详情-->二级页面
        let articleType = this.$route.query.articleType // home
        if (this.detailId) { // 详情ID,返回详情
          this.$router.push({
            path: '/articleDetail',
            query: {
              detailMore: 1,
              detailId: this.detailId
            }
          })
        }else if (parseInt(moreArticles) === 1) {  //二级页面,返回二级页面
          this.$router.push({
            path: '/moreArticles'
          })
        } else  if (parseInt(articleType) === 2) {  // home推送文章类型是pdf,返回home
          this.$router.push({
            path: '/home',
            query: {
              detailIndex: this.$store.state.detailObj.index  // home文章列表index
            }
          })
        } else {
          this.$router.push({
            path: '/articleDetail',
            query: {
              detailId: this.detailId
            }
          })
        }
      },
      //放大
      scaleD() {
            this.idx=0
            this.minShow = true
            this.scale += 30;
            let wrapper = document.querySelector('.pdf-box');
            wrapper.style.width = parseInt(this.scale) + "%";
            this.isDisable = true
            setTimeout(()=>{
              this.isDisable=false
            },800)
        },
      //缩小
      scaleX() {
        this.idx = this.scale <= 100 ? this.idx= -1 : this.idx = 1
        if(this.scale <= 100) {
          this.minShow = false
          this.idx = -1
          return
        }
        this.scale += -30;
        let wrapper = document.querySelector('.pdf-box');
        wrapper.style.width = parseInt(this.scale) + "%";
        this.isDisable = true
        setTimeout(()=>{
          this.isDisable=false 
        },800)
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .wrap{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        bottom: 0;
        z-index: 2;
        background-color: rgba(0,0,0,.5);
        overflow: auto;
        touch-action: auto;
        .iosx & {
            top: 54px;
        }
        .min-iosx{
            top: 40px;
        }
        .head{
            height: 50px;
            line-height: 50px;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            bottom: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            //padding-right: 20px;
            background-color: #fff;
            border-bottom: 1px solid #f5f5f5;
            .box{
                width: 100%;
                height: 100%;
                position: relative;
                .progress{
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    width: 0;
                    height: 3px;
                    background-color: #2176ff;
                }
                .title{
                    height: 100%;
                    text-align: center;
                    font-size: 17px;
                    color: #000;
                }
            }
            .iosx & {
                margin-top: 54px;
            }
            .min-iosx & {
                padding-top: 40px;
                height: 85px;
            }
            .black{
                width: 50px;
                height: 100%;
                position: absolute;
                padding-left: 20px;
                left: 0;
                top: 0;
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
            .page-num{
                margin: 0 auto;
                color: #000;
                font-size: 12px;
                text-align: center;
            }
        }
        /deep/.cube-scroll-wrapper{
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: auto !important;
            .cube-scroll-content{
                position: absolute;
                top: 0;
                left: 0;
                .cube-scroll-list-wrapper{
                    overflow: visible !important;
                }
            }
        }
        .wrap-progress{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            z-index: 900;
            background-color: #fff;
            border-radius: 50%;
            &.active{
                display: none;
            }
            /deep/.center_text{
                display: none !important;
            }
        }
        .loading{
            margin: 0 auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 999;
            color: rgba(0,0,0,.6);
            font-size: 14px;
            img{
                display: block;
                width: 30px;
                height: 30px;
                margin: 0 auto 4px;
            }
        }
        .pdf-canvas{
            position: static !important;
            top: 50px;
            left: 0;
            right: 0;
            z-index: 2;
            .iosx & {
                // margin-top: 44px;
            }
        }
        .pdf-box{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 50px;
        }
        /deep/.share{
            bottom: 180px !important; 
        }
        .page-box{
            width: 50px;
            height: 80px;
            position: fixed;
            right: 6px;
            bottom: 90px;
            z-index: 900;
            font-size: 14px;
            border: none 0;
            .zoom{
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #ffffff;
                position: relative;
                box-shadow: 0 0 3px 3px rgba(0,0,0, .024);
                &.select{
                    &:after,&:before{
                       background-color: rgba(33, 122, 255, .8) !important;
                    }
                    i{
                        background-color: rgba(33, 122, 255, .8) !important;
                    }
                }
            }
            .prePage{
                &:after{
                    display: block;
                    content: '';
                    width: 50%;
                    height: 4px;
                    background-color: rgba(0,0,0,.4);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
                i{
                    &:nth-child(1){
                        display: block;
                        width: 4px;
                        height: calc(25% - 2px);
                        background-color: rgba(0,0,0,.4);
                        position: absolute;
                        top: 25%;
                        left: 50%;
                        transform: translateX(-50%);   
                    }
                    &:nth-child(2){
                        display: block;
                        width: 4px;
                        height: calc(25% - 2px);
                        background-color: rgba(0,0,0,.4);
                        position: absolute;
                        bottom: 25%;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
            }
            .nextPage{
                margin-top: 10px;
                &:after{
                    display: block;
                    content: '';
                    width: 50%;
                    height: 4px;
                    background-color: rgba(0,0,0,.4);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }
        }
    }
</style>