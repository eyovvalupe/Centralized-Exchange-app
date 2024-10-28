<!-- 注册成功 -->
<template>
  <div class="page page_register_success">
    <!-- 返回和语言 -->
    <div class="top_icon_container">
      <div class="top_back_container text-[0.48rem]" @click="goBack">
        <Icon name="arrow-left" />
      </div>

      <div class="flex flex-row">
        <div class="server_icon" @click="goChat">
          <div class="chat_icon"><img src="/static/img/user/server.svg" /></div>
        </div>

        <div class="language_icon_container" @click="goLang">
          <div class="language_icon"></div>
        </div>
      </div>
    </div>
    <div class="icon">
      <img src="/static/img/user/success.svg" alt="√" />
    </div>
    <div class="title">密码重置成功</div>

    <Button
      round
      color="#014CFA"
      class="submit"
      type="primary"
      @click="next"
      :style="'height: 1.12rem; font-size: 0.3rem; margin-bottom: 0.6rem'"
      >返回登录</Button
    >
  </div>
</template>

<script setup>
import { Button, Icon } from "vant";
import router from "@/router";
import { useRoute } from "vue-router";
const route = useRoute();

const next = () => {
  router.replace({
    name: "google",
    query: {
      from: "register",
    },
  });
};
const back = () => {
  router.replace({
    name: "user",
  });
};
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

//跳转到语言设置页
const goLang = () => {
  //   emits("closeDialog");
  router.push({ name: "language" });
};

const goChat = () => {
  //   emits("closeDialog");
  router.push({ name: "chat" });
};
</script>

<style lang="less" scoped>
.page_register_success {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 0 0.32rem;

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
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g clip-path="url(%23clip0_129_5851)"><path d="M10.8912 0.306641C4.98556 0.306641 0.199219 5.09298 0.199219 10.9986C0.199219 16.9043 4.98556 21.6906 10.8912 21.6906C16.7969 21.6906 21.5832 16.9043 21.5832 10.9986C21.5832 5.09298 16.7969 0.306641 10.8912 0.306641ZM20.1075 10.2858H17.2814C17.1588 7.20075 16.2567 4.47207 14.8952 2.65108C17.7993 4.04606 19.8458 6.91396 20.1075 10.2858ZM15.8446 10.2858H11.604V1.83805C13.8956 2.44782 15.6664 5.94778 15.8446 10.2858ZM10.1784 1.83805V10.2858H5.93782C6.11602 5.94778 7.88688 2.44782 10.1784 1.83805ZM6.88729 2.65108C5.52294 4.47207 4.62359 7.19797 4.50108 10.2858H1.67494C1.93667 6.91396 3.98318 4.04606 6.88729 2.65108ZM1.67494 11.7114H4.49829C4.62081 14.7965 5.52294 17.5252 6.8845 19.3462C3.98318 17.9512 1.93667 15.0833 1.67494 11.7114ZM5.93782 11.7114H10.1784V20.1592C7.88688 19.5495 6.11602 16.0495 5.93782 11.7114ZM11.604 20.1592V11.7114H15.8446C15.6664 16.0495 13.8956 19.5495 11.604 20.1592ZM14.8952 19.3462C16.2595 17.5252 17.1588 14.7993 17.2814 11.7114H20.1047C19.8458 15.0833 17.7993 17.9512 14.8952 19.3462Z" fill="%23666D80"/></g><defs><clipPath id="clip0_129_5851"><rect width="21.6" height="21.6" fill="white" transform="translate(0.199219 0.199219)"/></clipPath></defs></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

  .icon {
    width: 5.4rem;
    height: 5.4rem;
    margin-top: 1.7rem;
  }

  .title {
    position: relative;
    top: -1.4rem;
    color: #333333;
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.42rem;
  }

  .submit {
    width: 100%;
    margin-bottom: 0.6rem;
    position: relative;
    top: -0.5rem;
  }
  .close-svg-iconB {
    width: 0.42rem;
    height: 0.4rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"><path d="M10.8729 9.61463L17.0186 3.43813C17.1276 3.32104 17.1869 3.16618 17.1841 3.00617C17.1813 2.84615 17.1165 2.69348 17.0035 2.58032C16.8904 2.46716 16.7379 2.40233 16.5781 2.39951C16.4182 2.39669 16.2635 2.45608 16.1465 2.56518L10.0008 8.7211L3.85504 2.5693C3.73724 2.46783 3.58553 2.41459 3.43021 2.42022C3.2749 2.42586 3.12743 2.48995 3.01728 2.59969C2.90712 2.70944 2.8424 2.85674 2.83604 3.01218C2.82967 3.16762 2.88214 3.31973 2.98296 3.43813L9.1287 9.61463L2.98296 15.7458C2.92525 15.8029 2.87943 15.8709 2.84816 15.9458C2.81688 16.0207 2.80078 16.1011 2.80078 16.1823C2.80078 16.2635 2.81688 16.3439 2.84816 16.4188C2.87943 16.4937 2.92525 16.5617 2.98296 16.6188C3.09865 16.7344 3.25548 16.7994 3.419 16.7994C3.58252 16.7994 3.73935 16.7344 3.85504 16.6188L10.0008 10.467L16.1465 16.6147C16.2622 16.7303 16.419 16.7953 16.5826 16.7953C16.7461 16.7953 16.9029 16.7303 17.0186 16.6147C17.0763 16.5576 17.1221 16.4896 17.1534 16.4147C17.1847 16.3398 17.2008 16.2594 17.2008 16.1782C17.2008 16.097 17.1847 16.0166 17.1534 15.9417C17.1221 15.8667 17.0763 15.7988 17.0186 15.7417L10.8729 9.61463Z" fill="%23161616"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
