<!-- 自选区 -->
<template>
  <div class="buycoin_self">
    <!-- 一层容器 tab -->
    <div class="tabs-buy">
      <div class="tab" :class="{ active_tab: offset == 'buy' }" @click="changeTab('buy')">
        {{ t('market.market_buy_fast_buy') }}
      </div>
      <div class="tab" :class="{ active_tab: offset == 'sell' }" @click="changeTab('sell')">
        {{ t('market.market_buy_fast_sell') }}
      </div>
    </div>
    <!-- 二层容器 -->
    <div class="tabs mb-4">
      <div class="flex items-center">
        <div class="flex justify-between h-[0.6rem] w-[1.4rem] items-center rounded-[0.6rem] bg-color3 p-2 text-12"
          @click="showDialog = true">
          <div class="mr-[0.2rem] flex-1">{{ currCurrency.name }}</div>
          <div class="flex">
            <div class="size-[0.32rem] mr-1">
              <img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="img" />
            </div>
          </div>
        </div>
        <div class="size-[0.32rem] mx-[0.1rem]">
          <img v-lazy="getStaticImgUrl('/static/img/market/trans.svg')" alt="img" />
        </div>
      </div>

      <div class="w-full overflow-hidden">
        <Tabs @touchstart.stop @touchmove.stop @touchup.stop :active="currCrypto.name" class="encryption w-full"
          line-height="0.06rem" line-width="0.32rem" @click-tab="cryptoChange">
          <Tab v-for="(item, index) in dryptoWallet" :key="item.name + index" :title="item.name" :name="item.name" />
        </Tabs>
      </div>
    </div>

    <!-- 三层容器 list -->
    <div class="list">
      <div v-for="(item, i) in list" :key="i" class="item">
        <div class="top">
          <div class="avatar">
            {{ item.merchant.slice(0, 1) }}
          </div>
          <div class="top_content">
            <div class="name">{{ item.merchant }}</div>
            <div class="info">
              <span>{{ t('market.market_buy_optional_deal') }} {{ item.volume || "0" }}</span>
              <span>|</span>
              <span>{{ t('market.market_buy_optional_rate') }} {{ item.volumerate || "0" }}%</span>
              <template v-if="item.avetime">
                <span>|</span>
                <div class=" mr-1" style="width: 0.25rem;height: 0.25rem;">
                  <IconSvg name="clock" />
                </div>
                <span>{{ item.avetime }}{{ t('market.market_buy_optional_duaration') }}</span>
              </template>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="price">
            <div class="amount">
              {{ item.price }}
              <span class="text-12 font-normal">{{ currCurrency.name }}</span>
            </div>
            <div class="text-14 text-color3">
              {{ t('market.market_buy_optional_order_limit') }}
              <span class="text-white ml-[0.1rem]">
                {{ item.limitmin || "0" }}-{{
                  item.limitmax || "0"
                }}
              </span>
            </div>
          </div>
          <div v-if="token" class="btn" :class="['btn--' + offset]" @click="goBuy(item)">
            {{ offset == "buy" ? t('market.market_buy_optional_buy') : t('market.market_buy_optional_sell') }}
          </div>
        </div>
      </div>
      <NoData v-if="!loading && !list.length" />
      <LoadingMore v-if="(finish && list.length) || !finish" class-n="buycoin_buss" :loading="loading"
        :finish="finish" />
    </div>
  </div>


  <!-- 法币币种 -->
  <BottomPopup v-model:show="showDialog" :title="t('market.market_buy_fast_search_title')" :safe-area-inset-top="true"
    :safe-area-inset-bottom="true" closeable>
    <div class="withdraw_accounr_dialog">
      <div class="swap_dialog_list">
        <div v-for="(item, i) in fiatWallet" :key="i" class="swap_dialog_item"
          :class="{ swap_dialog_item_active: currCurrency.name == item.name }" @click="clickItem(item)">
          <div class="icon">
            <img v-lazy="getStaticImgUrl(`/static/img/crypto/${item.name}.svg`)" alt="currency" />
          </div>
          <span>{{ item.name.toUpperCase() }}</span>
          <Icon v-if="currCurrency.name == item.name" class="check_icon" name="success" />
        </div>
      </div>
    </div>
  </BottomPopup>

