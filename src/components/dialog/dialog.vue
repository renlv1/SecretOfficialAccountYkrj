<template>
  <transition name="dialog">
    <div class="g-dialog" v-if="visible">
      <div class="g-dialog-mask"></div>
      <div class="g-dialog-wrap">
        <i class="g-dialog-close" @click="visible = false"></i>
        <div class="g-dialog-title">{{title}}</div>
        <div class="g-dialog-content" :style="{textAlign: align}">{{content}}</div>
        <div class="g-dialog-btn-wrap">
          <button v-if="type !== 'alert'" class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">{{cancelText}}</button>
          <button class="g-dialog-btn g-dialog-ok" @click="okCallback">{{okText}}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  props: {
    type: String,
    title: String,
    content: String,
    okFn: Function,
    okText: String,
    cancelFn: Function,
    cancelText: String,
    align: String
  },
  methods: {
    okCallback () {
      this.visible = false
      this.okFn && this.okFn()
    },
    cancelCallback () {
      this.visible = false
      this.cancelFn && this.cancelFn()
    }
  }
}
</script>

<style lang="less" type="text/less">
  @btnColor: #fff;
  .full () {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .g-dialog{
    .full();
    position: fixed;
    color: #333333;
    z-index: 999;
    &-mask{
      .full();
      position: absolute;
      background: rgba(0,0,0,.5)
    }
    &-wrap{
      position: absolute;
      width: 600px;
      transform: translate(-50%,-50%);
      left: 50%;
      top: 50%;
      background: #fff;
      border-radius: 5px;
      padding: 100px 80px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,.3);
      @media screen and (max-width:1200px) {
        width: 80%;
        padding: 40px 30px;
      }
    }
    &-close{
      position: absolute;
      right: 30px;
      top: 30px;
      display: inline-block;
      width: 20px;
      height: 2px;
      background: #999;
      line-height: 0;
      font-size: 0;
      vertical-align: middle;
      -webkit-transform: rotate(45deg);
      cursor: pointer;
    }
    &-close:after {
      content: '/';
      display: block;
      width: 20px;
      height: 2px;
      background: #999;
      -webkit-transform: rotate(-90deg);
    }
    &-title{
      font-size: 16px;
      line-height: 1;
      margin-bottom: 40px;
      font-weight: bold;
    }
    &-content{
      font-size: 14px;
      color: #1a1a1a;
    }
    &-btn-wrap{
      padding-top: 60px;
      text-align: center;
      display: flex;
      justify-content: space-between;
    }
    &-btn{
      display: inline-block;
      height: 40px;
      border: 1px solid  @btnColor;
      cursor: pointer;
      font-size: 16px;
      color: @btnColor;
      border-radius: 4px;
    }
    &-ok{
      width: 100%;
      background: #3495f1;
      transition: .4s;
      &:active{
       opacity: 0.6;
      }
    }
    &-cancel{
      width: 45%;
      color: @btnColor;
      background-color: #ddd;
      & + button{
        width: 45%;
      }
    }
  }
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
</style>
