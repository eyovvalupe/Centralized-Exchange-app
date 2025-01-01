<template>
  <div class="form-item" :class="{ 'form-item--large': size == 'large', 'form-item--scroll': props.hasScroll }">
    <div class="form-item-title" v-if="title">
      <div class="form-item-title_content">
        <!-- <span>{{ title }}</span> -->
        <div style="flex: 1;display: flex;align-items: center;justify-content: flex-start;">
          <slot name="title-icon" />
        </div>
        <span class="form-item-title__right">
          <slot name="title-right" />
        </span>
      </div>

      <div class="right_content right_title" v-if="props.rightContent">
        <slot name="right-content-title" />
      </div>
    </div>
    <div class="form-item-box">
      <div style="flex: 1;display: flex" class="form-item-con">
        <div class="item" :class="{
          disabled_item: disabled,
          item_focus: inputFocus,
          // item_focus2: inputFocus && !tip,
        }" :style="{ background }">
          <!-- 左侧提示 -->
          <span class="ipt_tip ipt_tip--left" v-show="inputFocus">{{ placeholder
            }}</span>
          <!-- 右侧提示 -->
          <span class="ipt_tip" :class="{ 'ipt_tip--right': tipAlign == 'right' }" v-if="tip"
            v-show="inputFocus || props.hasScroll">{{ tip
            }}</span>
          <!-- 右上角模块 -->
          <div class="rt-box" :class="{ 'rt-box-focus': inputFocus && tip }" v-if="hasRT">
            <slot name="rt" />
          </div>

          <!-- 自定义输入框 -->
          <slot v-if="custom" />

          <!-- 输入框 -->
          <input :disabled="disabled" v-else v-model="inputVal" @focus="
            inputFocus = true;
          emit('focus');
          " @blur="
            inputFocus = false;
          inputBlur();
          " :type="inputType == 'digit' ? 'number' : inputType == 'password' && showPassword ? 'text' : inputType"
            @keydown="validateKeydown" class="ipt" @input="onInput" :placeholder="inputFocus ? '' : placeholder" />

          <!-- 密码图标 -->
          <span class="pwd_icon" v-if="inputType == 'password'">
            <img v-if="!showPassword" :src="getStaticImgUrl('/static/img/common/close_eye.svg')"
              @click="showPassword = true" alt="off" />
            <img v-else :src="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="open"
              @click="showPassword = false" />
          </span>

          <!-- 百分比按钮 -->
          <Transition name="opacity">
            <div class="flex items-center" v-show="inputFocus" v-if="percentTags && percentTags.length">
              <span class="percent_tag" v-for="(percent, i) in percentTags" :key="i"
                @click="percentTagClick(percent)">{{
                  percent.label }}</span>
            </div>
          </Transition>

          <!--  输入框右侧 全部按钮或提示 -->
          <span class="put_all put_all_place" v-if="
            showBtn && btnPlaceholder && !inputFocus && btnShowMode == 'focus'
          ">{{ btnPlaceholder }}</span>

          <span @click="emit('btnClick')" v-if="(showBtn && btnShowMode == 'focus') || props.hasScroll" :style="{
            opacity: (inputFocus) ? '1' : '0',
            visibility: (inputFocus) ? '' : 'hidden',
          }" class="put_all">{{ btnText ? btnText : t('trade.stock_position_all') }}</span>

          <span @click="emit('btnClick')" v-else-if="showBtn || props.hasScroll" class="put_all">{{
            btnText ? btnText : t('trade.stock_position_all')
          }}</span>

          <!-- 右侧自定义内容 -->
          <slot name="right-con" />

          <!-- 底部滚动条 -->
          <div class="scroll-box" v-if="props.hasScroll">
            <slot name="scroll" />
          </div>
        </div>
      </div>

      <!-- 输入框外右侧内容 -->
      <div class="right_content right_item" v-if="props.rightContent">
        <slot name="right-content-item" />
      </div>
    </div>


  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Decimal from "decimal.js";
import { nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const showPassword = ref(false);
const emit = defineEmits([
  "update:modelValue",
  "percentTagClick",
  "putAll",
  "change",
  "btnClick",
  "focus",
  "blur",
]);
const props = defineProps({
  rightContent: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Number, Decimal],
    default: "",
  },
  size: {
    type: String,
    default: "",
  },
  max: {
    type: [Number, String],
    default: 99999999999999,
  },
  hasScroll: Boolean, // 是否有滚动条
  hasRT: Boolean, // 是否有右上角模块
  background: String,
  title: String,
  custom: Boolean,
  btnPlaceholder: String,
  placeholder: String,
  percentTags: {
    type: Array,
    default() {
      return [];
    },
  },
  disabled: Boolean,
  btnShowMode: {
    type: String,
    default: "always",
  },
  btnText: {
    type: String,
    default: "",
  },
  showBtn: Boolean,
  tip: String,
  tipAlign: {
    type: String,
    default: "right",
  },
  inputType: {
    type: String,
    default: "text",
  },
  allowZero: {
    type: Boolean,
    default: false,
  },
});
const inputFocus = ref(false);
const inputVal = ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue == inputVal.value) {
      return;
    }
    inputVal.value = props.modelValue;
  }
);

