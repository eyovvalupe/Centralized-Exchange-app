<template>
  <div class="password-input">
    <div class="flex items-center justify-between mb-[0.32rem]" v-if="props.from != 'register'">
      <span class="text-[0.32rem] text-color mr-[0.2rem]">{{ t('google_auth.google_code') }}</span>
      <div class="clear_icon" style="cursor: pointer" @click="clean">
        <img v-lazy="getStaticImgUrl('/static/img/common/clean.svg')" alt="">
      </div>
    </div>
    <div class="flex justify-between w-full" :class="props.from == 'register' ? 'mb-[0.8rem]' : 'mb-[0.8rem]'">
      <div v-for="(digit, index) in passwordDigits" class="relative">
        <input :key="index" type="text" maxlength="1" :value="digit"
          @input="(event) => handleInput(event.target.value, index)" @keydown="(event) => handleKeydown(index, event)"
          @focus="focusIndex = index" class="digit-input pt-[0.1rem]"
          :class="[digit != '' ? 'filled' : '', from == 'register' ? 'w-[0.92rem] h-[1.12rem]' : 'w-[1rem] h-[1.2rem]']"
          :style="{
            borderColor:
              digit == '' && focusIndex != index
                ? 'var(--ex-border-color2)'
                : !isSentCodeError || !isAllFilled
                  ? 'var(--ex-primary-color)'
                  : 'var(--ex-border-error)',
            color:
              digit == ''
                ? ''
                : !isSentCodeError || !isAllFilled
                  ? 'var(--ex-primary-color) !important'
                  : 'var(--ex-border-error) !important',
            caretColor:
              !isSentCodeError || !isAllFilled ? 'var(--ex-primary-color)' : 'var(--ex-border-error)',
            borderRadius: props.from == 'register' ? '0.32rem' : '0.16rem',
          }" ref="digitInputs" />
        <div v-if="focusIndex == index && digit == ''"
          class="absolute w-[0.48rem] bottom-[0.2rem] h-[0.04rem] bg-primary"
          :class="from == 'register' ? 'left-[0.22rem]' : 'left-[0.26rem]'"></div>
      </div>
    </div>
    <Button :loading="props.loading" :disabled="!isAllFilled" round color="var(--ex-primary-color)"
      class="submit-button ripple-btn" type="primary" @click="handleSubmit">
      <span style="color: var(--ex-white);">{{ props.from == "register" ? t('code_input.btn_text1') :
        t('code_input.btn_text2')
        }}</span>
    </Button>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, onMounted, nextTick, computed, watch } from "vue";
import store from "@/store";
import { Button } from "vant";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const isSentCodeError = computed(() => store.state.isSentCodeError || false);

const focusIndex = ref(0);
const emits = defineEmits(["submit"]);
const passwordDigits = ref(["", "", "", "", "", ""]);
const digitInputs = ref([]);
const props = defineProps({
  isFocus: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  from: {
    type: String,
    default: "",
  },
});
const isAllFilled = computed(() => {
  return passwordDigits.value.every((digit) => digit !== "");
});

const clean = () => {
  passwordDigits.value = ["", "", "", "", "", ""];
  digitInputs.value[0].focus();
  store.commit("setIsSentCodeError", false);
};

const handleInput = (value, index) => {
  if (value.match(/^[0-9]$/)) {
    passwordDigits.value[index] = value;
    if (index < passwordDigits.value.length - 1) {
      nextTick(() => {
        digitInputs.value[index + 1].focus();
      });
    }
  }

  if (index === passwordDigits.value.length - 1 && value !== "") {
    nextTick(() => {
      digitInputs.value[index].blur();
    });
  }

  store.commit("setIsSentCodeError", false);
};

const handleKeydown = (index, event) => {
  if (event.key === "Backspace") {
    if (passwordDigits.value[index] === "" && index > 0) {
      nextTick(() => {
        passwordDigits.value[index - 1] = "";
        digitInputs.value[index - 1].focus();
      });
    } else {
      passwordDigits.value[index] = "";
    }
    store.commit("setIsSentCodeError", false);
  }
};
watch(
  () => props.isFocus,
  (value) => {
    if (value) {
      digitInputs.value[0].focus();
    } else {
      clean();
    }
  }
);
const handleSubmit = () => {
  emits("submit", passwordDigits.value.join(""));
};

onMounted(() => {
  digitInputs.value[0].focus();
});
</script>

<style>
.password-input {
  display: flex;
  /* gap: 0.2rem; */
  flex-direction: column;
}

.digit-input {
  text-align: center;
  border: 0.03rem solid var(--ex-border-color2);
  background-color: var(--ex-border-color2);
  border-radius: 0.4rem !important;
  font-size: 0.48rem;
}

.digit-input.filled {
  border-color: var(--ex-primary-color);
}

.submit-button {
  width: 100%;
  height: 1.12rem;
  font-size: 0.36rem;
  /* background-color: var(--ex-primary-color); */
  border-radius: 0.4rem;
  color: var(--ex-text-color--bg-primary);
}

.clear_icon {
  width: 0.4rem;
  height: 0.4rem;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
