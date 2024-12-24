<!-- 股票单个元素 -->
<template>
  <div ref="root" style="width: 100%">
    <SwipeCell
      :class="['stock_item_box']"
      @touchstart.start=""
      @touchmove.stop=""
      @touchend.stop=""
    >
      <div
        class="stock_item_bg"
        :class="[`${' stock_item_' + updownStatus}`]"
        @click="goInfo(props.item.type)"
      >
        <div :class="['stock_item']">
          <div class="td5">
            <div class="item_name flex items-center gap-1 mb-[0.1rem]">
              <span class="truncate" v-if="item.type != 'stock'">{{
                props.item.name
              }}</span>
              <span class="truncate" v-else>{{ props.item.symbol }}</span>
              <div
                v-if="props.page == 'market'"
                :class="`${
                  marketStyle[props.item.type]
                } font-normal whitespace-nowrap text-[0.22rem] ml-[0.06rem] flex items-center justify-center rounded-[0.08rem] px-[0.05rem] h-[0.3rem] pt-[0.032rem]`"
              >
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
              </div>
            </div>
            <div class="item_info" v-show="props.item.type == 'stock'">
              {{ props.item.name || "--" }}
            </div>
            <div
              v-if="props.page == 'market'"
              class="text-[#0A54F9] text-[0.24rem] px-[0.1rem] h-[0.32rem] rounded-[0.24rem] border mt-[0.16rem] items-center flex justify-center border-[#0A54F9] pt-[0.025rem]"
              style="width: max-content"
              v-show="props.item.type != 'stock'"
            >
              {{ props.item.lever }}X
            </div>
            <div
              v-if="props.page != 'market' && item.type != 'stock'"
              style="width: max-content"
              :class="`${
                marketStyle[props.item.type]
              } font-normal whitespace-nowrap mt-[0.1rem] text-[0.22rem] flex items-center justify-center rounded-[0.08rem] px-[0.05rem] h-[0.3rem] pt-[0.032rem]`"
            >
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
            </div>
          </div>
          <div :class="['td2 spark_line_box']" v-if="showSparkLine">
            <SparkLine
              :style="['width: 100%; height: 0.6rem;']"
              v-if="props.item.points"
              :points="props.item.points"
              :ratio="props.item.ratio"
            />
          </div>
          <div class="td2 td_r">
            <div
              class="item_num"
              :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']"
            >
              {{ props.item.price ? props.item.price : "--" }}
            </div>
            <div
              class="item_info_box"
              @click.stop="() => (mode = mode == 3 ? 1 : mode + 1)"
            >
              <div
                v-if="props.item.ratio !== undefined"
                class="item_percent"
                :class="[updown === 0 ? '' : updown > 0 ? 'up_bg' : 'down_bg']"
              >
                <span v-if="mode == 1"
                  >{{
                    (props.item.ratio || 0) > 0
                      ? "+" + (props.item.ratio || 0)
                      : props.item.ratio || 0
                  }}%</span
                >
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
            <img :src="getStaticImgUrl('/static/icons/delete.svg')" alt="" />
          </div>
        </div>
      </template>
    </SwipeCell>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import SparkLine from "./SparkLine.vue";
import { ref, computed, watch, onMounted } from "vue";
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
  stock: "text-[#014CFA] bg-[#014cfa1a] ",
  crypto: "text-[#0099d1] bg-[#0099d11a] ",
  forex: "text-[#18B762] bg-[#18b7621a] ",
  blocktrade: "text-[#6c6cea] bg-[#6c6cea1a] ",
};
const emits = defineEmits(["remove"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
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
  if (type == "crypto") {
    store.commit("setCurrConstract", props.item);
    router.push({
      name: "market_info",
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

  &:active,
  &:hover {
    background-color: #f2f3f7;
  }

  .delete_content {
    width: 0.78rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d0d8e2;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;

    .delete_icon {
      width: 0.4rem;
      height: 0.4rem;
    }
  }

  .delete_content_crypto {
    width: 0.78rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d0d8e2;
    border-radius: 0.32rem;
    margin-left: -0.32rem;

    .delete_icon {
      font-size: 0.52rem;
      height: 0.52rem;
    }
  }
}

.active_symbol {
  background-color: #f2f3f7;
}

.stock_item {
  display: flex;
  align-items: center;
  height: 1.24rem;
  padding: 0 0.3rem;
  position: relative;

  &::after {
    content: "";
    width: calc(100% - 0.6rem);
    position: absolute;
    bottom: 0;
    left: 0.3rem;
    height: 1px;
    background-color: #eff3f8;
  }

  .td5 {
    // flex: 5;
    flex-shrink: 0;
    width: 3.6rem;
    // overflow: hidden;

    .item_name {
      font-size: 0.32rem;
      color: #061023;
      line-height: 0.32rem;
      font-weight: 600;
    }

    .item_info {
      font-size: 0.24rem;
      line-height: 0.332rem;
      color: #8f92a1;
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
      color: #6c7b90;
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
        color: #fff;
        border-radius: 0.12rem;
      }

      .nodata_percent {
        background-color: #6c7b90;
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
    background-color: #eff3f8;
  }

  .td5 {
    // flex: 5;
    flex-shrink: 0;
    width: 3.6rem;
    // overflow: hidden;

    .item_name {
      font-size: 0.32rem;
      color: #061023;
      line-height: 0.46rem;
      font-weight: 600;
      margin-bottom: 0.06rem;
    }

    .item_info {
      font-size: 0.28rem;
      line-height: 0.36rem;
      color: #8f92a1;
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
      color: #6c7b90;
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
        color: #fff;
        border-radius: 0.12rem;
      }

      .nodata_percent {
        background-color: #6c7b90;
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

.stock_item_bg:active {
  background-color: #eef0f7;
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
