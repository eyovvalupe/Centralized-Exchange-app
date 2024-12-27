<!-- 注册页 -->
<template>
  <div class="page page-register" v-if="openPage">
    <!-- 图片验证 -->
    <template v-if="step == 1">
      <ImgCheck @success="next" @goBack="goBack" :loadingRegister="loading" />
    </template>

    <template v-else-if="step == 2">
      <!-- 返回和语言 -->
      <div class="top_icon_container">
        <div class="top_back_container text-[0.48rem]" @click="goBack">
          <Icon name="arrow-left" />
        </div>

        <div class="flex flex-row">
          <div class="server_icon" @click="goChat">
            <div class="chat_icon">
              <img :src="getStaticImgUrl('/static/img/user/server.svg')" />
            </div>
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
        <div class="title">
          {{
            guest
              ? t("register.create_guest_account")
              : t("register.create_user_account")
          }}
        </div>
        <div class="login_title">
          {{ $t("register.has_account") }}
          <span class="tologin" @click="router.push({ name: 'login' })">{{
            $t("register.go_login")
          }}</span>
        </div>
      </div>

      <!-- tab -->
      <Tabs type="card" class="tabs" v-model:active="activeTab" animated shrink>
        <Tab :title="t('register.email')"> </Tab>
        <Tab :title="t('register.phone')"></Tab>
      </Tabs>

      <!-- 表单 -->
      <div class="form">
        <!-- <div class="form_title">用户名</div>
        <div class="form_item margin_item" :class="{ 'err_ipt': errorTip.error1 }">
          <input maxlength="20" @blur="errorTip.error1 = false" v-model.trim="form.username" placeholder="您的用户名"
            type="text" class="item_input">
        </div> -->
        <div class="form_title" v-show="activeTab == 0">
          {{ $t("register.email") }}
        </div>
        <div class="form_item margin_item" v-show="activeTab == 0" :class="{ err_ipt: errorTip.error1 }">
          <input maxlength="30" @blur="errorTip.error1 = false" v-model.trim="form.email"
            :placeholder="t('register.pw_placeholder1')" type="text" class="item_input"
            :class="{ err_ipt1: errorTip.error1 }" />
          <div class="form_item_clear" v-show="form.email" @click="form.email = null">
            <img :src="getStaticImgUrl('/static/img/common/close_r.svg')" alt="" />
          </div>
        </div>
        <div class="form_title" v-show="activeTab == 1">
          {{ $t("register.phone_number") }}
        </div>
        <div class="form_item margin_item" v-show="activeTab == 1" :class="{ err_ipt: errorTip.error1 }">
          <div class="code" @click="(showDialog = true), (searchStr = '')">
            <span class="flag_icon">
              <img :src="getStaticImgUrl('/static/img/common/flag_hongkong.svg')" alt="" />
            </span>
            <span>{{ form.area }}</span>
            <div class="more_icon">
              <img :src="getStaticImgUrl('/static/img/assets/more.png')" alt="img" />
            </div>
          </div>
          <input maxlength="20" @blur="errorTip.error1 = false" v-model.trim="form.phone"
            :placeholder="t('register.pw_placeholder2')" type="text" class="item_input" />
        </div>
        <div class="form_title">{{ $t("register.login_password") }}</div>
        <div class="form_item margin_item relative" :class="{ err_ipt: errorTip.error2 }">
          <input maxlength="20" @blur="errorTip.error2 = false" v-model.trim="form.password"
            :placeholder="t('register.pw_placeholder3')" :type="showPass ? 'text' : 'password'" class="item_input" />
          <div class="absolute top-[0.4rem] right-[0.32rem]" @click="showPass = !showPass">
            <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'">
              <img v-if="showPass" :src="getStaticImgUrl('/static/icons/eye_open.svg')" alt="">
              <img v-else :src="getStaticImgUrl('/static/icons/eye_close.svg')" alt="">
            </div>
          </div>
        </div>
        <!-- 密码等级 -->
        <PasswordLevel style="position: relative; top: -0.32rem; left: 0.32rem" :password="form.password" />
        <div class="form_title">{{ $t("register.trade_password") }}</div>
        <div class="form_item margin_item relative" :class="{ err_ipt: errorTip.error3 }">
          <input maxlength="20" @blur="errorTip.error3 = false" v-model.trim="form.safeword"
            :placeholder="t('register.pw_placeholder5')" :type="showPass2 ? 'text' : 'password'" class="item_input" />
          <div class="absolute top-[0.4rem] right-[0.32rem]" @click="showPass2 = !showPass2">
            <div :class="showPass2 ? 'eye-show-icon' : 'eye-hidden-icon'">
              <img v-if="showPass2" :src="getStaticImgUrl('/static/icons/eye_open.svg')" alt="">
              <img v-else :src="getStaticImgUrl('/static/icons/eye_close.svg')" alt="">
            </div>
          </div>
        </div>
        <div class="form_title">{{ $t("register.invite_code") }}</div>
        <div class="form_item margin_item">
          <input maxlength="20" v-model.trim="form.invateCode" :placeholder="t('register.pw_placeholder6')" type="text"
            class="item_input" />
        </div>
      </div>

      <!-- 协议 -->
      <label class="register_doc">
        <div :class="checked ? 'checked_icon_blue' : 'unchecked_icon'" class="mr-[0.2rem]" @click="checked = !checked">
          <img v-if="checked" :src="getStaticImgUrl('/static/icons/checked_white.svg')" alt="">
          <img v-else :src="getStaticImgUrl('/static/icons/uncheck_primary.svg')" alt="">
        </div>
        {{ $t("register.agree_con1")
        }}<span>{{ $t("register.agree_con2") }}</span>{{ $t("register.agree_con3")
        }}<span>{{ $t("register.agree_con4") }}</span>
      </label>

      <!-- 按钮 -->
      <div class="submit_box">
        <Button @click="submit" :loading="loading" round color="#014CFA" class="submit" type="primary">{{
          $t("register.next") }}</Button>
      </div>
    </template>

    <template v-else>
      <RegisterCodeCheck :type="activeTab == 0 ? 'email' : 'phone'" :value="activeTab == 0 ? form.email : form.phone"
        @success="registerSuccessNext" />
    </template>

    <!-- 验证码 -->
    <VerifCode :type="activeTab == 0 ? 'email' : 'phone'" :value="form.username" @submit="submitCode" to="body"
      ref="verifCodeRef" />

    <!-- 区号弹窗 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" v-model:show="showDialog"
      position="bottom" teleport="body">
      <div class="register_accounr_dialog">
        <div class="close-svg-iconB absolute right-0 mr-[0.32rem]" @click="showDialog = false">
          <img :src="getStaticImgUrl('/static/icons/close.svg')" alt="">
        </div>
        <div class="text-center my-[0.36rem] text-[0.32rem] text-color">
          {{ $t("register.country_number") }}
        </div>
        <div class="item search_box">
          <!-- <Icon class="search" name="search" size="0.48rem" /> -->
          <div class="search-svg-icon"></div>
          <input v-model.trim="searchStr" class="ipt" type="text" :placeholder="t('register.pw_placeholder4')" />
          <div v-if="searchStr.length" @click="searchStr = ''" class="close-svg-icon">
            <img :src="getStaticImgUrl('/static/icons/close_a.svg')" alt="">
          </div>
        </div>
        <div ref="scrollRef" style="height: 60vh; overflow-y: auto">
          <List>
            <Cell v-for="item in showAreas">
              <div @click="clickItem(item)"
                class="flex justify-between h-[1.08rem] items-center border-b-[0.02rem] border-b-color"
                :class="{ transfer_dialog_item_active: form.area == item.code }">
                <div class="flex h-[1.08rem] items-center">
                  <div style="width: 0.64rem;height: 0.64rem;">
                    <img :src="getStaticImgUrl('/static/icons/hk.svg')" alt="">
                  </div>
                  <span>{{ item.cn }}</span>
                  <span>({{ item.code }})</span>
                </div>
                <Icon v-if="form.area == item.code" class="cross" name="success" />
              </div>
            </Cell>
          </List>
          <NoData v-if="!showAreas.length" />
        </div>
      </div>
    </Popup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
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
  List,
  Cell,
} from "vant";
import { ref, computed, onMounted, onBeforeMount } from "vue";
import router from "@/router";
import { useRoute, useRouter } from "vue-router";
import PasswordLevel from "@/components/PasswordLevel.vue";
import store from "@/store";
import { _register, _guestRegister } from "@/api/api";
import VerifCode from "@/components/VerifCode.vue";
import ImgCheck from "@/components/ImgCheck.vue";
import { areaCode, validateEmail } from "@/utils/index";
import NoData from "@/components/NoData.vue";
import RegisterCodeCheck from "@/components/RegisterCodeCheck.vue";
import { useI18n } from "vue-i18n";
import { DESKTOP_INVITE_URL, MOBILE_INVITE_URL } from "@/config";

