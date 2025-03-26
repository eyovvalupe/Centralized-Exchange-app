<template>
  <div class="w-full h-full">
    <div class="page-trade3 relative" ref="tradePageRef">

      <!-- 作为完整页面的菜单 -->
      <HeaderTabs type="normal" @change="changeTab" :from="'tradeInfo'" v-model:active="headActiveTab"
        :tabs="[t('trade.left_mine'), t('market.market_header_buy'), t('market.market_item_detail')]">
        <template #after>
          <div class="flex items-center gap-[0.16rem] mr-[0.34rem]">
            <div class="size-[0.72rem] bg-white1 rounded-full ripple-btn flex items-center justify-center transition"
              @click="router.push({ name: 'search' })">
              <div class="size-[0.44rem]">
                <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="" />
              </div>
            </div>

            <div class="size-[0.72rem] bg-white1 rounded-full ripple-btn flex items-center justify-center transition"
              @click="openRightMenu" :class="{ 'bg-primary': showRightMenu }">
              <div class="size-[0.44rem]">
                <img v-lazy="getStaticImgUrl('/static/home2/menu.svg')" alt="" />
              </div>
            </div>
          </div>
        </template>
      </HeaderTabs>

      <!-- <div class="bill-box" @click="jump('tradeOrder')">
          <img v-lazy="getStaticImgUrl('/static/img/common/bill.svg')" alt="">
        </div> -->
      <div v-if="headActiveTab == 0 && !props.innerPage">
        <div style="height: 0.12rem;"></div>
        <div v-if="loaded && headActiveTab == 0">
          <div v-if="token">
            <Loaidng v-if="watchListLoading" :loading="watchListLoading" />
            <div style="padding-bottom: 0.2rem;overflow: visible;" v-if="headActiveTab == 0 && !watchListLoading">
              <StockItem :handleClick="checkGoTrade" :padding="true" :showIcon="false" :item=item
                v-for="(item, i) in (watchList)" :key="'c_' + i" menuType="option" marketType="crypto" />
            </div>
            <NoData v-if="!watchListLoading && !watchList.length" />
          </div>
          <div v-if="!token" class="flex flex-col pt-[0.32rem] pb-[0.32rem]">
            <div
              class="w-full flex justify-between border-b-[0.02rem] pb-[0.2rem] mb-[0.6rem] px-[0.32rem] border-b-color2">
              <div class="text-color2">{{ $t('copy.copy_order_name') }}</div>
              <div class="text-color2">{{ $t('market.market_optional_crypto_price') + ' / ' +
                $t('copy.copy_belong_pl_rate') }}</div>
            </div>

            <div style="width: 100%;text-align: center;margin: 0.6rem 0 0.4rem 0;color: var(--ex-placeholder-color);">
              <div style="width:1.12rem;height:1.12rem;margin: 0 auto 0.2rem auto;">
                <img v-lazy="getStaticImgUrl('/static/img/user/unlogin-user.png')" alt="">
              </div>
              <div>{{ $t('market.market_login_first') }}</div>
            </div>
            <div class="flex justify-center gap-[0.4rem]">
              <div style="min-width: 2rem;"
                class="px-[0.28rem] h-[0.8rem] rounded-[0.4rem] bg-[var(--ex-bg-color2)] flex items-center justify-center text-[0.32rem] text-white ripple-primary"
                @click="jump('login')">{{ $t('trade.stock_opening_token_login') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="headActiveTab == 1">
        <BuyCoin style="padding-top: 0.04rem;" v-if="loaded && headActiveTab == 1" />
      </div>
      <div v-if="headActiveTab == 2">
        <div style="height: 0.12rem;"></div>
        <Recommend @handleClick="handleClick" :innerPage="props.innerPage"
          v-if="(props.innerPage && loaded) || (activated && loaded)" ref="recommendRef" from="trade" :sticky="false"
          :activated="activated" />
      </div>

    </div>
  </div>



  <!-- 弹出菜单 -->
  <Popup round v-model:show="showRight" position="right" :style="{ width: '70%', height: '100%' }">
    <div class="left-menu-popup" v-if="recommendRef">
      <div @click="changeTabHandle(0)" class="left-menu-item"
        :class="{ 'left-menu-active': recommendRef.activeTab == 0 }">
        <span>自选</span>
        <div class="icon" v-if="recommendRef.activeTab == 0">
          <img :src="getStaticImgUrl('/static/img/market/ok.svg')" alt="" />
        </div>
      </div>
      <div @click="changeTabHandle(5)" class="left-menu-item"
        :class="{ 'left-menu-active': recommendRef.activeTab == 5 }">
        <span>买币</span>
        <div class="icon" v-if="recommendRef.activeTab == 5">
          <img :src="getStaticImgUrl('/static/img/market/ok.svg')" alt="" />
        </div>
      </div>
      <div @click="changeTabHandle(6)" class="left-menu-item"
        :class="{ 'left-menu-active': recommendRef.activeTab == 6 }">
        <span>股票</span>
        <div class="icon" v-if="recommendRef.activeTab == 6">
          <img :src="getStaticImgUrl('/static/img/market/ok.svg')" alt="" />
        </div>
      </div>
      <div @click="changeTabHandle(1)" class="left-menu-item"
        :class="{ 'left-menu-active': recommendRef.activeTab == 1 }">
        <span>币币</span>
        <div class="icon" v-if="recommendRef.activeTab == 1">
          <img :src="getStaticImgUrl('/static/img/market/ok.svg')" alt="" />
        </div>
      </div>
      <div @click="changeTabHandle(2)" class="left-menu-item"
        :class="{ 'left-menu-active': recommendRef.activeTab == 2 }">
        <span>合约</span>
        <div class="icon" v-if="recommendRef.activeTab == 2">
          <img :src="getStaticImgUrl('/static/img/market/ok.svg')" alt="" />
        </div>
      </div>
      <div @click="changeTabHandle(7)" class="left-menu-item"
        :class="{ 'left-menu-active': recommendRef.activeTab == 7 }">
        <span>外汇</span>
        <div class="icon" v-if="recommendRef.activeTab == 7">
          <img :src="getStaticImgUrl('/static/img/market/ok.svg')" alt="" />
        </div>
      </div>
      <div @click="changeTabHandle(8)" class="left-menu-item"
        :class="{ 'left-menu-active': recommendRef.activeTab == 8 }">
        <span>大宗交易</span>
        <div class="icon" v-if="recommendRef.activeTab == 8">
          <img :src="getStaticImgUrl('/static/img/market/ok.svg')" alt="" />
        </div>
      </div>
      <div @click="changeTabHandle(3)" class="left-menu-item"
        :class="{ 'left-menu-active': recommendRef.activeTab == 3 }">
        <span>交易机器人</span>
        <div class="icon" v-if="recommendRef.activeTab == 3">
          <img :src="getStaticImgUrl('/static/img/market/ok.svg')" alt="" />
        </div>
      </div>
    </div>
  </Popup>

  <CheckJump ref="CheckJumpRef" />
</template>

<script setup>
import BuyCoin from "@/views/Market/buyCoin/index.vue";
import { Popup } from "vant";
import Recommend from "@/views/Home/Homes/Recommend.vue";
import {
  ref,
  onActivated,
  onDeactivated,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import { useSocket } from "@/utils/ws";
import store from "@/store";
import { getStaticImgUrl } from "@/utils/index.js";
import router from "@/router";
import BottomPopup from "@/components/BottomPopup.vue";
import StockTable from "@/components/StockTable.vue";
import { _futures } from "@/api/api";
import { useI18n } from "vue-i18n";
import NoData from "@/components/NoData.vue";
import { useRoute } from "vue-router";
import HeaderTabs from "@/components/HeaderTabs.vue";
import Loaidng from "@/components/Loaidng.vue";
import { _watchlist } from "@/api/api";
import StockItem from "@/components/StockItem.vue";
import CheckJump from "@/components/CheckJump.vue"

const route = useRoute();
const emits = defineEmits(["handleClick"]);
const token = computed(() => store.state.token);
const props = defineProps({
  innerPage: {
    type: Boolean,
    default: false,
  },
});

// 检测并跳转
const CheckJumpRef = ref();
const checkGoTrade = item => {
  CheckJumpRef.value && CheckJumpRef.value.check(item)
}

const headActiveTab = ref(Number(sessionStorage.getItem("tradeMarketType")));
const changeTab = (val) => {
  sessionStorage.setItem('tradeMarketType', val);
  headActiveTab.value = val;
  if (val == 0) {
    init()
  }
};
if (props.innerPage || !token.value) {
  headActiveTab.value = 2
}
watch(route, (val) => {
  if (val.name == "trade" && val.query.marketType) {
    switch (val.query.marketType) {
      case 'optional':
        changeTab(0)
        break
      case 'one_click':
        changeTab(1)
        break
      case 'stock':
      case 'spot':
      case 'futures':
      case 'ai':
      case 'forex':
      case 'commodities':
        changeTab(2)
        break
    }
  }
}, { immediate: true })


const showRight = ref(false);
const changeTabHandle = (val) => {
  showRight.value = false;
  recommendRef.value.tabChange(val);
};

const jump = (name) => router.push(name);
const { t } = useI18n();
const focusRef = ref(false);
const searchList = computed(() => store.state.searchList);
const contractList = computed(() => store.state.contractList);
const showRightMenu = computed(() => store.state.showRightMenu);
const searchRef = ref("");
const { startSocket } = useSocket();


let timeout = null;
const inputHandle = () => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (searchRef.value) goSearch();
  }, 600);
};

