<!-- 自选推荐 -->
<template>
  <div class="recommend_list">
    <Loading v-show="!props.list.length && props.loading" />
    <div class="list_box">
      <div class="list_item" @click="changeCheck(i)" :class="'list_item_active'" v-for="(item, i) in props.list"
        :key="i">
        <div class="symbol">{{ item.symbol }}</div>
        <div class="name">{{ item.name || "--" }}</div>
        <div class="price">{{ item.price ? item.price : "--" }}</div>
        <div class="percent" :class="[updown(item) === 0 ? '' : updown(item) > 0 ? 'up' : 'down']">
          {{
            (item.ratio || 0) > 0
              ? "+" + (item.ratio || 0)
              : (item.ratio || 0)
          }}%
        </div>

        <div class="sparkLine">
          <SparkLine v-if="item.points" style="width: 100%; height: 0.45rem" :points="item.points"
            :ratio="item.ratio" />
        </div>

        <div class="check_ticket" v-if="checkedList[i]">
          <img :src="getStaticImgUrl('/static/img/market/checkTicket.svg')" alt="">
        </div>

        <div class="uncheck_ticket" v-else>
          <img :src="getStaticImgUrl('/static/img/market/uncheckTicket.svg')" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import SparkLine from "./SparkLine.vue";
import Loading from "./Loaidng.vue";
import { ref, computed, watch } from "vue";
import { Button, showToast } from "vant";
import { _add } from "@/api/api";
import store from "@/store";
import router from "@/router";

const emits = defineEmits(["init", "change"]);
const token = computed(() => store.state.token || "");

const props = defineProps({
  keyStr: {
    type: String,
    default: "",
  },
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
});

const updown = (item) => {
  if (item.ratio === undefined) return 0;
  return item.ratio > 0 ? 1 : -1;
};

const emitsKeys = () => {
  const keys = [];

  checkedList.value.map((item, i) => {
    if (item) {
      keys.push(props.list[i].symbol);
    }
  });
  emits("change", keys);
};

const checkedList = ref([]);
try {
  checkedList.value = props.list.map((item) => true);
  store.commit("setCheckState", true);
} catch {
  checkedList.value = [];
}
emitsKeys();

watch(
  () => props.newState,
  (newValue) => {
    try {
      if (props.flag == true)
        checkedList.value = props.list.map(() => newValue);
      else checkedList.value = props.list.map(() => !newValue);

      if (props.keyStr == "stock")
        store.commit("setCheckStockState", checkedList.value);
      if (props.keyStr == "recommend")
        store.commit("setCheckCryptoState", checkedList.value);
    } catch {
      checkedList.value = [];
    }
    emitsKeys();
  }
);

const checkStockList = computed(() => store.state.checkStockList);
const checkCryptoList = computed(() => store.state.checkCryptoList);
var all = computed(
  () =>
    checkStockList.value.every((item) => item === true) &&
    checkCryptoList.value.every((item) => item === true)
);
const changeCheck = (i) => {
  checkedList.value[i] = !checkedList.value[i];
  if (props.keyStr == "stock")
    store.commit("setCheckStockState", checkedList.value);
  if (props.keyStr == "recommend")
    store.commit("setCheckCryptoState", checkedList.value);
  store.commit("setCheckState", all.value);
  emitsKeys();
};

const loading = ref(false);
const disabled = computed(
  () => !checkedList.value.some((item) => item == true)
);
</script>

<style lang="less" scoped>
.recommend_list {
  padding: 0 0.036rem;
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
      background-color: #ffffff;
      height: 1.998rem;
      width: 3.36rem;
      border-radius: 0.2rem;
      margin-bottom: 0.15rem;
      position: relative;
      padding: 0.2rem;
      overflow: hidden;

      .symbol {
        font-size: 0.32rem;
        color: #061023;
      }

      .name {
        font-size: 0.24rem;
        color: #8f92a1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0.1rem 0;
      }

      .price {
        color: #061023;
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
        right: 0.1rem;
        bottom: 0.1rem;
      }
    }

    .list_item_active {
      position: relative;

      .check_ticket {
        top: 0.15rem;
        right: 0.15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.4rem;
        height: 0.4rem;
        position: absolute;
        transition: background-color linear 2s;
      }

      .uncheck_ticket {
        top: 0.15rem;
        right: 0.15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.4rem;
        height: 0.4rem;
        background-color: white;
        position: absolute;
        transition: background-color linear 2s;
      }
    }
  }

  .submit {
    margin: 0.2rem 0;
  }
}
</style>
