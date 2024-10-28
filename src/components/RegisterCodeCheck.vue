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
          <div class="chat_icon"><img src="/static/img/user/server.svg" /></div>
        </div>

        <div class="language_icon_container" @click="goLang">
          <div class="language_icon"></div>
        </div>
      </div>
    </div>
    <div class="title">{{ titleMap[props.type] }}验证</div>
    <div class="info flex flex-col">
      <span style="font-size: 0.28rem; font-weight: 400; margin-bottom: 1.16rem"
        >我们已将验证码发送至您的{{
          props.type == "email" ? "电子邮箱" : "手机号码"
        }}</span
      >
      <div class="flex flex-row justify-between mb-[0.6rem]">
        <span style="font-size: 0.3rem; line-height: 0.45rem; font-weight: 400"
          >请输入6位数代码</span
        >
        <div class="timer_container" @click="send">
          {{ s ? s + "s" : "再次发送" }}
        </div>
      </div>
    </div>
    <div class="ipt_box">
      <PasswordInput
        :focused="showKeyboard"
        @focus="focus"
        class="code_ipt"
        :value="val"
        :length="6"
        :gutter="'0.16rem'"
        :mask="false"
      />
      <input
        style="opacity: 0"
        ref="iptRef"
        v-model="val"
        maxlength="6"
        enterkeyhint="done"
        @keydown.enter="submit"
      />
    </div>
    <div class="flex justify-center pt-[0.8rem]">
      <div class="button_container">继续</div>
    </div>
    <div class="jump" @click="close"><span>跳过验证</span></div>
  </div>
  <!-- </ElDialog> -->
</template>

<script setup>
import {
  Icon,
  PasswordInput,
  showConfirmDialog,
  showToast,
  showLoadingToast,
  closeToast,
} from "vant";
import { ref, computed, watch } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
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
  email: "电子邮件",
  phone: "手机",
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
      inputStyle.borderColor = "#014CFA";
      inputStyle.color = "#014CFA";
    } else {
      inputStyle.borderColor = "#D0D8E2";
      inputStyle.color = "#666D80";
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
    title: "跳过验证将继续注册",
    message: "",
    width: "6.23rem",
    confirmButtonText: "确定",
    confirmButtonColor: "#014cfa",
  })
    .then(() => {
      emit("success");
      s.value = 0;
      timeInterval && clearInterval(timeInterval);
    })
    .catch(() => {});
};

let timeInterval = null;
const s = ref(0);
const send = () => {
  if (s.value) return;
  s.value = 59;
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
    background-color: #fff;

    .top_back_container {
      .arrow_icon {
        width: 20px;
        height: 20px;
        clip-path: path("M13.4 2L5 10.4L13.4 18.8");
        background-color: #061023;
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
      border-color: #edf2f7;
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
      border-color: #edf2f7;
      border-radius: 0.36rem;

      .language_icon {
        width: 0.432rem;
        height: 0.432rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g clip-path="url(%23clip0_129_5851)"><path d="M10.8912 0.306641C4.98556 0.306641 0.199219 5.09298 0.199219 10.9986C0.199219 16.9043 4.98556 21.6906 10.8912 21.6906C16.7969 21.6906 21.5832 16.9043 21.5832 10.9986C21.5832 5.09298 16.7969 0.306641 10.8912 0.306641ZM20.1075 10.2858H17.2814C17.1588 7.20075 16.2567 4.47207 14.8952 2.65108C17.7993 4.04606 19.8458 6.91396 20.1075 10.2858ZM15.8446 10.2858H11.604V1.83805C13.8956 2.44782 15.6664 5.94778 15.8446 10.2858ZM10.1784 1.83805V10.2858H5.93782C6.11602 5.94778 7.88688 2.44782 10.1784 1.83805ZM6.88729 2.65108C5.52294 4.47207 4.62359 7.19797 4.50108 10.2858H1.67494C1.93667 6.91396 3.98318 4.04606 6.88729 2.65108ZM1.67494 11.7114H4.49829C4.62081 14.7965 5.52294 17.5252 6.8845 19.3462C3.98318 17.9512 1.93667 15.0833 1.67494 11.7114ZM5.93782 11.7114H10.1784V20.1592C7.88688 19.5495 6.11602 16.0495 5.93782 11.7114ZM11.604 20.1592V11.7114H15.8446C15.6664 16.0495 13.8956 19.5495 11.604 20.1592ZM14.8952 19.3462C16.2595 17.5252 17.1588 14.7993 17.2814 11.7114H20.1047C19.8458 15.0833 17.7993 17.9512 14.8952 19.3462Z" fill="%23666D80"/></g><defs><clipPath id="clip0_129_5851"><rect width="21.6" height="21.6" fill="white" transform="translate(0.199219 0.199219)"/></clipPath></defs></svg>');
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
  color: #014cfa;
  font-size: 0.32rem;
}

.title {
  padding: 0.48rem 0.32rem 0.32rem 0.32rem;
  font-weight: 600;
  color: #0d0d12;
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
    border: 0.02rem solid #eceff3;
    background-color: #fff;
    width: 1rem;
    height: 1.2rem;
    box-sizing: border-box;
    border-radius: 0.32rem;
    &:has(.van-password-input__cursor) {
      border: 0.02rem solid #014cfa;
    }
  }
}

.send {
  color: #1a59f6;
  text-align: center;
  padding: 0.4rem 0;
  cursor: pointer;
}
.button_container {
  width: 6.86rem;
  height: 1.12rem;
  background-color: #014cfa;
  border-radius: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.3rem;
  color: white;
  margin-bottom: 0.6rem;
}
.timer_container {
  width: 1.56rem;
  height: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d0d8e2;
  border-radius: 1rem;
  color: #014cfa;
  font-size: 0.28rem;
  line-height: 0.372rem;
}
</style>

