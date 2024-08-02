// 交易
export default {
  state: {
    positionsList: [], // 持仓列表
  },
  mutations: {
    setPositionsList(state, data) {
      state.positionsList = data
    },
  },
}