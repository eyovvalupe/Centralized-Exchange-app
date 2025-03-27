<!-- 登录页 -->
<template>
  <div class="page page-login max-width">
    <!-- 返回和语言 -->
    <Top :backFunc="goBack">
      <template #right>
        <div class="language_icon_container" @click="goLang">
          <img v-lazy="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
        </div>
      </template>
    </Top>

    <!-- 标题 -->
    <div class="title_box">
      <div class="title">{{ $t("login.login") }}</div>
    </div>

    <!-- tab -->
    <Tabs type="card" class="tabs" v-model:active="activeTab" animated shrink>
      <Tab :title="t('login.email')"></Tab>
      <Tab :title="t('login.phone')"></Tab>
    </Tabs>

    <!-- 表单 -->
    <div class="form">
      <!-- <div class="form_title" v-show="activeTab == 0">{{ $t("login.email") }}</div> -->
      <div class="form_item margin_item transition" :style="{ borderColor: emailError ? 'var(--ex-error-color)' : '' }"
        v-show="activeTab == 0">
        <div class="form_item_user">
          <div class="envelope-icon">
            <img v-lazy="getStaticImgUrl('/static/img/user/envelope.svg')" alt="">
          </div>
        </div>
        <input @change="changeAccount" v-model.trim="form.email" :placeholder="t('login.pw_placeholder1')" type="text"
          class="item_input" @focus="emailError = false" />
        <Loading v-if="accountLoading" :size="'0.32rem'" type="circular" />
        <div class="form_item_clear" v-show="form.email" @click="form.email = null">
          <div class="cross-icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/mini_close.svg')" alt="">
          </div>
        </div>
      </div>

      <!-- <div class="form_title" v-show="activeTab == 1">{{ $t("login.phone_number") }}</div> -->
      <div class="form_item margin_item transition" :style="{ borderColor: phoneError ? 'var(--ex-error-color)' : '' }"
        v-show="activeTab == 1">
        <div class="code" @click="
          showDialog = true;
        searchStr = '';
        ">
          <span class="flag_icon">
            <img v-lazy="getStaticImgUrl('/static/img/user/flag_hongkong.svg')" alt="" />
          </span>
          <span>{{ form.area }}</span>
          <div class="more-svg-icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="" />
          </div>
        </div>
        <input maxlength="20" v-model.trim="form.phone" type="text" :placeholder="t('login.pw_placeholder2')"
          class="item_input" @focus="phoneError = false" />
      </div>
      <!-- <div class="form_title">{{ $t("login.password") }}</div> -->
      <div class="form_item transition" :style="{ borderColor: pwError ? 'var(--ex-error-color)' : '' }">
        <!-- 显示密码输入时的锁图标 -->
        <div class="form_item_user">
          <div class="lock-icon">
            <img v-lazy="getStaticImgUrl('/static/img/user/lock.svg')" alt="">
          </div>
        </div>

        <!-- 密码输入框，使用 v-if/v-else 优化 -->
        <input maxlength="20" :type="showPass ? 'text' : 'password'" v-model.trim="form.password"
          :placeholder="t('login.pw_placeholder3')" class="item_input" @focus="pwError = false" />

        <!-- 切换显示/隐藏密码的图标 -->
        <div class="form_item_icon" @click="showPass = !showPass">
          <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'">
            <img v-if="showPass" v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="">
            <img v-else v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="">
          </div>
        </div>
      </div>
    </div>

    <!-- 忘记密码 -->
    <div class="fogot" @click="goFoget">{{ $t("login.forget_pw") }}</div>

    <!-- 按钮 -->
    <div class="submit_box " @click="submit">
      <Button :loading="loading" round class="submit ripple-btn" type="primary">
        <span style="color: var(--ex-white);">{{
          $t("login.login") }}</span></Button>
    </div>

    <!-- 去注册 -->
    <div class="go_register" @click="goRegister">
      {{ $t("login.no_account_con1") }}
      <span>{{ $t("login.no_account_con2") }}</span>
    </div>

    <!-- 验证码 -->
    <VerifCode @submit="submitCode" to="body" ref="verifCodeRef" />

    <!-- 区号弹窗 -->
    <BottomPopup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
      v-model:show="showDialog" position="bottom" teleport="body" closeable>
      <div class="register_accounr_dialog">
        <div class="text-center mb-[0.6rem] mt-[0.06rem] text-[0.32rem] text-color">
          {{ $t("login.country_number") }}
        </div>
        <div class="item search_box">
          <div class="search-svg-icon">
            <!-- <img v-lazy="getStaticImgUrl('/static/img/user/search.svg')" alt=""> -->
          </div>
          <input v-model.trim="searchStr" class="ipt" type="text" :placeholder="t('login.pw_placeholder4')" />
          <div v-if="searchStr.length" @click="searchStr = ''" class="close-svg-icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/close.svg')" alt="">
          </div>
        </div>
        <div style="height: calc(var(--vh) * 60); overflow-y: auto; padding: 0 0.24rem;">
          <!-- <List> -->
          <div v-for="item in showAreas">
            <div @click="clickItem(item)"
              class="flex justify-between h-[1.06rem] items-center border-b-[0.02rem]" style="border-color:var(--ex-bg-white2);"
              :class="{ transfer_dialog_item_active: form.area == item.code }">
              <div class="flex pt-[0.3rem] pb-[0.2rem] items-center">
                <div style="width: 0.64rem;height: 0.64rem;" class="mr-[0.2rem]">
                  <img v-lazy="getStaticImgUrl('/static/img/user/hk.svg')" alt="">
                </div>
                <span>{{ item.cn }}&nbsp;</span>
                <span>{{ item.code }}</span>
              </div>
              <Icon v-if="form.area == item.code" class="cross" name="success" />
            </div>
          </div>
          <!-- </List> -->
          <NoData v-if="!showAreas.length" />
        </div>
      </div>
    </BottomPopup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import {
  Icon,
  Button,
  showToast,
  Loading,
  Popup,
  Tabs,
  Tab,
  List,
  Cell,
} from "vant";
import { ref, computed, onMounted, watch } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { _login, _userExist, _watchlist } from "@/api/api";
import VerifCode from "@/components/VerifCode.vue";
import store from "@/store";
import { areaCode, validateEmail } from "@/utils/index";
import NoData from "@/components/NoData.vue";
import { useI18n } from "vue-i18n";
import Top from "@/components/Top.vue";
import BottomPopup from "@/components/BottomPopup.vue";

