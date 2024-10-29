<!-- 安全 -->
<template>
  <div class="page page-safety">
    <Top :title="'安全'" />

    <div class="navs">
      <div class="nav" @click="checkGG('password')">
        <div class="nav_icon">
          <div class="change_login_pw"></div>
        </div>
        <div class="nav_title">登录密码</div>
        <Icon name="arrow" />
      </div>
      <div class="nav" @click="checkGG('fund')">
        <div class="nav_icon">
            <div class="change_trade_pw"></div>
        </div>
        <div class="nav_title">交易密码</div>
        <Icon name="arrow" />
      </div>
      <div class="nav" @click="goGG">
        <div class="nav_icon">
            <div class="google_verify"></div>
        </div>
        <div class="nav_title">谷歌验证器</div>
        <div class="nav_tip">
          <span style="color: #ff3b30" v-if="!userInfo.googlebind">未绑定</span>
          <span style="color: #18b762" v-if="userInfo.googlebind">已绑定</span>
        </div>
        <Icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Top from "@/components/Top.vue";
import { Icon, showConfirmDialog } from "vant";
import store from "@/store";
import { computed } from "vue";
import router from "@/router";

const userInfo = computed(() => store.state.userInfo || {});

const jump = (name) => {
  router.push({
    name,
  });
};

const goGG = () => {
  if (userInfo.value.googlebind) {
    // 已绑定
    jump("googleCode");
  } else {
    jump("google");
  }
};

const checkGG = async (name) => {
  if (!userInfo.value.googlebind) {
    return showConfirmDialog({
      title: "谷歌验证器",
      message: "你还未绑定谷歌验证器，是否去绑定?",
    }).then(() => {
      jump("google");
    });
  }
  jump(name);
};

// 预加载页面
store.commit("setPageLoading", true);
const loadingList = [
  import("@/views/User/LoginPassword.vue"),
  import("@/views/User/Google/Google.vue"),
];
Promise.all(loadingList).finally(() => {
  store.commit("setPageLoading", false);
});
</script>

