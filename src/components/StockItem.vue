<!-- 股票单个元素 -->
<template>
  <div ref="root" class="w-full" :class="[props.page == 'home' ? '' : 'px-[0.28rem]']">
    <SwipeCell :class="['stock_item_box']" @touchstart.start="" @touchmove.stop="" @touchend.stop="">
      <div class="stock_item_bg"
        :class="[`${' stock_item_' + updownStatus}`, props.page == 'home' ? 'stock_item_home' : '']"
        @click="goInfo(props.item.type)">
        <div :class="['stock_item', 'mask-btn']">
          <!-- <div class="size-[0.96rem] rounded-full bg-white mr-[0.18rem] flex justify-center items-center"
            v-if="showIcon">
            <span class="text-[0.56rem] font-semibold text-color--bg-light" v-if="item.type == 'stock'">{{
              props.item.symbol[0] }}</span>
            <span class="text-[0.56rem] font-semibold text-color--bg-light" v-else>{{ props.item.name[0] }}</span>
          </div> -->
          <div class="size-[0.96rem] mr-[0.18rem] flex justify-center items-center"
            v-if="showIcon">
            <CryptoIcon :name="item.name.split('/')[0]" />
          </div>
          <div class="td5" :class="{ 'td5--ac': showIcon }">
            <div class="item_name flex items-center gap-1 mb-[0.2rem]">
              <span class="truncate" v-if="item.type != 'stock'">{{
                props.item.name
              }}</span>
              <span class="truncate" v-else>{{ props.item.symbol }}</span>
              <div v-if="props.page == 'market' && item.type == 'stock'"
                :class="`${marketStyle[props.item.type]
                  } font-normal whitespace-nowrap text-[0.22rem] ml-[0.06rem] flex items-center justify-center rounded-[0.08rem] px-[0.08rem] h-[0.3rem] `">
                {{
                  t("market.market_optional_stock")
                }}
              </div>
            </div>
            <div class="item_info" v-show="props.item.type == 'stock'">
              {{ props.item.name || "--" }}
            </div>


            <div v-if="item.type != 'stock'" class=" flex items-center">
              <span
                :class="`${marketStyle[props.item.type]
                  } font-normal whitespace-nowrap text-[0.22rem] rounded-[0.08rem] px-[0.12rem] h-[0.32rem]  flex items-center justify-center`">
                {{
                  item.type == "stock"
                    ? t("market.market_optional_stock")
                    : item.type == "crypto"
                      ? t("market.market_optional_contract")
                      : item.type == "forex"
                        ? t("market.market_optional_forex")
                        : item.type == "blocktrade"
                          ? t("market.market_optional_blocktrade")
                          : ""
                }}
              </span>
            </div>

          </div>
          <div :class="['td2 spark_line_box']" v-if="showSparkLine">
            <SparkLine :style="['width: 100%; height: 0.6rem;']" v-if="props.item.points" :points="props.item.points"
              :ratio="props.item.ratio" />
          </div>
          <div class="td2 td_r">
            <div class="item_num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
              {{ props.item.price ? props.item.price : "--" }}
            </div>
            <div class="item_info_box" @click.stop="() => (mode = mode == 3 ? 1 : mode + 1)">
              <div v-if="props.item.ratio !== undefined" class="item_percent"
                :class="[updown === 0 ? '' : updown > 0 ? 'up_bg' : 'down_bg']">
                <span v-if="mode == 1">{{
                  (props.item.ratio || 0) > 0
                    ? "+" + (props.item.ratio || 0)
                    : props.item.ratio || 0
                }}%</span>
                <span v-else-if="mode == 2">{{
                  props.item.price || 0 > 0
                    ? "+" + (props.item.price || 0).toFixed(2)
                    : (props.item.price || 0).toFixed(2)
                }}</span>
                <span v-else>{{ _formatNumber(props.item.volume) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #right v-if="props.deleteItem">
        <div :class="['delete_content']" @click="removeStock(item)">
          <div class="delete_icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/delete.svg')" alt="" />
          </div>
        </div>
      </template>
    </SwipeCell>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import SparkLine from "./SparkLine.vue";
import { ref, computed, watch } from "vue";
import router from "@/router";
import { SwipeCell } from "vant";
import store from "@/store";
import { _formatNumber } from "@/utils/index";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const market = {
  stock: "股票",
  crypto: "合约",
  forex: "外汇",
};
const marketStyle = {
  stock: "tag-stock",
  crypto: "tag-crypto",
  forex: "tag-forex",
  blocktrade: "tag-blocktrade",
};
const emits = defineEmits(["remove"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },
  scrollBox: {
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
  page: {
    type: String,
    default: "",
  },
  showIcon: Boolean
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
    store.commit("setCurrStock", props.item);
    router.push({
      name: "market_info",
      query: {
        symbol: props.item.symbol,
        type: "stock",
      },
    });
  }
  if (type == "spot") {
    store.commit("setCurrConstract", props.item);
    router.push({
      name: "market_info",
      query: {
        symbol: props.item.name,
        type: "constract",
        tradeType: 'spot'
      },
    });
  }
  if (type == "crypto") {
    store.commit("setCurrConstract", props.item);
    router.push({
      name: "market_info",
      query: {
        symbol: props.item.name,
        type: "constract",
        tradeType: 'constract'
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

.active_symbol {
  background-color: var(--ex-bg-color3);
}

.stock_item {
  display: flex;
  align-items: center;
  height: 1.62rem;
  // padding: 0 0.3rem;
  position: relative;
  // background-color: var(--ex-bg-white2);
  // border-radius: 0.4rem;
  // margin-top: 0.2rem;
  border-bottom: 1px solid var(--ex-bg-white2);

  .td5 {
    flex-shrink: 0;
    // width: 3rem;
    flex: 2.5;

    .item_name {
      font-size: 0.32rem;
      color: var(--ex-text-color);
      line-height: 0.32rem;
      font-weight: 600;
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

  .td5--ac {
    // width: 2.3rem;
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
      margin-top: 0.18rem;

      .item_percent {
        text-align: center;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.24rem;
        display: inline-block;
        font-weight: 400;
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
    padding: 0 0.1rem;
  }
}

.stock_item_home {
  // background-color: var(--ex-bg-color2);
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
    // flex: 5;
    flex-shrink: 0;
    width: 3.6rem;
    // overflow: hidden;

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

.stock_item_bg {
  // border-radius: 0.32rem;
  transition: all ease-in .2s;
  position: relative;
}

.stock_item_bg:active {
  background-color: var(--ex-bg-color3);
}

.stock_item_up {
  background-color: rgb(var(--ex-up-color-rgb) / 0.12);
  &::after {
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    right: -0.32rem;
    background-color: rgb(var(--ex-up-color-rgb) / 0.12);
  }
  &::before {
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    left: -0.32rem;
    background-color: rgb(var(--ex-up-color-rgb) / 0.12);
  }

  .stock_item {
    border-bottom: 1px solid rgb(var(--ex-up-color-rgb) / 0.12);
  }
}

.stock_item_down {
  background-color: rgb(var(--ex-down-color-rgb) / 0.12);
  &::after {
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    right: -0.32rem;
    background-color: rgb(var(--ex-down-color-rgb) / 0.12);
  }
  &::before {
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    left: -0.32rem;
    background-color: rgb(var(--ex-down-color-rgb) / 0.12);
  }

  .stock_item {
    border-bottom: 1px solid rgb(var(--ex-down-color-rgb) / 0.12);
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
