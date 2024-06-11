// 交易
export default {
    state: {
      startDate: null,
      endDate: null,
      showOpenPositionBottom: false,
      popupComponent: null,
      orderList: {},
      commToken: null,
      popupHeight: '90%',
      keyborader: false,
      allSelect: 0,
      option2:[],
      selectedLeverOption: 0,
      orderNo:''
    },
    mutations: {
      setDates(state,data) {
        state.startDate = data[0];
        state.endDate = data[1];
      },
      setShowOpenPositionBottom(state, payload) {
        state.showOpenPositionBottom = payload;
      },
      setPopupComponent(state, component) {
        state.popupComponent = component;
      },
      setUpOrder(state,data) {
        state.orderList = data
      },
      setCommToken(state,data) {
        state.commToken = data
      },
      setPopupHeight(state,data) {
        state.popupHeight = data
      },
      setkeyborader(state,data) {
        state.keyborader = data
      },
      setAllSelect(state,data) {
        state.allSelect = data
      },
      setOption2(state,data) {
        state.option2 = data
      },
      setSelectedLeverOption(state,data) {
        state.selectedLeverOption = data
      },
      clearState(state,data) {
        state.allSelect = 0
        state.selectedLeverOption = state.option2[0].value
      },
      setOrderNo(state,data) {
        state.orderNo = data
      }
    },
    actions: {
      openPopup({ commit }, component) {
        commit('setPopupComponent', component);
        commit('setShowOpenPositionBottom', true);
      },
      closePopup({ commit }) {
        commit('setShowOpenPositionBottom', false);
        commit('setPopupComponent', null);
      }
    },
}