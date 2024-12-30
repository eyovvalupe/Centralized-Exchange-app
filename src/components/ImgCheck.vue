<!-- 图片拖动校验 -->
<template>
  <div class="container">
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

    <div class="security_description">
      <div class="title">{{ $t("register.security") }}</div>
      <div class="check_title text-center">
        {{ $t("register.security_con") }}
      </div>
    </div>
    <div class="check_pic">
      <img class="check_img" :style="{ transform: `rotate(${slider * 3.6 - initialRotate}deg)` }"
        :src="getStaticImgUrl(`/static/img/user/check${initialImg}.webp`)" alt="img" />
    </div>
    <div class="slider_box" style="width: 100%">
      <Slider @change="changeSlider" @drag-start="activeVal = 0" v-model="slider" bar-height="0.9rem"
        button-size="0.9rem" :active-color="colorMap[sliderStatus]" />
    </div>
    <span>&nbsp;</span>

    <div class="status_text" v-if="loading" style="opacity: 0">
      <div class="status_text_icon">
        <img :src="getStaticImgUrl('/static/img/user/check_default.svg')" alt="img" />
        <img :src="getStaticImgUrl('/static/img/user/check_success.svg')" alt="img" />
        <img :src="getStaticImgUrl('/static/img/user/check_error.svg')" alt="img" />
      </div>
    </div>
    <div class="status_text status_success" v-else-if="sliderStatus == 'success'">
      <span class="check_result">{{
        $t("register.security_result_success")
      }}</span>
    </div>
    <div class="status_text status_error" v-else-if="sliderStatus == 'error'">
      <span class="check_result">{{
        $t("register.security_result_failed")
      }}</span>
    </div>
    <div class="status_text" v-else>
      <span class="check_result">{{
        $t("register.security_result_pending")
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Slider, showLoadingToast, closeToast, Icon } from "vant";
import { ref, onMounted, watch } from "vue";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const show = ref(false);
const loading = ref(false);
const emits = defineEmits(["success", "goBack"]);
const props = defineProps({
  loadingRegister: {
    type: Boolean,
    default: false,
  },
});
// 跳转多语言
const goLang = () => {
  //   emits("closeDialog");
  router.push({ name: "language" });
};

const colorMap = ref({
  default: "var(--ex-primary-color)",
  success: "var(--ex-success-color)",
  error: "var(--ex-error-color)",
});

const open = () => {
  loading.value = true;
  sliderStatus.value = "default";
  slider.value = 0;
  show.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 600);
};

// 验证
const slider = ref(0);
const sliderStatus = ref("default");
const changeSlider = (val) => {
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  if (
    val * 3.6 >= initialRotate.value - 10 &&
    val * 3.6 <= initialRotate.value + 10
  ) {
    // 成功
    sliderStatus.value = "success";
    loading.value = true;
    setTimeout(() => {
      show.value = false;
      emits("success");
    }, 2000);
  } else {
    // 失败
    sliderStatus.value = "error";
  }
  setTimeout(() => {
    closeToast();
    loading.value = false;
  }, 500);
  setTimeout(() => {
    slider.value = 0;
    sliderStatus.value = "default";
  }, 1400);
};

const goBack = () => {
  emits("goBack");
};
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const initialRotate = ref(0);
const initialImg = ref(0);
onMounted(() => {
  initialRotate.value = getRandomNumber(1, 240) + 120;
  initialImg.value = getRandomNumber(1, 6);
  open();
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.32rem;
  padding: 0 1rem;

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
        width: 20px;
        height: 20px;
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

  .security_description {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.28rem 0 0.6rem 0;

    .title {
      font-size: 0.56rem;
      font-weight: 600;
      line-height: 0.784rem;
      margin-bottom: 0.16rem;
    }

    .check_title {
      font-size: 0.28rem;
      line-height: 0.42rem;
    }
  }

  .check_pic {
    width: 4.38rem;
    height: 4.38rem;
    flex-shrink: 0;
    background-color: var(--ex-border-color2);
    padding: 0.2rem;
    border-radius: 2.19rem;
    margin-bottom: 0.8rem;
  }

  .slider_box {
    margin-bottom: 0.28rem;
    height: 0.9rem;

    .van-slider {
      width: 5.9rem;

      :deep(.van-slider__button) {
        box-shadow: 0 0.08rem 0.2rem 0 rgb(var(--ex-primary-color-rgb) / 0.33);
        background-size: contain;
        /* Scale the background image */
        background-repeat: no-repeat;
        /* Prevent repetition */
        background-position: center;
        /* Center the background */
      }
    }
  }

  .status_text {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ex-text-color2);
    font-size: 0.32rem;
    font-weight: 400;
    line-height: 0.32rem;

    .status_text_icon {
      width: 0.36rem;
      height: 0.36rem;
      margin-right: 0.12rem;
    }
  }

  .status_success {
    color: var(--ex-success-color);
  }

  .status_error {
    color: var(--ex-error-color);
  }

  .check_slider {
    :deep(.el-slider__bar) {
      height: 1.2rem;
      border-radius: 0.6rem;
    }

    :deep(.el-slider__runway) {
      height: 1.2rem;
      border-radius: 0.6rem;
    }

    :deep(.el-slider__button-wrapper) {
      top: 0;
    }

    :deep(.el-slider__button) {
      width: 1.2rem;
      height: 1.2rem;
      border: none;
      background-size: 100% 100%;
    }
  }

  .check_slider_success {
    :deep(.el-slider__bar) {
      background-color: var(--ex-success-color);
    }
  }

  .check_slider_error {
    :deep(.el-slider__bar) {
      background-color: var(--ex-error-color);
    }
  }
}
</style>
