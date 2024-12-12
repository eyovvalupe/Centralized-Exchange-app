<!-- 合约 -->
<template>
  <div class="page page-constract">
    <div class="coinbuy_content">
      <div class="px-[0.32rem]">
        <HeaderTabs
          v-model:active="activeTab"
          type="small-card"
          :tabs="[
            t('trade.left_all'),
            t('market.market_buy_fast_account_crypto'),
            t('trade.header_forex'),
            t('trade.header_block'),
          ]"
          @change="getList(true)"
        />
      </div>
      <Loaidng :loading="loading" v-if="loading && !contractList.length" />
      <NoData v-if="!loading && !contractList.length" />
      <div
        class="mt-[0.2rem] rounded-[0.32rem]"
        v-for="(item, i) in contractList"
        :key="i"
        @click="goInfo(item)"
      >
        <!-- <div class="td5">
            <div class="flex items-center">
              <div class="item_name flex items-center gap-1">
                {{ item.name }}
              </div>
              <div class="item_type" :class="['item_type--'+item.type]" v-if="activeTab == 0 && typeMap[item.type]">
                {{ typeMap[item.type] }}
              </div>
            </div>
            <div class="item_lever" v-if="item.lever">
              <span v-for="(tag,i) in getLever(item.lever)" v-show="i < 1" :key="tag">
                {{tag}}X
              </span>
            </div>
          </div>
          <div class="td2 spark_line_box">
            <SparkLine v-if="getRealtime(item.symbol,'points')" :style="'width: 100%; height: 0.54rem;'"
              :points="getRealtime(item.symbol,'points')"
              :polylineStrokeWidth="2"
              :ratio="getRealtime(item.symbol,'ratio')" />
          </div>
          <div class="td2 td_r">
            <div class="item_num" :class="getRealtime(item.symbol,'ratio') >= 0 ? 'up' : 'down'">{{ getRealtime(item.symbol,'price') || '--' }}</div>
            <div
              class="item_info_box">
                <div class="item_percent" :class="getRealtime(item.symbol,'ratio') >= 0 ? 'up_bg' : 'down_bg'">
                  {{ getRealtime(item.symbol,'ratio') > 0 ? "+" : "" }}{{ (getRealtime(item.symbol,'ratio') || 0) }}%
                </div>
              </div>
          </div> -->
        <StockItem :item="item" />
        {{ console.log("==========> ", item) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import SparkLine from "@/components/SparkLine.vue";
import { _futures } from "@/api/api";
import { ref, computed } from "vue";
import store from "@/store/index";
import router from "@/router";
import Decimal from "decimal.js";
import NoData from "@/components/NoData.vue";
import Loaidng from "@/components/Loaidng.vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import { useI18n } from "vue-i18n";
import StockItem from "@/components/StockItem.vue";

const { t } = useI18n();
const contractList = computed(() => store.state.contractList || []);
const activeTab = ref(0);

const getRealtime = (symbol, k) => {
  for (let i = 0; i < store.state.realtimeData.length; i++) {
    if (store.state.realtimeData[i].symbol == symbol) {
      return store.state.realtimeData[i][k];
    }
  }
  return "";
};

const typeMap = ref({
  crypto: "合约",
  forex: "外汇",
  blocktrade: "大宗商品",
});

const types = ["", "crypto", "forex", "blocktrade"];
const loading = ref(false);
const getList = (clear = false) => {
  if (clear) {
    store.commit("setContractList", []);
  }
  loading.value = true;
  _futures({
    type: types[activeTab.value],
  })
    .then((res) => {
      const list = res.data.map((item) => {
        const target = contractList.value.find((a) => a.symbol == item.symbol);
        if (target) return target;
        return item;
      });

      store.commit("setContractList", list || []);
      setTimeout(() => {
        store.dispatch("subList", {
          commitKey: "setContractList",
          listKey: "contractList",
        });
      }, 500);
    })
    .finally(() => {
      loading.value = false;
    });
};

getList();

const getLever = (lever) => {
  const arr = lever.split(",") || [];
  arr.sort(function (a, b) {
    return b - a;
  });
  return arr;
};

// 去详情
const goInfo = (item) => {
  store.commit("setCurrConstract", item);
  router.push({
    name: "market_info",
    query: {
      symbol: item.name,
      type: "constract",
    },
  });
};
</script>

<style lang="less" scoped>
.page-constract {
  padding: 0.2rem 0;
  .tr {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 0.2rem;
    border: 1px solid #eff3f8;

    .td5 {
      flex: 5;
      flex-shrink: 0;
      overflow: hidden;

      .item_name {
        font-size: 0.32rem;
        color: #061023;
        line-height: 0.32rem;
        font-weight: 600;
      }

      .item_info {
        font-size: 0.24rem;
        line-height: 0.332rem;
        color: #8f92a1;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        padding-right: 0.4rem;
      }
    }

    .td2 {
      flex-shrink: 0;
      flex: 2;
      overflow: hidden;

      .item_num {
        font-size: 0.3rem;
        font-weight: 600;
        line-height: 0.3rem;
        color: #6c7b90;
      }

      .item_info_box {
        margin-top: 0.1rem;

        .item_percent {
          text-align: center;
          width: 1rem;
          height: 0.4rem;
          line-height: 0.4rem;
          font-size: 0.24rem;
          display: inline-block;
          font-weight: 600;
          color: #fff;
          border-radius: 0.12rem;
        }

        .nodata_percent {
          background-color: #6c7b90;
        }
      }
    }

    .td_r {
      text-align: right;
    }

    .spark_line_box {
      padding-right: 0.4rem;
      padding-left: 0.2rem;
    }
    .item_percent {
      text-align: center;
      width: 1rem;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.24rem;
      display: inline-block;
      font-weight: 600;
      color: #fff;
      border-radius: 0.12rem;
    }
  }

  .coinbuy_content {
    // padding: 0 0.32rem;
  }
  .item_lever {
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
  }
  .item_lever span {
    height: 0.32rem;
    padding: 0 0.08rem;
    border: 1px solid #014cfa;
    border-radius: 0.24rem;
    font-size: 0.22rem;
    color: #014cfa;
    margin-right: 0.08rem;
    display: flex;
    align-items: center;
  }
  .item_type {
    height: 0.3rem;
    border-radius: 0.08rem;
    color: #ffaf2a;
    font-size: 0.22rem;
    background: rgba(255, 175, 42, 0.1);
    display: inline-block;
    align-items: center;
    padding: 0 0.08rem;
    line-height: 0.3rem;
    margin-left: 0.1rem;
  }
  .item_type--forex {
    color: #18b762;
    background: rgba(24, 183, 98, 0.1);
  }

  .item_type--blocktrade {
    color: #6c6cea;
    background: rgba(108, 108, 234, 0.1);
  }
}
</style>
