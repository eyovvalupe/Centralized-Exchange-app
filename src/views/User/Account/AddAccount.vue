<!-- 收款账户 -->
<template>
  <div class="page page_account">
    <Top :title="'添加收款账户'" />
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
          <div class="list">
            <div class="page_crypto">
              <div class="flex flex-col items-center">
                <div style="float: left">
                  <div class="subtitle">币种</div>
                  <div class="item" @click="showCrypto = true">
                    <div class="item_icon">
                      <img
                        :src="`/static/img/crypto/${form.currency}.png`"
                        alt="usdt"
                      />
                    </div>
                    <div class="ipt">{{ form.currency }}</div>
                    <Icon style="transform: rotate(90deg)" name="play" />
                  </div>
                </div>
                <div style="float: left">
                  <div class="subtitle">网络</div>
                  <div class="item" @click="showNet = true">
                    <div class="ipt">{{ form.network }}</div>
                    <Icon style="transform: rotate(90deg)" name="play" />
                  </div>
                </div>
                <div style="float: left">
                  <div class="subtitle">地址</div>
                  <div class="item">
                    <input
                      type="text"
                      v-model.trim="form.address"
                      class="ipt"
                      maxlength="50"
                      placeholder="请输入对应币种地址"
                    />
                  </div>
                </div>
              </div>
              <div class="btn_container">
                <Button
                  :disabled="!form.address"
                  class="submit"
                  type="primary"
                  round
                  color="#014CFA"
                  @click="next"
                  >保存</Button
                >
              </div>
              <!-- 谷歌验证 -->
              <GoogleVerfCode ref="googleRef" @submit="submit" />
            </div>
          </div>
        </div>
      </Tab>
      <Tab :title="'银行卡'" name="1">
        <div class="tab_data">
          <div class="list">
            <Bank />
          </div>
        </div>
      </Tab>
    </Tabs>
    <!-- 币种 -->
    <Popup
      :safe-area-inset-top="false"
      :safe-area-inset-bottom="true"
      round
      v-model:show="showCrypto"
      position="bottom"
      class="popup_container"
    >
      <div class="bottoms">
        <div class="absolute top-[0.2rem] right-[0.5rem]">
          <CrossIcon @click="showCrypto = false" />
        </div>
        <div
          @click="chooseCurrency(item)"
          class="bottom"
          :class="{ active_bottom: form.currency == item }"
          v-for="item in currencyMapList"
          :key="item"
        >
          <div class="bottom_icon_container">
            <img
              :src="`/static/img/crypto/${item.toUpperCase()}.png`"
              alt="usdt"
            />
          </div>
          <span>{{ item }}</span>
        </div>
      </div>
    </Popup>
    <!-- 网络 -->
    <Popup
      :safe-area-inset-top="true"
      :safe-area-inset-bottom="true"
      round
      v-model:show="showNet"
      position="bottom"
      class="popup_container"
    >
      <div class="bottoms">
        <div
          @click="chooseNet(item)"
          class="bottom"
          :class="{ active_bottom: form.network == item }"
          v-for="item in currNetwork"
          :key="item"
        >
          <span>{{ item.network }}</span>
        </div>
        <Icon @click="showNet = false" class="close" name="cross" />
      </div>
    </Popup>
  </div>
</template>

<script setup>
import { Tabs, Tab, Icon, Button, Popup, showToast } from "vant";
import store from "@/store";
import { computed, ref, onMounted } from "vue";
import router from "@/router";
import { _hiddenAccount } from "@/utils/index";
import { useRoute } from "vue-router";
import { _userinfo, _addAccount, _cryptoCoin } from "@/api/api";
import Bank from "./Bank.vue";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import Top from "@/components/Top.vue";
import CrossIcon from "./components/Icons/CrossIcon.vue";

const route = useRoute();
const coinMap = computed(() => store.state.coinMap || {});
const showSuccessToast = computed(() => store.state.showSuccessToast || false);
const googleRef = ref();
const successToast = ref(false);
const loading = ref(false);
const form = ref({
  channel: "crypto",
  currency: route.query.currency || "USDT",
  network: "",
  address: "",
});

