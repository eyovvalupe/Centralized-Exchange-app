// 市场
import { useSocket } from '@/utils/ws'
import { _getSnapshotLine } from "@/utils/index"
import router from "@/router"
const { startSocket } = useSocket()

export default {
    state: {
        marketWatchListKeys: [], // 当前订阅的列表key
        marketWatchList: [], // 当前订阅的列表数据
        marketSearchStr: '', // 当前搜索的文本
        marketSearchList: [], // 当前搜索的结果
        currStock: {}, // 当前股票的数据
        marketVolumeList: [], // 首页活跃列表
        marketUpList: [], // 首页涨幅列表
        marketDownList: [], // 首页跌幅列表

        marketRecommndList: [], // 首页推荐列表
        marketStockList: [], // 股票页列表
        marketSrockRecommendList: [], // 推荐股票列表
        marketRankList: [], // 排行列表

        marketWatchKeys: [], // 除了列表，还需要额外监听的股票
        proxyListValue: [], // 始终监听的列表
        commitKey: "", // 始终监听的列表key
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
                const index = state.marketWatchList.findIndex(item => item.symbol == data.symbol)
                if (index >= 0) {
                    state.marketWatchList[index] = data
                }
                const index2 = state.marketVolumeList.findIndex(item => item.symbol == data.symbol)
                if (index2 >= 0) {
                    state.marketVolumeList[index2] = data
                }
                const index3 = state.marketUpList.findIndex(item => item.symbol == data.symbol)
                if (index3 >= 0) {
                    state.marketUpList[index3] = data
                }
                const index4 = state.marketDownList.findIndex(item => item.symbol == data.symbol)
                if (index4 >= 0) {
                    state.marketDownList[index4] = data
                }
            }, 300)
        },
    },
    actions: {
        subList({ commit, state }, { commitKey, proxyListValue }) {
            let proxyKeys = []
            if (proxyListValue) {
                proxyKeys = proxyListValue.map(item => item.symbol)
            }
            const socket = startSocket(() => {
                const keys = Array.from(new Set([
                    ...proxyKeys,
                    ...state.marketWatchKeys,
                    ...state.marketWatchListKeys
                ]))
                if (proxyListValue) { // 如果有始终监听的数据，则放进store
                    state.proxyListValue = proxyListValue
                    state.commitKey = commitKey
                    state.marketWatchListKeys = proxyKeys
                }
                console.error('订阅：', keys)
                socket && socket.emit('realtime', keys.join(',')) // 价格变化
                socket && socket.off('realtime')
                socket && socket.on('realtime', res => {
                    if (res.code == 200) {
                        if (proxyListValue) {
                            const arr = proxyListValue.map(item => { // 数据和观察列表里的数据融合
                                const target = res.data.find(a => a.symbols == item.symbol)
                                if (target) {
                                    Object.assign(item, target)
                                }
                                return item
                            })
                            if (commitKey) {
                                commit(commitKey, arr || [])
                            }
                        }
                        if (state.commitKey) {
                            const arr2 = state.proxyListValue.map(item => { // 数据和观察列表里的数据融合
                                const target = res.data.find(a => {
                                    return a.symbols == item.symbol
                                })
                                if (target) {
                                    Object.assign(item, target)
                                }
                                return item
                            })
                            commit(state.commitKey, arr2 || [])
                        }

                        setTimeout(() => {
                            // 根据不同页面，同步页面内模块的数据
                            switch (router.currentRoute?.value?.name) {
                                case 'home': // 首页-首页推荐列表
                                    commit('setMarketRecommndList', state.marketRecommndList.map(item => {
                                        const target = res.data.find(a => a.symbols == item.symbol)
                                        if (target) {
                                            Object.assign(item, target)
                                        }
                                        return item
                                    }))
                                    break
                            }
                        }, 300)
                    }
                })

                socket && socket.emit('snapshot', keys.join(',')) // 快照数据
                socket && socket.off('snapshot')
                socket && socket.on('snapshot', res => {
                    if (res.code == 200) {
                        if (proxyListValue) {
                            const target = proxyListValue.find(item => item.symbols == res.symbols)
                            if (target) {
                                target.points = _getSnapshotLine(res.data)
                                if (commitKey) {
                                    commit(commitKey, proxyListValue)
                                }
                            }
                        }
                        if (state.commitKey) {
                            const target = state.proxyListValue.find(item => item.symbols == res.symbols)
                            if (target) {
                                target.points = _getSnapshotLine(res.data)
                                commit(state.commitKey, state.proxyListValue)
                            }
                        }


                        setTimeout(() => {
                            // 根据不同页面，同步页面内模块的数据
                            let index = -1
                            switch (router.currentRoute?.value?.name) {
                                case 'home': // 首页-首页推荐列表
                                    index = state.marketRecommndList.findIndex(item => item.symbols == res.symbols)
                                    if (index >= 0) {
                                        state.marketRecommndList[index].points = _getSnapshotLine(res.data)
                                        commit('setMarketRecommndList', state.marketRecommndList)
                                    }
                                    break
                            }
                        }, 300)
                    }
                })
            })
        }
    },
}