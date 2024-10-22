<!-- 股票 -->
<template>
    <div class="market_stock_block">
      <Tabs
        v-if="!pageLoading"
        type="custom-card"
        :swipeable="false"
        animated
        :color="'#014CFA'"
        shrink
        @change="onChange"
      >
        <Tab title="美国" name="0">
          <div class="stock_tab-body">
            <StockDescription />
          </div>
        </Tab>
        <Tab title="印度" name="1">
          <div class="stock_tab-body">
            <StockDescription />
          </div>
        </Tab>
        <Tab title="日本" name="2">
          <div class="stock_tab-body">
            <StockDescription />
          </div>
        </Tab>
        <Tab title="韩国" name="3">
          <div class="stock_tab-body">
            <StockDescription />
          </div>
        </Tab>
      </Tabs>
      <!-- <div style="height: 50vh" v-else></div> -->
    </div>
    
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue";
import StockDescription from "@/components/StockDescription.vue";

const pageLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false;
  }, 300);
});

const onChange = () => {
  
}

</script>

<style lang="less" scoped>
  .market_stock_block {
    height: 4.38rem;
    border-radius: 0.64rem;
    background-image: linear-gradient(to bottom, #ffffff, #f5f7fc);

    :deep(.van-tabs__nav) {
      width: 100%;
    }
    .van-tabs {
      :deep(.van-tabs__wrap) {
        padding: 0 0.32rem !important;

        .van-tabs__nav {
          position: relative;
          display: flex;
          justify-content: space-between;

          .van-tab {
            flex: 1;
            text-align: center;
            padding-right: 0;
            font-size: 0.32rem;
            line-height: 0.5rem;
          }
        }
      }
    }
  }

</style>
