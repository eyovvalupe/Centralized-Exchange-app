<!-- 忘记密码 -->
<template>
  <div v-if="changePassSuccess">
    <ForgotSuccess />
  </div>
  <div v-else class="page page-fogot">
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
            <img :src="getStaticImgUrl('/static/icons/lang.svg')" alt="">
          </div>
        </div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="title_box">
      <div class="title">忘记密码</div>
      <div class="tologin" @click="router.push({ name: 'login' })">去登录</div>
    </div>

    <!-- 表单 -->
    <div class="form relative">
      <div class="form_title">邮箱/手机号</div>
      <div class="form_item margin_item">
        <input maxlength="20" v-model.trim="form.username" placeholder="您的用户名" type="text" class="item_input" />
        <div class="form_item_clear" v-show="form.username" @click="form.username = null">
          <Icon name="cross" size="0.25rem" />
        </div>
      </div>

      <div class="form_title">新密码</div>
      <div class="form_item mb-[0.05rem]">
        <input maxlength="20" v-model.trim="form.password" :type="showPass ? 'text' : 'password'" placeholder="密码最小8个字符"
          class="item_input" @input="checkPasswordStrength" />
        <div class="form_item_icon" @click="toggleShowPass">
          <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'"></div>
        </div>
      </div>
      <PasswordLevel class="form_passCheck" :password="form.password" :from="'forgot'" />

      <div class="mb-[0.32rem]"></div>
      <div class="form_title">确认新密码</div>
      <div class="form_item">
        <input maxlength="20" v-model.trim="form.confirmPassword" :type="showConfirmPass ? 'text' : 'password'"
          placeholder="请再次输入新密码" class="item_input" />
        <div class="form_item_icon" @click="toggleShowConfirmPass">
          <div :class="showConfirmPass ? 'eye-show-icon' : 'eye-hidden-icon'">
            <img v-if="showConfirmPass" :src="getStaticImgUrl('/static/icons/eye_open.svg')" alt="">
            <img v-else :src="getStaticImgUrl('/static/icons/eye_close.svg')" alt="">
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="submit_box" @click="submit">
      <Button :loading="loading" :disabled="disabled" round color="var(--ex-primary-color)" class="submit" type="primary">继续</Button>
    </div>

    <!-- 谷歌 -->
    <GoogleVerfCode @submit="submitForm" ref="ggRef" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Icon, Button, showToast } from "vant";
import { ref, computed } from "vue";
import router from "@/router";
import { _forgetpw } from "@/api/api";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import store from "@/store";
import PasswordLevel from "@/components/PasswordLevel.vue";
import { useRoute } from "vue-router";
import ForgotSuccess from "./ForgotSuccess.vue";
const props = defineProps({
  backFunc: {
    type: Function,
    default: null,
  },
});
// Refs and Variables
const ggRef = ref();
const showPass = ref(false);
const showConfirmPass = ref(false);
const svgColor = ref("#D9D9D9");
const loading = ref(false);

// Form data
const form = ref({
  username: "",
  password: "",
  confirmPassword: "",
});

// Disable button conditionally
const disabled = computed(() => {
  return !(
    form.value.username &&
    form.value.password &&
    form.value.password === form.value.confirmPassword
  );
});

// Toggle password visibility
const toggleShowPass = () => {
  showPass.value = !showPass.value;
};

const toggleShowConfirmPass = () => {
  showConfirmPass.value = !showConfirmPass.value;
};

// Submit form to trigger Google Verification
const submit = () => {
  ggRef.value.open();
};

// Check password strength logic
const checkPasswordStrength = () => {
  const password = form.value.password;
  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  ) {
    svgColor.value = "green";
  } else if (password.length >= 6) {
    svgColor.value = "orange";
  } else {
    svgColor.value = "#D9D9D9";
  }
};
const route = useRoute();
const goBack = () => {
  if (props.backFunc) return props.backFunc();
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

const goChat = () => {
  router.push({ name: "chat" });
};
const goLang = () => {
  router.push({ name: "language" });
};
// 提交用户信息
const changePassSuccess = ref(false);
const submitForm = (code) => {
  if (loading.value) return;
  loading.value = true;
  console.log({
    ...form.value,
    googlecode: code,
  })
  _forgetpw({
    ...form.value,
    googlecode: code,
  })
    .then((res) => {
      showToast("密码找回成功");
      //   setTimeout(() => {
      //     router.replace({ name: "user" });
      //     store.commit("setIsLoginOpen", true);
      //   }, 300);
      changePassSuccess.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="less" scoped>
.page-fogot {
  padding-top: 1.12rem;

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
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

  .title_box {
    padding: 0.32rem 0.32rem 0.6rem 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      color: var(--ex-text-color);
      font-family: "PingFang SC";
      font-size: 0.56rem;
      font-style: normal;
      font-weight: 600;
      line-height: 140%;
      /* 39.2px */
    }

    .tologin {
      color: var(--ex-primary-color);
      text-align: right;
      font-family: "PingFang SC";
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 600;
      /* 133.333% */
    }
  }

  .form {
    padding: 0 0.32rem;

    .form_title {
      color: var(--ex-text-color);
      line-height: 0.42rem;
      font-weight: 400;
      margin-bottom: 0.12rem;
      font-size: 0.28rem;
    }

    .form_passCheck {
      width: 2.32rem;
      height: 0.06rem;
      margin: 0.14rem;
    }

    .form_item {
      display: flex;
      align-items: center;
      border: 0.02rem solid var(--ex-border-color2);
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;

      .item_input {
        flex: 1;
        color: var(--ex-text-color);
        font-weight: 400;
        font-size: 0.28rem;
      }

      &:has(.item_input:focus) {
        border: 0.02rem solid var(--ex-primary-color);
      }

      .form_item_user {
        width: 0.64rem;
        height: 0.64rem;
        margin-right: 0.32rem;
      }

      .form_item_icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-left: 0.2rem;
      }

      .form_item_clear {
        justify-content: center;
        color: #161616;
        margin-left: 0.12rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.32rem;
        height: 0.32rem;
        background-color: #cdd4e3;
        padding: 0.02rem;
        border-radius: 50%;

        .van-icon {
          font-size: 0.24rem;
        }
      }
    }

    .margin_item {
      margin-bottom: 0.4rem;
    }
  }

  .submit_box {
    padding: 0 0.32rem;
    margin-top: 0.6rem;

    .submit {
      width: 100%;
      height: 1.12rem;
      font-size: 0.36rem;
    }
  }

  .go_register {
    margin: 2.8rem 0 1.4rem 0;
    text-align: center;
    font-weight: 400;

    >span {
      color: var(--ex-primary-color);
      font-weight: 600;
    }
  }
}

.eye-hidden-icon {
  width: 0.4rem;
  height: 0.32rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.eye-show-icon {
  width: 0.4rem;
  height: 0.26rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
