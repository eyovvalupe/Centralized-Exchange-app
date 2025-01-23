<!-- 验证码弹窗 -->
<template>
  <BottomPopup round closeable v-model:show="show" position="bottom" teleport="body" @close="close">
    <div class="verif_box">
      <div class="title">{{ t('register.enter_graphic_number') }}</div>
      <!-- 验证码 -->
      <div @click="getCode" class="" style="overflow: hidden">
        <div class="code">
          <img v-if="codeImg && !loading" :src="codeImg" alt="code" />
          <Loading v-else type="circular" />
        </div>
        <div class="tip">{{ t('register.not_clear') }}</div>
      </div>
      <!-- 输入 -->
      <div class="ipt_box">
        <input ref="iptRef" type="text" @input="() => (code = code.toString().slice(0, 4))" v-model.trim="code"
          :placeholder="t('register.enter_verify_code')" />
      </div>
      <div class="w-full flex px-[0.4rem] justify-between">
        <div class="w-[3.16rem] h-[0.8rem] flex items-center justify-center rounded-[1.3rem] bg-white text-black text-[0.32rem] font-semibold ripple-primary"
          @click="close">{{
            t('user_page.message_box_cancel') }}</div>
        <div class="w-[3.16rem] h-[0.8rem] flex items-center justify-center rounded-[1.3rem] bg-primary text-black text-[0.32rem] font-semibold ripple-btn"
          @click="confirm">{{
            t('register.code_jump_confirm') }}</div>
      </div>
    </div>
  </BottomPopup>
</template>

<script setup>
import { Dialog, showToast, Loading } from "vant";
import { ref } from "vue";
import { _verifcode } from "@/api/api";
import { useI18n } from "vue-i18n";
import BottomPopup from "./BottomPopup.vue";

const { t } = useI18n();
const emits = defineEmits(["submit"]);

const iptRef = ref();
const code = ref("");
const codeImg = ref(""); // 验证码图片

const show = ref(false);
const open = () => {
  code.value = "";
  getCode();
  show.value = true;
  setTimeout(() => {
    iptRef.value && iptRef.value.focus();
  }, 300);
};
const close = () => {
  code.value = "";
  show.value = false;
};

const confirm = () => {
  const v = code.value.toString();
  if (!v || v.length != 4) return;
  emits("submit", v);
  close();
};

const loading = ref(false);
const getCode = () => {
  // 获取验证码
  if (loading.value) return;
  loading.value = true;
  _verifcode()
    .then((response) => {
      const url = URL.createObjectURL(response.data);
      codeImg.value = url;
    })
    .catch(() => {
      showToast(t('register.verify_code_error'));
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    });
};

defineExpose({
  open,
});
</script>

<style lang="less" scoped>
.verif_box {
  height: 7rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    color: var(--ex-text-color);
    font-size: 0.32rem;
    line-height: 0.44rem;
    margin-bottom: 0.8rem;
  }

  .code {
    width: 3.4rem;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.32rem;
    overflow: hidden;
    margin-bottom: 0.2rem;
  }

  .tip {
    line-height: 0.44rem;
    color: var(--ex-primary-color);
    text-align: center;
    font-weight: 400;
    margin-bottom: 0.4rem;
  }

  .ipt_box {
    height: 1.12rem;
    border-radius: 0.32rem;
    background-color: var(--ex-bg-color6);
    width: 4rem;
    display: flex;
    align-items: stretch;
    margin-bottom: 0.6rem;

    input {
      text-align: center;
      width: 100%;
      font-size: 0.32rem;
    }
  }
}
</style>
