// 市场
import { useSocket } from '@/utils/ws'
import { _getSnapshotLine } from "@/utils/index"
import router from "@/router"
const { startSocket } = useSocket()

export default {
    state: {
        marketWatchList: [], // 当前订阅的列表数据
        marketSearchStr: '', // 当前搜索的文本
        marketSearchList: [], // 当前搜索的结果
        currStock: {}, // 当前股票的数据
        marketVolumeList: [], // 首页活跃列表
        marketUpList: [], // 首页涨幅列表
        marketDownList: [], // 首页跌幅列表

        marketRecommndList: [], // 首页推荐列表

        marketWatchKeys: [], // 除了列表，还需要额外监听的股票
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
        setMarketWatchKeys(state, data) {
            state.marketWatchKeys = data;
        },
        setMarketSearch(state, data) {
            state.marketSearchStr = data.search;
            state.marketSearchList = data.list;
        },
        setCurrStock(state, data) {
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
            const socket = startSocket(() => {
                const keys = Array.from(new Set([
                    ...proxyListValue.value.map(item => item.symbol),
                    ...state.marketWatchKeys
                ]))

                socket && socket.emit('realtime', keys.join(',')) // 价格变化
                socket && socket.on('realtime', res => {
                    if (res.code == 200) {
                        const arr = proxyListValue.value.map(item => { // 数据和观察列表里的数据融合
                            const target = res.data.find(a => a.symbols == item.symbol)
                            if (target) {
                                Object.assign(item, target)
                            }
                            return item
                        })
                        commit(commitKey, arr || [])

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
                socket && socket.on('snapshot', res => {
                    if (res.code == 200) {
                        const target = proxyListValue.value.find(item => item.symbols == res.symbols)
                        if (target) {
                            target.points = _getSnapshotLine(res.data)
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