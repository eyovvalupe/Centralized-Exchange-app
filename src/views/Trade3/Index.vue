<template>
  <div class="w-full h-full">
    <div class="page-trade3">
      <div class="z-[1] fixed pt-[0.45rem] pb-[0.48rem] bg-color max-width" style="width:100%;">
        <div
          class="transition flex justify-between  px-[0.32rem] py-[0.18rem] rounded-[1rem] gap-[0.2rem] h-[0.8rem] mx-[0.4rem] items-center border-[0.02rem]"
          :class="focusRef ? 'border-white' : ''" style="background-color: var(--ex-bg-white1);">
          <div class="w-[0.5rem] h-[0.5rem]">
            <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="">
          </div>
          <div class="text-[0.32rem] text-color2 leading-[0.5rem] border-r-[1px] flex-1 px-[0.1rem]">
            <input style="flex:1;width: 100%;" v-model.trim="searchRef" class="text-white"
              :placeholder="'输入币对'" @input="inputHandle" @focus="focusRef = true"
              @blur="focusRef = false" />
          </div>
        </div>
      </div>

      <!-- <div class="bill-box" @click="jump('tradeOrder')">
          <img v-lazy="getStaticImgUrl('/static/img/common/bill.svg')" alt="">
        </div> -->

      <div v-if="!focusRef && !searchRef">
        <Recommend v-if="activated" ref="recommendRef" from="trade" :sticky="true" :activated="activated" />
      </div>

      <div v-if="focusRef || searchRef">
        <div class="mt-[1.7rem] pl-[0.38rem] pr-[0.32rem] text-[0.28rem] leading-[0.4rem]  pb-[0.08rem]"
          style="border-bottom: 1px solid var(--ex-border-color5);color:var(--ex-text-color2)">搜索结果</div>
        <div class="lists" style=" 
    border-radius: 0.32rem;
    margin-left: 0.32rem;
    margin-right: 0.32rem;
    padding-left: 0;
    padding-right: 0;
    min-height: calc(var(--vh) * 100 - 4rem);">
          <StockTable :from="'trade'" :showIcon="true" theme="classic" :handleClick="goInfo" :loading="searchLoading"
            :key="'search'" :list="searchList" />
        </div>
      </div>
    </div>
  </div>

  <!-- 搜索列表 -->
  <BottomPopup round v-model:show="showSearchDialog" position="bottom" closeable teleport="body">
    <div class="van-popup-custom-title">
      {{ recommendRef.activeTab == 0 ? $t('common.spot') : $t('common.crypto') }}{{ t("trade.stock_opening_search") }}
    </div>
    <div class="search_dialog_trade">
      <!-- 搜索 -->
      <div class="item search_box">
        <div class="search_icon">
          <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
        </div>
        <input v-model.trim="searchDialogStr" @keyup="goDialogSearch" type="text" class="ipt" style="width: 100%"
          :placeholder="t('trade.stock_opening_search')" />
      </div>

      <div class="lists">
        <StockTable :from="'trade'" :showIcon="true" theme="classic" :handleClick="goInfo" :loading="searchLoading"
          :key="'search'" :list="marketSearchList" />
      </div>
    </div>
  </BottomPopup>
</template>

<script setup>
import Recommend from "@/views/Home/Homes/Recommend.vue"
import { ref, onActivated, onDeactivated, computed, watch } from "vue"
import { useSocket } from "@/utils/ws";
import store from "@/store"
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import BottomPopup from "@/components/BottomPopup.vue";
import StockTable from "@/components/StockTable.vue";
import { _futures } from "@/api/api";
import { useI18n } from "vue-i18n";
import NoData from "@/components/NoData.vue";

const jump = name => router.push(name)
const { t } = useI18n();
const focusRef = ref(false)
const searchList = computed(() => store.state.searchList)
const contractList = computed(() => store.state.contractList)
const searchRef = ref('')
const { startSocket } = useSocket();
// 订阅 
const subs = () => {
  store.commit("setMarketWatchKeysByPage");
  store.dispatch("subList", {});
};

let timeout = null
const inputHandle = () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    if (searchRef.value) goSearch()
  }, 600);
}

const goSearch = () => {
  if (!searchRef.value) return;
  if (searchLoading.value) return;
  searchList.value = [];
  searchLoading.value = true;
  _futures({
    type: '',
    name: searchRef.value
  })
    .then(res => {
      store.commit('setSearchList', res.data)
      store.dispatch('subList', {
        listKey: 'searchList'
      })
    })
    .finally(() => searchLoading.value = false);
}

const activated = ref(false);
onActivated(() => {
  store.commit("setMarketWatchKeys", []);
  setTimeout(() => {
    activated.value = true;
  }, 300)
  subs();
});
onDeactivated(() => {
  activated.value = false;
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit("realtime", ""); // 价格变化
    socket && socket.emit("snapshot", ""); // 快照数据
    socket && socket.off("realtime");
    socket && socket.off("snapshot");
  });

});

const recommendRef = ref()
const goInfo = (item) => {
  showSearchDialog.value = false
  store.commit("setCurrConstract", item);
  router.push({
    name: "tradeInfo",
    query: {
      symbol: item.name,
      type: "constract",
      tradeType: recommendRef.value && recommendRef.value.activeTab == 0 ? 'spot' : 'constract'
    },
  });
};

// 搜索
const marketSearchList = computed(() => store.state.futuresSearchList)
const showSearchDialog = ref(false);
const searchDialogStr = ref("");
let searchTimeout = null;
const searchLoading = ref(false);
const goDialogSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchLoading.value = true;
  let s = searchDialogStr.value;
  searchTimeout = setTimeout(() => {
    _futures({
      name: s,
      type: "",
    })
      .then((res) => {
        if (searchDialogStr.value == s) {
          let arr = (res.data || []).map((item) => {
            const target = marketSearchList.value.find(
              (a) => a.symbol == item.symbol
            );
            if (target)
              return {
                ...target,
                ...item,
              };
            return item;
          });
          store.commit("setFuturesSearchList", arr);
          store.dispatch("subList", {
            commitKey: "setFuturesSearchList",
            listKey: "futuresSearchList",
          });
        }
      })
      .finally(() => {
        searchLoading.value = false;
      });
  }, 100);
};
setTimeout(() => {
  goDialogSearch()
}, 2000)

// watch(searchRef, (val) => {
//   if (!val) {
//     setTimeout(() => {
//       store.commit('setSearchList', [])
//     }, 100);
//   }
// })
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


.page-trade3 {
  width: 100%;
  height: 100%;
  padding: 0 0 1.4rem 0;
  overflow-y: auto;
  position: relative;
  background-color: var(--ex-bg-color);

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