// 市场
import { useSocket } from '@/utils/ws'
import { _getSnapshotLine } from "@/utils/index"
import router from "@/router"
const { startSocket } = useSocket()

// 不同页面对应的监听列表 key
const pageKeys = {
    'home': ['marketRecommndList'],
    'market': ['marketWatchList', 'marketVolumeList', 'marketUpList', 'marketDownList', 'marketSrockRecommendList'],
    'trade': ['marketWatchList', 'marketRankList']
}

export default {
    state: {
        currStock: {}, // 当前股票的数据
        marketSearchStr: '', // 当前搜索的文本
        marketSearchList: [], // 当前搜索的结果

        marketWatchList: [], // 当前订阅的列表数据
        marketVolumeList: [], // 首页活跃列表
        marketUpList: [], // 首页涨幅列表
        marketDownList: [], // 首页跌幅列表
        marketRecommndList: [], // 首页推荐列表
        marketStockList: [], // 股票页列表
        marketSrockRecommendList: [], // 推荐股票列表
        marketRankList: [], // 排行列表

        marketWatchKeys: [], // 除了主列表，还需要额外监听的股票 symbol数组

    },
    mutations: {
        setMarketWatchList(state, data) {
            state.marketWatchList = data;
        },
        setMarketVolumeList(state, data) {
            state.marketVolumeList = data;
        },
        setMarketUpList(state, data) {
            state.marketUpList = data;
        },
        setMarketDownList(state, data) {
            state.marketDownList = data;
        },
        setMarketRecommndList(state, data) {
            state.marketRecommndList = data;
        },
        setMarketStockList(state, data) {
            state.marketStockList = data;
        },
        setMarketSrockRecommendList(state, data) {
            state.marketSrockRecommendList = data;
        },
        setMarketWatchKeys(state, data) {
            state.marketWatchKeys = data;
        },
        setMarketRankList(state, data) {
            state.marketRankList = data;
            const arr = Array.from(new Set(data.map(item => item.symbol)))
            // 设置keys
            state.marketWatchKeys = Array.from(new Set(state.marketWatchKeys.concat(arr)))
        },
        setMarketSearch(state, data) {
            state.marketSearchStr = data.search;
            state.marketSearchList = data.list;
        },
        setMarketSearchList(state, data) {
            state.marketSearchList = data;
        },
        setCurrStock(state, data) {
            if (!data.symbol) { // 只更新部分数据
                state.currStock = {
                    ...state.currStock,
                    ...data
                }
                return
            }
            // 兼容后端的symbols 和 symbol
            data.symbol = data.symbols || data.symbol
            state.currStock = data;
            // 当前股票有更新，则同步到列表里去
            setTimeout(() => {
                (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                    const index = state[ck].findIndex(item => item.symbol == data.symbol)
                    if (index >= 0) {
                        state[ck][index] = data
                    }
                })
            }, 300)
        },
    },
    actions: {
        subList({ commit, state }, { commitKey, listKey }) {
            let proxyKeys = []
            const proxyListValue = state[listKey]
            if (proxyListValue) {
                proxyKeys = proxyListValue.map(item => item.symbol)
            }
            const socket = startSocket(() => {
                const keys = Array.from(new Set([
                    ...proxyKeys,
                    ...state.marketWatchKeys,
                ]))
                console.error('订阅：', keys)
                socket && socket.off('realtime')
                socket && socket.emit('realtime', keys.join(',')) // 价格变化
                socket && socket.on('realtime', res => {
                    if (res.code == 200) {
                        // 根据不同页面，同步页面内模块的数据
                        (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                            const arr = state[ck].map(item => { // 数据和观察列表里的数据融合
                                const target = res.data.find(a => a.symbols == item.symbol)
                                if (target) {
                                    return {
                                        ...item,
                                        ...target,
                                        name: item.name || target.name
                                    }
                                }
                                return item
                            })
                            state[ck] = arr
                        })
                    }
                })

                socket && socket.off('snapshot')
                socket && socket.emit('snapshot', keys.join(',')) // 快照数据
                socket && socket.on('snapshot', res => {
                    if (res.code == 200) {
                        // console.error('收到', res, state.marketSrockRecommendList)
                        // 根据不同页面，同步页面内模块的数据
                        (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                            const target = state[ck].find(item => item.symbols == res.symbols || item.symbol == res.symbols)
                            if (target) {
                                target.points = _getSnapshotLine(res.data)
                            }
                        })
                    }
                })
            })
        }
    },
}