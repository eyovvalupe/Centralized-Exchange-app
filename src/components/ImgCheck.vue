<!-- 图片拖动校验 -->
<template>
  <div class="container">
    <!-- 返回和语言 -->
    <div class="top_icon_container">
      <div class="top_back_container text-[0.48rem]" @click="goBack">
        <Icon name="arrow-left" />
      </div>

      <div class="language_icon_container" @click="goLang">
        <div class="language_icon"></div>
      </div>
    </div>

    <div class="title">安全验证</div>
    <div class="check_title">拖动滑块，使图片角度为正</div>
    <div class="check_pic">
      <img
        class="check_img"
        :style="{ transform: `rotate(${slider * 3.6 - initialRotate}deg)` }"
        :src="`/static/img/common/check${initialImg}.png`"
        alt="img"
      />
    </div>
    <div class="slider_box" style="width: 100%">
      <Slider
        @change="changeSlider"
        @drag-start="activeVal = 0"
        v-model="slider"
        bar-height="40px"
        button-size="40px"
        :active-color="colorMap[sliderStatus]"
      />
    </div>
    <span>&nbsp;</span>

    <div class="status_text" v-if="loading" style="opacity: 0">
      <div class="status_text_icon">
        <img src="/static/img/common/check_default.png" alt="img" />
        <img src="/static/img/common/check_success.png" alt="img" />
        <img src="/static/img/common/check_error.png" alt="img" />
      </div>
    </div>
    <div
      class="status_text status_success"
      v-else-if="sliderStatus == 'success'"
    >
      <span class="check_result">验证成功</span>
    </div>
    <div class="status_text status_error" v-else-if="sliderStatus == 'error'">
      <span class="check_result">验证失败</span>
    </div>
    <div class="status_text" v-else>
      <span class="check_result">待滑动验证</span>
    </div>
  </div>
</template>

<script setup>
import { Slider, showLoadingToast, closeToast, Icon } from "vant";
import { ref, onMounted } from "vue";

const show = ref(false);
const loading = ref(false);
const emits = defineEmits(["success", "goBack"]);
// 跳转多语言
const goLang = () => {
  emits("closeDialog");
  router.push({ name: "language" });
};

const colorMap = ref({
  default: "#014CFA",
  success: "#18B762",
  error: "#ee0a24",
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
  loading.value = true;
  showLoadingToast({
    duration: 0,
    loadingType: "spinner",
  });
  if (
    val * 3.6 >= initialRotate.value - 5 &&
    val * 3.6 <= initialRotate.value + 5
  ) {
    // 成功
    sliderStatus.value = "success";
    setTimeout(() => {
      show.value = false;
      emits("success");
    }, 1200);
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
    background-color: #fff;

    .top_back_container {
      .arrow_icon {
        width: 20px;
        height: 20px;
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
      border-width: 1px;
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

  .top_back {
    position: absolute;
    top: 0.2rem;
    left: 0.2rem;
    color: #161616;
    font-size: 0.4rem;
    width: 0.8rem;
    height: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    color: var(--, #061023);
    font-family: "PingFang SC";
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
    margin-bottom: 8px;
    /* 39.2px */
  }

  .check_title {
    color: var(--, #000);
    text-align: center;
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    /* 21px */
  }

  .check_pic {
    margin: 0.64rem auto;
    width: 219px;
    height: 219px;
    flex-shrink: 0;
    background-color: #d0d8e2;
    padding: 10px;
    border-radius: 219px;
  }

  .status_text {
    margin-top: 0.64rem;
    margin-bottom: 0.64rem;
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--, #333);
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;

    .status_text_icon {
      width: 0.36rem;
      height: 0.36rem;
      margin-right: 0.12rem;
    }
  }

  .status_success {
    color: #008822;
  }

  .status_error {
    color: #ff0000;
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
      // background-image: url('@/assets/slider.png');
      background-size: 100% 100%;
    }
  }

  .check_slider_success {
    :deep(.el-slider__bar) {
      background-color: #17b763;
    }
  }

  .check_slider_error {
    :deep(.el-slider__bar) {
      background-color: #fa6466;
    }
  }
}
</style>
