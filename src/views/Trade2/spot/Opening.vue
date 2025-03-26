<!-- 开仓 -->
<template>
  <div class="opening">
    <div class="type_tabs">
      <div @click="activeType = 1" class="type_tab tab_ani" :class="{ active_type_tab: activeType == 1 }">
        {{ $t('market.market_buy_fast_buy') }}
      </div>
      <div @click="activeType = 2" class="type_tab tab_ani"
        :class="{ 'active_type_tab active_type_tab2': activeType == 2 }">
        {{ $t('market.market_buy_fast_sell') }}
      </div>
    </div>

    <!-- Tabs -->
    <div class="open_tab_box" :class="{ 'trade-dialog': props.from == 'trade' }">

      <div
        style="border-radius: 0.32rem;background-color: var(--ex-bg-color3);padding: 0.32rem 0.16rem 0.4rem 0.16rem;border-bottom:1px solid var(--ex-bg-white2);">
        <Tabs animated key="form" class="van-tabs--sub_line" @change="(e) => (activeTab = e)"
          v-model="activeTab" :swipeable="false">
          <Tab :title="t('trade.stock_market_price')" name="0">
            <OpeningForm :tradeType="props.tradeType" :type="props.type" 
              v-if="activeTab == 0" ref="OpeningForm0Ref" :key="0" :activeTab="activeTab" :activeType="activeType"
              @success="emits('success')" />
          </Tab>
          <Tab :title="t('trade.stock_limit_price')" name="1">
            <OpeningForm :tradeType="props.tradeType" :type="props.type" 
              v-if="activeTab == 1" ref="OpeningForm1Ref" :key="1" :activeTab="activeTab" :activeType="activeType"
              @success="emits('success')" />
          </Tab>
        </Tabs>
      </div>

      <div class="account-box" v-if="token">
        <div class="title">{{ $t('trade.ai_opening_cash_wallet') }}</div>
        <div class="info">
          <div>{{ $t('market.market_faster_available') }}</div>
          <div>
            <span style="font-size: 0.32rem;color:var(--ex-primary-color)">{{ stockWalletAmount || '0' }}</span>
            <span style="color:var(--ex-white)">&nbsp;USDT</span>
          </div>
        </div>
        <div class="info" style="margin-top: 0.4rem;">
          <div>{{ $t('trade.spot_trade_available') }}</div>
          <div>
            <span style="font-size: 0.32rem;color:var(--ex-primary-color)">{{ currencyAmount || '0' }}</span>
            <span style="color:var(--ex-white)">&nbsp;{{ props.item.symbol ? props.item.symbol.replace('usdt',
              '').toUpperCase() : '' }}</span>
          </div>
        </div>

        <div class="btns">
          <div class="btn ripple-primary" @click="jump('topUpCrypto')">{{ $t('assets.recharge') }}</div>
          <div class="btn ripple-primary" @click="jump('transfer')">{{ $t('assets.transfer') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { Tab, Tabs } from "vant";
import { _search, _basic, _stocksPara, _stocksBuy } from "@/api/api";
import { useRoute } from "vue-router";
import OpeningForm from "./OpeningForm.vue";
import { useI18n } from "vue-i18n";
import router from "@/router";
import store from "@/store";

const token = computed(() => store.state.token)
const jump = name => router.push({ name })

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  mode: { // constract-加密货币 foreign-外汇 commodities-大宗交易
    type: String,
    default: 'constract'
  },
  tradeType: {
    type: [String, Number],
    default: ''
  },
  from: '',
  item: {}
})

const { t } = useI18n();
const emits = defineEmits(["success"]);

const route = useRoute();
const OpeningForm0Ref = ref();
const OpeningForm1Ref = ref();
// const OpeningForm2Ref = ref();
const stockWalletAmount = computed(() => {
  if (activeTab.value == 0 && OpeningForm0Ref.value) return OpeningForm0Ref.value.stockWalletAmount
  if (activeTab.value == 1 && OpeningForm1Ref.value) return OpeningForm1Ref.value.stockWalletAmount
  // if (activeTab.value == 2 && OpeningForm2Ref.value) return OpeningForm2Ref.value.stockWalletAmount
  return 0
})
const currencyAmount = computed(() => {
  if (activeTab.value == 0 && OpeningForm0Ref.value) return OpeningForm0Ref.value.currencyAmount
  if (activeTab.value == 1 && OpeningForm1Ref.value) return OpeningForm1Ref.value.currencyAmount
  // if (activeTab.value == 2 && OpeningForm2Ref.value) return OpeningForm2Ref.value.currencyAmount
  return 0
})

const activeType = ref(1); // 1-买入 2-卖出
// url参数处理
// if (route.query.symbol) {
//   activeType.value = route.query.type || 1;
// }
const activeTab = ref(0); // 0-市价 1-限价 


// 选择某个股票
const choose = (item, key) => {
  if (key) {
    activeType.value = 1
  } else {
    activeType.value = 2
  }
  OpeningForm0Ref.value && OpeningForm0Ref.value.choose(item);
  OpeningForm1Ref.value && OpeningForm1Ref.value.choose(item);
  // OpeningForm2Ref.value && OpeningForm2Ref.value.choose(item);
};

defineExpose({
  choose,
});
</script>

<style lang="less" scoped>
.opening {
  // padding: 0.32rem 0;
  position: relative;

  .open_tab_box {
    border-radius: 0 0 0.32rem 0.32rem;

    :deep(.van-tabs__wrap) {
      padding-left: 3.4rem;
    }

    :deep(.van-tabs__nav) {
      background-color: var(--ex-none);
      position: relative;

      &::after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.06);
        bottom: 0.3rem;
        left: 0;
        position: absolute;
      }
    }

    .account-box {
      border-radius: 0.32rem;
      background-color: var(--ex-bg-color3);
      padding: 0.36rem 0.32rem;
      margin-top: 0.1rem;

      .title {
        font-size: 0.32rem;
        color: var(--white);
        margin-bottom: 0.4rem;
      }

      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--ex-placeholder-color);
      }

      .btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.52rem;

        .btn {
          width: 3rem;
          height: 0.68rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ex-white);
          font-size: 0.28rem;
          background-color: var(--ex-bg-white1);
        }
      }
    }
  }

  .type_tabs {
    display: flex;
    align-items: center;
    height: 0.68rem;
    border-radius: 1rem;
    background-color: var(--ex-bg-white1);
    width: 3rem;
    position: absolute;
    z-index: 999;
    left: 0.24rem;
    top: 0.32rem;

    .type_tab {
      flex: 1;
      font-size: 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color3);
      transition: all ease-in .1s;
      height: 100%;
      border-radius: 1rem;
    }

    .active_type_tab {
      background-color: var(--ex-primary-color);
      color: var(--ex-white);
    }

    .active_type_tab2 {
      background-color: var(--ex-down-color);
    }
  }

  
  :deep(.van-tabs--sub_line) {
    --van-tabs-line-height: 0.68rem;
    .van-tabs__wrap {
      display:flex;
      justify-content: flex-end;
      height: 0.68rem;
      .van-tabs__nav {
        position: relative;
        padding-bottom:0px;
        &::after {
          content: '';
          width: 100%;
          height: 1px;
          position: absolute;
          bottom: 0;
          left: 0;
          background-color: var(--ex-bg-white2);
        }
        .van-tab{
          flex: inherit;
          padding:0 0.18rem;
        }
      }
      .van-tabs__line{
        width:0.34rem;
        height:0.04rem;
        background-color: var(--ex-white);
        bottom:0;
      }
      .van-tab--active{
        font-weight:400;
      }
    }
  }
}
</style>
