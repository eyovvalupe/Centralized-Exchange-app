<!-- 股票 -->
<template>
  <div class="market_stock_block flex items-center justify-center" v-if="marketLoading">
    <Loading :loading="marketLoading" />
  </div>
  <div class="market_stock_block" :class="{'market_stock_block--hide-nav':marketList.length <= 1}" v-else>
    
    <Tabs
      type="custom-card"
      
      v-model:active="active"
      :swipeable="false"
      animated
      :color="'#014CFA'"
      shrink
      @change="onChange"
    >
      <Tab :title="marketItem.market_name" :name="marketItem.market" v-for="marketItem in marketList" :key="marketItem.market">
        <div class="stock_tab-body">
          
          <StockDescription
            v-if="marketItem.market == 'us' && marketStockUsIndexList.length"
            :list="marketStockUsIndexList"
            :region="marketItem.market"
            :data="usData"
            :loading="pageLoading"
            :active="active"
            @update="update(marketItem.market)"
          />
          <StockDescription
            v-else-if="marketItem.market == 'india' && marketStockIndiaIndexList.length"
            :list="marketStockIndiaIndexList"
            :region="marketItem.market"
            :data="indiaData"
            :loading="pageLoading"
            :active="active"
            @update="update(marketItem.market)"
          />
          <StockDescription
            v-else-if="marketItem.market == 'japan' && marketStockJapanIndexList.length"
            :list="marketStockJapanIndexList"
            :region="marketItem.market"
            :data="japanData"
            :loading="pageLoading"
            :active="active"
            @update="update(marketItem.market)"
          />
          <StockDescription
            v-else-if="marketItem.market == 'korea' && marketStockKoreaIndexList.length"
            :list="marketStockKoreaIndexList"
            :region="marketItem.market"
            :data="koreaData"
            :loading="pageLoading"
            :active="active"
            @update="update(marketItem.market)"
          />
        </div>
      </Tab>
      
    </Tabs>
  </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _recommend,_marketGet } from "@/api/api";
import store from "@/store";
import Loading from "@/components/Loaidng.vue";
import StockDescription from "@/components/StockDescription.vue";

const active = ref('');

const usData = computed(() => store.state.marketStockUsData);
const indiaData = computed(() => store.state.marketStockIndiaData);
const japanData = computed(() => store.state.marketStockJapanData);
const koreaData = computed(() => store.state.marketStockKoreaData);

const marketList = ref([])
const getMarket = ()=>{
  return new Promise(resolve=>{
    _marketGet().then(res=>{
      res.data = res.data || []
      const _data = []
      res.data.map(item=>{
        switch(item.market){
          case 'us':
            item.market_name = '美股'
            _data.push(item)
            break;
          case 'japan':
            item.market_name = '日本'
            _data.push(item)
            break;
          case 'india':
            item.market_name = '印度'
            _data.push(item)
            break;
          case 'korea':
            item.market_name = '韩国'
            _data.push(item)
            break;
          case 'germany':
            item.market_name = '德国'
            break;
          case 'uk':
            item.market_name = '英国'
            break;
          case 'singapore':
            item.market_name = '新加坡'
            break;
          case 'hongkong':
            item.market_name = '香港'
            break;
          case 'malaysia ':
            item.market_name = '马来西亚'
            break;
        }
      })
      marketList.value = _data
      resolve(_data)
    }) 
  })
}

const onChange = async (region) => {
  active.value = region;
  store.commit("setMarketCurrent",region)
  getData(region);
};
const update = (region) => {
  if (region == 'us'){
    store.commit("setMarketStockUsIndexList", [])
    store.commit("setMarketStockUsDataList", [])
  }
  if (region == 'india'){
    store.commit("setMarketStockIndiaIndexList", [])
    store.commit("setMarketStockIndiaDataList", [])
  }
  if (region == 'japan') {
    store.commit("setMarketStockJapanIndexList", [])
    store.commit("setMarketStockJapanDataList", [])
  }
  if (region == 'korea') {
    store.commit("setMarketStockKoreaIndexList", [])
    store.commit("setMarketStockKoreaDataList", [])
  }
  getData(region);
};
const marketLoading = ref(true);
const pageLoading = ref(true);
const initTab = (_data)=>{
  let stockTab = store.state.marketCurrent || ''
  let hasTab = false
  _data.map(item=>{
    getData(item.market);
    if(stockTab && item.market == stockTab){
      hasTab = true
    }
  })
  if(!hasTab && _data[0]){
    stockTab = _data[0].market
  }
  active.value = stockTab
  store.commit("setMarketCurrent",stockTab)
  marketList.value = _data
  marketLoading.value = false;
}
onMounted(()=>{
  if(sessionStorage.marketListData){
    initTab(JSON.parse(sessionStorage.marketListData))
  }else{
    getMarket().then((_data)=>{
      sessionStorage.marketListData = JSON.stringify(_data)
      initTab(_data)
    })
  }
})

