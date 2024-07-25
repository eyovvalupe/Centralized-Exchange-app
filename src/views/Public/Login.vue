<!-- 登录页 -->
<template>
  <div class="page page-login">

    <!-- 返回和语言 -->
    <div class="max-width top">
      <div class=" top_back" @click="goBack">
        <Icon name="cross" />
      </div>

      <div class=" top_lang" @click="router.push({ name: 'language' })">
        <img src="/static/img/common/language.png" alt="language">
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
        <div class="form_item_user" v-show="saveAccount && saveAccount == form.username">
          <img src="/static/img/user/user.png" alt="user">
        </div>
        <input @change="changeAccount" maxlength="20" v-model.trim="form.username" placeholder="您的用户名" type="text"
          class="item_input">
        <Loading v-if="accountLoading" :size="18" type="spinner" />
      </div>
      <div class="form_title">密码</div>
      <div class="form_item">
        <input maxlength="20" v-show="!showPass" v-model.trim="form.password" placeholder="请输入您的密码" type="password"
          class="item_input">
        <input maxlength="20" v-show="showPass" v-model.trim="form.password" placeholder="请输入您的密码" type="text"
          class="item_input">
        <div class=" form_item_icon" @click="showPass = !showPass">
          <img v-show="!showPass" src="/static/img/user/eye-off.png" alt="off">
          <img v-show="showPass" src="/static/img/user/eye-open.png" alt="open">
        </div>
      </div>
    </div>

    <!-- 忘记密码 -->
    <div class="fogot" @click="router.replace({ name: 'fogot' })">忘记密码？</div>

    <!-- 按钮 -->
    <div class="submit_box" @click="submit">
      <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit" type="primary">登录</Button>
    </div>

    <!-- 去注册 -->
    <div class="go_register" @click="goRegister">
      没有账号吗？
      <span>去注册</span>
    </div>


    <!-- 验证码 -->
    <VerifCode @submit="submitCode" to="body" ref="verifCodeRef" />
  </div>


</template>

<script setup>
import { Icon, Button, showToast, Loading } from "vant"
import { ref, computed } from "vue"
import router from "@/router"
import { useRoute } from "vue-router"
import { _login, _userExist } from "@/api/api"
import VerifCode from "@/components/VerifCode.vue"
import store from "@/store"

// 进入页面则重置登录状态信息
store.commit("setToken", "");
store.commit("setUserInfo", {});
store.commit('clearChooseSymbol')

const saveAccount = ref(localStorage.getItem('saveAccount') || '')
const accountLoading = ref(false)
const changeAccount = () => {
  accountLoading.value = true
  if (form.value.username) { // 去检测
    _userExist({
      username: form.value.username
    }).then(res => {
      if (res.code == 200 && res.data?.exist == 1) {
        saveAccount.value = form.value.username
        localStorage.setItem('saveAccount', saveAccount.value)
      } else {
        // showToast('账号不存在')
      }
    }).finally(() => {
      accountLoading.value = false
    })
  }
}

const route = useRoute()
const verifCodeRef = ref()

const showPass = ref(false) // 密码显示
const form = ref({ // 表单
  username: saveAccount.value,
  password: '',
  verifcode: ''
})

const loading = ref(false) // 加载
const disabled = computed(() => { // 提交按钮禁用
  return !(form.value.username && form.value.password)
})

// 提交
const submit = () => {
  if (loading.value) return
  loading.value = true
  _login(form.value).then(res => {
    if (res && res.code == 200) {
      store.dispatch('reset')
      showToast('登录成功')
      setTimeout(() => {
        store.commit('setToken', res.data.auth)
        store.commit('setUserInfo', res.data)
      }, 100)
      setTimeout(() => {
        store.dispatch('updateUserInfo')
        if (route.query.reurl) {
          router.replace({
            name: route.query.reurl,
            query: {
              redata: route.query.redata,
            }
          })
        } else {
          router.push({
            name: 'user'
          })
        }
      }, 300)
    } else {
      return showToast(res.message || '登录异常')
    }
  }).catch(err => {
    if (err.code == '1001') { // 弹出验证码
      if (form.value.verifcode) { // 如果输入了验证码，旧提示验证码错误
        showToast(err.message)
      }
      setTimeout(() => {
        verifCodeRef.value.open()
      }, 1000)
    } else {
      showToast(err.message || "网络异常")
    }
  }).finally(() => {
    setTimeout(() => {
      form.value.verifcode = ''
      loading.value = false
    }, 1000)
  })
}

// 通过验证码提交
const submitCode = code => {
  form.value.verifcode = code
  submit()
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
// 跳转注册
const goRegister = () => {
  router.replace({
    name: 'register',
    query: {
      reurl: route.query.reurl,
      redata: route.query.redata,
    }
  })
}


// 预加载页面
store.commit('setPageLoading', true)
Promise.all([
  import('@/views/Public/Register.vue'),
  import('@/views/Public/Fogot.vue'),
]).finally(() => {
  store.commit('setPageLoading', false)
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
    padding: 0.12rem 0.32rem 0.8rem 0.32rem;

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
    padding-left: 0.44rem;
    margin: 0.2rem 0 0.8rem 0;
  }

  .submit_box {
    padding: 0 0.32rem;

    .submit {
      width: 100%;
      height: 1.12rem;
    }
  }

  .go_register {
    margin: 0.8rem 0 0.4rem 0;
    text-align: center;
    font-weight: 400;

    >span {
      color: #1A59F6;
      font-weight: 600;
    }
  }
}
</style>
