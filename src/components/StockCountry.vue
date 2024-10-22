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

  .total_box {
    margin: 0.32rem;
    position: relative;

    .type_box {
      position: absolute;
      top: -0.1rem;
      right: 0;
      display: flex;
      align-items: center;
      color: #253146;
      font-size: 0.24rem;
      border: 1px solid #eee;
      border-radius: 0.08rem;
      padding: 0.08rem 0.16rem;

      .type_icon {
        width: 0.28rem;
        height: 0.28rem;
        opacity: 0.8;
        margin-left: 0.06rem;
      }
    }

    .total_title {
      color: #9ea3ae;
      font-size: 0.28rem;
      margin-bottom: 0.32rem;
    }

    .table_list {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .table_item {
        width: 7%;
        color: #7e879c;
        font-size: 0.18rem;
        text-align: center;

        .item_red {
          color: #fc6c6b;
        }

        .item_green {
          color: #19c09a;
        }

        .table_item_num {
          font-size: 0.2rem;
        }

        .table_item_bar {
          min-height: 5px;
          height: 5px;
          background-color: #87878c;
          transition: all ease 0.3s;
          border-top-left-radius: 0.08rem;
          border-top-right-radius: 0.08rem;
          margin: 0.08rem 0;
        }
      }
    }

    .table_tabs {
      margin-top: 0.08rem;
      height: 0.16rem;
      display: flex;
      align-items: stretch;
      padding: 0 0.12rem;

      .table_tab {
        transform: skew(-30deg);
        position: relative;
      }

      .start_tab {
        background-color: #e8503a;

        .left_radius {
          background-color: #e8503a;
          height: 0.16rem;
          width: 0.5rem;
          border-top-left-radius: 0.16rem;
          border-bottom-left-radius: 0.16rem;
          position: absolute;
          left: -0.12rem;
          transform: skew(30deg);
        }
      }

      .end_tab {
        background-color: #18b762;

        .right_radius {
          background-color: #18b762;
          height: 0.16rem;
          width: 0.5rem;
          border-top-right-radius: 0.16rem;
          border-bottom-right-radius: 0.16rem;
          position: absolute;
          right: -0.12rem;
          transform: skew(30deg);
        }
      }

      .mid_tab {
        background-color: #d9d9d9;
        margin: 0 0.08rem;
        transform: skew(-30deg);
      }
    }
  }
</style>
