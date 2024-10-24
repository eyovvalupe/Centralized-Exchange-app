<template>
  <div
    class="stock_description"
    v-show="!loading && list.length > 0"
  >
    <div class="flex flex-row justify-between">
      <div
        :class="list[0].ratio > 0 ? 'up_price' : 'down_price'"
        class="flex flex-col w-[1.78rem] justify-between h-[1.34rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem]"
      >
        <span class="text-[0.24rem] text-[#061023]">{{
          list[0]["symbol"]
        }}</span>
        <span class="stock_price">{{ list[0].amount }}</span>
        <div class="flex flex-row justify-center stock_detail">
          <span
            >{{ list[0].ratio > 0 ? "+" : ""
            }}{{
              ((list[0].ratio || 0) * 100).toFixed(2)
            }}%</span
          >
        </div>
      </div>
      <div
        :class="list[1].ratio > 0 ? 'up_price' : 'down_price'"
        class="flex flex-col w-[1.78rem] justify-between h-[1.34rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem]"
      >
        <span class="text-[0.24rem] text-[#061023]">{{
          list[1]["symbol"]
        }}</span>
        <span class="stock_price">{{ list[1].amount }}</span>
        <div class="flex flex-row justify-center stock_detail">
          <span
            >{{ list[1].ratio > 0 ? "+" : ""
            }}{{
              ((list[1].ratio || 0) * 100).toFixed(2)
            }}%</span
          >
        </div>
      </div>
      <div
        :class="list[2].ratio > 0 ? 'up_price' : 'down_price'"
        class="flex flex-col w-[1.78rem] justify-between h-[1.34rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem]"
      >
        <span class="text-[0.24rem] text-[#061023]">{{
          list[2]["symbol"]
        }}</span>
        <span class="stock_price">{{ list[2].amount }}</span>
        <div class="flex flex-row justify-center stock_detail">
          <span
            >{{ list[2].ratio > 0 ? "+" : ""
            }}{{
              ((list[2].ratio || 0) * 100).toFixed(2)
            }}%</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import store from "@/store";
import { computed, watch } from "vue";

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
    default: []
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
