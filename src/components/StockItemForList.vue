<!-- 股票单个元素 -->
<template>
  <div ref="root" style="width: 100%" :class="props.marketType != 'crypto' ? '' : 'mb-[0.2rem] pr-[0.32rem]'">
    <SwipeCell :class="(props.marketType != 'crypto'
      ? 'stock_item_box'
      : 'stock_item_box_crypto') + `${' stock_item_' + updownStatus}`
      ">
      <div :class="props.marketType == 'crypto'
        ? 'bg-color2 rounded-[0.32rem] pb-3 overflow-hidden'
        : ''
        " @click="goInfo(props.marketType)">
        <div :class="props.marketType != 'crypto' ? 'stock_item' : 'stock_item_crypto'
          ">
          <div class="td5" v-show="props.marketType != 'crypto'">
            <div class="item_name flex items-center gap-1">
              <span v-show="marketType == 'stock'">{{
                props.item.symbol
              }}</span>
              <span v-show="marketType == 'crypto'">{{ props.item.name }}</span>
            </div>
            <div class="item_info" v-show="props.marketType != 'crypto'">
              {{ props.item.name || "--" }}
            </div>
            <div
              class="text-primary text-[0.24rem] w-[0.64rem] h-[0.32rem] rounded-[0.24rem] border mt-[0.16rem] items-center flex justify-center border-primary"
              v-show="props.marketType == 'crypto'">
              20X
            </div>
          </div>
          <div class="td5" v-show="marketType == 'crypto'">
            <div class="item_name flex items-center gap-1">
              {{ props.item.name }}
              <div
                class="text-primary border-[1px] font-normal text-[0.2rem] flex items-center justify-center rounded-[0.16rem] w-[0.64rem] h-[0.32rem] ml-[0.06rem] border-primary">
                20X
              </div>
            </div>
          </div>
          <div :class="props.marketType != 'crypto'
            ? 'td2 spark_line_box'
            : 'td2 ml-[2rem]'
            ">
            <SparkLine v-if="props.item.points && showSparkLine" :style="props.marketType != 'cryto'
              ? 'width: 100%; height: 0.6rem;margin-top:0.16rem;'
              : 'width: 100%; height: 0.54rem;'
              " :points="props.item.points" :ratio="props.item.ratio" />
          </div>
          <div class="td2 td_r" v-show="props.marketType != 'crypto'">
            <div class="item_num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
              {{ props.item.price ? props.item.price : "--" }}
            </div>
            <div class="item_info_box" @click.stop="() => (mode = mode == 3 ? 1 : mode + 1)">
              <div v-if="props.item.ratio !== undefined" class="item_percent"
                :class="[updown === 0 ? '' : updown > 0 ? 'up_bg' : 'down_bg']">
                <span v-if="mode == 1">{{
                  (props.item.ratio || 0) > 0
                    ? "+" + (props.item.ratio || 0)
                    : (props.item.ratio || 0)
                }}%</span>
                <span v-else-if="mode == 2">{{
                  props.item.price || 0 > 0
                    ? "+" + (props.item.price || 0)
                    : (props.item.price || 0)
                }}</span>
                <span v-else>{{ _formatNumber(props.item.volume) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 为了显示自选给了常数，需要更改为后端数据 -->
        <div class="flex items-center justify-between text-[0.32rem] font-bold w-[100%]"
          v-show="props.marketType == 'crypto'">
          <div class="text-center w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{
              item.price || "--"
            }}</span><br />
            <span class="text-[0.22rem] text-color3 font-normal">最新价</span>
          </div>
          <div class="text-center border-color border-x-2 w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{
              item.change || "--"
            }}</span><br />
            <span class="text-[0.22rem] text-color3 font-normal">涨跌</span>
          </div>
          <div class="text-center w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{ item.ratio > 0 ? "+" : ""
            }}{{ (item.ratio || 0) }}%</span><br />
            <span class="text-[0.22rem] text-color3 font-normal">涨跌比</span>
          </div>
        </div>
      </div>

      <template #right v-if="props.deleteItem">
        <div :class="props.marketType != 'crypto'
          ? 'delete_content'
          : 'delete_content_crypto ml-[0.02rem]'
          " @click="removeStock(item)">
          <div class="delete_icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/delete.svg')" alt="">
          </div>
        </div>
      </template>
    </SwipeCell>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import SparkLine from "./SparkLine.vue";
import { ref, computed, watch, onMounted } from "vue";
import router from "@/router";
import { SwipeCell } from "vant";
import store from "@/store";
import { _formatNumber } from "@/utils/index";

const emits = defineEmits(["remove"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },
  scrollDom: {
    // 滚动的父级
    type: String,
    default: ".page",
  },
  deleteItem: {
    // 是否可以滑动删除
    type: Boolean,
    default: false,
  },
  type: {
    //从交易页面侧边栏点击
    type: String,
    default: "",
  },
  handleClick: {
    type: Function,
    default: null,
  },
  marketType: {
    type: String,
  },
  showSparkLine: {
    type: Boolean,
    default: true,
  },
});

const mode = ref(1);
const updown = computed(() => {
  // 1-涨 -1-跌 0-平
  if (props.item.ratio === undefined) return 0;
  return props.item.ratio > 0 ? 1 : -1;
});
const price = computed(() => props.item.price | 0);