</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Popup, Icon, showToast, showConfirmDialog, Tabs, Tab } from "vant";
import Decimal from "decimal.js";
import NoData from "@/components/NoData.vue";
import LoadingMore from "@/components/LoadingMore.vue";
import { _adList, _buysell } from "@/api/api";
import store, { useMapState } from "@/store";
import router from "@/router";
import { _hiddenAccount } from "@/utils/index";
import SafePassword from "@/components/SafePassword.vue";
import IconSvg from "@/components/IconSvg.vue";
import { useBuyCoinState } from "./state";
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";

const { t } = useI18n();
const {
  userInfo,
  token,
  deWeightCurrencyList: currencyList,

} = useMapState([
  "userInfo",
  "token",
  "deWeightCurrencyList",
  "accountList",
  "sessionToken",
]);
const buycoinScrollTop1 = useSessionStorage("buycoinScrollTop1");
const { active, handleUrl } = useBuyCoinState();
const scrollData = inject("scrollData");
const showDialog = ref(false);
const showDialog2 = ref(false);
const wallet = computed(() =>
  token.value ? store.state.wallet : currencyList.value
); // 所有钱包
const fiatWallet = computed(() =>
  currencyList.value.filter((item) => item.type == "fiat")
); // 法币钱包
const dryptoWallet = computed(() =>
  currencyList.value.filter((item) => item.type == "crypto")
); // 加密钱包

// 表单
const offset = ref(sessionStorage.getItem("buycoin_offset") || "buy");
const currCurrency = ref({}); // 计价货币
if (fiatWallet.value[0]) currCurrency.value = fiatWallet.value[0];
const currCrypto = ref({}); // 加密货币

// 列表
const loading = ref(false);
const finish = ref(false);
const list = ref([]);

// 监听
try {
  list.value = JSON.parse(sessionStorage.getItem("deal_list") || "[]");
  currCrypto.value = JSON.parse(
    sessionStorage.getItem("buycoin_currCrypto") || "{}"
  );
} catch { }
if (dryptoWallet.value[0] && !currCrypto.value.name) {
  const target = dryptoWallet.value.find((item) => item.name == "USDT");
  currCrypto.value = target || dryptoWallet.value[0];
}

const clickItem = (item) => {
  currCurrency.value = item;
  showDialog.value = false;
  list.value = [];
  init();
};
const clickCrypto = (item) => {
  currCrypto.value = item;
  showDialog2.value = false;
  list.value = [];
  init();
};
const changeTab = (name) => {
  offset.value = name;
  sessionStorage.setItem("buycoin_offset", name);
  list.value = [];
  init();
};

const goBuy = (item) => {
  router.push({
    name: "deal",
    query: {
      ...item,
      offset: offset.value,
      currCrypto: currCrypto.value.name,
      currWallet: currCurrency.value.name,
    },
  });

};


const page = ref(0);
const getData = () => {
  if (loading.value || finish.value) return;
  loading.value = true;
  page.value += 1;
  const req = {
    offset: offset.value,
    crypto: currCrypto.value.currency,
    currency: currCurrency.value.currency,
  };
  _adList({
    page: page.value,
    ...req,
  })
    .then((res) => {
      if (
        req.offset != offset.value ||
        req.crypto != currCrypto.value.currency ||
        req.currency != currCurrency.value.currency
      )
        return;
      loading.value = false;
      if (page.value == 1) {
        list.value = res.data || [];
      } else {
        list.value.push(...(res.data || []));
      }
      if (!res.data?.length) {
        finish.value = true;
      }
      setTimeout(() => {
        sessionStorage.setItem("deal_list", JSON.stringify(list.value));
      }, 100);
    })
    .catch(() => {
      loading.value = false;
    });
};
const init = () => {
  page.value = 0;
  loading.value = false;
  finish.value = false;
  setTimeout(() => {
    getData();
  }, 0);
};

const scrollHandle = (bottom) => {
  if (active.value !== "1") return;
  // 加载更多
  if (bottom) getData();
};
watch(() => scrollData.arrivedState.bottom, scrollHandle);

onActivated(() => {
  setTimeout(() => {
    if (active.value !== "1") return;
    nextTick(() => {
      const page2 = document.querySelector(".page");
      page2.scrollTop = buycoinScrollTop1.value;
    });
  }, 500);
});
onMounted(() => {
  init();
});


