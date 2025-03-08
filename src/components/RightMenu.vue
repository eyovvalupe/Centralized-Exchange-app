<template>
  <div
    class="right_menu"
    :class="status ? 'fade_in_action' : 'fade_out_action'"
    :style="{ visibility: rendered ? 'visible' : '' }"
    @click.self="close"
  >
    <div class="main"></div>
  </div>
</template>
<script setup>
  import { computed, onMounted, watch } from 'vue';
  import store from '@/store';

  const rendered = ref(false);
  const status = computed(() => store.state.showRightMenu);

  const close = () => {
    store.commit('setShowRightMenu', false);
  };

  onMounted(() => {
    setTimeout(() => {
      rendered.value = true;
    }, 500);
  });
</script>
<style lang="less">
  .right_menu {
    position: absolute;
    z-index: 2000;
    width: 7.5rem;
    bottom: 0;
    right: 0;
    height: 100vh;
    visibility: hidden;
    display: flex;
    align-items: end;
    justify-content: end;

    .main {
      border-top-left-radius: 0.32rem;
      border-bottom-left-radius: 0.32rem;
      background-color: var(--ex-bg-color9);
      width: 6.8rem;
      height: calc(100vh - 50px);

    }
  }
  .fade_in_action {
    animation-name: fade_in_animation;
    animation-timing-function: ease-in;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
  }

  .fade_out_action {
    animation-name: fade_out_animation;
    animation-timing-function: ease-out;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
  }
  @keyframes fade_in_animation {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes fade_out_animation {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
