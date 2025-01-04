<!-- 中签 -->
<template>
  <div v-if="token" class="page_ipo_stock">
    <Tabs class="van-tabs--sub" v-model:active="ipoActive" :swipeable="false" @change="ipoOnChange"
      :color="'var(--ex-primary-color)'" shrink v-if="props.from != 'assets'">
      <Tab :title="t('trade.ipo_lottery_title1')" name=""> </Tab>
      <Tab :title="t('trade.ipo_lottery_title2')" name="lock"> </Tab>
      <Tab :title="t('trade.ipo_lottery_title3')" name="success"> </Tab>
      <Tab :title="t('trade.ipo_lottery_title4')" name="failure"> </Tab>
    </Tabs>
    <div class="list">
      <div class="item" v-for="(item, i) in ipoStockList" :key="i" @click="ipoOrderDetail(item)">
        <div class="item_box">
          <div class="name_box">
            <div class="name truncate">{{ item.company_name }}</div>
            <span class="lever_icon" v-if="item.lever > 1">{{ t('trade.ipo_leveraged_trading') }}</span>
          </div>

          <div class="item_winning">
            {{ t("trade.ipo_lottery_amount") }}：<strong>{{
              item.winning || "--"
            }}</strong>
          </div>


          <!-- 已中签 -->
          <div class="status_ing2 status_success" v-if="item.status == 'success'">
            {{ t("trade.ipo_lottery_title3") }}
          </div>
          <!-- 未中签 -->
          <div class="status_ing2 status_failure" v-else-if="item.status == 'failure'">
            {{ t("trade.ipo_lottery_title4") }}
          </div>
          <!-- 待中签 -->
          <div class="status_ing2 status_issuing" v-else="item.status == 'issuing'">
            {{ t("trade.ipo_lottery_title2") }}
          </div>
        </div>
        <div class="item_info">
          <div class="info_cell">
            <span class="info_name">{{ t("trade.ipo_detail_item10") }}</span>
            <span class="info_val">{{ item.volume || "--"
              }}<span class="info_lever" v-if="item.lever > 1">{{ item.lever }}X</span></span>
          </div>
          <div class="info_cell">
            <span class="info_name">{{ t("trade.ipo_detail_item14") }}</span>
            <span class="info_val">{{ item.amount || "--" }} {{ item.currency }}</span>
          </div>

          <div class="info_cell">
            <span class="info_name">{{ t("trade.ipo_detail_item5") }}</span>
            <span class="info_val">{{ item.listing_date || "--" }}</span>
          </div>
          <div class="info_cell">
            <span class="info_name">{{ t("trade.ipo_detail_item6") }}</span>
            <span class="info_val">{{ item.listed_price || "--" }}</span>
          </div>


        </div>
      </div>

      <LoadingMore style="margin-top: 0.8rem" v-if="!(finish && ipoStockList.length == 0)" :loading="loading"
        :finish="finish" />
      <NoData v-if="finish && ipoStockList.length == 0" />
    </div>

    <!-- 详情弹窗 -->
    <teleport to="body">
      <Popup style="background-color: rgba(0, 0, 0, 0)" :safe-area-inset-top="true" :safe-area-inset-bottom="true"
        v-model:show="showPopupInfo" position="bottom" closeable>
        <div class="ipo_stock_detail">
          <div class="detail_title">{{ t("trade.ipo_lottery_detail") }}</div>

          <div class="detail_item">
            <div class="name">{{ currDetail.company_name }}</div>
            <div class="status" :class="['status_' + currDetail.status]">
              <!-- {{ statusMap[currDetail.status] || '--' }} -->
              {{
                currDetail.status == "lock"
                  ? t("trade.ipo_lottery_title5")
                  : currDetail.status == "success"
                    ? t("trade.ipo_lottery_title6")
                    : currDetail.status == "failure"
                      ? t("trade.ipo_lottery_title4")
                      : "--"
              }}
            </div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item1") }}</div>
            <div class="val">{{ currDetail.symbol || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item2") }}</div>
            <div class="val">{{ currDetail.issue_price || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item3") }}</div>
            <div class="val">{{ currDetail.created || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item4") }}</div>
            <div class="val">{{ "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item5") }}</div>
            <div class="val">{{ currDetail.listing_date || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item6") }}</div>
            <div class="val">{{ currDetail.listing_price || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item10") }}</div>
            <div class="val">{{ currDetail.volume || "--" }}</div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item8") }}</div>
            <div class="val">
              {{ currDetail.lever ? currDetail.lever + "X" : "--" }}
            </div>
          </div>
          <div class="detail_item">
            <div>{{ t("trade.ipo_detail_item9") }}</div>
            <div class="val">{{ currDetail.fee || "--" }}</div>
          </div>
        </div>
      </Popup>
    </teleport>
  </div>

  <UnLogin @loginfinish="loginfinish" v-show="!token" />
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import LoadingMore from "@/components/LoadingMore.vue";
import NoData from "@/components/NoData.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import store from "@/store";
import { _orderList, _orderGet } from "@/api/api";
import { Popup, Tabs, Tab } from "vant";
import router from "@/router";
import UnLogin from "@/components/UnLogin.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const ipoActive = ref("");
const loginfinish = () => { };
const ipoOnChange = () => {
  init(true);
};
const token = computed(() => store.state.token);

const statusMap = ref({
  lock: "锁定",
  success: "中签",
  failure: "未中签",
});

const props = defineProps({
  scrollDom: {
    type: String,
    default: ".page",
  },
  page: {
    type: String,
    default: "",
  },
  from: {
    type: String,
    default: "",
  },
});

const ipoStockList = computed(() => store.state.ipoStockList || []);

const loading = ref(false);
const finish = ref(false);
const page = ref(0);

// 初始化
const init = (reset) => {
  if (token.value) {
    if (reset) {
      store.commit("setIpoStockList", []);
    }
    loading.value = false;
    finish.value = false;
    page.value = 0;
    getData();
  }
};
// 获取数据
const getData = () => {
  if (loading.value || finish.value) return;
  loading.value = true;
  page.value++;
  _orderList({
    status: ipoActive.value,
    page: page.value,
  })
    .then((res) => {
      if (res.data && res.data.length) {
        res.data = res.data.map((item) => {
          return item;
        });
        if (page.value == 1) {
          store.commit("setIpoStockList", res.data);
        } else {
          store.commit("setIpoStockList", [...ipoStockList.value, ...res.data]);
        }
      } else {
        finish.value = true;
      }
    })
    .finally(() => {
      loading.value = false;
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

const handleMounted = () => {
  setTimeout(() => {
    loadingMore = document.querySelector(".loading_more");
    try {
      document
        .querySelector(props.scrollDom)
        .addEventListener("scroll", scrollHandler);
    } catch { }
  }, 500);
};
// 倒计时
onMounted(() => {
  handleMounted();
});
onBeforeUnmount(() => {
  try {
    document
      .querySelector(props.scrollDom)
      .removeEventListener("scroll", scrollHandler);
  } catch { }
});

defineExpose({
  init,
  handleMounted,
});

// 订单详情
const ipoOrderDetail = (item) => {
  router.push("/ipo/orderDetail?order_no=" + item.order_no);
};

// 详情
const showPopupInfo = ref(false);
const currDetail = ref({});
const openDetail = (val) => {
  currDetail.value = val;
  showPopupInfo.value = true;
  _orderGet({
    order_no: currDetail.value.order_no,
  }).then((res) => {
    if (res.data) {
      currDetail.value = {
        ...currDetail.value,
        ...res.data,
      };
    }
  });
};

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
.page_ipo_stock {

  .list {
    padding: 0 0.4rem 0.12rem 0.4rem;

    .item {
      border-radius: 0.32rem;
      background: var(--ex-bg-color3);
      margin-top: 0.32rem;
      padding-bottom: 0.12rem;

      .name {
        color: var(--ex-text-color);
        font-size: 0.32rem;
        font-weight: 600;
        line-height: 0.36rem;
        color: var(--ex-text-color);
        height: 0.36rem;


      }

      .name_box {
        margin-bottom: 0.14rem;
        max-width: 80%;
        display: flex;
        align-items: center;

        .lever_icon {
          white-space: nowrap;
          min-width: 0.6rem;
          height: 0.32rem;
          font-size: 0.22rem;
          color: var(--ex-status-color1);
          border-radius: 0.08rem;
          text-align: center;
          line-height: 0.32rem;
          font-weight: 400;
          margin-left: 0.1rem;
          background: var(--ex-status-bg1);
        }
      }

      .item_winning {
        color: var(--ex-text-color3);
        font-size: 0.28rem;
        font-weight: 400;
        line-height: 0.36rem;

        strong {
          color: var(--ex-primary-color);
          margin-left: 0.18rem;
        }
      }

      .status_ing2 {
        height: 0.6rem;
        border-radius: 0rem 0.32rem;
        padding: 0 0.2rem;
        background-color: var(--ex-text-color3);
        min-width: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.24rem;
        color: var(--ex-black);
        position: absolute;
        right: 0;
        top: 0;
      }

      .status_failure {
        background-color: var(--ex-status-color1);
        color: var(--ex-black);
      }

      .status_issuing {
        background-color: var(--ex-text-color3);
        color: var(--ex-black);
      }

      .status_success {
        background-color: var(--ex-status-color3);
        color: var(--ex-black);
      }

      .item_box {
        padding: 0.24rem 0.32rem;
        position: relative;
      }

      .status_box {
        width: 1.26738rem;
        height: 1.17056rem;
        position: absolute;
        right: -0.14rem;
        top: -0.02rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      .pre_times {
        display: flex;
        align-items: center;

        .pre_time {
          height: 0.48rem;
          min-width: 0.48rem;
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
          color: #ffaf2a;
          border: 1px solid #ffaf2a;
          border-radius: 0.12rem;
          font-size: 0.28rem;
          font-weight: 600;
          box-sizing: border-box;
        }

        span {
          color: #ffaf2a;
          margin: 0 0.1rem;
          font-size: 0.28rem;
        }
      }

      .status_ing {
        height: 0.6rem;
        border-radius: 0rem 0.32rem;
        padding: 0 0.2rem;
        background-color: var(--ex-primary-color);
        min-width: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.24rem;
        color: var(--ex-black);
        position: absolute;
        right: 0;
        top: 0;
      }

      .status_pre {
        background-color: #ffaf2a;
        color: var(--ex-black);
      }

      .status_done {
        background-color: var(--ex-info-color);
        color: var(--ex-black);
      }

      .status_ed {
        background-color: var(--ex-success-color);
        color: var(--ex-black);
      }

      .item_info {
        border-radius: 0.32rem;
        border: 1px solid var(--ex-border-color);
        border-bottom: 0px;
        background: var(--ex-bg-color);
        position: relative;
        left: 0.12rem;
        width: calc(100% - 0.24rem);
        box-sizing: border-box;
        line-height: 0.3rem;
        padding: 0.12rem 0;

        .info_cell {
          display: flex;
          justify-content: space-between;
          padding: 0.24rem 0.32rem;
        }

        .info_name {
          font-size: 0.28rem;
          color: var(--ex-text-color3);
        }

        .info_date,
        .info_price {
          color: var(--ex-text-color);
          font-size: 0.28rem;
        }

        .info_lever {
          border-radius: 0.32rem;
          height: 0.44rem;
          line-height: 0.44rem;
          color: var(--ex-primary-color);
          font-size: 0.28rem;
          padding: 0 0.12rem;
          background: rgba(1, 76, 250, 0.08);
          margin-left: 0.12rem;
        }
      }

      .control_box {
        padding: 0.2rem 0.32rem;

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--ex-primary-color);
          height: 0.8rem;
          border-radius: 0.5rem;
          color: var(--ex-text-color--bg-primary);
          font-size: 0.3rem;
          font-weight: 600;
        }
      }
    }
  }
}

.ipo_stock_detail {
  border-top-left-radius: 0.36rem;
  border-top-right-radius: 0.36rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: var(--ex-bg-color);
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
    border-bottom: 1px solid var(--ex-border-color);
    color: var(--ex-text-color3);
    font-size: 0.28rem;
    font-weight: 400;

    .name {
      color: var(--ex-text-color);
      font-weight: 600;
      font-size: 0.32rem;
    }

    .status {
      height: 0.48rem;
      background-color: #c5c5c5;
      color: var(--ex-text-color);
      font-size: 0.24rem;
      padding: 0 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.08rem;
      white-space: nowrap;
    }

    .status_lock {
      background-color: #ffe3ac;
      color: #ffa800;
    }

    .status_success {
      color: var(--ex-text-primary);
      background-color: #8bb2fc;
    }

    .val {
      color: var(--ex-text-color);
      font-weight: 500;
    }
  }
}
</style>
