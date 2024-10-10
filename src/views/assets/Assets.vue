<!-- 资产页 -->
<template>
  <div class="page page_assets">
    <!-- <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh"> -->

    <!-- <div class="page_title">
                <span></span>
                <div class="record_icon_box" @click="openRecordPopup">
                    <div class="record_icon">
                        <img src="/static/img/user/withdraw_record_icon.png" alt="img">
                    </div>

                    <span>记录</span>
                </div>
            </div> -->

    <Tabs v-if="pageLoading" v-model:active="active" sticky class="tab_content" :lazy-render="false" type="card" animated shrink>
      <Tab :title="$t('总资产')" name="overview">
        <!-- <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'overview' }">
                            <div class="mytab_title_icon">
                                <img v-show="active != 'overview'" src="/static/img/user/iden-1.png" alt="img">
                                <img v-show="active == 'overview'" src="/static/img/user/iden-2.png" alt="img">
                            </div>
                            <span v-show="active == 'overview'">总资产</span>
                        </div>
                    </template> -->

        <div class="tab_body">
          <Overview v-if="active == 'overview'" ref="overviewRef" @openRecordPopup="openRecordPopup" @setLoading="val => (loading = val)" />
        </div>
      </Tab>
      <Tab :title="$t('现金账户')" name="cash">
        <!-- <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'cash' }">
                            <div class="mytab_title_icon">
                                <img v-show="active != 'cash'" src="/static/img/user/google-1.png" alt="img">
                                <img v-show="active == 'cash'" src="/static/img/user/google-2.png" alt="img">
                            </div>
                            <span v-show="active == 'cash'">现金账户</span>
                        </div>
                    </template> -->
        <div class="tab_body">
          <Cash v-if="active == 'cash'" ref="cashRef" @setLoading="val => (loading = val)" />
        </div>
      </Tab>
      <Tab name="stock">
        <template #title>
          <div class="mytab_title" :class="{ mytab_title_active: active == 'stock' }">
            <div v-show="active != 'stock'" class="mytab_title_icon">
              <img v-show="active != 'stock'" src="/static/img/assets/stock_icon.svg" alt="img" />
            </div>
            <span v-show="active == 'stock'">{{ $t('股票') }}</span>
          </div>
        </template>
        <div class="tab_body">
          <Stock v-if="active == 'stock'" ref="stockRef" @setLoading="val => (loading = val)" />
        </div>
      </Tab>
      <Tab name="contract">
        <template #title>
          <div class="mytab_title" :class="{ mytab_title_active: active == 'contract' }">
            <div v-show="active != 'contract'" class="mytab_title_icon">
              <img v-show="active != 'contract'" src="/static/img/assets/contract_icon.svg" alt="img" />
            </div>
            <span v-show="active == 'contract'">{{ $t('合约') }}</span>
          </div>
        </template>
        <div class="tab_body">
          <Contract />
        </div>
      </Tab>
      <Tab name="ai">
        <template #title>
          <div class="mytab_title" :class="{ mytab_title_active: active == 'ai' }">
            <div v-show="active != 'ai'" class="mytab_title_icon">
              <img v-show="active != 'ai'" src="/static/img/market/ai.svg" alt="img" />
            </div>
            <span v-show="active == 'ai'">{{ $t('交易机器人') }}</span>
          </div>
        </template>
        <div class="tab_body" />
      </Tab>
      <Tab name="ipo">
        <template #title>
          <div class="mytab_title" :class="{ mytab_title_active: active == 'ipo' }">
            <div v-show="active != 'ipo'" class="mytab_title_icon">
              <img v-show="active != 'ipo'" src="/static/img/assets/ipo_icon.svg" alt="img" />
            </div>
            <span v-show="active == 'ipo'">IPO</span>
          </div>
        </template>
        <div class="tab_body">
          <IPO v-if="active == 'ipo'" ref="ipoRef" @setLoading="val => (loading = val)" />
        </div>
      </Tab>
      <Tab name="financial">
        <template #title>
          <div class="mytab_title" :class="{ mytab_title_active: active == 'financial' }">
            <div v-show="active != 'financial'" class="mytab_title_icon">
              <img v-show="active != 'financial'" src="/static/img/market/money.svg" alt="img" />
            </div>
            <span v-show="active == 'financial'">{{ $t('理财') }}</span>
          </div>
        </template>
        <div class="tab_body" />
      </Tab>
    </Tabs>
    <!-- </PullRefresh> -->

    <!-- 记录弹窗 -->
    <RecordList ref="RecordListRef" />

    <!-- 充提记录 -->
    <!-- <HintBlock v-if="route.name == 'assets' && hintNum" /> -->
  </div>
