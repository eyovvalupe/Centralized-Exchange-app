<template>
    <div class="openSelect">
      <div class="detail-update-title">保证金模式</div>
  
      <div class="select-box">
        <div class="select-box-item"  v-for="i in option1" :class="{'selected-class': selectedOption === i.value}"  :key="i.value"  @click="smallSelect(i.value)">
            {{ i.text }}
            <div v-if="selectedOption === i.value" class="checkmark"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import store from "@/store";
  
  const option1 = [
    { text: "全仓", value: 0 },
    { text: "逐仓", value: 1 },
  ];
  const selectedOption = ref(store.state.allSelect)
  
  const smallSelect = (val)=>{
    //下拉框点击选择
    selectedOption.value = val
    store.commit('setAllSelect',val)
    store.dispatch('closePopup')
  }
  
  </script>
  
  <style lang="less">
  .openSelect {
    .detail-update-title {
      text-align: center;
      margin-top: 0.4rem;
      color: #121826;
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.44rem;
      margin-bottom: 0.36rem;
      text-align: left;
      margin-left: 0.3rem;
    }
    .select-box {
      display: flex;
      padding:  0 0.3rem;
      margin-top: 0.7rem;
      .select-box-item {
        width: 3.5rem;
        height: 0.74rem;
        border-radius: 0.08rem;
        border: 0.02rem solid #f2f2f2;
        text-align: center;
        line-height: 0.74rem;
        color: #061023;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 600;
        background-color: #f2f2f2;
      }
      .select-box-item:first-of-type {
        margin-right: 0.3rem;
      }
      .selected-class {
        color: #1a59f6;
        border: 0.02rem solid #1A59F6;
        background-color: white;
        position: relative;
      }
    }

    .checkmark {
      width: 0;
      height: 0;
      border-top: 0.4rem solid #1a59f6;
      border-left: 0.4rem solid transparent;
      position: absolute;
      top: 0;
      right: 0;
      &:after {
        content: "✓";
        position: absolute;
        top: -0.6rem;
        right: 0px;
        color: white;
        font-size: 0.24rem;
        font-weight: normal;
      }
    }
    
  }
  </style>
  