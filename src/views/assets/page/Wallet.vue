<template>
  <div class="wallet_container">
    <div class="flex flex-col items-center" v-if="false">
      <CashWallet />
      <StockWallet />
      <ContractWallet />
      <ForexWallet />
      <TradeWallet />
    </div>

    <div class="wallet_tabs">
      <div class="wallet_tabs_scroll flex">
        <div
          class="wallet_tab"
          :class="activeTab == 0 ? 'actived' : ''"
          :key="0"
          @click="() => (activeTab = 0)"
        >
          <span class="wallet_tab_text">现金账户</span>
        </div>
        <div
          class="wallet_tab"
          :class="activeTab == 1 ? 'actived' : ''"
          :key="1"
          @click="() => (activeTab = 1)"
        >
          <span class="wallet_tab_text">股票账户</span>
        </div>
        <div
          class="wallet_tab"
          :class="activeTab == 2 ? 'actived' : ''"
          :key="2"
          @click="() => (activeTab = 2)"
        >
          <span class="wallet_tab_text">合约账户</span>
        </div>
        <div
          class="wallet_tab"
          :class="activeTab == 3 ? 'actived' : ''"
          :key="3"
          @click="() => (activeTab = 3)"
        >
          <span class="wallet_tab_text">外汇账户</span>
        </div>
        <div
          class="wallet_tab"
          :class="activeTab == 4 ? 'actived' : ''"
          :key="4"
          @click="() => (activeTab = 4)"
        >
          <span class="wallet_tab_text">大宗账户</span>
        </div>
      </div>
    </div>

    <div class="cash_tab" v-if="activeTab == 0">
      <DefaultWallet :name="'现金'" :balance="10000" />
      <Btns />
      <Cash />
    </div>

    <div class="cash_tab" v-if="activeTab == 1">
        <DefaultWallet :name="'股票'" :balance="10000"/>
    </div>

    <div class="cash_tab" v-if="activeTab == 2">
        <DefaultWallet :name="'合约'" :balance="10000"/>
    </div>

    <div class="cash_tab" v-if="activeTab == 3">
        <DefaultWallet :name="'外汇'" :balance="10000"/>
    </div>

    <div class="cash_tab" v-if="activeTab == 4">
        <DefaultWallet :name="'大宗商品'" :balance="10000"/>
    </div>

    <!-- <div>
      <Contract />
      <AI />
      <IPO />
      <Stock />
    </div> -->
  </div>
</template>
<script setup>
import CashWallet from "./components/CashWallet.vue";
import StockWallet from "./components/StockWallet.vue";
import ContractWallet from "./components/ContractWallet.vue";
import ForexWallet from "./components/ForexWallet.vue";
import TradeWallet from "./components/TradeWallet.vue";
import AI from "./AI.vue";
import Contract from "./Contract.vue";
import IPO from "./IPO.vue";
import Stock from "./Stock.vue";
import { ref } from "vue";
import DefaultWallet from "./components/DefaultWallet.vue";
import Btns from "./components/Btns.vue";
import Cash from "./Cash.vue";

const activeTab = ref(0);
const initialSwipe = ref(activeTab.value);
const loadedTab = ref([activeTab.value]);
const swipe = ref(null);
const changeActiveTab = (val, slideSwipe = false) => {
  activeTab.value = val;
  if (loadedTab.value.indexOf(val) == -1) {
    loadedTab.value.push(val);
  }
  localStorage.assetsActiveTab = val;
  if (slideSwipe && swipe.value) {
    swipe.value.swipeTo(val);
  }
};
const swipeChange = (val) => {
  changeActiveTab(val);
};
</script>
<style lang="less">
.wallet_container {
  width: 100%;
  padding: 0.32rem;

  .wallet_tabs {
    width: 6.86rem;
    height: 0.8rem;
    display: flex;
    overflow-x: scroll;

    .wallet_tabs_scroll {
      width: 200%;
      display: flex;
      justify-content: space-between;

      .wallet_tab {
        min-width: 1.84rem;
        margin-right: 0.16rem;
        height: 0.8rem;
        border-radius: 1rem;
        border: 0.02rem solid #d0d8e2;
        display: flex;
        justify-content: center;
        align-items: center;

        .wallet_tab_text {
          font-size: 0.32rem;
          color: #666d80;
        }
      }

      .actived {
        background-color: #014cfa;
        border: none;

        .wallet_tab_text {
          color: white;
        }
      }
    }
  }

  .cash_tab {
    .btns {
        padding: 0;
    }
     
    .tabs {
        padding: 0 !important;
    }
  }
}
</style>
