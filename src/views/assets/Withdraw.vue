<!-- 提现 -->
<template>
  <div class="page page_withdraw">
    <Top :title="$t('withdraw.withdraw')">
      <template #right>
        <div class="top-record" @click="goRecord">
          <div class="top-record-icon">
            <img v-lazy="getStaticImgUrl('/static/img/assets/record_sm.svg')" />
          </div>

        </div>
      </template>
    </Top>

    <Tabs type="custom-card" v-model:active="tabActive" :swipeable="false" shrink>
      <Tab :title="$t('withdraw.cryptocurrency')" name="cryptocurrency">
        <!-- 表单 -->
        <div class="form mt-[0.4rem]" v-if="currAccount">
          <FormItem custom :placeholder="$t('withdraw.currency')" class="mb-[0.4rem]">
            <div class="select_item" @click="showDialog = true">
              <div class="flex flex-col" v-if="form.from">
                <div class="text-color5 text-[0.24rem] mb-[0.1rem]">{{ t('withdraw.currency') }}</div>
                <div class="flex items-center">
                  <div class="currency_icon mr-[0.2rem]">
                    <img v-lazy="getStaticImgUrl(`/static/img/crypto/${form.from.toUpperCase()}.svg`)" alt="currency" />
                  </div>
                  <span>{{ form.from.toUpperCase() }}</span>
                </div>
              </div>
              <div class="w-[0.2rem] h-[0.2rem]">
                <img v-lazy="getStaticImgUrl('/static/img/assets/right_arrow.svg')" alt="more" />
              </div>
            </div>
          </FormItem>
          <FormItem custom :placeholder="$t('withdraw.network')" class="mb-[0.4rem]">
            <div class="select_item" @click="showNetworkDialog = true">
              <div>
                <div class="text-color5 text-[0.24rem] mb-[0.1rem]">
                  {{ t('withdraw.network') }}
                </div>
                <div class="currency">
                  <span>{{ form.network }}</span>
                </div>
              </div>
              <div class="more">
                <img v-lazy="getStaticImgUrl('/static/img/assets/right_arrow.svg')" alt="more" />
              </div>
            </div>
          </FormItem>

          <FormItem input-type="number" v-model="form.amount" show-btn :from="'withdraw'"
            :crypto-currency="form.from.toUpperCase()" :balance="balance" :placeholder="$t('withdraw.withdrawalAmount')"
            @change="changeAmount" @btnClick="maxIpt">

          </FormItem>

          <div class="tip mb-[0.4rem]">
            <span class="text-color5">{{ $t("withdraw.serviceFee") + ":" }}</span>
            <span class="num text-color5">{{ form.amount == "" ? "--" : fee }}</span>
          </div>

          <!-- 提款方式 -->
          <div class="px-[0.12rem] py-[0.12rem] rounded-[0.32rem] border-[1px] bg-color2">
            <div class="flex justify-between">
              <div class="text-color5 mb-[0.28rem] text-[0.32rem] px-[0.16rem] pt-[0.12rem]">{{
                $t("withdraw.receiptAccount")
              }}</div>
              <div v-if="showAccount.length" class="text-[0.28rem] text-primary mb-[0.28rem] px-[0.16rem] pt-[0.18rem]"
                @click="showAccountDialog = true">{{ $t("withdraw.change") }}</div>
            </div>
            <div class="account_box" :class="showAccount.length ? 'px-[0.16rem]' : ''">
              <div class="card_box h-full flex flex-col justify-between"
                v-if="showAccount.length && tabActive == 'cryptocurrency'">
                <div class="flex">
                  <div class="card_icon">
                    <img v-if="currAccount.symbol"
                      v-lazy="getStaticImgUrl(`/static/img/crypto/${currAccount.symbol.toUpperCase()}.svg`)"
                      alt="currency" />
                  </div>
                  <div class="h-full flex items-center">
                    {{
                      currAccount.symbol ? currAccount.symbol.toUpperCase() : ""
                    }}
                  </div>
                </div>
                <div class="text-[0.4rem]">
                  {{
                    _hiddenAccount(
                      currAccount.address ? currAccount.address : ""
                    )
                  }}
                </div>
              </div>
              <div v-else class="add_account"
                @click="showAccountDialog = true">
                <Icon size="0.48rem" color="var(--ex-primary-color)" name="add-o" />
                <div class="add_account_text">
                  {{ $t("withdraw.addPaymentMethod") }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button @click="openSafePass" :loading="loading" round class="submit" type="primary">{{ $t("withdraw.withdraw")
          }}</Button>
      </Tab>
      <Tab :title="$t('withdraw.bankCard')" name="bankCard">
        <div class="form mt-[0.46rem]">
          <FormItem input-type="number" v-model="form.amount" show-btn :from="'withdraw'" :min="0"
            :crypto-currency="'USD'" :balance="balance" :placeholder="$t('withdraw.withdrawalAmount')"
            @change="changeAmount" @btnClick="maxIpt">
            <template #title-right>{{ $t("withdraw.withdrawable") }}：{{ totalAmount }}</template>
          </FormItem>
          <div class="tip mb-[0.4rem]">
            <span>{{ $t("withdraw.serviceFee") + ":" }}</span>
            <span class="num">{{ form.amount == "" ? "--" : fee }}</span>
          </div>

          <div class="bg-color2 rounded-[0.32rem]"
            :class="showBankAccount.length ? 'px-[0.28rem] pt-[0.28rem] pb-[0.12rem]' : 'p-[0.12rem]'">
            <div class="flex justify-between mb-[0.28rem]"
              :class="showBankAccount.length ? '' : 'pl-[0.16rem] pt-[0.12rem]'">
              <div class="text-[0.32rem] text-color5">{{ $t("withdraw.receiptAccount") }}</div>
              <div class="text-[0.28rem] text-primary" v-if="showBankAccount.length" @click="showAccountDialog = true">
                {{
                  $t("withdraw.change") }}</div>
            </div>
            <div class="account_box">
              <div class="card_box" v-if="showBankAccount.length && tabActive == 'bankCard'">
                <div class="flex justify-between mb-[0.32rem]">
                  <div class="flex items-center">
                    <div class="card_icon">
                      <img v-lazy="getStaticImgUrl('/static/img/bank/card_default.svg')" alt="img" />
                    </div>
                    <div class="name">
                      {{ currBankAccount.bankName ? currBankAccount.bankName : "" }}
                    </div>
                  </div>
                  <div class="text-[0.28rem] text-color3">
                    {{ t('户主姓名：') + currBankAccount.accountName }}
                  </div>
                </div>
                <div class="card">
                  <div class="code">
                    {{
                      _hiddenAccount(
                        currBankAccount.bankCardNumber
                          ? currBankAccount.bankCardNumber
                          : ""
                      )
                    }}
                  </div>

                </div>

              </div>
              <div v-else class="add_account" @click="showAccountDialog = true">
                <Icon size="0.48rem" color="var(--ex-primary-color)" name="add-o" />
                <div class="add_account_text">
                  {{ $t("withdraw.addPaymentMethod") }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button @click="openSafePass" :loading="loading" round class="submit" type="primary">{{ $t("withdraw.withdraw")
          }}</Button>
      </Tab>
    </Tabs>

    <!-- 账户种类选择弹窗 -->
    <BottomPopup v-model:show="showDialog" position="bottom" round closeable teleport="body">
      <div class="van-popup-custom-title w-full text-center text-[0.32rem]">
        {{ $t("withdraw.currencySelection") }}
      </div>

      <div class="withdraw_accounr_dialog">
        <!-- 搜索 -->
        <div class="search_box">
          <div class="search_icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
          </div>
          <input v-model.trim="searchDialogStr" type="text" class="ipt" :placeholder="$t('withdraw.searchPlaceholder')"
            @input="searchList" />
        </div>
        <div class="lists">
          <div @click="clickItem(item)" class="swap_dialog_item px-[0.28rem]"
            :class="{ swap_dialog_item_active: form.from == item.name }"
            v-for="(item, i) in searchDialogStr ? searchResult : wallet" :key="i">
            <div class="icon">
              <img v-lazy="getStaticImgUrl(`/static/img/crypto/${item.name.toUpperCase()}.svg`)" alt="currency" />
            </div>
            <span>{{ item.name.toUpperCase() }}</span>
            <div v-if="form.from == item.name" class="check_icon">
              <img v-lazy="getStaticImgUrl('/static/img/assets/actived_check.svg')" />
            </div>
          </div>
        </div>
      </div>
    </BottomPopup>

    <BottomPopup :title="$t('withdraw.networkSelection')" v-model:show="showNetworkDialog" position="bottom" round
      closeable teleport="body">

      <div class="withdraw_accounr_dialog">
        <!-- 搜索 -->
        <div class="search_box">
          <div class="search_icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
          </div>
          <input v-model.trim="searchDialogStr" type="text" class="ipt"
            :placeholder="$t('withdraw.searchPlaceholder')" />
        </div>
        <div class="lists">
          <div class="swap_dialog_item px-[0.28rem]" :class="{ swap_dialog_item_active: form.network == item }"
            v-if="Object.keys(currencyMapList).length" v-for="(item, i) in currencyMapList[form.from]"
            @click="clickNetworkItem(item)" :key="i" style="justify-content: space-between">
            <span>{{ item }}</span>
            <div v-if="form.network == item" class="check_icon">
              <img v-lazy="getStaticImgUrl('/static/img/assets/actived_check.svg')" />
            </div>
          </div>
        </div>
      </div>
    </BottomPopup>

    <!-- 账户选择弹窗 -->
    <BottomPopup v-model:show="showAccountDialog" position="bottom" round closeable teleport="body">
      <div class="van-popup-custom-title w-full text-center text-[0.32rem]">
        {{
          tabActive == "cryptocurrency"
            ? $t("withdraw.accountSelection")
            : $t("withdraw.bankSelection")
        }}
      </div>

      <div class="withdraw_accounr_dialog">
        <div class="lists card_lists">
          <div class="add_account" @click="goAddAccount">
            <Icon size="0.48rem" color="var(--ex-primary-color)" name="add-o" />
            <div class="add_account_text">
              {{ $t("withdraw.addPaymentMethod") }}
            </div>
          </div>
          <div class="card_box" v-for="(item, i) in tabActive == 'cryptocurrency'
            ? showAccount
            : showBankAccount" @click="clickAccountItem(item)" :class="{
              card_box_active:
                (tabActive == 'cryptocurrency' && currAccount.id == item.id) ||
                (tabActive == 'bankCard' && currBankAccount.id == item.id),
            }" :key="i">
            <div class="flex mb-[0.32rem]">
              <div class="flex items-center">
                <div class="card_icon">
                  <img v-if="tabActive == 'bankCard'" v-lazy="getStaticImgUrl('/static/img/bank/card_default.svg')"
                    alt="img" />
                  <img v-else v-lazy="getStaticImgUrl(`/static/img/crypto/${item.symbol}.svg`)" alt="currency" />
                </div>
                <div class="card">
                  <div class="name">
                    {{ item.symbol ? item.symbol.toUpperCase() : item.bankName }}
                  </div>
                </div>
              </div>
              <div class="flex-1" v-if="tabActive == 'bankCard'">
                <div class="text-end text-[0.28rem] text-color3">
                  {{ t('户主姓名：') + currBankAccount.accountName }}
                </div>
              </div>
            </div>
            <div class="text-[0.4rem]">
              {{ _hiddenAccount(item.bankCardNumber || item.address) }}
            </div>
            <div v-if="
              (tabActive == 'cryptocurrency' && currAccount.id == item.id) ||
              (tabActive == 'bankCard' && currBankAccount.id == item.id)
            " class="checked" :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/ok_bg.svg')})` }">
              <img v-lazy="getStaticImgUrl('/static/img/common/ok.svg')" alt="img" />
            </div>
          </div>
        </div>
      </div>
    </BottomPopup>

    <!-- 安全密码弹窗 -->
    <SafePassword @submit="submit" ref="safeRef"> </SafePassword>

    <!-- 充提记录 -->
    <RecordList ref="RecordListRef" />

    <!-- 账号验证 -->
    <AccountCheck ref="AccountCheckRef" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { ref, computed, onMounted, watch } from "vue";
import store from "@/store";
import {
  Icon,
  Button,
  Popup,
  showToast,
  Tabs,
  Tab,
  showConfirmDialog,
} from "vant";
import router from "@/router";
import { _withdrawFee, _withdraw, _cryptoCoin } from "@/api/api";
import SafePassword from "@/components/SafePassword.vue";
import { _hiddenAccount } from "@/utils/index";
import RecordList from "@/components/RecordList.vue";
import AccountCheck from "@/components/AccountCheck.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";

const { t } = useI18n();
const RecordListRef = ref();
const userInfo = computed(() => store.state.userInfo || {});
const tabActive = ref("cryptocurrency");
const loading = ref(false);
const route = useRoute();
// 表单
const form = ref({
  amount: "",
  from: "",
  account: "",
  network: "",
});

const currencyMapList = computed(() => store.state.currencyMapList || []);
const changeAmount = () => {
  setTimeout(() => {
    getFee();
  }, 0);
};

const searchDialogStr = ref("");

// 提交
const safeRef = ref();
const errStatus = ref(false);
const AccountCheckRef = ref();
const openSafePass = () => {
  if (AccountCheckRef.value.check()) {
    if (!form.value.amount || form.value.amount <= 0) {
      errStatus.value = true;
      return showToast(t("withdraw.no_amount_msg"));
    }
    if (form.value.amount > balance.value) {
      return showToast(t("withdraw.no_enough_msg"));
    }
    if ((tabActive == 'cryptoCurrency' && !showAccount.value.length) || (tabActive == 'bankCard' && !showBankAccount.value.length)) {
      return showToast(t("withdraw.no_account_msg"));
    }
    safeRef.value.open();
  }
};

const withdrawParams = ref({});
const submit = (s) => {
  if (loading.value) return;
  loading.value = true;
  if (tabActive.value == "bankCard") {
    withdrawParams.value = {
      currency: "main",
      amount: form.value.amount,
      account_id: currBankAccount.value.id,
      safeword: s,
      token: sessionToken.value,
    };
  } else {
    withdrawParams.value = {
      currency: form.value.from,
      amount: form.value.amount,
      account_id: currAccount.value.id,
      safeword: s,
      token: sessionToken.value,
    }
  }
  console.log(withdrawParams.value)
  _withdraw(withdrawParams.value)
    .then((res) => {
      if (res.code == 200) {
        showToast(t("withdraw.successful"));
        form.value.amount = "";
        store.dispatch("updateWallet"); // 更新钱包
        router.push({
          name: "withdrawInfo",
          query: res.data,
        });
      }
    })
    .finally(() => {
      getSessionToken();
      loading.value = false;
    });
};

// 手续费
const fee = ref(0);
const getFee = () => {
  if (!form.value.amount) return;

  loading.value = true;
  _withdrawFee({
    currency: form.value.from,
    amount: form.value.amount,
  })
    .then((res) => {
      if (res.code == 200) {
        fee.value = res.data;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
// 钱包
const wallet = computed(() => {
  // 可选钱包列表
  return store.state.wallet || [];
});

const balance = computed(() => {
  // main钱包余额
  let b = 0;
  const main = store.state.wallet.find((item) => item.name == form.value.from);
  if (main) b = main.amount;
  return b;
});

const totalAmount = computed(() => {
  let b = 0;
  const main = store.state.wallet.find((item) => item.name == "USDT");
  if (main) b = main.amount;
  return b;
});

const maxIpt = () => {
  console.log('click!!!!!!!!!')
  form.value.amount = balance.value;
  setTimeout(() => {
    getFee();
  }, 0);
};

// 收款方式
store.dispatch("updateAccountList");
const accountList = computed(() => store.state.accountList || []); // 收款方式列表
// 可用钱包列表
const showAccount = computed(() => {
  // 虚拟货币
  return (
    accountList.value.filter(
      (item) =>
        item.channel == "crypto" &&
        (item.symbol == form.value.from.toLowerCase() ||
          item.symbol == form.value.from)
    ) || []
  );
});

const showBankAccount = computed(() => {
  return accountList.value.filter((item) => item.channel == "bank") || [];
});

// 当前钱包
const currAccount = computed(() => {
  if (tabActive.value == "cryptocurrency" && form.value.account) {
    const result = showAccount.value.find(
      (item) => item.id == form.value.account
    );
    return result;
  } else if (tabActive.value == "cryptocurrency" && !form.value.account) {
    return showAccount.value[0] || {};
  }
});

const currBankAccount = computed(() => {
  if (tabActive.value == "bankCard" && form.value.account) {
    return showBankAccount.value.find((item) => item.id == form.value.account);
  } else if (tabActive.value == "bankCard" && !form.value.account) {
    return showBankAccount.value[0] || {};
  } else {
  }
});

const showAccountDialog = ref(false);
const searchResult = ref([]);
const searchList = computed(() => {
  searchResult.value = wallet.value.filter(
    (item) =>
      item.name.includes(searchDialogStr.value.toUpperCase()) ||
      item.name.includes(searchDialogStr.value)
  );
});

const clickAccountItem = (item) => {
  form.value.account = item.id;
  showAccountDialog.value = false;
};

// 账户弹窗
const showDialog = ref(false);
const showNetworkDialog = ref(false);
const clickItem = (item) => {
  form.value.from = item.name;
  const _query = {};
  Object.keys(route.query).map((k) => {
    _query[k] = route.query[k];
  });
  _query.currency = item.name;
  router.replace({
    path: route.path,
    query: _query,
  });
  form.value.account = "";
  form.value.amount = "";
  showDialog.value = false;
};

const clickNetworkItem = (item) => {
  form.value.network = item;

  const _query = {};
  Object.keys(route.query).map((k) => {
    _query[k] = route.query[k];
  });
  _query.from = item.name;
  router.replace({
    path: route.path,
    query: _query,
  });
  form.value.account = "";
  form.value.amount = "";
  showNetworkDialog.value = false;
};

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  store.dispatch("updateSessionToken");
};

// 跳转记录
const goRecord = () => {
  router.push({
    name: "recordList",
    query: {
      tab: 1,
    },
  });
};
// 跳转添加
const goAddAccount = () => {
  // google检测
  if (!userInfo.value.googlebind) {
    return showConfirmDialog({
      title: t("withdraw.no_auth_title"),
      message: t("withdraw.no_auth_con"),
      theme: 'round-button'
    }).then(() => {
      jump("google");
    });
  }
  const target = wallet.value.find((a) => a.name == form.value.from);
  if (target.type == "fiat") {
    if (userInfo.value.kycl2 != 2) {
      return showConfirmDialog({
        title: t("withdraw.no_google_msg"),
        message: t("withdraw.no_google_con"),
        theme: 'round-button'
      }).then(() => {
        jump("kyc");
      });
    }
    router.push({
      name: "bank",
    });
  } else {
    router.push({
      name: "bank",
      query: {
        currency: form.value.from,
      },
    });
  }
};

onMounted(() => {
  if (route.query.currency) {
    form.value.from = route.query.currency;
  } else if (wallet.value[0]) {
    form.value.from = wallet.value[0].name;
  }
  // if (AccountCheckRef.value.check()) {
  getSessionToken();
  // }
});

// 添加
const jump = (name) => {
  router.push({
    name,
  });
};

// Promise.all([
//   import("@/views/User/Account/Bank.vue"),
//   import("@/views/User/Account/Crypto.vue"),
// ]);

watch(
  () => form.value.from,
  (val) => {
    if (Object.keys(currencyMapList.value).length) {
      form.value.network =
        currencyMapList.value[val] && currencyMapList.value[val][0]
          ? currencyMapList.value[val][0]
          : "";
    }
  }
);


watch(
  () => tabActive.value,
  (val) => {
    form.value.account = "";
  }
);
</script>

<style lang="less" scoped>
.page_withdraw {
  padding: 1.32rem 0.4rem 1.44rem 0.4rem;
  position: relative;

  :deep(.top) {
    z-index: 10;
  }

  :deep(span.van-tab__text) {
    font-size: 0.32rem;
  }

  .top-record {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 0.4rem;
    background-color: var(--ex-bg-color3);
    display: flex;
    align-items: center;
    justify-content: center;

    .top-record-icon {
      width: 0.36rem;
      height: 0.36rem;
    }
  }

  .submit {
    width: 100%;
    height: 1.12rem;
    font-size: 0.36rem;
    margin-top: 0.8rem;
    border-radius: 0.4rem;
  }

  .form {
    .tip {

      color: var(--ex-text-color2);
      font-size: 0.28rem;
      line-height: 0.36rem;
      margin-top: 0.24rem;

      .num {
        margin-left: 0.08rem;
      }
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
      justify-content: space-between;
    }

    .select_item {
      flex: 1;
      height: 1.28rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;

      .currency {
        display: flex;
        align-items: center;
        margin-right: 0.24rem;
        line-height: 1;

        .currency_icon {
          width: 0.48rem;
          height: 0.48rem;
          margin-right: 0.16rem;

          img {
            border-radius: 50%;
          }
        }
      }

      .currency_icon {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.16rem;

        img {
          border-radius: 50%;
        }
      }

      .more {
        width: 0.2rem;
        height: 0.2rem;
      }
    }
  }
}

.add_account {
  background-color: var(--ex-bg-color3);
  border-radius: 0.32rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.24rem 0 0.2rem 0;
}

.add_account_text {
  color: var(--ex-primary-color);
  text-align: center;
  font-size: 0.24rem;
  font-weight: 400;
  line-height: 0.44rem;
  margin-top: 0.08rem;
}

.card_box {
  width: 100%;
  margin-bottom: 0.14rem;
  height: 2.16rem;
  border-radius: 0.4rem;
  justify-content: space-between;
  position: relative;
  padding: 0.28rem;
  background-color: var(--ex-bg-color3);

  .card_icon {
    width: 0.68rem;
    height: 0.68rem;
    margin-right: 0.18rem;

    img {
      border-radius: 50%;
    }
  }

  .card {
    flex: 1;
    margin-right: 0.32rem;
    line-height: 0.44rem;

    .code {
      font-size: 0.32rem;
      font-weight: 600;
    }

    .name {
      font-size: 0.28rem;
      color: var(--ex-text-color2);
    }
  }

}

.more_card {
  color: var(--ex-primary-color);
  font-size: 0.24rem;
  font-weight: 400;
}

.card_box_active {
  border: 1px solid var(--ex-primary-color);

  .checked {
    position: absolute;
    bottom: -1px;
    right: -1px;
    background-size: 100% 100%;
    width: 0.8rem;
    height: 0.7rem;

    >img {
      width: 0.48rem !important;
      height: 0.48rem !important;
      position: absolute;
      right: 0.15rem;
      bottom: 0.12rem;
    }
  }
}

.withdraw_accounr_dialog {
  .lists {
    height: calc(var(--vh) * 50);
    overflow-y: auto;
    margin-top: 0.2rem;
    padding-bottom: 0.32rem;
  }

  .card_lists {
    padding: 0.2rem 0.32rem 0.32rem 0.32rem;
  }

  .search_box {
    height: 0.96rem;
    padding: 0 0.32rem;
    margin: 0.52rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: var(--ex-bg-color2);
    border-radius: 0.6rem;
    border: 1px solid var(--ex-border-color2);

    .search_icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.24rem;
    }

    .ipt {
      height: 100%;
      font-weight: 400;
      color: var(--ex-text-color) !important;
    }

  }

  .swap_dialog_item {
    height: 1.12rem;
    display: flex;
    align-items: center;
    background-color: var(--ex-bg-color3);
    border-radius: 0.32rem;
    overflow: hidden;
    position: relative;
    font-size: 0.3rem;
    margin: 0.2rem 0.32rem 0 0.32rem;
    color: var(--ex-text-color2);

    .icon {
      width: 0.64rem;
      height: 0.64rem;
      margin-right: 0.2rem;
      border-radius: 50%;
    }
  }

  .swap_dialog_item_active {
    color: var(--ex-text-color);
    font-weight: 600;

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

  .card_box {
    margin-top: 0.22rem;
  }

}
</style>
