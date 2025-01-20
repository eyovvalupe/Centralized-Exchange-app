// 市场

export default {
  state: {
    stakeId: JSON.parse(sessionStorage.getItem('stakeId')), // 质押挖矿ID
    orderItem: JSON.parse(sessionStorage.getItem('orderItem'))
  },
  mutations: {
    setOrderItem(state, data) {
      state.orderItem = data
    },
    setStakeId(state, data) {
      state.stakeId = data
    }
  },
}
