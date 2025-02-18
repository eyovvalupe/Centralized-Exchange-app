<template>
  <div v-if="list.length" v-for="(item, i) in list" class="currency_list">
    <!-- <div v-if="type == 'cash'"
      class="w-full h-[2.48rem] rounded-[0.32rem] bg-color3  overflow-hidden relative mb-[0.2rem]"
      @click="click(item)">
      <div class="w-[6.46rem] h-[1.4rem] rounded-[0.32rem] absolute bottom-[0.12rem] flex items-center left-[0.12rem] bg-color2">
        <div class="w-full h-[0.8rem] relative flex">
          <div class="w-1/2 h-full flex flex-col items-center justify-between">
            <div class="text-[0.28rem] text-color2">{{ t('assets.wallet_available_sim') }}</div>
            <div class="text-[0.32rem] text-color font-semibold">
              {{ item.amount }}
            </div>
          </div>
          <div class="w-1/2 h-full flex flex-col items-center justify-between">
            <div class="text-[0.28rem] text-color2">{{ t('assets.wallet_blocked_sim') }}</div>
            <div class="text-[0.32rem] text-color font-semibold">
              {{ 0 }}
            </div>
          </div>
        </div>
      </div>
      <div class="px-[0.28rem] mt-[0.28rem] h-[0.52rem] flex items-center">
        <div class="crypto_icon w-[0.52rem] h-[0.52rem] rounded-[0.26rem] mr-[0.2rem] flex items-center justify-center"
          style="background-color: var(--ex-white);">
          <div class=" w-[0.4rem] h-[0.4rem]">
            <CryptoIcon :name="item.name" class="rounded-full" />
          </div>
        </div>
        <div class="text-[15px] text-color">{{ item.name }}</div>
        <div class="absolute right-[0.34rem]">
          <img v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)" class=" rounded-full" alt="">
        </div>
      </div>
    </div> -->
    <div
      class="w-full h-[1.04rem] flex items-center rounded-[0.32rem] bg-color3 mb-[0.12rem] justify-between ripple-btn"
      @click="click(item)"
    >
      <div class="ml-[0.32rem] flex items-center relative mr-[0.08rem]">
        <div class="size-[0.52rem] mr-[0.16rem]">
          <CryptoIcon :name="item.name" />
        </div>
        <div class="text-[0.3rem] text-color">{{ item.name }}</div>
      </div>
      <div
        class="flex gap-[0.08rem] items-center flex-wrap justify-center"
        style="max-width: 30%"
        v-if="item.block"
      >
        <div class="text-[0.32rem] text-color2 mr-[0.08rem]">
          {{ $t('assets.wallet_blocked_sim') }}
        </div>
        <div class="mr-[0.24rem] text-[0.32rem] font-semibold">
          {{ item.block | 8000 }}
        </div>
      </div>
      <div
        class="flex mr-[0.4rem] items-center"
        :style="item.block ? 'max-width: 40%;' : ''"
      >
        <div class="flex-1 flex items-center flex-wrap justify-end">
          <!-- <div class="text-[0.32rem] text-color2 mr-[0.08rem]">
            {{ $t('assets.wallet_available_sim') }}
          </div> -->
          <div class="text-[0.32rem] font-semibold">
            {{ showInfo ? item.amount : '********' }}
          </div>
        </div>
        <div class="ml-[0.24rem] w-[0.28rem] h-[0.28rem]">
          <img
            v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)"
            class="rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { getStaticImgUrl } from '@/utils/index.js';
  import { useI18n } from 'vue-i18n';

  const emits = defineEmits(['click']);
  const props = defineProps({
    list: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      default: '',
    },
    showInfo: Boolean,
  });
  const { t } = useI18n();

  const click = (val) => {
    emits('click', val);
  };
</script>
<style lang="less" scoped>
  .currency_list {
    width: 6.7rem;
    margin: 0 auto;

    .crypto_icon {
      background-color: var(--ex-bg-color);
    }
  }
</style>
