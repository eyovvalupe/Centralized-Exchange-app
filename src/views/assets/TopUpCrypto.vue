<!-- 充值-虚拟货币 -->
<template>
  <div class="page page_topup_crypto">
    <Top :title="$t('topUpCrypto.recharge')">
      <template #right>
        <div class="top-record" @click="goRecord">
          <div class="top-record-icon">
            <img v-lazy="getStaticImgUrl('/static/img/assets/record_sm.svg')" />
          </div>
        </div>
      </template>
    </Top>

    <div class="form">
      <div
        class="h-[1.28rem] px-[0.24rem] py-[0.16rem] flex rounded-[0.32rem] justify-between items-center mb-[0.24rem] border-[1px] bg-white1"
        @click="showDialog = true">
        <div class="flex flex-col justify-between">
          <div class="text-[0.28rem] text-color5">
            <span>{{ $t('topUpCrypto.currency') }}</span>
          </div>
          <div class="item relative top-[0.1rem]">
            <div class="select_item">
              <div class="currency">
                <div class="w-[0.48rem] h-[0.48rem] mr-[0.2rem]" v-if="form.currency">
                  <CryptoIcon :name="form.currency.toUpperCase()" class="rounded-full" />
                </div>
                <span>{{ form.currency || '' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-[0.2rem] h-[0.2rem]">
          <img v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)" alt="" />
        </div>
      </div>

      <div
        class="h-[1.28rem] px-[0.24rem] py-[0.16rem] flex rounded-[0.32rem] justify-between items-center mb-[0.24rem] border-[1px] bg-white1"
        @click="showNetDialog = true">
        <div class="h-full flex flex-col">
          <div class="text-[0.28rem] text-color5" style="width: max-content">
            <span>{{ t('topUpCrypto.network') }}</span>
          </div>
          <div class="item relative top-[0.32rem]">
            <div class="select_item">
              <div class="currency">
                <span>{{ form.network || '' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-[0.2rem] h-[0.2rem]">
          <img v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)" alt="" />
        </div>
      </div>
      <div
        class="transition w-full h-[1.28rem] flex justify-between items-center rounded-[0.32rem] px-[0.28rem] border-[1px] bg-white1 mb-[0.2rem]"
        :class="{ err_ipt: errStatus, 'border-color3': valueFocusRef }">
        <div class="item_content">
          <input class="ipt" @focus="valueFocusRef = true" @blur="
            errStatus = false;
          valueFocusRef = false;
          form.amount <= 0 ? (form.amount = '') : '';
          " type="number" v-model="form.amount" :placeholder="t('topUpCrypto.rechargeAmount')" />
        </div>
        <div>{{ topUpMode == 1 ? form.currency : 'USDT' }}</div>
      </div>
      <div class="flex gap-[0.1rem] mb-[0.3rem]">
        <div
          class="w-[1.32rem] h-[0.6rem] text-[0.28rem] text-color2 flex items-center justify-center rounded-[0.4rem] bg-white1 ripple-btn"
          @click="form.amount = 100">
          100
        </div>
        <div
          class="w-[1.32rem] h-[0.6rem] text-[0.28rem] text-color2 flex items-center justify-center rounded-[0.4rem] bg-white1 ripple-btn"
          @click="form.amount = 200">
          200
        </div>
        <div
          class="w-[1.32rem] h-[0.6rem] text-[0.28rem] text-color2 flex items-center justify-center rounded-[0.4rem] bg-white1 ripple-btn"
          @click="form.amount = 300">
          300
        </div>
      </div>
      <div class="text-[0.24rem] text-color2">
        1 {{ form.currency }} ≈ {{ rate || '--' }} USD
      </div>
    </div>
    <Button @click="goTopUp" :loading="loading" round class="submit ripple-btn" type="primary">{{
      $t('topUpCrypto.confirm')
    }}</Button>

    <!-- 币种选择弹窗 -->
    <BottomPopup v-model:show="showDialog" :title="$t('topUpCrypto.currencySelection')" closeable>
      <div class="topup_accounr_dialog">
        <!-- 搜索 -->
        <div class="search_box">
          <div class="search_icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
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
              <CryptoIcon class="rounded-full" :name="keyStr.toUpperCase()" />
            </div>
            <span>{{ keyStr.toUpperCase() }}</span>

            <div v-if="form.currency == keyStr" class="check_icon">
              <img v-lazy="getStaticImgUrl('/static/img/assets/check_green.svg')" />
            </div>
          </div>
        </div>
      </div>
    </BottomPopup>

    <!-- 网路选择弹窗 -->
    <BottomPopup round closeable :title="$t('topUpCrypto.networkSelection')" v-model:show="showNetDialog"
      position="bottom" teleport="body">
      <div class="topup_accounr_dialog network_accounr_dialog">
        <div @click="clickNetItem(item.network)" class="swap_dialog_item px-[0.28rem]"
          :class="{ swap_dialog_item_active: form.network == item.network }" v-for="(item, i) in currNetwork" :key="i">
          <span class="w-full text-start">{{ item.network }}</span>

          <div v-if="form.network == item.network" class="check_icon">
            <img v-lazy="getStaticImgUrl('/static/img/assets/check_green.svg')" />
          </div>
        </div>
      </div>
    </BottomPopup>

    <!-- 充提记录 -->
    <RecordList ref="RecordListRef" />

    <!-- 安全密码弹窗 -->
    <SafePassword @submit="submit" ref="safeRef"></SafePassword>

    <!-- 账号验证 -->
    <AccountCheck ref="AccountCheckRef" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from '@/utils/index.js';
import Top from '@/components/Top.vue';
import router from '@/router';
import { ref, computed, onBeforeUnmount, onMounted } from 'vue';
import store from '@/store';
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
} from 'vant';
import { useRoute } from 'vue-router';
import BottomPopup from '@/components/BottomPopup.vue';
import RecordList from '@/components/RecordList.vue';
import SafePassword from '@/components/SafePassword.vue';
import AccountCheck from '@/components/AccountCheck.vue';
import { _swapRate, _deposit1 } from '@/api/api';
import Decimal from 'decimal.js';
import { _cryptoCoin } from '@/api/api';
import { useI18n } from 'vue-i18n';
import {isEmpty} from '@/utils/isEmpty';

const { t } = useI18n();
const tabActive = ref('cryptocurrency');

const safeRef = ref();
const valueFocusRef = ref(false)
const userInfo = computed(() => store.state.userInfo || {});
const token = computed(() => store.state.sessionToken)
const RecordListRef = ref();
const route = useRoute();

const loading = ref(false);
// 表单
const form = ref({
  swap: true,
  amount: '',
  currency: '',
  network: '',
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
const recommendList = ref(['USDT', 'BTC', 'ETH']); // 推荐币种
// 钱包
const wallet = computed(() => {
  // 可选钱包列表
  return (
    store.state.wallet.filter(
      (item) => !['stock', 'contract', 'main', 'USD'].includes(item.currency),
    ) || []
  );
});
form.value.currency = route.query.currency || 'BTC'; // 初始化默认币种
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
  updateRouteQuery('currency', form.value.currency);

  showDialog.value = false;
  setTimeout(() => {
    initNetwork();
  }, 0);
};

const searchDialogStr = ref('');

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
  updateRouteQuery('network', form.value.network);

  showNetDialog.value = false;
};
// initNetwork()
const coinLists = ref([]);
const getCoinNet = () => {
  showLoadingToast({
    duration: 0,
    loadingType: 'circular',
  });
  _cryptoCoin({ dedup: false })
    .then((res) => {
      const obj = {};
      coinLists.value = res.data || [];
      (res.data || []).map((item) => {
        if (item.type == 'crypto') {
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
    name: 'recordList',
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
    return showToast(t('topUpCrypto.no_amount_msg'));
  }
  if (topUpMode.value == 2 && !rate.value) {
    return showToast(t('topUpCrypto.getting_rate_msg'));
  }
  if (isEmpty(form.value.currency) || isEmpty(form.value.network)) {
    return;
  }
  submit();
};
const submit = () => {
  if (AccountCheckRef.value.check()) {
    router.push({
      name: 'recharging',
      query: {
        amount: topUpMode.value == 1 ? form.value.amount : targetAmount.value,
        name: form.value.currency,
        currency: coinLists.value.find(
          (item) => item.network == form.value.network,
        ).currency,
        network: form.value.network,
        swap: form.value.swap,
      },
    });
  }
};

// 汇率
const rate = ref('');
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
    loadingType: 'circular',
  });
  rateLoading.value = true;
  _swapRate({
    from: coinLists.value.find((item) => item.network == form.value.network)
      .currency,
    to: 'USDT',
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
  store.dispatch('updateSessionToken')
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
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-color3);

    .top-record-icon {
      width: 0.36rem;
      height: 0.36rem;
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
      // height: 1.12rem;
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
      // height: 100%;
    }

    .subtitle {
      display: flex;
      align-items: center;
      font-size: 0.28rem;
      color: var(--ex-text-color);
      font-weight: 400;
      line-height: 0.36rem;
      // margin-top: 0.4rem;
      // margin-bottom: 0.12rem;

      >span {
        flex: 1;
      }

      .transing_icon {
        transition: all ease-in 0.5s;
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
    margin-top: 0.6rem;
    border-radius: 0.32rem;
  }
}

.network_accounr_dialog {
  padding-top: 0.2rem;
  padding-bottom: 0.32rem;
}

.topup_accounr_dialog {
  .lists {
    height: calc(var(--vh) * 60);
    overflow-y: auto;
    margin-top: 0.2rem;
    padding-bottom: 0.32rem;
  }

  .search_box {
    height: 0.96rem;
    padding: 0 0.32rem;
    margin: 0.52rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: var(--ex-bg-white2);
    // border: 1px solid var(--ex-border-color);
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
    height: 0.92rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
    font-size: 0.3rem;
    background-color: var(--ex-bg-color9);
    color: var(--ex-text-color2);
    padding: 0 0.32rem;

    .icon {
      width: 0.64rem;
      height: 0.64rem;
      margin-right: 0.2rem;
    }
  }

  .swap_dialog_item_active {
    color: var(--ex-text-color);
    font-weight: 600;
    background-color: rgba(255, 255, 255, 0.1);

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: var(--ex-text-color);
      width: 0.48rem;
      height: 0.48rem;
      top: 50%;
      margin-top: -0.24rem;
    }
  }
}
</style>
