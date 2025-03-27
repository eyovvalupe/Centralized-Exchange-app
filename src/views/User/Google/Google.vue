<!-- 谷歌验证器 -->
<template>
  <div class="page page_google">
    <Top :title="t('google_auth.page_title')">
      <template #right v-if="from == 'register'">
        <span @click="confirmNext" style="color: var(--ex-primary-color); font-weight: 400; font-size: 0.28rem">{{
          $t("google_auth.from_register_skip") }}</span>
      </template>
    </Top>

    <div class="w-full flex flex-col items-center">
      <span class="text-[0.4rem] p-[0.1rem] font-semibold">{{
        $t("google_auth.google_title")
      }}</span>
      <span class="text-[0.24rem] p-[0.04rem] text-color3 mb-[0.4rem]">{{ $t('google_auth.google_notice') }}</span>
    </div>
    <div class="qrcode">
      <img :src="gg.qrcode" alt="qrcode" v-if="gg.qrcode" />
    </div>

    <div class="code_container" v-if="gg.googlesecret">
      <div class="code_box">
        <div class="code text-[0.32rem] font-semibold">
          {{ gg.googlesecret }}
        </div>
        <div class="re_render" @click="getGoogle">
          <img v-lazy="getStaticImgUrl('/static/img/market/refresh_big.svg')" alt="">
        </div>
      </div>
      <div class="copy" @click="copy" v-if="gg.googlesecret">Copy</div>
    </div>
    <div class="w-full h-[1rem] mb-[0.8rem]" v-if="!gg.googlesecret"></div>
    <div class="w-full relative">
      <CodeInput :loading="loading" @submit="(code) => goBind(code)" />
      <div class="absolute top-[2.1rem] left-[0] text-down" v-if="isSentCodeError">
        {{ t('google_auth.google_error') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import {
  PasswordInput,
  Button,
  showToast,
  showLoadingToast,
  showConfirmDialog,
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

const { t } = useI18n();
const route = useRoute();
const from = ref(route.query.from); // 'register'-表示从注册来

const isSentCodeError = computed(() => store.state.isSentCodeError || false);

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
      inputStyle.borderColor = "var(--ex-primary-color)";
      inputStyle.color = "var(--ex-primary-color)";
    } else {
      inputStyle.borderColor = "var(--ex-border-color2)";
      inputStyle.color = "var(--ex-text-color2)";
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
    loadingType: "circular",
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
          showToast(t('google_auth.bound_success'));
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
      store.commit("setIsSentCodeError", true);
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
  showToast(t('google_auth.copy_success'));
};

const nextStep = () => {
  router.replace({
    name: "kyc",
    query: route.query,
  });
};

const confirmNext = () => {
  setTimeout(() => {
    showConfirmDialog({
      title: t('google_auth.confirm_title'),
      theme: 'round-button',
      // message: "模拟账号不能进行该操作，去升级？",
    })
      .then(() => {
        router.push({ name: "kyc", query: { from: 'register' } });
      })
      .catch(() => {

      });
  }, 400);
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
    border: 0.02rem solid var(--ex-border-color);
    border-radius: 0.3rem;
    overflow: hidden;
  }

  .code_container {
    width: 100%;
    background-color: var(--ex-bg-color3);
    border-radius: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.8rem;

    .code_box {
      font-size: 0.28rem;
      line-height: 0.33rem;
      color: var(--ex-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 0.32rem;

      .re_render {
        width: 0.24rem;
        height: 0.24rem;
        margin-left: 0.12rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

  .tip {
    font-size: 0.24rem;
    line-height: 0.28rem;
    color: var(--ex-text-color3);
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
    color: var(--ex-text-color--bg-primary);
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.48rem;
    border-radius: 0.32rem;
    background-color: var(--ex-primary-color);
    overflow: hidden;
  }

  .subtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    font-size: 0.32rem;
    color: var(--ex-text-color);
    margin-bottom: 0.48rem;

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
      border: 0.02rem solid var(--ex-border-color);
      background-color: var(--ex-bg-color);
      width: 1rem;
      height: 1.2rem;
      box-sizing: border-box;
      border-radius: 0.16rem;

      &:has(.van-password-input__cursor) {
        border: 0.02rem solid var(--ex-primary-color);
      }
    }
  }

  .error_ipt {
    :deep(.van-password-input__item) {
      border: 0.02rem solid var(--ex-error-color);
      border-color: var(--ex-error-color);
    }
  }

  .error_text {
    color: var(--ex-error-color);
    margin-top: 0.12rem;
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.42rem;
  }

  .cautions {
    padding: 0.4rem 0.3rem;
    background-color: var(--ex-bg-color2);
    border-radius: 0.08rem;
    margin-top: 0.4rem;
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.35rem;
    color: var(--ex-text-color);
  }
}
</style>
