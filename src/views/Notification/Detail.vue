<template>
  <div class="notification_detail">
    <div
      class="w-full h-[0.88rem] mb-[0.32rem] flex justify-center items-center relative"
    >
      <div class="absolute left-[0] top-[0.26rem]" @click="back">
        <Icon :name="'arrow-left'" size="0.4rem" />
      </div>
      <span class="text-[0.36rem]">消息中心</span>
    </div>
    <div class="w-full h-[14.5rem]" style="overflow-y: auto;">
      <div class="w-full flex justify-center mb-[0.32rem]">
        <span class="w-[6.02rem] text-[0.4rem] leading-[0.6rem] text-center font-semibold">
          消息标题测试消息标题测试消息标题测试...
        </span>
      </div>
      <div
        class="w-full text-center text-[0.28rem] text-color3 mb-[0.32rem]"
      >
        2024/11/26 13:00:02
      </div>
      <div
        class="w-full text-[0.32rem] text-color mb-[0.32rem] leading-[0.52rem]"
      >
        内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
      </div>
      <div class="w-full rounded-[0.2rem] overflow-hidden mb-[0.32rem]">
        <img src="static/img/noti/noti-3.webp" />
      </div>
      <div
        class="w-full text-[0.32rem] text-color mb-[0.32rem] leading-[0.52rem]"
      >
        内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
      </div>
      <div
        class="w-full text-[0.32rem] text-color mb-[0.32rem] leading-[0.52rem]"
      >
        内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
      </div>
    </div>
  </div>
</template>
<script setup>
import { Tab, Tabs, Icon } from "vant";
import router from "@/router";

const back = () => {
  router.back();
};
</script>
<style lang="less">
.notification_detail {
  padding: 0 0.32rem 0.32rem 0.32rem;
  height: calc(var(--vh) * 100);
}
</style>
