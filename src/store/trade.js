// 交易
export default {
  state: {
    positionsList: [], // 持仓列表
    contractPositionsList: [], // 合约持仓列表
    aiPositionsList: [], // ai持仓列表
    ipoDataList: [], // ipo列表
    ipoStockList: [], // ipo股票列表
    inquireList: [], // 股票列表
    contractInquireList: [], // 合约历史列表
    aiInquireList: [], // ai历史列表
  },
  mutations: {
    setPositionsList(state, data) {
      state.positionsList = data
    },
    setContractPositionsList(state, data) {
      state.contractPositionsList = data
    },
    setAiPositionsList(state, data) {
      state.aiPositionsList = data
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
    setContractInquireList(state, data) {
      state.contractInquireList = data
    },
    setAiInquireList(state, data) {
      state.aiInquireList = data
    },
  },
}