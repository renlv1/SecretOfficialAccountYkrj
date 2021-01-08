<template>
  <div class="load-more-box">
    <p class="desc">{{$t('shop.text82')}}</p>
    <div class="loading-img">
      <img src="../assets/img/common/loading.gif" alt="">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {}
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  //  加载中的样式
  .load-more-box
    padding-top: .5rem
    background-color: #F5F6FA
    .desc
      font-size: .24rem
      color: #3495f1;
      text-align: center;
      margin-top: .2rem;
    .loading-img
      width: .8rem;
      height: .8rem;
      margin: .3rem auto 0;
      img
        width: 100%
        height: 100%
</style>
