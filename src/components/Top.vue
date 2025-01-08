<!-- 顶部菜单 -->
<template>
  <div class="max-width top">
    <div class="back" @click="clickLeft">
      <div class="w-[0.44rem] h-[0.44rem]">
        <img :src="getStaticImgUrl('/static/img/user/back.svg')" alt="">
      </div>
    </div>

    <!-- <div v-if="from == 'first'" class="back1" @click="() => { }">
      <div class="w-[0.4rem] h-[0.4rem] text-white">
        <img :src="getStaticImgUrl('/static/img/trade/open.svg')" alt="">
      </div>
    </div> -->

    <slot name="title" v-if="slots['title']" />
    <span v-else>{{ props.title }}</span>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import router from '@/router'
import store from '@/store'
import { useSlots } from 'vue'
const slots = useSlots()
const props = defineProps({
  title: {
    // 标题
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'arrow-left',
  },
  searchText: {
    type: String,
    default: ""
  },
  from: {
    type: String,
    default: ""
  },
  backFunc: Function,
})
const marketSearchTextList = computed(() => store.state.marketSearchTextList);
const clickLeft = () => {
  if (props.searchText.length > 0) {
    var prevList = [...marketSearchTextList.value];
    var flag = false;
    prevList.map((item) => {
      if (item.toUpperCase() == props.searchText.toUpperCase())
        flag = true;
    })
    var newList = flag ? prevList : [...prevList, props.searchText];

    store.commit("setMarketSearchTextList", newList);
  }
  if (props.backFunc) return props.backFunc()
  router.back()
}
</script>

<style lang="less" scoped>
.top {
  top: 0;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1.12rem;
  background-color: var(--ex-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.8rem;
  color: var(--ex-text-color);
  font-size: 0.36rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.05;
  z-index: 2000;

  .back {
    position: absolute;
    left: 0.32rem;
    width: 0.7rem;
    height: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.1rem;
    background-color: var(--ex-bg-color6);
  }

  .back1 {
    position: absolute;
    left: 0.32rem;
    width: 0.7rem;
    height: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.3rem;
  }

  .right {
    position: absolute;
    right: 0.32rem;
  }
}
</style>
