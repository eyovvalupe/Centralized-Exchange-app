<!-- 合约 -->
<template>
  <div class="notification_page">
    <Top :title="t('消息中心')" />
    <div class="pt-[0.16rem]">
      <Tabs type="custom-card" v-model:active="active" :swipeable="false" animated :color="'var(--ex-primary-color)'"
        shrink @change="onChange">
        <Tab :title="'系统通知'" name="0">
          <div class="noti_tab">
            <div
              class="w-full bg-color3 p-[0.32rem] rounded-[0.4rem] mb-[0.32rem] flex flex-col justify-between relative">
              <div class="flex flex-col">
                <div class="text-[0.32rem] font-semibold mb-[0.32rem]">
                  消息标题测试消息标题测试消息标题测试
                </div>
                <div class="text-[0.28rem] text-color3 mb-[0.36rem] leading-[0.48rem]">
                  <TextEllipsis rows="2" :content="'摘要内容摘要内容摘要内容摘要内容摘要内容摘要内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容内容内...'"
                    expand-text="more" collapse-text="less" />
                </div>
                <div class="w-full flex justify-between mb-[0.32rem]" v-if="false">
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-1.webp" />
                  </div>
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-2.webp" />
                  </div>
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-2.webp" />
                  </div>
                </div>
                <div class="text-[0.24rem] text-color3 mb-[0.32rem]">
                  2024/11/26 13:00:02
                </div>
              </div>
              <div
                class="px-[0.48rem] h-[0.74rem] border-primary border-[0.02rem] flex justify-center items-center rounded-[1.6rem] text-primary"
                style="width: max-content" @click="jump('notification_detail')">
                查看全部
              </div>
              <div v-if="true" class="absolute right-[0] top-[0] w-[0.24rem] h-[0.24rem] rounded-[0.12rem] bg-[red]">
              </div>
            </div>
            <div
              class="w-full bg-color3 p-[0.32rem] rounded-[0.4rem] mb-[0.32rem] flex flex-col justify-between relative">
              <div class="flex flex-col">
                <div class="text-[0.32rem] font-semibold mb-[0.32rem]">
                  消息标题测试消息标题测试消息标题测试
                </div>
                <div class="text-[0.28rem] text-color3 mb-[0.36rem] leading-[0.48rem]">
                  <TextEllipsis rows="2" :content="'摘要内容摘要内容摘要内容摘要内容摘要内容摘要内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容内容内...'"
                    expand-text="more" collapse-text="less" />
                </div>
                <div class="w-full flex justify-between mb-[0.32rem]" v-if="true">
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-1.webp" />
                  </div>
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-2.webp" />
                  </div>
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-2.webp" />
                  </div>
                </div>
                <div class="text-[0.24rem] text-color3 mb-[0.32rem]">
                  2024/11/26 13:00:02
                </div>
              </div>
              <div
                class="px-[0.48rem] h-[0.74rem] border-primary border-[0.02rem] flex justify-center items-center rounded-[1.6rem] text-primary"
                style="width: max-content" @click="jump('notification_detail')">
                查看全部
              </div>
              <div v-if="true" class="absolute right-[0] top-[0] w-[0.24rem] h-[0.24rem] rounded-[0.12rem] bg-[red]">
              </div>
            </div>
            <div
              class="w-full bg-color3 p-[0.32rem] rounded-[0.4rem] mb-[0.32rem] flex flex-col justify-between relative">
              <div class="flex flex-col">
                <div class="text-[0.32rem] font-semibold mb-[0.32rem]">
                  消息标题测试消息标题测试消息标题测试
                </div>
                <div class="text-[0.28rem] text-color3 mb-[0.36rem] leading-[0.48rem]">
                  <TextEllipsis rows="2" :content="'摘要内容摘要内容摘要内容摘要内容摘要内容摘要内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容内容内...'"
                    expand-text="more" collapse-text="less" />
                </div>
                <div class="w-full flex justify-between mb-[0.32rem]" v-if="true">
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-1.webp" />
                  </div>
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-2.webp" />
                  </div>
                  <div class="w-[2rem] rounded-[0.2rem] overflow-hidden">
                    <img src="static/img/noti/noti-2.webp" />
                  </div>
                </div>
                <div class="text-[0.24rem] text-color3 mb-[0.32rem]">
                  2024/11/26 13:00:02
                </div>
              </div>
              <div
                class="px-[0.48rem] h-[0.74rem] border-primary border-[0.02rem] flex justify-center items-center rounded-[1.6rem] text-primary"
                style="width: max-content">
                查看全部
              </div>
              <div v-if="false" class="absolute right-[0] top-[0] w-[0.24rem] h-[0.24rem] rounded-[0.12rem] bg-[red]">
              </div>
            </div>
          </div>
        </Tab>
        <Tab :title="'活动'" name="1">
          <div class="noti_tab">
            <div
              class="w-full h-[3.86rem] bg-color3 p-[0.32rem] rounded-[0.4rem] flex flex-col justify-between relative">
              <div class="flex flex-col">
                <div class="text-[0.32rem] font-semibold mb-[0.32rem]">
                  消息标题测试消息标题测试消息标题测试
                </div>
                <div class="text-[0.28rem] text-color3 mb-[0.36rem] leading-[0.48rem]">
                  摘要内容摘要内容摘要内容摘要内容摘要内容摘要内容内容内容内容内容内容内容内容内容内容内...
                </div>
                <div class="text-[0.24rem] text-color3">
                  2024/11/26 13:00:02
                </div>
              </div>
              <div
                class="px-[0.48rem] h-[0.74rem] border-primary border-[0.02rem] flex justify-center items-center rounded-[1.6rem] text-primary"
                style="width: max-content">
                查看全部
              </div>
              <div class="absolute right-[0] top-[0] w-[0.24rem] h-[0.24rem] rounded-[0.12rem] bg-[red]"></div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { Tab, Tabs, Icon, TextEllipsis } from "vant";
import { ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useI18n } from "vue-i18n";
import Top from "@/components/Top.vue";

const { t } = useI18n();

const route = useRoute();
const loadTab = ref([]);
const active = ref(0);
const onChange = async (val) => {
  active.value = val;
  if (loadTab.value.indexOf(val) == -1) {
    loadTab.value.push(val);
  }
  if (val == 2) {
  }
};

const back = () => {
  router.back();
};

const jump = (url) => {
  router.push({
    name: url,
  });
};

onMounted(() => {
  onChange(active.value);
});

defineExpose({});
</script>

<style lang="less" scoped>
.notification_page {
  height: 100vh;

  :deep(.van-tabs__nav) {
    margin: 0 0.32rem 0.32rem 0.32rem;
    border-radius: 1rem;
  }

  :deep(.van-tab) {
    border-radius: 1rem;
  }

  .noti_tab {
    padding: 0 0.32rem 0.32rem 0.32rem;
    height: 13rem;
    overflow-y: auto;
  }
}
</style>
