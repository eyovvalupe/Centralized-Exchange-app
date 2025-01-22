<template>
  <div class="notifi_modal">
    <Dialog v-model:show="existNotifi" show-cancel-button :cancelButtonText="$t('notifi.btn_cancel')" :confirm-button-text="$t('notifi.btn_see_all')"
      @cancel="cancel" @confirm="jump('notification')">
      <div class="w-full h-[9.36rem] bg-color rounded-[0.32rem] mt-[0.36rem] mb-[0.32rem] p-[0.32rem]">
        <div
          class="w-full text-[0.32rem] text-color leading-[0.52rem] mb-[0.32rem] text-center px-[0.1rem] font-semibold">
          {{ notifiData.title || '--' }}
        </div>
        <div class="w-full text-center text-[0.28rem] text-color3 mb-[0.32rem]">
          {{ notifiData.date || '--' }}
        </div>
        <div class="w-full text-[0.28rem] leading-[0.48rem] text-color mb-[0.32rem]">
          {{ notifiData.content || '--' }}
        </div>
        <div class="flex gap-[4px]">
          <div class="flex-1 h-[2rem] rounded-[0.2rem] overflow-hidden mb-[0.32rem]" v-for="(url, i) in notifiData.images.split(';')">
            <img class="!object-fill" v-lazy="getStaticImgUrl(url)" @click="showPreview(i)"/>
          </div>
        </div>
        <div class="w-full text-[0.28rem] leading-[0.48rem] text-color mb-[0.32rem]">
          {{ notifiData.content || '--' }}
        </div>
      </div>
    </Dialog>
    <ImagePreview 
      v-model:show="isPreview" 
      :images="previewImages" 
      :startPosition="index"
      :loop="true"
      @change="onChange"
    />
  </div>
</template>
<script setup>
import { ImagePreview, Dialog } from "vant";
import { computed, onMounted, ref, watch } from "vue";
import router from "@/router";
import { getStaticImgUrl } from "@/utils";
import store from "@/store";

const jump = (url) => {
  localStorage.setItem('lastExecutionTime', Date.now());
  store.commit('setNotifiOpen', false)
  router.push({
    name: url
  })
}

const notifiData = computed(() => store.state.notifiData)
const notifiOpen = computed(() => store.state.notifiOpen)
const existNotifi = ref(notifiOpen.value)
const cancel = () => {
  localStorage.setItem('lastExecutionTime', Date.now());
  store.commit('setNotifiOpen', false)
}

const isPreview = ref(false)
const index = ref(0)
const previewImages = computed(() => {
  if (!notifiData.value.images) return []
  return notifiData.value.images.split(';').map(url => getStaticImgUrl(url))
})

const showPreview = (i) => {
  index.value = i
  isPreview.value = true
}

const onChange = (current) => {
  // index.value = (current + previewImages.value.length) % previewImages.value.length;
  index.value = current;

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

watch(notifiOpen, (val) => {
  if (val) existNotifi.value = val
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