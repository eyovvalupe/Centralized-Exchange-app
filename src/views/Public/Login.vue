<!-- 登录页 -->
<template>
  <div class="page page-login max-width">
    <!-- 返回和语言 -->
    <div class="top_icon_container">
      <div class="top_back_container text-[0.48rem]" @click="goBack">
        <Icon name="arrow-left" />
      </div>

      <div class="language_icon_container" @click="goLang">
        <div class="language_icon">
          <img :src="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
        </div>
      </div>
    </div>

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
      <div class="form_title" v-show="activeTab == 0">{{ $t("login.email") }}</div>
      <div class="form_item margin_item" v-show="activeTab == 0">
        <div class="form_item_user" v-show="form.email">
          <div class="envelope-icon">
            <img :src="getStaticImgUrl('/static/img/user/envelope.svg')" alt="">
          </div>
        </div>
        <input @change="changeAccount" v-model.trim="form.email" :placeholder="t('login.pw_placeholder1')" type="text"
          class="item_input" />
        <Loading v-if="accountLoading" :size="'0.32rem'" type="spinner" />
        <div class="form_item_clear" v-show="form.email" @click="form.email = null">
          <div class="cross-icon">
            <img :src="getStaticImgUrl('/static/img/common/mini_close.svg')" alt="">
          </div>
        </div>
      </div>

      <div class="form_title" v-show="activeTab == 1">{{ $t("login.phone_number") }}</div>
      <div class="form_item margin_item" v-show="activeTab == 1">
        <div class="code" @click="
          showDialog = true;
        searchStr = '';
        ">
          <span class="flag_icon">
            <img :src="getStaticImgUrl('/static/img/user/flag_hongkong.svg')" alt="" />
          </span>
          <span>{{ form.area }}</span>
          <div class="more-svg-icon">
            <img :src="getStaticImgUrl('/static/img/common/more.svg')" alt="" />
          </div>
        </div>
        <input maxlength="20" v-model.trim="form.phone" type="text" :placeholder="t('login.pw_placeholder2')"
          class="item_input" />
      </div>
      <div class="form_title">{{ $t("login.password") }}</div>
      <div class="form_item">
        <!-- 显示密码输入时的锁图标 -->
        <div class="form_item_user" v-if="form.password">
          <div class="lock-icon">
            <img :src="getStaticImgUrl('/static/img/user/lock.svg')" alt="">
          </div>
        </div>

        <!-- 密码输入框，使用 v-if/v-else 优化 -->
        <input maxlength="20" :type="showPass ? 'text' : 'password'" v-model.trim="form.password"
          :placeholder="t('login.pw_placeholder3')" class="item_input" />

        <!-- 切换显示/隐藏密码的图标 -->
        <div class="form_item_icon" @click="showPass = !showPass">
          <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'">
            <img v-if="showPass" :src="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="">
            <img v-else :src="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="">
          </div>
        </div>
      </div>
    </div>

    <!-- 忘记密码 -->
    <div class="fogot" @click="goFoget">{{ $t("login.forget_pw") }}</div>

    <!-- 按钮 -->
    <div class="submit_box" @click="submit">
      <Button :loading="loading" :disabled="disabled" round class="submit" type="primary">
        <span style="color: var(--ex-black);">{{
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
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" v-model:show="showDialog"
      position="bottom" teleport="body">
      <div class="register_accounr_dialog">
        <div class="close-svg-iconB absolute right-0 mr-[0.32rem]" @click="showDialog = false">
          <img :src="getStaticImgUrl('/static/img/common/close.svg')" alt="">
        </div>
        <div class="text-center my-[0.36rem] text-[0.32rem] text-color">
          {{ $t("login.country_number") }}
        </div>
        <div class="item search_box">
          <div class="search-svg-icon">
            <!-- <img :src="getStaticImgUrl('/static/img/user/search.svg')" alt=""> -->
          </div>
          <input v-model.trim="searchStr" class="ipt" type="text" :placeholder="t('login.pw_placeholder4')" />
          <div v-if="searchStr.length" @click="searchStr = ''" class="close-svg-icon">
            <img :src="getStaticImgUrl('/static/img/common/close.svg')" alt="">
          </div>
        </div>
        <div style="height: 60vh; overflow-y: auto">
          <!-- <List> -->
          <div v-for="item in showAreas">
            <div @click="clickItem(item)"
              class="flex justify-between h-[1.06rem] items-center border-b-[0.02rem] border-b-color"
              :class="{ transfer_dialog_item_active: form.area == item.code }">
              <div class="flex h-[1.08rem] items-center">
                <div style="width: 0.64rem;height: 0.64rem;" class="mr-[0.2rem]">
                  <img :src="getStaticImgUrl('/static/img/user/hk.svg')" alt="">
                </div>
                <span>{{ item.cn }}</span>
                <span>({{ item.code }})</span>
              </div>
              <Icon v-if="form.area == item.code" class="cross" name="success" />
            </div>
          </div>
          <!-- </List> -->
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
  Loading,
  Popup,
  Tabs,
  Tab,
  List,
  Cell,
} from "vant";
import { ref, computed, onMounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { _login, _userExist, _watchlist } from "@/api/api";
import VerifCode from "@/components/VerifCode.vue";
import store from "@/store";
import { areaCode, validateEmail } from "@/utils/index";
import NoData from "@/components/NoData.vue";
import { useI18n } from "vue-i18n";

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

// 提交
const submit = () => {
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
        store.dispatch("reset");

        // setTimeout(() => {
        store.commit("setToken", res.data.auth);
        store.commit("setUserInfo", res.data);

        // }, 100)

        setTimeout(() => {
          store.dispatch("updateUserInfo");
          store.dispatch("updateAssets");
          store.dispatch("updateWallet");

          if (props.successFunc) return props.successFunc();
          if (route.query.reurl) {
            router.replace({
              name: route.query.reurl,
              query: {
                redata: route.query.redata,
              },
            });
          } else {
            router.push({
              name: "user",
            });
          }
        }, 300);
        _watchlist()
          .then((res) => {
            if (res.code == 200) {
              store.commit("setMarketWatchList", res.data || []);

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
        if (form.value.verifcode) {
          // 如果输入了验证码，旧提示验证码错误
          showToast(err.message);
        }
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

onMounted(() => {
  Promise.all([
    import("@/views/Public/Register.vue"),
    import("@/views/Public/Fogot.vue"),
  ]);
});
</script>

<style lang="less" scoped>
.page-login {
  padding-top: 1rem;
  margin: auto;

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
      width: 0.72rem;
      height: 0.72rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-width: 0.02rem;
      border-color: var(--ex-border-color);
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
    margin-bottom: 0.8rem;
    z-index: 1;

    :deep(.van-tab__panel) {
      // height: calc(var(--app-height) - 3.4rem);
      // overflow-y: auto;
    }

    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: var(--ex-text-color2);
      border-bottom: 0.04rem solid var(--ex-border-color2);
      // background-color: var(--ex-bg-color2);
      // border-radius: 0.3rem;
      // margin-left: 0.1rem;
      // transition: all ease .2s;
    }

    :deep(.van-tab--card.van-tab--active) {
      background-color: var(--ex-bg-color);
      color: var(--ex-primary-color);
      font-family: "PingFang SC";
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-bottom: 0.06rem solid var(--ex-primary-color);
      border-radius: 0.03rem;
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
      line-height: 0.6rem;
      font-size: 0.28rem;
      width: 50%;
      padding-bottom: 0.29rem;
    }
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
    padding: 0.3rem 0.32rem 0.8rem 0.32rem;

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
      border: 0.02rem solid var(--ex-border-color2);
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;

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
    color: var(--ex-primary-color);
    font-weight: 400;
    padding-left: 0.44rem;
    margin: 0.2rem 0 1.2rem 0;
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
  background-color: var(--ex-bg-color);
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  overflow: hidden;
  padding: 0.28rem 0.32rem 0.8rem 0.32rem;
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
    border: 0.02rem solid var(--ex-border-color2);
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
  width: 0.24rem;
  height: 0.24rem;
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
