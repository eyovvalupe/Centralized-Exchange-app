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
          item_focus: from != 'transfer' ? inputFocus : '', '!h-[1.28rem]': height,
          item_status: inputVal,
        }"
          :style="{ background, paddingBottom: props.hasBot ? '2.6rem' : '', paddingTop: (props.hasLT || props.hasRT) ? '0.5rem' : '', borderColor: errStatus ? 'var(--ex-error-color)' : '' }">
          <!-- 左侧提示 -->
          <span class="ipt_tip ipt_tip--left" :class="from == 'withdraw' ? '!text-[0.28rem] top-[0.5rem]' : ''"
            v-show="inputFocus || inputVal">{{ placeholder }}</span>
          <!-- 右侧提示 -->
          <span class="ipt_tip" :class="{ 'ipt_tip--right': tipAlign == 'right' }" v-if="tip"
            v-show="inputFocus || props.hasScroll">{{ tip }}</span>
          <!-- 左上角模块 -->
          <div class="lt-box" :class="{ 'lt-box-focus': inputFocus }" v-if="hasLT">
            <slot name="lt" />
          </div>
          <!-- 右上角模块 -->
          <div class="rt-box" :class="[inputFocus && tip ? 'rt-box-focus' : '', from == 'toTop' ? '-mt-[0.1rem]' : '']"
            v-if="hasRT">
            <slot name="rt" />
          </div>

          <div class="relative flex flex-1">
            <!-- 自定义输入框 -->
            <slot v-if="custom" />
            <!-- 输入框 -->
            <input :disabled="disabled" :style="{ height: inputHeight }" v-else v-model="inputVal" @focus="
              inputFocus = true;
            emit('focus');
            " @blur="
              inputBlur();
            " :type="inputType == 'digit' || inputType == 'number' ? 'number' : inputType == 'password' && showPassword ? 'text' : inputType" class="ipt" :class="from == 'withdraw' && inputFocus ? 'top-[0.1rem]' : ''"
              @input="onInput" :placeholder="inputFocus ? '' : placeholder" />

            <!-- 密码图标 -->
            <span class="pwd_icon" v-if="inputType == 'password'">
              <img v-if="!showPassword" v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')"
                @click="showPassword = true" alt="off" />
              <img v-else v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="open"
                @click="showPassword = false" />
            </span>

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

            <span @click="emit('btnClick')" v-if="(showBtn && btnShowMode == 'focus')" :style="{
              opacity: (inputFocus) ? '1' : '0',
              visibility: (inputFocus) ? '' : 'hidden',
            }" class="put_all">{{ btnText ? btnText : t('trade.stock_position_all') }}</span>

            <span @click="emit('btnClick')" v-else-if="from != 'withdraw' && (showBtn)"
              class="put_all">{{
                btnText ? btnText : t('trade.stock_position_all')
              }}</span>

            <div class="flex flex-col" v-else-if="from == 'withdraw' && (showBtn || props.hasScroll)">
              <div class="flex text-end flex-col text-[0.28rem]" v-if="inputFocus" @click="emit('btnClick')">
                <span class="mb-[0.15rem] text-color5">≤{{ balance }}</span>
                <span class="text-primary">{{ t('trade.stock_position_all') }}</span>
              </div>
              <div class="text-[0.32rem]" v-else>
                {{ cryptoCurrency }}
              </div>
            </div>
          </div>

          <!-- 右侧自定义内容 -->
          <slot name="right-con" />

          <!-- 底部滚动条 -->
          <div class="scroll-box" :class="{ 'mid-scroll': props.hasBot }" v-if="props.hasScroll">
            <slot name="scroll" />
          </div>

          <!-- 滚动条下方区域 -->
          <div class="bottom_content" v-if="props.hasBot">
            <slot name="bottom-con" />
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
  "input",
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
  hasLT: Boolean, // 是否有左上角模块
  hasBot: Boolean, // 是否有底部模块，有底部模块输入框会往上移
  background: String,
  title: String,
  custom: Boolean,
  btnPlaceholder: String,
  placeholder: String,
  inputHeight: {
    type: String,
    default: '100%'
  },
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
  from: {
    type: String,
    default: ''
  },
  cryptoCurrency: {
    type: String,
    default: ''
  },
  balance: {
    type: Number,
    default: 0
  },
  height: {
    type: Boolean,
    default: false
  },
  errStatus: {
    type: Boolean,
    default: false
  },
  digits:{
    type:Number,
    default:-1 //-1 不限制小数位 > 0 限制小数位
  }
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