const { t } = useI18n();

const emits = defineEmits(["closeDialog"]);
const props = defineProps({
  backFunc: {
    type: Function,
    default: null,
  },
  successFunc: {
    type: Function,
    default: null,
  },
});

// 区号控制
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
const goLang = () => {
  emits("closeDialog");
  router.push({ name: "language" });
};

// 进入页面则重置登录状态信息
store.dispatch("reset");
// store.commit('clearChooseSymbol')

const saveAccount = ref(localStorage.getItem("saveAccount") || "");
const accountLoading = ref(false);
const changeAccount = () => {
  accountLoading.value = true;
  if (form.value.email) {
    // 去检测
    _userExist({
      username: form.value.email,
    })
      .then((res) => {
        if (res.code == 200 && res.data?.exist == 1) {
          saveAccount.value = form.value.email;
          localStorage.setItem("saveAccount", saveAccount.value);
        } else {
          showToast(t('login.no_account_warning'));
        }
      })
      .finally(() => {
        accountLoading.value = false;
      });
  }
};

const route = useRoute();
const verifCodeRef = ref();

const showPass = ref(false); // 密码显示
const form = ref({
  // 表单
  area: localStorage.getItem("area") || defaultCode,
  email: saveAccount.value,
  phone: localStorage.getItem("phone") || "",
  username: saveAccount.value,
  password: "",
  verifcode: "",
});

const loading = ref(false); // 加载
const disabled = computed(() => {
  // 提交按钮禁用
  return !form.value.password;
});

const emailError = ref(false);
const phoneError = ref(false);
const pwError = ref(false);

