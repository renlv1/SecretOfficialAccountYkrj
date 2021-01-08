<template>
    <transition name="dialog">
        <div class="share-wrap">
            <!--// 秘密分享外访页面打包注释-->
            <div class="share" @click="share" v-show="shareShow">
                <img src="../assets/img/common/share.png" />
            </div>
            <div class="mask" :class="{'active':!$route.query.app}" v-show="maskShow">
                <div class="content" :class="{'active': parseInt($route.query.app) === 1}" v-if="parseInt($route.query.app) === 1">
                    <div class="download" @click="download">下载Secret</div>
                </div>
                <!--// 秘密分享外访页面打包注释-->
                <div class="content copy" v-else>
                    <div class="copied item-li" @click="onCopy" v-clipboard:copy="message" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('home.text14')}}</div>
                    <div class="cancel item-li" @click="cancel">{{$t('home.text15')}}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
  export default {
    data() {
      return {
        shareShow: true,
        maskShow: false,
        message: ''
      }
    },
    props: {
      articleObj:{
        type: Object,
      },
    },
    created() {
      let href = window.location.href
      let str = ''
      if (href.indexOf("#/") !== -1) {
        str = href.substring(href.indexOf("#/")+2)+'&app=1'
      }
      this.message = 'http://put.secretworth.com/dist/index.html#/' + str
    },
    mounted() {
      let app = this.$route.query.app
      if (parseInt(app) === 1) {
        this.shareShow = false
        this.maskShow = true
      }
    },
    methods: {
      share() {
        this.maskShow = true
        this.shareShow = false
      },
      cancel () {
        this.maskShow = false
        this.shareShow = true
      },
      onCopy () {
        let href = window.location.href
        let str = ''
        if (href.indexOf("#/") !== -1) {
           str = href.substring(href.indexOf("#/")+2)+'&app=1'
        }
        this.message = 'http://put.secretworth.com/dist/index.html#/' + str
        this.maskShow = false
        this.shareShow = true
        this.$toastD(this.$t('home.text12'))
      },
      onError () {
        this.maskShow = false
        this.shareShow = true
        this.$toastD(this.$t('home.text13'))
      },
      download () {
        window.location.href= 'https://www.secret.chat/'
      }
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .dialog-enter,.dialog-leave-to{
        opacity: 0;
        .g-dialog-wrap{
            transform: translate(-50%, -55%)
        }
    }
    .dialog-enter-active{
        transition: .3s;
        .g-dialog-wrap{
            transition: .3s
        }
    }
    .dialog-leave-active{
        transition: .1s;
        .g-dialog-wrap{
            transition: .1s
        }
    }
.share-wrap{
    width: 100%;
    .share{
        width: 36px;
        height: 36px;
        line-height: 30px;
        text-align: center;
        border-radius: 50%;
        background-color: #fff;
        position: fixed;
        right: 20px;
        bottom: 80px;
        z-index: 900;
        box-shadow: 0 0 3px 3px rgba(0,0,0, .028);
        img{
            display: block;
            width: 24px;
            height: 24px;
            margin: 6px auto;
            opacity: .7;
        }
    }
    .mask{
        &.active{
            width: 100%;
            height: 100vh;
            background-color: rgba(0,0,0,.5);
            position: fixed;
            z-index: 9999;
            top: 0;
            left: 0;
            right: 0;
        }
        .content{
            width: auto;
            background-color: #fff;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            &.active{
                background: none;
                padding-bottom: 80px;
            }
            .iosx &{
                padding-bottom: 40px;
                &.active{
                    background: none;
                    padding-bottom: 80px;
                }
            }
            .item-li{
                font-size: 14px;
                text-align: center;
                &:first-child{
                    height: 60px;
                    line-height: 60px;
                    border-bottom: 1px solid #f5f5f5;
                }
                &:last-child{
                    height: 50px;
                    line-height: 50px;
                }
            }
            .download{
                padding: 0 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border-radius: 20px;
                background-color: #2e9bff;
                margin: 0 auto;
                font-size: 14px;
                color: #ffffff;
            }
            .friends{}
            .copied{}
            .cancel{}
        }
        .copy{
            width: 100%;
            &.active{
                background: none;
                padding-bottom: 80px;
            }
            .iosx &{
                padding-bottom: 40px;
                &.active{
                    background: none;
                    padding-bottom: 80px;
                }
            }
        }
    }
}
</style>