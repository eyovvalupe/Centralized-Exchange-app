<!-- 收款账户 -->
<template>
  <div class="page page_account">
    <Top :title="t('account.page_title')" />
    <Tabs type="custom-card" class="tab_content tabs" v-if="!pageLoading" @change="changeTab" v-model:active="active"
      :swipeable="false" animated shrink>
      <Tab :title="t('account.crypto')" name="0">
        <div class="tab_data">
          <div class="no_data" v-if="cryptoList.length == 0">
            <NoWallet />
          </div>
          <div class="list" v-else>
            <CryptoList :list="cryptoList" />
          </div>
        </div>
      </Tab>
      <Tab :title="t('account.bank')" name="1">
        <div class="tab_data">
          <div class="no_data" v-if="bankList.length == 0">
            <NoWallet />
          </div>
          <div class="list" v-else>
            <BankList :list="bankList" />
          </div>
        </div>
      </Tab>
    </Tabs>

    <div class="w-full flex justify-center">
      <div class="add_btn" @click="goAddAccount">
        <span class="text-black text-[0.36rem] font-normal font-semibold">{{ $t("account.add_account_btn") }}</span>
      </div>
    </div>

    <BottomPopup round closeable v-model:show="needAuth" position="bottom" teleport="body">
      <div class="w-full h-[4rem]">
        <div v-if="userInfo.kycl2 != 2" class="w-full flex flex-col items-center">
          <div class="text-[0.36rem] mb-[0.56rem]">{{ t('account.no_kyc_title') }}</div>
          <div class="flex flex-col items-center mb-[0.48rem]">
            <span class="text-[0.32rem] ">{{ t('account.no_kyc_con1') }}</span>
            <span class="text-[0.32rem]">{{ t('account.no_kyc_con2') }}</span>
          </div>
          <div class="w-full flex justify-between px-[0.4rem]">
            <div
              class="w-[3.16rem] h-[0.8rem] flex items-center justify-center rounded-[1.3rem] bg-white text-black text-[0.32rem]"
              @click="goBack">{{ t('user_page.message_box_cancel') }}</div>
            <div
              class="w-[3.16rem] h-[0.8rem] flex items-center justify-center rounded-[1.3rem] bg-primary text-black text-[0.32rem]"
              @click="jump('kyc')">{{ t('account.no_kyc_confirm') }}</div>
          </div>
        </div>
        <div v-else-if="userInfo.kycl2 == 2 && !userInfo.googlebind" class="w-full flex flex-col items-center">
          <div class="text-[0.36rem] mb-[0.56rem]">{{ t('account.no_google_title') }}</div>
          <div class="flex flex-col items-center mb-[0.48rem]">
            <span class="text-[0.32rem] ">{{ t('account.no_google_con1') }}</span>
            <span class="text-[0.32rem]">{{ t('account.no_google_con2') }}</span>
          </div>
          <div class="w-full flex justify-between px-[0.4rem]">
            <div
              class="w-[3.16rem] h-[0.8rem] flex items-center justify-center rounded-[1.3rem] bg-white text-black text-[0.32rem]"
              @click="goBack">{{ t('user_page.message_box_cancel') }}</div>
            <div
              class="w-[3.16rem] h-[0.8rem] flex items-center justify-center rounded-[1.3rem] bg-primary text-black text-[0.32rem]"
              @click="jump('google')">{{ t('account.no_kyc_confirm') }}</div>
          </div>
        </div>
      </div>
    </BottomPopup>
  </div>
</template>

<script setup>
import { Tabs, Tab } from "vant";
import store from "@/store";
import { computed, ref, onMounted } from "vue";
import router from "@/router";
import { _hiddenAccount } from "@/utils/index";
import { useRoute, useRouter } from "vue-router";
import { _userinfo } from "@/api/api";
import CryptoList from "./CryptoList.vue";
import BankList from "./BankList.vue";
import Top from "@/components/Top.vue";
import { useI18n } from "vue-i18n";
import NoWallet from "@/components/NoWallet.vue";
import BottomPopup from "@/components/BottomPopup.vue";

