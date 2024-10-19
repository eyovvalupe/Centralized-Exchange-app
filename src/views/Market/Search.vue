<!-- 搜索页 -->
<template>
  <div class="page page_search">
    <Top class="top_text" :title="'搜索'" :searchText="search" />
    <!-- 搜索框 -->
    <div class="search_box">
      <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.23107 17.6924C11.4752 17.6924 13.6274 16.8009 15.2143 15.214C16.8011 13.6272 17.6926 11.475 17.6926 9.23083C17.6926 6.98669 16.8011 4.83446 15.2143 3.24761C13.6274 1.66077 11.4752 0.769287 9.23107 0.769287C6.98693 0.769287 4.8347 1.66077 3.24786 3.24761C1.66101 4.83446 0.769531 6.98669 0.769531 9.23083C0.769531 11.475 1.66101 13.6272 3.24786 15.214C4.8347 16.8009 6.98693 17.6924 9.23107 17.6924ZM9.23107 16.1539C7.39496 16.1539 5.63404 15.4245 4.33572 14.1262C3.03739 12.8279 2.30799 11.0669 2.30799 9.23083C2.30799 7.39471 3.03739 5.6338 4.33572 4.33547C5.63404 3.03714 7.39496 2.30775 9.23107 2.30775C11.0672 2.30775 12.8281 3.03714 14.1264 4.33547C15.4248 5.6338 16.1541 7.39471 16.1541 9.23083C16.1541 11.0669 15.4248 12.8279 14.1264 14.1262C12.8281 15.4245 11.0672 16.1539 9.23107 16.1539Z" fill="#666D80"/>
        <path d="M13.9781 14.7477C14.1224 14.6035 14.318 14.5225 14.522 14.5225C14.726 14.5225 14.9216 14.6035 15.0658 14.7477L18.3289 18.0108C18.4024 18.0817 18.461 18.1666 18.5013 18.2604C18.5416 18.3543 18.5628 18.4552 18.5637 18.5574C18.5646 18.6595 18.5452 18.7608 18.5065 18.8553C18.4678 18.9499 18.4107 19.0358 18.3385 19.108C18.2662 19.1802 18.1803 19.2373 18.0858 19.276C17.9913 19.3147 17.89 19.3341 17.7878 19.3333C17.6857 19.3324 17.5848 19.3112 17.4909 19.2708C17.3971 19.2305 17.3122 19.1719 17.2412 19.0985L13.9781 15.8354C13.8339 15.6911 13.7529 15.4955 13.7529 15.2915C13.7529 15.0876 13.8339 14.8919 13.9781 14.7477ZM15.0658 15.8354C15.2101 15.6911 15.2911 15.4955 15.2911 15.2915C15.2911 15.0876 15.2101 14.8919 15.0658 14.7477L18.3289 18.0108C18.258 17.9373 18.1731 17.8787 18.0792 17.8384C17.9854 17.7981 17.8844 17.7768 17.7823 17.776C17.6802 17.7751 17.5789 17.7945 17.4843 17.8332C17.3898 17.8719 17.3039 17.929 17.2317 18.0012C17.1595 18.0734 17.1023 18.1593 17.0637 18.2539C17.025 18.3484 17.0055 18.4497 17.0064 18.5518C17.0073 18.654 17.0285 18.7549 17.0688 18.8488C17.1092 18.9426 17.1678 19.0275 17.2412 19.0985L13.9781 15.8354C14.1224 15.9796 14.318 16.0606 14.522 16.0606C14.726 16.0606 14.9216 15.9796 15.0658 15.8354Z" fill="#666D80"/>
      </svg>
      <input
        ref="iptRef"
        @keydown="keydown"
        @keydown.enter="keydownEnter"
        placeholder="搜索"
        type="text"
        enterkeyhint="search"
        v-model.trim="search"
        class="search"
      />

      <div class="type_select" @click="closeSearch" v-show="search.length > 0">
        <div class="type_icon">
          <img src="/static/img/market/close.svg" alt="img" />
        </div>
      </div>
    </div>
    <!-- 结果列表 -->
    <div v-show="marketSearchTextList.length > 0 && !search.length > 0">
      <div class="flex justify-between items-center mb-4">
        <div class="text-[0.32rem]">搜索历史</div>
        <div class="w-[0.4rem] h-[0.4rem]" @click="clearSearchHistory">
          <img src="/static/img/market/clear.svg" />
        </div>
      </div>
      <div class="flex gap-[0.2rem] mb-4 flex-wrap">
        <div
          class="text-[0.28rem] h-[0.6rem] px-[0.16rem] bg-[#F5F7FC] rounded-[0.32rem] items-center flex"
          v-for="(item, i) in marketSearchTextList"
          :key="i"
          @click="handleHistory(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <div
      class="flex justify-between items-center mb-4"
      v-show="!search.length > 0"
    >
      <div class="text-[0.32rem]">热搜推荐</div>
      <div class="w-[0.4rem] h-[0.4rem]" @click="resetData">
        <img
          v-if="!marketSearchTextList.length > 0"
          src="/static/img/market/vector.svg"
        />
        <img v-else src="/static/img/market/vector_b.svg" />
        <div class="re_search" v-if="!marketSearchTextList.length > 0"></div>
      </div>
    </div>
    <div class="list">
      <Loading v-show="!searchList.length && loading" />
      <NoData v-if="!searchList.length && !loading" />
      <div
        class="item"
        v-for="(item, i) in searchList"
        :key="i"
        @click="goItem(item)"
      >
        <div class="info">
          <div class="title flex items-center gap-1">
            {{ item.symbol || "--" }}
            <div
              :class="`${
                marketStyle[item.type]
              } font-normal text-[0.22rem] flex items-center justify-center rounded-[0.08rem] w-[0.6rem] h-[0.3rem] `"
            >
              {{ market[item.type] }}
            </div>
          </div>

          <!-- 给了定值，需要用后端数据该代码 -->
          <div class="text">超2万人搜索</div>
        </div>
        <div @click.stop="collect(item)">
          <!-- <div class="star" v-if="item.watchlist == 1"></div> -->
          <div class="star" v-if="item.watchlist == 1">
            <svg
              width="0.4rem"
              height="0.4rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8934 3.71885C12.3378 4.82671 12.56 5.38066 13.0129 5.71734C13.4657 6.05404 14.0602 6.10727 15.2491 6.21375L15.464 6.23299C17.4099 6.40726 18.3828 6.49439 18.5909 7.11338C18.7991 7.73235 18.0766 8.3897 16.6315 9.70438L16.1493 10.1432C15.4178 10.8087 15.052 11.1414 14.8815 11.5776C14.8497 11.6589 14.8233 11.7423 14.8024 11.8271C14.6903 12.2817 14.7975 12.7645 15.0117 13.7299L15.0783 14.0305C15.472 15.8048 15.6688 16.692 15.3252 17.0746C15.1967 17.2176 15.0298 17.3206 14.8444 17.3712C14.3482 17.5066 13.6437 16.9325 12.2348 15.7844C11.3096 15.0305 10.847 14.6536 10.3159 14.5688C10.107 14.5354 9.89414 14.5354 9.68523 14.5688C9.15414 14.6536 8.69155 15.0305 7.76638 15.7844C6.35743 16.9325 5.65294 17.5066 5.15675 17.3712C4.97133 17.3206 4.80443 17.2176 4.67599 17.0746C4.33232 16.692 4.52915 15.8048 4.92282 14.0305L4.9895 13.7299C5.20371 12.7645 5.31082 12.2817 5.19875 11.8271C5.17786 11.7423 5.15142 11.6589 5.11962 11.5776C4.94915 11.1414 4.58339 10.8087 3.85189 10.1432L3.36961 9.70438C1.92457 8.3897 1.20204 7.73235 1.41023 7.11338C1.6184 6.49439 2.59131 6.40726 4.53712 6.23299L4.75205 6.21375C5.94097 6.10727 6.53543 6.05404 6.98829 5.71734C7.44113 5.38066 7.66333 4.82671 8.10772 3.71885L8.14436 3.62754C8.93096 1.66653 9.32425 0.686035 10.0006 0.686035C10.6769 0.686035 11.0702 1.66653 11.8568 3.62754L11.8934 3.71885V3.71885Z"
                fill="#014cfa"
                stroke="#014cfa"
                stroke-width="1.2"
              />
            </svg>
          </div>
          <div class="unstar" v-else>
            <svg
              width="0.4rem"
              height="0.4rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8934 3.71885C12.3378 4.82671 12.56 5.38066 13.0129 5.71734C13.4657 6.05404 14.0602 6.10727 15.2491 6.21375L15.464 6.23299C17.4099 6.40726 18.3828 6.49439 18.5909 7.11338C18.7991 7.73235 18.0766 8.3897 16.6315 9.70438L16.1493 10.1432C15.4178 10.8087 15.052 11.1414 14.8815 11.5776C14.8497 11.6589 14.8233 11.7423 14.8024 11.8271C14.6903 12.2817 14.7975 12.7645 15.0117 13.7299L15.0783 14.0305C15.472 15.8048 15.6688 16.692 15.3252 17.0746C15.1967 17.2176 15.0298 17.3206 14.8444 17.3712C14.3482 17.5066 13.6437 16.9325 12.2348 15.7844C11.3096 15.0305 10.847 14.6536 10.3159 14.5688C10.107 14.5354 9.89414 14.5354 9.68523 14.5688C9.15414 14.6536 8.69155 15.0305 7.76638 15.7844C6.35743 16.9325 5.65294 17.5066 5.15675 17.3712C4.97133 17.3206 4.80443 17.2176 4.67599 17.0746C4.33232 16.692 4.52915 15.8048 4.92282 14.0305L4.9895 13.7299C5.20371 12.7645 5.31082 12.2817 5.19875 11.8271C5.17786 11.7423 5.15142 11.6589 5.11962 11.5776C4.94915 11.1414 4.58339 10.8087 3.85189 10.1432L3.36961 9.70438C1.92457 8.3897 1.20204 7.73235 1.41023 7.11338C1.6184 6.49439 2.59131 6.40726 4.53712 6.23299L4.75205 6.21375C5.94097 6.10727 6.53543 6.05404 6.98829 5.71734C7.44113 5.38066 7.66333 4.82671 8.10772 3.71885L8.14436 3.62754C8.93096 1.66653 9.32425 0.686035 10.0006 0.686035C10.6769 0.686035 11.0702 1.66653 11.8568 3.62754L11.8934 3.71885V3.71885Z"
                fill="none"
                stroke="#666D80"
                stroke-width="1.2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Top from "@/components/Top";
import {
  Icon,
  showToast,
  showLoadingToast,
  closeToast,
  ActionSheet,
} from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _search } from "@/api/api";
import Loading from "@/components/Loaidng.vue";
import store from "@/store";
import router from "@/router";
import { _add, _del } from "@/api/api";
import NoData from "@/components/NoData.vue";
import eventBus from "@/utils/eventBus";

const market = {
  stock: "股票",
  crypto: "合约",
  forex: "外汇",
};
const marketStyle = {
  stock: "text-[#014CFA] bg-[rgba(1,76,250,0.1)] ",
  crypto: "text-[#FFAF2A] bg-[rgba(255,175,42,0.1)] ",
  forex: "text-[#18B762] bg-[rgba(24,183,98,0.1)] ",
};
onBeforeUnmount(() => {
  eventBus.off("loginSuccess");
});

const iptRef = ref();
const search = ref("");
const loading = ref(false);
const token = computed(() => store.state.token);

// 搜索相关
const searchList = computed(() => store.state.marketSearchList);
const marketSearchTextList = computed(() => store.state.marketSearchTextList);
const handleHistory = (data) => {
  search.value = data;
  resetData();
};
const closeSearch = () => {
  search.value = "";
  resetData();
};
const clearSearchHistory = () => {
  store.commit("setMarketSearchTextList", []);
};
const getData = () => {
  // 获取数据
  loading.value = true;
  _search({
    // market: currAs.value == 'stock' ? 'stock' : '', // currAs.value
    symbol: search.value,
    // page: 1,
  })
    .then((res) => {
      console.log(res.data);
      store.commit("setMarketSearch", {
        search: search.value,
        list: res.data || [],
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
const resetData = () => {
  // 搜索
  store.commit("setMarketSearch", {
    search: "",
  });
  getData();
};

let timeout = null;
const keydown = () => {
  // 输入事件监听
  setTimeout(() => {
    if (timeout) clearTimeout(timeout);
    // if (!search.value) return
    timeout = setTimeout(() => {
      resetData();
    }, 500);
  }, 0);
};
const keydownEnter = () => {
  resetData();
};

if (!searchList.value.length) {
  // 初始化如果没有内容就触发搜索
  getData();
}

onMounted(() => {
  // 进入页面聚焦
  search.value = "";
  resetData();
  setTimeout(() => {
    iptRef.value.focus();
  }, 500);
});

// 查看详情
const goItem = (item) => {
  var prevList = [...marketSearchTextList.value];
  var flag = false;
  prevList.map((list) => {
    if (list.toUpperCase() == item.symbol.toUpperCase()) flag = true;
  });
  var newList = flag ? prevList : [...prevList, item.symbol];

  store.commit("setMarketSearchTextList", newList);
  store.commit("setCurrStock", item);
  setTimeout(() => {
    router.push({
      name: "market_info",
      query: {
        symbol: item.symbol,
        type: "stock",
      },
    });
  }, 100);
};

// 收藏
const collectLoading = ref(false);
const reqMap = {
  0: _add,
  1: _del,
};
const collect = (item) => {
  if (!token.value) {
    store.commit("setIsLoginOpen", true);
    eventBus.on("loginSuccess", () => {
      getData();
      eventBus.off("loginSuccess");
    });
    // router.push({
    //     name: 'login',
    //     query: {
    //         reurl: 'search'
    //     }
    // })
  } else {
    if (collectLoading.value) return;
    collectLoading.value = true;
    if (!reqMap[item.watchlist || 0]) return (collectLoading.value = false);
    showLoadingToast({
      duration: 0,
      loadingType: "spinner",
    });
    reqMap[item.watchlist || 0]({
      symbol: item.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            showToast(item.watchlist ? "添加成功" : "移除成功");
          }, 300);
          const i = searchList.value.find((a) => a.symbol == item.symbol);
          if (i) {
            i.watchlist = i.watchlist == 1 ? 0 : 1;
            store.commit("setMarketSearch", {
              search: search.value,
              list: searchList.value,
            });
          }
        }
      })
      .finally(() => {
        closeToast();
        collectLoading.value = false;
      });
  }
};

Promise.all([import("@/views/Market/MarketInfo.vue")]);
</script>

<style lang="less" scoped>
.page_search {
  padding: 1.32rem 0.32rem 0.24rem 0.32rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .top_text {
    font-size: 0.36rem;
    line-height: 0.64rem;
  }

  .search_box {
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    margin-bottom: 0.4rem;
    height: 0.8rem;
    background-color: #f4f5f7;
    border-radius: 0.4rem;

    .type_select {
      right: 0;
      display: flex;
      align-items: center;
      color: #253146;
      font-size: 0.24rem;

      .type_icon {
        width: 0.32rem;
        height: 0.32rem;
        opacity: 0.8;
        margin-left: 0.06rem;
      }
    }

    &:has(.search:focus) {
      border: 1px solid #014cfa;
    }

    .icon {
      width: 0.4rem;
      height: 0.4rem;
    }

    .close {
      width: 0.24rem;
      height: 0.24rem;
      color: #121826;
    }

    .search {
      flex: 1;
      margin: 0 0.16rem;
      font-size: 0.3rem;
      line-height: 0.5rem;
      font-weight: 400;
    }
  }
  /* Star_light */

  .list {
    flex: 1;
    overflow-y: auto;

    .item {
      height: 1.12rem;
      display: flex;
      align-items: center;
      background-color: #f4f5f7;
      margin-bottom: 0.2rem;
      border-radius: 0.3rem;
      padding-inline: 0.26rem;

      .info {
        flex: 1;
        overflow: hidden;

        .title {
          color: #061023;
          font-size: 0.32rem;
        }

        .text {
          color: #8f92a1;
          font-size: 0.24rem;
          font-weight: 400;
          margin-top: 0.18rem;
        }
      }

      .re_search {
        width: 0.4rem;
        height: 0.4rem;
        display: inline-block;
        position: relative;
      }

      .re_search::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #014cfa;
        clip-path: path(
          "M3.46257 2.43262C5.21556 0.91688 7.5007 0 10 0C15.5228 0 20 4.47715 20 10C20 12.1361 19.3302 14.1158 18.1892 15.7406L15 10H18C18 5.58172 14.4183 2 10 2C7.84982 2 5.89777 2.84827 4.46023 4.22842L3.46257 2.43262ZM16.5374 17.5674C14.7844 19.0831 12.4993 20 10 20C4.47715 20 0 15.5228 0 10C0 7.86386 0.66979 5.88416 1.8108 4.25944L5 10H2C2 14.4183 5.58172 18 10 18C12.1502 18 14.1022 17.1517 15.5398 15.7716L16.5374 17.5674Z"
        );
      }
    }
  }
}
</style>