const openRightMenu = () => {
  store.commit("setShowRightMenu", !showRightMenu.value);
};

const goSearch = () => {
  if (!searchRef.value) return;
  if (searchLoading.value) return;
  searchList.value = [];
  searchLoading.value = true;
  _futures({
    type: "",
    name: searchRef.value,
  })
    .then((res) => {
      store.commit("setSearchList", res.data);
      console.error('-------', 3)
      store.dispatch("subList", {
        listKey: "searchList",
      });
    })
    .finally(() => (searchLoading.value = false));
};

const activated = ref(false);
const act = () => {
  store.commit("setMarketWatchKeys", []);
  if (route.query.tab) {
    sessionStorage.setItem(`rec_tab_trade`, route.query.tab);
  }
};
const unact = () => {
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit("realtime", ""); // 价格变化
    socket && socket.emit("snapshot", ""); // 快照数据
    socket && socket.off("realtime");
    socket && socket.off("snapshot");
  });
};

const tradePageRef = ref(null);
const scrollData = useScroll(tradePageRef, {
  throttle: 200,
});
provide("scrollData", scrollData);

onActivated(() => {
  activated.value = true;
  act();
});
onDeactivated(() => {
  unact();
  activated.value = false;
});

const loaded = ref(false);
onMounted(() => {
  setTimeout(() => {
    loaded.value = true;
  }, 500);
});
onUnmounted(() => {
  unact();
  loaded.value = false;
});