// 币种
const showCrypto = ref(false);
const chooseCurrency = (item) => {
  form.value.currency = item;
  showCrypto.value = false;
  initNetwork();
};

// 网络
const showNet = ref(false);
const chooseNet = (item) => {
  form.value.network = item.network;
  showNet.value = false;
};

const currNetwork = computed(() => {
  return coinMap.value[form.value.currency] || [];
});

// setTimeout(() => {
//   console.error("????", coinMap.value, form.value.currency, currNetwork.value);
// }, 5000);

const initNetwork = () => {
  if (currNetwork.value[0]) {
    form.value.network = currNetwork.value[0].network;
  }
};
initNetwork();

const selectedPayment = computed(() => store.state.selectedPayment || "0");
const active = ref(selectedPayment.value);
const changeTab = (key) => {
  active.value = key;
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

const currencyMapList = computed(() => {
  return Object.keys(coinMap.value) || [];
});
_cryptoCoin({ dedup: false }).then((res) => {
  store.commit("setCoinMap", res.data || []);
});

// 提交
const submit = (googleCode) => {
  if (loading.value) return;
  loading.value = true;
  const params = {
    ...form.value,
    googlecode: googleCode,
    token: sessionToken.value,
  };
  _addAccount(params)
    .then((res) => {
      if (res.code == 200) {
        store.commit("setShowSuccessToast", true);
        setTimeout(() => {
          store.commit("setShowSuccessToast", false);
        }, 1000);
        setTimeout(() => {
          router.back();
        }, 200);
      }
    })
    .finally(() => {
      getSessionToken();
      loading.value = false;
    });
};
const next = () => {
  googleRef.value.open();
};

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  loading.value = true;
  store.dispatch("updateSessionToken").finally(() => {
    loading.value = false;
  });
};
getSessionToken();
</script>

<style lang="less" scoped>
.page_account {
  width: 7.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  .popup_container {
    width: 7.5rem;

    .bottoms {
      width: 100%;
      height: 50vh;
      position: relative;
      padding: 0.7rem 0;

      :deep(.van-popup--bottom.van-popup--round) {
        width: 6.86rem;
      }
      .close {
        position: absolute;
        font-size: 0.4rem;
        top: 0.3rem;
        right: 0.4rem;
        color: #161616;
      }

      .bottom {
        color: #111111;
        font-size: 0.28rem;
        height: 1.12rem;
        display: flex;
        align-items: center;
        // justify-content: center;
        padding-left: 3rem;
        overflow: hidden;
        border-bottom: 0.02rem solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .bottom_icon_container {
          width: 0.44rem;
          height: 0.44rem;
          margin-right: 0.14rem;
          position: relative;
          top: -0.04rem;
        }
      }

      .active_bottom {
        background-color: #f5f5f5;
      }
    }
  }

  :deep(.van-tabs__wrap) {
    padding: 0 0.32rem;
    height: 0.92rem;
    margin-bottom: 0.4rem;
    margin-top: 1.2rem;
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

  .page_crypto {
    height: calc(100vh - 2.52rem);

    .subtitle {
      font-weight: 400;
      font-size: 0.28rem;
      line-height: 0.36rem;
      color: #061023;
      margin-bottom: 0.15rem;
    }

    .item {
      width: 6.86rem;
      // padding: 0 0.32rem;
      height: 0.92rem;
      border: 0.02rem solid #d0d8e2;
      border-radius: 0.32rem;
      margin-bottom: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.36rem;

      .ipt {
        flex: 1;
        height: 100%;
        font-size: 0.3rem;
        text-align: left;
        outline: none;
        border: none;
        background-color: rgba(0, 0, 0, 0);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-weight: 600;
        color: #061023;
      }

      .item_icon {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.2rem;
      }

      :deep(.van-icon) {
        color: #666d80;
      }
    }

    .btn_container {
      width: 100%;
      display: flex;
      justify-content: center;
      position: relative;

      .submit {
        margin-top: 0.4rem;
        height: 1rem;
        width: 6.86rem;

        :deep(.van-button__text) {
          font-size: 0.36rem;
          line-height: 0.64rem;
        }
      }
    }
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
