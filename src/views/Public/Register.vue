<!-- 注册页 -->
<template>
  <div class="page page-register">
    <!-- 图片验证 -->
    <template v-if="step == 1">
      <ImgCheck @success="step = 2" @goBack="goBack" />
    </template>

    <template v-else-if="step == 2">
      <!-- 返回和语言 -->
      <div class="top_icon_container">
        <div class="top_back_container text-[0.48rem]" @click="goBack">
          <Icon name="arrow-left" />
        </div>

        <div class="language_icon_container" @click="goLang">
          <div class="language_icon"></div>
        </div>
      </div>

      <!-- 标题 -->
      <div class="title_box">
        <div class="title">{{ guest ? "创建模拟账户" : "创建您的账户" }}</div>
        <div class="login_title">
          有账号？
          <span class="tologin" @click="router.push({ name: 'login' })"
            >去登录</span
          >
        </div>
      </div>

      <!-- tab -->
      <Tabs type="card" class="tabs" v-model:active="activeTab" animated shrink>
        <Tab :title="'邮箱'"> </Tab>
        <Tab :title="'手机'"></Tab>
      </Tabs>

      <!-- 表单 -->
      <div class="form">
        <!-- <div class="form_title">用户名</div>
        <div class="form_item margin_item" :class="{ 'err_ipt': errorTip.error1 }">
          <input maxlength="20" @blur="errorTip.error1 = false" v-model.trim="form.username" placeholder="您的用户名"
            type="text" class="item_input">
        </div> -->
        <div class="form_title" v-show="activeTab == 0">邮箱</div>
        <div
          class="form_item margin_item"
          v-show="activeTab == 0"
          :class="{ err_ipt: errorTip.error1 }"
        >
          <input
            maxlength="20"
            @blur="errorTip.error1 = false"
            v-model.trim="form.email"
            placeholder="您的邮箱"
            type="text"
            class="item_input"
          />
          <div
            class="form_item_clear"
            v-show="form.email"
            @click="form.email = null"
          ></div>
        </div>
        <div class="form_title" v-show="activeTab == 1">手机号</div>
        <div
          class="form_item margin_item"
          v-show="activeTab == 1"
          :class="{ err_ipt: errorTip.error1 }"
        >
          <div class="code" @click="showDialog = true">
            <span class="flag_icon">
              <img src="/static/img/common/flag_hongkong.svg" alt="" />
            </span>
            <span>{{ form.area }}</span>
            <div class="more_icon">
              <img src="/static/img/assets/more.png" alt="img" />
            </div>
          </div>
          <input
            maxlength="20"
            @blur="errorTip.error1 = false"
            v-model.trim="form.phone"
            placeholder="您的手机号"
            type="text"
            class="item_input"
          />
        </div>
        <div class="form_title">登录密码</div>
        <div
          class="form_item margin_item"
          :class="{ err_ipt: errorTip.error2 }"
        >
          <input
            maxlength="20"
            @blur="errorTip.error2 = false"
            v-show="!showPass"
            v-model.trim="form.password"
            placeholder="密码最小8个字符"
            type="password"
            class="item_input"
          />
          <input
            maxlength="20"
            @blur="errorTip.error2 = false"
            v-show="showPass"
            v-model.trim="form.password"
            placeholder="密码最小8个字符"
            type="text"
            class="item_input"
          />
          <div class="form_item_icon" @click="showPass = !showPass">
            <img
              v-show="!showPass"
              src="/static/img/user/eye-off.png"
              alt="off"
            />
            <img
              v-show="showPass"
              src="/static/img/user/eye-open.png"
              alt="open"
            />
          </div>
        </div>
        <!-- 密码等级 -->
        <PasswordLevel
          style="position: relative; top: -0.32rem; left: 0.32rem"
          :password="form.password"
        />
        <div class="form_title">交易密码</div>
        <div
          class="form_item margin_item"
          :class="{ err_ipt: errorTip.error3 }"
        >
          <input
            maxlength="20"
            @blur="errorTip.error3 = false"
            v-show="!showPass2"
            v-model.trim="form.safeword"
            placeholder="请输入交易密码"
            type="password"
            class="item_input"
          />
          <input
            maxlength="20"
            @blur="errorTip.error3 = false"
            v-show="showPass2"
            v-model.trim="form.safeword"
            placeholder="请输入交易密码"
            type="text"
            class="item_input"
          />
          <div class="form_item_icon" @click="showPass2 = !showPass2">
            <img
              v-show="!showPass2"
              src="/static/img/user/eye-off.png"
              alt="off"
            />
            <img
              v-show="showPass2"
              src="/static/img/user/eye-open.png"
              alt="open"
            />
          </div>
        </div>
        <!-- <div class="form_title">确认交易密码</div>
      <div class="form_item margin_item" :class="{ 'err_ipt': errorTip.error3 }">
        <input maxlength="20" @blur="errorTip.error3 = false" v-show="!showPass3" v-model.trim="form.safeword2"
          placeholder="请确认交易密码" type="password" class="item_input">
        <input maxlength="20" @blur="errorTip.error3 = false" v-show="showPass3" v-model.trim="form.safeword2"
          placeholder="请确认交易密码" type="text" class="item_input">
        <div class=" form_item_icon" @click="showPass3 = !showPass3">
          <img v-show="!showPass3" src="/static/img/user/eye-off.png" alt="off">
          <img v-show="showPass3" src="/static/img/user/eye-open.png" alt="open">
        </div>
      </div> -->

        <div class="form_title">邀请码</div>
        <div class="form_item margin_item">
          <input
            maxlength="20"
            v-model.trim="form.invateCode"
            placeholder="请输入您的邀请码"
            type="text"
            class="item_input"
          />
        </div>
      </div>

      <!-- 协议 -->
      <label class="register_doc" @click="checked = !checked">
        <div
          :class="checked ? 'checked_icon_blue' : 'unchecked_icon'"
          class="mr-[0.2rem]"
        ></div>
        我同意<span>隐私政策</span>和<span>用户条款</span>
      </label>

      <!-- 按钮 -->
      <div class="submit_box">
        <Button
          @click="submit"
          :loading="loading"
          round
          color="#014CFA"
          class="submit"
          type="primary"
          >继续</Button
        >
      </div>

      <!-- 去注册 -->
      <!-- <div class="go_register">
        <div class="server_icon" @click="goChat">
          <img src="/static/img/common/server.png" alt="server" />
        </div>
        <span @click="goLogin">
          有账号吗？
          <span>去登录</span>
        </span>
      </div> -->
    </template>

    <template v-else>
      <RegisterCodeCheck
        :type="activeTab == 0 ? 'email' : 'phone'"
        :value="activeTab == 0 ? form.email : form.phone"
        @success="registerSuccessNext"
      />
    </template>

    <!-- 验证码 -->
    <VerifCode
      :type="activeTab == 0 ? 'email' : 'phone'"
      :value="form.username"
      @submit="submitCode"
      to="body"
      ref="verifCodeRef"
    />

    <!-- 区号弹窗 -->
    <Popup
      :safe-area-inset-top="true"
      :safe-area-inset-bottom="true"
      class="self_van_popup"
      v-model:show="showDialog"
      position="bottom"
      teleport="body"
    >
      <div class="register_accounr_dialog">
        <div class="close_icon" @click="showDialog = false">
          <img src="/static/img/common/close.png" alt="x" />
        </div>
        <div class="item search_box">
          <Icon class="search" name="search" size="24px" />
          <input
            v-model.trim="searchStr"
            class="ipt"
            type="text"
            placeholder="搜索"
          />
        </div>
        <div style="height: 60vh; overflow-y: auto">
          <div
            @click="clickItem(item)"
            class="transfer_dialog_item"
            :class="{ transfer_dialog_item_active: form.area == item.code }"
            v-for="(item, i) in showAreas"
            :key="i"
          >
            <span class="flag_icon">
              <img src="/static/img/common/flag_hongkong.svg" alt="HongKong" />
            </span>
            <span>{{ item.cn }}</span>
            <span>({{ item.code }})</span>
            <Icon
              v-if="form.area == item.code"
              class="check_icon"
              name="success"
            />
          </div>
          <NoData v-if="!showAreas.length" />
        </div>
      </div>
    </Popup>
  </div>