// 区号控制
const step = ref(1);
const { t } = useI18n();
const activeTab = ref(0);
const defaultCode = "+244";
const showDialog = ref(false);
const searchStr = ref("");
const scrollRef = ref(null);
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

const next = () => {
  if (loading.value) return;
  loading.value = true;
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  if (guest.value == "guest") {
    _guestRegister({
      verifcode: verifcode.value,
      token: sessionToken.value,
    })
      .then((res) => {
        if (res.code == 200) {
          console.log(res.data);
          setTimeout(() => {
            store.dispatch("reset");
            setTimeout(() => {
              store.commit("setToken", res.data.auth);
              store.commit("setUserInfo", res.data);
            }, 100);
            setTimeout(() => {
              // store.dispatch("updateUserInfo");
              store.dispatch("updateAssets");
              store.dispatch("updateWallet");
              registerSuccessNext();
            }, 300);
          }, 1000);
        } else showToast(res.message);
      })
      .catch((err) => {
        if (err.code == "1001") {
          setTimeout(() => {
            verifCodeRef.value.open();
          }, 1000);
        }
      })
      .finally(() => {
        getSessionToken();
        setTimeout(() => {
          verifcode.value = "";
          loading.value = false;
          closeToast();
        }, 1500);
      });
  } else {
    step.value = 2;
    loading.value = false;
    closeToast();
  }
};

