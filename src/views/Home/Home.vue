<!-- 首页 -->
<template>
  <div class="page page_home">

    <!-- 顶部 -->
    <div class="top_box">
      <div class="funcs">
        <div class="user_box">
          <img v-if="token" src="/static/img/user/default_avatar.png" alt="avatar">
          <Iconfonts v-if="!token" :name="'icon-yonghuhui'" :size="0.52" />
        </div>
        <div style="flex: 1"></div>
        <div class="func_box" @click="jump('search')">
          <Iconfonts :name="'icon-sousuo'" :size="0.36" :color="'#000'" />
        </div>
        <div class="func_box">
          <Iconfonts :name="'icon-xiaoxi'" :size="0.36" :color="'#000'" />
        </div>
      </div>

      <div class="subtitle">总资产(USDT)</div>
      <div class="assets" v-if="!token" @click="jump('login')">
        <div class="assets_login">登录</div>
        <div>查看资产</div>
        <div class="assets_icon">
          <Iconfonts :name="'icon-biyan'" :size="0.32" :color="'#333'" />
        </div>
      </div>
      <div class="assets" v-if="token">
        <div class="num">{{ openEye ? assets.total : '*******' }}</div>
        <div class="assets_icon" @click="openEye = !openEye">
          <Iconfonts v-show="!openEye" :name="'icon-biyan'" :size="0.32" :color="'#333'" />
          <Iconfonts v-show="openEye" :name="'icon-zhengyan'" :size="0.32" :color="'#333'" />
        </div>
      </div>

      <div class="btns">
        <div class="ripple_button btn" @click="showAS = true">快速交易</div>
        <div class="ripple_button btn active_btn" @click="jump('topUp', true)">充值</div>
      </div>
    </div>

    <!-- 广告 -->
    <div class="home_ad">
      <img src="/static/img/home/ad.png" alt="img">
    </div>

    <!-- banner -->
    <Banner v-if="activated" class="home_banner" />

    <!-- Tabs -->
    <Tabs @change="tabChange" v-if="!pageLoading" type="card" class="tabs" v-model:active="activeTab" animated shrink>
      <Tab :title="'股票'">
        <Loaidng v-if="commendLoading" :loading="commendLoading" />
        <div>
          <StockItem :item="item" v-for="(item, i) in marketRecommndStockList" :key="'s_' + i" />
        </div>
        <NoData v-if="!commendLoading && !marketRecommndStockList.length" />
      </Tab>
      <Tab :title="'合约'">
        <Loaidng v-if="commendLoading" :loading="commendLoading" />
        <div>
          <StockItem :item="item" v-for="(item, i) in marketRecommndContractList" :key="'c_' + i" />
        </div>
        <NoData v-if="!commendLoading && !marketRecommndContractList.length" />
      </Tab>
      <Tab :title="'IPO'">
        <div>
          <IPO ref="ipoRef" :page="'home'" />
        </div>
      </Tab>
    </Tabs>

    <!-- 类型选择弹窗 -->
    <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" title="快速交易"></ActionSheet>
  </div>
</template>

<script setup>
import StockItem from "@/components/StockItem.vue"
import { onDeactivated, ref, computed, onActivated } from "vue"
import Banner from "./components/Banner.vue"
import { useSocket } from '@/utils/ws'
import store from "@/store";
import { Tab, Tabs, ActionSheet } from 'vant';
import { _sort, _watchlistDefault } from "@/api/api"
import Iconfonts from "@/components/Iconfonts.vue"
import router from "@/router";
import IPO from "../Market/components/IPO.vue"
import NoData from "@/components/NoData.vue"
import Loaidng from "@/components/Loaidng.vue"

const openEye = ref(false)

const { startSocket } = useSocket()
const activeTab = ref(0)
const token = computed(() => store.state.token || '')

// 打开添加类型选择弹窗
const showAS = ref(false)
const actions = [
  { name: '股票', value: '0' },
  { name: '合约', value: '-1' },
  { name: 'IPO', value: '1' },
];
const onSelect = item => {
  showAS.value = false
  if (item.value == -1) return
  router.push({
    name: 'trade',
    query: {
      page: 'home',
      pageType: item.value
    }
  })
}

// 预加载页面
const pageLoading = computed(() => store.state.pageLoading)
store.commit('setPageLoading', true)
Promise.all([
  import('@/views/Market/MarketInfo.vue'),
  import('@/views/Market/Search.vue'),
  import('@/views/Public/Login.vue'),
  import('@/views/Assets/TopUpCrypto.vue'),
]).finally(() => {
  store.commit('setPageLoading', false)
})

// 总资产
const assets = computed(() => store.state.assets || {})
const getAssets = () => {
  if (!token.value) return
  store.dispatch('updateAssets')
  store.dispatch('updateWallet')
}
getAssets()


const ipoRef = ref()
const ipoDataList = computed(() => store.state.ipoDataList || [])
const tabChange = (val) => {
  if (val == 2 && !ipoDataList.value.length) {
    setTimeout(() => {
      ipoRef.value && ipoRef.value.init()
    }, 500)
  }
}

