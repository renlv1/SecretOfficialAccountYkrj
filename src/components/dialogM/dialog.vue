<template>
  <transition name="dialog">
    <div class="g-dialog" v-if="visible">
      <div class="g-dialog-mask"></div>
      <div class="g-dialog-wrap">
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
  @btnColor: #3495f1;
  @btnCancel: #d1d1d1;
  .full () {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .g-dialog{
    .full();
    position: fixed;
    color: #060f26;
    z-index: 999;
    &-mask{
      .full();
      position: absolute;
      background: rgba(0,0,0,.5)
    }
    &-wrap{
      position: absolute;
      width: 90%;
      transform: translate(-50%,-50%);
      left: 50%;
      top: 50%;
      background: #fff;
      text-align: center;
      box-shadow: 0 0 3px rgba(0,0,0,.3);
      border-radius: 6px;
    }
    &-close{
      position: absolute;
      right: 30px;
      top: 30px;
      display: inline-block;
      width: 20px;
      height: 5px;
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
      font-size: 25px;
      line-height: 1;
      margin-bottom: 40px;
      font-weight: bold;
    }
    &-content{
      font-size: .3rem;
      color: #1a1a1a;
      padding: .3rem;
    }
    &-btn-wrap{
      border-top: 1px solid #ebecf0;
      text-align: center;
      height: 1rem;
      display: flex;
      justify-content: space-between;
    }
    &-btn{
      display: inline-block;
      height: 100%;
      cursor: pointer;
      font-size: .32rem;
      color: @btnColor;
      background-color: #fff;
    }
    &-ok{
      width: 100%;
      transition: .4s;
      border-radius: 0 0 6px 0;
      &:active{
       opacity: 0.6;
      }
    }
    &-cancel{
      flex: 1;
      color: @btnCancel;
      border-radius: 0 0 0 6px;
      border-right: 1px solid #ebecf0;
      & + button{
        width: 50%;
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
