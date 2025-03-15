<!-- 搜索页 -->
<template>
  <div class="page page_search">
    <Top :title="t('market.market_search_title')" :searchText="search" />
    <!-- 搜索框 -->
    <div class="search_box">
      <div class="icon" style="display: flex;align-items: center;justify-content: center;">
        <div style="width: 0.32rem;height: 0.32rem;">
          <img v-lazy="getStaticImgUrl('/static/img/home/search_icon.svg')" alt="">
        </div>
      </div>
      <input ref="iptRef" @keydown="keydown" @keydown.enter="keydownEnter"
        :placeholder="t('market.market_search_title')" type="text" enterkeyhint="search" v-model.trim="search"
        class="search" />

      <div class="type_select" @click="closeSearch" v-show="search.length > 0">
        <div class="type_icon">
          <div class="closeIcon">
            <img v-lazy="getStaticImgUrl('/static/img/common/mini_close.svg')" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- 结果列表 -->
    <div v-show="marketSearchTextList.length > 0 && !search.length > 0">
      <div class="flex justify-between items-center mb-[0.2rem]">
        <div class="text-[0.32rem]">
          {{ t("market.market_search_history") }}
        </div>
        <div class="w-[0.4rem] h-[0.4rem]" @click="clearSearchHistory">
          <div class="clearIcon">
            <img v-lazy="getStaticImgUrl('/static/img/common/clean.svg')" alt="">
          </div>
        </div>
      </div>
      <div class="flex gap-[0.2rem] mb-4 flex-wrap">
        <div class="text-[0.28rem] h-[0.6rem] px-[0.16rem] bg-color3 rounded-[0.32rem] items-center flex"
          v-for="(item, i) in marketSearchTextList" :key="i" @click="handleHistory(item)">
          {{ item }}
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-[0.4rem]" v-show="!search.length > 0">
      <div class="text-[0.32rem]">
        {{ t("market.market_search_recommend") }}
      </div>
      <div class="w-[0.4rem] h-[0.4rem]" @click="resetData">
        <div style="width: 0.4rem;height: 0.4rem;">
          <img v-if="!marketSearchTextList.length > 0" v-lazy="getStaticImgUrl('/static/img/market/refresh_white.svg')"
            alt="">
          <img v-else v-lazy="getStaticImgUrl('/static/img/market/refresh_mini.svg')" alt="">
        </div>
      </div>
    </div>
    <div class="list">
      <Loading v-show="!searchList.length && loading" />
      <NoData v-if="!searchList.length && !loading" />

      <div class="item" v-for="(item, i) in searchList" :key="i" @click="goItem(item)">
        <!-- <div @click.stop="collect(item)">
          <div class="size-[0.48rem]">
            <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="">
            <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="">
          </div>
        </div> -->
        <div class="size-[0.96rem] mr-[0.2rem] flex justify-center items-center">
          <CryptoIcon :name="item.name.split('/')[0]" />
        </div>
        <div class="info">
          <div class="title flex items-center gap-1">
            {{ item.type == "stock" ? item.symbol || "--" : item.name || "--" }}
            <div v-if="item.type == 'stock'"
              :class="`${marketStyle[item.type]
                } font-normal text-[0.22rem] flex items-center justify-center rounded-[0.08rem] px-[0.05rem] h-[0.3rem] `">
              {{
                item.type == "stock"
                  ? t("market.market_optional_stock")
                  : item.type == "crypto"
                    ? t("market.market_optional_contract")
                    : item.type == "forex"
                      ? t("market.market_optional_forex")
                      : "--"
              }}
            </div>
          </div>

          <!-- 给了定值，需要用后端数据该代码 -->
          <div class="text" v-if="item.type == 'stock'">{{ item.name }}</div>
          <div class="text flex items-center" v-else>
            <div
              :class="`${marketStyle[item.type]
                } font-normal text-[0.22rem] flex items-center justify-center rounded-[0.08rem] px-[0.05rem] h-[0.3rem] `">
              {{
                item.type == "stock"
                  ? t("market.market_optional_stock")
                  : item.type == "crypto"
                    ? t("market.market_optional_contract")
                    : item.type == "forex"
                      ? t("market.market_optional_forex")
                      : "--"
              }}
            </div>
          </div>
        </div>

        <div class="td2 td_r">
          <div class="item_num" :class="[item.ratio === 0 ? '' : item.ratio > 0 ? 'up' : 'down']">
            {{ item.price ? item.price : "--" }}
          </div>
          <div class="item_info_box">
            <div v-if="item.ratio !== undefined" class="item_percent"
              :class="[item.ratio === 0 ? '' : item.ratio > 0 ? 'up_bg' : 'down_bg']">
              <span>{{
                (item.ratio || 0) > 0
                  ? "+" + (item.ratio || 0)
                  : (item.ratio || 0)
              }}%</span>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const market = {
  stock: "股票",
  crypto: "合约",
  forex: "外汇",
};
const marketStyle = {
  stock: "tag-stock",
  crypto: "tag-crypto",
  forex: "tag-forex",
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

  if (item.type == "stock") {
    var newList = flag ? prevList : [...prevList, item.symbol];
    store.commit("setMarketSearchTextList", newList);
    store.commit("setCurrStockItem", item);
    setTimeout(() => {
      router.push({
        name: "market_info",
        query: {
          symbol: item.symbol,
          type: "stock",
        },
      });
    }, 100);
  } else if (item.type == "crypto") {
    var newList = flag ? prevList : [...prevList, item.name];
    store.commit("setMarketSearchTextList", newList);
    store.commit("setCurrConstract", item);
    router.push({
      name: "market_info",
      query: {
        symbol: item.name,
        type: "constract",
      },
    });
  }
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
    padding: 0 0.32rem;
    margin-bottom: 0.4rem;
    height: 0.9rem;
    background-color: var(--ex-bg-color3);
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0);

    .type_select {
      right: 0;
      display: flex;
      align-items: center;
      color: var(--ex-text-color);
      font-size: 0.24rem;

      .type_icon {
        width: 0.32rem;
        height: 0.32rem;
        opacity: 0.8;
      }
    }

    &:has(.search:focus) {
      border: 1px solid var(--ex-border-color3);
    }

    .icon {
      width: 0.4rem;
      height: 0.4rem;
    }

    .close {
      width: 0.24rem;
      height: 0.24rem;
      color: var(--ex-text-color);
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
      height: 1.62rem;
      display: flex;
      align-items: center;
      background-color: var(--ex-bg-white2);
      margin-bottom: 0.2rem;
      border-radius: 0.3rem;
      padding-inline: 0.26rem;

      .info {
        flex: 1;
        overflow: hidden;
        margin-left: 0.28rem;

        .title {
          color: var(--ex-text-color);
          font-size: 0.32rem;
        }

        .text {
          color: var(--ex-text-color3);
          font-size: 0.24rem;
          font-weight: 400;
          margin-top: 0.26rem;
        }
      }

    }
  }


  .clearIcon {
    width: 0.4rem;
    height: 0.4rem;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .closeIcon {
    width: 0.32rem;
    height: 0.32rem;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;

    .item_num {
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem;
      color: var(--ex-text-color2);
    }

    .item_info_box {
      margin-top: 0.18rem;

      .item_percent {
        text-align: center;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.24rem;
        display: inline-block;
        font-weight: 400;
        color: var(--ex-white);
        border-radius: 0.12rem;
      }

    }
  }

  .td_r {
    text-align: right;
  }
}
</style>