const submit = async () => {
  if (!checked.value) return showToast(t("register.no_agree_error"));
  if (activeTab.value == 0) {
    if (!form.value.email || !validateEmail(form.value.email)) {
      errorTip.value.error1 = true;
      showToast(t("register.no_email_error"));
      return;
    }
    form.value.username = form.value.email;
  }
  if (activeTab.value == 1) {
    if (!form.value.phone) {
      errorTip.value.error1 = true;
      showToast(t("register.no_phone_error"));
      return;
    }
    form.value.username = form.value.area + form.value.phone;
  }
  if (!form.value.password) {
    errorTip.value.error2 = true;
    return showToast(t("register.no_login_pw_error"));
  }
  if (form.value.password.length < 8) {
    errorTip.value.error2 = true;
    return showToast(t("register.login_pw_length_error"));
  }
  if (!form.value.safeword) {
    errorTip.value.error3 = true;
    return showToast(t("register.no_trade_pw_error"));
  }
  sessionStorage.setItem("registerForm", JSON.stringify(form.value));
  if (!sessionToken.value) {
    const rs = await store.dispatch("updateSessionToken");
    if (!rs) return showToast(t("register.network_error"));
  }
  if (loading.value) return;
  loading.value = true;
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  console.log({
    ...form.value,
    token: sessionToken.value,
    verifcode: verifcode.value,
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
        }, 1000);
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
      } else if (err.code == "400") {
        if (err.message == "User already exist")
          showToast(t("register.user_already_exist"));
      } else {
        showToast(err.message || t("login.network_error"));
      }
    })
    .finally(() => {
      getSessionToken();
      setTimeout(() => {
        verifcode.value = "";
        loading.value = false;
        closeToast();
      }, 1500);
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
  if (guest.value == "guest") next();
  else submit();
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

const scrollCountryCode = () => {
  scrollRef.value.scrollTop = scrollRef.value.scrollTop + 100;
};

const openPage = ref(false)

onMounted(() => {
  if (Object.keys(route.query).length && route.query.invitCode) {
    form.value.invateCode = route.query.invitCode;
    setTimeout(() => {
      openPage.value = true;
      next();
    }, 500);
  }
  else if (Object.keys(route.query).length && route.query.guest) {
    step.value = 1;
    openPage.value = true
  } else if (Object.keys(route.query).length && !route.query.invitCode) {
    router.replace({ name: 'home' })
    setTimeout(() => {
      openPage.value = true;
    }, 500);
  } else openPage.value = true;
});
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
      border-bottom: 0.04rem solid #d0d8e2;
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
      border-bottom: 0.06rem solid #014cfa;
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
        font-size: 0.3rem;
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
      margin-bottom: 0.45rem;
    }

    .err_ipt {
      border: 1px solid #e8503a;

      .err_ipt1 {
        color: #e8503a;
      }
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

    >span {
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

    >span {
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
  padding: 0.28rem 0.32rem 0.8rem 0.32rem;
  position: relative;

  :deep(.search-svg-icon) {
    width: 0.48rem;
    height: 0.48rem;
    margin-right: 0.12rem;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .close_icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0.24rem;
    right: 0.32rem;
  }

  .search_box {
    height: 0.84rem;
    border: 0.02rem solid #d0d8e2;
    border-radius: 0.32rem;
    padding-inline: 0.32rem;
    margin-bottom: 0.2rem;
    display: flex;
    align-items: center;

    .ipt {
      width: 100%;
      height: 100%;
    }
  }

  .transfer_dialog_item {
    overflow: auto;
    font-size: 0.3rem;
    line-height: 0.42rem;
    height: 1.12rem;
    display: flex;
    align-items: center;
    justify-content: start;
    border-bottom: 1px solid #f5f5f5;
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
      right: 0;
      color: #014cfa;
      font-size: 0.28rem;
    }
  }

  .close-svg-icon {
    margin-left: 0.12rem;
    width: 0.24rem;
    height: 0.24rem;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .close-svg-iconB {
    width: 0.42rem;
    height: 0.4rem;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
