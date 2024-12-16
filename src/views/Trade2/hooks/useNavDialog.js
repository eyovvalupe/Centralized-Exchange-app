import { ref,computed } from 'vue'

import store from "@/store";
import { _search, _watchlist,_futures,_stock } from "@/api/api";
import { getMarket } from "@/utils/stock";

export const useNavDialog = (activeTab)=>{
    
    const token = computed(() => store.state.token);
    const marketList = ref([]);

    const getMarketList = ()=>{
        if (sessionStorage.marketListData) {
            marketList.value = JSON.parse(sessionStorage.marketListData)
        } else {
            getMarket().then((_data) => {
                marketList.value = _data
            });
        }
    }

    getMarketList()

    const marketType = computed(() => store.getters.getMarketType);

    const watchList = computed(() => {
        const marketWatchList = store.state.marketWatchList || [];

        const watchListResult = [];
        marketWatchList.map((item) => {
            if (
            (marketType.value == "all" || item.type == marketType.value) &&
            (!searchStr.value ||
                (item.symbol && item.symbol.indexOf(searchStr.value) > -1))
            ) {
            watchListResult.push(item);
            }
        });
        return watchListResult;
    });

    const marketSearchList = computed(() => store.state.marketSearchList || []);

    const futuresSearchList = computed(() => store.state.contractList || []);
    const forexSearchList = computed(() => store.state.marketForeignList || []);
    const blocktardeSearchList = computed(() => store.state.marketCommoditiesList || []);
    const aiquantSearchList = computed(() => store.state.aiquantSearchList || []);
    

    // 左侧列表弹窗
    const showNavDialog = ref(false);
    const navActiveTab = ref("option");
    const showNavDialogFunc = (val='') => {
        navActiveTab.value = val || "option";
        showNavDialog.value = true;
        goSearch(navActiveTab.value);
    };

    const changeTab = (val) => {
        if(activeTab.value == 0){
            store.commit("setMarketSearchList",[])
        }
        goSearch(val);
    };

    
    // 自选列表
    const optionLoading = ref(false);
    const getOptionList = () => {
        if (!token.value) return;
        optionLoading.value = true;
        _watchlist()
            .then((res) => {
            if (res.code == 200) {
                if (watchList.value.length) {
                    // 有历史数据就更新
                    const rs = res.data.map((item) => {
                        const target = watchList.value.find((a) => a.symbol == item.symbol);
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
    };
    
    // 搜索列表
    const searchStr = ref("");
    let searchTimeout = null;
    const searchLoading = ref(false);
    const goSearch = (type) => {
        if(type == 'option'){
            getOptionList()
            return
        }
        if (searchTimeout) clearTimeout(searchTimeout);
        let s = searchStr.value;

        if(activeTab.value == 0){
            searchLoading.value = true;
            //查股票
            searchTimeout = setTimeout(() => {
                
                _stock({
                    name:s,
                    market:type
                }).then(res=>{
                    if (searchStr.value == s) {
                        let arr = (res.data || []).map(item => {
                            const target = marketSearchList.value.find(a => a.symbol == item.symbol)
                            if (target) return {
                                ...target,
                                ...item
                            }
                            return item
                        })
                        store.commit('setMarketSearchList',arr)
                        store.dispatch("subList", {
                            commitKey: "setMarketSearchList",
                            listKey: "marketSearchList",
                        });
                    }
                }).finally(()=>{
                    searchLoading.value = false
                })
            }, s ? 500 : 0);
        }else if(activeTab.value == 1){
            searchLoading.value = true;
            //查合约
            searchTimeout = setTimeout(() => {
                
                _futures({
                    name: s,
                    type
                })
                .then((res) => {
                    if (searchStr.value == s) {
                        let arr = res.data || []
                        switch (type) {
                            case 'crypto':
                            store.commit("setContractList", arr);
                            break
                            case 'foreign':
                            store.commit("setMarketForeignList", arr);
                            break
                            case 'commodities':
                            store.commit("setMarketCommoditiesList", arr);
                            break
                        }
        
                        setTimeout(() => {
                            switch (type) {
                            case 'crypto':
                                store.dispatch("subList", {
                                commitKey: "setContractList",
                                listKey: "contractList",
                                });
                                break
                            case 'foreign':
                                store.dispatch("subList", {
                                commitKey: "setMarketForeignList",
                                listKey: "marketForeignList",
                                });
                                break
                            case 'commodities':
                                store.dispatch("subList", {
                                commitKey: "setMarketCommoditiesList",
                                listKey: "marketCommoditiesList",
                                });
                                break
                            }
        
                        }, 100);
    
    
                    }
                })
                .finally(() => {
                    searchLoading.value = false;
                });
            }, s ? 500 : 0);
        }

        
    }

    return {
        marketList,
        watchList,
        marketSearchList,
        futuresSearchList,
        forexSearchList,
        blocktardeSearchList,
        aiquantSearchList,
        showNavDialog,
        navActiveTab,
        searchLoading,
        searchStr,
        optionLoading,
        goSearch,
        showNavDialogFunc,
        changeTab,
        getOptionList
    }
}