<template>
  <div class="order_container">
    <div>
      <div
        class="order_tabs"
        @touchstart.stop=""
        @touchmove.stop=""
        @touchend.stop=""
      >
        <div class="order_tabs_scroll flex">
          <div
            class="order_tab"
            :class="activeTab == 0 ? 'actived' : ''"
            :key="0"
            @click="changeActiveTab(0)"
          >
            <span class="order_tab_text">买币</span>
          </div>
          <div
            class="order_tab"
            :class="activeTab == 1 ? 'actived' : ''"
            :key="1"
            @click="changeActiveTab(1)"
          >
            <span class="order_tab_text">股票</span>
          </div>
          <div
            class="order_tab"
            :class="activeTab == 2 ? 'actived' : ''"
            :key="2"
            @click="changeActiveTab(2)"
          >
            <span class="order_tab_text">合约</span>
          </div>
          <div
            class="order_tab_ai"
            :class="activeTab == 3 ? 'actived' : ''"
            :key="3"
            @click="changeActiveTab(3)"
          >
            <span class="order_tab_text">交易机器人</span>
          </div>
          <div
            class="order_tab"
            :class="activeTab == 4 ? 'actived' : ''"
            :key="4"
            @click="changeActiveTab(4)"
          >
            <span class="order_tab_text">IPO</span>
          </div>
        </div>
      </div>

      <div class="tab" v-if="activeTab == 0">
        <CashOrderList />
      </div>

      <div class="tab" v-if="activeTab == 1">
        <StockOrderList />
      </div>

      <div class="tab" v-if="activeTab == 2">
        <OtherWallet :name="'合约'" :balance="10000" />
        <div class="flex justify-between px-[0.28rem] relative top-[-1rem]">
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] pb-[0.1rem] flex flex-col items-center justify-between"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span class="text-[0.28rem] text-[#666d80]">合约余额</span>
            <span class="text-[0.3rem] text-[#061023] font-semibold"
              >8000.00</span
            >
          </div>
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] pb-[0.1rem] flex flex-col items-center justify-between"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span class="text-[0.28rem] text-[#666d80]">持仓金额</span>
            <span class="text-[0.3rem] text-[#061023] font-semibold"
              >8000.00</span
            >
          </div>
        </div>
      </div>

      <div class="tab" v-if="activeTab == 3">
        <DefaultWallet :name="'外汇'" :balance="10000" />
        <Btns />
        <Cash />
      </div>

      <div class="tab" v-if="activeTab == 4">
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
import { ref } from "vue";
import DefaultWallet from "./components/DefaultWallet.vue";
import Btns from "./components/Btns.vue";
import Cash from "./Cash.vue";
import OtherWallet from "./components/OtherWallet.vue";
import CashOrderList from "./components/CashOrderList.vue";
import StockOrderList from "./components/StockOrderList.vue";

const activeTab = ref(0);
const changeActiveTab = (val) => {
  activeTab.value = val;
};
</script>
<style lang="less">
.order_container {
  width: 100%;
  padding: 0.32rem;

  .order_tabs {
    width: 6.86rem;
    height: 0.8rem;
    margin-bottom: 0.4rem;
    display: flex;
    overflow-x: scroll;

    .order_tabs_scroll {
      width: 200%;
      display: flex;
      justify-content: space-between;

      .order_tab {
        min-width: 1.28rem;
        margin-right: 0.16rem;
        height: 0.8rem;
        border-radius: 1rem;
        border: 0.02rem solid #d0d8e2;
        display: flex;
        justify-content: center;
        align-items: center;

        .order_tab_text {
          font-size: 0.32rem;
          color: #666d80;
        }
      }

      .order_tab_ai {
        min-width: 2.24rem;
        margin-right: 0.16rem;
        height: 0.8rem;
        border-radius: 1rem;
        border: 0.02rem solid #d0d8e2;
        display: flex;
        justify-content: center;
        align-items: center;

        .order_tab_text {
          font-size: 0.32rem;
          color: #666d80;
        }
      }

      .actived {
        background-color: #014cfa;
        border: none;

        .order_tab_text {
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