</template>

<script setup>
import { Tab, Tabs, PullRefresh } from 'vant'
import { ref, onMounted, computed, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import Overview from './page/Overview.vue'
import Cash from './page/Cash.vue'
import Stock from './page/Stock.vue'
import IPO from './page/IPO.vue'
import Contract from './page/Contract.vue'
import RecordList from '@/components/RecordList.vue'
import store from '@/store'
import router from '@/router'
// import HintBlock from "@/components/HintBlock.vue"

const route = useRoute()
const hintNum = computed(() => store.state.hintNum || 0)

const RecordListRef = ref()
const active = ref('overview')
const loading = ref(false)
const disabled = ref(false)
const pageLoading = ref(false)

const openRecordPopup = () => {
  router.push({
    name: 'recordList',
    query: {
      tab: 0,
    },
  })
}

const overviewRef = ref()
const cashRef = ref()
const onRefresh = () => {
  switch (active.value) {
    case 'overview':
      overviewRef.value && overviewRef.value.refresh()
      break
    case 'cash':
      cashRef.value && cashRef.value.refresh()
      break
  }
}

onMounted(() => {
  // 下拉刷新状态监听
  setTimeout(() => {
    // const bodys = document.querySelectorAll('.tab_body')
    // bodys.forEach(item => {
    // item.addEventListener('scroll', (e) => {
    //     if (e.target.scrollTop > 0) {
    //         disabled.value = true
    //     } else {
    //         disabled.value = false
    //     }
    // })
    // })
  }, 500)
})

// 预加载页面
store.commit('setPageLoading', true)
const loadingList = [import('@/views/assets/Loan.vue'), import('@/views/assets/TopUp.vue'), import('@/views/assets/Transfer.vue'), import('@/views/assets/Withdraw.vue'), import('@/views/assets/Swap.vue')]
Promise.all(loadingList).finally(() => {
  store.commit('setPageLoading', false)
  setTimeout(() => {
    pageLoading.value = true
  }, 100)
})

onActivated(() => {
  // store.dispatch('updateOrderHint')
})
</script>

<style lang="less" scoped>
.page_assets {
  // padding: 0.24rem 0 0 0;
  height: 100%;
  overflow-y: auto;

  :deep(.van-sticky) {
    background-color: #fff;
    padding-top: 0.24rem;
  }

  .page_title {
    padding: 0.3rem 0.24rem 0 0.32rem;
    // height: 1.12rem;
    font-weight: 600;
    color: #0d0d12;
    line-height: 0.5rem;
    font-size: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-bottom: 0.1rem;
    position: relative;

    .record_icon_box {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      font-size: 0.28rem;
      font-weight: 400;
      color: #0953fa;
      font-size: 0.24rem;

      .record_icon {
        background-color: #ededed;
        width: 0.52rem;
        height: 0.52rem;
        padding: 0.06rem;
        border-radius: 50%;
        margin-right: 0.04rem;

        &:active {
          background-color: #eaf0f3;
        }
      }
    }
  }

  .tab_content {
    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: #061023;
      // background-color: #f5f5f5;
    }

    :deep(.van-tab--card.van-tab--active) {
      background-color: #f6f8ff;
      border-radius: 0.3rem;
      color: #014cfa;
      font-weight: 500;
    }

    :deep(.van-tab--shrink) {
      padding: 0 0.3rem;
    }

    :deep(.van-tabs__wrap) {
      height: 0.8rem;
      padding-bottom: 0.34rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 0.6rem;
    }

    :deep(.van-tab) {
      line-height: 0.6rem;
      font-size: 0.28rem;
    }
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

  .tab_body {
    // height: calc(var(--app-height) - 3.7rem);
    // width: 100%;
    // overflow-y: auto;
  }

  .refresh_box {
    width: 100%;
  }
}
</style>
