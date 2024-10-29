<!-- 收款账户 -->
<template>
  <div class="page page_account">
    <div class="top_icon_container">
      <div class="top_back_container text-[0.48rem]" @click="goBack">
        <Icon name="arrow-left" />
      </div>

      <div><span class="text-[0.36rem]">收款账户</span></div>
      <div></div>
    </div>
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
            <BankList />
          </div>
        </div>
      </Tab>
    </Tabs>

    <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" />
    <!-- <div class="text-[0.48rem]"><Icon name="arrow-left" /></div> -->

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

const route = useRoute();

store.dispatch("updateAccountList");

const userInfo = computed(() => store.state.userInfo || {});
const accountList = computed(() => store.state.accountList || []); // 收款方式列表
console.log('account list ============> ', accountList.value)
const bankList = computed(() =>
  accountList.value.filter((item) => item.channel == "bank")
); // 银行卡
console.log("bank list ==========> ", bankList.value)
const cryptoList = computed(() =>
  accountList.value.filter((item) => item.channel == "crypto")
); // 加密货币
console.log('crypto list =========> ', cryptoList.value)
// tabs
const active = ref(0);
const changeTab = (key) => {
  active.value = key;
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
  }

  // google检测
  if (userInfo.value.kycl2 == 2 && !userInfo.value.googlebind) {
    return showConfirmDialog({
      title: "谷歌验证器未绑定",
      message: "您的谷歌验证器还未绑定，请先绑定再添加收款账户",
    }).then(() => {
      jump("google");
    });
  }
  // showAS.value = true;
  jump('crypto')
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

Promise.all([
  import("@/views/User/Account/Bank.vue"),
  import("@/views/User/Account/Crypto.vue"),
]);

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

  .top_icon_container {
    width: 7.5rem;
    justify-content: space-between;
    height: 1.12rem;
    display: flex;
    align-items: center;
    top: 0;
    background-color: #fff;
    margin-bottom: 0.2rem;

    .top_back_container {
      .arrow_icon {
        width: 20px;
        height: 20px;
        clip-path: path("M13.4 2L5 10.4L13.4 18.8");
        background-color: #061023;
      }
    }

    .language_icon_container {
      width: 0.72rem;
      height: 0.72rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-width: 0.02rem;
      border-color: #edf2f7;
      border-radius: 0.36rem;

      .language_icon {
        width: 0.432rem;
        height: 0.432rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g clip-path="url(%23clip0_129_5851)"><path d="M10.8912 0.306641C4.98556 0.306641 0.199219 5.09298 0.199219 10.9986C0.199219 16.9043 4.98556 21.6906 10.8912 21.6906C16.7969 21.6906 21.5832 16.9043 21.5832 10.9986C21.5832 5.09298 16.7969 0.306641 10.8912 0.306641ZM20.1075 10.2858H17.2814C17.1588 7.20075 16.2567 4.47207 14.8952 2.65108C17.7993 4.04606 19.8458 6.91396 20.1075 10.2858ZM15.8446 10.2858H11.604V1.83805C13.8956 2.44782 15.6664 5.94778 15.8446 10.2858ZM10.1784 1.83805V10.2858H5.93782C6.11602 5.94778 7.88688 2.44782 10.1784 1.83805ZM6.88729 2.65108C5.52294 4.47207 4.62359 7.19797 4.50108 10.2858H1.67494C1.93667 6.91396 3.98318 4.04606 6.88729 2.65108ZM1.67494 11.7114H4.49829C4.62081 14.7965 5.52294 17.5252 6.8845 19.3462C3.98318 17.9512 1.93667 15.0833 1.67494 11.7114ZM5.93782 11.7114H10.1784V20.1592C7.88688 19.5495 6.11602 16.0495 5.93782 11.7114ZM11.604 20.1592V11.7114H15.8446C15.6664 16.0495 13.8956 19.5495 11.604 20.1592ZM14.8952 19.3462C16.2595 17.5252 17.1588 14.7993 17.2814 11.7114H20.1047C19.8458 15.0833 17.7993 17.9512 14.8952 19.3462Z" fill="%23666D80"/></g><defs><clipPath id="clip0_129_5851"><rect width="21.6" height="21.6" fill="white" transform="translate(0.199219 0.199219)"/></clipPath></defs></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

  :deep(.van-tabs__wrap) {
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

  //   :deep(.van-action-sheet__content) {
  //     padding: 0.4rem 0 1rem 0;

  //     .van-action-sheet__item {
  //       padding: 0.32rem;
  //       border-bottom: 1px solid #f5f5f5;
  //     }
  //   }

  //   .tabs {
  //     overflow: hidden;

  //     :deep(.van-tab__panel) {
  //       // height: calc(var(--app-height) - 3.4rem);
  //       // overflow-y: auto;
  //     }

  //     :deep(.van-tabs__nav--card) {
  //       border: none;
  //     }

  //     :deep(.van-tab--card) {
  //       border-right: none;
  //       color: #061023;
  //       // background-color: #f5f5f5;
  //       // border-radius: 0.3rem;
  //       // margin-left: 0.1rem;
  //       // transition: all ease .2s;
  //     }

  //     :deep(.van-tab--card.van-tab--active) {
  //       // background-color: #014CFA;
  //       // color: #fff;

  //       background-color: #f6f8ff;
  //       border-radius: 0.3rem;
  //       color: #014cfa;
  //       font-weight: 500;
  //     }

  //     :deep(.van-tab--shrink) {
  //       padding: 0 0.3rem;
  //     }

  //     :deep(.van-tabs__wrap) {
  //       height: 0.8rem;
  //       border-bottom: 1px solid rgba(0, 0, 0, 0);
  //       padding-bottom: 0.2rem;
  //     }

  //     :deep(.van-tabs__nav--card) {
  //       height: 0.6rem;
  //     }

  //     :deep(.van-tab) {
  //       line-height: 0.6rem;
  //       font-size: 0.28rem;
  //     }
  //   }

  // .list {
  //   padding-top: 0.5rem;

  //   .add_item {
  //     border: 1px dashed #ccd7fd;
  //     border-radius: 0.24rem;
  //     margin-bottom: 0.2rem;
  //     height: 1.44rem;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //   }

  //   .subtitle {
  //     margin-bottom: 0.2rem;
  //     margin-top: 0.4rem;
  //     font-size: 0.28rem;
  //     line-height: 0.44rem;
  //     color: #111111;
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;

  //     .add_box {
  //       display: flex;
  //       align-items: center;
  //       justify-content: center;
  //       font-weight: 400;
  //       font-size: 0.28rem;
  //       color: #000000;

  //       .add_icon {
  //         width: 0.44rem;
  //         height: 0.44rem;
  //         margin-right: 0.08rem;
  //       }
  //     }
  //   }

  //   .item {
  //     background-color: #f6f7fa;
  //     padding: 0.24rem 0.24rem 0.24rem 1.44rem;
  //     border-radius: 0.24rem;
  //     margin-bottom: 0.2rem;
  //     height: 1.44rem;
  //     color: #061023;
  //     font-size: 0.28rem;
  //     line-height: 0.48rem;
  //     position: relative;

  //     .icon_box {
  //       width: 0.96rem;
  //       height: 0.96rem;
  //       background-color: #d9e4ff;
  //       border-radius: 0.24rem;
  //       padding: 0.16rem;
  //       position: absolute;
  //       left: 0.24rem;
  //       top: 0.24rem;
  //     }
  //   }
  // }
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