<!-- 合约 -->
<template>
  <div class="notification_page">
    {{ console.log(marketNotifiList) }}
    <Top :title="t('消息中心')" />
    <div class="pt-[1.16rem]">
      <Tabs type="custom-card-stake" @change="onChange" v-model="activeTab"
        style="height: calc(var(--vh) * 100 - 1.2rem);" :swipeable="false" animated>
        <Tab :title="'公告'" name="0">
          <div class="noti_tab">
            <div
              class="w-full bg-color3 p-[0.32rem] rounded-[0.4rem] mb-[0.32rem] flex flex-col justify-between relative"
              v-for="(item, i) in publicNotifiList" v-if="publicNotifiList.length">
              <div class="flex flex-col">
                <div class="text-[0.32rem] font-semibold mb-[0.32rem]">
                  {{ item.title }}
                </div>
                <div class="text-[0.28rem] text-color3 mb-[0.36rem] leading-[0.48rem]">
                  <TextEllipsis rows="2" :content="item.content" expand-text="more" collapse-text="less" />
                </div>
                <div class="w-full flex justify-between mb-[0.32rem]"
                  v-if="item.images && item.images.split(';').length">
                  <div class="w-[2rem] h-[1.24rem] rounded-[0.2rem] overflow-hidden"
                    v-for="(url, i) in item.images.split(';')" @click="showPreview(item.images, i)">
                    <img class="!object-fill" v-lazy="getStaticImgUrl(url)" />
                  </div>
                </div>
                <div class="text-[0.24rem] text-color3 mb-[0.32rem]">
                  {{ item.date }}
                </div>
              </div>
              <div
                class="px-[0.48rem] h-[0.74rem] border-primary border-[0.02rem] flex justify-center items-center rounded-[1.6rem] text-primary w-max ripple-primary"
                @click="jump('notification_detail', item)">
                查看详细
              </div>
              <div v-if="!item.read"
                class="absolute right-[0] top-[0] w-[0.24rem] h-[0.24rem] rounded-[0.12rem] bg-[red]">
              </div>
            </div>
            <NoData v-if="!publicNotifiList.length" />
          </div>
        </Tab>
        <Tab :title="'市场活动'" name="1">
          <div class="noti_tab">
            <div
              class="w-full bg-color3 p-[0.32rem] rounded-[0.4rem] mb-[0.32rem] flex flex-col justify-between relative"
              v-for="(item, i) in marketNotifiList" v-if="marketNotifiList.length">
              <div class="flex flex-col">
                <div class="text-[0.32rem] font-semibold mb-[0.32rem]">
                  {{ item.title }}
                </div>
                <div class="text-[0.28rem] text-color3 mb-[0.36rem] leading-[0.48rem]">
                  <TextEllipsis rows="2" :content="item.content" expand-text="more" collapse-text="less" />
                </div>
                <div class="w-full flex justify-between mb-[0.32rem]"
                  v-if="item.images && item.images.split(';').length">
                  <div class="w-[2rem] h-[1.24rem] rounded-[0.2rem] overflow-hidden"
                    v-for="(url, i) in item.images.split(';')" @click="showPreview(item.images, i)">
                    <img class="!object-fill" v-lazy="getStaticImgUrl(url)" />
                  </div>
                </div>
                <div class="text-[0.24rem] text-color3 mb-[0.32rem]">
                  {{ item.date }}
                </div>
              </div>
              <div class="flex">
                <div
                  class="px-[0.48rem] h-[0.74rem] border-primary border-[0.02rem] flex justify-center items-center rounded-[1.6rem] text-primary w-max ripple-primary mr-[0.2rem]"
                  @click="jump('notification_detail', item)">
                  查看详细
                </div>
                <div
                  class="px-[0.48rem] h-[0.74rem] border-primary border-[0.02rem] flex justify-center items-center rounded-[1.6rem] text-primary w-max ripple-primary"
                  :class="item.join ? 'bg-color3 text-color4 ripple-primary' : 'bg-primary text-white ripple-btn'"
                  >
                  {{ item.join ? '已加入活动' : '加入活动' }}
                </div>
              </div>
              <div v-if="!item.read"
                class="absolute right-[0] top-[0] w-[0.24rem] h-[0.24rem] rounded-[0.12rem] bg-[red]">
              </div>
            </div>
            <NoData v-if="!marketNotifiList.length" />
          </div>
        </Tab>
      </Tabs>
    </div>
    <ImagePreview v-model:show="isPreview" :images="previewImages" :startPosition="index" :loop="true"
      @change="onChange" />
  </div>
</template>

<script setup>
import { Tab, Tabs, Icon, TextEllipsis, ImagePreview } from "vant";
import { ref, onMounted, nextTick, computed } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useI18n } from "vue-i18n";
import Top from "@/components/Top.vue";
import { getStaticImgUrl } from "@/utils";
import { _notifiList } from "@/api/api";
import store from "@/store";
import NoData from "@/components/NoData.vue";

const { t } = useI18n();

const route = useRoute();
const loadTab = ref([]);
const active = ref(0);
const onChange = async (val) => {
  // active.value = val;
  // if (loadTab.value.indexOf(val) == -1) {
  //   loadTab.value.push(val);
  // }
  // if (val == 2) {
  // }
};

const isPreview = ref(false)
const previewImages = ref([])
const index = ref(0)
const showPreview = (val, i) => {
  index.value = i
  previewImages.value = val.split(';')
  isPreview.value = true
}

const notifiList = computed(() => store.state.notifiList)
const publicNotifiList = computed(() => notifiList.value.filter(item => item.marke == 0))
const marketNotifiList = computed(() => notifiList.value.filter(item => item.marke == 1))

const back = () => {
  router.back();
};

const jump = (name, item) => {
  store.commit('setNotifiDetailItem', item)
  sessionStorage.setItem('notifiDetailItem', JSON.stringify(item))
  router.push({
    name,
  });
};

defineExpose({});
</script>

<style lang="less" scoped>
.notification_page {
  height: calc(var(--vh) * 100);

  :deep(.van-tabs__nav) {
    margin: 0 0.32rem 0.32rem 0.32rem;
    border-radius: 1rem;
  }

  :deep(.van-tab) {
    border-radius: 1rem;
  }

  .noti_tab {
    padding: 0 0.32rem 0.32rem 0.32rem;
    overflow-y: auto;
  }
}
</style>
