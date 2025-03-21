<!-- 自选推荐 -->
<template>
  <div class="recommend_list">
    <Loading v-show="props.loading" />
    <div class="list_box" v-if="props.list.length && !props.loading">
      <template v-for="(item, i) in props.list" :key="i">
        <div class="list_item" @click="goInfo(item)" v-if="showLen == 0 || i < showLen">
          <div class="symbol">{{ item.symbol }}</div>
          <div class="name">{{ item.name || "--" }}</div>
          <div class="price">{{ getRealtime(item.symbol, 'price') }}</div>
          <div class="percent" :class="[getRealtime(item.symbol, 'ratio', 0) >= 0 ? 'up' : 'down']">
            {{
              getRealtime(item.symbol, 'ratio', 0) > 0
                ? "+" + getRealtime(item.symbol, 'ratio', 0)
                : getRealtime(item.symbol, 'ratio', 0)
            }}%
          </div>

          <div class="sparkLine">
            <SparkLine v-if="getRealtime(item.symbol, 'points')" style="width: 100%; height: 0.45rem"
              :points="getRealtime(item.symbol, 'points')" :ratio="getRealtime(item.symbol, 'ratio', 0)" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import ciper from "@/utils/ciper.js"
import SparkLine from "@/components/SparkLine.vue";
import Loading from "@/components/Loaidng.vue";
import { ref, computed } from "vue";
import { Button, showToast, showLoadingToast, closeToast } from "vant";
import store from "@/store";
import router from "@/router";
import { _add, _del } from "@/api/api";
import eventBus from "@/utils/eventBus";

const getRealtime = (symbol, k, _default = '') => {
  for (let i = 0; i < store.state.realtimeData.length; i++) {
    if (store.state.realtimeData[i].symbol == symbol) {
      return store.state.realtimeData[i][k] || _default
    }
  }
  return _default
}
const emits = defineEmits(["change"]);
const token = computed(() => store.state.token || "");

const props = defineProps({

  loading: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array,
    default: () => [],
  },
  newState: {
    type: Boolean,
    default: true,
  },
  flag: {
    type: Boolean,
    default: true,
  },
  showLen: {
    type: Number,
    default: 0
  }
});

const loading = ref(false);
const disabled = computed(
  () => !checkedList.value.some((item) => item == true)
);

const goInfo = (item) => {
  store.commit("setCurrStockItem", item);
  setTimeout(() => {
    router.push({
      name: "tradeInfo",
      query: {
        symbol: ciper.encrypt(item.symbol),
        type: "stock",
      },
    });
  }, 100);
};

const collectLoading = ref(false)
const reqMap = {
  0: _add,
  1: _del
}

const collect = (item) => {
  if (!token.value) {
    store.commit("setIsLoginOpen", true);
    eventBus.on("loginSuccess", () => {
      eventBus.off("loginSuccess");
    });
  } else {
    if (collectLoading.value) return;
    collectLoading.value = true;
    if (!reqMap[item.watchlist || 0]) return (collectLoading.value = false);
    showLoadingToast({
      duration: 0,
      loadingType: "circular",
    });
    reqMap[item.watchlist || 0]({
      symbol: item.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            showToast(item.watchlist ? "添加成功" : "移除成功");
          }, 300);
          const i = props.list.find((a) => a.symbol == item.symbol);
          if (i) {
            i.watchlist = i.watchlist == 1 ? 0 : 1;
            emits('change', props.list)
          }
        }
      })
      .finally(() => {
        closeToast();
        collectLoading.value = false;
      });
  }
}
</script>

<style lang="less" scoped>
.recommend_list {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .list_box {
    flex: 1;
    overflow-y: auto;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-wrap: wrap;

    .list_item {
      position: relative;
      background-color: var(--ex-bg-color2);
      height: 1.998rem;
      width: 3.36rem;
      border-radius: 0.32rem;
      margin-bottom: 0.15rem;
      position: relative;
      padding: 0.15rem;
      overflow: hidden;


      .symbol {
        font-size: 0.32rem;
        line-height: 0.432rem;
        color: var(--ex-text-color);
      }

      .name {
        font-size: 0.24rem;
        color: var(--ex-text-color3);
        line-height: 0.312rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0.1rem 0;
      }

      .price {
        color: var(--ex-text-color);
        font-weight: 600;
        font-size: 0.32rem;
        line-height: 0.432rem;
        margin-bottom: 0.08rem;
      }

      .percent {
        font-size: 0.28rem;
        line-height: 0.32rem;
        font-weight: 600;
      }

      .sparkLine {
        position: absolute;
        width: 1.6rem;
        height: 0.5rem;
        right: 0;
        bottom: 0.25rem;
      }
    }
  }
}
</style>