const updownStatus = ref("");
watch(price, (newVal, oldVal) => {
  if (newVal && oldVal) {
    if (newVal > oldVal) {
      // 上升
      updownStatus.value = "up";
    } else {
      // 下降
      updownStatus.value = "down";
    }
    setTimeout(() => {
      updownStatus.value = "";
    }, 1000);
  }
});

const goInfo = (type) => {
  if (props.handleClick) return props.handleClick(props.item);
  if (type == "stock") {
    store.commit("setCurrStockItem", props.item);
    router.push({
      name: "tradeInfo",
      query: {
        symbol: props.item.symbol,
        type: "stock",
      },
    });
  }
  if (type == "crypto") {
    store.commit("setCurrConstract", props.item);
    router.push({
      name: "tradeInfo",
      query: {
        symbol: props.item.name,
        type: "constract",
      },
    });
  }
  if (props.type === "trade") {
    const data = [
      {
        name: props.item.name,
        symbol: props.item.symbol,
      },
    ];
    store.commit("setShowLeft", false);
    store.commit("setChooseSymbol", data);
    return;
  }
};

const removeStock = (item) => {
  emits("remove", item);
};
</script>

<style lang="less" scoped>
.stock_item_box {
  width: 100%;
  border-radius: 0.12rem;
  overflow: hidden;


  .delete_content {
    width: 0.8rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-color4);
    border-radius: 0.32rem;

    .delete_icon {
      width: 0.4rem;
      height: 0.4rem;
    }
  }

  .delete_content_crypto {
    width: 0.8rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-color4);
    border-radius: 0.32rem;
    margin-left: -0.32rem;

    .delete_icon {
      font-size: 0.52rem;
      height: 0.52rem;
    }
  }
}

.stock_item_box_crypto {
  width: 100%;
  overflow: hidden;
  padding-left: 0.32rem;

  .delete_content {
    width: 0.78rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-border-color2);
    border-top-right-radius: 0.32rem;
    border-bottom-right-radius: 0.32rem;
  }

  .delete_content_crypto {
    width: 0.78rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-border-color2);
    border-radius: 0.32rem;
    // margin-left: -0.32rem;
  }
}

.active_symbol {
  background-color: var(--ex-bg-color3);
}

.stock_item {
  display: flex;
  align-items: center;
  height: 1.62rem;
  padding: 0 0.28rem;
  position: relative;

  .td5 {
    flex: 5;
    flex-shrink: 0;
    overflow: hidden;

    .item_name {
      font-size: 0.32rem;
      color: var(--ex-text-color);
      line-height: 0.432rem;
      font-weight: 400;
      margin-bottom: 0.2rem;
    }

    .item_info {
      font-size: 0.24rem;
      line-height: 0.332rem;
      color: var(--ex-text-color3);
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      padding-right: 0.4rem;
    }
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;
    height: 1.12rem;

    .item_num {
      font-size: 0.32rem;
      font-weight: 600;
      line-height: 0.432rem;
      color: var(--ex-text-color2);
    }

    .item_info_box {
      height: 0.48rem;
      display: flex;
      justify-content: flex-end;

      .item_percent {
        width: 1.14rem;
        height: 0.48rem;
        text-align: center;
        line-height: 0.32rem;
        font-size: 0.28rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        color: var(--ex-white);
        border-radius: 0.12rem;
        margin-top: 0.18rem;
      }

      .nodata_percent {
        height: 0.48rem;
        background-color: var(--ex-text-color2);
      }
    }
  }

  .td_r {
    text-align: right;
  }

  .spark_line_box {
    padding-right: 0.4rem;
    padding-left: 0.2rem;
  }
}

.stock_item_crypto {
  display: flex;
  align-items: center;
  height: 1rem;
  padding: 0 0.32rem;
  position: relative;
  margin-bottom: 0.1rem;

  ::after {
    content: "";
    width: calc(100% - 0.6rem);
    position: absolute;
    bottom: 0;
    left: 0.3rem;
    height: 1px;
    background-color: var(--ex-bg-color3);
  }

  .td5 {
    flex: 5;
    flex-shrink: 0;
    overflow: hidden;

    .item_name {
      font-size: 0.32rem;
      color: var(--ex-text-color);
      line-height: 0.46rem;
      font-weight: 600;
      margin-bottom: 0.06rem;
    }

    .item_info {
      font-size: 0.28rem;
      line-height: 0.36rem;
      color: var(--ex-text-color3);
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      padding-right: 0.4rem;
    }
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;

    .item_num {
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem;
      color: var(--ex-text-color2);
    }

    .item_info_box {
      margin-top: 0.1rem;

      .item_percent {
        text-align: center;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.24rem;
        display: inline-block;
        font-weight: 600;
        color: var(--ex-white);
        border-radius: 0.12rem;
      }

      .nodata_percent {
        background-color: var(--ex-text-color2);
      }
    }
  }

  .td_r {
    text-align: right;
  }

  .spark_line_box {
    padding-right: 0.4rem;
    padding-left: 0.2rem;
  }
}

.stock_item_up {
  background-color: rgba(24, 183, 98, 0.12);

  .stock_item {
    border-bottom: 1px solid rgba(24, 183, 98, 0.12);
  }
}

.stock_item_down {
  background-color: rgba(250, 100, 102, 0.12);

  .stock_item {
    border-bottom: 1px solid rgba(250, 100, 102, 0.12);
  }
}

.delete_icon {
  width: 0.36rem;
  height: 0.34rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