function handlerVal(value, _digits = -1) {
  let reg = /\d+\.?\d{0,}/
  if(_digits == 0){
    reg = /\d+/
  }else if(_digits > 0){
    reg = new RegExp(`\\d+\\.?\\d{0,${_digits}}`)
  }
  const val = (value || '').toString().match(reg) || []
  return val[0] || ''
}
const inputBlur = () => {
  if (props.inputType == "digit" || props.inputType == "number") {
    const val = Number(inputVal.value || '0')
    if (val <= 0 && !props.allowZero) {
      inputVal.value = "";
    }
    if(inputVal.value && props.inputType == "number" && props.digits > 0){
      inputVal.value = Number(inputVal.value).toFixed(props.digits + 1).slice(0,-1)
    }
  }
  console.log('blur')
  emit("update:modelValue", inputVal.value);
  emit("change", inputVal.value);
  emit("blur");
  setTimeout(() => {
    inputFocus.value = false
  }, 30);
};

const onInput = () => {
  if(props.inputType == 'digit'){
    let val = handlerVal(inputVal.value,0)
    //加一层判断，因为input type=number的情况数字输入小数点的时候会返回空，如果也进行重新赋值处理会导致错误
    if(val != inputVal.value){
      inputVal.value = val
    }
  }else if(props.inputType == 'number'){
    let val = handlerVal(inputVal.value,props.digits)
    if(val != inputVal.value){
      inputVal.value = val
    }
  }
  // if (
  //   (props.inputType == "digit" || props.inputType == "number") &&
  //   inputVal.value > props.max
  // ) {
  //   inputVal.value = props.max;
  // }
  emit("update:modelValue", inputVal.value);
  emit('input', inputVal.value)
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
    margin: 0 1px;
    flex: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    position: relative;
    border-radius: 0.32rem;
    border: 1px solid transparent;
    padding: 0 0.24rem;
    transition: 0.3s;
    flex-shrink: 0;
    background-color: var(--ex-bg-white1);
    height: 1.12rem;

    &:has(.ipt:focus) {
      border-color: var(--ex-primary-color) !important;
    }

    .ipt_tip {
      color: var(--ex-text-color4);
      font-size: 0.24rem;
      position: absolute;
      left: 0.24rem;
      transition: all ease-in 0.3s;
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
      height: 0.5rem;
    }

    .rt-box {
      position: absolute;
      top: 0.16rem;
      right: 0.24rem;
      z-index: 999;
      transition: all ease-in .3s;
      transform-origin: 100% 0;
    }

    .lt-box {
      position: absolute;
      top: 0.16rem;
      left: 0.24rem;
      z-index: 999;
      font-size: 0.24rem;
      color: var(--ex-text-color3);
      transition: all ease-in .3s;
      transform-origin: 0 0;
    }

    .lt-box-focus {
      top: 0.08rem;
      transform: scale(0.8);
    }
  }



  .disabled_item {
    background-color: rgba(255,255,255,0.2);
    flex: 1;
  }

  .item_focus,
  .item_status {
    height: 1.12rem;
    

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
  .item_focus {
    border: 1px solid var(--ex-primary-color) !important;
  }
  .percent_tag {
    color: var(--ex-primary-color);
    margin-left: 0.08rem;
    transition: all ease-in 0.3s;
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
    right: 0rem;
    top: 50%;
    line-height: 0.32rem;
    margin-top: -0.16rem;
    font-size: 0.28rem;
    z-index: 9;
    transition: all ease-in 0.3s;
  }

  .put_all_withdraw {
    color: var(--ex-primary-color);
    position: absolute;
    right: 0.32rem;
    font-size: 0.28rem;
    z-index: 9;
    transition: all ease-in 0.3s;
  }

  ._put_all_withdraw {
    position: absolute;
    right: 0.32rem;
    font-size: 0.32rem;
    z-index: 9;
    transition: all ease-in 0.3s;
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
  height: 2.54rem;

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
        padding-bottom: 1.1rem;
        margin: 0 1px;

        .scroll-box {
          width: 100%;
          position: absolute;
          height: 1.14rem;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.1rem 0.28rem 0 0.28rem;
          border-top: 1px solid var(--ex-bg-white2);
        }

        .mid-scroll {
          height: 1.2rem;
          bottom: 1.1rem;
        }

        .bottom_content {
          width: 100%;
          position: absolute;
          height: 1.2rem;
          bottom: 0;
          left: 0;
          border-top: 1px solid var(--ex-bg-white2);
        }

      }
    }
  }
}
</style>
