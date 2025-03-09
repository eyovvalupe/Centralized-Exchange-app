<template>
  <div
    class="right_menu"
    :class="status ? 'fade_in_action' : 'fade_out_action'"
    :style="{ visibility: rendered ? 'visible' : '' }"
    @click.self="close"
  >
    <div class="main">
      <div class="item" @click="goNext(item.name)" v-for="(item, i) in itemMap">
        <div class="item_h">
          <div class="img_container">
            <img
              class="img"
              :class="{ '!opacity-[1]': activeItem != item.name }"
              v-lazy="getStaticImgUrl(`static/img/menu/${item.name}.svg`)"
            />
            <img
              class="img"
              :class="{ '!opacity-[1]': activeItem == item.name }"
              v-lazy="getStaticImgUrl(`static/img/menu/${item.name}_white.svg`)"
            />
          </div>
        </div>
        <div class="size-[0.28rem]" v-if="!isEmpty(item.sub)">
          <img
            v-if="activeItem != item.name"
            v-lazy="getStaticImgUrl('static/img/menu/down.svg')"
            alt=""
          />
          <img
            v-if="activeItem == item.name"
            v-lazy="getStaticImgUrl('static/img/menu/up.svg')"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, onMounted, watch } from 'vue';
  import store from '@/store';
  import { getStaticImgUrl } from '@/utils/index.js';
  import { isEmpty } from '../utils/isEmpty';

  const itemMap = [
    { name: 'one_click' },
    { name: 'market',
    sub: ['optional', 'stock', 'spot', 'futures', 'ai', 'forex', 'commodities']
     },
    { name: 'trade',
    sub: ['stockTrade', 'spotTrade', 'futuresTrade', 'aiTrade', 'forexTrade', 'commoditiesTrade']
     },
    { name: 'finance',
    sub: ['copy', 'borrow', 'stake', 'ipo']
     },
    { name: 'assets',
      sub: ['assets', 'deposit', 'withdraw', 'transfer', 'record']
     },
    { name: 'order' },
    { name: 'user',
      sub: ['user', 'account', 'kyc', 'google', 'safety']
     },
    { name: 'referral' },
    { name: 'lang' },
    { name: 'support' },
  ];

  const rendered = ref(false);
  const status = computed(() => store.state.showRightMenu);

  const activeItem = ref('');

  const goNext = (val) => {
    activeItem.value = val;
  };

  const close = () => {
    store.commit('setShowRightMenu', false);
    activeItem.value = '';
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
      padding: 0.26rem 0;
      display: flex;
      flex-direction: column;

      .item {
        width: 100%;
        height: 0.92rem;
        display: flex;
        padding: 0 0.4rem 0 0.32rem;
        justify-content: space-between;
        align-items: center;
        color: var(--ex-white);
        &:hover {
          background-color: var(--ex-bg-white2);
          color: var(--ex-primary-color);
        }

        .item_h {
          height: 0.92rem;
          display: flex;
          gap: 0.16rem;
          align-items: center;

          .img_container {
            width: 0.48rem;
            height: 0.48rem;
            position: relative;

            .img {
              position: absolute;
              top: 0;
              left: 0;
              opacity: 0;
            }
          }
        }
      }
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
