<!-- 添加银行卡 -->
<template>
  <div class="page page_bank">
    <div style="flex: 1; margin-bottom: 0.8rem">
      <div class="subtitle">{{ $t("account.add_subtitle_user_name") }}</div>
      <div class="item">
        <span style="flex: 1">{{ name || "--" }}</span>
        <div class="icon_ok"></div>
        <span>{{ $t("account.add_subtitle_status") }}</span>
      </div>
      <div class="subtitle">{{ $t("account.add_subtitle_bank_name") }}</div>
      <div class="item">
        <input v-model="form.bank_name" type="text" class="ipt" maxlength="50"
          :placeholder="t('account.add_bank_name_placeholder')" />
      </div>
      <div class="subtitle">{{ $t("account.add_subtitle_card_number") }}</div>
      <div class="item">
        <input v-model.trim="form.bank_card_number" type="text" class="ipt" maxlength="50"
          :placeholder="t('account.add_bank_address_placeholder')" />
      </div>
    </div>
    <Button class="submit" :disabled="!(form.bank_name && form.bank_card_number)" type="primary" round
      color="var(--ex-primary-color)" @click="next"><span style="color: var(--ex-black);">{{ $t("account.add_btn")
        }}</span></Button>

    <!-- 谷歌验证 -->
    <GoogleVerfCode ref="googleRef" @submit="submit" />
  </div>
</template>

<script setup>
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import Top from "@/components/Top.vue";
import { Button, showToast } from "vant";
import { ref, computed } from "vue";
import { _kycGet, _addAccount } from "@/api/api";
import router from "@/router";
import store from "@/store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const googleRef = ref();

const loading = ref(false);
const form = ref({
  channel: "bank",
  account_name: "",
  bank_name: "",
  bank_card_number: "",
});

// 提交
const submit = (googleCode) => {
  if (loading.value) return;
  loading.value = true;
  _addAccount({
    ...form.value,
    googlecode: googleCode,
    token: sessionToken.value,
  })
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

// 获取真实姓名
const name = ref("");
_kycGet().then((res) => {
  name.value = res?.data?.name || "";
  form.value.account_name = res?.data?.name || "";
});
</script>

<style lang="less" scoped>
.page_bank {
  height: 100%;
  padding: 0 0.32rem;

  .subtitle {
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.36rem;
    color: var(--ex-text-color);
    margin-bottom: 0.15rem;
  }

  .item {
    width: 100%;
    height: 1.12rem;
    border: 0.02rem solid var(--ex-border-color2);
    border-radius: 0.32rem;
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.44rem;

    .ipt {
      width: 100%;
      height: 100%;
      font-size: 0.3rem;
      text-align: left;
      outline: none;
      border: none;
      background-color: rgba(0, 0, 0, 0);
    }
  }

  .submit {
    height: 1.12rem;
    width: 100%;

    :deep(.van-button__text) {
      font-size: 0.32rem;
      line-height: 0.44rem;
    }
  }

  :deep(.icon_ok) {
    width: 0.4rem;
    height: 0.4rem;
    margin-right: 0.1rem;
    background-size: cover;
    display: inline-block;
  }
}
</style>
