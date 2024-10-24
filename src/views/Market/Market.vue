<!-- 市场 -->
<template>
  <div v-if="activatedIncludes && !pageLoading" class="page page_market">
    <IPODetail v-if="detail == '1'" @close-open-detail="closeOpenDetail" />
    <Subscription v-else-if="detail == '2'" @close-open-detail="closeOpenDetail" />
    <div class="boder-[#D0D8E2] absolute right-4 top-[0.25rem] z-20 flex size-[0.6rem] items-center justify-center rounded-50 border" @click="jump('search')">
      <Iconfonts name="icon-sousuo" :size="0.32" color="#666D80" />
    </div>
    <div class="absolute right-15 top-[0.25rem] z-10 h-[0.5rem] w-[1rem] bg-gradient-to-r from-transparent to-white" />
    <HeaderTabs v-model:active="active" class="w-[6.28rem]" :tabs="[$t('自选'), $t('买币'), $t('股票'), $t('合约'), $t('外汇'), $t('黄金')]" @change="e => changeTab(e, true)" />
    <Swipe ref="swipe" :autoplay="0" :initial-swipe="marketActiveTab" :show-indicators="false" @change="changeTab">
      <SwipeItem>
        <div v-if="active === 0 && activated" class="assets_body">
          <!-- 自选 -->
          <Optional ref="OptionalRef" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div v-if="loadedTab.includes(1)" ref="marketPageRef" class="assets_body">
          <!-- 买币 -->
          <buyCoin />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div v-if="active === 2" class="assets_body">
          <!-- 股票 -->
          <Stock />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div v-if="active === 3" class="assets_body">
          <!-- 合约 -->
          <Constract />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div v-if="active === 4" class="assets_body">
          <!-- 外汇 -->
          <Foreign />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div v-if="active === 5" class="assets_body">
          <!-- 黄金 -->
          <Foreign />
        </div>
      </SwipeItem>
    </Swipe>
    
  <!-- </PullRefresh> -->
<!-- </transition> -->
</div>
</template>

<script setup>
import { Swipe, SwipeItem } from 'vant'
import { ref, onDeactivated, computed, onActivated } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import router from '@/router'
import Optional from './components/Optional.vue'
import Stock from './components/Stock.vue'
// import Financial from './components/Financial.vue'
import Foreign from './components/Foreign.vue'
// import IPO from './components/IPO.vue'
import store, { useMapState } from '@/store'
import IPODetail from '@/views/trade/IPODetail.vue'
import Subscription from '@/views/trade/Subscription.vue'
// import NoData from '@/components/NoData.vue'
import Constract from './components/Constract.vue'
// import Ai from './components/Ai.vue'
import buyCoin from './buyCoin/index.vue'
import Iconfonts from '@/components/Iconfonts.vue'
import { useBuyCoinState } from './buyCoin/state'
import HeaderTabs from '@/components/HeaderTabs.vue'

const { setScrollData, cancelSubs, active: activeTwo, onChange } = useBuyCoinState()
const { bottomTabBarValue } = useMapState(['bottomTabBarValue'])
const market_active = useSessionStorage('market_active', 0)
const marketPageRef = ref()
const scrollData = useScroll(marketPageRef, {
  throttle: 200,
  onScroll: scrollHandler,
})
const marketActiveTab = computed(() => store.state.marketActiveTab || 0);

const openTab = ref(false)

const active = ref(market_active.value)
const initialSwipe = active.value
const OptionalRef = ref()
// const StockRef = ref()
// const IPORef = ref()
// const reloading = ref(false)
const detail = ref(null)
const swipe = ref(null)
// const detailTransition = ref('slide-right')
const loadedTab = ref([active.value])
provide('scrollData', scrollData)
setScrollData(scrollData)
const changeTab = (key, slideSwipe = false) => {
  console.log("change ta===============>",key);
  store.commit("setMarketActiveTab", key);
  active.value = key
  market_active.value = key
  openTab.value = false
  if (!loadedTab.value.includes(key)) loadedTab.value.push(key)
  if (slideSwipe && swipe.value) swipe.value.swipeTo(key)

  setTimeout(() => {
    switch (key) {
      case 0:
        OptionalRef.value && OptionalRef.value.init()
        break
      case 1:
        onChange(activeTwo.value)
        break
      // case 'stock':
      //   // StockRef.value && StockRef.value.init()
      //   break
      // case 'ipo':
      //   IPORef.value && IPORef.value.init()
      //   break
      default:
        cancelSubs()
        break
    }
  }, 100)
}

