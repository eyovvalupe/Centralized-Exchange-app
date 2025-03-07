<!-- 收款账户 -->
<template>
  <div class="page page_account">
    <Top :title="t('account.add_page_title')" />
    <Tabs type="custom-card" class="tab_content tabs" v-if="!pageLoading" @change="changeTab" v-model:active="active"
      :swipeable="false" animated shrink>
      <Tab :title="t('account.add_tab1')" name="0">
        <div class="tab_data">
          <div class="list">
            <div class="page_crypto">
              <div class="flex flex-col items-center">
                <div style="float: left">
                  <div class="item" @click="showCrypto = true">
                    <div class="flex flex-col">
                      <div class="subtitle">
                        {{ $t("account.add_subtitle_type") }}
                      </div>
                      <div class="flex items-center">
                        <div style="width: 0.48rem;height:0.48rem" class="mr-[0.2rem]">
                          <CryptoIcon :name="form.currency" />
                        </div>
                        <div class="ipt mr-[0.16rem]">{{ form.currency }}</div>
                        <div v-if="form.network" class="w-max px-[0.1rem] h-[0.3rem] text-[0.22rem] rounded-[0.15rem] bg-white2 flex items-center">{{ form.network }}</div>
                      </div>
                    </div>
                    <div class="w-[0.2rem] h-[0.2rem]">
                      <img v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)" alt="">
                    </div>
                  </div>
                </div>
                <div style="float: left">
                  <div class="item" @click="showNet = true">
                    <div class="flex flex-col">
                      <div class="subtitle">
                        {{ $t("account.add_subtitle_network") }}
                      </div>
                      <div class="ipt">{{ form.network }}</div>
                    </div>
                    <div class="w-[0.2rem] h-[0.2rem]">
                      <img v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)" alt="">
                    </div>
                  </div>
                </div>
                <div style="float: left">
                  <div class="item">
                    <div :class="!isFocus && !form.address ? 'flex' : ''">
                      <div class="text-color5"
                        :class="isFocus || form.address ? 'text-[0.28rem] mb-[0.15rem]' : 'text-[0.32rem]'">
                        {{ $t("account.add_subtitle_address") }}
                      </div>
                      <input type="text" v-model.trim="form.address" class="ipt" maxlength="50" @focus="isFocus = true"
                        @blur="isFocus = false" />
                    </div>
                    <div class="w-[0.32rem] h-[0.32rem]" v-if="form.address" @click="form.address = ''">
                      <img v-lazy="getStaticImgUrl(`/static/img/common/close.svg`)" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn_container">
                <Button :disabled="!form.address" class="submit ripple-btn" type="primary" round color="var(--ex-primary-color)"
                  @click="next"><span style="color: var(--ex-white);">{{
                    $t("account.add_btn") }}</span></Button>
              </div>
              <!-- 谷歌验证 -->
              <GoogleVerfCode ref="googleRef" @submit="submit" />
            </div>
          </div>
        </div>
      </Tab>
      <Tab :title="t('account.add_tab2')" name="1">
        <div class="tab_data">
          <div class="list">
            <Bank />
          </div>
        </div>
      </Tab>
    </Tabs>
    <!-- 币种 -->
    <BottomPopup :from="'account'" :title="$t('account.add_subtitle_type')" :safeAreaInsetTop="false" :safeAreaInsetBottom="true" round v-model:show="showCrypto"
      position="bottom" class="popup_container" closeable>
      <div class="pt-[0.3rem] px-[0.32rem] h-full">
        <div class="w-full  mb-[0.2rem]">
          <div class="w-full h-[0.96rem] rounded-[1rem] bg-white2 flex items-center px-[0.2rem]">
            <div style="width: 0.48rem;height: 0.48rem;">
              <img v-lazy="getStaticImgUrl(`/static/img/common/search.svg`)" alt="">
            </div>
            <input v-model="searchRef" type="text" class="flex-1 h-[0.6rem] px-[0.2rem] text-color text-[0.3rem]"
              @input="searchItem" />
          </div>
        </div>
        <div class="bottoms">
          <div @click="chooseCurrency(item)" class="bottom justify-between mask-btn" :class="{ active_bottom: form.currency == item }"
            v-for="item in searchRef ? searchResult : currencyMapList" :key="item">
              <div class="flex items-center">
                <div style="width: 0.64rem;height: 0.64rem;" class="mr-[0.2rem]">
                  <CryptoIcon :name="item" />
                </div>
                <span class="text-[0.3rem]">{{ item }}</span>
              </div>
              <div v-if="form.currency == item" style="width: 0.48rem;height: 0.48rem;">
                <img v-lazy="getStaticImgUrl(`/static/img/assets/actived_check.svg`)" alt="">
              </div>
          </div>
        </div>
      </div>
    </BottomPopup>
    <!-- 网络 -->
    <BottomPopup closeable :title="$t('account.add_subtitle_network')" :from="'account'" :safe-area-inset-top="true" :safe-area-inset-bottom="true" round
      v-model:show="showNet" position="bottom" class="popup_container">
      <div class="pt-[0.3rem] px-[0.32rem] h-full">
        <div class="bottoms">
          <div @click="chooseNet(item)" class="bottom justify-between mask-btn" :class="{ active_bottom: form.network == item.network }"
            v-for="item in currNetwork" :key="item">
            <span>{{ item.network }}</span>
            <div v-if="form.network == item.network" style="width: 0.48rem;height: 0.48rem;">
                <img v-lazy="getStaticImgUrl(`/static/img/assets/actived_check.svg`)" alt="">
              </div>
          </div>
        </div>
      </div>
    </BottomPopup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
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
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";
import CryptoIcon from "@/components/CryptoIcon.vue";