const activated = ref(false)
onActivated(() => {
  activated.value = true
  setTimeout(() => {
    subs([...marketRecommndStockList.value, ...marketRecommndContractList.value, ...marketRecommndList.value])
  }, 500)
})
onDeactivated(() => {
  activated.value = false
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit('realtime', '') // 价格变化
    socket && socket.emit('snapshot', '') // 快照数据
    socket && socket.off('realtime')
    socket && socket.off('snapshot')
  })
})


// 获取推荐数据
const commendLoading = ref(false)
const marketRecommndStockList = computed(() => store.state.marketRecommndStockList || [])
const marketRecommndContractList = computed(() => store.state.marketRecommndContractList || [])
const marketRecommndList = computed(() => store.state.marketRecommndList || [])
const getRecommendData = () => {
  commendLoading.value = true
  _watchlistDefault().then(res => {
    if (res.data?.chart) {
      const rs = res.data.chart.map(item => {
        const target = marketRecommndList.value.find(a => a.symbol == item.symbol)
        if (target) {
          Object.assign(target, item)
          item = target
        }
        return item
      })
      store.commit('setMarketRecommndList', rs)
    }
    if (res.data?.stock) {
      const rs = res.data.stock.map(item => {
        const target = marketRecommndStockList.value.find(a => a.symbol == item.symbol)
        if (target) {
          Object.assign(target, item)
          item = target
        }
        return item
      })
      store.commit('setMarketRecommndStockList', rs)
    }
    if (res.data?.contract) {
      const rs = res.data.contract.map(item => {
        const target = marketRecommndContractList.value.find(a => a.symbol == item.symbol)
        if (target) {
          Object.assign(target, item)
          item = target
        }
        return item
      })
      store.commit('setMarketRecommndContractList', rs)
    }
    setTimeout(() => {
      subs([...(res.data?.chart || []), ...(res.data?.stock || []), ...(res.data?.contract || [])])
    }, 500)
  }).finally(() => {
    commendLoading.value = false
  })
}
getRecommendData()

const subs = (arr) => { // 订阅 ws
  store.commit('setMarketWatchKeys', arr.map(item => item.symbol) || [])
  store.dispatch('subList', {})
}


// 跳转
const jump = (name, needToken) => {
  if (needToken && !token.value) return router.push({
    name: 'login'
  })
  router.push({
    name
  })
}
</script>

<style lang="less" scoped>
.page_home {
  padding: 0 0 1.9rem 0;
  height: 100%;
  overflow-y: auto;

  :deep(.van-action-sheet__content) {
    padding: 0.2rem 0 1.38rem 0;

    .van-action-sheet__item {
      padding: 0.32rem;
      border-bottom: 1px solid #F5F5F5;
    }
  }

  .top_box {
    padding: 0.2rem 0.32rem 0 0.32rem;

    .funcs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.24rem;

      .user_box {
        width: 0.52rem;
        height: 0.52rem;
        background-color: #D9D9D9;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .func_box {
        background-color: #EDEDED;
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 50%;
        margin-left: 0.28rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .subtitle {
      color: #333333;
      font-size: 0.26rem;
      margin-bottom: 0.16rem;
    }

    .assets {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 0.4rem;
      color: #8D93A6;
      font-weight: 600;

      .assets_login {
        color: #014CFA;
        margin-right: 0.12rem;
      }

      .assets_icon {
        width: 0.32rem;
        height: 0.32rem;
        margin-left: 0.2rem;
        line-height: 0;
      }

      .num {
        color: #000;
        font-size: 0.48rem;
      }
    }

    .btns {
      margin-top: 0.28rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .btn {
        width: 48%;
        height: 0.76rem;
        background-color: #F2F3F7;
        border-radius: 0.76rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000000;
        font-size: 0.28rem;
      }

      .active_btn {
        background-color: #014CFA;
        color: #fff;
      }
    }
  }

  .home_ad {
    height: 2.8rem;
    width: 100%;
    margin: 0.4rem 0;
  }

  .home_banner {
    padding-bottom: 0.2rem;
  }

  .tabs {
    overflow: hidden;

    :deep(.van-tab__panel) {
      // height: calc(var(--app-height) - 3.4rem);
      // overflow-y: auto;
    }

    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: #061023;
      // background-color: #f5f5f5;
      // border-radius: 0.3rem;
      // margin-left: 0.1rem;
      // transition: all ease .2s;
    }

    :deep(.van-tab--card.van-tab--active) {
      // background-color: #014CFA;
      // color: #fff;

      background-color: #F6F8FF;
      border-radius: 0.3rem;
      color: #014CFA;
      font-weight: 500
    }

    :deep(.van-tab--shrink) {
      padding: 0 0.3rem;
    }

    :deep(.van-tabs__wrap) {
      height: 0.8rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0);
      padding-bottom: 0.2rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 0.6rem;
    }

    :deep(.van-tab) {
      line-height: 0.6rem;
      font-size: 0.28rem;
    }
  }

}
</style>
