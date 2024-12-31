<!-- 充值-虚拟货币 -->
<template>
  <div class="page page_topup_crypto">
    <Top :title="$t('topUpCrypto.recharge')">
      <template #right>
        <div class="top-record" @click="goRecord">
          <div class="top-record-icon">
            <img :src="getStaticImgUrl('/static/img/assets/record_sm.svg')" />
          </div>
          <span class="max-w-[1.2rem]">
            {{ $t("topUpCrypto.rechargeRecord") }}
          </span>
        </div>
      </template>
    </Top>

    <Tabs type="custom-card" v-model:active="tabActive" :swipeable="false" shrink>
      <Tab :title="$t('topUpCrypto.cryptocurrency')" name="cryptocurrency">
        <div class="form">
          <div class="subtitle">
            <span>{{ $t("topUpCrypto.currency") }}</span>
          </div>

          <div class="item">
            <div class="select_item border_item" @click="showDialog = true">
              <div class="currency">
                <div class="currency_icon" v-if="form.currency">
                  <img :src="getStaticImgUrl(`/static/img/crypto/${form.currency.toUpperCase()}.svg`)" alt="currency"
                    class="rounded-full" />
                </div>
                <span>{{ form.currency || "" }}</span>
              </div>
              <div class="more">
                <img :src="getStaticImgUrl('/static/img/common/more.svg')" alt="more" />
              </div>
            </div>
          </div>
          <div class="subtitle">
            <span>{{ $t("topUpCrypto.network") }}</span>
          </div>
          <div class="item">
            <div class="select_item border_item" @click="showNetDialog = true">
              <div class="currency">
                <span>{{ form.network || "" }}</span>
              </div>
              <div class="more">
                <img :src="getStaticImgUrl('/static/img/common/more.svg')" alt="more" />
              </div>
            </div>
          </div>

          <div class="subtitle">
            <span style="flex: none">{{
              $t("topUpCrypto.rechargeAmount")
            }}</span>
          </div>
          <div class="item border_item" :class="{ err_ipt: errStatus }">
            <div class="item_content">
              <input class="ipt" @blur="
                errStatus = false;
              form.amount <= 0 ? (form.amount = '') : '';
              " type="number" v-model="form.amount" :placeholder="$t('topUpCrypto.inputPlaceholder')" />
            </div>
            <div>{{ topUpMode == 1 ? form.currency : "USDT" }}</div>
          </div>
          <!-- <div>
                        <Checkbox v-model="form.swap" shape="square" name="a">到账自动兑换</Checkbox>
                    </div> -->
          <!-- <div class="tip" v-if="topUpMode == 2">
                        <span style="margin: 0 0.1rem">≈ {{targetAmount}}{{form.currency}}</span>
                        <Loading v-show="rateLoading" type="spinner" size="12px" />
                    </div> -->
        </div>
        <Button @click="goTopUp" :loading="loading" round color="var(--ex-primary-color)" class="submit"
          type="primary">{{
            $t("topUpCrypto.confirm") }}</Button>
      </Tab>
      <Tab :title="$t('topUpCrypto.bankCard')" name="bankCard"> </Tab>
    </Tabs>

    <!-- 币种选择弹窗 -->
    <BottomPopup v-model:show="showDialog" :title="$t('topUpCrypto.currencySelection')" closeable>
     
      <div class="topup_accounr_dialog">
        <!-- 搜索 -->
        <div class="search_box">
          <div class="search_icon">
            <img :src="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
          </div>
          <input v-model.trim="searchDialogStr" type="text" class="ipt"
            :placeholder="$t('topUpCrypto.searchPlaceholder')" />
        </div>
        <div class="lists">
          <div @click="clickItem(keyStr)" class="swap_dialog_item"
            :class="{ swap_dialog_item_active: form.currency == keyStr }" v-for="(val, keyStr) in networkMapList"
            :key="keyStr" v-show="!searchDialogStr ||
              keyStr.toUpperCase().indexOf(searchDialogStr) > -1
              ">
            <div class="icon">
              <img :src="getStaticImgUrl(`/static/img/crypto/${keyStr.toUpperCase()}.svg`)" alt="currency"
                class="rounded-full" />
            </div>
            <span>{{ keyStr.toUpperCase() }}</span>

            <div v-if="form.currency == keyStr" class="check_icon">
              <img :src="getStaticImgUrl('/static/img/assets/actived_check.svg')" />
            </div>
          </div>
        </div>
      </div>
    </BottomPopup>

    <!-- 网路选择弹窗 -->
    <Popup round closeable v-model:show="showNetDialog" position="bottom" teleport="body">
      <div class="van-popup-custom-title">
        {{ $t("topUpCrypto.networkSelection") }}
      </div>
      <div class="topup_accounr_dialog network_accounr_dialog">
        <div @click="clickNetItem(item.network)" class="swap_dialog_item"
          :class="{ swap_dialog_item_active: form.network == item.network }" v-for="(item, i) in currNetwork" :key="i">
          <span>{{ item.network }}</span>

          <div v-if="form.network == item.network" class="check_icon">
            <img :src="getStaticImgUrl('/static/img/assets/actived_check.svg')" />
          </div>
        </div>
      </div>
    </Popup>

    <!-- 充提记录 -->
    <RecordList ref="RecordListRef" />

    <!-- 安全密码弹窗 -->
    <SafePassword @submit="submit" ref="safeRef"></SafePassword>

    <!-- 账号验证 -->
    <AccountCheck ref="AccountCheckRef" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import router from "@/router";
