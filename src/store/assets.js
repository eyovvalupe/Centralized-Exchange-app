// 市场

export default {
    state: {
        assets: {}, // 总资产
        wallet: [], // 现金钱包
    },
    mutations: {
        setAssets(state, data) {
            state.assets = data;
        },
        setWallet(state, data) {
            state.wallet = data;
        },
    },
    actions: {
    },
}