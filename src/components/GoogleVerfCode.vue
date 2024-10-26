<!-- 谷歌验证弹窗 -->
<template>
    <Popup
      :safe-area-inset-top="true"
      :safe-area-inset-bottom="true"
      v-model:show="show"
      position="bottom"
      teleport="body"
      :close-on-popstate="true"
      :close-on-click-overlay="false"
      class="self_van_popup"
    >
      <div class="google_dialog">
        <div
          class="close-svg-iconB absolute right-0 mr-[0.32rem]"
          @click="close"
        ></div>
        <div class="text-center my-[0.36rem] text-[0.32rem] text-[#121826]">
          谷歌验证码
        </div>
        <div class="text-[0.3rem] mt-[0.34rem] mb-[0.6rem]">请输入6位数代码</div>
        <PasswordInput
          :focused="showKeyboard"
          @focus="focus"
          class="code_ipt"
          :value="val"
          :length="6"
          :gutter="'0.16rem'"
          :mask="false"
        />
        <input
          style="opacity: 0"
          ref="iptRef"
          v-model="val"
          maxlength="6"
          enterkeyhint="done"
          @keydown.enter="submit"
        />
        <div class="btns">
          <div @click="close" class="flex justify-center items-center rounded-[1.6rem] border-[0.02rem] border-[#D0D8E2] text-[#666D80] w-[3.27rem] h-[0.97rem]">取消</div>
          <Button
            :loading="loading"
            :disabled="disabled"
            round
            color="#014CFA"
            class="btn"
            type="primary"
            @click="submit"
            >确认</Button
          >
        </div>
      </div>
    </Popup>
  </template>
  
  <script setup>
  import { Popup, PasswordInput, Button } from "vant";
  import { ref, computed, watch } from "vue";
  const emits = defineEmits(["submit"]);
  
  const loading = ref(false);
  const disabled = computed(() => {
    return !(val.value && val.value.length == 6);
  });
  
  const show = ref(false);
  const showKeyboard = ref(true);
  const val = ref("");
  watch(val, (v) => {
    if (v && v.length == 6) {
      showKeyboard.value = false;
    }
  });
  
  const iptRef = ref();
  const focus = () => {
    showKeyboard.value = true;
    setTimeout(() => {
      iptRef.value && iptRef.value.focus();
    }, 300);
  };
  const close = () => {
    show.value = false;
  };
  const open = () => {
    val.value = "";
    show.value = true;
    // showKeyboard.value = true
  };
  const submit = () => {
    if (disabled.value) return;
    close();
    emits("submit", val.value);
  };
  
  defineExpose({
    open,
  });
  </script>
  
  <style lang="less" scoped>
  .google_dialog {
    background-color: #fefefe;
    padding: 0.28rem 0.32rem 0.8rem 0.32rem;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    position: relative;
    overflow: hidden;
    .btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.6rem;
  
      .btn {
        height: 0.96rem;
        border-radius: 0.96rem;
        width: 3.27rem
      }
    }
  
    .title {
      font-size: 0.32rem;
      line-height: 0.44rem;
      color: #121826;
      margin-bottom: 0.4rem;
      text-align: center;
      font-weight: bold;
    }
  
    .subtitle {
      font-size: 0.28rem;
      line-height: 0.42rem;
      color: #666d80;
      font-weight: 400;
      margin-bottom: 0.4rem;
    }
  
    .code_ipt {
      padding: 0;
      margin: 0;
  
      :deep(.van-password-input__item) {
        border: 1px solid #eceff3;
        background-color: #fff;
        width: 1rem;
        height: 1rem;
        box-sizing: border-box;
        border-radius: 0.16rem;
  
        &:has(.van-password-input__cursor) {
          border: 1px solid #014cfa;
        }
      }
    }
  }
  
  .typing_dialog {
    padding: 0.64rem 0.32rem 5.64rem 0.32rem;
  }
  .close-svg-iconB {
    width: 0.42rem;
    height: 0.4rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"><path d="M10.8729 9.61463L17.0186 3.43813C17.1276 3.32104 17.1869 3.16618 17.1841 3.00617C17.1813 2.84615 17.1165 2.69348 17.0035 2.58032C16.8904 2.46716 16.7379 2.40233 16.5781 2.39951C16.4182 2.39669 16.2635 2.45608 16.1465 2.56518L10.0008 8.7211L3.85504 2.5693C3.73724 2.46783 3.58553 2.41459 3.43021 2.42022C3.2749 2.42586 3.12743 2.48995 3.01728 2.59969C2.90712 2.70944 2.8424 2.85674 2.83604 3.01218C2.82967 3.16762 2.88214 3.31973 2.98296 3.43813L9.1287 9.61463L2.98296 15.7458C2.92525 15.8029 2.87943 15.8709 2.84816 15.9458C2.81688 16.0207 2.80078 16.1011 2.80078 16.1823C2.80078 16.2635 2.81688 16.3439 2.84816 16.4188C2.87943 16.4937 2.92525 16.5617 2.98296 16.6188C3.09865 16.7344 3.25548 16.7994 3.419 16.7994C3.58252 16.7994 3.73935 16.7344 3.85504 16.6188L10.0008 10.467L16.1465 16.6147C16.2622 16.7303 16.419 16.7953 16.5826 16.7953C16.7461 16.7953 16.9029 16.7303 17.0186 16.6147C17.0763 16.5576 17.1221 16.4896 17.1534 16.4147C17.1847 16.3398 17.2008 16.2594 17.2008 16.1782C17.2008 16.097 17.1847 16.0166 17.1534 15.9417C17.1221 15.8667 17.0763 15.7988 17.0186 15.7417L10.8729 9.61463Z" fill="%23161616"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  </style>
  