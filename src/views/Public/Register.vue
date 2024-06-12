<!-- 注册页 -->
<template>
  <div class="page page-register">

    <!-- 返回和语言 -->
    <div class="max-width top">
      <div class="ripple_button top_back" @click="goBack">
        <Icon name="cross" />
      </div>

      <div class="ripple_button top_lang" @click="router.push({ name: 'language' })">
        <img src="/static/img/common/language.png" alt="language">
      </div>
    </div>

    <!-- 标题 -->
    <div class="title_box">
      <div class="title">创建您的账户</div>
    </div>

    <!-- 表单 -->
    <div class="form">
      <div class="form_title">用户名</div>
      <div class="form_item margin_item">
        <input maxlength="20" v-model.trim="form.username" placeholder="您的用户名" type="text" class="item_input">
      </div>
      <div class="form_title">密码</div>
      <div class="form_item margin_item">
        <input maxlength="20" v-show="!showPass" v-model.trim="form.password" placeholder="密码最小8个字符" type="password"
          class="item_input">
        <input maxlength="20" v-show="showPass" v-model.trim="form.password" placeholder="密码最小8个字符" type="text"
          class="item_input">
        <div class="ripple_button form_item_icon" @click="showPass = !showPass">
          <img v-show="!showPass" src="/static/img/user/eye-off.png" alt="off">
          <img v-show="showPass" src="/static/img/user/eye-open.png" alt="open">
        </div>
      </div>
      <!-- 密码等级 -->
      <PasswordLevel style="position: relative;top:-0.32rem;left:0.32rem" :password="form.password" />

      <div class="form_title">邀请码</div>
      <div class="form_item margin_item">
        <input maxlength="20" v-model.trim="form.invateCode" placeholder="请输入您的邀请码" type="text" class="item_input">
      </div>
    </div>

    <!-- 协议 -->
    <label class="ripple_button register_doc" @click="checked = !checked">
      <Checkbox :icon-size="'0.36rem'" @click.stop="() => { }" class="register_doc_check" checked-color="#014CFA"
        shape="square" v-model="checked"></Checkbox>
      我同意<span>隐私政策</span>和<span>用户条款</span>
    </label>

    <!-- 按钮 -->
    <div class="submit_box">
      <Button @click="submit" :disabled="disabled" round color="#014CFA" class="submit" type="primary">继续</Button>
    </div>

    <!-- 去注册 -->
    <div class="go_register" @click="goLogin">
      <div class="server_icon">
        <img src="/static/img/common/server.png" alt="server">
      </div>
      有账号吗？
      <span>去登录</span>
    </div>


  </div>


</template>

<script setup>
import { Icon, Button, showToast, Checkbox } from "vant"
import { ref, computed } from "vue"
import router from "@/router"
import { useRoute } from "vue-router"
import PasswordLevel from "@/components/PasswordLevel.vue"
import store from "@/store"

// 进入页面则重置登录状态信息
store.commit("setToken", "");
store.commit("setUserInfo", {});

const route = useRoute()

const showPass = ref(false) // 密码显示
const checked = ref(false) // 同意协议
const form = ref({ // 表单
  username: '',
  password: '',
  guest: false,
  invateCode: ''
})

const disabled = computed(() => { // 提交按钮禁用
  return !(form.value.username && form.value.password)
})

// 提交
const submit = () => {
  if (!checked.value) return showToast('请先同意隐私政策和用户条款')
  sessionStorage.setItem('registerForm', JSON.stringify(form.value))
  setTimeout(() => {
    router.push({
      name: 'safePassword'
    })
  }, 100)
}


// 返回
const goBack = () => {
  if (route.query.reurl) {
    router.replace({
      name: route.query.reurl,
      query: {
        redata: route.query.redata,
      }
    })
  } else {
    router.back()
  }
}
// 跳转登录
const goLogin = () => {
  router.replace({
    name: 'login',
    query: {
      reurl: route.query.reurl,
      redata: route.query.redata,
    }
  })
}
</script>

<style lang="less" scoped>
.page-register {
  padding-top: 1.12rem;

  .top {
    position: fixed;
    width: 100%;
    height: 1.12rem;
    display: flex;
    padding: 0 0.4rem 0 0.12rem;
    align-items: center;
    justify-content: space-between;
    left: 50%;
    transform: translateX(-50%);
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
    padding: 0.3rem 0.32rem 0.56rem 0.32rem;

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

  .register_doc {
    padding-left: 0.32rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #343434;
    font-weight: 400;
    font-size: 0.26rem;
    margin-bottom: 0.8rem;

    .register_doc_check {
      margin-right: 0.24rem;
    }

    >span {
      color: #014CFA;
    }
  }

  .submit_box {
    padding: 0 0.32rem;

    .submit {
      width: 100%;
      height: 1.12rem;
    }
  }

  .go_register {
    margin: 1.12rem 0;
    text-align: center;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;

    .server_icon {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;
    }

    >span {
      color: #1A59F6;
      font-weight: 600;
    }
  }
}
</style>