</template>

<script setup>
import {
  Icon,
  Button,
  showToast,
  Checkbox,
  showLoadingToast,
  closeToast,
  Tab,
  Tabs,
  Popup,
} from "vant";
import { ref, computed } from "vue";
import router from "@/router";
import { useRoute, useRouter } from "vue-router";
import PasswordLevel from "@/components/PasswordLevel.vue";
import store from "@/store";
import { _register } from "@/api/api";
import VerifCode from "@/components/VerifCode.vue";
import ImgCheck from "@/components/ImgCheck.vue";
import { areaCode, validateEmail } from "@/utils/index";
import NoData from "@/components/NoData.vue";
import RegisterCodeCheck from "@/components/RegisterCodeCheck.vue";

// 区号控制
// const step = ref(1)
const activeTab = ref(0);
const defaultCode = "+244";
const showDialog = ref(false);
const searchStr = ref("");
const showAreas = computed(() => {
  return areaCode.filter((item) => {
    return (
      item.cn.includes(searchStr.value) ||
      item.en.includes(searchStr.value) ||
      item.code.includes(searchStr.value)
    );
  });
});
const clickItem = (item) => {
  form.value.area = item.code;
  showDialog.value = false;
};

//跳转到语言设置页
const goLang = () => {
  //   emits("closeDialog");
  router.push({ name: "language" });
};

