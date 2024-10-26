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
            <Icon name="cross" size="0.25rem"/>
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
              <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'"></div>
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
              <div :class="showConfirmPass ? 'eye-show-icon' : 'eye-hidden-icon'"></div>
          </div>
        </div>
      </div>
  
      <!-- 按钮 -->
      <div class="submit_box" @click="submit">
        <Button
          :loading="loading"
         
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
  
      > span {
        color: #1a59f6;
        font-weight: 600;
      }
    }
  }
  .eye-hidden-icon {
    width: 0.4rem;
    height: 0.32rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16"><path d="M10.0007 2.99935C11.5329 2.99425 13.0355 3.42167 14.3358 4.23245C15.636 5.04324 16.681 6.20448 17.3507 7.58268C16.8673 8.57836 16.1836 9.4635 15.3423 10.1827L16.5173 11.3577C17.6757 10.3327 18.5923 9.04935 19.1673 7.58268C17.7257 3.92435 14.1673 1.33268 10.0007 1.33268C8.94232 1.33268 7.92565 1.49935 6.96732 1.80768L8.34232 3.18268C8.88399 3.07435 9.43399 2.99935 10.0007 2.99935ZM9.10899 3.94935L10.834 5.67435C11.309 5.88268 11.6923 6.26602 11.9007 6.74102L13.6257 8.46601C13.6923 8.18268 13.7423 7.88268 13.7423 7.57435C13.7507 5.50768 12.0673 3.83268 10.0007 3.83268C9.69232 3.83268 9.40065 3.87435 9.10899 3.94935ZM1.67565 1.22435L3.90898 3.45768C2.53425 4.53365 1.47253 5.95792 0.833984 7.58268C2.27565 11.241 5.83399 13.8327 10.0007 13.8327C11.2673 13.8327 12.484 13.591 13.6007 13.1493L16.4507 15.9993L17.6257 14.8243L2.85065 0.0410156L1.67565 1.22435ZM7.92565 7.47435L10.1007 9.64935C10.0673 9.65768 10.034 9.66602 10.0007 9.66602C9.44812 9.66602 8.91821 9.44652 8.52751 9.05582C8.13681 8.66512 7.91732 8.13522 7.91732 7.58268C7.91732 7.54102 7.92565 7.51602 7.92565 7.47435ZM5.09232 4.64102L6.55065 6.09935C6.35307 6.56895 6.25109 7.07322 6.25065 7.58268C6.25173 8.2027 6.4063 8.81281 6.70055 9.35856C6.99479 9.90431 7.41957 10.3687 7.93698 10.7104C8.45439 11.052 9.04832 11.2602 9.66579 11.3165C10.2833 11.3727 10.905 11.2752 11.4757 11.0327L12.2923 11.8493C11.559 12.0493 10.7923 12.166 10.0007 12.166C8.46837 12.1711 6.96576 11.7437 5.66555 10.9329C4.36535 10.1221 3.32033 8.96088 2.65065 7.58268C3.23398 6.39102 4.08398 5.40768 5.09232 4.64102Z" fill="%23C0C3D3"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .eye-show-icon {
    width: 0.4rem;
    height: 0.26rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 13"><path d="M9.99967 2.00065C11.532 1.99556 13.0346 2.42297 14.3348 3.23376C15.635 4.04454 16.68 5.20578 17.3497 6.58398C15.9747 9.39232 13.158 11.1673 9.99967 11.1673C6.84134 11.1673 4.02467 9.39232 2.64967 6.58398C3.31936 5.20578 4.36437 4.04454 5.66457 3.23376C6.96478 2.42297 8.46739 1.99556 9.99967 2.00065ZM9.99967 0.333984C5.83301 0.333984 2.27467 2.92565 0.833008 6.58398C2.27467 10.2423 5.83301 12.834 9.99967 12.834C14.1663 12.834 17.7247 10.2423 19.1663 6.58398C17.7247 2.92565 14.1663 0.333984 9.99967 0.333984ZM9.99967 4.50065C10.5522 4.5007 11.082 4.72022 11.4727 5.11092C11.8633 5.50161 12.0828 6.03149 12.0828 6.58398C12.0828 7.13648 11.8633 7.66636 11.4727 8.05705C11.082 8.44775 10.5522 8.66726 9.99967 8.66732C9.44718 8.66726 8.91732 8.44775 8.52667 8.05705C8.13601 7.66636 7.91654 7.13648 7.91654 6.58398C7.91654 6.03149 8.13601 5.50161 8.52667 5.11092C8.91732 4.72022 9.44718 4.5007 9.99967 4.50065ZM9.99967 2.83398C7.93301 2.83398 6.24967 4.51732 6.24967 6.58398C6.24967 8.65065 7.93301 10.334 9.99967 10.334C12.0663 10.334 13.7497 8.65065 13.7497 6.58398C13.7497 4.51732 12.0663 2.83398 9.99967 2.83398Z" fill="%238F92A1"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  </style>
  