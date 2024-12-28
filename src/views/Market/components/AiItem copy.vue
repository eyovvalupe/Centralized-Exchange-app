<!-- ai交易元素 -->
<template>
  <div class="ai_item" @click="props.page == 'home' ? goTrade() : null">
    <div class="head">
      <div>
        <div class="title">
          {{ props.item.name }}
        </div>
        <div class="tip">
          <div class="tip_member">
            <div class="tip_icon">
              <img :src="getStaticImgUrl('/static/img/common/member.svg')" alt="icon" />
            </div>
            <span>{{ props.item.numpeople || "--" }}</span>
          </div>
          <div class="tip_text">
            {{ t("trade.ai_opening_bigest_network") }} {{ props.item.maxgrid }}
          </div>
        </div>
      </div>
      <div>
        <div class="time_title">{{ t("trade.ai_opening_perform_time") }}</div>
        <div class="time_desc">
          {{
            formatSec(props.item.runtime)[0] +
            t("common.day") +
            " " +
            formatSec(props.item.runtime)[1] +
            t("common.hour") +
            " " +
            formatSec(props.item.runtime)[2] +
            t("common.min")
          }}
        </div>
      </div>
    </div>

    <div class="cont">
      <div class="income">
        <div>
          <div class="income_label">
            {{ t("trade.order_info_profit") }}(USDT)
          </div>
          <div class="income_amount" :class="[props.item.income > 0 ? 'up' : 'down']">
            {{ props.item.income }}
          </div>
        </div>
        <!-- 图表 -->
        <div class="canvas">
          <SparkLine v-if="getRealtime(item.symbol, 'points')" :polyline-stroke-width="2"
            :points="getRealtime(item.symbol, 'points')" :ratio="getRealtime(item.symbol, 'ratio')" :xtimes="2"
            :ytimes="2" />
        </div>
      </div>

      <div class="table">
        <div class="td">
          <div class="td_title">
            {{ t("trade.ai_opening_historical_profit_rate") }}
          </div>
          <div class="td_val">{{ props.item.ratereturn }}</div>
        </div>
        <div class="td">
          <div class="td_title">{{ t("trade.ai_opening_24_profit_rate") }}</div>
          <div class="td_val">{{ props.item.ratereturn24h }}</div>
        </div>
        <div class="td">
          <div class="td_title">
            {{ t("trade.ai_opening_min_invest_amount") }}
          </div>
          <div class="td_val">{{ props.item.minamount }}</div>
        </div>
      </div>
    </div>

    <div class="btns" v-if="props.page != 'home'">
      <div class="btn" @click="goTrade">{{ t("trade.ai_opening_trade") }}</div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
// import { formatSec } from "@/utils/time";
import SparkLine from "@/components/SparkLine.vue";
import store from "@/store";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emits = defineEmits("click", 'clickItems');

const getRealtime = (symbol, k) => {
  for (let i = 0; i < store.state.realtimeData.length; i++) {
    if (store.state.realtimeData[i].symbol == symbol) {
      return store.state.realtimeData[i][k]
    }
  }
  return ''
}
const route = useRoute();
const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },
  page: {
    type: String,
    default: "",
  },
});

const goTrade = () => {
  store.commit("setCurrAi", props.item);
  router.push({
    name: "trade",
    query: {
      to: "ai",
      name: props.item.name,
      symbol: props.item.symbol,
    },
  });
  if (route.name == "trade") {
    emits("clickItems", props.item);
  }
};

const formatSec = (seconds, t) => {
  if (seconds < 0) return "--";
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  return [days, hours, minutes];
};
</script>

<style lang="less" scoped>
.ai_item {
  border-radius: 0.32rem;
  border: 1px solid #eff3f8;
  font-size: 0.28rem;
  color: #0d0d12;
  margin-top: 0.2rem;
  background-color: #f5f7fc;
  position: relative;

  .head {
    padding: 0.24rem 0.32rem;
    display: flex;
    justify-content: space-between;

    .time_title {
      color: #6c7b90;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
    }

    .time_desc {
      text-align: right;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
      margin-top: 0.1rem;
    }
  }

  .canvas {
    width: 2.32rem;
    height: 1.22rem;
  }

  .income {
    display: flex;
    justify-content: space-between;
    padding: 0.32rem 0.4rem;
    align-items: center;
  }

  .cont {
    background-color: #fff;
    border-radius: 0.32rem;
    border: 1px solid #eff3f8;
    position: relative;
    width: calc(100% + 2px);
    box-sizing: border-box;
    left: -1px;
  }

  .title {
    color: #0d0d12;
    font-size: 0.36rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 140%;
  }

  .tip {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #8f8f8f;
    font-weight: 400;
    font-size: 0.28rem;

    .tip_member {
      display: flex;
      align-items: center;
      height: 0.36rem;
      padding: 0 0.1rem;
      font-size: 0.2rem;
      color: #f89a29;
      margin-right: 0.16rem;
      border-radius: 0.04rem;
      background: rgba(248, 154, 41, 0.08);

      .tip_icon {
        width: 0.2rem;
        height: 0.2rem;
        margin-right: 0.06rem;
      }
    }

    .tip_text {
      color: #8f8f8f;
      font-size: 0.24rem;
      line-height: 140%;
    }
  }

  .income_label {
    color: #333;
    font-size: 0.24rem;
    font-weight: 400;
    line-height: 0.24rem;
  }

  .income_amount {
    margin-top: 0.2rem;
    font-size: 0.56rem;
    font-weight: 600;
    line-height: 0.56rem;
  }

  .table {
    display: flex;
    border-top: 1px dashed #eff3f8;
    padding: 0.32rem 0;

    .td {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      .td_title {
        color: #8f92a1;
        font-size: 0.24rem;
        font-style: normal;
        line-height: 0.44rem;
      }

      .td_val {
        color: #061023;
        font-size: 0.3rem;
        font-weight: 600;
        line-height: 0.44rem;
        margin-top: 0.12rem;
      }
    }

    .td+.td::after {
      content: "";
      width: 1px;
      height: 0.9rem;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -0.45rem;
      background-color: #eff3f8;
    }
  }

  .btns {
    padding: 0.2rem 0.4rem;

    .btn {
      height: 0.64rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      height: 0.8rem;
      font-size: 0.3rem;
      font-weight: 600;
      background-color: #014cfa;
    }
  }
}
</style>
