<!-- 搜索页 -->
<template>
  <div class="page page_search">
    <Top :title="'搜索'" />
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
        <img v-if="!marketSearchTextList.length > 0" src="/static/img/market/vector.svg" />
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
          <div class="text">{{ item.name || "--" }}</div>
        </div>
        <div class="star" @click.stop="collect(item)">
          <img
            v-if="item.watchlist == 0"
            src="/static/img/market/unstar.png"
            alt="⭐"
          />
          <img
            v-if="item.watchlist == 1"
            src="/static/img/market/star.png"
            alt="⭐"
          />
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
search.value = store.state.marketSearchStr || "";
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
  if (search.value.length > 0) {
    var prevList = [...marketSearchTextList.value];
    var flag = false;
    prevList.map((item) => {
        if(item.toUpperCase() == search.value.toUpperCase())
            flag = true;
    })
    var newList = flag ? prevList : [...prevList, search.value];

    store.commit("setMarketSearchTextList", newList);
  }
  resetData();
}

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
        if(list.toUpperCase() == item.symbol.toUpperCase())
            flag = true;
    })
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
        height: 0.4rem;
        margin-left: 0.2rem;
      }
    }
  }
}
</style>
