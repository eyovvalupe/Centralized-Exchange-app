<!-- 首页 -->
<template>
  <div class="page page_home">

    <!-- 顶部 -->
    <div class="top_box">
      <div class="funcs">
        <div class="user_box"></div>
        <div style="flex: 1"></div>
        <div class="func_box"></div>
        <div class="func_box"></div>
      </div>

      <div class="subtitle">总资产(USDT)</div>
      <div class="assets" v-if="!token">
        <div class="assets_login">登录</div>
        <div>查看资产</div>
        <div class="assets_icon"></div>
      </div>
      <div class="assets" v-if="token">
        <div class="num">*******</div>
        <div class="assets_icon"></div>
      </div>

      <div class="btns">
        <div class="ripple_button btn">快速交易</div>
        <div class="ripple_button btn active_btn">充值</div>
      </div>
    </div>

    <!-- 广告 -->
    <div class="home_ad">
      <img src="/static/img/home/ad.png" alt="img">
    </div>

    <!-- banner -->
    <Banner v-if="activated" class="home_banner" />

    <!-- Tabs -->
    <Tabs v-if="!pageLoading" type="card" class="tabs" v-model:active="activeTab" animated shrink>
      <Tab :title="'推荐'">
        <div>推荐</div>
      </Tab>
      <Tab :title="'股票'">
        <div>股票</div>
      </Tab>
      <Tab :title="'量化'">
        <div>量化</div>
      </Tab>
      <Tab :title="'合约'">
        <div>合约</div>
      </Tab>
      <Tab :title="'IPO'">
        <div>IPO</div>
      </Tab>
    </Tabs>

  </div>
</template>

<script setup>
import { onDeactivated, ref, computed, onActivated } from "vue"
import Banner from "./components/Banner.vue"
import { useSocket } from '@/utils/ws'
import store from "@/store";
import { Tab, Tabs } from 'vant';
import { _sort } from "@/api/api"

const { startSocket } = useSocket()
const activeTab = ref(0)
const token = computed(() => store.state.token || '')

// 预加载页面
const pageLoading = computed(() => store.state.pageLoading)
store.commit('setPageLoading', true)
Promise.all([
  import('@/views/Market/MarketInfo.vue'),
]).finally(() => {
  store.commit('setPageLoading', false)
})



const activated = ref(false)
onActivated(() => {
  activated.value = true
})
onDeactivated(() => {
  activated.value = false
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit('realtime', '') // 价格变化
    socket && socket.emit('snapshot', '') // 快照数据
    socket && socket.off('realtime')
    socket && socket.off('snapshot')
    console.error('取消订阅')
  })
})
</script>

<style lang="less" scoped>
.page_home {
  padding: 0 0 1.9rem 0;
  height: 100%;
  overflow-y: auto;

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
      }

      .func_box {
        background-color: #EAF0F3;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        margin-left: 0.28rem;
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
      font-size: 0.56rem;
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
