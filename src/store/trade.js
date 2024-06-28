// 交易
export default {
    state: {
      startDate: '',
      endDate: '',
      showOpenPositionBottom: false,
      showLeft: false,
      popupComponent: null,
      orderList: {},
      popupHeight: '90%',
      keyborader: false,
      allSelect: 0,
      option2:[
        {
          text: `1x`,
          value: 1
        }
      ],
      selectedLeverOption: 0,
      orderNo:'',
      isUpActive: true,
      isDownActive: false,
      unsold_volume: 0,
      currentActive: '0',
      chooseSymbol: [],
      currentSymbol: {},
      currentNumber: 0,
      previousChooseSymbol:'',
      previousTabSymbol:'',
      roundedQuantity:0,
      minOrder:0,
      sliderValue:0,
      ipoId:'',
      ipoDetail:{},
      ipoDataList:[],
      hasIpoData: false
    },
    mutations: {
      setDates(state,data) {
        state.startDate = data[0];
        state.endDate = data[1];
      },
      setShowOpenPositionBottom(state, payload) {
        state.showOpenPositionBottom = payload;
      },
      setShowLeft(state, payload) {
        state.showLeft = payload;
      },
      setPopupComponent(state, component) {
        state.popupComponent = component;
      },
      setUpOrder(state,data) {
        state.orderList = data
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
      },
      setActive (state,data) {
        state.isUpActive = data
        state.isDownActive = !data
      },
      setUnsoldVolume(state,data) {
        state.unsold_volume = data
      },
      setCurrentActive(state,data) {
        state.currentActive = data
      },
      setChooseSymbol(state,data) {
        state.chooseSymbol = data
      },
      clearChooseSymbol(state,data) {
        state.chooseSymbol = []
      },
      setCurrentSymbol(state,data) {
        state.currentSymbol = data
      },
      clearCurrentSymbol(state,data) {
        state.currentSymbol = {
          stockCo: [],
          stockPrice:0,
          symbol:''
        }
      },
      setCurrentNumber(state,data){
        state.currentNumber = data
      },
      setPreviousChooseSymbol(state,data){
        state.previousChooseSymbol = data
      },
      setPreviousTabSymbol(state,data){
        state.previousTabSymbol = data
      },
      setRoundedQuantity(state,data){
        state.roundedQuantity = data
      },
      setMinOrder(state,data){
        state.minOrder = data
      },
      setSliderValue(state,data){
        state.sliderValue = data
      },
      setIpoId(state,data){
        state.ipoId = data
      },
      setIpoDetail(state,data){
        state.ipoDetail = data
      },
      setIpoDataList(state,data){
        state.ipoDataList = data
      },
      setHasIpoData(state,data){
        state.hasIpoData = true
      },
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