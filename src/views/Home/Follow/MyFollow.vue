<!-- 跟单广场 -->
<template>
  <div class="page-my-follow">
    <Top :title="'我的跟单'"></Top>

    <!-- Tab -->
    <div class="tabs">
      <div class="tab">期权</div>
    </div>

    <!-- 统计 -->
    <div class="total">
      <div class="left">
        <div class="title">跟单总收益(USDT)</div>
        <div class="num">0.08 USDT</div>
        <div class="today">今日 <span class="num">0.00</span></div>
      </div>
      <div class="right">
        <div class="title">跟单总额</div>
        <div class="num">1.08 USDT</div>
        <div class="today">&nbsp;</div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <NoData v-if="!loading && !list.length" />
      <div class="list-i" v-for="(item, i) in list" :key="i">
        <MyFollowItem :item="item" />
      </div>
      <LoadingMore :loading="loading" :finish="finish" v-if="(finish && list.length) || (!finish)" />
    </div>
  </div>
</template>

<script setup>
import { Button } from "vant"
import Top from "@/components/Top.vue";
import MyFollowItem from "../components/MyFollowItem.vue"
import router from "@/router";
import BottomPopup from "@/components/BottomPopup.vue";
import { useI18n } from "vue-i18n";
import SlideContainer from "@/components/SlideContainer.vue";
import store from "@/store";
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { ref, computed, onMounted, onUnmounted } from "vue"
import { _copyMyList } from '@/api/api'

const { t } = useI18n();
const jump = name => {
  router.push({ name })
}

// 我的跟单
store.dispatch('updateMyCopy')
// const myCopy = computed(() => store.state.myCopy || {})
const myCopy = computed(() => {
  return {
    name: '用户名',
    amount: '带单总金额',
    returnrate: '收益率',
    returnamount: '收益金额',
    winrate: '胜率',
    days: '带单天数',
  }
})

// 我的跟单列表
const loading = ref(false)
const finish = ref(false)
const list = ref([])
const page = ref(0)
const getData = () => {
  if (loading.value || finish.value) return
  loading.value = true
  page.value++
  _copyMyList({
    page: page.value
  }).then(res => {
    console.error('????', res)
    if (page.value == 1) {
      list.value = res.data || []
    } else {
      list.value.push(...(res.data || []))
    }
    if (!res.data?.length) {
      finish.value = true
    }
  }).finally(() => {
    loading.value = false
  })
}

getData()

let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
  const rect = moreDom.getBoundingClientRect()
  if (rect.top <= totalHeight) {
    // 加载更多
    console.error('加载更多')
    getData()
  }
}

onMounted(() => {
  setTimeout(() => {
    try {
      moreDom = document.querySelector('.loading_more')
      document.querySelector('.page-my-follow').addEventListener('scroll', scrolHandle)
    } catch {
    }
  }, 500)
})
onUnmounted(() => {
  try {
    document.querySelector('.page-my-follow').removeEventListener('scroll', scrolHandle)
  } catch { }
})

// 追加
const showPlusDialog = ref(false)
const plusAmount = ref('')
const amountFocus = ref(false)
const sellLoading = ref(false)
const sliderValue = ref(0)
const changeValue = () => { }
const onSliderChange = () => { }

</script>

<style lang="less" scoped>
.page-my-follow {
  padding: 1.28rem 0.32rem 0.32rem 0.32rem;
  height: 100%;
  overflow-y: auto;

  .tabs {
    border-bottom: 1px solid var(--ex-border-color);
    display: flex;

    .tab {
      font-size: 0.3rem;
      color: var(--ex-primary-color);
      padding: 0 0.24rem;
      position: relative;
      padding-bottom: 0.24rem;

      &::after {
        content: '';
        width: 100%;
        height: 0.06rem;
        border-radius: 0.32rem;
        background-color: var(--ex-primary-color);
        position: absolute;
        bottom: -0.03rem;
        left: 0;
      }
    }
  }

  .total {
    border-radius: 0.32rem;
    background: var(--ex-bg-color3);
    flex-shrink: 0;
    padding: 0.12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.32rem 0;
    padding: 0.24rem;
    color: var(--ex-white);
    line-height: 1.6;

    .left {
      flex: 1;
      text-align: left;
    }

    .right {
      text-align: left;
    }

    .num {
      color: var(--ex-primary-color);
    }

    .title {
      font-size: 0.3rem;
    }

    .today {
      font-size: 0.26rem;
      color: var(--ex-placeholder-color);
    }
  }

  .list {
    .list-i {
      margin-bottom: 0.32rem;
    }
  }
}
</style>