<!-- 开仓 -->
<template>

  <div class="opening_page">
    <!-- 股票分类 -->
    <div class="stock-tabs">
      <div class="stock-tab" :class="{ 'stock-tab-active': stockTab == 1 }" @click="changeTab(1)">{{ $t('trade.ai_opening_trade') }}</div>
      <div class="stock-tab" :class="{ 'stock-tab-active': stockTab == 2 }" @click="changeTab(2)">{{ $t('trade.margin_long') }}</div>
      <div class="stock-tab" :class="{ 'stock-tab-active': stockTab == 3 }" @click="changeTab(3)">{{ $t('trade.margin_short') }}</div>
      <div class="stock-tab" :class="{ 'stock-tab-active': stockTab == 4 }" @click="changeTab(4)">{{ $t('trade.pre_market') }}</div>
    </div>

    <div class="opening">
      <!-- Tabs -->
      <div class="open_tab_box" :class="{ 'trade-dialog': props.from == 'trade' }">

        <div
          style="border-radius: 0.32rem;background-color: var(--ex-bg-color3);padding: 0 0.16rem 0.4rem 0.16rem;border-bottom:1px solid var(--ex-bg-white2);">
          <div class="flex w-full items-end justify-between">
            <!-- 盘前 -->
            <div class="type_tabs" v-if="stockTab == 4">
              <div @click="activeType = 1" class="type_tab" :class="{ active_type_tab: activeType == 1 }">
                <span class="type_tab_text">{{ $t('trade.ipo_sub_leveraged') }}</span>
              </div>
              <div @click="activeType = 2" class="type_tab"
                :class="{ active_type_tab: activeType == 2, active_type_tab2: activeType == 2 }">
                <span class="type_tab_text text-center">{{ $t('trade.short_sell') }}</span>
              </div>
            </div>
            <Tabs key="form" class="van-tabs--sub_line van-tabs--sub_bg"
              :style="{ width: stockTab == 4 ? '3.3rem !important' : '' }" animated @change="(e) => (activeTab = e)"
              v-model="activeTab" :swipeable="false" :color="'var(--ex-primary-color)'" shrink>
              <Tab :title="t('trade.stock_market_price')" name="0">
              </Tab>
              <Tab :title="t('trade.stock_limit_price')" name="1">
              </Tab>
              <Tab :title="t('trade.stock_take_stop')" name="2">
              </Tab>
            </Tabs>
          </div>
          <div class="w-full" v-if="activeTab == 0">
            <OpeningForm :tradeType="props.tradeType" @showNavDialog="showNavDialog" @success="onSuccess"
              v-if="activeTab == 0" ref="OpeningForm0Ref" :key="0" :activeTab="activeTab" :activeType="activeType"
              :stockTab="stockTab" />
          </div>
          <div class="w-full" v-if="activeTab == 1">
            <OpeningForm :tradeType="props.tradeType" @showNavDialog="showNavDialog" @success="onSuccess"
              v-if="activeTab == 1" ref="OpeningForm1Ref" :key="1" :activeTab="activeTab" :activeType="activeType"
              :stockTab="stockTab" />
          </div>
          <div class="w-full" v-if="activeTab == 2">
            <OpeningForm :tradeType="props.tradeType" @showNavDialog="showNavDialog" @success="onSuccess"
              v-if="activeTab == 2" ref="OpeningForm2Ref" :key="2" :activeTab="activeTab" :activeType="activeType"
              :stockTab="stockTab" />
          </div>
        </div>

        <div class="account-box">
          <div class="title">{{ $t('assets.wallet_header_stock') }}</div>
          <div class="info">
            <div>{{ $t('market.market_faster_available') }}</div>
            <div>
              <span style="font-size: 0.32rem;color:var(--ex-primary-color);margin-right: 0.08rem;">{{ stockWalletAmount
                || '0' }}</span>
              <span style="color:var(--ex-white)">{{ paramCurrency }}</span>
            </div>
          </div>
          <div class="info">
            <div>{{ $t('trade.stock_opening_upfront') }}</div>
            <div>
              <span style="font-size: 0.32rem;color:var(--ex-primary-color);margin-right: 0.08rem;">--</span>
              <span style="color:var(--ex-white)">{{ paramCurrency }}</span>
            </div>
          </div>
          <div class="info">
            <div>{{ $t('trade.margin_risk') }}</div>
            <div>
              <span style="font-size: 0.32rem;color:var(--ex-primary-color);margin-right: 0.08rem;">--</span>
              <span style="color:var(--ex-white)">%</span>
            </div>
          </div>

          <div class="btns">
            <div class="btn ripple-primary" @click="jump('topUpCrypto')">{{ $t('home.recharge') }}</div>
            <div class="btn ripple-primary" @click="jump('transfer')">{{ $t('assets.transfer') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Tab, Tabs, ActionSheet, showToast } from "vant";
import { _search, _basic, _stocksPara, _stocksBuy } from "@/api/api";
import { useRoute } from "vue-router";
import OpeningForm from "./OpeningForm.vue";
import { useI18n } from "vue-i18n";
import router from "@/router";
import store from "@/store/index.js"

const token = computed(() => store.state.token)
const jump = name => {
  if (token.value) {
    if (name == 'transfer') {
      store.commit('setToType', 'stock')
      store.commit('setToCurrency', stockWallet.value)
    }
    router.push({ name })
  } else {
    if (name == 'topUpCrypto') showToast('请先登录再去充值')
    if (name == 'transfer') showToast('请先登录再去划转')
  }
}

const props = defineProps({
  tradeType: {
    type: [String, Number],
    default: ''
  }
})

// 分类
const stockTab = ref(1)
const changeTab = val => {
  stockTab.value = val
}

const { t } = useI18n();
const emits = defineEmits(["showNavDialog", "success"]);
const showNavDialog = () => {
  emits("showNavDialog");
};

const route = useRoute();
const OpeningForm0Ref = ref();
const OpeningForm1Ref = ref();
const OpeningForm2Ref = ref();
const stockWalletAmount = computed(() => {
  if (activeTab.value == 0 && OpeningForm0Ref.value) return OpeningForm0Ref.value.stockWalletAmount
  if (activeTab.value == 1 && OpeningForm1Ref.value) return OpeningForm1Ref.value.stockWalletAmount
  if (activeTab.value == 2 && OpeningForm2Ref.value) return OpeningForm2Ref.value.stockWalletAmount
  return 0
})

const stockWallet = computed(() => {
  if (activeTab.value == 0 && OpeningForm0Ref.value) return OpeningForm0Ref.value.stockWallet
  if (activeTab.value == 1 && OpeningForm1Ref.value) return OpeningForm1Ref.value.stockWallet
  if (activeTab.value == 2 && OpeningForm2Ref.value) return OpeningForm2Ref.value.stockWallet
  return 0
})

const paramCurrency = computed(() => {
  if (activeTab.value == 0 && OpeningForm0Ref.value) return OpeningForm0Ref.value.paramCurrency
  if (activeTab.value == 1 && OpeningForm1Ref.value) return OpeningForm1Ref.value.paramCurrency
  if (activeTab.value == 2 && OpeningForm2Ref.value) return OpeningForm2Ref.value.paramCurrency
  return 0
})

const activeType = ref(1); // 1-买涨 2-买跌
const activeTab = ref(0); // 0-市价 1-限价 2-止盈止损


// 选择某个股票
const choose = (item) => {
  OpeningForm0Ref.value && OpeningForm0Ref.value.choose(item);
  OpeningForm1Ref.value && OpeningForm1Ref.value.choose(item);
  OpeningForm2Ref.value && OpeningForm2Ref.value.choose(item);
};

const onSuccess = () => {
  emits("success");
};

const openSearch = () => {
  OpeningForm0Ref.value && OpeningForm0Ref.value.openSearchDialog();
  OpeningForm1Ref.value && OpeningForm1Ref.value.openSearchDialog();
  OpeningForm2Ref.value && OpeningForm2Ref.value.openSearchDialog();
}

defineExpose({
  choose,
  openSearch,
});

onMounted(() => {
  if (token.value) store.dispatch('updateStockWallet');
})
</script>

<style lang="less" scoped>
.opening_page {
  .stock-tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-white1);
    margin: 0.4rem 0.28rem 0.32rem 0.28rem;
    height: 0.68rem;
    border-radius: 0.2rem;

    .stock-tab {
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color3);
      border-radius: 0.2rem;
    }

    .stock-tab-active {
      background-color: var(--ex-primary-color);
      color: var(--ex-white);
    }
  }

  .opening {
    padding: 0 0 0.32rem 0;

    .open_tab_box {
      border-radius: 0 0 0.32rem 0.32rem;

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
          margin-bottom: 0.4rem;
        }

        .btns {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.52rem;
          gap: 0.4rem;

          .btn {
            flex: 1;
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
      width: 2.72rem;

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
      width: 100%;
      height: 0.54rem;

      .van-tabs__wrap {
        width: 100%;
        height: 0.54rem !important;
        border-bottom: 0.02rem solid var(--ex-bg-white2);

        .van-tabs__nav {
          position: relative;
          width: 100%;
          padding: 0 !important;
          height: 0.54rem;
          align-items: start;
          background: none !important;

          .van-tab {
            line-height: 0.32rem;
          }
        }

        .van-tabs__line {
          bottom: 0 !important;
          width: 0.34rem !important;
          height: 0.04rem !important;
          background-color: var(--ex-white) !important;
        }
      }
    }
  }
}
</style>
