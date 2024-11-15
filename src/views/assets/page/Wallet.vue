<template>
  <div class="wallet_container">
    <div class="flex flex-col items-center" v-if="currSelectedWallet == -1">
      <div @click="changeActiveTab(1)"><CashWallet :amount="assets.money" /></div>
      <div @click="changeActiveTab(2)"><StockWallet :amount="assets.stock"/></div>
      <div @click="changeActiveTab(3)"><ContractWallet :amount="assets.futures"/></div>
      <div @click="changeActiveTab(4)"><ForexWallet :amount="assets.forex"/></div>
      <div @click="changeActiveTab(5)"><TradeWallet :amount="assets.blocktrade"/></div>
    </div>
    <div v-if="currSelectedWallet != -1">
      <div
        class="wallet_tabs"
        @touchstart.stop=""
        @touchmove.stop=""
        @touchend.stop=""
      >
        <div ref="tabscroll" class="wallet_tabs_scroll flex">
          <div
            class="wallet_tab"
            :class="currSelectedWallet == 1 ? 'actived' : ''"
            :key="0"
            @click="changeActiveTab(1)"
          >
            <span class="wallet_tab_text">现金账户</span>
          </div>
          <div
            class="wallet_tab"
            :class="currSelectedWallet == 2 ? 'actived' : ''"
            :key="1"
            @click="changeActiveTab(2)"
          >
            <span class="wallet_tab_text">股票账户</span>
          </div>
          <div
            class="wallet_tab"
            :class="currSelectedWallet == 3 ? 'actived' : ''"
            :key="2"
            @click="changeActiveTab(3)"
          >
            <span class="wallet_tab_text">合约账户</span>
          </div>
          <div
            class="wallet_tab"
            :class="currSelectedWallet == 4 ? 'actived' : ''"
            :key="3"
            @click="changeActiveTab(4)"
          >
            <span class="wallet_tab_text">外汇账户</span>
          </div>
          <div
            class="wallet_tab"
            :class="currSelectedWallet == 5 ? 'actived' : ''"
            :key="4"
            @click="changeActiveTab(5)"
          >
            <span class="wallet_tab_text">大宗账户</span>
          </div>
        </div>
      </div>

      <div class="tab" v-if="currSelectedWallet == 1">
        <DefaultWallet :name="'现金'" :balance="assets.money" />
        <Btns />
        <Cash />
      </div>

      <div class="tab" v-if="currSelectedWallet == 2">
        <OtherWallet :name="'股票'" :balance="assets.stock" />
        <div class="flex justify-between px-[0.28rem] relative top-[-1rem]">
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] pb-[0.1rem] flex flex-col items-center justify-between"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span class="text-[0.28rem] text-[#666d80]">股票余额</span>
            <span class="text-[0.3rem] text-[#061023] font-semibold"
              >{{ parseFloat(assets.stock).toLocaleString() }}</span
            >
          </div>
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] pb-[0.1rem] flex flex-col items-center justify-between"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span class="text-[0.28rem] text-[#666d80]">持仓金额</span>
            <span class="text-[0.3rem] text-[#061023] font-semibold"
              >{{ parseFloat(assets.order_value).toLocaleString() }}</span
            >
          </div>
        </div>
        <StockMyWallet />
      </div>

      <div class="tab" v-if="currSelectedWallet == 3">
        <OtherWallet :name="'合约'" :balance="assets.futures" />
        <div class="flex justify-between px-[0.28rem] relative top-[-1rem]">
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] pb-[0.1rem] flex flex-col items-center justify-between"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span class="text-[0.28rem] text-[#666d80]">合约余额</span>
            <span class="text-[0.3rem] text-[#061023] font-semibold"
              >{{ parseFloat(assets.futures).toLocaleString() }}</span
            >
          </div>
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] pb-[0.1rem] flex flex-col items-center justify-between"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span class="text-[0.28rem] text-[#666d80]">持仓金额</span>
            <span class="text-[0.3rem] text-[#061023] font-semibold"
              >{{ parseFloat(assets.order_value).toLocaleString() }}</span
            >
          </div>
        </div>
        <CryptoWallet />
      </div>

      <div class="tab" v-if="currSelectedWallet == 4">
        <DefaultWallet :name="'外汇'" :balance="assets.forex" />
        <Btns />
        <ForexMyWallet />
      </div>

      <div class="tab" v-if="currSelectedWallet == 5">
        <!-- <DefaultWallet :name="'大宗商品'" :balance="10000" /> -->
      </div>
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
import { ref, onMounted, computed, watch } from "vue";
import DefaultWallet from "./components/DefaultWallet.vue";
import Btns from "./components/Btns.vue";
import Cash from "./Cash.vue";
import OtherWallet from "./components/OtherWallet.vue";
import store from '@/store';
import StockMyWallet from "./StockWallet.vue";
import CryptoWallet from "./CryptoWallet.vue";
import ForexMyWallet from "./ForexWallet.vue";

const activeTab = ref(-1);
const tabscroll = ref(null)
const changeActiveTab = (val) => {
  store.commit("setCurrSelectedWallet", val)
};
// 刷新总资产
const assets = computed(() => store.state.assets || {});
const token = computed(() => store.state.token || "");
const currSelectedWallet = computed(() => store.state.currSelectedWallet || '-1')
const walletState = computed(() => store.state.wallet)
const elseWalletState = computed(() => store.state.elseWallet)
const elseWalletMapState = computed(() => store.state.elseWalletMap)
console.log("wallet ============> ", walletState.value)
console.log("wallet1 ============> ", elseWalletState.value)
console.log("wallet2 ============> ", elseWalletMapState.value)


const getAssets = () => {
  if (!token.value) return;
  store.dispatch("updateAssets")
  store.dispatch("updateWallet");
};

onMounted(() => {
  getAssets();
});

const refresh = () => {
  getAssets();
};

defineExpose({
  refresh,
});

watch(() => currSelectedWallet.value, (val) => {
  console.log("changed tab")
  // if (val==5) {
  //   tabscroll.value.scrollTop = 42;
  // }
})
const jump = (name, check = false, query) => {
  router.push({
    name,
    query,
  });
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
      transition: all 0.3s linear;

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

  .tab {
    .btns {
      padding: 0;
    }

    .tabs {
      padding: 0 !important;
    }
  }
}
</style>
