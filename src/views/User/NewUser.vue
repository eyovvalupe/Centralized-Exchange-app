<!-- 个人中心 -->
<template>
  <div class="page page_user">
    <!-- 标题 -->
    <!-- <div class="title">用户</div> -->
    <div class="user-login">
      <div
        v-if="token"
        class="flex items-center -ml-[0.08rem] gap-[0.16rem] mb-[0.2rem]"
      >
        <div class="default-avatar"></div>
        <div>
          <div class="text-[#061023] text-[0.32rem] mb-[0.1rem]">
            {{ userInfo.username || "--" }}
          </div>
          <div class="text-[#666D80] text-[0.28rem]">
            ID:{{ userInfo.uid || "--" }}
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex items-center -ml-[0.08rem] gap-[0.16rem] mb-[0.2rem]"
        @click="store.commit('setIsLoginOpen', true)"
      >
        <div class="default-avatar"></div>
        <div>登录/注册</div>
      </div>
      <div class="flex items-center gap-[0.16rem]">
        <div
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-[#EDF2F7] border-[0.02rem] flex items-center justify-center"
        ></div>
        <div
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-[#EDF2F7] border-[0.02rem] flex items-center justify-center"
        >
          <div class="setting-icon"></div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center bg-[#F5F7FC] rounded-[0.32rem] w-full h-[1.22rem] mb-[0.2rem]"
    >
      <div class="w-1/3 text-center">
        <div class="font-bold text-[#061023] text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-[#8f92a1]">推荐用户</div>
      </div>
      <div class="w-1/3 text-center">
        <div class="font-bold text-[#061023] text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-[#8f92a1]">网络用户</div>
      </div>
      <div class="w-1/3 text-center">
        <div class="font-bold text-[#061023] text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-[#8f92a1]">推荐奖金</div>
      </div>
    </div>
    <div>
      <!-- @click=" token ? jump('register', false, { guest: 1 }) : jump('kyc') -->
      <Carousel
        :autoplay="3000"
        :wrap-around="true"
        :mouseDrag="true"
        v-model="currentSlide"
        class="relative"
      >
        <Slide v-for="(slide, index) in slides" :key="index">
          <img :src="slide" class="w-full rounded-[0.36rem]" alt="img" />
          <div class="absolute left-0 ml-[0.32rem]">
            <div class="text-white text-[0.3rem] font-bold mb-[0.2rem]">
              领取投资模拟金
            </div>
            <div class="text-white text-[0.24rem]">模拟投资，收益在手</div>
          </div>
        </Slide>
      </Carousel>
      <div class="flex gap-[0.05rem] justify-center relative -mt-[0.2rem]">
        <div
          class="w-[0.2rem] h-[0.06rem] rounded-[1rem] bg-white"
          :class="[currentSlide == 0 ? '' : 'opacity-50']"
        ></div>
        <div
          class="w-[0.2rem] h-[0.06rem] rounded-[1rem] bg-white"
          :class="[currentSlide == 1 ? '' : 'opacity-50']"
        ></div>
      </div>
    </div>
    <div
      class="flex items-center w-full mb-[0.32rem] mt-[0.52rem] justify-between"
    >
      <div
        class="text-center flex flex-col items-center justify-center relative"
      >
        <div
          class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-[#014CFA] opacity-10 mb-[0.2rem]"
        ></div>
        <div
          class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.14rem]"
        >
          <img class="" src="/static/img/user/payment.svg" />
        </div>
        <div class="text-[#061023] text-[0.28rem]">收款账户</div>
      </div>
      <div
        class="text-center flex flex-col items-center justify-center relative"
      >
        <div
          class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-[#014CFA] opacity-10 mb-[0.2rem]"
        ></div>
        <div
          class="absolute w-[0.55rem] h-[0.55rem] opacity-100 top-0 mt-[0.14rem]"
        >
          <img class="" src="/static/img/user/id_card.svg" />
        </div>
        <div class="text-[#061023] text-[0.28rem]">身份认证</div>
      </div>
      <div
        class="text-center flex flex-col items-center justify-center relative"
      >
        <div
          class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-[#014CFA] opacity-10 mb-[0.2rem]"
        ></div>
        <div
          class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.14rem]"
        >
          <img class="" src="/static/img/user/google.svg" />
        </div>
        <div class="text-[#061023] text-[0.28rem]">谷歌验证器</div>
      </div>
      <div
        class="text-center flex flex-col items-center justify-center relative"
      >
        <div
          class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-[#014CFA] opacity-10 mb-[0.2rem]"
        ></div>
        <div
          class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.14rem]"
        >
          <img class="" src="/static/img/user/friend.svg" />
        </div>
        <div class="text-[#061023] text-[0.28rem]">推荐朋友</div>
      </div>
    </div>
   <!-- ///////////////////////////////////////////////////// -->
    <!-- <div class="user-comman">
      <div class="user-b-box" style="margin-right: 0.2rem">
        <div class="user-flex">
          <img src="/static/img/user/user.svg" alt="" />
          <Icon name="arrow" class="arrow-right" />
        </div>
        <div class="user-sub">推荐朋友</div>
        <div class="user-small-title">分享给好友</div>
      </div>

      <div class="user-b-box" @click="jump('chat', false)">
        <div class="user-flex">
          <img src="/static/img/user/server.png" alt="" />

          <div style="display: flex">
            <div v-if="messageNum > 0" class="nums">{{ messageNum }}</div>
            <Icon name="arrow" class="arrow-right" />
          </div>
        </div>
        <div class="user-sub">客服</div>
        <div class="user-small-title">联系客服</div>
      </div>
    </div>

    <div class="user-h-box" @click="jump('account', true)">
      <div class="">
        <div class="user-flex">
          <img src="/static/img/user/account.png" alt="" />
          <Icon name="arrow" class="arrow-right" />
        </div>
        <div class="user-sub">收款账户</div>
        <div class="user-small-title">收款银行卡添加</div>
      </div>
    </div>

    <div class="user-comman">
      <div
        class="user-b-box"
        style="margin-right: 0.2rem"
        @click="jump('kyc', true)"
      >
        <div class="user-flex">
          <img src="/static/img/user/iden.png" alt="" />
          <div style="display: flex">
            <span v-if="token">
              <span
                v-if="userInfo.kycl2 != 1 && userInfo.kycl2 != 2"
                class="red-text"
                >未认证</span
              >
              <span v-else class="red-text" style="color: #18b762">已认证</span>
            </span>
            <Icon name="arrow" class="arrow-right" />
          </div>
        </div>
        <div class="user-sub">身份认证</div>
        <div class="user-small-title">进行身份认证</div>
      </div>

      <div class="user-b-box" @click="jump('googleCode', true)">
        <div class="user-flex">
          <img src="/static/img/user/Google-lock.png" alt="" />
          <div style="display: flex">
            <span v-if="token && !userInfo.googlebind" class="red-text"
              >谷歌验证器未绑定</span
            >
            <span
              v-if="token && userInfo.googlebind"
              class="red-text"
              style="color: #18b762"
              >谷歌验证器已绑定</span
            >
            <Icon name="arrow" class="arrow-right" />
          </div>
        </div>
        <div class="user-sub">谷歌验证器</div>
        <div class="user-small-title">谷歌验证器安全认证</div>
      </div>
    </div> -->
   <!-- ///////////////////////////////////////////////////// -->

    <div class="navs">
      <div
        class="nav"
        style="border-bottom: 0.02rem solid #eaeaea"
        @click="jump('language')"
      >
        <div class="icon">
          <img src="/static/img/user/lang.png" alt="img" />
        </div>
        <div class="content">
          <div class="title">语言</div>
        </div>
        <div class="lang">
          <div class="lang_icon">
            <img :src="i18Data.icon" alt="English" />
          </div>
          <span class="font-1">{{ i18Data.name }}</span>
        </div>
        <Icon class="nav_more" name="arrow" />
      </div>
      <div
        class="nav"
        style="border-bottom: 0.02rem solid #eaeaea"
        @click="jump('safety', true)"
      >
        <div class="icon">
          <img src="/static/img/user/safe.png" alt="img" />
        </div>
        <div class="content">
          <div class="title">安全</div>
        </div>
        <div v-if="token" class="gg">
          <span v-if="!userInfo.googlebind" style="color: #ff3b30"
            >谷歌验证器未绑定</span
          >
          <span v-if="userInfo.googlebind" style="color: #18b762"
            >谷歌验证器已绑定</span
          >
        </div>
        <Icon class="nav_more" name="arrow" />
      </div>
      <div class="nav" @click="jump('about')">
        <div class="icon">
          <img src="/static/img/user/about.png" alt="img" />
        </div>
        <div class="content">
          <div class="title">关于</div>
        </div>
        <Icon class="nav_more" name="arrow" />
      </div>
    </div>

    <!-- 退出登录 -->
    <div v-if="token" class="loginout" @click="loginout">退出登录</div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import { Icon, showConfirmDialog } from "vant";
import router from "@/router";
import store from "@/store";
import storeChat from "@/store/chat";
import { _logout } from "@/api/api";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
const messageNum = computed(() => storeChat.state.messageNum);
const token = computed(() => store.state.token);
const userInfo = computed(() => store.state.userInfo || {});
const i18Data = computed(() => store.state.i18Data || {});
const slides = ["/static/img/user/userid.webp", "/static/img/user/userid.webp"];
const currentSlide = ref(0);
const getFirstCharacter = (username) => {
  return username ? username.charAt(0) : "-";
};

const loginout = () => {
  if (token.value) {
    showConfirmDialog({
      title: "退出登录",
      message: "您当前确定要退出吗？",
      confirmButtonColor: "#014CFA",
      cancelButtonColor: "#323233",
    })
      .then(() => {
        _logout();
        setTimeout(() => {
          store.dispatch("reset");
          store.commit("setIsLoginOpen", true);
          // router.push({
          //     name: 'login'
          // })
        }, 200);
      })
      .catch(() => {});
  }
};

const jump = (name, needLogin, query) => {
  if (needLogin && !token.value) {
    store.commit("setIsLoginOpen", true);
    // router.push({
    //     name: 'login',
    //     query
    // })
    return;
  }
  if (name == "googleCode") {
    if (token.value && !userInfo.value.googlebind) {
      router.push({
        name: "google",
        query,
      });
    } else if (token.value && userInfo.value.googlebind) {
      router.push({
        name: "googleCode",
        query,
      });
    }
  } else {
    router.push({
      name,
      query,
    });
  }
};

// 预加载页面
store.commit("setPageLoading", true);
const loadingList = [import("@/views/Public/Language.vue")];
if (!token.value) {
  loadingList.push(import("@/views/Public/Login.vue"));
}
Promise.all(loadingList).finally(() => {
  store.commit("setPageLoading", false);
});

// 延迟加载
if (token.value) {
  setTimeout(() => {
    store.commit("setPageLoading", false);
    Promise.all([
      import("@/views/User/Safety.vue"),
      import("@/views/User/Account/Account.vue"),
      import("@/views/User/Kyc/Index.vue"),
    ]);
  }, 1000);
}
</script>

<style lang="less" scoped>
.page_user {
  padding: 0 0.32rem 2rem 0.32rem;
  position: relative;
  height: 100%;
  overflow-y: auto;

  .title {
    height: 1.12rem;
    color: #0d0d12;
    font-size: 0.5rem;
    font-weight: 600;
    line-height: 1.12rem;
  }

  .user-header {
    display: flex;
    justify-content: right;
    margin-bottom: 0.4rem;

    div {
      font-size: 0.4rem;
    }
  }

  .user-banner {
    position: relative;
    margin-bottom: 0.1rem;

    .banner-title {
      position: absolute;
      left: 0.2rem;
      top: 0.48rem;
      font-size: 0.28rem;
      font-weight: 700;
    }
  }

  .user-login {
    margin-top: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-comman {
    display: flex;
    margin-bottom: 0.28rem;
    position: relative;
    overflow: hidden;

    .user-b-box {
      flex: 1;
      background-color: #f2f3f8;
      padding: 0.2rem 0.3rem;
      border-radius: 0.2rem;
    }

    .user-flex {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.2rem;

      img {
        width: 0.4rem !important;
      }

      .arrow-right {
        color: #797b81;
        margin-left: 0.24rem;
        margin-top: 0.02rem;
      }

      .nums {
        width: 0.32rem;
        height: 0.32rem;
        background-color: #ff3b30;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.2rem;
        color: #fff;
        font-weight: 400;
      }
    }

    .user-sub {
      font-size: 0.28rem;
      font-weight: 600;
      line-height: 0.48rem;
    }

    .user-small-title {
      font-size: 0.24rem;
      line-height: 0.32rem;
      color: #4f5156;
    }
  }

  .user-h-box {
    background-color: #f2f3f8;
    padding: 0.2rem 0.3rem;
    border-radius: 0.2rem;
    margin-bottom: 0.28rem;
    position: relative;
    overflow: hidden;

    .user-flex {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.1rem;

      img {
        width: 0.48rem !important;
      }

      .arrow-right {
        margin-top: 0.08rem;
        color: #797b81;
      }
    }

    .user-sub {
      font-size: 0.28rem;
      font-weight: 600;
      line-height: 0.48rem;
    }

    .user-small-title {
      font-size: 0.24rem;
      line-height: 0.32rem;
      color: #4f5156;
    }
  }

  .user-bottom {
    margin-top: 0.4rem;

    .user-flex {
      border-bottom: 0.02rem solid #f4f4f4;
      display: flex;
      justify-content: space-between;
      padding: 0.2rem 0;

      .user-item {
        img {
          width: 0.4rem !important;
          vertical-align: middle;
          margin-right: 0.2rem;
        }

        span {
          vertical-align: middle;
        }
      }

      .arrow-right {
        margin-top: 0.08rem;
        color: #797b81;
      }
    }
  }

  .user-login-login-box {
    background-color: #f2f3f8;
    padding: 0.2rem 0.3rem;
    border-radius: 0.2rem;
  }

  .user-login-login {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.2rem;

    .arrow-right {
      margin-top: 0.08rem;
      color: #797b81;
    }

    .login-user-box {
      width: 1rem;
      height: 1rem;
      border-radius: 0.2rem;
      background-color: #667d7f;
      color: white;
      line-height: 0.88rem;
      text-align: center;
      margin-right: 0.4rem;
      font-size: 0.6rem;
      font-weight: 900;
    }

    span {
      font-size: 0.36rem;
      font-weight: 700;
      line-height: 0.6rem;
    }
  }

  // .loginout {
  //     margin-top: 0.2rem;
  //     border-bottom: 0.02rem solid #f4f4f4;
  //     display: flex;
  //     color: #eb4e3d;
  //     padding: 0.2rem 0;
  //     line-height: 0.4rem;
  //     img {
  //         width: 0.4rem !important;
  //         height: 0.4rem !important;
  //         vertical-align: middle;
  //         margin-right: 0.2rem;
  //     }
  // }
  .loginout {
    width: 100%;
    height: 1.5rem;
    border-radius: 1.3rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.28rem;
    color: #014cfa;
    font-weight: 400;
    overflow: hidden;
  }

  .user-fllower {
    display: flex;

    .user-fllower-flex {
      flex: 1;

      .user-fllower-num {
        font-size: 0.28rem;
        font-weight: 600;
        margin-bottom: 0.06rem;
      }

      .user-fllower-title {
        font-size: 0.24rem;
        color: #767880;
      }
    }
  }

  .navs {
    margin-top: 0.2rem;

    .nav {
      display: flex;
      align-items: center;
      height: 1.04rem;
      color: #7e848d;
      font-size: 0.28rem;
      overflow: hidden;

      .icon {
        width: 0.64rem;
        height: 0.64rem;
        margin-right: 0.3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        > img {
          width: 0.48rem !important;
          height: 0.48rem !important;
        }
      }

      .content {
        flex: 1;
        font-weight: 400;
        margin-right: 0.2rem;
        overflow: hidden;

        .title {
          color: #1e1e2d;
          font-size: 0.32rem;
          font-weight: 400;
        }

        .info {
          font-size: 0.24rem;
          color: #c2c2c2;
          margin-top: 0.2rem;
        }
      }

      .nav_more {
        margin-left: 0.3rem;
      }

      .cards {
        width: 1.36rem;
        height: 0.52rem;
      }

      .gg {
        font-weight: 500;
        font-size: 0.24rem;
      }

      .lang {
        display: flex;
        align-items: center;
        font-weight: 500;
        color: #1e1e2d;
        font-size: 0.24rem;

        .lang_icon {
          width: 0.48rem;
          height: 0.48rem;
          margin-right: 0.2rem;
        }
      }
    }
  }

  .red-text {
    color: #ff3b30;
    font-size: 0.2rem;
    font-style: normal;
    font-weight: 500;
    line-height: 0.32rem;
  }
}
.default-avatar {
  width: 0.98rem;
  height: 0.98rem;
  background-image: url('data:image/svg+xml;utf8,<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24.5" cy="24.5" r="24.5" fill="%23014CFA" fill-opacity="0.1"/><path d="M2 24.5C2 36.9226 12.0773 47 24.5 47C36.9226 47 47 36.9226 47 24.5C47 12.0773 36.9226 2 24.5 2C12.0773 2 2 12.0768 2 24.5Z" fill="%236C8CD6"/><path d="M21.1109 30.5918H28.1698V36.4168H21.0875L21.1109 30.5918ZM16.6293 22.794C16.6293 23.8301 16.0025 24.6695 15.213 24.6695C14.4236 24.6695 13.7988 23.8301 13.7988 22.794C13.7988 21.758 14.4257 20.9191 15.2151 20.9191C16.0045 20.9191 16.6313 21.7585 16.6313 22.794M35.5089 22.768C35.5089 23.8036 34.8816 24.643 34.0921 24.643C33.3027 24.643 32.6744 23.802 32.6744 22.768C32.6744 21.734 33.3012 20.8926 34.0906 20.8926C34.88 20.8926 35.5089 21.7585 35.5089 22.768Z" fill="%23F8ECEC"/><path d="M21.1104 31.4277C21.1104 31.4277 22.4573 32.124 24.3842 32.124C26.6597 32.2172 28.1458 31.4512 28.1458 31.4512V32.1475C28.1458 32.1475 25.6384 33.4932 24.5239 33.4932C23.3859 33.4932 21.1094 31.9142 21.1094 31.9142L21.1104 31.4277Z" fill="%23E9CFCF"/><path d="M40.9156 39.8521C39.7781 38.947 37.7458 36.3885 35.6094 35.3667C32.1496 33.6726 28.1449 34.1667 28.1449 34.1667V34.2803C27.8661 34.5823 26.4963 35.928 24.6387 35.928C22.804 35.928 21.4112 34.675 21.1095 34.349L21.0861 34.1865C21.0861 34.1865 16.6686 33.6695 13.1869 35.3637C10.8186 36.5245 9.12922 39.0601 8.10742 39.9418C10.2042 42.1793 12.7398 43.9608 15.5561 45.1753C18.3724 46.3898 21.4089 47.0111 24.4761 47.0005C30.9779 46.9771 36.8289 44.2387 40.9156 39.8521Z" fill="%23485B80"/><path d="M33.8572 21.2681C33.8572 23.6687 33.1304 26.922 31.9104 28.6798C30.2286 31.1023 26.436 32.2218 24.662 32.2218C22.8686 32.2218 19.4562 31.3086 17.7723 29.1657C16.3372 27.3386 15.4668 23.8953 15.4668 21.2706C15.4668 15.5617 19.5769 10.9199 24.662 10.9199C29.747 10.9199 33.8572 15.5617 33.8572 21.2706" fill="%23F8ECEC"/><path d="M34.6712 16.5275C34.6712 16.5275 34.5912 12.9539 32.5527 10.4071C31.1288 8.6284 26.5901 7.33717 23.3397 7.59287C23.3397 7.59287 16.9729 7.84755 16.8404 12.0752C15.677 12.7715 14.4814 13.9726 14.3535 15.9912C14.0987 20.0528 14.8177 21.1204 14.8177 21.1204C14.8177 21.1204 15.8395 21.1204 16.0954 22.6516C16.0954 22.6516 16.5596 22.9307 16.605 22.6516C16.6743 22.1875 16.1871 19.9596 17.162 17.9176C17.2823 17.6593 17.4026 17.4291 17.5188 17.2238C20.7111 13.6746 30.0744 14.0424 32.2684 17.9232C32.3582 18.1933 32.4232 18.471 32.4625 18.7529C32.648 20.0773 32.8804 22.5823 32.8804 22.5823C32.8804 22.5823 33.2285 22.8141 33.4609 22.2573C33.6933 21.6772 33.6469 21.1204 33.8558 20.958C35.0423 20.17 34.7406 16.8759 34.6712 16.5275Z" fill="%23485B80"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}
.setting-icon {
  width: 0.48rem;
  height: 0.48rem;
  background-image: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.1365 11.0525L17.8625 3.30255C17.7137 3.03111 17.4948 2.80457 17.2286 2.64657C16.9625 2.48857 16.6588 2.4049 16.3492 2.4043H7.86173C7.5522 2.4049 7.2485 2.48857 6.98232 2.64657C6.71615 2.80457 6.49725 3.03111 6.34848 3.30255L2.07448 11.0525C1.93081 11.3134 1.85547 11.6065 1.85547 11.9043C1.85547 12.2021 1.93081 12.4951 2.07448 12.756L6.34848 20.506C6.49725 20.7775 6.71615 21.004 6.98232 21.162C7.2485 21.32 7.5522 21.4037 7.86173 21.4043H16.3492C16.6588 21.4037 16.9625 21.32 17.2286 21.162C17.4948 21.004 17.7137 20.7775 17.8625 20.506L22.1365 12.756C22.2802 12.4951 22.3555 12.2021 22.3555 11.9043C22.3555 11.6065 22.2802 11.3134 22.1365 11.0525ZM20.8242 11.7825C20.8447 11.8198 20.8555 11.8616 20.8555 11.9042C20.8555 11.9467 20.8447 11.9885 20.8242 12.0258L16.5577 19.7758C16.5366 19.8146 16.5054 19.847 16.4674 19.8696C16.4295 19.8922 16.3862 19.9042 16.342 19.9043H7.86898C7.82481 19.9042 7.78147 19.8922 7.74352 19.8696C7.70556 19.847 7.67438 19.8146 7.65323 19.7758L3.38673 12.0258C3.36625 11.9885 3.35551 11.9467 3.35551 11.9042C3.35551 11.8616 3.36625 11.8198 3.38673 11.7825L7.65323 4.03255C7.67441 3.99381 7.70561 3.96147 7.74356 3.93891C7.78151 3.91635 7.82483 3.90439 7.86898 3.9043H16.342C16.3861 3.90439 16.4294 3.91635 16.4674 3.93891C16.5054 3.96147 16.5366 3.99381 16.5577 4.03255L20.8242 11.7825ZM12.041 8.0008C9.83173 8.0008 8.04098 9.79155 8.04098 12.0008C8.04098 14.21 9.83173 16.0008 12.041 16.0008C14.25 16.0008 16.041 14.21 16.041 12.0008C16.041 9.79155 14.25 8.0008 12.041 8.0008ZM12.041 9.5008C13.4217 9.5008 14.541 10.62 14.541 12.0008C14.541 13.3815 13.4217 14.5008 12.041 14.5008C10.6602 14.5008 9.54098 13.3815 9.54098 12.0008C9.54098 10.62 10.6602 9.5008 12.041 9.5008Z" fill="black"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}
.payment-icon {
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_481_5165)"><path d="M2.1445 1.27734H21.445C22.0138 1.27734 22.5592 1.50328 22.9614 1.90545C23.3636 2.30763 23.5895 2.85309 23.5895 3.42185V7.71085H0V3.42185C0 2.85309 0.225938 2.30763 0.62811 1.90545C1.03028 1.50328 1.57575 1.27734 2.1445 1.27734ZM0 9.85535H23.5895V20.5779C23.5895 21.1466 23.3636 21.6921 22.9614 22.0943C22.5592 22.4964 22.0138 22.7224 21.445 22.7224H2.1445C1.57575 22.7224 1.03028 22.4964 0.62811 22.0943C0.225938 21.6921 0 21.1466 0 20.5779L0 9.85535ZM13.5816 17.7188V19.8633H15.7261V17.7188H13.5816ZM16.4415 17.7188V19.8633H18.586V17.7188H16.4415ZM19.3005 17.7188V19.8633H21.445V17.7188H19.3005Z" fill="url(#paint0_linear_481_5165)"/><mask id="mask0_481_5165" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="1" width="24" height="22"><path d="M2.1445 1.27734H21.445C22.0138 1.27734 22.5592 1.50328 22.9614 1.90545C23.3636 2.30763 23.5895 2.85309 23.5895 3.42185V7.71085H0V3.42185C0 2.85309 0.225938 2.30763 0.62811 1.90545C1.03028 1.50328 1.57575 1.27734 2.1445 1.27734ZM0 9.85535H23.5895V20.5779C23.5895 21.1466 23.3636 21.6921 22.9614 22.0943C22.5592 22.4964 22.0138 22.7224 21.445 22.7224H2.1445C1.57575 22.7224 1.03028 22.4964 0.62811 22.0943C0.225938 21.6921 0 21.1466 0 20.5779L0 9.85535ZM13.5816 17.7188V19.8633H15.7261V17.7188H13.5816ZM16.4415 17.7188V19.8633H18.586V17.7188H16.4415ZM19.3005 17.7188V19.8633H21.445V17.7188H19.3005Z" fill="#014CFA"/></mask><g mask="url(#mask0_481_5165)"><rect x="12.79" y="-17" width="16" height="42" transform="rotate(37.8828 12.79 -17)" fill="white" fill-opacity="0.1"/></g></g><defs><linearGradient id="paint0_linear_481_5165" x1="11.9667" y1="1.98046" x2="10.1825" y2="22.5737" gradientUnits="userSpaceOnUse"><stop stop-color="%236794FB"/><stop offset="1" stop-color="%23014CFA"/></linearGradient><clipPath id="clip0_481_5165"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
