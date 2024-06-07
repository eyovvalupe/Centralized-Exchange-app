<!-- 首页 -->
<template>
  <div class="page page_home">
    <!-- banner -->
    <Banner class="home_banner" />

    <!-- 首页推荐数据 -->
    <Recommend @ready="readyRecommendData" class="home_recommend" />

    <!-- Tabs -->
    <Tabs v-if="!pageLoading" sticky class="tabs" @change="changeTab" v-model:active="active" :swipeable="false"
      animated :color="'#014CFA'" shrink>
      <Tab :title="'活跃'">
        <StockTable :key="'vol'" :loading="loading" :list="marketVolumeList" />
      </Tab>
      <Tab :title="'涨幅'">
        <StockTable :key="'up'" :loading="loading" :list="marketUpList" />
      </Tab>
      <Tab :title="'跌幅'">
        <StockTable :key="'down'" :loading="loading" :list="marketDownList" />
      </Tab>
    </Tabs>
  </div>
</template>

<script setup>
import { onDeactivated, ref, computed } from "vue"
import { Tab, Tabs } from 'vant';
import Banner from "./components/Banner.vue"
import Recommend from "./components/Recommend.vue"
import { useSocket } from '@/utils/ws'
import StockTable from "@/components/StockTable.vue"
import store from "@/store";
import { _sort } from "@/api/api"

const bannerRef = ref()

// tabs
const active = ref(-1)
const changeTab = (key, scrollToTop = true) => {
  if (scrollToTop) {
    try {
      document.querySelector('.page').scrollTo({ top: document.querySelector('.home_banner').clientHeight + document.querySelector('.home_recommend').clientHeight, behavior: 'smooth' });
    } catch {
      console.error('滚动失败')
    }
  }
  switch (key) {
    case 0:
      getData(marketVolumeList, 'setMarketVolumeList', 'volume')
      break
    case 1:
      getData(marketUpList, 'setMarketUpList', 'up')
      break
    case 2:
      getData(marketDownList, 'setMarketDownList', 'down')
      break
  }
}
const marketVolumeList = computed(() => store.state.marketVolumeList || []) // 活跃列表
const marketUpList = computed(() => store.state.marketUpList || []) // 涨幅列表
const marketDownList = computed(() => store.state.marketDownList || []) // 跌幅列表
const loading = ref(false)
const subs = (list, key) => { // 订阅ws
  store.dispatch('subList', {
    commitKey: key,
    proxyListValue: list
  })
}
// 获取列表数据
const getData = (list, key, query) => {
  if (loading.value) return
  loading.value = true
  if (list.value.length) {
    subs(list, key)
  }
  _sort({
    orderby: query
  }).then(res => {
    if (res.code == 200) {
      res.data = res.data.map(item => {
        item.ratio = undefined // 弃用接口里的该字段
        return item
      })
      if (list.value.length) { // 有历史数据就更新
        const rs = res.data.map(item => {
          const target = list.value.find(a => a.symbol == item.symbol)
          if (target) {
            item = {
              ...target,
              ...item,
              ratio: target.ratio
            }
          }
          return item
        })
        store.commit(key, rs || [])
      } else { // 没有就直接提交
        store.commit(key, res.data || [])
      }

      setTimeout(() => {
        subs(list, key)
      }, 0)
    }
  }).finally(() => {
    loading.value = false
  })

}

// 预加载页面
const pageLoading = computed(() => store.state.pageLoading)
store.commit('setPageLoading', true)
Promise.all([
  import('@/views/Market/MarketInfo.vue'),
]).finally(() => {
  store.commit('setPageLoading', false)
})


changeTab(0) // 获取首屏数据
const readyRecommendData = () => { // 推荐数据准备好了，一起监听
  changeTab(active.value, false)
}
const { startSocket } = useSocket()
onDeactivated(() => {
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit('realtime', '') // 价格变化
    socket && socket.emit('snapshot', '') // 快照数据
    console.error('取消订阅')
  })
})
</script>

<style lang="less" scoped>
.page_home {
  padding: 0 0 1.9rem 0;

  .home_banner {
    padding-bottom: 0.2rem;
  }

  .tabs {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    :deep(.van-tabs__wrap) {
      height: calc(44px + 0.2rem);
    }

    :deep(.van-tabs__nav) {
      position: relative;

      &::after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: #3B82F6;
        position: absolute;
        bottom: 16px;
        left: 0;
        opacity: 0.3;
      }
    }

    :deep(.van-tab) {
      margin-left: 0.36rem;
    }

    :deep(.van-tabs__content) {
      flex: 1;

      .van-swipe-item {
        overflow-y: auto;
        padding-bottom: 0.2rem;
      }
    }
  }
}
</style>
