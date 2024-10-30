<template>
  <div
    class="stock_description"
    v-show="!loading && list.length > 0"
  >
    <div class="flex flex-row justify-between">
      <div
        v-for="(item, i) in list"
        :key="i"
        :class="item.ratio > 0 ? 'up_price' : 'down_price'"
        class="flex flex-col w-[1.78rem] justify-between h-[1.34rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem]"
        style="overflow-x: hidden;"
      >
        <span class="text-[0.24rem] text-[#061023]" style="max-width: 1.98rem;">{{
          item["symbol"].length > 8 ? item["symbol"].substring(0, 8) + '...' : item["symbol"]
        }}</span>
        <span class="stock_price">{{ item.amount }}</span>
        <div class="flex flex-row justify-center stock_detail">
          <span
            >{{ item.ratio > 0 ? "+" : ""
            }}{{
              ((item.ratio || 0) * 100).toFixed(2)
            }}%</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fixLittleNum } from '@/utils/fixLittleNum';

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
    default: [{
      symbol: 'SHELTER',
      amount: 1263060,
      ratio: 0.0909
    },
    {
      symbol: 'DHRUV',
      amount: 128101.8,
      ratio: 0.0472
    },
    {
      symbol: 'ECOBOAR',
      amount: 7128.87,
      ratio: -0.0218
    }]
  }
});
</script>

<style lang="less" scoped>
.stock_description {

  .up_price {
    background-image: linear-gradient(to bottom, #ffffff, #e4f6ed);

    .stock_price {
      font-size: 0.28rem;
      font-weight: 600;
      color: #18b762;
    }

    .stock_detail {
      width: 100%;
      font-size: 0.22rem;
      font-weight: 400;
      color: #18b762;
    }
  }

  .down_price {
    background-image: linear-gradient(to bottom, #ffffff, #f4e7e5);

    .stock_price {
      font-size: 0.28rem;
      font-weight: 600;
      color: #e8503a;
    }

    .stock_detail {
      width: 100%;
      font-size: 0.22rem;
      font-weight: 400;
      color: #e8503a;
    }
  }
}
</style>
