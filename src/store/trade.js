// 交易
export default {
  state: {
    positionsList: [], // 持仓列表
    ipoDataList: [], // ipo列表
    ipoStockList: [], // ipo股票列表
    inquireList: [], // 持仓查询列表
  },
  mutations: {
    setPositionsList(state, data) {
      state.positionsList = data
    },
    setIpoDataList(state, data) {
      state.ipoDataList = data
    },
    setIpoStockList(state, data) {
      state.ipoStockList = data
    },
    setInquireList(state, data) {
      state.inquireList = data
    },
  },
}