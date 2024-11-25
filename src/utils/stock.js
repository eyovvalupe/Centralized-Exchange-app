import { _recommend,_marketGet } from "@/api/api";
import store from "@/store";

export const getMarket = ()=>{
  return new Promise(resolve=>{
    _marketGet().then(res=>{
      res.data = res.data || []
      res.data.map(item=>{
        switch(item.market){
          case 'us':
            item.market_name = '美股'
            break;
          case 'japan':
            item.market_name = '日本'
            break;
          case 'india':
            item.market_name = '印度'
            break;
          case 'korea':
            item.market_name = '韩国'
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
          case 'malaysia':
            item.market_name = '马来西亚'
            break;
        }
      })
      sessionStorage.marketListData = JSON.stringify(res.data)
      resolve(res.data)
    }) 
  })
}

const getArr = (data,key)=>{
    const arr = data.map((item) => {
      const target = store.state[key].find(
        (a) => a.symbol == item.symbol
      );
      return target || item;
    });
    return arr
}

const subs = () => {
  store.commit("setMarketWatchKeysByPage")
  store.dispatch("subList", {});
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

export const getData = (region,pageLoading,loadingType=1) => {

    const marketKeys = {
        "us":"StockUs",
        "india":"StockIndia",
        "japan":"StockJapan",
        "korea":"StockKorea",
        "germany":"StockGermany",
        "uk":"StockUk",
        "singapore":"StockSingapore",
        "hongkong":"StockHongkong",
        "malaysia":"StockMalaysia",
    }
    if(!marketKeys[region]){
        pageLoading.value = false
        return
    }
    const key = marketKeys[region]
    pageLoading.value = true;
    if (store.state["market"+key+"IndexList"].length > 0 && loadingType == 1) {
      pageLoading.value = false;//使用静默刷新
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
          
          store.commit("setMarket"+key+"Data", data);
          const indexArr = getArr(res.data.index,'market'+key+'IndexList')
          const listArr = getArr(res.data.stock,'market'+key+'DataList')
          store.commit("setMarket"+key+"IndexList", indexArr)
          store.commit("setMarket"+key+"DataList", listArr)
          subs();
      
      })
      .catch((err) => console.error(err))
      .finally(() => {
        pageLoading.value = false
      });
  };