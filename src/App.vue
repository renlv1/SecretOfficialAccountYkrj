<template>
  <div id="app">
    <!--<div v-show="$store.state.loading" class="global-loading">
      <img src="./assets/img/common/loading.gif" height="20" alt>
      <span>{{$t('common.loading')}}</span>
    </div>-->
    <!-- <div v-show="$store.state.errorMsg" class="global-loading"><span>{{$store.state.errorMsg}}</span></div> -->
      <keep-alive>
          <router-view class="main-container" v-if="$route.meta.keepAlive"/>
      </keep-alive>
          <router-view class="main-container" v-if="!$route.meta.keepAlive"/>
  </div>
</template>
<script>
export default {
  created () {
    // 解决vuex刷新数据丢失
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })
  },
  mounted() {
    /*let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.$store.commit('SET_DEVICE', 0)
    } else {
      this.$store.commit('SET_DEVICE', 1)
    }
    if (isiOS) {
      this.$store.commit('SET_DEVICE', 1)
    } else {
      this.$store.commit('SET_DEVICE', 0)
    }*/
    // 测试登录
    //this.getLogin();
  },
  methods: {
    /*getLogin () {
       this.$fetch.post("/user/userlogin", {
         username: "zero1515",
         password: "123123qQ"
      });
    }*/
  }
};
</script>

<style lang="less">
@import "assets/css/reset.css";
@import "assets/css/common.less";
@import "assets/css/new";
#app {
  font-size: 0.24rem;
  color: #060f26;
  overflow: hidden;
}
.global-loading {
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 20px;
  line-height: 40px;
  border-radius: 4px;
  z-index: 9999;
  left: 50%;
  top: 50%;
  color: #ffffff;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  font-size: 13px;
  img {
    margin-right: 6px;
  }
  &.init {
    background: #fff;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: #666;
  }
}

.router-fade-enter-to {
  transition: opacity 0.5s;
}

.router-fade-enter {
  opacity: 0.4;
}

.fade-enter-active {
  transition: opacity 0.05s 0.1s;
}
.fade-enter,
.fade-leave,
.fade-leave-to {
  opacity: 0;
}
</style>
<style>
.cube-dialog-content-def > p {
  word-break: break-word;
}
.cube-dialog-content-def img {
  max-width: 100%;
}
</style>


