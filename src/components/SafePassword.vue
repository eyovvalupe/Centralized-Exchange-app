<!-- 输入安全密码 -->
<template>
  <Popup v-model:show="show" :safe-area-inset-top="true" :close-on-click-overlay="false" :safe-area-inset-bottom="true"
    class="self_van_popup" round="" position="bottom" teleport="body" :close-on-popstate="true"
    :closeable="props.closeable">
    <!--  :class="{ 'typing_dialog': showKeyboard }" -->
    <div class="safepassword_dialog" :class="{ safepassword_dialog_uncloseabled: !props.closeable }">
      <slot name="top" />
      <div class="main_title">{{ $t("assets.safety_trade_pw") }}</div>
      <div class="title">{{ $t("assets.safety_trade_pw") }}</div>
      <!-- <div class="subtitle">正在进行谷歌验证码</div> -->
      <!-- <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :value="val" :length="6"
                :gutter="'0.16rem'" :mask="true" /> -->
      <div class="show_pass">
        <input ref="iptDom" v-model="val" :type="passwordInputType" :class="{ err_ipt: errStatus }"
          :placeholder="$t('assets.safety_trade_placeholder')" class="pass_ipt" enterkeyhint="done"
          @blur="errStatus = false" @keydown.enter="submit" />
        <div class="show_hidden_icon" @click="passwordVisibility">
          <img v-if="showPassword" :src="getStaticImgUrl(`/static/img/common/open_eye.svg`)" alt="">
          <img v-else :src="getStaticImgUrl(`/static/img/common/close_eye.svg`)" alt="">
        </div>
      </div>

      <div class="btns">
        <Button round color="white" class="btn" @click="close">
          <span style="color: #666d80">{{ $t("assets.safety_trade_cancel") }}</span>
        </Button>
        <Button :loading="loading" round color="#014CFA" class="btn" type="primary" @click="submit">{{
          $t("assets.safety_trade_confirm") }}</Button>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Popup, Button, showToast } from "vant";
import { ref, computed } from "vue";

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
  background-color: #fefefe;
  padding: 0.96rem 0.32rem 0.6rem 0.32rem;

  position: relative;

  .main_title {
    font-size: 0.32rem;
    color: #121826;
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
      border: 1px solid #d0d8e2 !important;

      :deep(span.van-button__text) {
        font-size: 0.32rem;
      }
    }

    .btn.van-button--primary {
      border-color: #014cfa !important;
    }
  }

  .title {
    font-size: 0.28rem;
    line-height: 0.44rem;
    color: #000;
    margin-bottom: 0.2rem;
    margin-top: 0.4rem;
    text-align: left;
  }

  .pass_ipt {
    height: 1.12rem;
    border: 1px solid #d0d8e2;
    width: 100%;
    display: block;
    box-sizing: border-box;
    border-radius: 0.32rem;
    padding: 0 0.4rem;

    &:focus {
      border: 1px solid #014cfa;
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
    border: 1px solid #e8503a;
  }

  .code_ipt {
    padding: 0;
    margin: 0;

    :deep(.van-password-input__item) {
      border: 1px solid #eceff3;
      background-color: #fff;
      width: 1rem;
      height: 1rem;
      box-sizing: border-box;
      border-radius: 0.16rem;

      &:has(.van-password-input__cursor) {
        border: 1px solid #014cfa;
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