// 提交
const submit = () => {
  console.log(activeTab.value == 0 && !form.value.email || activeTab.value == 1 && !form.value.phone || !form.value.password)

  if (activeTab.value == 0 && !form.value.email || activeTab.value == 1 && !form.value.phone || !form.value.password) {
    if (activeTab.value == 0 && !form.value.email) emailError.value = true;
    if (activeTab.value == 1 && !form.value.phone) phoneError.value = true;
    if (!form.value.password) pwError.value = true;
    console.log('error')
    return;
  }
  if (loading.value) return;
  loading.value = true;
  if (activeTab.value == 0) {
    form.value.username = form.value.email;
  }
  if (activeTab.value == 1) {
    localStorage.setItem("area", form.value.area);
    localStorage.setItem("phone", form.value.phone);
    form.value.username = form.value.area + form.value.phone;
  }
  if (!form.value.username) return;
  _login(form.value)
    .then((res) => {
      if (res && res.code == 200) {
        // store.dispatch("reset");

        // setTimeout(() => {
        store.commit("setToken", res.data.auth);
        store.commit("setUserInfo", res.data);

        // }, 100)

        setTimeout(() => {
          store.dispatch("updateUserInfo");
          store.dispatch("updateAssets");
          store.dispatch("updateWallet");
          store.dispatch('updateStockWallet');

          if (props.successFunc) return props.successFunc();
          // if (route.query.reurl) {
          //   router.replace({
          //     name: route.query.reurl,
          //     query: {
          //       redata: route.query.redata,
          //     },
          //   });
          // } else {
          // router.push({
          //   name: "home",
          // });
          // }
        }, 300);
        router.push({
          name: "home",
        });
        _watchlist()
          .then((res) => {
            if (res.code == 200) {
              store.commit("setMarketWatchList", res.data || []);
              console.error('-------', 15)
              store.dispatch("subList", {
                commitKey: "setMarketWatchList",
                listKey: "marketWatchList",
              });
            }
          })
          .finally(() => {
            emits("closeDialog");
            showToast(t('login.login_success'));
          });
      } else {
        return showToast(res.message || t('login.login_failed'));
      }
    })
    .catch((err) => {
      if (err.code == "1001") {
        // 弹出验证码
        showToast(t("register.verify_code_msg"));
        setTimeout(() => {
          verifCodeRef.value.open();
        }, 1000);
      } else {
        showToast(err.message || t('login.network_error'));
      }
    })
    .finally(() => {
      setTimeout(() => {
        form.value.verifcode = "";
        loading.value = false;
      }, 1000);
    });
};

// 通过验证码提交
const submitCode = (code) => {
  form.value.verifcode = code;
  submit();
};

// 返回
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
// 忘记密码
const goFoget = () => {
  emits("closeDialog");
  router.push({ name: "fogot" });
};

// 跳转注册
const goRegister = () => {
  emits("closeDialog");
  router.push({
    name: "register",
    query: {
      reurl: route.query.reurl,
      redata: route.query.redata,
    },
  });
};

const cleanError = () => {
  emailError.value = false;
  phoneError.value = false;
  pwError.value = false;
}

watch(activeTab, (val) => {
  cleanError();
})

onMounted(() => {
  Promise.all([
    import("@/views/Public/Register.vue"),
    import("@/views/Public/Fogot.vue"),
  ]);
});
</script>

