<!-- 谷歌验证器 -->
<template>
  <div class="page page_google">
    <Top :title="t('google_auth.page_title')">
      <template #right v-if="from == 'register'">
        <span
          @click="nextStep"
          style="color: #014cfa; font-weight: 400; font-size: 0.28rem"
          >{{ $t("google_auth.from_register_skip") }}</span
        >
      </template>
    </Top>

    <div class="w-full flex flex-col items-center">
      <span class="text-[0.4rem] p-[0.1rem] font-semibold">{{ $t("google_auth.google_title") }}</span>
      <span class="text-[0.24rem] p-[0.04rem] text-[#8f92a1] mb-[0.4rem]"
        >Please back up your key in case you lose it</span
      >
    </div>
    <div class="qrcode">
      <img :src="gg.qrcode" alt="qrcode" v-if="gg.qrcode" />
    </div>

    <div class="code_container" v-if="gg.googlesecret">
      <div class="code_box">
        <div class="code text-[0.32rem] font-semibold">
          {{ gg.googlesecret }}
        </div>
        <div class="re_render" @click="getGoogle"></div>
      </div>
      <div class="copy" @click="copy" v-if="gg.googlesecret">Copy</div>
    </div>
    <div class="w-full h-[1rem] mb-[0.8rem]" v-if="!gg.googlesecret"></div>
    <div class="w-full relative">
      <CodeInput :loading="loading" @submit="(code) => goBind(code)"/>
      <div class="absolute top-[2.3rem] left-[0] text-[#e8503a]" v-if="isSentCodeError">{{ errText }}</div>
    </div>
  </div>
</template>

<script setup>
import Top from "@/components/Top.vue";
import {
  PasswordInput,
  Button,
  showToast,
  showLoadingToast,
  closeToast,
} from "vant";
import { ref, computed, watch } from "vue";
import { _google, _googleBind } from "@/api/api";
import QRCode from "qrcode";
import { _copyTxt } from "@/utils/index";
import router from "@/router";
import store from "@/store";
import { useRoute } from "vue-router";
import CodeInput from "@/components/CodeInput.vue";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const route = useRoute();
const from = ref(route.query.from); // 'register'-表示从注册来

const isSentCodeError = computed(() => store.state.isSentCodeError || false)

const loading = ref(false);
const disabled = computed(() => {
  return !(val.value && val.value.length == 6);
});
const showKeyboard = ref(false);
const val = ref("");
watch(val, (v) => {
  if (v && v.length == 6) {
    showKeyboard.value = false;
  }
  //   if (!v || v.length == 0) {
  //     errText.value = "";
  //   }
  for (let i = 0; i < 6; i++) {
    let inputStyle = document.getElementsByClassName(
      "van-password-input__item"
    )[i].style;
    if (v.length != 6 && i <= v.length) {
      inputStyle.borderColor = "#014CFA";
      inputStyle.color = "#014CFA";
    } else {
      inputStyle.borderColor = "#D0D8E2";
      inputStyle.color = "#666D80";
    }
  }
});

// 获取谷歌状态
const gg = ref({});
const getGoogle = () => {
  if (loading.value) return;
  loading.value = true;
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  _google()
    .then((res) => {
      if (res.code == 200) {
        gg.value = res.data;
        QRCode.toDataURL(res.data.googlesecretqr).then((url) => {
          gg.value.qrcode = url;
        });
      }
    })
    .finally(() => {
      loading.value = false;
      closeToast();
    });
};
getGoogle();

// 绑定
const errText = ref("");
const goBind = (code) => {
  if (loading.value) return;
  errText.value = "";
  loading.value = true;
  _googleBind({
    googlesecret: gg.value.googlesecret,
    googlecode: code,
  })
    .then((res) => {
      if (res.code == 200) {
        store.dispatch("updateUserInfo");
        setTimeout(() => {
          showToast("绑定成功");
        }, 300);
        if (from.value == "register") {
          nextStep();
        } else {
          router.replace({
            name: "googleCode",
          });
        }
      }
    })
    .catch((err) => {
      errText.value = err.message;
      store.commit('setIsSentCodeError', true)
    })
    .finally(() => {
      loading.value = false;
    });
};

