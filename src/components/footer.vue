<template>
  <div class="footer">
    <ul>
      <router-link to="/home" tag="li" excat >
        <img class="normal" src="../assets/img/footer/0.png" alt="">
        <img class="active" src=../assets/img/footer/0_active.png alt="">
        <p>{{$t('verify.text7')}}</p>
      </router-link>
      <!--<router-link to="/paiPay" tag="li" excat>
        <img class="normal" src="../assets/img/footer/shoping_1.png" alt="">
        <img class="active" src="../assets/img/footer/active_1.png" alt="">
        <p>购物</p>
      </router-link>-->
      <router-link to="/shopping" tag="li" excat>
        <img class="normal" src="../assets/img/footer/1_shopping-icon.png" alt="">
        <img class="active" src="../assets/img/footer/2_shopping-icon.png" alt="">
        <p>{{$t('verify.text8')}}</p>
      </router-link>
      <li @click="gotoPage" tag="li" :class="{'router-link-active': this.$route.path === '/reason' || this.$route.path === '/openShop' || this.$route.path === '/notOpen'}">
        <img class="normal" :src="require(`../assets/img/footer/1.png`)" alt="">
        <img class="active" :src="require(`../assets/img/footer/1_active.png`)" alt="">
        <p>{{$t('notMerchant.text5')}}</p>
      </li>
      <router-link to="/vote" tag="li" excat>
        <img class="normal" src="../assets/img/footer/3.png" alt="">
        <img class="active" src="../assets/img/footer/3_active.png" alt="">
        <p>{{$t('vote.text1')}}</p>
      </router-link>
      <router-link to="/account" tag="li" excat>
        <img class="normal" src="../assets/img/footer/2.png" alt="">
        <img class="active" src="../assets/img/footer/2_active.png" alt="">
        <p>{{$t('account.text1')}}</p>
      </router-link>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  created () {
    this.getStatus()
  },
  methods: {
	  getStatus () {
		  this.$fetch.post('/bountyMerchant/merchantStatus').then(res => {
			  if (res.state === 'success') {
          this.$emit('merchatFlag', res.data)
          this.$store.commit('SET_mapData', res.mapData.canConfirmMapCount)
          this.$store.commit('SET_STATUS', res.data)
			  }
		  })
	  },
	  gotoPage () {
		  // 商户状态 0:没有申请过(status=0 body有内容的话里面就是之前老商户的信息，body没有内容表示不是老商户) 1:待审核 2:审核通过 3:审核失败 4:冻结 5:删除
      const status = this.$store.state.mStatus.status
		  if (status > -1) {
		    if (status === 1 || status === 3 || status === 4 || status === 5) {
          this.$router.push({
            path: '/reason',
            query: {
	            merchatData: JSON.stringify(this.$store.state.mStatus)
            }
          })
		    } else if (status === 2) { // '/openShop'
			    this.$router.push({
				    path: '/openShop',
				    query: {
					    merchatData: JSON.stringify(this.$store.state.mStatus),
              count: this.$store.state.mCount
				    }
			    })
		    } else if (status === 0) {
			    this.$router.push('/notOpen')
		    }
      }
    }
  }
}
</script>
