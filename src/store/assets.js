// 市场
import { _assets, _balance, _accountHint, _cryptoCoin } from '@/api/api'

export default {
  state: {
    assets: {}, // 总资产
    wallet: [], // 现金钱包
    stockWallet: [], //股票账户
    elseWallet:[], //其他账户
    elseWalletMap: { // 其他账户信息
      stock:[],
      futures:[],
      forex:[],
      blocktrade:[]
    }, 
    currencyList: [], // 币种列表
    accountCurrencyMap:{ //业务账户对应货币
      stock:"",
      futures:"",
      forex:"",
      aiquant:"",
      ipo:"",
      wealth:""
    },
    deWeightCurrencyList: [], // 去重币种列表
    rechargeAmount: '', // 充值金额
    hintNum: 0, // 待处理的订单笔数
    loanNum: 0, // 借贷重的订单数
    coinMap: {}, // 币种 网络 map
    currencyMapList: [],
    currSelectedWallet: 0,
    depositData: {},
    fromType: 'money',
    fromCurrency: {},
    toType: 'money',
    toCurrency: {},
  },
  getters: {
    
  },
  mutations: {
    setStockWallet(state, data) {
      state.stockWallet = data
    },
    setFromType(state, data) {
      state.fromType = data
    },
    setFromCurrency(state, data) {
      state.fromCurrency = data
    },
    setToType(state, data) {
      state.toType = data
    },
    setToCurrency(state, data) {
      state.toCurrency = data
    },
    setDepositData(state, data) {
      state.depositData = data
    },
    setCurrSelectedWallet(state, data) {
      state.currSelectedWallet = data
    },
    setCurrencyMapList(state, data) {
      state.currencyMapList = data
    },
    setAssets(state, data) {
      state.assets = data || {}
    },
    setWallet(state, data) {
      state.wallet = data
    },
  
    setElseWalletMap(state, obj) {
      const account = obj.account
      const data = obj.data
      state.elseWalletMap[account] = data
      if(data[0]){
        state.accountCurrencyMap[account] = data[0].currency
      }

      const list = []
    
      Object.keys(state.elseWalletMap).map(_acc=>{
        if(state.elseWalletMap[_acc] && state.elseWalletMap[_acc].length){
          state.elseWalletMap[_acc].map(item=>{
            list.push(item)
          })
        }
      })
      state.elseWallet = list
    },
    setCurrencyList(state, data) {
      state.currencyList = data
    },
    
    setRechargeAmount(state, data) {
      state.rechargeAmount = data
    },
    setHintNum(state, data) {
      state.hintNum = data
    },
    setLoadNum(state, data) {
      state.loanNum = data
    },
    setCoinMap(state, data) {
      const obj = {}
      data.map(item => {
        if (obj[item.name]) {
          obj[item.name].push(item)
        } else {
          obj[item.name] = [item]
        }
      })
      state.coinMap = obj
    },
    setDeWeightCurrencyList(state, data) {
      state.deWeightCurrencyList = data
    },
  },
  actions: {
    updateAssets({ commit }) {
      // 更新资产
      return new Promise(resolve => {
        _assets()
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setAssets', res.data || {})
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
    updateWallet({ commit },account='all') {
      // 更新钱包

      if(account == 'all' || account == 'money'){
        _balance({
          account:'money' // 现金账户
        }).then(res => {
          if (res && res.code == 200 && res.data) {
            commit('setWallet', res.data || [])
          }
        })
      }


      // 其他账户
      const elseAccount = ['stock','futures','forex','blocktrade']
      elseAccount.map(_acc=>{
        if(account == 'all' || account == _acc){
          _balance({
            account:_acc
          }).then(res => {
            if (res && res.code == 200 && res.data) {
              commit('setElseWalletMap', {
                account:_acc,
                data:res.data || []
              })
            }
          })
        }
      })
      
    },
    updateStockWallet({ commit }) {
      _balance({
        account: "stock",
      }) // 股票账户
        .then((res) => {
          if (res && res.code == 200 && res.data) {
            console.log(res.data)
            commit("setStockWallet", res.data || []);
          }
        });
    },
    updateCurrency({ commit }) {
     
      // 获取账户对应货币 其它账户对应货币
      _cryptoCoin({ dedup: false }).then(res => {
        if (res.code == 200 && res.data) {
          commit('setCurrencyList', res.data || {})
          commit(
            'setDeWeightCurrencyList',
            res.data.reduce((acc, item) => {
              if (!acc.some(accItem => accItem.name === item.name)) {
                acc.push(item)
              }
              return acc
            }, [])
          )
        }
      })
    },
    updateOrderHint({ commit }) {
      // 更新待处理订单笔数
      return new Promise(resolve => {
        _accountHint()
          .then(res => {
            if (res.code == 200 && res.data) {
              let count = 0
              if (res.data.deposit) count += res.data.deposit
              if (res.data.deposit) count += res.data.withdraw
              commit('setHintNum', count)
              commit('setLoadNum', res.data.loan || 0)
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
  },
}