const iptRef = ref();
const focus = () => {
  // 聚焦
  showKeyboard.value = true;
  setTimeout(() => {
    iptRef.value && iptRef.value.focus();
  }, 300);
  // setTimeout(() => {
  //     try {
  //         document.querySelector('.page').scrollTo({ top: 99999, behavior: 'smooth' });
  //     } catch {
  //     }
  // }, 100)
};
const blur = () => {
  // 失去焦点
  showKeyboard.value = false;
};
const clear = () => {
  val.value = "";
  errText.value = "";
  showKeyboard.value = false;
};
const copy = () => {
  _copyTxt(gg.value.googlesecret);
  showToast("复制成功");
};

const nextStep = () => {
  router.replace({
    name: "kyc",
    query: route.query,
  });
};
</script>

<style lang="less" scoped>
.page_google {
  padding: 1.52rem 0.32rem 0.4rem 0.32rem;
  height: 100%;
  overflow-y: auto;

  .qrcode {
    width: 3.62rem;
    height: 3.62rem;
    margin: 0 auto 0.4rem auto;
    border: 0.02rem solid #ddd;
    border-radius: 0.3rem;
    overflow: hidden;
  }

  .code_container {
    width: 100%;
    background-color: #f5f7fc;
    border-radius: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.8rem;

    .code_box {
      font-size: 0.28rem;
      line-height: 0.33rem;
      color: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 0.32rem;

      .re_render {
        width: 0.24rem;
        height: 0.24rem;
        margin-left: 0.12rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M11.25 4.87489V2.24989L10.3939 3.10601C9.91589 2.38181 9.26575 1.78747 8.50169 1.37622C7.73762 0.96496 6.88347 0.74963 6.01576 0.749512C3.11626 0.749512 0.765381 3.10001 0.765381 5.99989C0.765381 8.89976 3.11626 11.2503 6.01576 11.2503C7.06067 11.2505 8.08189 10.9389 8.94873 10.3554C9.81558 9.77198 10.4886 8.94315 10.8818 7.97501C10.9267 7.86447 10.9258 7.74061 10.8794 7.63069C10.833 7.52077 10.7448 7.43379 10.6343 7.38889C10.5795 7.36665 10.5209 7.35542 10.4619 7.35582C10.4028 7.35623 10.3444 7.36826 10.2899 7.39125C10.18 7.43766 10.093 7.52584 10.0481 7.63639C9.72223 8.43857 9.16445 9.1253 8.44613 9.60874C7.72781 10.0922 6.88161 10.3504 6.01576 10.3503C3.61313 10.3503 1.66538 8.40251 1.66538 5.99989C1.66538 3.59726 3.61313 1.64951 6.01576 1.64951C7.56788 1.64951 8.96813 2.47076 9.74251 3.75701L8.62501 4.87489H11.25Z" fill="%23014CFA"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

  .tip {
    font-size: 0.24rem;
    line-height: 0.28rem;
    color: #999999;
    font-weight: 400;
    margin-bottom: 0.3rem;
    text-align: center;
  }

  .copy {
    width: 1.6rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.48rem;
    border-radius: 0.32rem;
    background-color: #014cfa;
    overflow: hidden;
  }

  .subtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    font-size: 0.32rem;
    color: #000000;
    margin-bottom: 0.48rem;

    .clearIcon {
      width: 0.4rem;
      height: 0.4rem;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none"><path d="M17.0276 6.2172L13.9791 4.66798L15.6865 1.28376C15.8013 1.1662 15.866 1.00867 15.867 0.844341C15.868 0.680009 15.8052 0.521697 15.6919 0.40274C15.5748 0.286448 15.4172 0.220012 15.2522 0.217367C15.0872 0.214722 14.9275 0.276073 14.8068 0.388552L12.9164 4.12951L10.2882 2.79987C10.0064 2.65799 9.7416 2.58637 9.50175 2.58637C9.06732 2.58637 8.78423 2.81338 8.66194 3.02823L8.63965 3.07147C6.70735 7.33063 1.13004 9.67709 1.07193 9.70141C0.828709 9.80884 0.657099 9.99936 0.588185 10.2372C0.475355 10.627 0.688854 10.9756 0.732769 11.0419L0.801008 11.1446L10.9861 17.4522C11.3442 17.6725 11.6496 17.7799 11.9185 17.7799C12.1752 17.7799 12.334 17.6813 12.4076 17.6198L12.436 17.5948C16.1189 14.0869 17.3046 8.92985 17.4208 7.74074C17.5194 6.72054 17.2195 6.3503 17.0276 6.2172ZM16.2986 7.62926C16.2979 7.63737 16.183 8.49677 15.7871 9.78924C13.9474 8.88525 9.74565 6.46177 8.36737 5.66183C8.8379 5.06367 9.24332 4.41704 9.57675 3.73291C9.62269 3.7444 9.69092 3.76804 9.78349 3.81399C10.3652 4.10721 14.7453 6.32597 16.0763 7.00025L16.2952 7.11105C16.3107 7.19551 16.3249 7.35631 16.2986 7.62926ZM11.1679 13.3741C11.2865 13.2572 11.3545 13.0984 11.3572 12.9318C11.3598 12.7652 11.2969 12.6043 11.182 12.4836C11.0649 12.3674 10.9074 12.3009 10.7424 12.2983C10.5774 12.2956 10.4177 12.357 10.297 12.4695L8.34102 14.3747C8.31885 14.3962 8.29851 14.4195 8.28021 14.4443L5.30272 12.6005L7.30461 11.2283C7.44174 11.1336 7.53596 10.9885 7.56683 10.8247C7.59769 10.6609 7.5627 10.4916 7.46946 10.3534C7.42326 10.2854 7.36411 10.2272 7.29539 10.1821C7.22668 10.1369 7.14975 10.1058 7.069 10.0904C6.98824 10.0751 6.90525 10.0758 6.82477 10.0925C6.74428 10.1092 6.66788 10.1416 6.59993 10.1879L4.34941 11.7303C4.2822 11.7768 4.225 11.8363 4.18118 11.9053L1.97525 10.5399C3.08733 10.021 5.59797 8.69878 7.6181 6.53677C9.03962 7.36374 13.513 9.94937 15.4203 10.8702C14.8216 12.4728 13.7177 14.7443 11.8225 16.6144C11.7369 16.5783 11.6545 16.5351 11.5759 16.4854L9.37338 15.1213L11.1679 13.3741Z" fill="%238F92A1"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

  .submit {
    width: 100%;
    height: 1.12rem;
    border-radius: 1.2rem;
    font-size: 0.28rem;
    margin-top: 0.4rem;

    :deep(.van-button__text) {
      font-size: 0.32rem;
      line-height: 0.44rem;
    }
  }

  .code_ipt {
    padding: 0;
    margin: 0;

    :deep(.van-password-input__item) {
      border: 0.02rem solid #eceff3;
      background-color: #fff;
      width: 1rem;
      height: 1.2rem;
      box-sizing: border-box;
      border-radius: 0.16rem;
      &:has(.van-password-input__cursor) {
        border: 0.02rem solid #014cfa;
      }
    }
  }

  .error_ipt {
    :deep(.van-password-input__item) {
      border: 0.02rem solid #e8503a;
      border-color: #e8503a;
    }
  }

  .error_text {
    color: #e8503a;
    margin-top: 0.12rem;
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.42rem;
  }

  .cautions {
    padding: 0.4rem 0.3rem;
    background-color: #f6f6f6;
    border-radius: 0.08rem;
    margin-top: 0.4rem;
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.35rem;
    color: #000000;
  }
}
</style>
