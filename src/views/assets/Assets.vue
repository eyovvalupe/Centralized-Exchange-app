<template>
  <div class="assets">
    <div class="header">
      <div class="title">资产</div>
    </div>

    <div class="assets-tab">
      <div :class="['assets-tab-item',{highlight: selectedTab === i.val}]" v-for="i in tab" :key="i.val" @click="selectTab(i.val)">
        {{ i.text }}
      </div>
    </div>

    <div class="assets-box">
      
    </div>



  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";


// 当前选中的标签
const selectedTab = ref(0);

const tab = [
  {
    text:'总资产',
    val:0
  },
  {
    text:'现金账户',
    val:1
  },
  {
    text:'股票',
    val:2
  },
  {
    text:'合约',
    val:3
  },
  {
    text:'IPO',
    val:4
  },
]


const selectTab = (val) => {
  selectedTab.value = val;
};

</script>

<style lang="less">
.assets {
  position: relative;
  padding-bottom: 1.4rem;
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
    height: 36px;
    display: flex;
    padding: 0 0.3rem;
    margin-bottom: 15px;
    .assets-tab-item {
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      position: relative;
      margin: 0 10px;
    }
    .highlight {
      height: 36px;
      border-radius: 24px;
      background: #F6F8FF;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 36px;
      color: #014cfa;
      padding: 0 23px;
      margin: 0 !important;
      margin-right: 10px !important;
    }
  }
}
</style>
