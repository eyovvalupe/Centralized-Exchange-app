<template>
  <div class="my_follow_list px-[0.1rem] pt-[0.32rem] pb-[1.6rem]">
    <div class="my-total" v-if="!isEmpty(myCopyData)">
      <div class="info-flex">
        <div class="info-item">
          <div class="name">{{ $t('copy.copy_order_total_profit') }}</div>
          <div class="val">{{ myCopyData.returnamount }}</div>
        </div>
        <div class="info-item" style="text-align: right;">
          <div class="name">{{ $t('copy.copy_order_total_amount') }}</div>
          <div class="val" @click="plus">
            <span>{{ myCopyData.amount }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-[0.12rem] mb-[0.32rem]">
      <div
        class="w-max px-[0.4rem] h-[0.78rem] rounded-[1rem] text-[0.3rem] font-semibold flex items-center justify-center"
        :class="typeChange == 'option' ? 'bg-white text-black ripple-primary' : 'text-color2 ripple-btn'"
        @click="typeChange = 'option'" :style="typeChange == 'option' ? '' : 'background-color: var(--ex-bg-white2)'">{{
          $t('common.option') }}</div>
      <div
        class="w-max px-[0.4rem] h-[0.78rem] rounded-[1rem] text-[0.3rem] font-semibold flex items-center justify-center"
        :class="typeChange == 'future' ? 'bg-white text-black ripple-primary' : 'text-color2 ripple-btn'"
        @click="typeChange = 'future'" :style="typeChange == 'future' ? '' : 'background-color: var(--ex-bg-white2)'">{{
          $t('common.crypto') }}</div>
    </div>
    <div class="list-i" v-if="myFollowList.length" v-for="(item, i) in myFollowList" :key="i">
      <MyFollowItem @openInfo="openInfo" :item="item" :showDetail="false" />
    </div>
    <NoData v-if="!myFollowList.length" />
  </div>
</template>
<script setup>
import store from '@/store';
import { isEmpty } from '@/utils/isEmpty';
import { computed } from 'vue';
import MyFollowItem from '../components/MyFollowItem.vue';
import NoData from '@/components/NoData.vue';

const myCopyData = computed(() => store.state.myCopyData)
const myFollowList = computed(() => store.state.myCopy)

const openInfo = item => {
    showInfo.value = true
}
const typeChange = ref('option')

</script>
<style lang="less">
.my_follow_list {
  .list-i {
    margin-bottom: 0.1rem;
  }

  .my-total {
    border-radius: 0.32rem;
    background: var(--ex-bg-color3);
    padding: 0.12rem;
    margin-bottom: 0.32rem;

    .info-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0.16rem 0;

      .info-item {
        text-align: left;
        padding: 0 0.16rem;

        .name {
          color: var(--ex-placeholder-color);
          font-size: 0.28rem;
          margin-bottom: 0.24rem;
        }

        .val {
          color: var(--ex-white);
          font-weight: bold;
          font-size: 0.36rem;
        }
      }
    }

    .info-box {
      width: 100%;
      border-radius: 0.32rem;
      background-color: var(--ex-bg-white2);
      padding: 0.28rem;

      .info-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 0.52rem;

        .name {
          color: var(--ex-placeholder-color);
        }

        .val {
          display: flex;
          align-items: center;

          .plus {
            width: 0.4rem;
            height: 0.4rem;
            margin-left: 0.12rem;
          }
        }
      }
    }
  }
}
</style>