const { t } = useI18n();
const route = useRoute();

store.dispatch("updateAccountList");

const needAuth = ref(false)
const userInfo = computed(() => store.state.userInfo || {});
const accountList = computed(() => store.state.accountList || []); // 收款方式列表
const bankList = computed(() =>
  accountList.value.filter((item) => item.channel == "bank")
); // 银行卡
const cryptoList = computed(() =>
  accountList.value.filter((item) => item.channel == "crypto")
); // 加密货币
const selectedPayment = computed(() => store.state.selectedPayment || "0");
// tabs
const active = ref(selectedPayment.value);
const changeTab = (key) => {
  store.commit("setSelectedPayment", key);
  active.value = selectedPayment.value;
};

// 打开添加类型选择弹窗
const showAS = ref(false);
const goAddAccount = async () => {
  //身份认证检测
  console.log(userInfo.value)
  if (userInfo.value.kycl2 != 2) {
    needAuth.value = true
    return;
  }

  // google检测
  if (userInfo.value.kycl2 == 2 && !userInfo.value.googlebind) {
    needAuth.value = true;
    return;
  }
  // showAS.value = true;
  jump("bank");
};

// 添加
const jump = (name) => {
  router.push({
    name,
  });
};

const pageLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false;
  }, 500);
});

const goBack = () => {
  if (route.query.reurl) {
    router.replace({
      name: route.query.reurl,
      query: {
        redata: route.query.redata,
      },
    });
  } else {
    router.back();
  }
};
</script>

<style lang="less" scoped>
.page_account {
  display: flex;
  flex-direction: column;
  padding: 0 0.32rem;
  height: 100%;

  :deep(.van-tabs__wrap) {
    margin-top: 1.2rem;
    height: 0.96rem;
    margin-bottom: 0.4rem;
  }

  :deep(.van-tabs__nav) {
    width: 100%;
    margin: 0;
    height: 0.96rem;
    border-radius: 1rem;
    border-width: 0.02rem;
    border-color: var(--ex-border-color);
  }

  :deep(.van-tab--card.van-tab) {
    width: 50%;
    border: none;

    .van-tab__text {
      font-size: 0.32rem;
      line-height: 0.5rem;
      color: var(--ex-text-color2);
    }
  }

  :deep(.van-tab--card.van-tab--active) {
    width: 50%;
    border-radius: 0.3rem;
    background-color: var(--ex-primary-color);

    .van-tab__text {
      font-size: 0.32rem;
      line-height: 0.5rem;
      color: var(--ex-text-color--bg-primary);
    }
  }

  :deep(.van-tabs__content--animated) {
    .tab_data {
      display: flex;
      justify-content: center;

      .no_data {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: max-content;
        margin-top: 1rem;
      }
    }
  }

  .list {
    width: 100%;
    padding: 0.02rem;
  }

  .add_btn {
    width: 6.7rem;
    height: 1.12rem;
    background-color: var(--ex-primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.4rem;
    position: absolute;
    bottom: 0.52rem;
    margin: 0 auto;
  }
}
</style>
<style lang="less">
.account_dialog {
  padding-top: 0.8rem;


  .van-dialog__header {
    padding: 0;
    font-size: 0.32rem;
    line-height: 0.44rem;
    margin-bottom: 0.2rem;
  }

  .van-dialog__message {
    font-size: 0.28rem;
    line-height: 0.44rem;
    color: var(--ex-text-color);
  }

  .van-dialog__cancel {
    .van-button__content {
      font-size: 0.32rem;
      line-height: 0.44rem;
      color: var(--ex-text-color3);
    }
  }

  .van-dialog__confirm {
    .van-button__content {
      font-size: 0.32rem;
      line-height: 0.44rem;
      color: var(--ex-primary-color);
    }
  }
}
</style>
