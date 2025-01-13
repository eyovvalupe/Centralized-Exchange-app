<template>
  <div v-if="modalshow" class="fixed inset-0 flex items-center justify-center">
    <div
      class="w-[3.14rem] h-[2.7rem] bg-[rgba(0,0,0,0.7)] rounded-[0.32rem] flex flex-col items-center justify-center transition-opacity duration-300"
      :class="[show ? 'opacity-100' : 'opacity-0 pointer-events-none']">
      <div class="success_icon mb-[0.24rem]">
        <img :src="getStaticImgUrl('/static/img/assets/status_success.svg')" alt="">
      </div>
      <div class="text-white text-[0.36rem] max-w-[1.5rem] text-center ripple-btn">{{ $t("success_toast.message") }}</div>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { computed, watch, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
});
const show = ref(props.showModal);
const modalshow = ref(props.showModal);
setTimeout(() => {
  show.value = false;
}, 1500);
setTimeout(() => {
  modalshow.value = false;
}, 2000);
</script>
<style lang="css">
.success_icon {
  width: 0.88rem;
  height: 0.88rem;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
