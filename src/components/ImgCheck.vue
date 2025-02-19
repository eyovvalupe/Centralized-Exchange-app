<!-- 图片拖动校验 -->
<template>
  <div class="container">
    <!-- 返回和语言 -->
    <!-- <div class="top_icon_container">
      <div class="top_back_container text-[0.48rem]" @click="goBack">
        <Icon name="arrow-left" />
      </div>

      <div class="language_icon_container" @click="goLang">
        <div class="language_icon">
          <img v-lazy="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
        </div>
      </div>
    </div> -->
    <Top>
      <template #right>
        <div class="w-[0.6rem] h-[0.6rem]" @click="goLang">
          <img v-lazy="getStaticImgUrl('/static/img/user/lang.svg')" alt="" />
        </div>
      </template>
    </Top>

    <div class="security_description">
      <div class="title">{{ $t('register.security') }}</div>
      <div class="check_title text-center">
        {{ $t('register.security_con') }}
      </div>
    </div>
    <div class="check_pic">
      <img
        class="check_img"
        :style="{ transform: `rotate(${slider * 3.6 - initialRotate}deg)` }"
        v-lazy="getStaticImgUrl(`/static/img/user/check${initialImg}.webp`)"
        alt="img"
      />
    </div>
    <div class="slider_box" style="width: 100%">
      <Slider
        @change="changeSlider"
        @drag-start="activeVal = 0"
        v-model="slider"
        bar-height="0.9rem"
        button-size="0.9rem"
        :active-color="colorMap[sliderStatus]"
      />
      <div
        class="added_bar"
        :style="{
          backgroundColor: slider ? colorMap[sliderStatus] : '',
        }"
      ></div>
    </div>
    <span>&nbsp;</span>

    <div class="status_text status_success" v-if="slider && sliderStatus == 'success'">
      <span class="check_result">{{
        $t('register.security_result_success')
      }}</span>
    </div>
    <div class="status_text status_error" v-if="slider && sliderStatus == 'error'">
      <span class="check_result">{{
        $t('register.security_result_failed')
      }}</span>
    </div>
    <div class="status_text" v-if="!slider && sliderStatus == 'default'">
      <span class="check_result">{{
        $t('register.security_result_pending')
      }}</span>
    </div>
    <div class="status_text font-standard" style="color: var(--ex-text-color6);" v-if="slider && sliderStatus == 'default'">
      <span class="check_result">{{
        $t('register.security_result_move')
      }}</span>
    </div>
  </div>
</template>

<script setup>
  import { getStaticImgUrl } from '@/utils/index.js';
  import { Slider, showLoadingToast, closeToast, Icon } from 'vant';
  import { ref, onMounted, watch } from 'vue';
  import router from '@/router';
  import { useI18n } from 'vue-i18n';
  import Top from './Top.vue';

  const { t } = useI18n();

  const show = ref(false);
  const loading = ref(false);
  const emits = defineEmits(['success', 'goBack']);
  const props = defineProps({
    loadingRegister: {
      type: Boolean,
      default: false,
    },
  });
  // 跳转多语言
  const goLang = () => {
    //   emits("closeDialog");
    router.push({ name: 'language' });
  };

  const colorMap = ref({
    default: 'var(--ex-primary-color)',
    success: 'var(--ex-primary-color)',
    error: 'var(--ex-down-color)',
  });

  const open = () => {
    loading.value = true;
    sliderStatus.value = 'default';
    slider.value = 0;
    show.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 600);
  };

  // 验证
  const slider = ref(0);
  const sliderStatus = ref('default');
  const changeSlider = (val) => {
    showLoadingToast({
      duration: 0,
      loadingType: 'circular',
    });
    if (
      val * 3.6 >= initialRotate.value - 10 &&
      val * 3.6 <= initialRotate.value + 10
    ) {
      // 成功
      sliderStatus.value = 'success';
      loading.value = true;
      setTimeout(() => {
        show.value = false;
        emits('success');
      }, 2000);
    } else {
      // 失败
      sliderStatus.value = 'error';
    }
    setTimeout(() => {
      closeToast();
      loading.value = false;
    }, 500);
    setTimeout(() => {
      slider.value = 0;
      sliderStatus.value = 'default';
    }, 1400);
  };

  const goBack = () => {
    emits('goBack');
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

    const slideBtn = document.getElementsByClassName('van-slider__button');
    if (!slideBtn[0]) return;
    slideBtn[0].classList.add('ripple-primary');
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

    .security_description {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.28rem 0 0.6rem 0;

      .title {
        font-size: 0.6rem;
        font-weight: 600;
        line-height: 0.784rem;
        margin-bottom: 0.16rem;
      }

      .check_title {
        font-size: 0.32rem;
        line-height: 0.42rem;
        color: var(--ex-text-color2);
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
      width: 6.3rem !important;
      display: flex;
      justify-content: end;
      position: relative;

      .added_bar {
        position: absolute;
        left: 0.5px;
        top: 0;
        width: 0.9rem;
        height: 100%;
        border-radius: 0.45rem 0 0 0.45rem;
        background-color: var(--ex-bg-color6);
        z-index: 1;
        // transition: all 0.1s ease-in;
      }

      .van-slider {
        width: 5.4rem;
        background-color: var(--ex-bg-color6);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;

        :deep(.van-slider__bar) {
          transition: none !important;
        }

        :deep(.van-slider__button-wrapper) {
          transform: translate3d(0%, -50%, 0);
          border-radius: 50%;
          z-index: 10;
        }

        :deep(.van-slider__button) {
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 50%;
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

    // .check_slider {
    //   :deep(.van-slider__bar) {
    //     height: 1.2rem;
    //     border-radius: 0.6rem;
    //   }

    //   :deep(.van-slider__runway) {
    //     height: 1.2rem;
    //     border-radius: 0.6rem;
    //   }

    //   :deep(.van-slider__button-wrapper) {
    //     top: 0;
    //   }

    //   :deep(.van-slider__button) {
    //     width: 1.2rem;
    //     height: 1.2rem;
    //     border: none;
    //     background-size: 100% 100%;
    //   }
    // }

    // .check_slider_success {
    //   :deep(.van-slider__bar) {
    //     background-color: var(--ex-success-color);
    //   }
    // }

    // .check_slider_error {
    //   :deep(.van-slider__bar) {
    //     background-color: var(--ex-error-color);
    //   }
    // }
  }
</style>
