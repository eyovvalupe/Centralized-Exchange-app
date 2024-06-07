// 交易
export default {
    state: {
      startDate: null,
      endDate: null,
    },
    mutations: {
      setDates(state,data) {
        state.startDate = data[0];
        state.endDate = data[1];
      },
    }
}