function cryptoChange({ name: item }) {
  const result = dryptoWallet.value.find((i) => i.name == item);
  sessionStorage.setItem("buycoin_currCrypto", JSON.stringify(result));
  clickCrypto(result);
}

defineExpose({
  init,
});
</script>

<style lang="less" scoped>
.buycoin_self {
  width: 7.5rem;
  padding: 0 0.32rem;
  margin-top: -0.32rem;

  .tabs-buy {
    display: flex;
    align-items: center;
    height: 0.8rem;
    margin: 0.32rem 0 0.2rem;

    .tab {
      color: var(--ex-text-color2);
      margin: 0;
      width: 1.6rem;
      text-align: center;
      border-radius: 1rem;
      height: 100%;
      display: flex;
      align-items: center;
      border: 1px solid var(--ex-border-color);
      justify-content: center;
      margin-right: 0.2rem;
    }

    .active_tab {
      font-weight: bold;
      color: var(--ex-text-color--bg-light);
      background: var(--ex-white);
      border: 0px;
    }
  }

  .tabs {
    height: 0.6rem;
    margin-top: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tab {
      margin-right: 0.24rem;
      min-width: 1rem;
      color: var(--ex-text-color3);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .active_tab {
      font-weight: bold;
      color: var(--ex-text-color);
    }

    .encryption {
      > :deep(.van-tabs__wrap) {
        border-bottom: 1px solid var(--ex-border-color);
        padding-right: 0;
        height: 0.54rem;

        .van-tabs__line {
          background-color: var(--ex-white) !important;

        }

        .van-tabs__nav,
        .van-tab--grow {
          padding-right: 0 !important;
          padding-left: 0 !important;
          margin-right: 0.24rem !important;
          align-items: start;

        }

        .van-tabs__nav:last-child {
          margin-right: 0 !important;
        }
      }
    }
  }


  .list {
    .item {
      margin-top: 0.24rem;
      padding: 0.12rem;
      color: var(--ex-text-color2);
      background-color: var(--ex-bg-color3);
      border-radius: 0.4rem;
      border-bottom: 1px solid var(--ex-border-color);

      .top {
        display: flex;
        align-items: flex-start;
        padding: 0.12rem 0.16rem;

        .avatar {
          width: 0.64rem;
          height: 0.64rem;
          border-radius: 50%;
          background-color: var(--ex-white);
          margin-right: 0.24rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.36rem;
          font-weight: 600;
          color: var(--ex-text-color--bg-light);
          line-height: 0;

          .avatar_status {
            position: absolute;
            width: 0.13rem;
            height: 0.13rem;
            border-radius: 50%;
            background-color: var(--ex-success-color);
            bottom: 0.04rem;
            right: 0.04rem;
          }
        }

        .top_content {
          // padding-top: 0.16rem;

          .name {
            margin-bottom: 0.2rem;
            font-style: 0.32rem;
            color: var(--ex-text-color);
          }

          .info {
            font-size: 0.24rem;
            display: flex;
            align-items: center;
            color: var(--ex-text-color3);

            span {
              margin-right: 0.1rem;
            }

            .time_icon {
              width: 0.24rem;
              height: 0.24rem;
              margin-right: 0.1rem;
            }
          }
        }
      }

      .bottom {
        background-color: var(--ex-bg-color);
        padding: 0.24rem 0.3rem;
        margin-top: 0.24rem;
        border-radius: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .price {
          .amount {
            color: var(--ex-text-color);
            font-weight: bold;
            font-size: 0.48rem;
            margin-bottom: 0.2rem;
          }
        }

        .btn {
          width: 1.6rem;
          height: 0.72rem;
          border-radius: 0.64rem;
          background-color: var(--ex-up-color);
          color: var(--ex-text-color--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.28rem;
        }

        .btn--sell {
          background-color: var(--ex-down-color);
          color: var(--ex-text-color--bg-light);
        }
      }
    }
  }
}
</style>

<style lang="less">
.buycoin_form_dialog {
  position: relative;

  .title {
    font-size: 0.32rem;
    line-height: 0.6rem;
    text-align: center;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    font-weight: bold;
  }

  .form {
    padding: 0.32rem;

    .form_item {
      border: 1px solid var(--ex-border-color2);
      height: 0.96rem;
      display: flex;
      align-items: center;
      padding: 0 0.24rem;
      position: relative;
      border-radius: 0.24rem;
      margin-bottom: 0.12rem;

      .ipt {
        flex: 1;
        height: 100%;
      }

      .all {
        color: var(--ex-primary-color);
      }

      .tip_text {
        font-size: 0.28rem;
        color: var(--ex-text-color4);
        position: absolute;
        left: 0.24rem;
        pointer-events: none;
      }
    }

    .focus_item {
      height: 1.12rem;
      padding-top: 0.2rem;

      .tip_text {
        transform: translateY(-0.36rem);
        font-size: 0.24rem;
      }
    }

    .tip {
      color: var(--ex-text-color);
    }

    .btn {
      margin-top: 0.32rem;
      height: 0.96rem;
      background-color: var(--ex-primary-color);
      border-radius: 0.96rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color--bg-primary);
    }
  }
}

.buycoin_orderinfo_dialog {
  position: relative;

  .orderinfo_dialog_title {
    font-size: 0.32rem;
    line-height: 0.6rem;
    text-align: center;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    font-weight: bold;
  }
}
</style>
<style lang="less" scoped>
.withdraw_accounr_dialog {
  overflow: hidden;
  padding: 0.32rem 0.32rem 0.8rem 0.32rem;
  position: relative;


  .swap_dialog_list {
    max-height: calc(var(--vh) * 60);
    overflow-y: auto;
    padding-bottom: 0.8rem;
  }

  .swap_dialog_item {
    height: 1rem;
    line-height: 0;
    display: flex;
    align-items: center;
    border-radius: 0.4rem;
    background-color: var(--ex-bg-color3);
    overflow: hidden;
    position: relative;
    padding: 0 0.28rem;
    margin-top: 0.2rem;
    color: var(--ex-text-color);
    border: 1px solid rgba(0, 0, 0, 0);

    .icon {
      width: 0.64rem;
      height: 0.64rem;
      margin-right: 0.2rem;
    }
  }

  .swap_dialog_item_active {
    color: var(--ex-text-color);
    border-color: var(--ex-primary-color);
    background: none;

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: var(--ex-primary-color);
      font-size: 0.4rem;
    }
  }


  .tabs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 0.4rem;

    .tab {
      height: 0.72rem;
      border-radius: 0.72rem;
      display: flex;
      align-items: center;
      padding: 0 0.4rem;
      color: var(--ex-text-color);
      font-size: 0.32rem;
      font-weight: 400;
    }

    .active_tab {
      background-color: var(--ex-bg-color2);
      color: var(--ex-primary-color);
      font-weight: 500;
    }
  }

  .list {
    max-height: calc(var(--vh) * 70);
    overflow-y: auto;

    .add_account {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 0;
    }
  }

  .add_item {
    margin-bottom: 0.36rem;
    border: 1px dashed var(--ex-border-color2);
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dialog_account_item {
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background-color: var(--ex-bg-color2);
    padding: 0 0.4rem 0 0.36rem;
    overflow: hidden;
    margin-bottom: 0.36rem;

    .card_icon {
      background-color: var(--ex-bg-color4);
      width: 0.96rem;
      height: 0.96rem;
      border-radius: 0.16rem;
      display: flex;
      align-items: center;
      justify-content: center;

      >img {
        width: 0.64rem !important;
        height: 0.64rem !important;
      }
    }

    .card {
      flex: 1;
      margin: 0 0.2rem 0 0.36rem;
      text-align: left;
      font-size: 0.24rem;
      color: var(--ex-text-color);
      font-weight: 500;
      line-height: 1;

      .code {
        font-size: 0.28rem;
        margin-bottom: 0.1rem;
        font-weight: 400;
      }
    }
  }

  .dialog_account_item_active {
    border: 1px solid var(--ex-primary-color);

    .checked {
      position: absolute;
      top: -0.04rem;
      right: -0.04rem;
      background-size: 100% 100%;
      width: 0.46rem;
      height: 0.42rem;

      >img {
        width: 0.18rem !important;
        height: 0.12rem !important;
        position: absolute;
        right: 0.06rem;
        top: 0.08rem;
      }
    }
  }
}
</style>
