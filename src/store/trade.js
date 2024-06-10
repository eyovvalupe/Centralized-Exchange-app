// 交易
export default {
    state: {
      startDate: null,
      endDate: null,
      showOpenPositionBottom: false,
      popupComponent: null,
      orderList: {},
      commToken: null
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