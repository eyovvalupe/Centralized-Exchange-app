<!-- 登录页 -->
<template>
  <div class="page page-login">

    <!-- 返回和语言 -->
    <div class="top" @click="router.back()">
      <div class="ripple_button top_back">
        <Icon name="cross" />
      </div>

      <div class="ripple_button top_lang">
        <img src="@/assets/common/language.png" alt="language">
      </div>
    </div>

    <!-- 标题 -->
    <div class="title_box">
      <div class="title">登录</div>
    </div>

    <!-- 表单 -->
    <div class="form">
      <div class="form_title">用户名</div>
      <div class="form_item margin_item">
        <div class="form_item_user" v-show="form.username">
          <img src="@/assets/user/user.png" alt="user">
        </div>
        <input v-model.trim="form.username" placeholder="您的用户名" type="text" class="item_input">
      </div>
      <div class="form_title">密码</div>
      <div class="form_item">
        <input v-show="!showPass" v-model.trim="form.password" placeholder="请输入您的密码" type="password" class="item_input">
        <input v-show="showPass" v-model.trim="form.password" placeholder="请输入您的密码" type="text" class="item_input">
        <div class="ripple_button form_item_icon" @click="showPass = !showPass">
          <img v-show="!showPass" src="@/assets/user/eye-off.png" alt="off">
          <img v-show="showPass" src="@/assets/user/eye-open.png" alt="open">
        </div>
      </div>
    </div>

    <!-- 忘记密码 -->
    <div class="fogot">忘记密码？</div>

    <!-- 按钮 -->
    <div class="submit_box">
      <Button :disabled="disabled" round color="#014CFA" class="submit" type="primary">登录</Button>
    </div>

    <!-- 去注册 -->
    <div class="go_register">
      没有账号吗？
      <span>去注册</span>
    </div>
  </div>
</template>

<script setup>
import { Icon, Button } from "vant"
import { ref, computed } from "vue"
import router from "@/router"

const showPass = ref(false)
const form = ref({ // 表单
  username: '',
  password: '',
  verifcode: ''
})

const disabled = computed(() => {
  return !(form.value.username && form.value.password)
})
</script>

<style lang="less" scoped>
.page-login {
  padding-top: 1.12rem;

  .top {
    position: fixed;
    width: 100%;
    height: 1.12rem;
    display: flex;
    padding: 0 0.4rem 0 0.12rem;
    align-items: center;
    justify-content: space-between;
    left: 0;
    top: 0;
    background-color: #fff;

    .top_back {
      color: #161616;
      font-size: 0.40rem;
      width: 0.8rem;
      height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .top_lang {
      width: 0.8rem;
      height: 0.8rem;
    }
  }

  .title_box {
    padding: 0.3rem 0.32rem 1.4rem 0.32rem;

    .title {
      height: 0.78rem;
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 0.56rem;
      color: #0D0D12;
    }
  }

  .form {
    padding: 0 0.32rem;

    .form_title {
      color: #000;
      line-height: 0.42rem;
      font-weight: 400;
      margin-bottom: 0.12rem;
    }

    .form_item {
      display: flex;
      align-items: center;
      border: 1px solid #D0D8E2;
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
        border: 1px solid #014CFA;
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
    }

    .margin_item {
      margin-bottom: 0.4rem;
    }
  }

  .fogot {
    color: #014CFA;
    font-weight: 400;
    padding-left: 0.32rem;
    margin: 0.2rem 0 1.14rem 0;
  }

  .submit_box {
    padding: 0 0.32rem;

    .submit {
      width: 100%;
      height: 1.12rem;
    }
  }

  .go_register {
    margin: 2.8rem 0 1.4rem 0;
    text-align: center;
    font-weight: 400;

    >span {
      color: #1A59F6;
      font-weight: 600;
    }
  }
}
</style>
