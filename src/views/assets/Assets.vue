<!-- 资产页 -->
<template>
  <div class="page page_assets">
    <!-- 头部 -->
    <HeaderTabs v-model:active="headActiveTab" :tabs="[
      t('assets.assets_center'),
      t('assets.header_order'),
    ]">

      <template #after>
        <div class="size-[0.72rem] rounded-full bg-white1 flex items-center justify-center mr-[0.32rem]"
          @click="LeftRef.open()">
          <span class="size-[0.4rem]">
            <img :src="getStaticImgUrl('/static/home2/menu.svg')" />
          </span>
        </div>
      </template>
    </HeaderTabs>
    <Tabs v-model:active="activeTab" type="custom-card-stake" @change="changeActiveTab(activeTab, true)"
      v-if="headActiveTab == 0">
      <Tab :title="t('assets.header_total')" />
      <Tab :title="t('assets.wallet_cash_value')" />
      <Tab :title="t('assets.wallet_header_contract')" />
    </Tabs>

    <Swipe :autoplay="0" :initial-swipe="initialSwipe" :show-indicators="false" :loop="false" ref="swipe"
      @change="swipeChange" v-if="headActiveTab == 0">
      <SwipeItem>
        <div class="assets_body pb-[0.32rem]">
          <Overview ref="overviewRef" @jumpToWallet="(val) => jumpToWallet(val)"
            @setLoading="(val) => (loading = val)" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="assets_body">
          <Wallet ref="cashRef" :from="'cash'" @setLoading="(val) => (loading = val)" @click="(val) => click(val)" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="assets_body">
          <Wallet ref="cashRef" :from="'futures'" @setLoading="(val) => (loading = val)" @click="(val) => click(val)" />
        </div>
      </SwipeItem>
    </Swipe>

    <!-- 记录弹窗 -->
    <OrderCenter v-else />

    <BottomPopup closeable v-model:show="handle" position="bottom" :style="{
      height: '5.56rem',
      borderTopRightRadius: '0.36rem',
      borderTopLeftRadius: '0.36rem',
      overflow: 'hidden'
    }">
      <div v-if="Object.keys(selectedItem).length" class="w-full h-[5.56rem] relative">
        <div class="w-full flex justify-center text-[0.32rem] text-color leading-[0.44rem] mb-[0.48rem]">
          {{ t('assets.wallet_handle_title') }}
        </div>
        <div class="w-full flex items-center flex-col mb-[0.4rem]">
          <div class="mb-[0.16rem]">
            <div style="width: 1rem; height: 1rem">
              <CryptoIcon :name="selectedItem.name" />
            </div>
          </div>
          <div class="text-[0.3rem] text-color">
            {{ selectedItem.name }}
          </div>
        </div>
        <div class="w-full flex px-[0.32rem] justify-between">
          <div v-if="selectedItem.account == 'money'"
            class="w-[1.565rem] h-[1.75rem] rounded-[0.32rem] bg-topup flex flex-col items-center pt-[0.16rem]" @click="() => {
              router.push({
                name: 'topUpCrypto',
                query: { currency: selectedItem.name },
              });
              handle = false;
            }
            ">
            <div class="mb-[0.16rem]" style="width: 0.8rem;height: 0.8rem;">
              <img v-lazy="getStaticImgUrl(`/static/img/assets/deposit_color.svg`)" alt="">
            </div>
            <div class="text-topup text-[0.32rem]">{{ t('assets.coin_list_recharge') }}</div>
          </div>
          <div v-if="selectedItem.account == 'money'"
            class="w-[1.565rem] h-[1.75rem] rounded-[0.32rem] bg-withdraw flex flex-col items-center pt-[0.16rem]"
            @click="() => {
              router.push({
                name: 'withdraw',
                query: { currency: selectedItem.name },
              });
              handle = false;
            }
            ">
            <div class="mb-[0.16rem]" style="width:0.8rem;height:0.8rem">
              <img v-lazy="getStaticImgUrl(`/static/img/assets/withdraw_color.svg`)" alt="">
            </div>
            <div class="text-withdraw text-[0.32rem]">{{ t('assets.coin_list_withdraw') }}</div>
          </div>
          <div class="h-[1.75rem] rounded-[0.32rem] bg-transfer-in flex flex-col items-center pt-[0.16rem]"
            :class="selectedItem.account == 'money' ? 'w-[1.565rem]' : 'w-[3.27rem]'" @click="() => {
              router.push({
                name: 'transfer',
                query: { to: selectedItem.account },
              });
              handle = false;
            }
            ">
            <div class="mb-[0.16rem]" style="width: 0.8rem;height: 0.8rem;">
              <img v-lazy="getStaticImgUrl(`/static/img/assets/transfer_in.svg`)" alt="">
            </div>
            <div class="text-transfer-in text-[0.32rem]">{{ selectedItem.account == 'money' ? t('transfer.in_sim') :
              t('transfer.in') }}</div>
          </div>
          <div class="h-[1.75rem] rounded-[0.32rem] bg-transfer-out flex flex-col items-center pt-[0.16rem]"
            :class="selectedItem.account == 'money' ? 'w-[1.565rem]' : 'w-[3.27rem]'" @click="() => {
              router.push({
                name: 'transfer',
                query: { from: selectedItem.account },
              });
              handle = false;
            }
            ">
            <div class="mb-[0.16rem]" style="width: 0.8rem;height: 0.8rem;">
              <img v-lazy="getStaticImgUrl(`/static/img/assets/transfer_out.svg`)" alt="">
            </div>
            <div class="text-transfer-out text-[0.32rem]">{{ selectedItem.account == 'money' ? t('transfer.out_sim') :
              t('transfer.out') }}</div>
          </div>
        </div>
      </div>
    </BottomPopup>
    <!-- 充提记录 -->
    <!-- <HintBlock v-if="route.name == 'assets' && hintNum" /> -->
    <!-- 左侧弹窗 -->
    <LeftMenu :jump="jump" ref="LeftRef" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Tab, Tabs, PullRefresh, Swipe, SwipeItem, Popup } from "vant";
