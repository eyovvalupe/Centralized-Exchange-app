<template>
  <div class="list_page" v-for="item in props.list">
    <div class="list_delete_icon" @click="confirm(item.id)">
      <div class="delete_icon">
        <img :src="getStaticImgUrl('/static/icons/delete.svg')" alt="">
      </div>
    </div>
    <GoogleVerfCode ref="googleRef" @submit="submit" />
    <div class="list_detail">
      <div class="bank_icon_container mr-[0.2rem]">
        <div style="width: 0.68rem;height: 0.68rem;">
          <img :src="getStaticImgUrl('/static/icons/card.svg')" alt="">
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <span class="text-[0.32rem] text-[#121212] font-semibold mr-[0.12rem]">**** **** **** {{
            item.bankCardNumber.slice(-4) }}</span>
          <div class="copy_icon" @click="copyToClipboard(item.bankCardNumber)">
            <img :src="getStaticImgUrl(`/static/img/crypto/copy.svg`)" alt="">
          </div>
        </div>
        <span class="text-[0.28rem] text-[#666d80]">{{ item.bankName }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { showConfirmDialog, showToast } from "vant";
import { ref } from "vue";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import { _delAccount, _listAccount } from "@/api/api";
import router from "@/router";
import store from "@/store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const loading = ref(false);
const googleRef = ref();
const currDeleteId = computed(() => store.state.currDeleteId || "");

const confirm = (id) => {
  store.commit("setCurrDeleteId", id);
  showConfirmDialog({
    title: t('account.delete_dialog_title'),
    message: t('account.delete_dialog_con'),
    confirmButtonText: t('google_auth.google_input_btn_confirm'),
    cancelButtonText: t('google_auth.google_input_btn_cancel')
  })
    .then(() => next())
    .catch(() => { });
};

const next = () => {
  googleRef.value[0].open();
};
const props = defineProps({
  list: {
    type: Array,
    default: [
      {
        accountName: null,
        address: "123123123",
        bankCardNumber: null,
        bankName: null,
        channel: "crypto",
        id: "",
        network: "TRC20",
        symbol: "USDT",
      },
    ],
  },
});
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);

    setTimeout(() => {
      showToast(t('account.copy_address'));
    }, 200);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
// 提交
const submit = (googleCode) => {
  if (loading.value) return;
  loading.value = true;
  const params = {
    id: currDeleteId.value,
    googlecode: googleCode,
  };
  _delAccount(params)
    .then((res) => {
      if (res.code == 200) {
        showToast(t('account.delete_success'));
        _listAccount().then((res) =>
          store.commit("setAccountList", res.data || {})
        );
      }
    })
    .finally(() => {
      getSessionToken();
      loading.value = false;
    });
};
const getSessionToken = () => {
  loading.value = true;
  store.dispatch("updateSessionToken").finally(() => {
    loading.value = false;
  });
};
getSessionToken();
</script>
<style lang="less">
.list_page {
  position: relative;
  width: 100%;
  height: 1.44rem;
  border-width: 0.02rem;
  border-color: #d0d8e2;
  border-radius: 0.36rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;

  .list_detail {
    padding-left: 0.32rem;
    display: flex;
    align-items: center;

    .bank_icon_container {
      width: 0.96rem;
      height: 0.96rem;
      background-color: #f5f7fc;
      border-radius: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }


  }

  .list_delete_icon {
    width: 0.8rem;
    height: 0.52rem;
    background-color: #d0d8e2;
    border-bottom-left-radius: 0.36rem;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .delete_icon {
      width: 0.3rem;
      height: 0.25rem;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>
