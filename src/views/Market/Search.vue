<!-- 搜索页 -->
<template>
  <div class="page page_search">
    <Top :title="'搜索'" :searchText="search" />
    <!-- 搜索框 -->
    <div class="search_box">
      <div class="icon">
        <img src="/static/img/common/search.png" alt="🔍" />
      </div>
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
          <div class="star" v-if="item.watchlist == 1"></div>
          <div class="unstar" v-else>
            <svg
              width="0.4rem"
              height="0.36rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8934 3.71885C12.3378 4.82671 12.56 5.38066 13.0129 5.71734C13.4657 6.05404 14.0602 6.10727 15.2491 6.21375L15.464 6.23299C17.4099 6.40726 18.3828 6.49439 18.5909 7.11338C18.7991 7.73235 18.0766 8.3897 16.6315 9.70438L16.1493 10.1432C15.4178 10.8087 15.052 11.1414 14.8815 11.5776C14.8497 11.6589 14.8233 11.7423 14.8024 11.8271C14.6903 12.2817 14.7975 12.7645 15.0117 13.7299L15.0783 14.0305C15.472 15.8048 15.6688 16.692 15.3252 17.0746C15.1967 17.2176 15.0298 17.3206 14.8444 17.3712C14.3482 17.5066 13.6437 16.9325 12.2348 15.7844C11.3096 15.0305 10.847 14.6536 10.3159 14.5688C10.107 14.5354 9.89414 14.5354 9.68523 14.5688C9.15414 14.6536 8.69155 15.0305 7.76638 15.7844C6.35743 16.9325 5.65294 17.5066 5.15675 17.3712C4.97133 17.3206 4.80443 17.2176 4.67599 17.0746C4.33232 16.692 4.52915 15.8048 4.92282 14.0305L4.9895 13.7299C5.20371 12.7645 5.31082 12.2817 5.19875 11.8271C5.17786 11.7423 5.15142 11.6589 5.11962 11.5776C4.94915 11.1414 4.58339 10.8087 3.85189 10.1432L3.36961 9.70438C1.92457 8.3897 1.20204 7.73235 1.41023 7.11338C1.6184 6.49439 2.59131 6.40726 4.53712 6.23299L4.75205 6.21375C5.94097 6.10727 6.53543 6.05404 6.98829 5.71734C7.44113 5.38066 7.66333 4.82671 8.10772 3.71885L8.14436 3.62754C8.93096 1.66653 9.32425 0.686035 10.0006 0.686035C10.6769 0.686035 11.0702 1.66653 11.8568 3.62754L11.8934 3.71885V3.71885Z"
                fill="none"
                stroke="#666D80"
                stroke-width="1.5"
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
search.value = "";
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
const clearData = () => {
  // 重置搜索
  //   search.value = "";
  resetData();
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
      font-size: 0.32rem;
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

      .star {
        width: 0.4rem;
        height: 0.36rem;
        margin-left: 0.2rem;
        background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M10.5184 3.03281C10.9628 4.14068 11.185 4.69462 11.6379 5.0313C12.0907 5.368 12.6852 5.42124 13.8741 5.52771L14.089 5.54696C16.0349 5.72122 17.0078 5.80835 17.2159 6.42734C17.4241 7.04632 16.7016 7.70366 15.2565 9.01835L14.7743 9.45713C14.0428 10.1226 13.677 10.4554 13.5065 10.8915C13.4747 10.9729 13.4483 11.0562 13.4274 11.141C13.3153 11.5957 13.4225 12.0784 13.6367 13.0439L13.7033 13.3444C14.097 15.1188 14.2938 16.0059 13.9502 16.3886C13.8217 16.5316 13.6548 16.6345 13.4694 16.6851C12.9732 16.8205 12.2687 16.2465 10.8598 15.0984C9.93462 14.3445 9.47203 13.9676 8.94093 13.8828C8.73202 13.8494 8.51914 13.8494 8.31023 13.8828C7.77914 13.9676 7.31655 14.3445 6.39138 15.0984C4.98243 16.2465 4.27794 16.8205 3.78175 16.6851C3.59633 16.6345 3.42943 16.5316 3.30099 16.3886C2.95732 16.0059 3.15415 15.1188 3.54782 13.3444L3.6145 13.0439C3.82871 12.0784 3.93582 11.5957 3.82375 11.141C3.80286 11.0562 3.77642 10.9729 3.74462 10.8915C3.57415 10.4554 3.20839 10.1226 2.47689 9.45713L1.99461 9.01835C0.54957 7.70366 -0.17296 7.04632 0.0352269 6.42734C0.243397 5.80835 1.21631 5.72122 3.16212 5.54696L3.37705 5.52771C4.56597 5.42124 5.16043 5.368 5.61329 5.0313C6.06613 4.69462 6.28833 4.14068 6.73272 3.03281L6.76936 2.9415C7.55596 0.980495 7.94925 0 8.62558 0C9.30191 0 9.69521 0.980495 10.4818 2.9415L10.5184 3.03281Z" fill="%232752E7"/%3E%3C/svg%3E');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
