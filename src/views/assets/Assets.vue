<template>
  <div class="assets">
    <div class="header">
      <div class="title">资产</div>
    </div>

    <div class="assets-tab">
      <div :class="['assets-tab-item', { highlight: selectedTab === i.val }]" v-for="i in tab" :key="i.val"
        @click="selectTab(i.val)">
        {{ i.text }}
      </div>
    </div>


    <transition :name="transitionName">
      <Overview v-if="selectedTab == 0"></Overview>
      <Cash v-else-if="selectedTab == 1" />
    </transition>


  </div>
</template>

<script setup>
import { ref } from "vue";
import Overview from "./components/Overview.vue";
import Cash from "./components/Cash.vue"

const transitionName = ref('slide-right')

// 当前选中的标签
const selectedTab = ref(0);
const tab = [
  {
    text: '总资产',
    val: 0
  },
  {
    text: '现金账户',
    val: 1
  },
  {
    text: '股票',
    val: 2
  },
  {
    text: '合约',
    val: 3
  },
  {
    text: 'IPO',
    val: 4
  },
]
const selectTab = (val) => {
  if (val > selectedTab.value) {
    transitionName.value = 'slide-right'
  } else {
    transitionName.value = 'slide-left'
  }
  selectedTab.value = val;
};

</script>

<style lang="less">
.assets {
  position: relative;
  padding-bottom: 1.4rem;
  background-color: white;
  overflow-y: auto;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.28rem;
    padding: 0 0.3rem;
  }

  .title {
    height: 1.12rem;
    color: #0d0d12;
    font-size: 0.56rem;
    font-weight: 600;
    line-height: 1.12rem;
  }

  .assets-tab {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: .32rem;
    padding: 0 0.3rem;

    .assets-tab-item {
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      position: relative;
      margin: 0 0.2rem;
    }

    .highlight {
      height: 0.6rem;
      line-height: 0.6rem;
      border-radius: 0.48rem;
      background: #F6F8FF;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      color: #014cfa;
      padding: 0 0.46rem;
      margin: 0 !important;
      margin-right: 0.2rem !important;
    }
  }
}
</style>
