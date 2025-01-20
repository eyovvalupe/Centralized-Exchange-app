// 市场

export default {
  state: {
    stakeId: JSON.parse(sessionStorage.getItem('stakeId')), // 质押挖矿ID
  },
  mutations: {
    setStakeId(state, data) {
      state.stakeId = data
    }
  },
}
