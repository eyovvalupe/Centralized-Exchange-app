<!-- 输入安全密码 -->
<template>
  <BottomPopup v-model:show="show" :safe-area-inset-top="true" :close-on-click-overlay="false"
    :safe-area-inset-bottom="true" :close-on-popstate="true" :title="$t('assets.safety_trade_pw')"
    :closeable="props.closeable">
    <!--  :class="{ 'typing_dialog': showKeyboard }" -->
    <div class="safepassword_dialog" :class="{ safepassword_dialog_uncloseabled: !props.closeable }">
      <slot name="top" />
      <!-- <div class="title">{{ $t("assets.safety_trade_pw") }}</div> -->
      <!-- <div class="subtitle">正在进行谷歌验证码</div> -->
      <!-- <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :value="val" :length="6"
                :gutter="'0.16rem'" :mask="true" /> -->

      <FormItem :placeholder="$t('assets.safety_trade_pw')" v-model="val" input-type="password" />

      <div class="btns">
        <Button round class="btn" @click="close">
          <span style="color: var(--ex-text-color2)"><span style="color: var(--ex-black);">{{
            $t("assets.safety_trade_cancel") }}</span></span>
        </Button>
        <Button :loading="loading" round class="btn" type="primary" @click="submit"><span
            style="color: var(--ex-black);">{{
              $t("assets.safety_trade_confirm") }}</span></Button>
      </div>
    </div>
  </BottomPopup>
</template>

<script setup>
import { Button, showToast } from "vant";
import { ref, computed } from "vue";
import BottomPopup from "./BottomPopup.vue";
import FormItem from "./Form/FormItem.vue";

const props = defineProps({
  closeable: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["submit"]);
const { t } = useI18n();
const iptDom = ref();
const errStatus = ref(false);
const loading = ref(false);
// const disabled = computed(() => {
//     return !(val.value)
// })

const show = ref(false);
const showKeyboard = ref(true);
const val = ref("");
const showPassword = ref(false);
// watch(val, v => {
//     if (v && v.length == 6) {
//         showKeyboard.value = false
//     }
// })

const close = () => {
  show.value = false;
};
const open = () => {
  val.value = "";
  show.value = true;
  showKeyboard.value = true;
  focus();
};

const passwordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const passwordInputType = computed(() =>
  showPassword.value ? "text" : "password"
);
// const icon = computed(() => (isPasswordVisible.value ? '🙈' : '👁️'));

const submit = () => {
  if (!val.value) {
    errStatus.value = true;
    showToast(t("assets.safety_trade_no_password"));
    return;
  }
  close();
  emits("submit", val.value);
};

const focus = () => {
  showKeyboard.value = true;
  setTimeout(() => {
    iptDom.value && iptDom.value.focus();
  }, 300);
};

defineExpose({
  open,
  close,
});
</script>

<style lang="less" scoped>
.safepassword_dialog {
  padding: 0.6rem 0.32rem 0.6rem 0.32rem;

  position: relative;

  .main_title {
    font-size: 0.32rem;
    color: var(--ex-text-color);
    position: absolute;
    font-weight: 400;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.6rem;
    margin-left: -0.32rem;

    .btn {
      height: 0.96rem;
      border-radius: 0.96rem;
      flex: 1;
      margin-left: 0.32rem;

      :deep(span.van-button__text) {
        font-size: 0.32rem;
      }
    }

  }

  .title {
    font-size: 0.28rem;
    line-height: 0.44rem;
    color: var(--ex-text-color);
    margin-bottom: 0.2rem;
    margin-top: 0.4rem;
    text-align: left;
  }

  .pass_ipt {
    height: 1.12rem;
    border: 1px solid var(--ex-border-color2);
    width: 100%;
    display: block;
    box-sizing: border-box;
    border-radius: 0.32rem;
    padding: 0 0.4rem;

    &:focus {
      border: 1px solid var(--ex-primary-color);
    }
  }

  .show_pass {
    position: relative;

    .show_hidden_icon {
      content: "";
      display: block;
      width: 0.4rem;
      height: 0.4rem;
      position: absolute;
      right: 0.32rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9999;

      :deep(svg) {
        width: 0.4rem !important;
        height: 0.4rem !important;
      }
    }
  }

  .err_ipt {
    border: 1px solid var(--ex-border-error);
  }

  .code_ipt {
    padding: 0;
    margin: 0;

    :deep(.van-password-input__item) {
      border: 1px solid var(--ex-border-color);
      background-color: var(--ex-bg-color);
      width: 1rem;
      height: 1rem;
      box-sizing: border-box;
      border-radius: 0.16rem;

      &:has(.van-password-input__cursor) {
        border: 1px solid var(--ex-primary-color);
      }
    }
  }
}

.safepassword_dialog_uncloseabled {
  padding: 0.56rem 0.32rem;
}

.typing_dialog {
  padding: 0.32rem 0.32rem 5.64rem 0.32rem;
}
</style>