const marketStockUsIndexList = computed(
  () => store.state.marketStockUsIndexList || []
);
const marketStockIndiaIndexList = computed(
  () => store.state.marketStockIndiaIndexList || []
);
const marketStockJapanIndexList = computed(
  () => store.state.marketStockJapanIndexList || []
);
const marketStockKoreaIndexList = computed(
  () => store.state.marketStockKoreaIndexList || []
);


const subs = (arr) => {
  store.commit(
    "setMarketWatchKeys",
    arr.map((item) => item.symbol || "")
  );
  store.dispatch("subList", {});
};

const getArr = (data,key)=>{
  const arr = data.map((item) => {
    const target = store.state[key].find(
      (a) => a.symbol == item.symbol
    );
    return target || item;
  });
  return arr
}
const getData = (region) => {
  pageLoading.value = true;
  if (region == 'us' && marketStockUsIndexList.value.length > 0) {
    pageLoading.value = false;//使用静默刷新
  }
  if (region == 'india' && marketStockIndiaIndexList.value.length > 0) {
    pageLoading.value = false;
  }
  if (region == 'japan' && marketStockJapanIndexList.value.length > 0) {
    pageLoading.value = false;
  }
  if (region == 'korea' && marketStockKoreaIndexList.value.length > 0) {
    pageLoading.value = false;
  }
  
  _recommend({
    market: region,
  })
    .then((res) => {
      const data = {
        region,
        currentts: formatDate(new Date(res.data.currentts)),
        closets: formatDate(new Date(res.data.closets)),
        updated: formatDate(new Date()),
        stock: res.data.stock,
        index:res.data.index
      };
    

      
      if (region == "us") {
        store.commit("setMarketStockUsData", data);
        const usIndexArr = getArr(res.data.index,'marketStockUsIndexList')
        const usArr = getArr(res.data.stock,'marketStockUsDataList')
        store.commit("setMarketStockUsIndexList", usIndexArr)
        store.commit("setMarketStockUsDataList", usArr)
      }
      if (region == "india") {
        store.commit("setMarketStockIndiaData", data);
        const indiaIndexArr = getArr(res.data.index,'marketStockIndiaIndexList')
        const indiaArr = getArr(res.data.stock,'marketStockIndiaDataList')
        store.commit("setMarketStockIndiaIndexList", indiaIndexArr)
        store.commit("setMarketStockIndiaDataList", indiaArr)
      }
      if (region == "japan") {
        store.commit("setMarketStockJapanData", data);
        const japanIndexArr = getArr(res.data.index,'marketStockJapanIndexList')
        const japanArr = getArr(res.data.stock,'marketStockJapanDataList')
        store.commit("setMarketStockJapanIndexList", japanIndexArr)
        store.commit("setMarketStockJapanDataList", japanArr)
      }
      if (region == "korea") {
        store.commit("setMarketStockKoreaData", data);
        const koreaIndexArr = getArr(res.data.index,'marketStockKoreaIndexList')
        const koreaArr = getArr(res.data.stock,'marketStockKoreaDataList')
        store.commit("setMarketStockKoreaIndexList", koreaIndexArr)
        store.commit("setMarketStockKoreaDataList", koreaArr)
      }
      console.log(...store.state.marketStockUsDataList)

      setTimeout(() => {
        subs([
          //指数
          ...store.state.marketStockUsIndexList,
          ...store.state.marketStockIndiaIndexList,
          ...store.state.marketStockJapanIndexList,
          ...store.state.marketStockKoreaIndexList,

          //股票
          ...store.state.marketStockUsDataList,
          ...store.state.marketStockIndiaDataList,
          ...store.state.marketStockJapanDataList,
          ...store.state.marketStockKoreaDataList,

        ]);
      }, 300);

    })
    .catch((err) => console.error(err))
    .finally(() => {
      pageLoading.value = false;
    });
};


function formatDate(date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<style lang="less" scoped>
.market_stock_block {
  height: 4.3rem;
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
      .van-tab--active {
        padding: 0;
      }
    }
  }
}
.market_stock_block--hide-nav {
  height:3.5rem;
  :deep(.van-tabs__wrap) {
    display: none;
  }
}
</style>
