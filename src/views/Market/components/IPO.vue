<!-- IPO -->
<template>
  <div class="page_ipo">
    <Tabs
      v-show="props.page != 'home'"
      type="custom-card"
      v-model:active="selectedOption"
      :swipeable="false"
      animated
      :color="'#014CFA'"
      shrink
      @change="init(true)"
    >
      <Tab :title="t('trade.ipo_title_all')" :name="''"></Tab>
      <!-- <Tab :title="t('trade.ipo_title_pre')" :name="'none'"></Tab> -->
      <Tab :title="t('trade.ipo_title_going')" :name="'issuing'"></Tab>
      <!-- <Tab :title="t('trade.ipo_title_finish')" :name="'done'"></Tab> -->
      <Tab :title="t('trade.ipo_title_market')" :name="'listed'"></Tab>
    </Tabs>

    <!-- <Tabs  class="van-tabs--oval-sub" v-model:active="selectedLever" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="init(true)">
            <Tab :title="i.text" :name="i.value" v-for="(i, key) in leverOption" :key="key">
            </Tab>
        </Tabs> -->
    <div class="list" :class="props.page == 'home' && 'mt-[-0.32rem]'">
      <div
        class="item"
        v-for="(item, i) in ipoDataList"
        :key="i"
        @click="openDetail(item)"
      >
        <div class="item_box">
          <div class="name_box">
            <div class="name truncate">{{ item.company_name }}</div>
            <span class="lever_icon" v-if="item.lever > 1">配资</span>
          </div>
          <div class="pre_times" v-if="item.status == 'none' && item._timedown">
            <div class="pre_time">{{ item._timedown[0] }}</div>
            <span>:</span>
            <div class="pre_time">{{ item._timedown[1] }}</div>
            <span>:</span>
            <div class="pre_time">{{ item._timedown[2] }}</div>
          </div>

          <!-- 认购中 -->
          <div class="status_ing" v-if="item.status == 'issuing'">{{ t('trade.ipo_title_going') }}</div>
          <!-- 预售中 -->
          <div class="status_ing status_pre" v-if="item.status == 'none'">
            {{ t('trade.ipo_title_pre') }}
          </div>
          <!-- 已结束 -->
          <div class="status_ing status_ed" v-if="item.status == 'listed'">
            {{ t('trade.ipo_title_market') }}
          </div>
          <!-- 已结束 -->
          <div class="status_ing status_done" v-if="item.status == 'done'">
            {{ t('trade.ipo_title_finish') }}
          </div>
        </div>
        <div
          class="item_info"
          :class="{
            item_info_nobb: item.status != 'issuing' && item.status != 'listed',
          }"
        >
          <div class="info_cell">
            <span class="info_name">{{ t('trade.ipo_detail_price') }}</span>
            <span class="info_price">{{ item.issue_price_max }} {{ item.currency }}</span>
          </div>
          <div class="info_cell" v-if="item.lever > 1">
            <span class="info_name">{{ t('trade.ipo_detail_lever') }}</span>
            <span class="info_price">{{ item.lever + "X" }}</span>
          </div>
          <div class="info_cell">
            <span class="info_name">{{ t('trade.ipo_detail_time') }}</span>
            <span class="info_price">{{ item.listing_date }}</span>
          </div>

          <div class="info_cell" v-if="item.listing_price">
            <span class="info_name">{{ t('trade.ipo_detail_listing_price') }}</span>
            <span class="info_price">{{ item.listing_price }}</span>
          </div>
          <div class="info_cell">
            <span class="info_name">{{ t('trade.ipo_detail_date') }}</span>
            <span class="info_date"
              >{{ item.issue_start_date }} - {{ item.issue_end_date }}</span
            >
          </div>
          <div class="info_cell">
            <span class="info_name">{{ t('trade.ipo_detail_item11') }}</span>
            <span class="info_price">{{ marketMap[item.market] || '--' }}</span>
          </div>
          
        </div>
        <div
          class="control_box"
          v-if="
            (item.status == 'issuing' || item.status == 'listed') &&
            props.page != 'home'
          "
        >
          <div class="btn" @click.stop="goBuy(item)">{{ t('trade.ipo_opening_btn') }}</div>
        </div>
      </div>

      <LoadingMore
        v-if="!(finish && ipoDataList.length == 0)"
        :loading="loading"
        :finish="finish"
      />
      <NoData v-if="finish && ipoDataList.length == 0" />
    </div>

    <!-- 详情弹窗 -->
    <teleport to="body">
      <Popup
        style="background-color: rgba(0, 0, 0, 0)"
        :safe-area-inset-top="true"
        :safe-area-inset-bottom="true"
        v-model:show="showPopupInfo"
        position="bottom"
        closeable
      >
        <div class="ipo_detail">
          <div class="detail_title">{{ t('trade.ipo_detail') }}</div>

          <div class="detail_item">
            <div class="name">{{ currDetail.company_name }}</div>
            <div
              class="status"
              :class="{ close_status: currDetail.status == 'done' }"
            >
              {{
                currDetail.status == "issuing" || currDetail.status == "listed"
                  ? t('trade.ipo_title_going')
                  : currDetail.status == "none"
                  ? t('trade.ipo_title_pre')
                  : t('trade.ipo_title_finish')
              }}
            </div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item1') }}</div>
            <div class="val">{{ currDetail.symbol || '--'}}</div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item2') }}</div>
            <div class="val">{{ currDetail.issue_price_max || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item3') }}</div>
            <div class="val">{{ currDetail.issue_start_date || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item4') }}</div>
            <div class="val">{{ currDetail.issue_end_date || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item5') }}</div>
            <div class="val">{{ currDetail.listing_date || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item6') }}</div>
            <div class="val">{{ currDetail.listing_price || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item7') }}</div>
            <div class="val">--</div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item8') }}</div>
            <div class="val">
              {{ currDetail.lever ? currDetail.lever + "X" : "--" }}
            </div>
          </div>
          <div class="detail_item">
            <div>{{ t('trade.ipo_detail_item9') }}</div>
            <div class="val">--</div>
          </div>
        </div>
      </Popup>
    </teleport>
  </div>
</template>

<script setup>
import LoadingMore from "@/components/LoadingMore.vue";
import NoData from "@/components/NoData.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import store from "@/store";
import { _ipoList, _ipoGet } from "@/api/api";
import { Tabs, Tab, Popup } from "vant";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  scrollDom: {
    type: String,
    default: ".page",
  },
  page: {
    type: String,
    default: "",
  },
});

const ipoDataList = computed(() => store.state.ipoDataList || []);
const selectedOption = ref("");
const option = [
  { text: t("trade.ipo_title_all"), value: "" },
  { text: t("trade.ipo_title_pre"), value: "none" },
  { text: t("trade.ipo_title_going"), value: "issuing" },
  { text: t("trade.ipo_title_finish"), value: "done" },
  { text: t("trade.ipo_title_market"), value: "listed" },
];
const selectedOptiontext = computed(
  () => option.find((item) => item.value == selectedOption.value).text
);

const selectedLever = ref("");
const leverOption = [
  { text: "全部", value: "" },
  { text: "普通", value: "1" },
  { text: "配资", value: "2" },
];
const loading = ref(false);
const finish = ref(false);
const page = ref(0);

const marketMap = ref({
  us:"美国",
  japan:"日本",
  india:"印度",
  korea:"韩国",
  germany:"德国",
  uk:"英国",
  singapore:"新加坡",
  hongkong:"香港",
  malaysia:'马来西亚'
})

// 初始化
const init = (reset) => {
  if (reset) {
    store.commit("setIpoDataList", []);
  }
  loading.value = false;
  finish.value = false;
  page.value = 0;
  getData();
};
// 获取数据
const getData = () => {
  if (loading.value || finish.value) return;
  loading.value = true;
  page.value++;
  const par = {
    status: selectedOption.value,
    page: page.value,
    lever: "",
  };
  if (selectedLever.value == "1") {
    par.lever = false;
  } else if (selectedLever.value == "2") {
    par.lever = true;
  }
  _ipoList(par)
    .then((res) => {
      if (res.data && res.data.length) {
        console.log("ipoData===============>", res.data);
        res.data = res.data.map((item) => {
          item._timedown = countdown(item.listing_date);
          item.issue_end_date = item.issue_end_date.replaceAll("-", "/");
          item.listing_date = item.listing_date.replaceAll("-", "/");
          item.issue_start_date = item.issue_start_date.replaceAll("-", "/");
          console.log(item.issue_end_date);
          return item;
        });
        if (page.value == 1) {
          store.commit("setIpoDataList", res.data);
        } else {
          store.commit("setIpoDataList", [...ipoDataList.value, ...res.data]);
        }
      } else {
        setTimeout(() => {
          finish.value = true;
        }, 500);
      }
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    });
};

// 滚动监听
let loadingMore = "";
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrollHandler = () => {
  if (!loadingMore) return;
  const rect = loadingMore.getBoundingClientRect();
  if (rect.top <= totalHeight) {
    // 加载更多
    getData();
  }
};
// 倒计时
let interval = null;
onMounted(() => {
  interval = setInterval(() => {
    const arr = ipoDataList.value.map((item) => {
      item._timedown = countdown(item.listing_date);
      return item;
    });
    store.commit("setIpoDataList", arr);
  }, 1000);
  setTimeout(() => {
    loadingMore = document.querySelector(".loading_more");
    try {
      document
        .querySelector(props.scrollDom)
        .addEventListener("scroll", scrollHandler);
    } catch {}
  }, 500);

  Promise.all([import("@/views/Market/IpoSubscription.vue")]);
});
onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
  try {
    document
      .querySelector(".page")
      .removeEventListener("scroll", scrollHandler);
  } catch {}
});

defineExpose({
  init,
});

// 去购买
const goBuy = (query) => {
  router.push({
    name: "subscription",
    query,
  });
};

// 详情
const showPopupInfo = ref(false);
const currDetail = ref({});
const openDetail = (val) => {
  router.push("/ipo/detail?id=" + val.id);
};
// const openDetail = (val) => {
//     currDetail.value = val
//     showPopupInfo.value = true
//     _ipoGet({
//         id: currDetail.value.id
//     }).then(res => {
//         if (res.data) {
//             currDetail.value = {
//                 ...currDetail.value,
//                 ...res.data
//             }
//         }
//     })
// }

function countdown(endTime) {
  if (!endTime) return ["--", "--", "--"];
  const endDate = new Date(endTime);
  const now = new Date();
  const diff = endDate - now;
  if (diff <= 0) {
    return ["--", "--", "--"];
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return [formattedHours, formattedMinutes, formattedSeconds];
}
</script>

<style lang="less" scoped>
.page_ipo {
  padding: 0.28rem 0.32rem 0 0.32rem;
  .van-tabs--oval-sub {
  }
  :deep(.van-tab--custom-card) {
    padding: 0 0.12rem !important;
  }
  .list {
    padding-top: 0.12rem;

    .item {
      border-radius: 0.32rem;
      border: 1px solid #eff3f8;
      background: #f5f7fc;
      margin-top: 0.2rem;

      
      .name_box {
        padding-right: 0.96rem;
        display: flex;
        align-items: center;
        margin-bottom: 0.14rem;
        .name {
          color: #061023;
          font-size: 0.32rem;
          font-weight: 600;
          line-height: 0.36rem;
          color: #0d0d12;
         
        }
        .lever_icon{
          min-width: 0.6rem;
          height: 0.32rem;
          padding: 0rem 0.08rem;
          font-size: 0.22rem;
          color:#014CFA;
          position: relative;
          top:0.01rem;
          justify-content: center;
          align-items: center;
          border-radius: 0.08rem;
          line-height: 0.32rem;
          font-weight: 400;
          margin-left: 0.1rem;
          background: rgba(1, 76, 250, 0.10);
        }
      }
      .item_box {
        padding: 0.26rem 0.32rem 0.16rem 0.32rem;
        position: relative;
      }
      .pre_times {
        display: flex;
        align-items: center;
        .pre_time {
          height: 0.48rem;
          min-width: 0.48rem;
          display: flex;
          padding: 0 0.06rem;
          align-items: center;
          text-align: center;
          justify-content: center;
          color: #FA7500;
          border: 1px solid #FA7500;
          border-radius: 0.12rem;
          font-size: 0.28rem;
          font-weight: 600;
          box-sizing: border-box;
        }
        span {
          color: #FA7500;
          margin: 0 0.1rem;
          font-size: 0.28rem;
        }
      }

      .status_ing {
        height: 0.6rem;
        border-radius: 0rem 0.32rem;
        padding: 0 0.2rem;
        background-color: #014cfa;
        min-width: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.24rem;
        color: #fff;
        position: absolute;
        right: 0;
        top: 0;
      }

      .status_pre {
        background-color: #FA7500;
        color: #fff;
      }

      .status_done {
        background-color: #7e99d6;
        color: #fff;
      }

      .status_ed {
        background-color: #18b762;
        color: #fff;
      }

      .item_info {
        border-radius: 0.32rem;
        border: 1px solid #eff3f8;
        background: #fff;
        position: relative;
        left: -1px;
        width: calc(100% + 2px);
        box-sizing: border-box;
        line-height: 0.3rem;
        .info_cell {
          display: flex;
          justify-content: space-between;
          padding: 0.24rem 0.32rem;
        }
        .info_cell + .info_cell {
          border-top: 1px dashed #eff3f8;
        }
        .info_name {
          font-size: 0.28rem;
          color: #8f92a1;
        }
        .info_date,
        .info_price {
          color: #061023;
          font-size: 0.28rem;
        }
      }
      .item_info_nobb {
        border-bottom: 0px;
      }

      .control_box {
        padding: 0.2rem 0.32rem;
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #014cfa;
          height: 0.8rem;
          border-radius: 0.5rem;
          color: #fff;
          font-size: 0.3rem;
          font-weight: 600;
        }
      }
    }
  }
}

.market_ipo-popup {
  border-top-left-radius: 0.36rem;
  border-top-right-radius: 0.36rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding-bottom: 1.2rem;

  .market_ipo-box {
    margin-top: 1rem;

    .market_ipo-box-item {
      width: 100%;
      height: 0.96rem;
      text-align: center;
      line-height: 0.96rem;
      color: #333333;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      border-bottom: 0.02rem solid #f4f5f7;
    }

    .market_ipo-box-item:first-of-type {
      margin-right: 0.3rem;
    }

    .selected-class {
      color: #014cfa;
      background-color: #f4f5f7;
      position: relative;
    }
  }
}

.ipo_detail {
  border-top-left-radius: 0.36rem;
  border-top-right-radius: 0.36rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: #fff;
  padding: 0.32rem 0.32rem 0.4rem 0.32rem;
  position: relative;

  .detail_title {
    text-align: center;
    font-size: 0.32rem;
    margin-bottom: 0.32rem;
  }

  .detail_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1rem;
    border-bottom: 1px solid #f5f5f5;
    color: #8f92a1;
    font-size: 0.28rem;
    font-weight: 400;

    .name {
      color: #0d0d12;
      font-weight: 600;
      font-size: 0.32rem;
    }

    .status {
      height: 0.48rem;
      background-color: #e4ecfb;
      color: #014cfa;
      font-size: 0.24rem;
      padding: 0 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.08rem;
      white-space: nowrap;
    }

    .close_status {
      background-color: #ebebeb;
      color: #838383;
    }

    .val {
      color: #121826;
      font-weight: 500;
    }
  }
}
</style>
