<!-- 提现 -->
<template>
  <div class="page page_withdraw">
    <Top :title="$t('withdraw.withdraw')">
      <template #right>
        <div class="top-record" @click="goRecord">
          <div class="top-record-icon">
            <img src="/static/img/assets/record.png" />
          </div>
          <span>
            {{ $t("withdraw.withdrawRecord") }}
          </span>
        </div>
      </template>
    </Top>

    <Tabs
      type="custom-card"
      v-model:active="tabActive"
      :swipeable="false"
      shrink
    >
      <Tab :title="$t('withdraw.cryptocurrency')" name="cryptocurrency">
        <!-- 表单 -->
        <div class="form" v-if="currAccount">
          <FormItem custom :title="$t('withdraw.currency')">
            <div class="select_item" @click="showDialog = true">
              <div class="currency" v-if="form.from">
                <div class="currency_icon">
                  <img
                    :src="`/static/img/crypto/${form.from.toUpperCase()}.png`"
                    alt="currency"
                  />
                </div>
                <span>{{ form.from.toUpperCase() }}</span>
              </div>
              <div class="more">
                <img src="/static/img/assets/more.png" alt="more" />
              </div>
            </div>
          </FormItem>
          <FormItem custom :title="$t('withdraw.network')">
            <div class="select_item" @click="showNetworkDialog = true">
              <div class="currency">
                <span>{{ form.network }}</span>
              </div>
              <div class="more">
                <img src="/static/img/assets/more.png" alt="more" />
              </div>
            </div>
          </FormItem>
          <FormItem
            input-type="number"
            v-model="form.amount"
            show-btn
            :btn-text="$t('form.all')"
            :title="$t('withdraw.withdrawalAmount')"
            @change="changeAmount"
            @btnClick="maxIpt"
          >
            <template #title-right
              >{{ $t("withdraw.withdrawable") }}：{{ balance }}</template
            >
          </FormItem>

          <div class="tip">
            <span>{{ $t("withdraw.serviceFee") + ":" }}</span>
            <span class="num">{{ form.amount == "" ? "--" : fee }}</span>
          </div>

          <!-- 提款方式 -->
          <div class="subtitle">{{ $t("withdraw.receiptAccount") }}</div>
          <div class="account_box">
            <div
              class="card_box"
              v-if="showAccount.length && tabActive == 'cryptocurrency'"
              @click="showAccountDialog = true"
            >
              <div class="card_icon">
                <img
                  v-if="currAccount.symbol"
                  :src="`/static/img/crypto/${currAccount.symbol.toUpperCase()}.png`"
                  alt="currency"
                />
              </div>
              <div class="card">
                <div class="code">
                  {{
                    _hiddenAccount(
                      currAccount.address ? currAccount.address : ""
                    )
                  }}
                </div>
                <div class="name">
                  {{
                    currAccount.symbol ? currAccount.symbol.toUpperCase() : ""
                  }}
                </div>
              </div>
              <div class="more_card">{{ $t("withdraw.change") }}</div>
            </div>
            <div v-else class="add_account" @click="showAccountDialog = true">
              <Icon size="0.48rem" color="#014CFA" name="add-o" />
              <div class="add_account_text">
                {{ $t("withdraw.addPaymentMethod") }}
              </div>
            </div>
          </div>
        </div>

        <Button
          @click="openSafePass"
          :loading="loading"
          round
          color="#014CFA"
          class="submit"
          type="primary"
          >{{ $t("withdraw.withdraw") }}</Button
        >
      </Tab>
      <Tab :title="$t('withdraw.bankCard')" name="bankCard">
        <div class="form">
          <FormItem
            input-type="number"
            v-model="form.amount"
            show-btn
            :btn-text="$t('form.all')"
            :min="0"
            :title="$t('withdraw.withdrawalAmount')"
            @change="changeAmount"
            @btnClick="maxIpt"
          >
            <template #title-right
              >{{ $t("withdraw.withdrawable") }}：{{ totalAmount }}</template
            >
          </FormItem>
          <div class="tip">
            <span>{{ $t("withdraw.serviceFee") + ":" }}</span>
            <span class="num">{{ form.amount == "" ? "--" : fee }}</span>
          </div>

          <div class="subtitle">{{ $t("withdraw.receiptAccount") }}</div>
          <div class="account_box">
            <div
              class="card_box"
              v-if="showBankAccount.length && tabActive == 'bankCard'"
              @click="showAccountDialog = true"
            >
              <div class="card_icon">
                <img src="/static/img/user/card_type_b.png" alt="img" />
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
                <div class="name">
                  {{ currBankAccount.bankName ? currBankAccount.bankName : "" }}
                </div>
              </div>
              <div class="more_card">{{ $t("withdraw.change") }}</div>
            </div>
            <div v-else class="add_account" @click="showAccountDialog = true">
              <Icon size="0.48rem" color="#014CFA" name="add-o" />
              <div class="add_account_text">
                {{ $t("withdraw.addPaymentMethod") }}
              </div>
            </div>
          </div>
        </div>
        <Button
          @click="openSafePass"
          :loading="loading"
          round
          color="#014CFA"
          class="submit"
          type="primary"
          >{{ $t("withdraw.withdraw") }}</Button
        >
      </Tab>
    </Tabs>

    <!-- 账户种类选择弹窗 -->
    <Popup
      v-model:show="showDialog"
      position="bottom"
      round
      closeable
      teleport="body"
    >
      <div class="van-popup-custom-title">
        {{ $t("withdraw.currencySelection") }}
      </div>

      <div class="withdraw_accounr_dialog">
        <!-- 搜索 -->
        <div class="search_box">
          <div class="search_icon">
            <img src="/static/img/common/search.png" alt="🔍" />
          </div>
          <input
            v-model.trim="searchDialogStr"
            type="text"
            class="ipt"
            :placeholder="$t('withdraw.searchPlaceholder')"
            @input="searchList"
          />
        </div>
        <div class="lists">
          <div
            @click="clickItem(item)"
            class="swap_dialog_item"
            :class="{ swap_dialog_item_active: form.from == item.name }"
            v-for="(item, i) in searchDialogStr ? searchResult : wallet"
            :key="i"
            
          >
            <div class="icon">
              <img
                :src="`/static/img/crypto/${item.name.toUpperCase()}.png`"
                alt="currency"
              />
            </div>
            <span>{{ item.name.toUpperCase() }}</span>
            <div v-if="form.from == item.name" class="check_icon">
              <img src="/static/img/assets/success.svg" />
            </div>
          </div>
        </div>
      </div>
    </Popup>

    <Popup
      v-model:show="showNetworkDialog"
      position="bottom"
      round
      closeable
      teleport="body"
    >
      <div class="van-popup-custom-title">
        {{ $t("withdraw.networkSelection") }}
      </div>

      <div class="withdraw_accounr_dialog">
        <!-- 搜索 -->
        <div class="search_box">
          <div class="search_icon">
            <img src="/static/img/common/search.png" alt="🔍" />
          </div>
          <input
            v-model.trim="searchDialogStr"
            type="text"
            class="ipt"
            :placeholder="$t('withdraw.searchPlaceholder')"
          />
        </div>
        <div class="lists">
          <div
            class="swap_dialog_item"
            :class="{ swap_dialog_item_active: form.from == item.name }"
            v-if="Object.keys(currencyMapList).length"
            v-for="(item, i) in currencyMapList[form.from]"
            @click="clickNetworkItem(item)"
            :key="i"
            style="justify-content: space-between"
          >
            <span>{{ item }}</span>
            <div v-if="form.network == item" class="check_icon">
              <img src="/static/img/assets/success.svg" />
            </div>
          </div>
        </div>
      </div>
    </Popup>

    <!-- 账户选择弹窗 -->
    <Popup
      v-model:show="showAccountDialog"
      position="bottom"
      round
      closeable
      teleport="body"
    >
      <div class="van-popup-custom-title">
        {{
          tabActive == "cryptocurrency"
            ? $t("withdraw.accountSelection")
            : $t("withdraw.bankSelection")
        }}
      </div>

      <div class="withdraw_accounr_dialog">
        <div class="lists card_lists">
          <div class="add_account" @click="goAddAccount">
            <Icon size="0.48rem" color="#014CFA" name="add-o" />
            <div class="add_account_text">
              {{ $t("withdraw.addPaymentMethod") }}
            </div>
          </div>
          <div
            class="card_box"
            v-for="(item, i) in tabActive == 'cryptocurrency'
              ? showAccount
              : showBankAccount"
            @click="clickAccountItem(item)"
            :class="{
              card_box_active:
                (tabActive == 'cryptocurrency' && currAccount.id == item.id) ||
                (tabActive == 'bankCard' && currBankAccount.id == item.id),
            }"
            :key="i"
          >
            <div class="card_icon">
              <img
                v-if="tabActive == 'bankCard'"
                src="/static/img/user/card_type_b.png"
                alt="img"
              />
              <img
                v-else
                :src="`/static/img/crypto/${item.symbol}.png`"
                alt="currency"
              />
            </div>
            <div class="card">
              <div class="code">
                {{ _hiddenAccount(item.bankCardNumber || item.address) }}
              </div>
              <div class="name">
                {{ item.symbol ? item.symbol.toUpperCase() : item.bankName }}
              </div>
            </div>
            <div
              v-if="
                (tabActive == 'cryptocurrency' && currAccount.id == item.id) ||
                (tabActive == 'bankCard' && currBankAccount.id == item.id)
              "
              class="checked"
              style="background-image: url('/static/img/user/check_bg.png')"
            >
              <img src="/static/img/common/ok.png" alt="img" />
            </div>
          </div>
        </div>
      </div>
    </Popup>

    <!-- 安全密码弹窗 -->
    <SafePassword @submit="submit" ref="safeRef"> </SafePassword>

    <!-- 充提记录 -->
    <RecordList ref="RecordListRef" />

    <!-- 账号验证 -->
    <AccountCheck ref="AccountCheckRef" />
  </div>
