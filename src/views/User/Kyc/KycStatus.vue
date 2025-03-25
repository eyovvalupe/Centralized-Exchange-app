<!-- 认证状态 -->
<template>
  <div class="page page-auth_status">
    <Top :title="t('kyc.page_title')">
      <!-- 从注册来的 -->
      <template #right v-if="from == 'register'">
        <span @click="nextStep2" style="color: var(--ex-primary-color); font-weight: 400; font-size: 0.28rem">{{
          t('google_auth.from_register_skip') }}</span>
      </template>
      <!-- <template #right>
        <div @click="jump('chat')"
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-color border-[0.02rem] flex items-center justify-center">
          <div class="w-[0.4rem] h-[0.4rem]">
            <img v-lazy="getStaticImgUrl('/static/img/user/server.svg')" alt="server" />
          </div>
        </div>
      </template> -->
    </Top>
    <div class="check_box">
      <!-- v-if="kycInfo.status == 'review'" -->

      <!-- 成功 -->
      <!-- <template v-if="kycInfo.status == 'success'">
        <div class="success_icon">
          <img v-lazy="getStaticImgUrl('/static/img/assets/status_success.svg')" alt="success" />
        </div>
        <div class="text-[0.36rem] text-color mt-[0.24rem] mb-[0.4rem]">
          {{ $t("kyc.status_success") }}
        </div>
      </template> -->
      <!-- 详情 -->
      <template v-if="kycInfo.status == 'review'">
        <div class="rotating review_icon">
          <img v-lazy="getStaticImgUrl('/static/img/assets/status_wait.png')" alt="review">
        </div>
        <div class="text-[0.36rem] text-color my-[0.24rem]">
          {{ $t("kyc.status_pending") }}
        </div>
        <div class="text-color3 text-[0.28rem] mb-[0.4rem]">
          {{ $t("kyc.status_pending_description") }}
        </div>
      </template>
      <!-- 失败 -->
      <template v-if="kycInfo.status == 'failure'">
        <div class="w-[1.2rem] h-[1.2rem] rounded-[50%] overflow-hidden">
          <img v-lazy="getStaticImgUrl('/static/img/assets/status_error.svg')" alt="failure">
        </div>
        <div class="text-[0.36rem] text-color my-[0.24rem]">
          {{ $t("kyc.status_failure") }}
        </div>
        <div class="text-color3 text-[0.28rem] mb-[0.4rem]">
          {{ kycInfo.remarks || "--" }}
        </div>
      </template>
      <div class="bg-color3 rounded-[0.32rem] w-full pt-[0.32rem] mb-[0.8rem] mb-[0.12rem]">
        <div class="px-[0.32rem] mb-[0.3rem] px-[0.2rem]">
          <div class="flex items-center mb-[0.32rem]">
            <div class="text-[0.36rem] leading-[0.5rem] mr-[0.2rem]">
              {{ props.kycInfo ? props.kycInfo.name : "--" }}
            </div>
            <div v-if="kycInfo.status == 'success'" class="size-[0.28rem] mr-[0.12rem] relative top-[-0.03rem]">
              <img v-lazy="getStaticImgUrl('/static/img/assets/status_success.svg')" alt="success" />
            </div>
            <div v-if="kycInfo.status == 'success'" class="text-[0.24rem] text-primary leading-[0.5rem]">{{ $t("kyc.status_success") }}</div>
          </div>
          <div class="text-[0.3rem] mb-[0.2rem] leading-[0.4rem]">
            <span class="text-color3 mr-[0.2rem]">{{
              $t("kyc.status_card_no")
            }}</span>
            <span class="text-color">{{ kycInfo.idnum }}</span>
          </div>
          <div class="text-[0.3rem] leading-[0.4rem]">
            <span class="text-color3 mr-[0.2rem]">{{
              $t("kyc.status_birthday")
            }}</span>
            <span class="text-color">{{ kycInfo.birthday }}</span>
          </div>
        </div>
        <div
          class="w-full bg-white2 rounded-[0.32rem] border-[0.02rem] border-color h-[4.14rem] flex flex-wrap justify-between p-[0.2rem]">
          <div v-if="kycInfo.idimg_1"
            class="w-[2.94rem] h-[1.82rem] overflow-hidden border-[0.02rem] border-color rounded-[0.32rem] mb-[0.1rem]">
            <img :src="kycInfo.idimg_1" style="object-fit: fill !important" alt="img" />
          </div>
          <div v-if="kycInfo.idimg_2"
            class="w-[2.94rem] h-[1.82rem] overflow-hidden border-[0.02rem] border-color rounded-[0.32rem]">
            <img :src="kycInfo.idimg_2" style="object-fit: fill !important" alt="img" />
          </div>
          <div v-if="kycInfo.idimg_3"
            class="w-[2.94rem] h-[1.82rem] overflow-hidden border-[0.02rem] border-color rounded-[0.32rem]">
            <img :src="kycInfo.idimg_3" style="object-fit: fill !important" alt="img" />
          </div>
          <div v-if="!kycInfo.idimg_1"
            class="w-[2.94rem] h-[1.82rem] overflow-hidden border-[0.02rem] border-color rounded-[0.32rem] mb-[0.1rem]">
            <img :src="getStaticImgUrl('static/img/user/default_front.png')" style="object-fit: fill !important"
              alt="img" />
          </div>
          <div v-if="!kycInfo.idimg_2"
            class="w-[2.94rem] h-[1.82rem] overflow-hidden border-[0.02rem] border-color rounded-[0.32rem]">
            <img :src="getStaticImgUrl('static/img/user/default_back.png')" style="object-fit: fill !important"
              alt="img" />
          </div>
          <div v-if="!kycInfo.idimg_3"
            class="w-[2.94rem] h-[1.82rem] overflow-hidden border-[0.02rem] border-color rounded-[0.32rem]">
            <img :src="getStaticImgUrl('static/img/user/default_hand.png')" style="object-fit: fill !important"
              alt="img" />
          </div>
        </div>
      </div>
      <div class="w-full" v-if="kycInfo.status == 'failure'">
        <div @click="nextStep"
          class="w-full h-[1.12rem] flex items-center justify-center rounded-[1rem] bg-primary text-white text-[0.36rem]">
          {{ $t("kyc.status_reverify") }}
        </div>
        <div @click="jump('chat')"
          class="w-full h-[1.12rem] flex items-center justify-center rounded-[1rem] text-primary bg-color text-[0.36rem]">
          {{ $t("kyc.status_service") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const route = useRoute();
const from = ref(route.query.from); // 'register'-表示从注册来

const { t } = useI18n();
const props = defineProps({
  kycInfo: {
    type: Object,
    default: () => { },
  },
});
const emits = defineEmits(["next"]);
const nextStep = () => {
  emits("next");
};
const nextStep2 = () => {
  jump('user')
}
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
      color: var(--ex-text-color);
      margin-top: 0.4rem;
    }

    .reason {
      background-color: var(--ex-bg-color2);
      padding: 0.4rem;
      width: 100%;
      margin-top: 0.64rem;
      color: var(--ex-text-color);
      word-break: break-all;
      line-height: 0.4rem;

      .reason_title {
        color: var(--ex-text-color);
        font-size: 0.32rem;
        margin-bottom: 0.2rem;
      }
    }

    .btn {
      background-color: var(--ex-primary-color);
      height: 0.96rem;
      border-radius: 0.96rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color--bg-primary);
      width: 100%;
    }

    .light_btn {
      background-color: var(--ex-bg-color3);
      color: var(--ex-primary-color);
    }
  }
}

.review_icon {
  width: 1.2rem;
  height: 1.2rem;
  overflow: hidden;
}

.success_icon {
  width: 1.2rem;
  height: 1.2rem;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
