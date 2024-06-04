// 市场
export default {
    state: {
        marketWatchList: [], // 当前订阅的列表数据
        marketSearchStr: '', // 当前搜索的文本
        marketSearchList: [], // 当前搜索的结果
        currStock: {}, // 当前股票的数据
    },
    mutations: {
        setMarketWatchList(state, data) {
            state.marketWatchList = data;
        },
        setMarketSearch(state, data) {
            state.marketSearchStr = data.search;
            state.marketSearchList = data.list;
        },
        setCurrStock(state, data) {
            state.currStock = data;
        },
    }
}