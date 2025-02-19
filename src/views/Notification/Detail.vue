<template>
  <div class="notification_detail" v-if="!isEmpty(notifiDetailItem)">
    <Top :title="$t('notifi.notifi_center')"></Top>
    <div class="w-full mt-[1.5rem]" style="overflow-y: auto;">
      <div class="w-full flex justify-center mb-[0.32rem]">
        <span class="w-[6.02rem] text-[0.4rem] leading-[0.6rem] text-center font-semibold">
          {{ notifiDetailItem.title }}
        </span>
      </div>
      <div class="w-full text-center text-[0.28rem] text-color3 mb-[0.32rem]">
        {{ notifiDetailItem.date }}
      </div>
      <div class="w-full text-[0.32rem] text-color mb-[0.32rem] leading-[0.52rem]">
        {{ notifiDetailItem.content }}
      </div>
      <div class="flex gap-[0.2rem]" v-if="notifiDetailItem.images && notifiDetailItem.images.split(';').length">
        <div class="flex-1  rounded-[0.2rem] overflow-hidden mb-[0.32rem]"
          v-for="(url, i) in notifiDetailItem.images.split(';')" @click="showPreview(notifiDetailItem.images, i)">
          <img style="height: auto;" class="!object-fill" v-lazy="getStaticImgUrl(url)" />
        </div>
      </div>
      <div class="w-full text-[0.32rem] text-color mb-[0.32rem] leading-[0.52rem]">
        {{ notifiDetailItem.content }}
      </div>
      <div class="w-full text-[0.32rem] text-color mb-[0.6rem] leading-[0.52rem]">
        {{ notifiDetailItem.content }}
      </div>
      <Button v-if="token && notifiDetailItem.marke" class="submit"
        :class="notifiDetailItem.join ? 'joined ripple-primary' : 'unjoined ripple-btn'"
        @click="join(notifiDetailItem)"><span class="text-[0.32rem]">{{
          notifiDetailItem.join ? $t('notifi.notifi_joined') : $t('notifi.notifi_join') }}</span></Button>
    </div>
    <ImagePreview v-model:show="isPreview" :images="previewImages" :startPosition="index" :loop="true"
      @change="onChange" />
  </div>
</template>
<script setup>
import { Tab, Tabs, Icon, ImagePreview, Button } from "vant";
import router from "@/router";
import Top from "@/components/Top.vue";
import { computed } from "vue";
import store from "@/store";
import { isEmpty } from "@/utils/isEmpty";
import { getStaticImgUrl } from "@/utils";
import { _notifiJoin } from "@/api/api";

const token = computed(() => store.state.token)
const notifiDetailItem = computed(() => store.state.notifiDetailItem)
const back = () => {
  router.back();
};

const isPreview = ref(false)
const previewImages = ref([])
const index = ref(0)
const showPreview = (val, i) => {
  index.value = i
  previewImages.value = val.split(';')
  isPreview.value = true
}
const onChange = () => {

}

const joinLoading = ref(false)
const join = (item) => {
  if (item.join || joinLoading.value) return;
  joinLoading.value = true;
  _notifiJoin({
    id: item.id
  }).then(res => {
    console.log('Joined successfully')
    store.dispatch("updateNotifiList")
    store.dispatch("updateNotifiJoinList")
  }).catch(err => console.error(err))
    .finally(() => joinLoading.value = false)
}
</script>
<style lang="less">
.notification_detail {
  padding: 0 0.32rem 0.32rem 0.32rem;

  .submit {
    width: 100%;
    height: 1.12rem;
    border-radius: 1rem;
  }

  .joined {
    color: var(--ex-text-color2);
  }

  .unjoined {
    background-color: var(--ex-primary-color);
  }
}
</style>
