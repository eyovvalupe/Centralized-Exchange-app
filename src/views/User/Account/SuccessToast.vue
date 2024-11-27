<template>
  <div v-if="modalshow" class="fixed inset-0 flex items-center justify-center">
    <div
      class="w-[3.14rem] h-[2.7rem] bg-[rgba(0,0,0,0.7)] rounded-[0.32rem] flex flex-col items-center justify-center transition-opacity duration-300"
      :class="[show ? 'opacity-100' : 'opacity-0 pointer-events-none']"
    >
      <div class="success_icon mb-[0.24rem]"></div>
      <div class="text-white text-[0.36rem] max-w-[1.5rem] text-center">{{ $t("success_toast.message") }}</div>
    </div>
  </div>
</template>
<script setup>
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
  background-image: url('data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_577_10175)"><path d="M30 0C13.431 0 0 13.431 0 30C0 46.569 13.431 60 30 60C46.566 60 60 46.569 60 30C60 13.431 46.566 0 30 0ZM44.736 21.153C42.105 24.672 32.736 35.667 27.924 40.677C25.812 42.342 24.756 41.454 24.267 40.995C21.324 38.01 17.625 33.201 16.053 30.879C15.708 30.537 15.816 30.153 16.11 29.838L17.82 28.065C18.21 27.729 18.501 27.768 18.963 28.104L25.374 33.099C26.088 33.654 25.686 33.723 26.58 32.898L42.06 18.621C43.11 17.784 43.968 19.02 43.56 18.594L44.754 19.839C44.9064 20.025 44.9881 20.2589 44.9848 20.4993C44.9815 20.7397 44.8934 20.9712 44.736 21.153Z" fill="url(%23paint0_linear_577_10175)"/><mask id="mask0_577_10175" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="60" height="60"><path d="M30 0C13.431 0 0 13.431 0 30C0 46.569 13.431 60 30 60C46.566 60 60 46.569 60 30C60 13.431 46.566 0 30 0ZM44.736 21.153C42.105 24.672 32.736 35.667 27.924 40.677C25.812 42.342 24.756 41.454 24.267 40.995C21.324 38.01 17.625 33.201 16.053 30.879C15.708 30.537 15.816 30.153 16.11 29.838L17.82 28.065C18.21 27.729 18.501 27.768 18.963 28.104L25.374 33.099C26.088 33.654 25.686 33.723 26.58 32.898L42.06 18.621C43.11 17.784 43.968 19.02 43.56 18.594L44.754 19.839C44.9064 20.025 44.9881 20.2589 44.9848 20.4993C44.9815 20.7397 44.8934 20.9712 44.736 21.153Z" fill="url(%23paint1_linear_577_10175)"/></mask><g mask="url(%23mask0_577_10175)"><rect x="63.4794" y="5" width="39" height="87" transform="rotate(50.8617 63.4794 5)" fill="white" fill-opacity="0.1"/></g></g><defs><linearGradient id="paint0_linear_577_10175" x1="30" y1="0" x2="30" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="%2361E8A0"/><stop offset="1" stop-color="%2318B762"/></linearGradient><linearGradient id="paint1_linear_577_10175" x1="30" y1="0" x2="30" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="%236392FF"/><stop offset="1" stop-color="%23014CFA"/></linearGradient><clipPath id="clip0_577_10175"><rect width="60" height="60" fill="white"/></clipPath></defs></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
