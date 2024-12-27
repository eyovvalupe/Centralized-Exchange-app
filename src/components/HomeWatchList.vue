<!-- 自选 -->
<template>
  <div>
    <div class="self_recommend">
      <div class="flex flex-row text-center items-center">
        <span class="text-[0.32rem] font-semibold">{{ $t("home.selfSelectedRecommend") }}</span>
      </div>
      <div class="text_container flex flex-row text-center items-center" @click="more">
        <span style="font-size: 0.24rem; font-weight: 400; color: var(--ex-text-color2)">more+</span>
      </div>
    </div>

    <div class="recommend_block">
      <div class="item_block">
        <HomeStockRecommendList />
      </div>
    </div>
  </div>
</template>

<script setup>
import HomeStockRecommendList from "@/components/HomeStockRecommendList.vue";
import store from "@/store";

store.commit("setCheckState", true);

</script>

<style lang="less" scoped>
.self_recommend {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.24rem;
  padding: 0 0.32rem;

  .text_container {
    width: 0.84rem;
    height: 0.34rem;
    background-color: var(--ex-bg-color2);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 0.32rem;
  }
}

.recommend_block {
  padding: 0 0.22rem;

  .item_block {
    border-radius: 0.452rem;
    margin-bottom: 0.471rem;

    .item_block_title {
      font-size: 0.36rem;
      font-weight: 600;
      line-height: 0.36rem;
      margin-bottom: 0.36rem;
    }
  }
}

@media (min-width: 751px) {
  .one_click_to_favorite_container {
    max-width: 375px;
    overflow-y: auto;
  }
}

.one_click_to_favorite_container {
  position: fixed;
  bottom: 1.866rem;
  width: 100%;
  padding: 0 0.271rem;
  transition: all linear 3s;

  .one_click_to_favorite {
    background-color: var(--ex-primary-color);
    color: #ffffff;
  }
}

.addBtn_container {
  margin-top: 0.4rem;
  margin-bottom: 0.1rem;
  display: flex;
  justify-content: center;
}

.search_block {
  background-color: #f4f5f7;
  // border: 1px solid #eeeff1;
  height: 0.8rem;
  border-radius: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 0.32rem;
  font-size: 0.28rem;
  color: #9ea3ae;
  margin: 0.06rem 0.32rem 0 0.32rem;

  .search_icon {
    width: 0.4rem;
    height: 0.4rem;
    margin-right: 0.2rem;
  }
}

.option_tab {
  // :deep(.van-tab__panel) {
  // height: calc(var(--app-height) - 4.2rem) !important;
  // overflow-y: auto;
  // }

  :deep(.van-tabs__nav--line) {
    padding-bottom: 0;
    border-bottom: 1px solid #3b82f6 !important;
    margin: 0 0.32rem;
  }

  :deep(.van-tabs__line) {
    bottom: -1px;
  }
}
</style>
