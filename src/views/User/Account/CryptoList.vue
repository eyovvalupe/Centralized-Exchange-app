<template>
  <div class="w-full flex flex-col relative">
    <div class="crypto_list" v-for="item in props.list">
      <SwipeCell>
        <div class="list_page">
          <div class="flex items-center mb-[0.32rem]">
            <div class="mr-[0.2rem]" style="width: 0.7rem;height: 0.7rem;">
              <img :src="getStaticImgUrl(`/static/img/crypto/${item.symbol.toUpperCase()}.svg`)" class=" rounded-full" alt="">
            </div>
            <span class="text-[0.32rem] text-color2">{{ item.symbol ? item.symbol.toUpperCase() : '--' }}</span>
          </div>
          <div class="flex flex-col">
            <div class="flex justify-between items-center">
              <span class="text-[0.4rem] text-color font-semibold mr-[0.12rem]">**** **** **** {{ item.address.slice(-4)
                }}</span>
              <div class="copy_icon" @click="copyToClipboard(item.address)">
                <img :src="getStaticImgUrl(`/static/img/crypto/copy.svg`)" alt="">
              </div>
            </div>

          </div>
        </div>
        <template #right>
          <div class="w-[1rem] h-full bg-color2 rounded-[0.4rem] flex items-center justify-center"
            @click="confirm(item.id)">
            <div class="w-[0.4rem] h-[0.4rem]">
              <img :src="getStaticImgUrl('/static/img/common/delete.svg')" alt="" />
            </div>
          </div>
        </template>
      </SwipeCell>
    </div>
    <div v-if="loading" class="absolute top-[4rem] left-[0] right-[0] flex justify-center">
      <Loading :size="18" color="var(--ex-white)" />
    </div>
    <GoogleVerfCode ref="googleRef" @submit="(code) => submit(code)" />
    <BottomPopup round closeable v-model:show="confirmDel" position="bottom" teleport="body">
      <div class="w-full h-[4rem] flex flex-col items-center">
        <div class="text-[0.36rem] mb-[0.56rem]">{{ t('account.delete_dialog_title') }}</div>
        <div class="text-[0.32rem] mb-[1rem]">
          {{ t('account.delete_dialog_con') }}
        </div>
        <div class="w-full flex justify-between px-[0.4rem]">
          <div
            class="w-[3.16rem] h-[0.8rem] rounded-[1.3rem] bg-white text-black flex items-center justify-center text-[0.32rem]"
            @click="confirmDel = false">{{ t('google_auth.google_input_btn_cancel') }}</div>
          <div
            class="w-[3.16rem] h-[0.8rem] rounded-[1.3rem] bg-primary text-black flex items-center justify-center text-[0.32rem]"
            @click="next">{{ t('google_auth.google_input_btn_confirm') }}</div>
        </div>
      </div>
    </BottomPopup>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { showToast, showConfirmDialog, Loading, SwipeCell } from "vant";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import { ref } from "vue";
import { _delAccount, _listAccount } from "@/api/api";
import store from "@/store";
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";

const { t } = useI18n();
const currDeleteId = computed(() => store.state.currDeleteId || "");
const loading = ref(false);
const googleRef = ref();
const confirmDel = ref(false);
const confirm = (id) => {
  store.commit("setCurrDeleteId", id);
  confirmDel.value = true
};
const next = () => {
  confirmDel.value = false;
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
.crypto_list {
  margin-bottom: 0.2rem;

  .list_page {
    position: relative;
    width: 100%;
    height: 2.16rem;
    border-radius: 0.36rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    background-color: var(--ex-bg-color6);
    padding: 0 0.32rem;
    flex-direction: column;

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
}
</style>
