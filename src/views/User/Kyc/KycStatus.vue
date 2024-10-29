<!-- 认证状态 -->
<template>
    <div class="page page-auth_status">
      <Top :title="'身份认证'">
        <template #right>
          <div
            @click="jump('chat')"
            class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-[#EDF2F7] border-[0.02rem] flex items-center justify-center"
          >
            <div class="w-[0.4rem] h-[0.4rem]">
              <img src="/static/img/user/serverB.svg" alt="server" />
            </div>
          </div>
        </template>
      </Top>
      <div class="check_box">
        <!-- v-if="kycInfo.status == 'review'" -->
  
        <!-- 成功 -->
        <template v-if="kycInfo.status == 'success'">
          <div class="success_icon"></div>
          <div class="text-[0.36rem] text-[#061023] mt-[0.24rem] mb-[0.4rem]">
            认证成功
          </div>
        </template>
        <!-- 详情 -->
        <template v-if="kycInfo.status == 'review'">
          <div class="review_icon"></div>
          <div class="text-[0.36rem] text-[#061023] my-[0.24rem]">审核中</div>
          <div class="text-[#8F92A1] text-[0.28rem] mb-[0.4rem]">
            身份认证已提交审核，请耐心等待
          </div>
        </template>
        <!-- 失败 -->
        <template v-if="kycInfo.status == 'failure'">
          <div class="w-[1.2rem] h-[1.2rem] rounded-[50%] overflow-hidden">
              <img src ="static/img/user/failure.svg" alt = "failure" />
          </div>
          <div class="text-[0.36rem] text-[#061023] my-[0.24rem]">认证失败</div>
          <div class="text-[#8F92A1] text-[0.28rem] mb-[0.4rem]">
            {{ kycInfo.remarks || "--" }}
          </div>
        </template>
        <div
          class="bg-[#EFF3F8] rounded-[0.32rem] w-full h-[6.72rem] pt-[0.32rem] mb-[0.8rem]"
        >
          <div class="px-[0.32rem] mb-[0.3rem]">
            <div class="text-[0.36rem] mb-[0.32rem] leading-[0.5rem]">戴晓曦</div>
            <div class="text-[0.3rem] mb-[0.2rem] leading-[0.4rem]">
              <span class="text-[#8F92A1] mr-[0.2rem]">证件号码</span>
              <span class="text-[#061023]">{{ kycInfo.idnum }}</span>
            </div>
            <div class="text-[0.3rem] leading-[0.4rem]">
              <span class="text-[#8F92A1] mr-[0.2rem]">出生日期</span>
              <span class="text-[#061023]">{{ kycInfo.birthday }}</span>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-[0.32rem] border-[0.02rem] border-[#EFF3F8] h-[4.32rem] flex flex-wrap justify-between p-[0.32rem]"
          >
              <div class="w-[3rem] h-[1.76rem] overflow-hidden border-[0.02rem] border-[#EFF3F8] rounded-[0.32rem] mb-[0.2rem]">
                  <img :src = "kycInfo.idimg_1 || '/static/img/home/1.jpg'" alt = 'img' />
              </div>
              <div class="w-[3rem] h-[1.76rem] overflow-hidden border-[0.02rem] border-[#EFF3F8] rounded-[0.32rem] mb-[0.2rem]">
                  <img :src = "kycInfo.idimg_2 || '/static/img/home/1.jpg'" alt = 'img' />
  
              </div>
              <div class="w-[3rem] h-[1.76rem] overflow-hidden border-[0.02rem] border-[#EFF3F8] rounded-[0.32rem]">
                  <img :src = "kycInfo.idimg_3 || '/static/img/home/1.jpg'" alt = 'img' />
  
              </div>
          </div>
        </div>
        <div class="w-full" v-if="kycInfo.status == 'failure'">
          <div
            @click="nextStep"
            class="w-full h-[1.12rem] flex items-center justify-center rounded-[1rem] bg-[#014CFA] text-white text-[0.36rem]"
          >
            重新认证
          </div>
          <div
            @click="jump('chat')"
            class="w-full h-[1.12rem] flex items-center justify-center rounded-[1rem] text-[#014CFA] bg-white text-[0.36rem]"
          >
            联系客服
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Top from "@/components/Top.vue";
  import router from "@/router";
  
  const props = defineProps({
    kycInfo: {
      type: Object,
      default: () => {},
    },
  });
  console.log("==================>kycinfo", props.kycInfo);
  const emits = defineEmits(["next"]);
  const nextStep = () => {
    emits("next");
  };
  const jump = (name, query) => {
    router.push({
      name,
      query,
    });
  };
  const back = () => {
    router.back();
  };
  const goInfo = () => {
    localStorage.setItem("kycInfo", JSON.stringify(props.kycInfo));
    router.replace({
      name: "kycSuccess",
    });
  };
  </script>
  
  <style lang="less" scoped>
  .page-auth_status {
    height: 100%;
    padding: 1.6rem 0 0.6rem 0;
  
    .check_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 0.32rem 0.6rem 0.32rem;
      height: 100%;
  
      .big_icon {
        width: 3rem;
        height: 3rem;
        margin-bottom: -0.6rem;
      }
  
      .subtitlt {
        font-size: 0.28rem;
        color: #333;
        margin-top: 0.4rem;
      }
  
      .reason {
        background-color: #f5f8fb;
        padding: 0.4rem;
        width: 100%;
        margin-top: 0.64rem;
        color: #333;
        word-break: break-all;
        line-height: 0.4rem;
  
        .reason_title {
          color: #000;
          font-size: 0.32rem;
          margin-bottom: 0.2rem;
        }
      }
  
      .btn {
        background-color: #014cfa;
        height: 0.96rem;
        border-radius: 0.96rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        width: 100%;
      }
  
      .light_btn {
        background-color: #eff6ff;
        color: #014cfa;
      }
    }
  }
  .review_icon {
      width: 1.2rem;
      height: 1.2rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_33_31258)"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.7868 51.2132C3.16071 45.5871 0 37.9565 0 30C0 22.0435 3.16071 14.4129 8.7868 8.7868C14.4129 3.16071 22.0435 0 30 0C37.9565 0 45.5871 3.16071 51.2132 8.7868C56.8393 14.4129 60 22.0435 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60C22.0435 60 14.4129 56.8393 8.7868 51.2132ZM32.2494 43.524C32.2494 42.2342 31.2032 41.1886 29.9125 41.1886C28.6219 41.1886 27.5757 42.2342 27.5757 43.524C27.5757 44.8138 28.6219 45.8594 29.9125 45.8594C31.2031 45.8594 32.2494 44.8138 32.2494 43.524ZM23.3514 39.3922C23.3514 37.8543 22.104 36.6077 20.5652 36.6077C19.0264 36.6077 17.779 37.8543 17.779 39.3922C17.779 40.93 19.0264 42.1767 20.5652 42.1767C22.104 42.1767 23.3514 40.93 23.3514 39.3922ZM41.1474 39.9311C41.1474 38.8893 40.3023 38.0448 39.2599 38.0448C38.2175 38.0448 37.3725 38.8893 37.3725 39.9311C37.3725 40.9729 38.2175 41.8174 39.2599 41.8174C40.3023 41.8174 41.1474 40.9729 41.1474 39.9311ZM20.1159 30.6345C20.1159 28.8238 18.6471 27.356 16.8353 27.356C15.0235 27.356 13.5547 28.8238 13.5547 30.6345C13.5547 32.4452 15.0235 33.913 16.8353 33.913C18.6471 33.913 20.1159 32.4452 20.1159 30.6345ZM44.0235 30.5446C44.0235 29.7757 43.3998 29.1525 42.6303 29.1525V29.1524C41.861 29.1524 41.2373 29.7757 41.2373 30.5447C41.2373 31.3136 41.861 31.9369 42.6303 31.9369C43.3998 31.9369 44.0235 31.3136 44.0235 30.5446ZM24.2502 21.2929C24.2502 19.2342 22.5803 17.5653 20.5203 17.5653C18.4603 17.5653 16.7903 19.2342 16.7903 21.2929C16.7903 23.3516 18.4603 25.0205 20.5203 25.0205C22.5803 25.0205 24.2502 23.3516 24.2502 21.2929ZM34.5862 17.8348C34.5862 15.2552 32.4937 13.1641 29.9125 13.1641C27.3313 13.1641 25.2389 15.2552 25.2388 17.8348C25.2388 20.4144 27.3313 22.5056 29.9125 22.5056C32.4937 22.5056 34.5862 20.4144 34.5862 17.8348ZM39.8891 21.3828C39.8891 20.8619 39.4665 20.4396 38.9453 20.4396C38.4241 20.4396 38.0016 20.8619 38.0016 21.3828C38.0016 21.9037 38.4241 22.3259 38.9453 22.3259C39.4665 22.3259 39.8891 21.9037 39.8891 21.3828Z" fill="url(%23paint0_linear_33_31258)"/><mask id="mask0_33_31258" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="60" height="60"><path d="M0 30C0 37.9565 3.16071 45.5871 8.7868 51.2132C14.4129 56.8393 22.0435 60 30 60C37.9565 60 45.5871 56.8393 51.2132 51.2132C56.8393 45.5871 60 37.9565 60 30C60 22.0435 56.8393 14.4129 51.2132 8.7868C45.5871 3.16071 37.9565 0 30 0C22.0435 0 14.4129 3.16071 8.7868 8.7868C3.16071 14.4129 0 22.0435 0 30Z" fill="%23CCCCCC"/></mask><g mask="url(%23mask0_33_31258)"><rect x="63.4785" y="5" width="39" height="87" transform="rotate(50.8617 63.4785 5)" fill="white" fill-opacity="0.1"/></g></g><defs><linearGradient id="paint0_linear_33_31258" x1="30" y1="0" x2="30" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="%237BA2FD"/><stop offset="1" stop-color="%23014CFA"/></linearGradient><clipPath id="clip0_33_31258"><rect width="60" height="60" fill="white"/></clipPath></defs></svg>');
      background-size: contain;
    background-repeat: no-repeat;
  }
  .success_icon {
    width: 1.2rem;
    height: 1.2rem;
    background-image: url('data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_577_10175)"><path d="M30 0C13.431 0 0 13.431 0 30C0 46.569 13.431 60 30 60C46.566 60 60 46.569 60 30C60 13.431 46.566 0 30 0ZM44.736 21.153C42.105 24.672 32.736 35.667 27.924 40.677C25.812 42.342 24.756 41.454 24.267 40.995C21.324 38.01 17.625 33.201 16.053 30.879C15.708 30.537 15.816 30.153 16.11 29.838L17.82 28.065C18.21 27.729 18.501 27.768 18.963 28.104L25.374 33.099C26.088 33.654 25.686 33.723 26.58 32.898L42.06 18.621C43.11 17.784 43.968 19.02 43.56 18.594L44.754 19.839C44.9064 20.025 44.9881 20.2589 44.9848 20.4993C44.9815 20.7397 44.8934 20.9712 44.736 21.153Z" fill="url(%23paint0_linear_577_10175)"/><mask id="mask0_577_10175" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="60" height="60"><path d="M30 0C13.431 0 0 13.431 0 30C0 46.569 13.431 60 30 60C46.566 60 60 46.569 60 30C60 13.431 46.566 0 30 0ZM44.736 21.153C42.105 24.672 32.736 35.667 27.924 40.677C25.812 42.342 24.756 41.454 24.267 40.995C21.324 38.01 17.625 33.201 16.053 30.879C15.708 30.537 15.816 30.153 16.11 29.838L17.82 28.065C18.21 27.729 18.501 27.768 18.963 28.104L25.374 33.099C26.088 33.654 25.686 33.723 26.58 32.898L42.06 18.621C43.11 17.784 43.968 19.02 43.56 18.594L44.754 19.839C44.9064 20.025 44.9881 20.2589 44.9848 20.4993C44.9815 20.7397 44.8934 20.9712 44.736 21.153Z" fill="url(%23paint1_linear_577_10175)"/></mask><g mask="url(%23mask0_577_10175)"><rect x="63.4794" y="5" width="39" height="87" transform="rotate(50.8617 63.4794 5)" fill="white" fill-opacity="0.1"/></g></g><defs><linearGradient id="paint0_linear_577_10175" x1="30" y1="0" x2="30" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="%2361E8A0"/><stop offset="1" stop-color="%2318B762"/></linearGradient><linearGradient id="paint1_linear_577_10175" x1="30" y1="0" x2="30" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="%236392FF"/><stop offset="1" stop-color="%23014CFA"/></linearGradient><clipPath id="clip0_577_10175"><rect width="60" height="60" fill="white"/></clipPath></defs></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  </style>
  