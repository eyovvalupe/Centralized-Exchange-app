<!-- 添加银行卡 -->
<template>
  <div class="page page_bank">
    <div style="flex: 1; margin-bottom: 0.8rem">
      <div class="item">
        <div class="flex flex-col">
          <div class="subtitle">{{ $t("account.add_subtitle_user_name") }}</div>
          <span style="flex: 1">{{ name || "--" }}</span>
        </div>
        <span class="text-primary">{{ $t("account.add_subtitle_status") }}</span>
      </div>
      <div class="item">
        <div class="w-full" :class="!nameFocus && !form.bank_name ? 'flex' : 'flex flex-col'">
          <div class="text-color5"
            :class="nameFocus || form.bank_name ? 'text-[0.28rem] mb-[0.15rem]' : 'text-[0.32rem]'">{{
              $t("account.add_subtitle_bank_name") }}</div>
          <input v-model="form.bank_name" type="text" class="ipt" maxlength="50" @focus="nameFocus = true"
            @blur="nameFocus = false" />
        </div>
        <div class="w-[0.32rem] h-[0.32rem]" v-if="form.bank_name" @click="form.bank_name = ''">
          <img :src="getStaticImgUrl(`/static/img/common/close.svg`)" alt="">
        </div>
      </div>
      <div class="item">
        <div class="w-full" :class="!numFocus && !form.bank_card_number ? 'flex' : 'flex flex-col'">
          <div class="text-color5"
            :class="numFocus || form.bank_card_number ? 'text-[0.28rem] mb-[0.15rem]' : 'text-[0.32rem]'">{{
              $t("account.add_subtitle_card_number") }}</div>
          <input v-model.trim="form.bank_card_number" type="text" class="ipt" maxlength="50" @focus="numFocus = true"
            @blur="numFocus = false" />
        </div>
        <div class="w-[0.32rem] h-[0.32rem]" v-if="form.bank_card_number" @click="form.bank_card_number = ''">
          <img :src="getStaticImgUrl(`/static/img/common/close.svg`)" alt="">
        </div>
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
import { getStaticImgUrl } from "@/utils/index.js"
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

const nameFocus = ref(false);
const numFocus = ref(false);

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
    width: max-content;
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.36rem;
    color: var(--ex-text-color5);
    margin-bottom: 0.15rem;
  }

  .item {
    width: 100%;
    height: 1.12rem;
    border-radius: 0.32rem;
    background-color: var(--ex-bg-color5);
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.28rem;

    .ipt {
      width: 70%;
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
