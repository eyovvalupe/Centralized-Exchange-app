<!-- 添加银行卡 -->
<template>
  <div class="page page_bank">
    <div style="flex: 1; margin-bottom: 0.8rem">
      <div class="subtitle">持卡人姓名</div>
      <div class="item">
        <span style="flex: 1">{{ name || "--" }}</span>
        <div class="icon_ok">
        </div>
        <span>已认证</span>
      </div>
      <div class="subtitle">银行名称</div>
      <div class="item">
        <input
          v-model="form.bank_name"
          type="text"
          class="ipt"
          maxlength="50"
          placeholder="请输入银行名称"
        />
      </div>
      <div class="subtitle">卡号</div>
      <div class="item">
        <input
          v-model.trim="form.bank_card_number"
          type="text"
          class="ipt"
          maxlength="50"
          placeholder="请输入银行卡卡号"
        />
      </div>
    </div>
    <Button
      class="submit"
      :disabled="!(form.bank_name && form.bank_card_number)"
      type="primary"
      round
      color="#014CFA"
      @click="next"
      >保存</Button
    >

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

const googleRef = ref();

const loading = ref(false);
const form = ref({
  channel: "bank",
  // currency: null,
  // network: null,
  // address: null,
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
        showToast("添加成功");
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
_kycGet().then(res => {
    name.value = res?.data?.name || ''
    form.value.account_name = res?.data?.name || ''
})
</script>

<style lang="less" scoped>
.page_bank {
  height: 100%;
  padding: 0 0.32rem;

  .subtitle {
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.36rem;
    color: #061023;
    margin-bottom: 0.15rem;
  }

  .item {
    width: 100%;
    height: 0.92rem;
    border: 0.02rem solid #d0d8e2;
    border-radius: 0.32rem;
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.44rem;

    .ipt {
      width: 100%;
      height: 100%;
      font-size: 0.24rem;
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
      font-size: 0.36rem;
      line-height: 0.64rem;
    }
  }

  :deep(.icon_ok) {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.1rem;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.241 4.9285L10.783 1.1875C10.354 0.9375 9.665 0.9375 9.236 1.1875L8.158 1.8075L2.768 4.9285C2.339 5.1785 2 5.7785 2 6.2685V13.7405C2 14.2305 2.349 14.8405 2.769 15.0805L4.625 16.1505L9.226 18.8115C9.655 19.0615 10.344 19.0615 10.773 18.8115L17.231 15.0705C17.66 14.8205 18 14.2205 18 13.7305V6.2685C18.01 5.7785 17.66 5.1785 17.241 4.9285Z" fill="white"/><path d="M17.241 4.9285L10.783 1.1875C10.354 0.9375 9.665 0.9375 9.236 1.1875L8.158 1.8075L2.768 4.9285C2.339 5.1785 2 5.7785 2 6.2685V13.7405C2 14.2305 2.349 14.8405 2.769 15.0805L4.625 16.1505L9.226 18.8115C9.655 19.0615 10.344 19.0615 10.773 18.8115L17.231 15.0705C17.66 14.8205 18 14.2205 18 13.7305V6.2685C18.01 5.7785 17.66 5.1785 17.241 4.9285Z" fill="green"/><path d="M10.0002 12.7507C9.90172 12.751 9.80415 12.7317 9.71316 12.6939C9.62218 12.6561 9.53961 12.6007 9.47023 12.5307L6.47023 9.53074C6.40056 9.46107 6.3453 9.37837 6.3076 9.28734C6.26989 9.19632 6.25049 9.09876 6.25049 9.00024C6.25049 8.90172 6.26989 8.80416 6.3076 8.71314C6.3453 8.62211 6.40056 8.53941 6.47023 8.46974C6.53989 8.40007 6.6226 8.34481 6.71362 8.30711C6.80465 8.26941 6.90221 8.25 7.00073 8.25C7.09925 8.25 7.19681 8.26941 7.28783 8.30711C7.37886 8.34481 7.46156 8.40007 7.53123 8.46974L10.0002 10.9397L13.4702 7.46974C13.6109 7.32904 13.8018 7.25 14.0007 7.25C14.1997 7.25 14.3905 7.32904 14.5312 7.46974C14.6719 7.61044 14.751 7.80126 14.751 8.00024C14.751 8.19922 14.6719 8.39004 14.5312 8.53074L10.5312 12.5307C10.4616 12.6006 10.3788 12.656 10.2877 12.6938C10.1966 12.7315 10.0989 12.7509 10.0002 12.7507Z" fill="white"/></svg>');
      background-size: cover;
      display: inline-block;
    }
}
</style>
