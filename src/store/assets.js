// 市场
import { _assets } from "@/api/api"
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
        updateAssets({ commit }) {
            // 更新收款方式列表
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
    },
}