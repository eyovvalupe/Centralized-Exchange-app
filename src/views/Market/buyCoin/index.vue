<!-- 买币 -->
<template>
  <div class="page page-buycoin">
    <Tabs v-if="!pageLoading" v-model:active="active" class="tabs" :swipeable="false" animated :color="'#014CFA'" shrink @change="onChange">
      <Tab title="快捷区" name="0">
        <Faster />
      </Tab>
      <Tab title="自选区" name="1">
        <Self />
      </Tab>
      <Tab title="我的订单" name="2">
        <List ref="listRef" />
        <template #title>
          <div class="tab_item">
            <span>我的订单</span>
            <div v-if="store.state.c2cUnreadTotal > 0" class="nav_num">{{ store.state.c2cUnreadTotal }}</div>
          </div>
        </template>
      </Tab>
    </Tabs>
  </div>
</template>

<script setup>
import { Tab, Tabs } from 'vant'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSocket } from '@/utils/ws'
import Faster from './Faster.vue'
import List from './List.vue'
import Self from './Self.vue'
import store from '@/store'

const { startSocket } = useSocket()
const token = computed(() => store.state.token)

// 订阅
const currLoading = ref(false)
const subs = () => {
  const socket = startSocket(() => {
    socket && socket.off('user')
    socket && socket.off('c2corder')
    socket && socket.emit('user', token.value)
    socket && socket.emit('c2corder', '#all')
    currLoading.value = true
    store.commit('setC2cList', [])
    socket.on('c2corder', res => {
      // console.error('--->', res.data)
      store.commit('setC2cList', res.data || [])
      currLoading.value = false
    })
  })
}
// 取消订阅
const cancelSubs = () => {
  const socket = startSocket(() => {
    socket && socket.off('user')
    socket && socket.off('c2corder')
    socket && socket.emit('user', '')
    socket && socket.emit('c2corder', '')
  })
}

const listRef = ref()
const active = ref(sessionStorage.getItem('buycoinActive') || 0)
const onChange = i => {
  sessionStorage.setItem('buycoinActive', i)
  if (i == 2) {
    listRef.value && listRef.value.init()
  }
}

const pageLoading = ref(true)
onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false
  }, 300)
  if (token.value) {
    subs()
  }
})
onUnmounted(() => {
  cancelSubs()
})
</script>

<style lang="less" scoped>
.page-buycoin {
  .tabs {
    :deep(.van-tabs__wrap) {
      background: #eff3f8;
      margin: 0 0.32rem;
      border-radius: 16px;
      height: 40px;
      padding: 0 !important;
      overflow: visible;
      .van-tabs__nav--complete {
        overflow: visible;
        padding: 0;
      }
      .van-tabs__nav {
        position: relative;
        display: flex;
        justify-content: space-between;
        background: initial;
        .van-tabs__line {
          display: none;
        }
        .van-tab {
          width: 33%;
          color: #666d80;
        }
        .van-tab--active {
          box-shadow: 0px -2px 5px 0px #014cfa1a;
          background: white;
          padding: 0;
          border-radius: 16px;
          height: 120%;
          transform: translateY(-10%);
          color: #014cfa;
          &:first-child {
            border-end-end-radius: 0;
          }

          &:nth-child(2) {
            border-end-start-radius: 0;
            border-end-end-radius: 0;
          }

          &:nth-child(3) {
            border-end-start-radius: 0;
          }
        }
        // &::after {
        //     content: '';
        //     width: 100%;
        //     height: 1px;
        //     background-color: #3B82F6;
        //     position: absolute;
        //     bottom: 16px;
        //     left: 0;
        //     opacity: 0.3;
        // }
      }
    }
  }
}
</style>
