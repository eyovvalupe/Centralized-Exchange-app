import { ref, computed } from "vue";

import store from "@/store";
import { _search, _watchlist, _futures, _stock, _aiquant } from "@/api/api";
import { getMarket } from "@/utils/stock";

export const useNavDialog = (activeTab) => {
  const token = computed(() => store.state.token);
  const marketList = ref([]);

  const getMarketList = () => {
    if (sessionStorage.marketListData) {
      marketList.value = JSON.parse(sessionStorage.marketListData);
    } else {
      getMarket().then((_data) => {
        marketList.value = _data;
      });
    }
  };

  getMarketList();

  const marketType = computed(() => store.getters.getMarketType);
  const searchStr = ref("");
  const searchResultList = ref([]);

  //   const watchList = computed(() => {
  //     const marketWatchList = store.state.marketWatchList || [];

  //     const watchListResult = [];
  //     marketWatchList.map((item) => {
  //       if (
  //         !searchStr.value ||
  //         (item.symbol && item.symbol.indexOf(searchStr.value) > -1)
  //       ) {
  //         watchListResult.push(item);
  //       }
  //     });
  //     return watchListResult;
  //   });
  const watchList = computed(() => store.state.marketWatchList || []);

  const marketSearchList = computed(() => store.state.marketSearchList || []);
  const futuresSearchList = computed(() => store.state.futuresSearchList || []);

  const cryptoList = computed(() => store.state.futuresSearchList.filter(item => item.type == 'crypto'))
  const forexList = computed(() => store.state.futuresSearchList.filter(item => item.type == 'forex'))
  const blocktradeList = computed(() => store.state.futuresSearchList.filter(item => item.type == 'blocktrade'))

  const forexSearchList = computed(() => store.state.marketForeignList || []);
  const blocktardeSearchList = computed(
    () => store.state.marketCommoditiesList || []
  );
  //   const aiquantSearchList = computed(() => {
  //     const aiSearchList = [];
  //     const _aiquantSearchList = store.state.aiquantSearchList || [];
  //     _aiquantSearchList.map((item) => {
  //       if (
  //         !searchStr.value ||
  //         (item.symbol && item.symbol.indexOf(searchStr.value) > -1)
  //       ) {
  //         aiSearchList.push(item);
  //       }
  //     });
  //     return aiSearchList;
  //   });

  const aiquantSearchList = computed(() => store.state.aiquantSearchList || []);

  const totalList = computed(() => [
    // ...watchList.value,
    ...marketSearchList.value,
    ...futuresSearchList.value,
  ]);

  // 左侧列表弹窗
  const showNavDialog = ref(false);
  const stockActiveTab = ref("all");
  const futureActiveTab = ref('all')
  const navActiveTab = ref("option");
  const showNavDialogFunc = (val = "") => {
    if (!val) {
      if (activeTab.value == 0) {
        navActiveTab.value = "stock";
      } else if (activeTab.value == 1) {
        navActiveTab.value = "contract";
      } else if (activeTab.value == 2) {
        navActiveTab.value = "ai";
      } else {
        navActiveTab.value = "option";
      }
    } else {
      navActiveTab.value = val;
    }

    showNavDialog.value = true;
    goSearch(navActiveTab.value);
  };

  // 自选列表
  let optionSearchTimeout = null;
  const optionLoading = ref(false);
  const getOptionList = () => {
    if (!token.value) return;
    optionLoading.value = true;
    if (optionSearchTimeout) clearTimeout(optionSearchTimeout);
    optionSearchTimeout = setTimeout(() => {
      _watchlist()
        .then((res) => {
          if (res.code == 200) {
            if (watchList.value.length) {
              // 有历史数据就更新
              const rs = res.data.map((item) => {
                const target = watchList.value.find(
                  (a) => a.symbol == item.symbol
                );
                if (target) {
                  Object.assign(target, item);
                  item = target;
                }
                return item;
              });
              store.commit("setMarketWatchList", rs || []);
            } else {
              // 没有就直接提交
              store.commit("setMarketWatchList", res.data || []);
            }
            setTimeout(() => {
              console.error('-------', 9)
              store.dispatch("subList", {
                commitKey: "setMarketWatchList",
                listKey: "marketWatchList",
              });
            }, 100);
          }
        })
        .finally(() => {
          optionLoading.value = false;
        });
    }, 500);
  };

  // 搜索列表

  let searchTimeout = null;
  const searchLoading = ref(false);
  // const goSearch = (type) => {
  //     if(type == 'option'){
  //         getOptionList()
  //         return
  //     }
  //     if (searchTimeout) clearTimeout(searchTimeout);
  //     let s = searchStr.value;

  //     if(type == 'stock'){
  //         store.commit("setMarketSearchList",[])
  //         searchLoading.value = true;
  //         searchTimeout = setTimeout(() => {

  //             _stock({
  //                 name:s,
  //                 market:stockActiveTab.value != 'all' ? stockActiveTab.value : ''
  //             }).then(res=>{
  //                 if (searchStr.value == s) {
  //                     let arr = (res.data || []).map(item => {
  //                         const target = marketSearchList.value.find(a => a.symbol == item.symbol)
  //                         if (target) return {
  //                             ...target,
  //                             ...item
  //                         }
  //                         return item
  //                     })
  //                     store.commit('setMarketSearchList',arr)
  //                     store.dispatch("subList", {
  //                         commitKey: "setMarketSearchList",
  //                         listKey: "marketSearchList",
  //                     });
  //                 }
  //             }).finally(()=>{
  //                 searchLoading.value = false
  //             })
  //         }, s ? 500 : 0);
  //     }else if(type == 'contract'){
  //         searchLoading.value = true;
  //         store.commit("setFuturesSearchList",[])
  //         searchTimeout = setTimeout(() => {

  //             _futures({
  //                 name: s,
  //                 type:''
  //             })
  //             .then((res) => {
  //                 if (searchStr.value == s) {

  //                     let arr = (res.data || []).map(item => {
  //                         const target = futuresSearchList.value.find(a => a.symbol == item.symbol)
  //                         if (target) return {
  //                             ...target,
  //                             ...item
  //                         }
  //                         return item
  //                     })
  //                     store.commit('setFuturesSearchList',arr)
  //                     store.dispatch("subList", {
  //                         commitKey: "setFuturesSearchList",
  //                         listKey: "futuresSearchList",
  //                     });

  //                 }
  //             })
  //             .finally(() => {
  //                 searchLoading.value = false;
  //             });
  //         }, s ? 500 : 0);
  //     }else if(type == 'ai') {
  //         searchLoading.value = true;
  //         searchTimeout = setTimeout(() => {

  //             _aiquant({

  //             })
  //             .then((res) => {
  //                 if (searchStr.value == s) {
  //                     let arr = (res.data || []).map(item => {
  //                         const target = aiquantSearchList.value.find(a => a.symbol == item.symbol)
  //                         if (target) return {
  //                             ...target,
  //                             ...item
  //                         }
  //                         return item
  //                     })
  //                     store.commit('setAiquantSearchList',arr)
  //                     store.dispatch("subList", {
  //                         commitKey: "setAiquantSearchList",
  //                         listKey: "aiquantSearchList",
  //                     });

  //                 }
  //             })
  //             .finally(() => {
  //                 searchLoading.value = false;
  //             });
  //         }, s ? 500 : 0);
  //     }
  // }

  const goSearch = (type) => {
    if (type == "option") {
      getOptionList();
      return;
    }
    if (searchTimeout) clearTimeout(searchTimeout);
    let s = searchStr.value;

    // if (type == "stock") {
    store.commit("setMarketSearchList", []);
    searchLoading.value = true;
    searchTimeout = setTimeout(() => {
      _stock({
        market: stockActiveTab.value != "all" ? stockActiveTab.value : "",
      })
        .then((res) => {
          let arr = (res.data || []).map((item) => {
            const target = marketSearchList.value.find(
              (a) => a.symbol == item.symbol
            );
            item.type = "stock";
            if (target)
              return {
                ...target,
                ...item,
              };
            return item;
          });
          store.commit("setMarketSearchList", arr);
          console.error('-------', 8)
          store.dispatch("subList", {
            commitKey: "setMarketSearchList",
            listKey: "marketSearchList",
          });
        })
        .finally(() => {
          searchLoading.value = false;
        });
    }, 0);
    // } else if (type == "contract") {
    searchLoading.value = true;
    store.commit("setFuturesSearchList", []);
    searchTimeout = setTimeout(() => {
      _futures({
        type: "",
      })
        .then((res) => {
          if (searchStr.value == s) {
            let arr = (res.data || []).map((item) => {
              const target = futuresSearchList.value.find(
                (a) => a.symbol == item.symbol
              );
              if (target)
                return {
                  ...target,
                  ...item,
                };
              return item;
            });
            store.commit("setFuturesSearchList", arr);
            console.error('-------', 7)
            store.dispatch("subList", {
              commitKey: "setFuturesSearchList",
              listKey: "futuresSearchList",
            });
          }
        })
        .finally(() => {
          searchLoading.value = false;
        });
    }, 0);
    // } else if (type == "ai") {
    searchLoading.value = true;
    searchTimeout = setTimeout(() => {
      _aiquant({})
        .then((res) => {
          let arr = (res.data || []).map((item) => {
            const target = aiquantSearchList.value.find(
              (a) => a.symbol == item.symbol
            );
            if (target)
              return {
                ...target,
                ...item,
              };
            return item;
          });
          store.commit("setAiquantSearchList", arr);
          console.error('-------', 6)
          store.dispatch("subList", {
            commitKey: "setAiquantSearchList",
            listKey: "aiquantSearchList",
          });
        })
        .finally(() => {
          searchLoading.value = false;
        });
    }, 0);
    // }
  };

  const searchItem = () => {
    searchResultList.value = searchStr.value && totalList.value.length
      ? totalList.value.filter(
        (item) =>
          item.name.includes(searchStr.value) ||
          item.name.includes(searchStr.value.toUpperCase()) ||
          item.symbol.includes(searchStr.value) ||
          item.name.includes(searchStr.value.toUpperCase())
      )
      : [];
  };

  const cleanItem = () => {
    searchStr.value = ''
    totalList.value = []
    searchResultList.value = []
  }

  const changeTab = (val) => {
    goSearch(val);
  };

  return {
    marketList,
    watchList,
    marketSearchList,
    futuresSearchList,
    cryptoList,
    forexList,
    blocktradeList,
    forexSearchList,
    blocktardeSearchList,
    aiquantSearchList,
    showNavDialog,
    stockActiveTab,
    futureActiveTab,
    navActiveTab,
    searchLoading,
    searchStr,
    optionLoading,
    searchResultList,
    totalList,
    cleanItem,
    searchItem,
    goSearch,
    showNavDialogFunc,
    changeTab,
    getOptionList,
  };
};
