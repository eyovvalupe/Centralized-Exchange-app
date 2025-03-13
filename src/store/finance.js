// 市场

export default {
  state: {
    stakeId: JSON.parse(sessionStorage.getItem('stakeId')), // 质押挖矿ID
    orderItem: JSON.parse(sessionStorage.getItem('orderItem')),
    financeSubType: ''
  },
  mutations: {
    setFinanceSubType(state, data) {
      state.financeSubType = data
    },
    setOrderItem(state, data) {
      state.orderItem = data
    },
    setStakeId(state, data) {
      state.stakeId = data
    }
  },
}
