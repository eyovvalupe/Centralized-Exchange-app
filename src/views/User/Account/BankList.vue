<template>
  <div class="w-full flex flex-col relative">
    <div class="bank_list" v-for="item in props.list">
      <SwipeCell>
        <div class="list_page mask-btn">
          <div class="flex mb-[0.32rem] justify-between">
            <div class="flex items-center">
              <div style="width: 0.7rem;height: 0.7rem;" class="mr-[0.2rem]">
                <img v-lazy="getStaticImgUrl('/static/img/bank/card_default.svg')" alt="">
              </div>
              <span class="text-[0.32rem] text-color2">{{ item.bankName }}</span>
            </div>
            <div class="text-[0.28rem] text-color5">{{ t('用户姓名：') + ' ' + item.accountName }}</div>
          </div>
          <div class="flex flex-col">
            <div class="flex justify-between items-center">
              <span class="text-[0.4rem] text-color font-semibold mr-[0.12rem]">**** **** **** {{
                item.bankCardNumber.slice(-4) }}</span>
              <div class="copy_icon" @click="copyToClipboard(item.bankCardNumber)">
                <img v-lazy="getStaticImgUrl(`/static/img/crypto/copy.svg`)" alt="">
              </div>
            </div>
          </div>
        </div>
        <template #right>
          <div class="w-[1rem] h-full bg-color3 rounded-[0.4rem] flex items-center justify-center ripple-btn"
            @click="confirm(item.id)">
            <div class="w-[0.4rem] h-[0.4rem]">
              <img v-lazy="getStaticImgUrl('/static/img/common/delete.svg')" alt="" />
            </div>
          </div>
        </template>
      </SwipeCell>
    </div>
    <BottomPopup round closeable v-model:show="confirmDel" position="bottom" teleport="body">
      <div class="w-full h-[4rem] flex flex-col items-center">
        <div class="text-[0.36rem] mb-[0.56rem]">{{ t('account.delete_dialog_title') }}</div>
        <div class="text-[0.32rem] mb-[1rem]">
          {{ t('account.delete_dialog_con') }}
        </div>
        <div class="w-full flex justify-between px-[0.4rem]">
          <div
            class="w-[3.16rem] h-[0.8rem] rounded-[1.3rem] bg-white text-black flex items-center justify-center text-[0.32rem] ripple-primary"
            @click="confirmDel = false">{{ t('google_auth.google_input_btn_cancel') }}</div>
          <div
            class="w-[3.16rem] h-[0.8rem] rounded-[1.3rem] bg-primary text-black flex items-center justify-center text-[0.32rem] ripple-btn"
            @click="next">{{ t('google_auth.google_input_btn_confirm') }}</div>
        </div>
      </div>
    </BottomPopup>
    <GoogleVerfCode ref="googleRef" @submit="submit" />
    <div v-if="loading" class="absolute top-[4rem] left-[0] right-[0] flex justify-center">
      <Loading :size="18" color="var(--ex-white)" />
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { showConfirmDialog, showToast, Loading, SwipeCell } from "vant";
import { ref } from "vue";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import { _delAccount, _listAccount } from "@/api/api";
import router from "@/router";
import store from "@/store";
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";

const { t } = useI18n();
const loading = ref(false);
const googleRef = ref();
const confirmDel = ref(false)
const currDeleteId = computed(() => store.state.currDeleteId || "");

const confirm = (id) => {
  store.commit("setCurrDeleteId", id);
  confirmDel.value = true;
};

const next = () => {
  confirmDel.value = false
  googleRef.value.open();
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
.bank_list {
  margin-bottom: 0.2rem;

  .list_page {
    position: relative;
    width: 100%;
    height: 2.16rem;
    border-radius: 0.36rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    margin-bottom: 0.2rem;
    background-color: var(--ex-bg-color6);
    flex-direction: column;
    padding: 0 0.32rem;

    .list_detail {
      padding-left: 0.32rem;
      display: flex;
      align-items: center;

      .bank_icon_container {
        width: 0.96rem;
        height: 0.96rem;
        background-color: var(--ex-bg-color2);
        border-radius: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
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
        height: 0.25rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
</style>