import { ref, computed, onBeforeUnmount, onMounted } from "vue";
import store from "@/store";
import {
  Popup,
  Button,
  Icon,
  showToast,
  Tabs,
  Tab,
  Checkbox,
  showLoadingToast,
  closeToast,
} from "vant";
import { useRoute } from "vue-router";
import BottomPopup from "@/components/BottomPopup.vue";
import RecordList from "@/components/RecordList.vue";
import SafePassword from "@/components/SafePassword.vue";
import AccountCheck from "@/components/AccountCheck.vue";
import { _swapRate } from "@/api/api";
import Decimal from "decimal.js";
import { _cryptoCoin } from "@/api/api";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const tabActive = ref("cryptocurrency");

const safeRef = ref();
const userInfo = computed(() => store.state.userInfo || {});
const RecordListRef = ref();
const route = useRoute();

const loading = ref(false);
// 表单
const form = ref({
  swap: true,
  amount: "",
  currency: "",
  network: "",
});

const topUpMode = ref(1); // 1-选择的币种 2-法币
const transing = ref(false); // 转换动画中
const goTransing = () => {
  topUpMode.value = topUpMode.value == 1 ? 2 : 1;
  transing.value = true;
  setTimeout(() => {
    transing.value = false;
  }, 500);
};

// 货币选择
const showDialog = ref(false);
const recommendList = ref(["USDT", "BTC", "ETH"]); // 推荐币种
// 钱包
const wallet = computed(() => {
  // 可选钱包列表
  return (
    store.state.wallet.filter(
      (item) => !["stock", "contract", "main", "USD"].includes(item.currency)
    ) || []
  );
});
form.value.currency = route.query.currency || "BTC"; // 初始化默认币种
const updateRouteQuery = (key, value) => {
  const _query = {};
  Object.keys(route.query).map((k) => {
    _query[k] = route.query[k];
  });
  _query[key] = value;
  router.replace({
    path: route.path,
    query: _query,
  });
};
const clickItem = (item) => {
  form.value.currency = item;
  updateRouteQuery("currency", form.value.currency);

  showDialog.value = false;
  setTimeout(() => {
    initNetwork();
  }, 0);
};

const searchDialogStr = ref("");

// 网络选择
const networkMapList = ref({});
const currNetwork = computed(() => {
  return networkMapList.value[form.value.currency] || [];
});
const initNetwork = () => {
  form.value.network = currNetwork.value[0]?.network;
  setTimeout(() => {
    getRate();
  }, 0);
};
const showNetDialog = ref(false);
const clickNetItem = (item) => {
  form.value.network = item;
  updateRouteQuery("network", form.value.network);

  showNetDialog.value = false;
};
// initNetwork()
const coinLists = ref([]);
const getCoinNet = () => {
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  _cryptoCoin({ dedup: false })
    .then((res) => {
      const obj = {};
      coinLists.value = res.data || [];
      (res.data || []).map((item) => {
        if (item.type == "crypto") {
          if (obj[item.name]) {
            obj[item.name].push(item);
          } else {
            obj[item.name] = [item];
          }
        }
      });
      networkMapList.value = obj;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      closeToast();
    });
};

const goRecord = () => {
  router.push({
    name: "recordList",
    query: {
      tab: 0,
    },
  });
};
const errStatus = ref(false);
const AccountCheckRef = ref();
const goTopUp = () => {
  if (!form.value.amount || form.value.amount <= 0) {
    errStatus.value = true;
    return showToast(t("topUpCrypto.no_amount_msg"));
  }
  if (topUpMode.value == 2 && !rate.value) {
    return showToast(t("topUpCrypto.getting_rate_msg"));
  }
  submit();
};
const submit = () => {
  if (AccountCheckRef.value.check()) {
    router.push({
      name: "recharging",
      query: {
        amount: topUpMode.value == 1 ? form.value.amount : targetAmount.value,
        name: form.value.currency,
        currency: coinLists.value.find(
          (item) => item.network == form.value.network
        ).currency,
        network: form.value.network,
        swap: form.value.swap,
      },
    });
  }
};

