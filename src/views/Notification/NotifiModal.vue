<template>
  <div class="notifi_modal">
    <Dialog
      v-model:show="existNotifi"
      show-cancel-button
      :cancelButtonText="'取消'"
      :confirm-button-text="'查看全部'"
      @cancel=""
      @confirm="jump('notification')"
    >
      <div
        class="w-full h-[9.36rem] bg-[#fff] rounded-[0.32rem] mt-[0.36rem] mb-[0.32rem] p-[0.32rem]"
      >
        <div
          class="w-full text-[0.32rem] text-[#061023] leading-[0.52rem] mb-[0.32rem] text-center px-[0.1rem] font-semibold"
        >
          消息标题测试消息标题测试消息标题测试标题测试标题测试标题测试标题测试标题测试标题测试
        </div>
        <div
          class="w-full text-center text-[0.28rem] text-[#8f92a1] mb-[0.32rem]"
        >
          2024/11/26 13:00:02
        </div>
        <div
          class="w-full text-[0.28rem] leading-[0.48rem] text-[#061023] mb-[0.32rem]"
        >
          内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
        </div>
        <div class="rounded-[0.32rem] overflow-hidden mb-[0.32rem]">
          <img src="static/img/noti/noti-3.webp" />
        </div>
        <div
          class="w-full text-[0.28rem] leading-[0.48rem] text-[#061023] mb-[0.32rem]"
        >
          内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script setup>
import { Tab, Tabs, ActionSheet, Dialog } from "vant";
import { ref } from "vue";
import router from "@/router";

const existNotifi = ref(true);
const jump = (url) => {
    router.push({
        name: url
    })
}
</script>