<style lang="less" scoped>
.page-safety {
  padding-top: 1.2rem;

  .navs {
    padding: 0.32rem 0.48rem 0 0.32rem;

    .nav {
      display: flex;
      padding: 0 0.32rem;
      align-items: center;
      height: 1.04rem;
      border: 0.02rem solid #eff3f8;
      border-radius: 0.32rem;
      color: #061023;
      font-size: 0.3rem;
      overflow: hidden;
      margin-bottom: 0.2rem;

      .nav_icon {
        width: 0.48rem;
        height: 0.48rem;

        .change_login_pw {
          width: 0.48rem;
          height: 0.48rem;
          background-image: url("data:image/svg+xml;utf8,<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20.28 21.9951H4.53C3.72 22.0784 3 21.0787 3 20.5788V11.1644C3 10.1647 4.17 9.49816 4.8 9.49816H5.7V6.99878C5.7 4.16614 8.94 2 12 2C15.06 2 18.3 4.16614 18.3 6.99878V9.49816H19.2C19.92 9.49816 21 10.0814 21 11.1644V20.5788C20.91 21.0787 21.09 21.9951 20.28 21.9951ZM16.41 6.99878C16.41 5.08258 13.98 3.66626 11.91 3.66626C9.84 3.66626 7.41 5.08258 7.41 6.99878V9.49816H16.41V6.99878ZM19.11 11.1644H4.71V20.3288H19.11L19.38 20.5788L19.11 11.1644ZM12.81 15.9133V17.8295C12.81 18.3293 12.45 18.6626 11.91 18.6626C11.37 18.6626 11.01 18.246 11.01 17.8295V15.9133C10.47 15.6633 10.11 15.0801 10.11 14.4969C10.11 13.5805 10.92 12.8307 11.91 12.8307C12.9 12.8307 13.71 13.5805 13.71 14.4969C13.71 15.0801 13.35 15.6633 12.81 15.9133Z' fill='%23666D80'/></svg>");
          background-size: cover;
          background-repeat: none;
        }

        .change_trade_pw {
          width: 0.48rem;
          height: 0.48rem;
          background-image: url("data:image/svg+xml;utf8,<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20.28 21.9951H4.53C3.72 22.0784 3 21.0787 3 20.5788V11.1644C3 10.1647 4.17 9.49816 4.8 9.49816H5.7V6.99878C5.7 4.16614 8.94 2 12 2C15.06 2 18.3 4.16614 18.3 6.99878V9.49816H19.2C19.92 9.49816 21 10.0814 21 11.1644V20.5788C20.91 21.0787 21.09 21.9951 20.28 21.9951ZM16.41 6.99878C16.41 5.08258 13.98 3.66626 11.91 3.66626C9.84 3.66626 7.41 5.08258 7.41 6.99878V9.49816H16.41V6.99878ZM19.11 11.1644H4.71V20.3288H19.11L19.38 20.5788L19.11 11.1644Z' fill='%23666D80'/><path d='M10.0556 14.7222L9.46677 15.251L8.69922 14.3472L11.2225 12.0762V18.7991H10.0556V14.7222ZM14.1432 16.1549L14.732 15.6261L15.4996 16.53L12.9763 18.7991V12.078H14.1432V16.1549Z' fill='%23666D80'/></svg>");
          background-size: cover;
          background-repeat: none;
        }

        .google_verify {
          width: 0.48rem;
          height: 0.48rem;
          background-image: url("data:image/svg+xml;utf8,<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M10.235 11.9871C10.235 11.3973 10.4681 10.8316 10.8831 10.4146C11.2981 9.9975 11.861 9.7632 12.4479 9.7632C13.0348 9.7632 13.5977 9.9975 14.0127 10.4146C14.4277 10.8316 14.6608 11.3973 14.6608 11.9871C14.6608 12.5769 14.4277 13.1425 14.0127 13.5596C13.5977 13.9766 13.0348 14.2109 12.4479 14.2109C11.861 14.2109 11.2981 13.9766 10.8831 13.5596C10.4681 13.1425 10.235 12.5769 10.235 11.9871ZM12.483 10.5804H18.8407C19.134 10.5804 19.4291 10.5769 19.7224 10.5804H19.7347C20.0596 10.5804 20.4003 10.7216 20.6286 10.9528C20.7516 11.0675 20.8394 11.2034 20.8903 11.3623C20.9694 11.5141 21.0062 11.6764 20.9992 11.8512C20.9852 12.1795 20.8763 12.5201 20.6286 12.7495C20.381 12.9772 20.0772 13.1219 19.7347 13.1219H13.377C13.0837 13.1219 12.7886 13.1255 12.4953 13.1219H12.483C12.1581 13.1219 11.8174 12.9808 11.5891 12.7495C11.4661 12.6348 11.3783 12.4989 11.3274 12.3401C11.2484 12.1883 11.2115 12.0259 11.2185 11.8512C11.2326 11.5229 11.3414 11.1822 11.5891 10.9528C11.8367 10.7251 12.1405 10.5804 12.483 10.5804Z' fill='%23666D80'/><path fill-rule='evenodd' clip-rule='evenodd' d='M11.8278 4.8C7.92745 4.8 4.76557 8.02355 4.76557 12C4.76557 15.9764 7.92745 19.2 11.8278 19.2C14.1024 19.2 16.1257 18.1047 17.4188 16.3995C17.717 16.0063 18.2714 15.934 18.6571 16.238C19.0428 16.542 19.1138 17.1072 18.8156 17.5005C17.2025 19.6276 14.6722 21 11.8278 21C6.95235 21 3 16.9706 3 12C3 7.02944 6.95235 3 11.8278 3C14.6722 3 17.2025 4.37244 18.8156 6.49952C19.1138 6.89276 19.0428 7.458 18.6571 7.76202C18.2714 8.06604 17.717 7.99372 17.4188 7.60048C16.1257 5.89531 14.1024 4.8 11.8278 4.8Z' fill='%23666D80'/></svg>");
          background-size: cover;
          background-repeat: none;
        }
      }

      .nav_title {
        margin: 0 0.3rem;
        color: #1e1e2d;
        font-weight: 400;
        flex: 1;
      }

      .nav_tip {
        margin-right: 0.28rem;
        font-size: 0.24rem;
        font-weight: 500;
      }
    }
  }
}
</style>
