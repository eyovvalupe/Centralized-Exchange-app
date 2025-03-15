<template>
  <div class="trade_order_container1">
    <Tabs
      class="trade_head_tabs"
      v-model:active="activeMainTab"
      :swipeable="false"
      animated
      shrink
      @change="(e) => onChange(e)"
    >
      <Tab :title="'买币订单'" :name="0">
        <div class="">
          <List :from="'orderCenter'"/>
        </div>
      </Tab>
      <Tab :title="'交易订单'" :name="1">
        <div
          class="order_tabs px-[0.32rem] pt-[0.32rem]"
          @touchstart.stop=""
          @touchmove.stop=""
          @touchend.stop=""
        >
          <HeaderTabs
            type="green-card"
            v-model:active="activeTab"
            :tabs="[
              t('assets.order_title_stock'),
              t('币币'),
              t('加密货币合约'),
              t('trade.left_bot'),
              // t('assets.order_title_ipo'),
            ]"
            @change="changeActiveTab(activeTab)"
          />

          <div class="trade_order_tab pt-[0.4rem]" v-if="activeTab == 0">
            <StockOrderList :from="'order'" />
          </div>

          <div class="trade_order_tab pt-[0.4rem]" v-if="activeTab == 1">
            <SpotOrderList :from="'order'" />
          </div>

          <div class="trade_order_tab pt-[0.4rem]" v-if="activeTab == 2">
            <CryptoOrderList :from="'order'"/>
          </div>

          <div class="trade_order_tab pt-[0.4rem]" v-if="activeTab == 3">
            <AIOrderList :from="'order'" />
          </div>
        </div>
      </Tab>
      <Tab :title="'理财订单'" :name="2">
        <div
          class="order_tabs px-[0.32rem] pt-[0.32rem]"
          @touchstart.stop=""
          @touchmove.stop=""
          @touchend.stop=""
        >
          <HeaderTabs
            type="green-card"
            v-model:active="activeFinanceTab"
            :tabs="[t('跟单'), t('DeFi借币'), t('质押挖矿'), t('IPO')]"
            @change="changeActiveTab1(activeFinanceTab)"
          />
          <div class="trade_order_tab finance-tab" v-if="activeFinanceTab == 0">
            <CopyOrders :from="'order'" />
          </div>
          <div class="trade_order_tab finance-tab" v-if="activeFinanceTab == 1">
            <PledgeOrder :from="'order'" />
          </div>
          <div class="trade_order_tab finance-tab" v-if="activeFinanceTab == 2">
            <Order :from="'order'" />
          </div>
          <div class="trade_order_tab pt-[0.08rem]" v-if="activeFinanceTab == 3">
            <IPOStock
              ref="IPOStockRef"
              scrollDom="#assets_order_center_body"
              :from="'order'"
            />
          </div>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import StockOrderList from "./components/StockOrderList.vue";
import CryptoOrderList from "./components/CryptoOrderList.vue";
import IPOStock from "@/views/Trade2/pages/IPOStock.vue";
import AIOrderList from "./components/AIOrderList.vue";
import List from "@/views/Market/buyCoin/List.vue";
import { useI18n } from "vue-i18n";
import { Tabs, Tab } from "vant";
import CopyOrders from '../../Home/components/CopyOrders.vue';
import PledgeOrder from '@/views/Finance/components/PledgeOrder.vue';
import Order from "@/views/Finance/components/Order.vue";
import SpotOrderList from "./components/SpotOrderList.vue";
import store from "@/store";

const { t } = useI18n();
const activeTab = ref(0);
const activeFinanceTab = ref(0);
const tradeOrderTab = computed(() => store.state.tradeTabType);
const activeMainTab = ref(tradeOrderTab.value + 1);
const IPOStockRef = ref();

const onChange = () => {};

const changeActiveTab = (val) => {
  activeTab.value = val;
};

const changeActiveTab1 = (val) => {
  activeFinanceTab.value = val;
  if (val == 3) {
    setTimeout(() => {
      IPOStockRef.value && IPOStockRef.value.init();
    }, 0);
  }
};

watch(tradeOrderTab, (val) => {
  activeMainTab.value = val + 1
})

</script>
<style lang="less">
.trade_order_container1 {
  width: 100%;
  padding-top: 0.32rem;

  .order-tab {
    position: relative;
    width: 100%;
  }

  .trade_head_tabs {
    > .van-tabs__wrap {
      height: 0.64rem;
      border-bottom: 0.02rem solid var(--ex-bg-white2) !important;
      overflow: visible;
      > .van-tabs__nav {
        background:none;
        display: flex;
        align-items: start;
        > .van-tab {
          position: relative;
          z-index: 11;
          .van-tab__text {
            font-size: 0.32rem !important;
            color: var(--ex-text-color3);
          }
        }
        > .van-tab--active {
          .van-tab__text {
            font-size: 0.4rem !important;
            font-weight: 600;
            color: var(--ex-text-color);
          }
        }
        > .van-tabs__line {
          width: 0.3rem;
          height: 0.04rem;
        }
      }
    }
  }

  .trade_order_tab {
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
  .finance-tab{
    height: calc(var(--vh) * 100 - 4.56rem);
    overflow-y: auto;
    box-sizing: border-box;
  }
}
</style>