// 进入页面则重置登录状态信息
store.commit("setToken", "");
store.commit("setUserInfo", {});

const route = useRoute();
const routerApi = useRouter();
const forwardUrl = routerApi.options.history.state.forward;
const step = ref(forwardUrl === "/language" || forwardUrl === "/chat" ? 2 : 1);

const guest = ref(route.query.guest);
const showPass = ref(false); // 密码显示
const showPass2 = ref(false); // 密码显示
const showPass3 = ref(false); // 密码显示
const checked = ref(true); // 同意协议
const form = ref({
  // 表单
  area: defaultCode,
  email: "",
  phone: "",
  username: "",
  password: "",
  guest: guest.value ? "true" : "false",
  invateCode: "",
  safeword: "",
  // safeword2: ''
});
const verifcode = ref("");
const verifCodeRef = ref();

// 提交
const errorTip = ref({
  error1: false,
  error2: false,
  error3: false,
});
const loading = ref(false);
const submit = async () => {
  if (!checked.value) return showToast("请先同意隐私政策和用户条款");
  // if (!form.value.username) {
  //   errorTip.value.error1 = true
  //   return showToast('请输入用户名')
  // }
  if (activeTab.value == 0) {
    if (!form.value.email || !validateEmail(form.value.email)) {
      errorTip.value.error1 = true;
      showToast("请输入有效邮箱");
      return;
    }
    form.value.username = form.value.email;
  }
  if (activeTab.value == 1) {
    if (!form.value.phone) {
      errorTip.value.error1 = true;
      showToast("请输入手机号码");
      return;
    }
    form.value.username = form.value.area + form.value.phone;
  }
  if (!form.value.password) {
    errorTip.value.error2 = true;
    return showToast("请输入密码");
  }
  if (form.value.password.length < 8) {
    errorTip.value.error2 = true;
    return showToast("密码最小8个字符");
  }
  if (!form.value.safeword) {
    errorTip.value.error3 = true;
    return showToast("请输入交易密码");
  }
  // if (form.value.safeword != form.value.safeword2) {
  //   errorTip.value.error3 = true
  //   return showToast('两次密码不一致')
  // }
  sessionStorage.setItem("registerForm", JSON.stringify(form.value));

  if (!sessionToken.value) {
    const rs = await store.dispatch("updateSessionToken");
    if (!rs) return showToast("网络异常，请重试");
  }
  if (loading.value) return;
  loading.value = true;
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  _register({
    ...form.value,
    token: sessionToken.value,
    verifcode: verifcode.value,
  })
    .then((res) => {
      if (res.code == 200) {
        setTimeout(() => {
          store.dispatch("reset");
          setTimeout(() => {
            store.commit("setToken", res.data.auth);
            store.commit("setUserInfo", res.data);
          }, 100);
          setTimeout(() => {
            store.dispatch("updateUserInfo");
            store.dispatch("updateAssets");
            store.dispatch("updateWallet");
            step.value = 3;
          }, 300);
        }, 2000);
      } else {
        showToast(res.message);
      }
    })
    .catch((err) => {
      if (err.code == "1001") {
        // 弹出验证码
        if (verifcode.value) {
          // 如果输入了验证码，旧提示验证码错误
          showToast(err.message);
        }
        setTimeout(() => {
          verifCodeRef.value.open();
        }, 1000);
      } else {
        showToast(err.message || "网络异常");
      }
    })
    .finally(() => {
      getSessionToken();
      setTimeout(() => {
        verifcode.value = "";
        loading.value = false;
        closeToast();
      }, 2500);
    });
};

