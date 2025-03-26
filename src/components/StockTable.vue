<!-- 股票列表样式架子 -->
<template>
  <div class="stock_table">
    <Loading :type="'circular'" v-show="!props.list.length && props.loading" />
    <div v-if="list.length" v-for="(item, i) in props.list" class="tr" :class="page == 'trade' &&
      (type == 'stock' && item.symbol == currStockItem.symbol || type == 'future' && item.name == currConstract.name)
      ? 'current_item_effect'
      : ''
      " :key="item.symbol" v-show="props.marketType == 'all' || props.marketType == item.type">
      <StockItem :marketType="props.marketType" :theme="theme" :handleClick="props.handleClick" :hideMarketTag="props.hideMarketTag"
        :deleteItem="props.deleteItem" :showSparkLine="showSparkLine" :type="props.type" @remove="remove"
        :scrollDom="props.scrollDom" :item=" from ? {...item, type: from} : item" :page="props.page" :showIcon="props.showIcon"/>
    </div>
    <NoData style="margin-top: 1rem;" v-if="!props.loading && !props.list.length" />
  </div>
</template>

<script setup>
import Loading from "./Loaidng.vue";
import StockItem from "./StockItem.vue";
import NoData from "./NoData.vue";
import { computed, ref } from "vue";
import store from "@/store";

const currStockItem = computed(() => store.state.currStockItem)
const currConstract = computed(() => store.state.currConstract)

const emits = defineEmits(["remove"]);
const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  marketType: {
    type: String,
    default: "all",
  },
  list: {
    type: Array,
    default: () => [],
  },
  scrollDom: {
    type: String,
    default: ".page",
  },
  deleteItem: {
    // 是否可以滑动删除
    type: Boolean,
    default: false,
  },
  theme: {
    // 空 默认 classic 经典
    type: String,
    default: "",
  },
  type: {
    //从交易页面侧边栏点击
    type: String,
    default: "",
  },
  handleClick: {
    // 元素点击事件
    type: Function,
    default: null,
  },
  showSparkLine: {
    type: Boolean,
    default: true,
  },
  page: {
    type: String,
    default: "",
  },
  showIcon: Boolean,
  hideMarketTag: Boolean,
  from: {
    type: String,
    default: ''
  }
});

const remove = (item) => {
  emits("remove", item);
};
</script>

<style lang="less" scoped>
.stock_table {
  padding: 0;
  width: 100%;

  .current_item_effect {
    // background-color: var(--ex-bg-color);
    box-shadow: 0px 4px 10px 0px rgba(6, 16, 35, 0.1);
  }

  .tr {
    display: flex;
    align-items: center;

    .td {
      flex: 1;
    }

    .td5 {
      flex: 5;
    }

    .td2 {
      flex: 2;
    }
  }

  .th {
    padding: 0 0.3rem 0.16rem 0.3rem;
    height: 0.64rem;
    color: var(--ex-text-color3);
    font-size: 0.28rem;
    font-weight: 400;
    // border-bottom: 1px solid var(--ex-border-color);

    .td_r {
      text-align: right;
    }
  }
}
</style>