import { ref, onMounted, computed, onActivated } from "vue";
import { useRoute } from "vue-router";
import Overview from "./page/Overview.vue";
import store from "@/store";
import router from "@/router";
import HeaderTabs from "@/components/HeaderTabs.vue";
import Wallet from "./page/Wallet.vue";
import OrderCenter from "./page/OrderCenter.vue";
import { _cryptoCoin } from "@/api/api";
import { useI18n } from "vue-i18n";
import { fiat } from "@/utils/dataMap";
import BottomPopup from "@/components/BottomPopup.vue";
import LeftMenu from "../Home/components/LeftMenu.vue";

const { t } = useI18n();
const handle = ref(false);
const LeftRef = ref()
// import HintBlock from "@/components/HintBlock.vue"
const selectedItem = ref({});
const headActiveTab = ref(0);

const activeTab = ref(0);
const assetsActiveTab = localStorage.getItem('assetsActiveTab')
if (assetsActiveTab > 0) {
  activeTab.value = Number(assetsActiveTab);
}
const initialSwipe = ref(activeTab.value);
const loadedTab = ref([activeTab.value]);
const swipe = ref(null);

const token = computed(() => store.state.token)

// 跳转
const jump = (name, needToken, query) => {
  if (needToken && !token.value) {
    LeftRef.value.close()
    setTimeout(() => {
      store.commit("setIsLoginOpen", true);
    }, 0)
    return
  }

  router.push({
    name,
    query
  });
};
const changeActiveTab = (val, slideSwipe = false) => {
  activeTab.value = val;
  if (loadedTab.value.indexOf(val) == -1) {
    loadedTab.value.push(val);
  }
  localStorage.setItem('assetsActiveTab', val)
  if (slideSwipe && swipe.value) {
    swipe.value.swipeTo(val);
  }
  store.dispatch("updateWallet");
  store.dispatch("updateAssets");
};
const swipeChange = (val) => {
  changeActiveTab(val);
};


const jumpToWallet = (val) => {
  store.commit("setCurrSelectedWallet", val);
  changeActiveTab(Number(val), true);
};

const loading = ref(false);

const pageLoading = ref(false);

const overviewRef = ref();
const cashRef = ref();
const onRefresh = () => {
  switch (active.value) {
    case "overview":
      overviewRef.value && overviewRef.value.refresh();
      break;
    case "cash":
      cashRef.value && cashRef.value.refresh();
      break;
  }
};

const click = (val) => {
  selectedItem.value = val;
  handle.value = true;
};

onMounted(() => {
  // 下拉刷新状态监听
  setTimeout(() => {
    // const bodys = document.querySelectorAll('.tab_body')
    // bodys.forEach(item => {
    // item.addEventListener('scroll', (e) => {
    //     if (e.target.scrollTop > 0) {
    //         disabled.value = true
    //     } else {
    //         disabled.value = false
    //     }
    // })
    // })
  }, 500);
});

// 预加载页面
store.commit("setPageLoading", true);
const loadingList = [
  import("@/views/assets/Loan.vue"),
  import("@/views/assets/TopUp.vue"),
  import("@/views/assets/Transfer.vue"),
  import("@/views/assets/Withdraw.vue"),
  import("@/views/assets/Swap.vue"),
];
Promise.all(loadingList).finally(() => {
  store.commit("setPageLoading", false);
  setTimeout(() => {
    pageLoading.value = true;
  }, 100);
});

onActivated(() => {
  // store.dispatch('updateOrderHint')
});
const currencyMapList = ref([]);

const getCoinMap = () => {
  _cryptoCoin({ type: "crypto", dedup: false })
    .then((res) => {
      store.commit("setCoinMap", res.data);

      currencyMapList.value = res.data.reduce((acc, cur) => {
        if (!acc[cur.name]) acc[cur.name] = [];
        acc[cur.name].push(cur.network);
        return acc;
      }, {});

      store.commit("setCurrencyMapList", currencyMapList.value);
    })
    .catch((err) => console.error(err));
};
getCoinMap();
</script>

<style lang="less" scoped>
.page_assets {
  .assets_body {
    overflow-y: auto;
    height: calc(var(--vh) * 100 - 2.52rem);
    padding-bottom: 1rem
  }


}
</style>
