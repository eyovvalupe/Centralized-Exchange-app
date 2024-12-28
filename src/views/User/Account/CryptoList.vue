<template>
  <div class="list_page" v-for="item in props.list">
    <div class="list_delete_icon" @click="confirm(item.id)">
      <Loading :size="18" v-if="loading && currDeleteId == item.id" color="var(--ex-white)" />
      <div class="delete_icon" v-else>
        <img :src="getStaticImgUrl('/static/icons/delete.svg')" alt="">
      </div>
    </div>
    <div class="list_detail">
      <div class="mr-[0.2rem]" style="width: 0.96rem;height: 0.96rem;">
        <img :src="getStaticImgUrl(`/static/img/crypto/${item.symbol}.png`)" class=" rounded-full" alt="">
      </div>
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <span class="text-[0.32rem] text-color font-semibold mr-[0.12rem]">**** **** **** {{ item.address.slice(-4)
            }}</span>
          <div class="copy_icon" @click="copyToClipboard(item.address)">
            <img :src="getStaticImgUrl(`/static/img/crypto/copy.svg`)" alt="">
          </div>
        </div>
        <span class="text-[0.28rem] text-color2">{{ item.symbol }}</span>
      </div>
    </div>
    <GoogleVerfCode ref="googleRef" @submit="(code) => submit(code)" />
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { showToast, showConfirmDialog,Loading } from "vant";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import { ref } from "vue";
import { _delAccount, _listAccount } from "@/api/api";
import store from "@/store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currDeleteId = computed(() => store.state.currDeleteId || "");
const loading = ref(false);
const googleRef = ref();
const confirm = (id) => {
  store.commit("setCurrDeleteId", id);
  showConfirmDialog({
    className:'account_dialog',
    title: t('account.delete_dialog_title'),
    message: t('account.delete_dialog_con'),
    confirmButtonText: t('google_auth.google_input_btn_confirm'),
    cancelButtonText: t('google_auth.google_input_btn_cancel')
  })
    .then(() => next(id))
    .catch(() => { });
};
const next = (id) => {
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
  border-color: var(--ex-border-color2);
  border-radius: 0.36rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;

  .list_detail {
    padding-left: 0.32rem;
    display: flex;
    align-items: center;

    .copy_icon {
      width: 0.24rem;
      height: 0.24rem;
      background-size: contain;
      background-repeat: no-repeat;
    }


  }

  .list_delete_icon {
    width: 0.8rem;
    height: 0.52rem;
    background-color: var(--ex-border-color2);
    border-bottom-left-radius: 0.36rem;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .delete_icon {
      width: 0.3rem;
      height: 0.3rem;
    }
  }
}
</style>
