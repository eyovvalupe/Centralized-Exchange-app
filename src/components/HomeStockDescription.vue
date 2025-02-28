<template>
  <div class="stock_description" v-show="!loading && list.length > 0">
    <div class="flex flex-row">
      <template v-for="(item, i) in list" :key="i">
        <div v-if="i < 3" :class="item.ratio > 0 ? 'up_price' : 'down_price'"
          class="flex flex-col w-[1.78rem] justify-between h-[1.34rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem] mx-[0.06rem]"
          style="overflow-x: hidden;" @click="goInfo(item)">
          <span class="text-[0.24rem] text-color" style="max-width: 1.98rem;">{{
            item["symbol"].length > 8 ? item["symbol"].substring(0, 8) + '...' : item["symbol"]
            }}</span>
          <span class="stock_price">{{ item.amount }}</span>
          <div class="flex flex-row justify-center stock_detail">
            <span>{{ item.ratio > 0 ? "+" : ""
            }}{{
                (item.ratio || 0)
              }}%</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

import store from "@/store";
const router = useRouter()

const props = defineProps({
  region: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    default: {},
  },
  loading: {
    type: Boolean,
    default: true,
  },
  active: {
    type: String,
    default: 0,
  },
  list: {
    type: Array,
    default: () => []
  }
});
const goInfo = (item) => {
  store.commit("setCurrStockItem", item);
  setTimeout(() => {
    router.push({
      name: "tradeInfo",
      query: {
        symbol: item.symbol,
        type: "stock",
      },
    });
  }, 100)
}
</script>

<style lang="less" scoped>
.stock_description {

  .up_price {
    background-image: linear-gradient(to bottom, var(--ex-bg-color), rgb(var(--ex-up-color-rgb) / 0.1));

    .stock_price {
      font-size: 0.28rem;
      font-weight: 600;
      color: var(--ex-up-color);
    }

    .stock_detail {
      width: 100%;
      font-size: 0.22rem;
      font-weight: 400;
      color: var(--ex-up-color);
    }
  }

  .down_price {
    background-image: linear-gradient(to bottom, var(--ex-bg-color), rgb(var(--ex-down-color-rgb) / 0.1));

    .stock_price {
      font-size: 0.28rem;
      font-weight: 600;
      color: var(--ex-down-color);
    }

    .stock_detail {
      width: 100%;
      font-size: 0.22rem;
      font-weight: 400;
      color: var(--ex-down-color);
    }
  }
}
</style>