const reg = /^\d$/;
const reg2 = /^[\d\.]$/;
const inputBlur = () => {
  if (props.inputType == "digit" || props.inputType == "number") {
    inputVal.value = inputVal.value
      ? parseFloat(inputVal.value).toString()
      : "";
    if (inputVal.value <= "0" && !props.allowZero) {
      inputVal.value = "";
    }
  }
  emit("update:modelValue", inputVal.value);
  emit("change", inputVal.value);
  emit("blur");
};

const validateKeydown = (e) => {
  if (props.inputType == "digit" && e.key != "Backspace") {
    if (!reg.test(e.key)) {
      e.preventDefault();
    }
  }
};

const onInput = () => {
  if (
    (props.inputType == "digit" || props.inputType == "number") &&
    inputVal.value > props.max
  ) {
    inputVal.value = props.max;
  }
  emit("update:modelValue", inputVal.value);
};
const percentTagClick = (percent) => {
  emit("percentTagClick", percent);
};
</script>

<style lang="less" scoped>
.right_content {
  flex: 1.5;
  flex-shrink: 0;
  margin-left: 0.24rem;
}

.form-item-box {
  display: flex;


  .item {
    flex: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    position: relative;
    height: 1.12rem;
    border-radius: 0.32rem;
    // border: 1px solid var(--ex-border-color2);
    padding: 0 0.24rem;
    transition: 0.3s;
    flex-shrink: 0;
    background-color: var(--ex-bg-color3);

    .ipt_tip {
      color: var(--ex-text-color4);
      font-size: 0.24rem;
      position: absolute;
      left: 0.24rem;
      transition: all ease 0.3s;
    }

    .ipt_tip--right {
      right: 0.24rem;
      left: inherit;
    }

    .ipt_tip--left {
      left: 0.24rem;
      right: inherit;
    }

    .ipt {
      flex: 1;
      height: 100%;
      font-size: 0.32rem;
      padding: 0;
      position: relative;
      z-index: 1;
      width: 100%;
    }

    .rt-box {
      position: absolute;
      top: 0.24rem;
      right: 0.24rem;
      z-index: 999;
      transition: all ease .3s;
      transform-origin: 100% 0;
    }
  }



  .disabled_item {
    // background-color: var(--ex-bg-color2);
    flex: 1;
  }

  .item_focus {
    height: 1.12rem;
    border: 1px solid var(--ex-primary-color);

    .ipt_tip {
      font-size: 0.2rem;
      transform: translateY(-0.36rem);
    }

    .ipt {
      padding-top: 0.24rem;
    }

    .rt-box-focus {
      top: 0.08rem;
      transform: scale(0.8);
    }
  }

  .item_focus2 {
    // border: 1px solid var(--ex-primary-color);
  }

  .percent_tag {
    color: var(--ex-primary-color);
    margin-left: 0.08rem;
    transition: all ease 0.3s;
    border-radius: 0.3rem;
    background: rgb(var(--ex-primary-color-rgb) / 0.1);
    font-size: 0.24rem;
    padding: 0 0.14rem;
    height: 0.4rem;
    line-height: 0.4rem;
    display: block;
  }

  .put_all {
    color: var(--ex-primary-color);
    position: absolute;
    right: 0.32rem;
    font-size: 0.3rem;
    z-index: 9;
    transition: all ease 0.3s;
  }

  .put_all_place {
    color: var(--ex-text-color);
  }

  .pwd_icon {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    right: 0.32rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9;
  }
}

.form-item-title {
  display: flex;
  align-items: center;
  font-size: 0.28rem;
  color: var(--ex-text-color);
  font-weight: 400;
  line-height: 0.36rem;
  margin-top: 0.4rem;
  margin-bottom: 0.12rem;
  justify-content: space-between;

  .form-item-title_content {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  &__right {
    text-align: right;
    font-size: 0.28rem;
    color: var(--ex-text-color2);
  }
}

.form-item--large {
  .item {
    height: 1.12rem;
  }

  .item_focus {
    height: 1.32rem;
  }
}

.form-item--scroll {
  height: 2.28rem;


  .form-item-box {
    height: 100%;

    .item_focus {
      .ipt_tip {
        font-size: 0.22rem;
        transform: translateY(-0.28rem);
      }
    }

    .form-item-con {
      height: 100%;

      .item {
        height: 100%;
        padding-bottom: 0.24rem;

        .scroll-box {
          width: 100%;
          position: absolute;
          height: 0.8rem;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.28rem;
          border-top: 1px solid var(--ex-border-color);
        }

        .put_all {
          transform: translateY(0.12rem);
        }
      }
    }
  }
}
</style>