</template>

<script setup>
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
const RecordListRef = ref();
const userInfo = computed(() => store.state.userInfo || {});
const tabActive = ref("cryptocurrency");
const loading = ref(false);
const route = useRoute();
// 表单
const form = ref({
  amount: "",
  from: '',
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
      return showToast("请输入金额");
    }
    if (form.value.amount > balance.value) {
      return showToast("余额不足");
    }
    if (!showAccount.value.length) {
      return showToast("请添加收款账户");
    }
    safeRef.value.open();
  }
};

const withdrawParams = ref({})
const submit = (s) => {
  if (loading.value) return;
  loading.value = true;
  if (tabActive.value == "bankCard") {
    withdrawParams.value = {
      currency: 'main',
      amount: form.value.amount,
      account_id: currBankAccount.value.id,
      safeword: s,
      token: sessionToken.value
    }
  } else {
    withdrawParams.value = {
      currency: form.value.from,
      amount: form.value.amount,
      account_id: currAccount.value.id,
      safeword: s,
      token: sessionToken.value,
    }
  }
  _withdraw(withdrawParams.value)
    .then((res) => {
      if (res.code == 200) {
        showToast("操作成功");
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
const searchResult = ref([])
const searchList = computed(() => {
  searchResult.value = wallet.value.filter(item => item.name.includes(searchDialogStr.value.toUpperCase()) || item.name.includes(searchDialogStr.value))
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
      title: "谷歌验证器",
      message: "你还未绑定谷歌验证器，是否去绑定?",
    }).then(() => {
      jump("google");
    });
  }
  const target = wallet.value.find((a) => a.name == form.value.from);
  if (target.type == "fiat") {
    if (userInfo.value.kycl2 != 2) {
      return showConfirmDialog({
        title: "身份认证",
        message: "你还未完成身份认证，是否去认证?",
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

Promise.all([
  import("@/views/User/Account/Bank.vue"),
  import("@/views/User/Account/Crypto.vue"),
]);

watch(
  () => form.value.from,
  (val) => {
    if (Object.keys(currencyMapList.value).length) {
      form.value.network = currencyMapList.value[val] && currencyMapList.value[val][0] ? currencyMapList.value[val][0] : '';
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
  padding: 1.32rem 0.32rem 1.44rem 0.32rem;
  position: relative;
  :deep(.top) {
    z-index: 10;
  }
  .top-record {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0953fa;
    font-size: 0.28rem;
    .top-record-icon {
      width: 0.3rem;
      height: 0.3rem;
      margin-right: 0.06rem;
    }
  }

  .submit {
    width: 100%;
    height: 1.12rem;
    font-size: 0.36rem;
    margin-top: 0.8rem;
  }

  .form {
    .tip {
      color: #666d80;
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
      color: #061023;
      font-weight: 400;
      line-height: 0.36rem;
      margin-top: 0.4rem;
      margin-bottom: 0.12rem;
      justify-content: space-between;
    }
    .select_item {
      flex: 1;
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

      .more {
        width: 0.32rem;
        height: 0.32rem;
      }
    }
  }
}

.add_account {
  background-color: #f5f7fc;
  border-radius: 0.32rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.24rem 0 0.2rem 0;
}
.add_account_text {
  color: #014cfa;
  text-align: center;
  font-size: 0.24rem;
  font-weight: 400;
  line-height: 0.44rem;
  margin-top: 0.08rem;
}

.card_box {
  border-radius: 0.32rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border: 1px solid #d0d8e2;
  background-color: #fff;
  padding: 0.2rem 0.32rem 0.28rem 0.32rem;

  .card_icon {
    width: 0.96rem;
    height: 0.96rem;
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
      color: #666d80;
    }
  }

  .more_card {
    color: #1a59f6;
    font-size: 0.24rem;
    font-weight: 400;
  }
}

.card_box_active {
  border: 1px solid #1a59f6;
  border-top-right-radius: 0;

  .checked {
    position: absolute;
    top: -1px;
    right: -1px;
    background-size: 100% 100%;
    width: 0.48rem;
    height: 0.41rem;

    > img {
      width: 0.17rem !important;
      height: 0.14rem !important;
      position: absolute;
      right: 0.06rem;
      top: 0.07rem;
    }
  }
}

.withdraw_accounr_dialog {
  .lists {
    height: 60vh;
    overflow-y: auto;
    margin-top: 0.2rem;
    padding-bottom: 0.32rem;
  }
  .card_lists {
    padding: 0.2rem 0.32rem 0.32rem 0.32rem;
  }
  .search_box {
    height: 0.8rem;
    padding: 0 0.32rem;
    margin: 0.52rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: #f5f7fc;
    border-radius: 0.6rem;
    // border: 1px solid #d0d8e2;

    .search_icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.24rem;
    }

    .ipt {
      height: 100%;
      font-weight: 400;
      color: #061023 !important;
    }
    .ipt::placeholder {
      color: #a4acb9;
    }
  }
  .swap_dialog_item {
    height: 1.04rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eff3f8;
    overflow: hidden;
    position: relative;
    font-size: 0.3rem;
    margin: 0 0.32rem;
    // justify-content: space-between;

    .icon {
      width: 0.64rem;
      height: 0.64rem;
      margin-right: 0.2rem;
      border-radius: 50%;
    }
  }
  .swap_dialog_item:last-child {
    border-bottom: 0px;
  }
  .swap_dialog_item_active {
    color: #014cfa;
    font-weight: 600;
    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: #014cfa;
      width: 0.48rem;
      height: 0.48rem;
      top: 50%;
      margin-top: -0.24rem;
    }
  }
  .card_box {
    margin-top: 0.22rem;
  }
  .building_icon {
    width: 0.72rem;
    height: 0.72rem;
    background-image: url('data:image/svg+xml;utf8,<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7539 1.91124C16.7539 1.91124 19.7142 -0.356765 24.8027 1.29231C24.8027 1.29231 26.5155 1.91123 28.4885 3.66416L34.6155 10.0583L31.345 13.308L21.9988 3.87047C21.9988 3.87047 20.4411 1.96247 16.7539 1.91124ZM30.2539 14.442L26.4116 18.1542C26.4116 18.1542 25.7885 19.032 25.2693 18.2068L18.2078 11.3488C18.2078 11.3488 17.5847 10.5235 17.1181 11.2449L10.0039 18.4643C10.0039 18.4643 9.5373 19.1857 10.1078 19.4958L17.0655 26.4051C17.0655 26.4051 17.6373 27.3328 18.1565 26.6114L25.3731 19.392C25.3731 19.392 25.5808 18.7731 26.7231 18.9282H34.0962C34.0962 18.9282 34.4078 26.3538 28.6962 30.9951C28.6962 30.9951 21.2719 38.3682 11.095 33.8308C11.095 33.8308 1.28223 30.4274 1.38607 17.7942C1.38607 17.7942 1.645 9.33693 9.38084 4.85077C9.38084 4.85077 15.0412 0.673389 19.5578 3.768L30.2539 14.442Z" fill="%23003A90"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }

  .ecobusiness_icon {
    width: 0.68rem;
    height: 0.68rem;
    background-image: url('data:image/svg+xml;utf8,<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6678)"><path d="M3.49953 16.944L3.61564 15.5646L3.73192 14.3011L4.07501 12.9218L4.5352 11.7746L5.10929 10.5103L5.79948 9.47618L6.1434 8.90177L6.6024 8.44277L7.40887 7.40949L8.44314 6.60438L9.47623 5.80129L10.6222 5.11094L11.7728 4.53566L13.036 4.07546L14.2993 3.73257L14.9895 3.6163L15.6775 3.50138H18.4364L19.6997 3.73241L21.0779 4.0753L22.2271 4.53549L23.4915 5.11077L24.5248 5.80113L25.0989 6.14505L25.5579 6.60405L26.5923 7.40916L27.3954 8.44244L28.1995 9.47585L28.8887 10.51L29.465 11.7743L29.9242 12.9214L30.2693 14.3008L30.3832 14.8749L30.4981 15.5642V18.322L30.2691 19.7003L29.924 20.9646L29.4648 22.2267L28.8885 23.3762L28.1993 24.5268L27.8543 25.0995L27.3953 25.5597L26.5922 26.4781L25.5577 27.3969L24.5246 28.2012L23.4914 28.8905L22.2269 29.4658L21.0777 29.9257L19.6995 30.2696L19.1255 30.385H18.4363L17.7459 30.4999H17.0557L15.6775 30.385L14.2993 30.2696L13.036 29.9257L11.7728 29.4658L10.6222 28.8905L9.47623 28.2012L8.90115 27.8563L8.44314 27.3969L7.40887 26.4781L6.60236 25.5597L5.79931 24.5268L5.10909 23.3762L4.535 22.2267L4.07481 20.9646L3.73175 19.7003L3.61548 19.011V18.3218L3.49937 17.6326V16.944H3.49953ZM0.169922 16.944L0.286033 18.6672L0.400086 19.5864L0.513973 20.3907L0.974035 21.9989L1.20317 22.8022L1.54828 23.4915L1.8934 24.2946L2.23848 24.986L3.04053 26.363L3.49973 27.0534L4.07501 27.7413L5.10929 28.891L5.6832 29.4663L6.25967 29.9262L6.94884 30.5004L7.63804 30.9594L8.32617 31.4184L9.0164 31.7637L10.5097 32.4527L12.0031 33.027L12.8072 33.2572L13.6101 33.4858L14.4153 33.6021L15.3334 33.7172L17.0557 33.8301L18.7803 33.7172L19.5844 33.6021L20.3887 33.4858L21.9971 33.0268L22.8001 32.7966L23.6053 32.4527L24.2934 32.1088L24.9838 31.7639L26.4761 30.9596L27.0513 30.5006L27.7405 29.9264L28.8887 28.8912L29.465 28.3168L30.0391 27.7415L30.4981 27.0535L30.9573 26.3632L31.4163 25.6741L31.7624 24.9862L32.5666 23.4917L33.1407 21.9992L33.2546 21.1941L33.4848 20.391L33.5998 19.5868L33.7146 18.6676L33.8299 16.944L33.7148 15.2191L33.5999 14.4173L33.485 13.6109L33.1409 12.0036L32.7958 11.1995L32.5668 10.3952L32.2217 9.70704L31.7625 9.01805L30.9574 7.52357L30.4983 6.94966L30.0393 6.2603L28.8889 5.11094L28.3149 4.53566L27.7409 3.96174L27.0517 3.50155L26.4764 3.04255L25.7884 2.58355L24.9843 2.24033L23.6059 1.43402L21.9978 0.85994L21.1945 0.630772L20.3894 0.515823L19.5851 0.399544L18.781 0.285824L17.0564 0.171604L15.3341 0.285824L14.4159 0.399544L13.6108 0.515823L12.0034 0.859741L11.1982 1.20469L10.5102 1.43382L9.70606 1.77893L9.0169 2.24013L7.63853 3.04238L6.94934 3.50138L6.26017 3.96158L5.10978 5.11077L4.5357 5.68485L4.07551 6.26013L3.50023 6.94949L3.04103 7.52341L2.58206 8.21377L2.23901 9.01788L1.54878 10.395L0.974699 12.0036L0.745896 12.8087L0.51467 13.6109L0.400783 14.4172L0.286697 15.2191L0.169922 16.944ZM26.4761 15.7936V8.32785H18.2063V10.7403H23.8334V13.4969H18.2063V20.9648H23.8334V23.4916H18.2063V25.9038H26.4761V18.4374H20.8489V15.9109H26.4761V15.7936ZM7.52156 15.7936V8.32785H15.7924V10.7403H10.1642V13.4969H15.7924V20.9648H10.1642V23.4916H15.7924V25.9038H7.52156V18.4374H13.1508V15.9109H7.52156V15.7936Z" fill="%23E50012"/></g><defs><clipPath id="clip0_553_6678"><rect width="34" height="34" fill="white" transform="matrix(1 0 0 -1 0 34)"/></clipPath></defs></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }

  .company_icon {
    width: 0.68rem;
    height: 0.68rem;
    background-image: url('data:image/svg+xml;utf8,<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6686)"><path d="M34 16.3193C34 12.0127 28.1067 8.38602 20.8533 8.38602C15.0733 8.38602 10.0867 10.6527 8.38667 13.826C8.16 14.166 8.04667 14.506 8.04667 14.846C8.04667 15.6393 8.5 16.3193 9.29333 16.7727L15.98 20.626C16.32 20.8527 16.7733 20.966 17.2267 20.966C17.68 20.966 18.1333 20.8527 18.4733 20.626L24.82 16.9993C25.2733 16.7727 25.5 16.3193 25.5 15.9793C25.5 15.526 25.2733 15.186 24.82 14.9593L22.44 13.5993L17.2267 16.6593L13.26 14.3927C14.7333 13.0327 17.68 12.126 20.8533 12.126C25.7267 12.126 29.6933 14.166 29.6933 16.7727C29.58 20.7393 23.8 23.7993 16.7733 23.5727C9.74667 23.2327 4.08 19.8327 4.19333 15.866C4.19333 10.6527 11.1067 6.45935 19.4933 6.57268C20.2867 6.57268 20.9667 6.57268 21.6467 6.68602C19.9467 6.11935 17.7933 5.66602 15.4133 5.66602C13.6 5.66602 11.7867 5.89268 10.3133 6.34602C4.30667 8.04602 0 11.8993 0 16.3193C0 22.326 7.59333 27.1993 17 27.1993C26.4067 27.3127 34 22.4393 34 16.3193Z" fill="%23003F8D"/></g><defs><clipPath id="clip0_553_6686"><rect width="34" height="34" fill="white"/></clipPath></defs></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }

  .emg_company_icon {
    width: 0.72rem;
    height: 0.72rem;
    background-image: url('data:image/svg+xml;utf8,<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M32.6667 13.293V11.418C32.6667 10.4233 32.2716 9.46954 31.5684 8.76642C30.8652 8.06307 29.9112 7.66797 28.9167 7.66797H6.41675C5.42225 7.66797 4.46825 8.06307 3.76505 8.76642C3.06185 9.46954 2.66675 10.4233 2.66675 11.418V13.293H32.6667ZM12.0417 24.543V22.6681C12.0417 22.1709 11.8443 21.6939 11.4924 21.3422C11.1408 20.9905 10.6641 20.793 10.1667 20.793H8.29175C7.79435 20.793 7.31765 20.9905 6.96605 21.3422C6.61415 21.6939 6.41675 22.1709 6.41675 22.6681V24.543C6.41675 25.0403 6.61415 25.5173 6.96605 25.869C7.31765 26.2204 7.79435 26.418 8.29175 26.418H10.1667C10.6641 26.418 11.1408 26.2204 11.4924 25.869C11.8443 25.5173 12.0417 25.0403 12.0417 24.543ZM2.66675 17.043H32.6667V26.4178C32.6667 27.4125 32.2716 28.3663 31.5684 29.0694C30.8652 29.7728 29.9112 30.1679 28.9167 30.1679H6.41675C5.42225 30.1679 4.46825 29.7728 3.76505 29.0694C3.06185 28.3663 2.66675 27.4125 2.66675 26.4178V17.043Z" fill="%23014CFA"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
