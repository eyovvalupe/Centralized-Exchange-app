<template>
  <div
    class="pledge_order_list_page"
    :class="from == 'order' ? '' : ' px-[0.32rem]'"
    @scroll="scrollHandle"
  >
    <Tabs
      v-if="token"
      key="form"
      :type="from == 'order' ? 'sub-order' : 'sub-stake'"
      v-model:active="activeTab"
      @click-tab="onTabClick"
      :swipeable="false"
      shrink
    >
      <Tab
        name="open"
        style="min-width: 2rem"
        :title="t('finance.defi_borrow_on')"
      >
      </Tab>
      <Tab
        name="close"
        style="min-width: 2rem"
        :title="t('finance.defi_borrow_repaid')"
      >
      </Tab>
    </Tabs>
    <div class="min-h-[10rem] mt-[0.32rem]" :class="from == 'order' ? 'h-[11.2rem] pb-[1rem] overflow-auto'  : ''">
      <UnLogin
        v-if="!isLoading && !list.length && !token"
        @loginfinish="getList()"
      />
      <NoData v-else-if="!isLoading && !list.length" />
      <PledgeOrderList @repay="onRepay" :list="list" />
      <div class="flex items-center justify-center p-[0.4rem]" v-if="isLoading">
        <Loading />
      </div>
    </div>
  </div>
  <BottomPopup
    closeable
    v-model:show="visible"
    :title="t('finance.defi_borrow_return_confirm')"
  >
    <RepayConfirm
      :order="order"
      v-if="visible"
      :repay-amount="repayAmount"
      @success="repaySuccess"
    />
  </BottomPopup>
</template>
<script setup>
  import { useI18n } from 'vue-i18n';
  import { Tabs, Tab, Loading } from 'vant';
  import NoData from '@/components/NoData.vue';
  import PledgeOrderList from './PledgeOrderList.vue';
  import { _pledgeOrders } from '@/api/api';
  import eventBus from '@/utils/eventBus';
  import store from '@/store';
  import UnLogin from '@/components/UnLogin.vue';
  import BottomPopup from '@/components/BottomPopup.vue';
  import RepayConfirm from './RepayConfirm.vue';

  import { computed, onBeforeUnmount, onMounted } from 'vue';

  const props = defineProps({
    from: {
      type: String,
      default: '',
    },
  });

  const activeTab = ref('open');
  const { t } = useI18n();
  const finish = ref(false);
  const list = ref([]);
  const isLoading = ref(false);
  const token = computed(() => store.state.token);
  const currentPage = ref(1);
  const order = ref({});
  const visible = ref(false);
  const repayAmount = ref(0);
  const getList = (page = 1) => {
    if (!token.value) {
      return;
    }
    finish.value = false;
    isLoading.value = true;
    _pledgeOrders({
      page,
      status: activeTab.value,
    })
      .then((res) => {
        if (res.code == 200) {
          if ((res.data && res.data.length) || page == 1) {
            currentPage.value = page;
            list.value =
              page > 1 ? list.value.concat(res.data || []) : res.data || [];
          } else {
            finish.value = true;
          }
        }
      })
      .finally(() => {
        isLoading.value = false;
      });
  };
  getList();
  const onRepay = (data) => {
    order.value = data.order;
    repayAmount.value = data.repayAmount;
    visible.value = true;
  };
  const repaySuccess = () => {
    visible.value = false;
    getList();
  };
  const onPledgeLoad = () => {
    if (isLoading.value || finish.value) {
      return;
    }
    getList(currentPage.value + 1);
  };
  const scrollHandle = (e) => {
    // 获取当前滚动位置

    if (
      e.target.scrollTop + e.target.offsetHeight + 20 >
      e.target.scrollHeight
    ) {
      // 加载更多
      onPledgeLoad();
    }
  };

  const onTabClick = () => {
    list.value = [];
    getList();
  };
  const onPledgeSuccess = () => {
    list.value = [];
    getList();
  };
  onMounted(() => {
    eventBus.on('pledgeSuccess', onPledgeSuccess);
  });
  onBeforeUnmount(() => {
    eventBus.off('pledgeSuccess', onPledgeSuccess);
  });
</script>
<style scoped>
  .pledge_order_list_page {
    height: 100%;
    overflow-y: auto;
  }
</style>
