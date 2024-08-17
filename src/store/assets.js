// 市场
import { _assets, _balance, _accountHint } from "@/api/api"
export default {
    state: {
        assets: {}, // 总资产
        wallet: [], // 现金钱包
        rechargeAmount: '', // 充值金额
        hintNum: 0, // 待处理的订单笔数
        loanNum: 0, // 借贷重的订单数
        coinMap: {}, // 币种
    },
    mutations: {
        setAssets(state, data) {
            state.assets = data || {};
        },
        setWallet(state, data) {
            state.wallet = data;
        },
        setRechargeAmount(state, data) {
            state.rechargeAmount = data;
        },
        setHintNum(state, data) {
            state.hintNum = data;
        },
        setLoadNum(state, data) {
            state.loanNum = data;
        },
        setCoinMap(state, data) {
            state.coinMap = data;
        },
    },
    actions: {
        updateAssets({ commit }) {
            // 更新资产
            return new Promise((resolve) => {
                _assets()
                    .then((res) => {
                        if (res.code == 200 && res.data) {
                            commit("setAssets", res.data || {});
                            resolve(res.data);
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(() => resolve(false));
            });
        },
        updateWallet({ commit }) {
            // 更新钱包
            return new Promise((resolve) => {
                _balance()
                    .then((res) => {
                        if (res.code == 200 && res.data) {
                            commit("setWallet", res.data || []);
                            resolve(res.data);
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(() => resolve(false));
            });
        },
        updateOrderHint({ commit }) {
            // 更新待处理订单笔数
            return new Promise((resolve) => {
                _accountHint()
                    .then((res) => {
                        if (res.code == 200 && res.data) {
                            let count = 0
                            if (res.data.deposit) count += res.data.deposit
                            if (res.data.deposit) count += res.data.withdraw
                            commit("setHintNum", count);
                            commit("setLoadNum", res.data.loan || 0)
                            resolve(res.data);
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(() => resolve(false));
            });
        },
    },
}