const { t } = useI18n();
const route = useRoute();
const coinMap = computed(() => store.state.coinMap || {});
const googleRef = ref();
const searchRef = ref(null);
const searchResult = ref([]);
const loading = ref(false);
const form = ref({
  channel: "crypto",
  currency: route.query.currency || "USDT",
  network: "",
  address: "",
});

// 币种
const showCrypto = ref(false);
const isFocus = ref(false)
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

const closeCrypto = () => {
  showCrypto.value = false;
  setTimeout(() => {
    searchRef.value = "";
  }, 30);
};

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

const searchItem = () => {
  searchResult.value = Object.keys(coinMap.value).filter(
    (item) =>
      item.includes(searchRef.value) ||
      item.includes(searchRef.value.toUpperCase())
  );
};

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
        store.commit("setSuccessToastText", t('success_toast_message'))
        store.commit("setShowSuccessToast", true);
        
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
      height: calc(var(--vh) * 50);
      overflow-y: auto;
      justify-content: start;

      :deep(.van-popup--bottom.van-popup--round) {
        width: 6.86rem;
      }

      .close {
        position: absolute;
        font-size: 0.4rem;
        top: 0.3rem;
        right: 0.4rem;
        color: var(--ex-text-color);
      }

      .bottom {
        color: var(--ex-text-color);
        font-size: 0.28rem;
        height: 1.12rem;
        display: flex;
        align-items: center;
        overflow: hidden;
        background-color: var(--ex-bg-color3);
        border-radius: 0.32rem;
        padding: 0 0.28rem;
        margin-top: 0.2rem;
        color:var(--ex-text-color2);
      }

      .active_bottom{
        color:var(--ex-text-color);
      }

    }
  }

  :deep(.van-tabs__wrap) {
    padding: 0 0.32rem;
    height: 0.96rem;
    margin-bottom: 0.4rem;
    margin-top: 1.2rem;
  }

  :deep(.van-tabs__nav) {
    width: 100%;
    margin: 0;
    height: 0.96rem;
    border-radius: 0.2rem;
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
    background-color: var(--ex-primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1.6rem;
    position: absolute;
    bottom: 0.72rem;
  }

  .page_crypto {
    height: calc(var(--vh) * 100 - 2.52rem);

    .subtitle {
      font-weight: 400;
      font-size: 0.28rem;
      color: var(--ex-text-color5);
      margin-bottom: 0.15rem;
    }

    .item {
      width: 6.86rem;
      // padding: 0 0.32rem;
      height: 1.28rem;
      border: 1px solid var(--ex-border-color);
      background-color: var(--ex-bg-white2);
      border-radius: 0.32rem;
      margin-bottom: 0.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
        // font-weight: 600;
        color: var(--ex-text-color);
      }

      .item_icon {
        display: flex;
      }

      :deep(.van-icon) {
        color: var(--ex-text-color2);
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
        border-radius: 0.2rem;

        :deep(.van-button__text) {
          font-size: 0.32rem;
          line-height: 0.64rem;
        }
      }
    }
  }


}
</style>