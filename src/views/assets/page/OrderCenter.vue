<template>
  <div class="order_container">
    <div>
      <div
        class="order_tabs"
        @touchstart.stop=""
        @touchmove.stop=""
        @touchend.stop=""
      >
        <HeaderTabs
          type="line"
          v-model:active="activeTab"
          :tabs="[
            t('买币'),
            t('股票'),
            t('币币'),
            t('合约'),
            t('交易机器人'),
            t('跟单'),
            t('DeFi借币'),
            t('质押挖矿'),
            t('IPO'),
          ]"
          @change="changeActiveTab(activeTab)"
        />
      </div>
      <div id="assets_order_center_body" ref="orderCenterRef">
        <div class="tab pt-[0.4rem]" v-if="activeTab == 0">
          <RecordBuyCoin :from="'order'" />
        </div>

        <div class="tab px-[0.32rem]" v-if="activeTab == 1">
          <StockBlock :from="'order'" class="mt-[0.4rem]" />
        </div>
        
        <div class="tab" v-if="activeTab == 2">
          <Tabs
            type="custom-sub"
            v-model:active="active"
            :swipeable="false"
            :color="'var(--ex-primary-color)'"
            shrink
            @change="onChange"
          >
            <Tab :title="'当前委托'" :name="0">
              <div class="px-[0.32rem]">
                <SpotPosition />
              </div>
            </Tab>
            <Tab :title="'历史订单'" :name="1">
              <div class="px-[0.32rem]">
                <SpotInquire />
              </div>
            </Tab>
          </Tabs>
        </div>
        <div class="tab px-[0.32rem]" v-if="activeTab == 3">
          <Tabs
            type="sub-order"
            v-model:active="active"
            :swipeable="false"
            :color="'var(--ex-primary-color)'"
            shrink
            @change="onChange"
          >
            <Tab :title="'当前委托'" :name="0" class="pt-[0.32rem]">
              <ContractPosition />
            </Tab>
            <Tab :title="'历史订单'" :name="1" class="pt-[0.32rem]">
              <ContractInquire />
            </Tab>
          </Tabs>
        </div>
        <div class="tab px-[0.32rem]" v-if="activeTab == 4">
          <Tabs
            type="sub-order"
            v-model:active="active"
            :swipeable="false"
            :color="'var(--ex-primary-color)'"
            shrink
            @change="onChange"
          >
            <Tab :title="'当前委托'" :name="0">
              <AiPosition />
            </Tab>
            <Tab :title="'历史订单'" :name="1">
              <AiInquire />
            </Tab>
          </Tabs>
        </div>
        <div class="tab" v-if="activeTab == 5">
          <CopyOrders :from="'order'"/>
        </div>
        <div class="tab" v-if="activeTab == 6">
          <PledgeOrder :from="'order'"/>
        </div>
        <div class="tab" v-if="activeTab == 7">
          <Order :from="'order'" />
        </div>
        <div class="tab px-[0.32rem]" v-if="activeTab == 8">
          <IPOstock :from="'order'" ref="ipoRef"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import HeaderTabs from '@/components/HeaderTabs.vue';
  import TradeOrderList from './components/TradeOrderList.vue';
  import CryptoOrderList from './components/CryptoOrderList.vue';
  import Order from '@/views/Finance/components/Order.vue';
  import PledgeOrder from '@/views/Finance/components/PledgeOrder.vue';
  import { useI18n } from 'vue-i18n';
  import AIOrderList from './components/AIOrderList.vue';
  import CopyOrders from '../../Home/components/CopyOrders.vue';
  import eventBus from '@/utils/eventBus';
  import RecordBuyCoin from '@/views/Market/buyCoin/List.vue';
  import { Tabs, Tab } from 'vant';
  import StockBlock from '../../Trade2/pages/StockBlock.vue';
  import IPOstock from '../../Trade2/pages/IPOStock.vue';
  import SpotPosition from '@/views/Trade2/spot/Positions.vue';
  import SpotInquire from '@/views/Trade2/spot/Inquire.vue';
  import ContractPosition from '@/views/Trade2/contract/Positions.vue';
  import ContractInquire from '@/views/Trade2/contract/Inquire.vue';
  import AiPosition from '@/views/Trade2/ai/Positions.vue';
  import AiInquire from '@/views/Trade2/ai/Inquire.vue';

  const { t } = useI18n();
  const activeTab = ref(0);
  const ipoRef = ref()
  const changeActiveTab = (val) => {
    activeTab.value = val;
  };

  const orderCenterRef = ref(null);
  const scrollData = useScroll(orderCenterRef, {
    throttle: 200,
    onScroll: (e) => {
      if (
        e.target.offsetHeight + e.target.scrollTop + 20 >
          e.target.scrollHeight &&
        activeTab.value == 4
      ) {
        eventBus.emit('pledgeLoad');
      }
    },
  });
  provide('scrollData', scrollData);
</script>
<style lang="less">
  #assets_order_center_body {
    overflow-y: auto;
    height: calc(var(--vh) * 100 - 2.52rem);
    padding-bottom: 1rem;
  }
</style>