const registerSuccessNext = () => {
  if (guest.value) {
    router.replace({
      name: "registerSuccess2",
    });
  } else {
    router.replace({
      name: "registerSuccess",
    });
  }
};

// 通过验证码提交
const submitCode = (code) => {
  verifcode.value = code;
  submit();
};

const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  store.dispatch("updateSessionToken");
};
getSessionToken();

// 返回
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
// 跳转登录
const goLogin = () => {
  router.replace({
    name: "user",
  });
  setTimeout(() => {
    store.commit("setIsLoginOpen", true);
  }, 300);
  // router.replace({
  //   name: 'login',
  //   query: {
  //     reurl: route.query.reurl,
  //     redata: route.query.redata,
  //   }
  // })
};
const goChat = () => {
  router.push({
    name: "chat",
  });
};
</script>

<style lang="less" scoped>
.page-register {
  padding-top: 1.12rem;
  height: 100%;

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
    margin-bottom: 0.2rem;

    .top_back_container {
      .arrow_icon {
        width: 20px;
        height: 20px;
        clip-path: path("M13.4 2L5 10.4L13.4 18.8");
        background-color: #061023;
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

  .tabs {
    overflow: hidden;
    margin-bottom: 0.4rem;
    z-index: 1;

    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: #061023;
      border-bottom: 0.06rem solid #d0d8e2;
      // background-color: #f5f5f5;
      // border-radius: 0.3rem;
      // margin-left: 0.1rem;
      // transition: all ease .2s;
    }

    :deep(.van-tab--card.van-tab--active) {
      background-color: white;
      color: #2168f6;
      font-family: "PingFang SC";
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-bottom: 0.08rem solid #014cfa;
    }

    :deep(.van-tab--shrink) {
      padding: 0 0.3rem;
    }

    :deep(.van-tabs__wrap) {
      height: 0.8rem;
      border-bottom: 0.02rem solid rgba(0, 0, 0, 0);
      padding-bottom: 0.2rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 0.8rem;
      display: flex;
    }

    :deep(.van-tab) {
      line-height: 0.54rem;
      font-size: 0.32rem;
      width: 50%;
      padding-bottom: 0.3rem;
    }
  }

  .title_box {
    padding: 0.12rem 0.32rem 0.4rem 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      color: var(--, #061023);
      text-align: left;
      font-family: "PingFang SC";
      font-size: 0.56rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.784rem;
      /* 39.2px */
    }

    .login_title {
      color: #343434;
      text-align: right;
      font-family: "PingFang SC";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.32rem;
      /* 133.333% */
    }

    .tologin {
      color: #014cfa;
      font-family: "PingFang SC";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.32rem;
    }
  }

  .van-tabs {
    margin-bottom: 0.6rem;

    .van-tabs__warp {
      .van-tab__nav {
        .van-tab {
          .van-tab__text {
            font-size: 0.32rem;
            line-height: 0.448rem;
          }

          .van-tab--active {
            font-size: 0.36rem;
            line-height: 0.54rem;
          }
        }
      }
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
      border: 1px solid #d0d8e2;
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;

      .form_item_clear {
        width: 0.32rem;
        height: 0.32rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="%23A4ACB9"/><path d="M7.99997 7.46422L5.52417 4.98598L5.52441 4.98574L5.51759 4.97987C5.4456 4.91786 5.35287 4.88531 5.25791 4.88875C5.16296 4.89219 5.07282 4.93138 5.00551 4.99844C4.93821 5.06549 4.89868 5.15548 4.89479 5.25041C4.8909 5.34534 4.92295 5.43826 4.98454 5.5106L4.98427 5.51083L4.99084 5.51744L7.46704 8.00603L4.99153 10.4757C4.99146 10.4758 4.99139 10.4758 4.99131 10.4759C4.95608 10.5108 4.9281 10.5523 4.909 10.5981C4.88986 10.644 4.88 10.6932 4.88 10.7429C4.88 10.7926 4.88986 10.8418 4.909 10.8876C4.92809 10.9334 4.95605 10.9749 4.99126 11.0098C5.06194 11.0804 5.15771 11.12 5.25759 11.12C5.35756 11.12 5.45342 11.0803 5.52412 11.0096L5.52417 11.0095L8.00003 8.53125L10.4759 11.0079L10.4759 11.0079C10.5466 11.0786 10.6424 11.1183 10.7424 11.1183C10.8424 11.1183 10.9382 11.0786 11.0089 11.0079L10.9241 10.923M7.99997 7.46422L8.08484 8.44636L10.5607 10.923C10.6089 10.9712 10.6743 10.9983 10.7424 10.9983C10.8105 10.9983 10.8759 10.9712 10.9241 10.923M7.99997 7.46422L10.4758 4.98429L10.4788 4.98126L10.4789 4.98132C10.5504 4.91465 10.6449 4.87833 10.7427 4.88006C10.8404 4.88178 10.9336 4.92142 11.0027 4.99057C11.0718 5.05971 11.1113 5.15298 11.113 5.2507C11.1148 5.34842 11.0785 5.44302 11.0119 5.51456L11.0092 5.51749L11.0092 5.51744L8.53299 8.006L11.0085 10.474M7.99997 7.46422L11.0085 10.474M10.9241 10.923C10.9481 10.8992 10.9672 10.8709 10.9803 10.8397C10.9933 10.8085 11 10.775 11 10.7412C11 10.7073 10.9933 10.6738 10.9803 10.6426C10.9672 10.6114 10.9481 10.5831 10.9241 10.5593M10.9241 10.923L11.0085 11.0083C11.0438 10.9734 11.0719 10.9318 11.091 10.8859C11.1101 10.8401 11.12 10.7909 11.12 10.7412C11.12 10.6915 11.1101 10.6422 11.091 10.5964C11.0719 10.5506 11.0439 10.5091 11.0087 10.4742L11.0088 10.4743L10.9241 10.5593M10.9241 10.5593L11.0085 10.474M10.9241 10.5593L11.0085 10.474M5.43928 10.9247L7.91519 8.44638L7.63663 8.00634L5.07591 10.561C5.05186 10.5848 5.03277 10.6131 5.01974 10.6443C5.00671 10.6755 5 10.709 5 10.7429C5 10.7767 5.00671 10.8102 5.01974 10.8414C5.03277 10.8726 5.05186 10.901 5.07591 10.9247C5.12411 10.9729 5.18946 11 5.25759 11C5.32572 11 5.39107 10.9729 5.43928 10.9247Z" fill="%23161616" stroke="%23161616" stroke-width="0.24"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;

        .van-icon {
          font-size: 0.24rem;
        }
      }

      .code {
        color: #666;
        display: flex;
        align-items: center;
        margin-right: 0.12rem;
        gap: 5px;

        .flag_icon {
          width: 32px;
          height: 32px;
        }

        .more_icon {
          width: 0.24rem;
          height: 0.24rem;
          margin-left: 0.1rem;
        }
      }

      .item_input {
        flex: 1;
        color: #333333;
        font-weight: 400;
        font-size: 0.28rem;
      }

      &:has(.item_input:focus) {
        border: 1px solid #014cfa;
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

    .err_ipt {
      border: 1px solid #e8503a;
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
    font-size: 0.28rem;
    line-height: 0.32rem;
    margin-bottom: 0.5rem;

    .checked_icon_blue {
      width: 0.48rem;
      height: 0.48rem;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="white"/><path d="M8.52645 13.3945C8.34635 13.3895 8.17542 13.3219 8.04962 13.2059L5.20301 10.6602C5.07277 10.5388 5 10.3767 5 10.208C5 10.0394 5.07277 9.87731 5.20301 9.7559C5.2686 9.69655 5.3466 9.64945 5.43253 9.61731C5.51845 9.58517 5.6106 9.56862 5.70367 9.56862C5.79674 9.56862 5.88889 9.58517 5.97481 9.61731C6.06074 9.64945 6.13874 9.69655 6.20433 9.7559L8.52645 11.8559L14.4581 7.18875C14.5229 7.12901 14.6004 7.08153 14.686 7.04912C14.7716 7.0167 14.8635 7 14.9564 7C15.0492 7 15.1412 7.0167 15.2267 7.04912C15.3123 7.08153 15.3898 7.12901 15.4547 7.18875C15.5207 7.2477 15.5731 7.31781 15.6088 7.39504C15.6446 7.47227 15.663 7.5551 15.663 7.63875C15.663 7.7224 15.6446 7.80523 15.6088 7.88246C15.5731 7.95969 15.5207 8.0298 15.4547 8.08875L9.02712 13.2059C8.89458 13.3258 8.71453 13.3937 8.52645 13.3945Z" fill="%23014CFA"/></svg>');
      border: 0.02rem solid #d0d8e2;
      background-size: contain;
      border-radius: 0.11rem;
      background-repeat: no-repeat;
    }
    .unchecked_icon {
      width: 0.48rem;
      height: 0.48rem;
      background-color: transparent;
      border: 0.02rem solid #d0d8e2;
      border-radius: 0.11rem;
    }

    .register_doc_check {
      margin-right: 0.24rem;
    }

    > span {
      color: #014cfa;
    }
  }

  .submit_box {
    padding: 0 0.32rem;

    :deep(.van-button__content) {
      font-size: 0.36rem;
      line-height: 0.36rem;
    }
    .submit {
      width: 100%;
      height: 1.12rem;
    }
  }

  .go_register {
    margin: 0.6rem 0 0.2rem 0;
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

    > span {
      color: #1a59f6;
      font-weight: 600;
    }
  }
}
</style>

<style lang="less" scoped>
.register_accounr_dialog {
  background-color: #fff;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  overflow: hidden;
  padding: 0.86rem 0.32rem 0.8rem 0.32rem;
  position: relative;

  .close_icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0.24rem;
    right: 0.32rem;
  }

  .search_box {
    height: 0.84rem;
    border: 1px solid #d0d8e2;
    border-radius: 0.32rem;
    padding: 0 0.32rem;
    margin: 0.12rem 0;
    display: flex;
    align-items: center;

    .ipt {
      width: 100%;
      height: 100%;
    }
  }

  .transfer_dialog_item {
    overflow: auto;
    height: 1.12rem;
    display: flex;
    align-items: center;
    justify-content: start;
    border-bottom: 1px solid #f5f5f5;
    padding: 0 0.32rem;
    gap: 10px;

    .flag_icon {
      width: 32px !important;
      height: 32px !important;
    }

    .cross {
      position: absolute;
      right: 5px;
    }
  }

  .transfer_dialog_item_active {
    color: #014cfa;
    font-weight: 600;
    position: relative;

    .check_icon {
      position: absolute;
      right: 0.64rem;
      color: #014cfa;
      font-size: 0.28rem;
    }
  }
}
</style>
