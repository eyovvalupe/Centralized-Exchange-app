<template>
  <div class="notifi_modal">
    <Dialog v-model:show="existNotifi" show-cancel-button :cancelButtonText="$t('取消')" :confirm-button-text="$t('查看全部')"
      @cancel="" @confirm="jump('notification')">
      <div class="w-full h-[9.36rem] bg-color rounded-[0.32rem] mt-[0.36rem] mb-[0.32rem] p-[0.32rem]">
        <div
          class="w-full text-[0.32rem] text-color leading-[0.52rem] mb-[0.32rem] text-center px-[0.1rem] font-semibold">
          消息标题测试消息标题测试消息标题测试标题测试标题测试标题测试标题测试标题测试标题测试
        </div>
        <div class="w-full text-center text-[0.28rem] text-color3 mb-[0.32rem]">
          2024/11/26 13:00:02
        </div>
        <div class="w-full text-[0.28rem] leading-[0.48rem] text-color mb-[0.32rem]">
          内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
        </div>
        <div class="rounded-[0.32rem] overflow-hidden mb-[0.32rem]">
          <img v-lazy="getStaticImgUrl('static/img/noti/noti-3.webp')" />
        </div>
        <div class="w-full text-[0.28rem] leading-[0.48rem] text-color mb-[0.32rem]">
          内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script setup>
import { Tab, Tabs, ActionSheet, Dialog } from "vant";
import { onMounted, ref } from "vue";
import router from "@/router";
import { getStaticImgUrl } from "@/utils";

const existNotifi = ref(false);
const jump = (url) => {
  router.push({
    name: url
  })
}

onMounted(() => {
  const slideBtn = document.getElementsByClassName('van-dialog__cancel');
  if (slideBtn[0]) {
    slideBtn[0].classList.add('ripple-primary')
  }
  const slideBtn1 = document.getElementsByClassName('van-dialog__confirm');
  if (slideBtn1[0]) {
    slideBtn1[0].classList.add('ripple-btn')
  }
})
</script>

<style lang="less">
.notifi_modal {
  .van-popup.van-popup--center.van-dialog {
    width: 6.3rem;
    background: none;

    .van-hairline--top.van-dialog__footer {
      position: relative;
      top: -0.1rem;
      gap: 0.4rem;
    }

    .van-hairline--top.van-dialog__footer::after {
      content: none;
    }

    button.van-button.van-button--default.van-button--large.van-dialog__confirm.van-hairline--left {
      border-radius: 0.4rem;
      background-color: var(--ex-primary-color);
      width: 2rem !important;

      .van-button__content {
        color: var(--ex-text-color--bg-primary);
      }
    }

    button.van-button.van-button--default.van-button--large.van-dialog__cancel {
      border-radius: 0.4rem;
      background-color: var(--ex-white);

      .van-button__content {
        color: var(--ex-black);
      }
    }

    button.van-button.van-button--default.van-button--large.van-dialog__confirm.van-hairline--left::after {
      content: none;
    }

  }
}
</style>