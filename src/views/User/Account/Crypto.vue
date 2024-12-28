<!-- 添加加密货币 -->
<template>
  <div class="page page_crypto">
    <div class="flex flex-col items-center">
      <div style="float: left">
        <div class="subtitle">币种</div>
        <div class="item" @click="showCrypto = true">
          <div class="item_icon">
            <img :src="getStaticImgUrl(`/static/img/crypto/${form.currency}.png`)" alt="usdt" />
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
      <div style="float: left;">
        <div class="subtitle">地址</div>
        <div class="item">
          <input type="text" v-model.trim="form.address" class="ipt" maxlength="50" placeholder="请输入对应币种地址" />
        </div>
      </div>
    </div>
    <div class="btn_container">
      <Button :disabled="!form.address" class="submit" type="primary" round color="var(--ex-primary-color)" @click="next">保存</Button>
    </div>

    <!-- 币种 -->
    <Popup :safe-area-inset-top="false" :safe-area-inset-bottom="true" round v-model:show="showCrypto" position="bottom"
      class="popup_container">
      <div class="bottoms">
        <div @click="chooseCurrency(item)" class="bottom" :class="{ active_bottom: form.currency == item }"
          v-for="item in currencyMapList" :key="item">
          <div class="bottom_icon">
            <img :src="getStaticImgUrl(`/static/img/crypto/${item.toUpperCase()}.png`)" alt="usdt" />
          </div>
          <span>{{ item }}</span>
        </div>
        <Icon @click="showCrypto = false" class="close" name="cross" />
      </div>
    </Popup>

    <!-- 网络 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" round v-model:show="showNet" position="bottom"
      class="popup_container">
      <div class="bottoms">
        <div @click="chooseNet(item)" class="bottom" :class="{ active_bottom: form.network == item }"
          v-for="item in currNetwork" :key="item">
          <span>{{ item.network }}</span>
        </div>
        <Icon @click="showNet = false" class="close" name="cross" />
      </div>
    </Popup>

    <!-- 谷歌验证 -->
    <GoogleVerfCode ref="googleRef" @submit="submit" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button, Icon, Popup, showToast } from "vant";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import Top from "@/components/Top.vue";
import { ref, computed } from "vue";
import { _addAccount, _cryptoCoin } from "@/api/api";
import router from "@/router";
import store from "@/store";
import { useRoute } from "vue-router";

const route = useRoute();
const coinMap = computed(() => store.state.coinMap || {});

const googleRef = ref();

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
const initNetwork = () => {
  if (currNetwork.value[0]) {
    form.value.network = currNetwork.value[0].network;
  }
};
initNetwork();

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
        showToast("添加成功");
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
.page_crypto {
  height: calc(100vh - 2.52rem);

  .subtitle {
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.36rem;
    color: var(--ex-text-color);
    margin-bottom: 0.15rem;
  }

  .item {
    width: 6.86rem;
    // padding: 0 0.32rem;
    height: 0.92rem;
    border: 0.02rem solid var(--ex-border-color2);
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
      color: var(--ex-text-color);
    }

    .item_icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.2rem;
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

      :deep(.van-button__text) {
        font-size: 0.32rem;
        line-height: 0.44rem;
      }
    }
  }

  .popup_container {
    width: 7.5rem;

    .bottoms {
      width: 100%;
      height: 50vh;
      position: relative;
      padding: 1.12rem 0;

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
        justify-content: center;
        overflow: hidden;
        border-bottom: 0.02rem solid var(--ex-border-color);

        &:last-child {
          border-bottom: none;
        }

        .bottom_icon {
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
}
</style>