// 汇率
const rate = ref("");
const targetAmount = computed(() => {
  if (topUpMode.value == 1) {
    return new Decimal(form.value.amount || 0).mul(rate.value || 1);
  } else {
    return new Decimal(form.value.amount || 0).div(rate.value || 1);
  }
});
let timeout = null;
let interval = null;
const timeDown = ref(10);
const rateLoading = ref(false);
const getRate = () => {
  if (timeout) clearTimeout(timeout);
  if (interval) clearInterval(interval);
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  rateLoading.value = true;
  _swapRate({
    from: coinLists.value.find((item) => item.network == form.value.network)
      .currency,
    to: "USDT",
    amount: 0,
  })
    .then((res) => {
      if (res.code == 200) {
        rate.value = res.data.exchange_rate;
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      closeToast();
      rateLoading.value = false;
    });
};

onMounted(() => {
  getCoinNet();
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>

<style lang="less" scoped>
.page_topup_crypto {
  padding: 1.32rem 0.32rem 1.44rem 0.32rem;
  position: relative;

  :deep(.top) {
    z-index: 10;
  }

  :deep(span.van-tab__text) {
    font-size: 0.32rem;
    color: var(--ex-text-color2);
  }

  .top-record {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ex-text-primary);
    font-size: 0.28rem;

    .top-record-icon {
      width: 0.3rem;
      height: 0.3rem;
      margin-right: 0.06rem;
    }
  }

  .recommend_list {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    padding: 0 0 0.8rem 0;

    .recommend_item {
      padding: 0.1rem 0.18rem;
      margin-right: 0.2rem;
      border-radius: 0.3rem;
      background-color: var(--ex-bg-color2);
      color: var(--ex-text-color);
      font-size: 0.24rem;
      font-weight: 400;
      display: flex;
      align-items: center;

      .recommend_icon {
        width: 0.32rem;
        height: 0.32rem;
        margin-right: 0.1rem;
      }
    }

    .recommend_active {
      background-color: var(--ex-primary-color);
      color: var(--ex-text-color--bg-primary);
    }
  }

  .form {
    .item {
      width: 100%;
      height: 1.12rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;

      .item_content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        font-size: 0.3rem;
        color: var(--ex-text-color);
        position: relative;
        line-height: 0.36rem;
        margin-right: 0.32rem;
        height: 100%;

        .ipt {
          width: 100%;
          height: 100%;
        }
      }

      .currency {
        display: flex;
        align-items: center;
        margin-right: 0.24rem;
        line-height: 1;

        .currency_icon {
          width: 0.48rem;
          height: 0.48rem;
          margin-right: 0.16rem;
        }
      }

      .more {
        width: 0.32rem;
        height: 0.32rem;
      }
    }

    .border_item {
      border-radius: 0.32rem;
      border: 1px solid var(--ex-border-color2);
      padding: 0 0.32rem;

      &:has(.ipt:focus) {
        border: 1px solid var(--ex-primary-color);
      }
    }

    .tip {
      font-size: 0.24rem;
      position: relative;
      top: -0.4rem;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .err_ipt {
      border: 1px solid var(--ex-error-color);
    }

    .select_item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    .subtitle {
      display: flex;
      align-items: center;
      font-size: 0.28rem;
      color: var(--ex-text-color);
      font-weight: 400;
      line-height: 0.36rem;
      margin-top: 0.4rem;
      margin-bottom: 0.12rem;

      >span {
        flex: 1;
      }

      .transing_icon {
        transition: all ease 0.5s;
        transform: rotate(360deg);
      }

      .transing_stop {
        transition: none;
        transform: rotate(0deg);
      }

      .subtitle_right {
        text-align: right;
        font-size: 0.28rem;
        color: var(--ex-text-color2);
      }
    }
  }

  .submit {
    width: 100%;
    height: 1.12rem;
    font-size: 0.36rem;
    margin-top: 0.8rem;
  }
}

.network_accounr_dialog {
  padding-top: 0.2rem;
  padding-bottom: 0.32rem;
}

.topup_accounr_dialog {
  .lists {
    height: 60vh;
    overflow-y: auto;
    margin-top: 0.2rem;
    padding-bottom: 0.32rem;
  }

  .search_box {
    height: 0.8rem;
    padding: 0 0.32rem;
    margin: 0.52rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: var(--ex-bg-color2);
    border-radius: 0.6rem;

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

  .swap_dialog_item {
    height: 1.04rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--ex-border-color);
    overflow: hidden;
    position: relative;
    font-size: 0.3rem;
    margin: 0 0.32rem;

    .icon {
      width: 0.64rem;
      height: 0.64rem;
      margin-right: 0.2rem;
    }
  }

  .swap_dialog_item:last-child {
    border-bottom: 0px;
  }

  .swap_dialog_item_active {
    color: var(--ex-primary-color);
    font-weight: 600;

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: var(--ex-primary-color);
      width: 0.48rem;
      height: 0.48rem;
      top: 50%;
      margin-top: -0.24rem;
    }
  }
}
</style>
