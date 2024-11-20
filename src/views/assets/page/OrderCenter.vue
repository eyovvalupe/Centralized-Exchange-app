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
        <List :from="'orderCenter'"/>
      </div>

      <div class="tab" v-if="activeTab == 1">
        <StockOrderList />
      </div>

      <div class="tab" v-if="activeTab == 2">
        <CryptoOrderList />
      </div>

      <div class="tab" v-if="activeTab == 3">
        <AIOrderList />
      </div>

      <div class="tab" v-if="activeTab == 4">
        <IPOStock ref="IPOStockRef" :from="'assets'"/>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import CashOrderList from "./components/CashOrderList.vue";
import StockOrderList from "./components/StockOrderList.vue";
import CryptoOrderList from "./components/CryptoOrderList.vue";
import IPOStock from "@/views/Trade2/pages/IPOStock.vue";
import AIOrderList from "./components/AIOrderList.vue";
import List from "@/views/Market/buyCoin/List.vue";

const activeTab = ref(0);
const IPOStockRef = ref();
const changeActiveTab = (val) => {
  activeTab.value = val;
  if (val == 4) {
    setTimeout(() => {
      IPOStockRef.value && IPOStockRef.value.init();
    }, 0);
  }
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
    .page_ipo_stock {
      padding: 0;
    }

    .btns {
      padding: 0;
    }

    .tabs {
      padding: 0 !important;
    }
  }
}
</style>
