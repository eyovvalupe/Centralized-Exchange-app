<!-- 收款账户 -->
<template>
  <div class="page page_account">
    <Top :title="'收款账户'"/>
    <Tabs
      type="card"
      class="tab_content tabs"
      v-if="!pageLoading"
      @change="changeTab"
      v-model:active="active"
      :swipeable="false"
      animated
      shrink
    >
      <Tab :title="'加密货币'" name="0">
        <div class="tab_data">
          <div class="no_data" v-if="cryptoList.length == 0">
            <img src="/static/img/user/noData.svg" />
            <span class="mt-[0.2rem] text-[#a4acb9] text-[0.28rem]">暂无数据</span>
          </div>
          <div class="list" v-else>
            <CryptoList :list="cryptoList"/>
          </div>
        </div>
      </Tab>
      <Tab :title="'银行卡'" name="1">
        <div class="tab_data">
          <div class="no_data" v-if="bankList.length == 0">
            <img src="/static/img/user/noData.svg" />
            <span class="mt-[0.2rem] text-[#a4acb9] text-[0.28rem]">暂无数据</span>
          </div>
          <div class="list" v-else>
            <BankList :list="bankList"/>
          </div>
        </div>
      </Tab>
    </Tabs>
    <div class="add_btn" @click="goAddAccount"><span class="text-[white] text-[0.36rem] font-normal">添加收款账户</span></div>
  </div>
</template>

<script setup>
import { Tabs, Tab, Icon, ActionSheet, showConfirmDialog } from "vant";
import store from "@/store";
import { computed, ref, onMounted } from "vue";
import router from "@/router";
import { _hiddenAccount } from "@/utils/index";
import { useRoute, useRouter } from "vue-router";
import { _userinfo } from "@/api/api";
import Bank from './Bank.vue'
import Crypto from './Crypto.vue'
import Check from './Check.vue'
import CryptoList from "./CryptoList.vue";
import BankList from "./BankList.vue";
import Top from "@/components/Top.vue";

const route = useRoute();

store.dispatch("updateAccountList");

const userInfo = computed(() => store.state.userInfo || {});
const accountList = computed(() => store.state.accountList || []); // 收款方式列表
const bankList = computed(() =>
  accountList.value.filter((item) => item.channel == "bank")
); // 银行卡
const cryptoList = computed(() =>
  accountList.value.filter((item) => item.channel == "crypto")
); // 加密货币
console.log(cryptoList.value)
const selectedPayment = computed(() => store.state.selectedPayment || '0')
// tabs
const active = ref(selectedPayment.value);
const changeTab = (key) => {
  store.commit('setSelectedPayment', key)
  active.value = selectedPayment.value;
};

// 打开添加类型选择弹窗
const showAS = ref(false);
const actions = [
  { name: "银行卡", value: "bank" },
  { name: "加密货币", value: "crypto" },
];
const goAddAccount = async () => {
  console.log(userInfo.value)
  //身份认证检测
  if (userInfo.value.kycl2 != 2) {
    return showConfirmDialog({
      title: "身份未认证",
      message: "您的身份还未进行认证，请先认证再添加收款账户",
      confirmButtonText: "去认证"
    }).then(() => jump("kyc"))
      .catch(() => goBack());
  }

  // google检测
  if (userInfo.value.kycl2 == 2 && !userInfo.value.googlebind) {
    return showConfirmDialog({
      title: "谷歌验证器未绑定",
      message: "您的谷歌验证器还未绑定，请先绑定再添加收款账户",
    }).then(() => {
      jump("google");
    })
    .catch(() => goBack());
  }
  // showAS.value = true;
  jump('bank')
};
const onSelect = async (item) => {
  showAS.value = false;
  if (item.value == "bank") {
    // 银行卡
    if (userInfo.value.kycl2 != 2) {
      return showConfirmDialog({
        title: "身份认证",
        message: "你还未完成身份认证，是否去认证?",
      }).then(() => {
        jump("kyc");
      });
    }
  }
  jump(item.value);
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
    height: 0.92rem;
    margin-bottom: 0.4rem;

  }

  :deep(.van-tabs__nav) {
    width: 100%;
    margin: 0;
    height: 0.92rem;
    border-radius: 0.32rem;
    border-width: 0.02rem;
    border-color: #eff3f8;
  }

  :deep(.van-tab--card.van-tab) {
    width: 50%;
    border: none;

    .van-tab__text {
      font-size: 0.32rem;
      line-height: 0.5rem;
      color: #666d80;
    }
  }

  :deep(.van-tab--card.van-tab--active) {
    width: 50%;
    border-radius: 0.3rem;
    background-color: #014cfa;

    .van-tab__text {
      font-size: 0.32rem;
      line-height: 0.5rem;
      color: white;
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
        width: 1.932rem;
        height: 1.934rem;
        margin-top: 1rem;
      }
    }
  }

  .list {
    width: 100%;
    padding: 0.02rem;
  }

  .add_btn {
    width: 6.86rem;
    height: 1.12rem;
    background-color: #014cfa;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1.6rem;
    position: absolute;
    bottom: 0.72rem;
  }
}
</style>
<style lang="css">
.van-dialog {
  padding-top: 0.8rem;
}
.van-dialog__header {
  padding: 0;
  font-size: 0.32rem;
  line-height: 0.44rem;
  margin-bottom: 0.2rem;
}
.van-dialog__message {
  font-size: 0.28rem;
  line-height: 0.44rem;
  color: #333333;
}
.van-dialog__cancel {
  .van-button__content {
    font-size: 0.32rem;
    line-height: 0.44rem;
    color: #8f92a1;
  }
}
.van-dialog__confirm {
  .van-button__content {
    font-size: 0.32rem;
    line-height: 0.44rem;
    color: #014cfa;
  }
}

</style>