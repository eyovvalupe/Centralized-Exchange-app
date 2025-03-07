<!-- 谷歌验证弹窗 -->
<template>
  <BottomPopup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="show" position="bottom"
    closeable teleport="body" :close-on-popstate="true" :close-on-click-overlay="false" class="self_van_popup">
    <div class="google_dialog">
      <div class="text-center my-[0.36rem] text-[0.32rem] text-color">
        {{ $t("google_auth.google_input_title") }}
      </div>
      <div class="text-[0.3rem] mt-[0.34rem] mb-[0.6rem]">{{ $t("google_auth.google_input_con") }}</div>
      <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :value="val" :length="6"
        :gutter="'0.16rem'" :mask="false" />
      <input style="opacity: 0" ref="iptRef" v-model="val" maxlength="6" enterkeyhint="done" @keydown.enter="submit" />
      <div class="btns">
        <Button :disabled="disabled" round color="var(--ex-white)" class="btn ripple-primary" type="primary"
          @click="close">
          <span class="text-black font-normal">{{ $t("google_auth.google_input_btn_cancel") }}</span>
        </Button>
        <Button :loading="loading" :disabled="disabled" round color="var(--ex-primary-color)" class="btn ripple-btn"
          type="primary" @click="submit">
          <span class="text-white font-normal">{{ $t("google_auth.google_input_btn_confirm") }}</span>
        </Button>
      </div>
    </div>
  </BottomPopup>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Popup, PasswordInput, Button } from "vant";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import BottomPopup from "./BottomPopup.vue";

const { t } = useI18n();
const emits = defineEmits(["submit"]);

const loading = ref(false);
const disabled = computed(() => {
  return !(val.value && val.value.length == 6);
});

const show = ref(false);
const showKeyboard = ref(true);
const val = ref("");
watch(val, (v) => {
  if (v && v.length == 6) {
    showKeyboard.value = false;
  }
  for (let i = 0; i < 6; i++) {
    let inputStyle = document.getElementsByClassName(
      "van-password-input__item"
    )[i].style;
    if (v.length != 6 && i <= v.length) {
      inputStyle.borderColor = "var(--ex-primary-color)";
      inputStyle.color = "var(--ex-primary-color)";
    } else {
      inputStyle.borderColor = "var(--ex-border-color2)";
      inputStyle.color = "var(--ex-text-color2)";
    }
  }
});

const iptRef = ref();
const focus = () => {
  showKeyboard.value = true;
  setTimeout(() => {
    iptRef.value && iptRef.value.focus();
  }, 300);
};
const close = () => {
  show.value = false;
};
const open = () => {
  val.value = "";
  show.value = true;
  // showKeyboard.value = true
};
const submit = () => {
  if (disabled.value) return;
  close();
  emits("submit", val.value);
};

defineExpose({
  open,
});
</script>

<style lang="less" scoped>
.google_dialog {
  padding: 0 0.32rem 0.8rem 0.32rem;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  position: relative;
  overflow: hidden;

  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.6rem;

    .btn {
      height: 0.96rem;
      border-radius: 0.96rem;
      width: 3.27rem;

      :deep(.van-button__text) {
        font-size: 0.32rem;
      }
    }
  }

  .title {
    font-size: 0.32rem;
    line-height: 0.44rem;
    color: var(--ex-text-color);
    margin-bottom: 0.4rem;
    text-align: center;
    font-weight: bold;
  }

  .subtitle {
    font-size: 0.28rem;
    line-height: 0.42rem;
    color: var(--ex-text-color2);
    font-weight: 400;
    margin-bottom: 0.4rem;
  }
}

.typing_dialog {
  padding: 0.64rem 0.32rem 5.64rem 0.32rem;
}

.close-svg-iconB {
  width: 0.42rem;
  height: 0.4rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.pass_check {
  border-width: 0.02rem;
  border-style: solid;
  background-color: var(--ex-bg-color);
  width: 1rem;
  height: 1.2rem;
  box-sizing: border-box;
  border-radius: 0.32rem;
  font-size: 0.48rem;
  padding-inline: 0.1rem;
  padding-top: 0.1rem;
  padding-bottom: 0.2rem;
}

.code_ipt {
  padding: 0;
  margin: 0;

  :deep(.van-password-input__item) {
    border: 0.02rem solid var(--ex-border-color);
    background-color: var(--ex-bg-color);
    width: 1rem;
    height: 1.2rem;
    box-sizing: border-box;
    border-radius: 0.32rem;
    font-size: 0.48rem;

    &:has(.van-password-input__cursor) {
      border: 0.02rem solid var(--ex-primary-color);
    }
  }
}
</style>