const activated = ref(false)
const activatedIncludes = computed(() => {
  // 需要缓存的页面
  return [0, 2, 3, 4, 5].includes(active.value) ? activated.value : true
})
function scrollHandler() {
  if (openTab.value) {
    openTab.value = false
  }
}
// 跳转
const jump = name => {
  router.push({
    name,
  })
}
watch(
  () => store.state.bottomTabBarValue,
  newValue => {
    if (newValue === 'market' && active.value == 1) {
      onChange(activeTwo.value)
    }
  }
)
onActivated(() => {
  activated.value = true
  setTimeout(() => {
    if (active.value == 0) {
      OptionalRef.value && OptionalRef.value.init()
    }
  }, 100)
})
onDeactivated(() => {
  setTimeout(() => {
    activated.value = false
  }, 100)
  // 取消订阅
  if (bottomTabBarValue.value !== 'market') {
    cancelSubs()
  }
})
// 预加载页面
const pageLoading = computed(() => store.state.pageLoading)
store.commit('setPageLoading', true)
Promise.all([import('@/views/Market/MarketInfo.vue'), import('@/views/Market/Search.vue'), import('@/views/Market/IpoSubscription.vue')]).finally(() => {
  store.commit('setPageLoading', false)

  setTimeout(() => {
    changeTab(active.value)
  }, 0)
})
</script>

<style lang="less" scoped>
.page_market {
  padding-bottom: 1.4rem;
  height: 100%;
  // overflow-y: auto;
  position: relative;
  width: 7.5rem;
  &:has(.open_tabs) {
    :deep(.addBtn) {
      top: 1.76rem;
    }
  }

  .assets_body {
    overflow-y: auto;
    height: calc(100vh - 2.52rem);
  }

  :deep(.van-sticky) {
    background-color: #fff;
    padding-top: 0.2rem;
  }

  .mytab_title {
    display: flex;
    align-items: center;
    transition: all ease 0.3s;

    > span {
      margin-left: 0.08rem;
    }

    .mytab_title_icon {
      width: 0.32rem;
      height: 0.32rem;
      line-height: 1;
      position: relative;
      top: -0.02rem;
    }
  }

  .mytab_title_active {
    .mytab_title_icon {
      width: 0.28rem;
      height: 0.28rem;
    }
  }

  .title {
    padding: 0 0.24rem 0 0.32rem;
    height: 1.12rem;
    font-weight: 600;
    color: #0d0d12;
    line-height: 0.5rem;
    font-size: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.1rem;
    position: relative;
  }

  .search_block {
    background-color: #fff;
    border: 1px solid #eeeff1;
    height: 0.8rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0.32rem;
    font-size: 0.28rem;
    color: #9ea3ae;
    margin: 0 0.32rem 0.12rem 0.32rem;

    .search_icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.2rem;
    }
  }

  .search_box {
    position: absolute;
    z-index: 9;
    top: 0.2rem;
    right: 0.24rem;
    width: 0.64rem;
    height: 0.64rem;
  }

  .tabs {
    position: relative;
    overflow-x: auto;

    :deep(.tab_item) {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      position: relative;

      .tab_item_icon {
        width: 0.3rem;
        height: 0.3rem;
        margin-right: 0.04rem;
        font-size: 0.3rem;
      }

      .nav_num {
        width: 0.28rem;
        height: 0.28rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ff3b30;
        font-size: 0.2rem;
        color: #fff;
        font-weight: 400;
        border-radius: 50%;
        position: absolute;
        top: -0.3rem;
        right: -0.12rem;
      }
    }

    .tab_icon {
      width: 100%;
      height: 100%;
      line-height: 0;
      position: absolute;
      top: 0;
      left: 0;
      padding: 0.1rem;
    }

    :deep(.my_icon) {
      position: absolute;
      top: 0;
      right: 1rem;
      padding-right: 0 !important;
      padding-left: 0 !important;
      border-radius: 50%;
      border: 1px solid #edf2f7;
      width: 0.6rem;
      height: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
    }

    :deep(.my_icon2) {
      position: absolute;
      top: 0;
      right: 0.2rem;
      padding-right: 0 !important;
    }

    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: #666d80;
    }

    :deep(.van-tab--card.van-tab--active) {
      background-color: transparent;
      color: #08090e;
      font-weight: 600;
      font-size: 0.5rem;
      position: relative;
      // border-bottom: 3px solid #014cfa;
      // border-width: 10px;
      .tab_item {
        z-index: 1;
      }
      &::after {
        content: '';
        position: absolute;
        width: 0.6rem;
        height: 0.2rem;
        background-color: var(--main-color);
        border-radius: 0.2rem;
        position: absolute;
        bottom: 0.06rem;
        padding-left: 0;
      }
    }

    :deep(.van-tab--shrink) {
      padding-left: 0;
      padding-right: 0.4rem;
    }

    :deep(.van-tabs__wrap) {
      height: 0.8rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0);
      position: relative;
      padding-right: 1.7rem;
      // 源14 多8
      margin-top: 0.12rem;
      margin-bottom: 0.24rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 0.8rem;
      width: 100%;
      position: static;
    }

    :deep(.van-tab) {
      line-height: 0.6rem;
      font-size: 0.28rem;
    }
  }

  .open_tabs {
    z-index: 999;
    position: relative;

    :deep(.my_icon) {
      right: 0.2rem;
    }

    :deep(.van-sticky) {
      height: 1.6rem !important;
      border-bottom-left-radius: 0.6rem;
      border-bottom-right-radius: 0.6rem;
      // position: relative;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }

    :deep(.van-tabs__wrap) {
      height: 1.4rem;
      padding-right: 1.2rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 1.2rem;
      flex-wrap: wrap;
      overflow: hidden;
    }
  }
}
</style>
