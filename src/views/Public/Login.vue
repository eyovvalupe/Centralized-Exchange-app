<!-- 登录页 -->
<template>
  <div class="page page-login max-width">
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
      <div class="title">登录</div>
    </div>

    <!-- tab -->
    <Tabs type="card" class="tabs" v-model:active="activeTab" animated shrink>
      <Tab :title="'邮箱'"></Tab>
      <Tab :title="'手机'"></Tab>
    </Tabs>

    <!-- 表单 -->
    <div class="form">
      <div class="form_title" v-show="activeTab == 0">邮箱</div>
      <div class="form_item margin_item" v-show="activeTab == 0">
        <!-- <div class="form_item_user" v-show="saveAccount && saveAccount == form.email"> -->
        <div class="form_item_user" v-show="form.email">
          <div class="envelope-icon"></div>
        </div>
        <input
          @change="changeAccount"
          v-model.trim="form.email"
          placeholder="您的邮箱"
          type="text"
          class="item_input"
        />
        <Loading v-if="accountLoading" :size="'0.32rem'" type="spinner" />
        <!-- <div class="form_item_clear" v-show="saveAccount && saveAccount == form.email"> -->
        <div
          class="form_item_clear"
          v-show="form.email"
          @click="form.email = null"
        >
          <div class="cross-icon"></div>
        </div>
      </div>

      <div class="form_title" v-show="activeTab == 1">手机号</div>
      <div class="form_item margin_item" v-show="activeTab == 1">
        <div class="code" @click="showDialog = true">
          <span class="flag_icon">
            <img src="/static/img/common/flag_hongkong.svg" alt="" />
          </span>
          <span>{{ form.area }}</span>
             <div class="more-svg-icon" ></div>
        </div>
        <input
          maxlength="20"
          v-model.trim="form.phone"
          placeholder="您的手机号"
          type="text"
          class="item_input"
        />
      </div>
      <div class="form_title">密码</div>
      <div class="form_item">
        <!-- 显示密码输入时的锁图标 -->
        <div class="form_item_user" v-if="form.password">
          <div class="lock-icon"></div>
        </div>

        <!-- 密码输入框，使用 v-if/v-else 优化 -->
        <input
          maxlength="20"
          :type="showPass ? 'text' : 'password'"
          v-model.trim="form.password"
          placeholder="请输入您的密码"
          class="item_input"
        />

        <!-- 切换显示/隐藏密码的图标 -->
        <div class="form_item_icon" @click="showPass = !showPass">
          <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'"></div>
        </div>
      </div>
    </div>

    <!-- 忘记密码 -->
    <div class="fogot" @click="goFoget">忘记密码？</div>

    <!-- 按钮 -->
    <div class="submit_box" @click="submit">
      <Button
        :loading="loading"
        :disabled="disabled"
        round
        color="#014CFA"
        class="submit"
        type="primary"
        >登录</Button
      >
    </div>

    <!-- 去注册 -->
    <div class="go_register" @click="goRegister">
      没有账号吗？
      <span>去注册</span>
    </div>

    <!-- 验证码 -->
    <VerifCode @submit="submitCode" to="body" ref="verifCodeRef" />

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
          <!-- <Icon class="search" name="search" size="0.48rem" /> -->
           <div class="search-svg-icon"></div>
          <input
            v-model.trim="searchStr"
            class="ipt"
            type="text"
            placeholder="输入区号"
          />
          <div v-if="searchStr.length" @click="searchStr = ''" class="close-svg-icon"></div>
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
            <Icon v-if="form.area == item.code" class="cross" name="success" />
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
  Loading,
  Popup,
  Tabs,
  Tab,
  Calendar,
} from "vant";
import { ref, computed, onMounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { _login, _userExist, _watchlist } from "@/api/api";
import VerifCode from "@/components/VerifCode.vue";
import store from "@/store";
import { areaCode, validateEmail } from "@/utils/index";
import NoData from "@/components/NoData.vue";
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
          showToast("账号不存在");
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
            showToast("登录成功");
          });
      } else {
        return showToast(res.message || "登录异常");
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
        showToast(err.message || "网络异常");
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
      color: #666d80;
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
    background-color: #fff;

    .top_back {
      color: #161616;
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
      border-color: #edf2f7;
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
      color: #061023;
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
      color: #000;
      line-height: 0.42rem;
      font-weight: 400;
      margin-bottom: 0.12rem;
    }

    .form_item {
      display: flex;
      align-items: center;
      border: 0.02rem solid #d0d8e2;
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;

      .code {
        color: #061023;
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
        color: #061023;
        font-weight: 400;
        font-size: 0.3rem;
      }

      &:has(.item_input:focus) {
        border: 0.02rem solid #014cfa;
      }

      .form_item_user {
        justify-content: center;
        color: #014cfa;
        margin-right: 0.12rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.64rem;
        height: 0.64rem;
        background-color: #cdd4e3;
        border-radius: 50%;

        .van-icon {
          width: 0.36rem !important;
        }
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
    color: #014cfa;
    font-weight: 400;
    padding-left: 0.44rem;
    margin: 0.2rem 0 1.2rem 0;
  }

  .submit_box {
    display: flex;
    width: 100%;
    height: 1.1rem;
    padding: 0.16rem;
    justify-content: center;
    align-items: center;

    .submit {
      width: 100%;
      height: 1.12rem;
      color: #fff;
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

    > span {
      color: #1a59f6;
      font-weight: 600;
    }
  }
}
</style>

<style lang="less" scoped>
.register_accounr_dialog {
  width: 100%;
  height: 100%;
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
    border: 0.02rem solid #d0d8e2;
    border-radius: 0.32rem;
    padding-inline: 0.32rem;
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
    border-bottom: 0.02rem solid #f5f5f5;
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
.envelope-icon {
  width: 0.64rem;
  height: 0.64rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23CDD4E3"/><path d="M9.21042 9.21094H23.7559C24.2022 9.21094 24.564 9.57273 24.564 10.019V22.9483C24.564 23.3946 24.2022 23.7564 23.7559 23.7564H9.21042C8.76414 23.7564 8.40234 23.3946 8.40234 22.9483V10.019C8.40234 9.57273 8.76414 9.21094 9.21042 9.21094ZM22.9478 12.6355L16.5412 18.373L10.0185 12.6178V22.1402H22.9478V12.6355ZM10.4318 10.8271L16.5332 16.2105L22.5446 10.8271H10.4318Z" fill="%23014CFA"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.lock-icon {
  width: 0.64rem;
  height: 0.64rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23CDD4E3"/><path d="M22.1402 14.867H22.9483C23.3946 14.867 23.7564 15.2288 23.7564 15.6751V23.7559C23.7564 24.2022 23.3946 24.564 22.9483 24.564H10.019C9.57273 24.564 9.21094 24.2022 9.21094 23.7559V15.6751C9.21094 15.2288 9.57273 14.867 10.019 14.867H10.8271V14.0589C10.8271 10.9349 13.3596 8.40234 16.4837 8.40234C19.6077 8.40234 22.1402 10.9349 22.1402 14.0589V14.867ZM10.8271 16.4832V22.9478H22.1402V16.4832H10.8271ZM15.6756 18.0993H17.2917V21.3316H15.6756V18.0993ZM20.5241 14.867V14.0589C20.5241 11.8275 18.7151 10.0185 16.4837 10.0185C14.2522 10.0185 12.4433 11.8275 12.4433 14.0589V14.867H20.5241Z" fill="%23014CFA"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.cross-icon {
  width: 0.32rem;
  height: 0.32rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="%23A4ACB9"/><path d="M7.99997 7.46422L5.52417 4.98598L5.52441 4.98574L5.51759 4.97987C5.4456 4.91786 5.35287 4.88531 5.25791 4.88875C5.16296 4.89219 5.07282 4.93138 5.00551 4.99844C4.93821 5.06549 4.89868 5.15548 4.89479 5.25041C4.8909 5.34534 4.92295 5.43826 4.98454 5.5106L4.98427 5.51083L4.99084 5.51744L7.46704 8.00603L4.99153 10.4757C4.99146 10.4758 4.99139 10.4758 4.99131 10.4759C4.95608 10.5108 4.9281 10.5523 4.909 10.5981C4.88986 10.644 4.88 10.6932 4.88 10.7429C4.88 10.7926 4.88986 10.8418 4.909 10.8876C4.92809 10.9334 4.95605 10.9749 4.99126 11.0098C5.06194 11.0804 5.15771 11.12 5.25759 11.12C5.35756 11.12 5.45342 11.0803 5.52412 11.0096L5.52417 11.0095L8.00003 8.53125L10.4759 11.0079L10.4759 11.0079C10.5466 11.0786 10.6424 11.1183 10.7424 11.1183C10.8424 11.1183 10.9382 11.0786 11.0089 11.0079L10.9241 10.923M7.99997 7.46422L8.08484 8.44636L10.5607 10.923C10.6089 10.9712 10.6743 10.9983 10.7424 10.9983C10.8105 10.9983 10.8759 10.9712 10.9241 10.923M7.99997 7.46422L10.4758 4.98429L10.4788 4.98126L10.4789 4.98132C10.5504 4.91465 10.6449 4.87833 10.7427 4.88006C10.8404 4.88178 10.9336 4.92142 11.0027 4.99057C11.0718 5.05971 11.1113 5.15298 11.113 5.2507C11.1148 5.34842 11.0785 5.44302 11.0119 5.51456L11.0092 5.51749L11.0092 5.51744L8.53299 8.006L11.0085 10.474M7.99997 7.46422L11.0085 10.474M10.9241 10.923C10.9481 10.8992 10.9672 10.8709 10.9803 10.8397C10.9933 10.8085 11 10.775 11 10.7412C11 10.7073 10.9933 10.6738 10.9803 10.6426C10.9672 10.6114 10.9481 10.5831 10.9241 10.5593M10.9241 10.923L11.0085 11.0083C11.0438 10.9734 11.0719 10.9318 11.091 10.8859C11.1101 10.8401 11.12 10.7909 11.12 10.7412C11.12 10.6915 11.1101 10.6422 11.091 10.5964C11.0719 10.5506 11.0439 10.5091 11.0087 10.4742L11.0088 10.4743L10.9241 10.5593M10.9241 10.5593L11.0085 10.474M10.9241 10.5593L11.0085 10.474M5.43928 10.9247L7.91519 8.44638L7.63663 8.00634L5.07591 10.561C5.05186 10.5848 5.03277 10.6131 5.01974 10.6443C5.00671 10.6755 5 10.709 5 10.7429C5 10.7767 5.00671 10.8102 5.01974 10.8414C5.03277 10.8726 5.05186 10.901 5.07591 10.9247C5.12411 10.9729 5.18946 11 5.25759 11C5.32572 11 5.39107 10.9729 5.43928 10.9247Z" fill="%23161616" stroke="%23161616" stroke-width="0.24"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}
.more-svg-icon {
  width: 0.32rem;
  height: 0.32rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 10.666L4 6.66602H12L8 10.666Z" fill="%23333333"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}
.search-svg-icon {
  width: 0.48rem;
  height: 0.48rem;
  margin-right: 0.12rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(%23clip0_129_6995)"><mask id="mask0_129_6995" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H24V24H0V0Z" fill="white"/></mask><g mask="url(%23mask0_129_6995)"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="%239EA3AE" stroke-width="1.5" stroke-linejoin="round"/><path d="M21 21L15 15" stroke="%239EA3AE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g></g><defs><clipPath id="clip0_129_6995"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}
.close-svg-icon {
  width: 0.24rem;
  height: 0.24rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.64645 4.93934L6 5.29289L6.35355 4.93934L10.6464 0.646447C10.8417 0.451185 11.1583 0.451185 11.3536 0.646446L11.7062 0.293812L11.3536 0.646447C11.5488 0.841709 11.5488 1.15829 11.3536 1.35355L11.675 1.67497L11.3536 1.35355L7.06066 5.64645L6.70711 6L7.06066 6.35355L11.3536 10.6464C11.5488 10.8417 11.5488 11.1583 11.3536 11.3536C11.1583 11.5488 10.8417 11.5488 10.6464 11.3536L6.35355 7.06066L6 6.70711L5.64645 7.06066L1.35355 11.3536L1.67497 11.675L1.35355 11.3536C1.15829 11.5488 0.841709 11.5488 0.646447 11.3536L0.292893 11.7071L0.646446 11.3536C0.451185 11.1583 0.451185 10.8417 0.646446 10.6464L4.93934 6.35355L5.29289 6L4.93934 5.64645L0.646447 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L5.64645 4.93934Z" stroke="%23121826"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}

</style>
