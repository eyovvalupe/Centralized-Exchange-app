<!-- 股票单个元素 -->
<template>
  <div
    ref="root"
    style="width: 100%"
    :class="props.marketType != 'crypto' ? '' : 'mb-[0.14rem] px-[0.32rem]'"
  >
    <SwipeCell
      :class="
        (props.marketType != 'crypto'
          ? 'stock_item_box'
          : 'stock_item_box_crypto') + `${' stock_item_' + updownStatus}`
      "
    >
      <div
        :class="
          props.marketType == 'crypto'
            ? 'bg-[#F5F7FC] rounded-[0.32rem] pb-3 overflow-hidden '
            : ''
        "
        @click="goInfo"
      >
        <div
          :class="
            props.marketType != 'crypto' ? 'stock_item' : 'stock_item_crypto'
          "
        >
          <div class="td5" v-show="props.marketType != 'crypto'">
            <div class="item_name flex items-center gap-1">
              <span v-show="item.type == 'stock'">{{ props.item.symbol }}</span>
              <span v-show="item.type == 'crypto'">{{ props.item.name }}</span>
              <div
                :class="`${
                  marketStyle[props.item.type]
                } font-normal text-[0.22rem] ml-[0.06rem] flex items-center justify-center rounded-[0.08rem] w-[0.6rem] h-[0.3rem] `"
              >
                {{ market[props.item.type] }}
              </div> 
            </div>
            <div class="item_info" v-show="props.item.type != 'crypto'">
              {{ props.item.name || "--" }}
            </div>
            <div
              class="text-[#0A54F9] text-[0.24rem] w-[0.64rem] h-[0.32rem] rounded-[0.24rem] border mt-[0.16rem] items-center flex justify-center border-[#0A54F9]"
              v-show="props.item.type == 'crypto'"
            >
              20X
            </div>
          </div>
          <div class="td5" v-show="marketType == 'crypto'">
            <div class="item_name flex items-center gap-1">
              {{ props.item.name }}
              <div
                class="text-[#0A54F9] border-[1px] font-normal text-[0.2rem] flex items-center justify-center rounded-[0.16rem] w-[0.64rem] h-[0.32rem] ml-[0.06rem] border-[#0A54F9]"
              >
                20X
              </div>
            </div>
          </div>
          <div
            :class="
              props.marketType != 'crypto'
                ? 'td2 spark_line_box'
                : 'td2 ml-[2rem]'
            "
          >
            <SparkLine
              v-if="props.item.points && showSparkLine"
              :style="
                props.marketType != 'cryto'
                  ? 'width: 100%; height: 0.6rem;'
                  : 'width: 100%; height: 0.54rem;'
              "
              :points="props.item.points"
              :ratio="props.item.ratio"
            />
          </div>
          <div class="td2 td_r" v-show="props.marketType != 'crypto'">
            <div
              class="item_num"
              :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']"
            >
              {{ props.item.price ? props.item.price.toFixed(3) : "--" }}
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
                    ((props.item.ratio || 0) * 100).toFixed(2) > 0
                      ? "+" + ((props.item.ratio || 0) * 100).toFixed(2)
                      : ((props.item.ratio || 0) * 100).toFixed(2)
                  }}%</span
                >
                <span v-else-if="mode == 2">{{
                  (props.item.price || 0).toFixed(2) > 0
                    ? "+" + (props.item.price || 0).toFixed(2)
                    : (props.item.price || 0).toFixed(2)
                }}</span>
                <span v-else>{{ _formatNumber(props.item.volume) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 为了显示自选给了常数，需要更改为后端数据 -->
        <div
          class="flex items-center justify-between text-[0.32rem] font-bold w-[100%]"
          v-show="props.marketType == 'crypto'"
        >
          <div class="text-center w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{
              item.price || "--"
            }}</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal"
              >最新价</span
            >
          </div>
          <div class="text-center border-x-[#eff3f8] border-x-2 w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{
              item.change || "--"
            }}</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal">涨跌</span>
          </div>
          <div class="text-center w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'"
              >{{ item.ratio > 0 ? "+" : ""
              }}{{ ((item.ratio || 0) * 100).toFixed(2) }}%</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal"
              >涨跌比</span
            >
          </div>
        </div>
      </div>

      <template #right v-if="props.deleteItem">
        <div
          :class="
            props.marketType != 'crypto'
              ? 'delete_content'
              : 'delete_content_crypto'
          "
          @click="removeStock(item)"
        >
          <div class="delete_icon">
            <img src="/static/img/assets/delete.svg" alt="🚮" />
          </div>
        </div>
      </template>
    </SwipeCell>
  </div>
</template>

<script setup>
import SparkLine from "./SparkLine.vue";
import { ref, computed, watch, onMounted } from "vue";
import router from "@/router";
import { SwipeCell } from "vant";
import store from "@/store";
import { _formatNumber } from "@/utils/index";

onMounted(() => console.log("=========>", props.item.type));

const market = {
  stock: "股票",
  crypto: "合约",
  forex: "外汇",
};
const marketStyle = {
  stock: "text-[#014CFA] bg-[rgba(1,76,250,0.1)] ",
  crypto: "text-[#FFAF2A] bg-[rgba(255,175,42,0.1)] ",
  forex: "text-[#18B762] bg-[rgba(24,183,98,0.1)] ",
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
  showSparkLine:{
    type:Boolean,
    default:true
  }
});
console.log(props.item)

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

const goInfo = () => {
  if (props.handleClick) return props.handleClick(props.item);
  store.commit("setCurrStock", props.item);
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
  } else {
    setTimeout(() => {
      router.push({
        name: "market_info",
        query: {
          symbol: props.item.symbol,
          type: "stock",
        },
      });
    }, 100);
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
.stock_item_box_crypto {
  width: 100%;
  overflow: hidden;

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
      font-size: 0.52rem;
      height: 0.52rem;
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
    // margin-left: -0.32rem;
    .delete_icon {
      width: 0.52rem;
      height: 0.52rem;
      background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M15.4813 4.59546H4.5192C4.38792 4.59546 4.26758 4.70486 4.26758 4.84708V16.4218C4.26758 17.1767 4.88023 17.7893 5.6351 17.7893H14.3763C14.7373 17.7893 15.0765 17.6471 15.3281 17.3955C15.5797 17.1438 15.7219 16.7938 15.7219 16.4327V4.83614C15.7329 4.70486 15.6235 4.59546 15.4813 4.59546ZM7.80125 14.0806C7.80125 14.2119 7.74655 14.3432 7.65903 14.4307C7.56057 14.5291 7.44023 14.5729 7.30895 14.5729C7.03544 14.5729 6.81664 14.3541 6.81664 14.0806V7.99785C6.81664 7.72435 7.03544 7.50554 7.30895 7.50554C7.58245 7.50554 7.80125 7.72435 7.80125 7.99785V14.0806ZM10.4925 14.0806C10.4925 14.3541 10.2737 14.5729 10.0002 14.5729C9.72672 14.5729 9.50792 14.3541 9.50792 14.0806V7.99785C9.50792 7.72435 9.72672 7.50554 10.0002 7.50554C10.2737 7.50554 10.4925 7.72435 10.4925 7.99785V14.0806ZM13.1948 14...%3C/path%3E%3Cpath d="M17....%3C/path%3E%3C/svg%3E');
      background-size: contain;
      background-repeat: no-repeat;
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
    flex: 5;
    flex-shrink: 0;
    overflow: hidden;

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
    flex: 5;
    flex-shrink: 0;
    overflow: hidden;

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
</style>
