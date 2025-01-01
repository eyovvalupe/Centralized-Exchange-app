<!-- 验证码校验 -->
<template>
  <!-- <ElDialog v-model="show" align-center title="" width="500px" :close-on-click-modal="false"> -->
  <div class="code_check_box">
    <!-- 返回和语言 -->
    <div class="top_icon_container">
      <div class="top_back_container text-[0.48rem]" @click="goBack">
        <Icon name="arrow-left" />
      </div>

      <div class="flex flex-row">
        <div class="server_icon" @click="goChat">
          <div class="chat_icon"><img :src="getStaticImgUrl('/static/img/user/server.svg')" /></div>
        </div>

        <div class="language_icon_container" @click="goLang">
          <div class="language_icon">
            <img :src="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="title">
      {{ titleMap[props.type] }}{{ $t("register.code_verify") }}
    </div>
    <div class="info flex flex-col">
      <div class="flex">
        <span style="font-size: 0.28rem; font-weight: 400; margin-bottom: 1.16rem">{{ $t("register.code_con1") }}</span>
        <span style="font-size: 0.28rem; font-weight: 400; margin-bottom: 1.16rem">{{ props.type == "email" ?
          t('register.email') : t('register.phone') }}</span>
      </div>
      <div class="flex flex-row justify-between mb-[0.6rem]">
        <span style="font-size: 0.3rem; line-height: 0.45rem; font-weight: 400">{{ $t('register.code_con2') }}</span>
        <div class="timer_container" @click="send">
          {{ s ? s + "s" : t('register.code_again') }}
        </div>
      </div>
    </div>
    <div class="w-full px-[0.32rem] mb-[0.6rem]">
      <CodeInput :from="'register'" @submit="(code) => console.log(code)" />
    </div>
    <div class="jump" @click="close"><span>{{ $t("register.code_jump") }}</span></div>
  </div>
  <!-- </ElDialog> -->
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import {
  Icon,
  PasswordInput,
  showConfirmDialog,
  showToast,
  showLoadingToast,
  closeToast,
} from "vant";
import { ref, computed, watch, onMounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import CodeInput from "./CodeInput.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

const props = defineProps({
  type: {
    type: String,
    default: "phone",
  },
  value: {
    type: String,
    default: "",
  },
});
const titleMap = ref({
  email: t("register.code_email"),
  phone: t("register.code_phone"),
});

const emit = defineEmits(["success"]);

const val = ref("");

const showKeyboard = ref(true);
watch(val, (v) => {
  if (v && v.length == 6) {
    showKeyboard.value = false;
    finishIpt();
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
const finishIpt = () => {
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  setTimeout(() => {
    closeToast();
    val.value = "";
    showToast("验证码错误");
  }, 1000);
};

const open = () => {
  s.value = 0;
  timeInterval && clearInterval(timeInterval);
};

const iptRef = ref();
const focus = () => {
  showKeyboard.value = true;
  setTimeout(() => {
    iptRef.value && iptRef.value.focus();
  }, 300);
};

const close = () => {
  showConfirmDialog({
    title: t('register.code_jump_title'),
    message: "",
    width: "6.23rem",
    confirmButtonText: t('register.code_jump_confirm'),
    cancelButtonText: t('user_page.message_box_cancel'),
    confirmButtonColor: "var(--ex-primary-color)",
    theme: 'round-button'
  })
    .then(() => {
      emit("success");
      s.value = 0;
      timeInterval && clearInterval(timeInterval);
    })
    .catch(() => { });
};

let timeInterval = null;
const s = ref(0);
const send = () => {
  if (s.value) return;
  s.value = 119;
  timeInterval = setInterval(() => {
    s.value--;
    if (s.value == 0) {
      clearInterval(timeInterval);
    }
  }, 1000);
};

open();
const goBack = () => {
  if (route.query.reurl) {
    router.replace({
      name: route.query.reurl,
      query: {
        redata: route.query.redata,
      },
    });
  } else {
    router.back();
  }
};

//跳转到语言设置页
const goLang = () => {
  //   emits("closeDialog");
  router.push({ name: "language" });
};

const goChat = () => {
  router.push({ name: "chat" });
};

onMounted(() => {
  send();
});
</script>

<style lang="less" scoped>
.code_check_box {
  position: relative;

  .top_icon_container {
    position: fixed;
    width: 7.5rem;
    justify-content: space-between;
    padding: 0 0.32rem;
    height: 1.12rem;
    display: flex;
    align-items: center;
    top: 0;
    background-color: var(--ex-bg-color);

    .top_back_container {
      .arrow_icon {
        width: 20px;
        height: 20px;
        clip-path: path("M13.4 2L5 10.4L13.4 18.8");
        background-color: var(--ex-text-color);
      }
    }

    .server_icon {
      width: 0.72rem;
      height: 0.72rem;
      border-width: 0.02rem;
      border-radius: 0.36rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-color: var(--ex-border-color);
      margin-right: 0.12rem;

      .chat_icon {
        width: 0.432rem;
        height: 0.432rem;
      }
    }

    .language_icon_container {
      width: 0.72rem;
      height: 0.72rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-width: 0.02rem;
      border-color: var(--ex-border-color);
      border-radius: 0.36rem;

      .language_icon {
        width: 0.432rem;
        height: 0.432rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}

.jump {
  display: flex;
  justify-content: center;
  color: var(--ex-primary-color);
  font-size: 0.32rem;
}

.title {
  padding: 0.48rem 0.32rem 0.32rem 0.32rem;
  font-weight: 600;
  color: var(--ex-text-color);
  font-size: 0.54rem;
  line-height: 0.784rem;
  width: 100%;
  // padding: 2rem 0 0.4rem 0;
}

.info {
  padding: 0 0.32rem;
  line-height: 0.5rem;

  span {
    font-weight: bold;
  }
}

.ipt_box {
  :deep(.van-password-input__item) {
    border: 0.02rem solid var(--ex-border-color);
    background-color: var(--ex-bg-color);
    width: 1rem;
    height: 1.2rem;
    box-sizing: border-box;
    border-radius: 0.32rem;

    &:has(.van-password-input__cursor) {
      border: 0.02rem solid var(--ex-primary-color);
    }
  }
}

.send {
  color: var(--ex-primary-color);
  text-align: center;
  padding: 0.4rem 0;
  cursor: pointer;
}

.button_container {
  width: 6.86rem;
  height: 1.12rem;
  background-color: var(--ex-primary-color);
  border-radius: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.3rem;
  color: var(--ex-text-color--bg-primary);
  margin-bottom: 0.6rem;
}

.timer_container {
  width: 1.56rem;
  height: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--ex-border-color2);
  border-radius: 1rem;
  color: var(--ex-primary-color);
  font-size: 0.28rem;
  line-height: 0.372rem;
}
</style>
