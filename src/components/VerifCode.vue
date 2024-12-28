<!-- 验证码弹窗 -->
<template>
  <Dialog
    v-model:show="show"
    title=""
    showCancelButton
    showConfirmButton
    :width="'6.22rem'"
    :confirmButtonText="t('register.code_jump_confirm')"
    :confirmButtonColor="'var(--ex-primary-color)'"
    :cancelButtonText="t('user_page.message_box_cancel')"
    :cancelButtonColor="'#323233'"
    overlay
    @cancel="close"
    @confirm="confirm"
    :before-close="() => false"
  >
    <div class="verif_box">
      <div class="title">{{ t('register.enter_graphic_number') }}</div>
      <!-- 验证码 -->
      <div @click="getCode" class="" style="overflow: hidden">
        <div class="code">
          <img v-if="codeImg && !loading" :src="codeImg" alt="code" />
          <Loading v-else type="spinner" />
        </div>
        <div class="tip">{{ t('register.not_clear') }}</div>
      </div>
      <!-- 输入 -->
      <div class="ipt_box">
        <input
          ref="iptRef"
          type="text"
          @input="() => (code = code.toString().slice(0, 4))"
          v-model.trim="code"
          :placeholder="t('register.enter_verify_code')"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { Dialog, showToast, Loading } from "vant";
import { ref } from "vue";
import { _verifcode } from "@/api/api";
import { useI18n } from "vue-i18n";

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
  padding: 0.4rem 0.48rem 0.16rem 0.48rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    color: var(--ex-text-color);
    font-size: 0.32rem;
    line-height: 0.44rem;
    margin-bottom: 0.28rem;
  }

  .code {
    height: 1rem;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tip {
    line-height: 0.44rem;
    color: var(--ex-primary-color);
    text-align: center;
    font-weight: 400;
    margin-bottom: 0.08rem;
  }

  .ipt_box {
    height: 0.92rem;
    border-radius: 0.32rem;
    border: 1px solid #70747d;
    width: 100%;
    display: flex;
    align-items: stretch;

    input {
      text-align: center;
      width: 100%;
    }
  }
}
</style>
