<!-- 忘记密码 -->
<template>
    <div class="page page-fogot">
      <!-- 返回和语言 -->
      <div class="top_icon_container">
        <div class="top_back_container text-[0.48rem]" @click="goBack">
          <Icon name="arrow-left" />
        </div>
        <div class="flex gap-[0.12rem]">
          <div class="audio_icon_container"></div>
          <div class="language_icon_container" @click="goLang">
            <div class="language_icon"></div>
          </div>
        </div>
      </div>
  
      <!-- 标题 -->
      <div class="title_box">
        <div class="title">忘记密码</div>
        <div class="tologin" @click="router.push({ name: 'login' })">去登录</div>
      </div>
  
      <!-- 表单 -->
      <div class="form">
        <div class="form_title">邮箱/手机号</div>
        <div class="form_item margin_item">
          <input
            maxlength="20"
            v-model.trim="form.username"
            placeholder="您的用户名"
            type="text"
            class="item_input"
          />
          <div
            class="form_item_clear"
            v-show="form.username"
            @click="form.username = null"
          >
            <Icon name="cross" />
          </div>
        </div>
  
        <div class="form_title">新密码</div>
        <div class="form_item">
          <input
            maxlength="20"
            v-model.trim="form.password"
            :type="showPass ? 'text' : 'password'"
            placeholder="密码最小8个字符"
            class="item_input"
            @input="checkPasswordStrength"
          />
          <div class="form_item_icon" @click="toggleShowPass">
            <img
              v-if="!showPass"
              src="/static/img/user/eye-off.png"
              alt="Hide password"
            />
            <img v-else src="/static/img/user/eye-open.png" alt="Show password" />
          </div>
        </div>
  
        <PasswordLevel class="form_passCheck" :password="form.password" />
        <div class="mb-[0.32rem]"></div>
        <div class="form_title">确认新密码</div>
        <div class="form_item">
          <input
            maxlength="20"
            v-model.trim="form.confirmPassword"
            :type="showConfirmPass ? 'text' : 'password'"
            placeholder="请再次输入新密码"
            class="item_input"
          />
          <div class="form_item_icon" @click="toggleShowConfirmPass">
            <img
              v-if="!showConfirmPass"
              src="/static/img/user/eye-off.png"
              alt="Hide password"
            />
            <img v-else src="/static/img/user/eye-open.png" alt="Show password" />
          </div>
        </div>
      </div>
  
      <!-- 按钮 -->
      <div class="submit_box" @click="submit">
        <Button
          :loading="loading"
          :disabled="disabled"
          round
          color="#014CFA"
          class="submit"
          type="primary"
          >继续</Button
        >
      </div>
  
      <!-- 谷歌 -->
      <GoogleVerfCode @submit="submitForm" ref="ggRef" />
    </div>
  </template>
  
  <script setup>
  import { Icon, Button, showToast } from "vant";
  import { ref, computed } from "vue";
  import router from "@/router";
  import { _forgetpw } from "@/api/api";
  import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
  import store from "@/store";
  import PasswordLevel from "@/components/PasswordLevel.vue";
  
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
  
  // Handle form submission
  const submitForm = (code) => {
    if (loading.value) return;
    loading.value = true;
  
    _forgetpw({
      ...form.value,
      googlecode: code,
    })
      .then((res) => {
        showToast("密码找回成功");
        setTimeout(() => {
          router.replace({ name: "user" });
          store.commit("setIsLoginOpen", true);
        }, 300);
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
      background-color: #fff;
  
      .top_back_container {
        .arrow_icon {
          width: 0.4rem;
          height: 0.4rem;
          clip-path: path("M13.4 2L5 10.4L13.4 18.8");
          background-color: #061023;
        }
      }
      .audio_icon_container {
        width: 0.72rem;
        height: 0.72rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-width: 0.02rem;
        border-color: #edf2f7;
        border-radius: 0.36rem;
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
  
    .title_box {
      padding: 0.32rem 0.32rem 0.6rem 0.32rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
  
      .title {
        color: #061023;
        font-family: "PingFang SC";
        font-size: 0.56rem;
        font-style: normal;
        font-weight: 600;
        line-height: 140%;
        /* 39.2px */
      }
  
      .tologin {
        color: #014cfa;
        text-align: right;
        font-family: "PingFang SC";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 600;
        line-height: 16px;
        /* 133.333% */
      }
    }
  
    .form {
      padding: 0 0.32rem;
  
      .form_title {
        color: #000;
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
        border: 0.02rem solid #d0d8e2;
        height: 1.12rem;
        border-radius: 0.32rem;
        padding: 0 0.32rem;
  
        .item_input {
          flex: 1;
          color: #333333;
          font-weight: 400;
          font-size: 0.28rem;
        }
  
        &:has(.item_input:focus) {
          border: 0.02rem solid #014cfa;
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
          width: 16px;
          height: 16px;
          background-color: #cdd4e3;
          padding: "1px";
          border-radius: 50%;
  
          .van-icon {
            font-size: 12px;
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
  
      > span {
        color: #1a59f6;
        font-weight: 600;
      }
    }
  }
  </style>
  