const handleClick = (obj) => {
  // 如果作为侧窗点击元素
  console.error("-----", obj);
  // emits('handleClick', obj)
};

const recommendRef = ref();





// 订阅的数据

const watchList = computed(() => store.state.marketWatchList || []);
const watchListLoading = ref(false);
const getWatchList = () => {
  if (watchListLoading.value) return;
  watchListLoading.value = true;
  _watchlist()
    .then(res => {
      if (res.code == 200) {
        const list = res.data.map(item => {
          const target = watchList.value.find(a => a.symbol == item.symbol)
          if (target) return target;
          return item;
        })
        store.commit("setMarketWatchList", list || []);
        sessionStorage.setItem('market_watch_list', JSON.stringify(list || []))
        setTimeout(() => {
          console.error('-------', 2)
          store.dispatch('subList', {
            commitKey: 'setMarketWatchList',
            listKey: 'marketWatchList'
          })
        }, 50);
      }
    })
    .finally(() => watchListLoading.value = false);
}

const init = () => {
  if (token.value && headActiveTab.value == 0) getWatchList();
}

init()


defineExpose({
  act,
});
</script>

<style lang="less" scoped>
.search_dialog_trade {
  .lists {
    height: calc(var(--vh) * 60);
    overflow-y: auto;
    margin-top: 0.32rem;
  }

  .search_box {
    height: 0.8rem;
    padding: 0 0.32rem;
    margin: 0.4rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: var(--ex-bg-white1);
    border-radius: 0.6rem;
    // border: 1px solid var(--ex-border-color2);

    .search_icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.24rem;
    }

    .ipt {
      height: 100%;
      font-weight: 400;
    }

    .ipt::placeholder {
      color: var(--ex-text-color4);
    }
  }
}

.left-menu-popup {
  height: 100%;
  padding: 0;
  background-color: var(--ex-bg-color9);

  .left-menu-item {
    padding: 0.3rem 0.4rem;
    color: var(--ex-text-color2);
    font-size: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .icon {
      width: 0.48rem;
      height: 0.48rem;
    }
  }

  .left-menu-active {
    background-color: var(--ex-bg-color2);
    color: var(--ex-primary-color);
  }
}

.page-trade3 {
  width: 100%;
  height: 100%;
  padding: 0 0 1.4rem 0;
  overflow-y: auto;
  position: relative;
  background-color: var(--ex-bg-color);

  // .img {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   opacity: 0;
  //   transition: opacity 0.2s ease-in;
  // }

  .lists {
    height: calc(var(--vh) * 60);
    overflow-y: auto;
    margin-top: 0.32rem;
    padding: 0 0.32rem;
  }

  .transition {
    transition: all 0.3s ease-in;
  }

  .search-bg {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 1.34rem;
    padding: 0.16rem 0.32rem 0 0.32rem;
    z-index: 999;
    // background-color: var(--ex-bg-color5);

    .bill-box {
      width: 0.64rem;
      height: 0.64rem;
      border-radius: 50%;
      background-color: var(--ex-bg-color2);
      position: absolute;
      right: 0.32rem;
      padding: 0.16rem;
      top: 1.32rem;
    }
  }

  .search-box {
    height: 0.92rem;
    border-radius: 0.92rem;
    background-color: var(--ex-bg-color5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.3rem;

    .search-icon {
      width: 0.32rem;
      height: 0.32rem;
      margin-right: 0.3rem;
    }

    .ipt {
      height: 100%;
      flex: 1;
      align-items: center;
      display: flex;
      justify-content: flex-start;
      color: var(--ex-placeholder-color);
    }
  }
}
</style>