<style lang="less" scoped>
.page-login {
  padding-top: 1.12rem;
  margin: auto;

  :deep(span.van-tab__text) {
    font-size: 0.32rem;
  }

  :deep(.van-tab--card.van-tab--active) {
    span {
      font-size: 0.36rem;
    }
  }

  .self_van_popup {
    :deep(.van-cell) {
      padding: 0;
    }
  }

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
        width: 0.4rem;
        height: 0.4rem;
        clip-path: path("M13.4 2L5 10.4L13.4 18.8");
        background-color: var(--ex-text-color);
      }
    }

    .language_icon_container {
      width: 0.8rem;
      height: 0.8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--ex-bg-color5);

    }
  }

  .tabs {
    overflow: hidden;
    margin-bottom: 0.6rem;
    z-index: 1;

    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: var(--ex-text-color2);
      border-bottom: 0.04rem solid var(--ex-border-color2);
    }

    :deep(.van-tab--card.van-tab--active) {
      background-color: var(--ex-bg-color);
      color: var(--ex-primary-color);
      font-family: "PingFang SC";
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-bottom: 0.08rem solid var(--ex-primary-color);
      border-radius: 0.03rem;
    }

    :deep(.van-tab--shrink) {
      padding: 0 0.3rem;
    }

    :deep(.van-tabs__wrap) {
      height: 0.8rem;
      border-bottom: 0.02rem solid rgba(0, 0, 0, 0);
      // padding-bottom: 0.2rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 0.8rem;
      display: flex;
    }

    :deep(.van-tab) {
      line-height: 0.6rem;
      font-size: 0.28rem;
      width: 50%;
      // padding-bottom: 0.29rem;
    }
  }

  :deep(.van-tabs__nav.van-tabs__nav--card.van-tabs__nav--shrink.van-tabs__nav--complete) {
    margin: 0 0.32rem;
  }

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
    background-color: var(--ex-bg-color);

    .top_back {
      color: var(--ex-text-color);
      font-size: 0.4rem;
      width: 0.8rem;
      height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .top_lang {
      width: 0.72rem;
      height: 0.72rem;
      border-radius: 50%;
      border-color: var(--ex-border-color);
      border-width: 0.02rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .title_box {
    padding: 0.8rem 0.32rem;

    .title {
      // height: 0.78rem;
      display: flex;
      align-items: center;
      color: var(--ex-text-color);
      text-align: center;
      font-family: "PingFang SC";
      font-size: 0.56rem;
      font-style: normal;
      font-weight: 600;
      line-height: 140%;
    }
  }

  .form {
    padding: 0 0.32rem;

    .form_title {
      color: var(--ex-text-color);
      line-height: 0.42rem;
      font-weight: 400;
      margin-bottom: 0.12rem;
    }

    .form_item {
      display: flex;
      align-items: center;
      border: 0.02rem solid var(--ex-bg-color);
      background-color: var(--ex-bg-color6);
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.2rem;

      .code {
        color: var(--ex-text-color);
        display: flex;
        align-items: center;
        margin-right: 0.12rem;
        gap: 0.1rem;

        .flag_icon {
          width: 0.64rem;
          height: 0.64rem;
        }
      }

      .item_input {
        flex: 1;
        color: var(--ex-text-color);
        font-weight: 400;
        font-size: 0.3rem;
      }

      &:has(.item_input:focus) {
        border: 0.02rem solid var(--ex-primary-color);
      }

      .form_item_user {
        justify-content: center;
        color: var(--ex-primary-color);
        margin-right: 0.12rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.64rem;
        height: 0.64rem;
        background-color: var(--ex-bg-color6);
        border-radius: 50%;

        .van-icon {
          width: 0.36rem !important;
        }
      }

      .form_item_clear {
        justify-content: center;
        color: var(--ex-text-color);
        margin-left: 0.12rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.37rem;
        height: 0.37rem;
        padding: 0.02rem;
        border-radius: 50%;

        .van-icon {
          font-size: 0.24rem;
        }
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
    color: var(--ex-text-color);
    font-weight: 400;
    margin: 0.32rem 0 0.8rem 0.32rem;
  }

  .submit_box {
    display: flex;
    width: 100%;
    height: 1.1rem;
    padding-inline: 0.32rem;
    justify-content: center;
    align-items: center;

    .submit {
      width: 100%;
      height: 1.12rem;
      color: var(--ex-text-color--bg-primary);
      text-align: center;
      font-family: "PingFang SC";
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 500;
      line-height: 100%;
      border-radius: 0.6rem;
      /* 18px */
    }
  }

  .go_register {
    margin: 0.6rem 0 0.4rem 0;
    text-align: center;
    font-weight: 400;
    color: var(--ex-text-color2);

    >span {
      color: var(--ex-primary-color);
      font-weight: 600;
    }
  }
}
</style>

<style lang="less" scoped>
.register_accounr_dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 0.32rem 0.8rem 0.32rem;
  position: relative;

  .close_icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0.24rem;
    right: 0.32rem;
  }

  .search_box {
    height: 0.9rem;
    background-color: var(--ex-bg-white1);
    border-radius: 1rem;
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
    height: 1.12rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    border-bottom: 0.02rem solid var(--ex-border-color);
    gap: 0.2rem;

    .flag_icon {
      width: 0.64rem !important;
      height: 0.64rem !important;
    }

    .cross {
      position: absolute;
      right: 0.1rem;
    }
  }

  .transfer_dialog_item_active {
    color: var(--ex-primary-color);
    font-weight: 600;
    position: relative;

    .check_icon {
      position: absolute;
      right: 0;
      color: var(--ex-primary-color);
      font-size: 0.28rem;
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

.envelope-icon {
  width: 0.64rem;
  height: 0.64rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.lock-icon {
  width: 0.64rem;
  height: 0.64rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.cross-icon {
  width: 0.32rem;
  height: 0.32rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.more-svg-icon {
  width: 0.32rem;
  height: 0.32rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.search-svg-icon {
  width: 0.48rem;
  height: 0.48rem;
  margin-right: 0.12rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.close-svg-icon {
  width: 0.32rem;
  height: 0.32rem;
  margin-left: 0.12rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.close-svg-iconB {
  width: 0.42rem;
  height: 0.4rem;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
