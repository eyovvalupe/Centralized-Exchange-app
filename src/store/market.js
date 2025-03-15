// 市场
import { useSocket } from '@/utils/ws'
import { _getSnapshotLine } from "@/utils/index"
import router from "@/router"
import { _watchlist } from '@/api/api'
const { startSocket } = useSocket()

// 主组件的所有key
const recommendArr = ['marketStockList', 'spotList', 'marketWatchList', 'contractList', 'marketForeignList', 'marketCommoditiesList', 'marketAiList', 'marketStockDataList', 'marketStockUsDataList', 'marketStockIndiaDataList', 'marketStockJapanDataList', 'marketStockKoreaDataList', 'marketStockGermanyDataList', 'marketStockUkDataList', 'marketStockSingaporeDataList', 'marketStockHongkongDataList', 'marketStockMalaysiaDataList']
// 不同页面对应的监听列表 key
const pageKeys = {
    'home': [
        ...recommendArr
    ],
    'market': [
        ...recommendArr
    ],
    'trade': [...recommendArr],
    'tradeInfo': [...recommendArr],
    'search': ['marketSearchList']
}



const setCurr = (keyName, state, data) => {
    data = JSON.parse(JSON.stringify(data))
    if (!data.symbol) { // 只更新部分数据
        for (let key in data) {
            if (data[key] === null) delete data[key]
        }
        state[keyName] = {
            ...state[keyName],
            ...data
        }
        return
    } else {
        if (data.symbol != state[keyName].symbol) {
            state[keyName].trade = false
        }
    }
    state[keyName] = Object.assign({}, state[keyName], data);

    setTimeout(() => {
        sessionStorage.setItem('market_' + keyName, JSON.stringify(state[keyName]))
    }, 200)
}

export default {
    state: {
        checkState: true,
        checkStockList: [],
        checkCryptoList: [],
        marketType: "all",

        currStockItem: sessionStorage.getItem('market_currStockItem') ? JSON.parse(sessionStorage.getItem('market_currStockItem')) : {}, // 当前股票的数据
        marketSearchStr: '', // 当前搜索的文本
        marketSearchTextList: [],
        marketSearchList: [], // 当前搜索的结果-股票
        futuresSearchList: [], // 当前搜索的结果-合约
        aiquantSearchList: [], // 当前搜索的结果-ai
        forexSearchList: [], // 当前搜索的结果-外汇

        // marketWatchList: [], // 当前订阅的列表数据
        marketWatchList: [], // 当前订阅的列表数据
        marketVolumeList: [], // 首页活跃列表
        marketUpList: [], // 首页涨幅列表
        marketDownList: [], // 首页跌幅列表
        marketRecommndList: [], // 首页推荐列表
        marketRecommndContractList: [], // 首页合约列表
        marketRecommndStockList: [], // 首页股票列表
        marketStockList: [], // 股票页列表

        marketSrockRecommendList: [], // 推荐股票列表
        marketContractRecommendList: [], // 推荐合约列表
        marketRankList: [], // 排行列表

        marketWatchKeys: [], // 除了主列表，还需要额外监听的股票 symbol数组

        currConstact: sessionStorage.getItem('market_currConstact') ? JSON.parse(sessionStorage.getItem('market_currConstact')) : {}, // 当前合约的数据
        contractList: [], // 合约列表

        currSpot: sessionStorage.getItem('market_currSpot') ? JSON.parse(sessionStorage.getItem('market_currSpot')) : {}, // 当前现货数据
        spotList: [], // 现货列表

        currAi: sessionStorage.getItem('market_currAi') ? JSON.parse(sessionStorage.getItem('market_currAi')) : {}, // 当前ai量化数据
        marketAiList: [], // ai量化默认列表
        marketAiHisList: [], // ai量化历史收益率列表
        marketAi24List: [], // ai量化24小时收益率列表
        marketAiGridList: [], // ai量化最大网格(杠杆)列表

        currForeign: sessionStorage.getItem('market_currForeign') ? JSON.parse(sessionStorage.getItem('market_currForeign')) : {}, // 当前外汇数据
        marketForeignList: [], // 外汇默认列表

        currCommodities: sessionStorage.getItem('market_currCommodities') ? JSON.parse(sessionStorage.getItem('market_currCommodities')) : {}, // 当前大宗交易
        marketCommoditiesList: [], // 大宗交易默认列表


        marketCountryStockList: [], //选择的区域股票列表

        marketCurrent: "", //当前选中的市场

        marketStockUsData: {}, //当前选择的美区数据内容
        marketStockIndiaData: {}, //当前选择的印度数据内容
        marketStockJapanData: {}, //当前选择的日本数据内容
        marketStockKoreaData: {}, //当前选择的韩国数据内容
        marketStockGermanyData: {}, //当前选择的德国数据内容
        marketStockUkData: {},  //当前选择的英国数据内容
        marketStockSingaporeData: {},  //当前选择的新加坡数据内容
        marketStockHongkongData: {}, //当前选择的香港数据内容
        marketStockMalaysiaData: {}, //当前选择的马来西亚数据内容

        //指数
        marketStockUsIndexList: [],
        marketStockIndiaIndexList: [],
        marketStockJapanIndexList: [],
        marketStockKoreaIndexList: [],
        marketStockGermanyIndexList: [],
        marketStockUkIndexList: [],
        marketStockSingaporeIndexList: [],
        marketStockHongkongIndexList: [],
        marketStockMalaysiaIndexList: [],

        //股票
        marketStockDataList: [],
        marketStockUsDataList: [],
        marketStockIndiaDataList: [],
        marketStockJapanDataList: [],
        marketStockKoreaDataList: [],
        marketStockGermanyDataList: [],
        marketStockUkDataList: [],
        marketStockSingaporeDataList: [],
        marketStockHongkongDataList: [],
        marketStockMalaysiaDataList: [],

        graphColorGradient: false,
        marketActiveTab: 0,
        currDeleteId: '',
        realtimeData: [],
        searchList: [],
    },

    mutations: {
        setSearchList(state, data) {
            state.searchList = data
        },
        setCurrDeleteId(state, data) {
            state.currDeleteId = data
        },

        setMarketActiveTab(state, data) {
            state.marketActiveTab = data;
        },

        //当前选择的市场数据内容

        setMarketStockUsData(state, data) {
            state.marketStockUsData = data
        },
        setMarketStockIndiaData(state, data) {
            state.marketStockIndiaData = data
        },
        setMarketStockJapanData(state, data) {
            state.marketStockJapanData = data
        },
        setMarketStockKoreaData(state, data) {
            state.marketStockKoreaData = data
        },
        setMarketStockGermanyData(state, data) {
            state.marketStockGermanyData = data
        },
        setMarketStockUkData(state, data) {
            state.marketStockUkData = data
        },
        setMarketStockSingaporeData(state, data) {
            state.marketStockSingaporeData = data
        },
        setMarketStockHongkongData(state, data) {
            state.marketStockHongkongData = data
        },
        setMarketStockMalaysiaData(state, data) {
            state.marketStockMalaysiaData = data
        },

        //更新市场股票
        setMarketStockDataList(state, data) {
            state.marketStockDataList = data
        },
        setMarketStockUsDataList(state, data) {
            state.marketStockUsDataList = data
        },
        setMarketStockIndiaDataList(state, data) {
            state.marketStockIndiaDataList = data
        },
        setMarketStockJapanDataList(state, data) {
            state.marketStockJapanDataList = data
        },
        setMarketStockKoreaDataList(state, data) {
            state.marketStockKoreaDataList = data
        },
        setMarketStockGermanyDataList(state, data) {
            state.marketStockGermanyDataList = data
        },
        setMarketStockUkDataList(state, data) {
            state.marketStockUkDataList = data
        },
        setMarketStockSingaporeDataList(state, data) {
            state.marketStockSingaporeDataList = data
        },
        setMarketStockHongkongDataList(state, data) {
            state.marketStockHongkongDataList = data
        },
        setMarketStockMalaysiaDataList(state, data) {
            state.marketStockMalaysiaDataList = data
        },

        //更新市场指数
        setMarketStockUsIndexList(state, data) {
            state.marketStockUsIndexList = data
        },
        setMarketStockIndiaIndexList(state, data) {
            state.marketStockIndiaIndexList = data
        },
        setMarketStockJapanIndexList(state, data) {
            state.marketStockJapanIndexList = data
        },
        setMarketStockKoreaIndexList(state, data) {
            state.marketStockKoreaIndexList = data
        },
        setMarketStockGermanyIndexList(state, data) {
            state.marketStockGermanyIndexList = data
        },
        setMarketStockUkIndexList(state, data) {
            state.marketStockUkIndexList = data
        },
        setMarketStockSingaporeIndexList(state, data) {
            state.marketStockSingaporeIndexList = data
        },
        setMarketStockHongkongIndexList(state, data) {
            state.marketStockHongkongIndexList = data
        },
        setMarketStockMalaysiaIndexList(state, data) {
            state.marketStockMalaysiaIndexList = data
        },
        //
        setGraphColorGradient(state, data) {
            state.graphColorGradient = data
        },

        setMarketCountryStockList(state, data) {
            state.marketCountryStockList = data
        },

        setCheckState(state, data) {
            state.checkState = data;
        },
        setCheckStockState(state, data) {
            state.checkStockList = data;
        },
        setCheckCryptoState(state, data) {
            state.checkCryptoList = data;
        },
        setMarketType(state, data) {
            state.marketType = data;
        },
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
        setMarketRecommndStockList(state, data) {
            state.marketRecommndStockList = data;
        },
        setMarketRecommndContractList(state, data) {
            state.marketRecommndContractList = data;
        },
        setMarketStockList(state, data) {
            state.marketStockList = data;
        },
        setMarketCurrent(state, data) {
            state.marketCurrent = data
        },
        setMarketSrockRecommendList(state, data) {
            state.marketSrockRecommendList = data;
        },
        setMarketContractRecommendList(state, data) {
            state.marketContractRecommendList = data;
        },
        setContractList(state, data) {
            state.contractList = data
        },
        setSpotList(state, data) {
            state.spotList = data
        },
        setMarketWatchKeys(state, data) {
            state.marketWatchKeys = data;
        },
        setMarketForeignList(state, data) {
            state.marketForeignList = data || [];
        },
        setMarketCommoditiesList(state, data) {
            state.marketCommoditiesList = data || [];
        },
        setMarketWatchKeysByPage(state) {
            const data = []
            const page = router.currentRoute.value && router.currentRoute.value.name ? router.currentRoute.value.name : ''
            if (pageKeys[page]) {
                pageKeys[page].map(k => {
                    if (state[k] && state[k].length) {
                        state[k].map(item => {
                            if (data.indexOf(item.symbol) == -1) {
                                data.push(item.symbol)
                            }
                        })
                    }
                })
            }

            state.marketWatchKeys = data;
        },
        setMarketRankList(state, data) {
            state.marketRankList = data;
            const arr = Array.from(new Set(data.map(item => item.symbol)))
            // 设置keys
            state.marketWatchKeys = Array.from(new Set(state.marketWatchKeys.concat(arr)))
        },
        setMarketSearchTextList(state, data) {
            state.marketSearchTextList = data;
        },
        setMarketSearch(state, data) {
            state.marketSearchStr = data.search;
            state.marketSearchList = (data.list || []).map(item => {
                return item;
            });
        },
        setMarketSearchList(state, data) {
            state.marketSearchList = data;
        },
        setFuturesSearchList(state, data) {
            state.futuresSearchList = data;
        },
        setAiquantSearchList(state, data) {
            state.aiquantSearchList = data;
        },
        setForexSearchList(state, data) {
            state.forexSearchList = data;
        },
        setMarketAiList(state, data) {
            state.marketAiList = data || [];
        },
        setMarketAiHisList(state, data) {
            state.marketAiHisList = data || [];
        },
        setMarketAi24List(state, data) {
            state.marketAi24List = data || [];
        },
        setMarketAiGridList(state, data) {
            state.marketAiGridList = data || [];
        },
        setCurrStockItem(state, data) {
            sessionStorage.setItem('currStockItem', JSON.stringify(data))
            setCurr('currStockItem', state, data)
        },
        setCurrConstract(state, data) {
            sessionStorage.setItem('currConstact', JSON.stringify(data))
            setCurr('currConstact', state, data)
        },
        setCurrSpot(state, data) {
            sessionStorage.setItem('currSpot', JSON.stringify(data))
            setCurr('currSpot', state, data)
        },
        setCurrAi(state, data) {
            sessionStorage.setItem('currAi', JSON.stringify(data))
            setCurr('currAi', state, data)
        },
        setCurrForeign(state, data) {
            setCurr('currForeign', state, data)
        },
        setCurrCommodities(state, data) {
            setCurr('currCommodities', state, data)
        },
        setRealtimeItemData(state, data) {
            let has = false
            for (let i = 0; i < state.realtimeData.length; i++) {
                if (state.realtimeData[i].symbol == data.symbol) {
                    has = true
                    Object.keys(data).map(k => {
                        state.realtimeData[i][k] = data[k]
                    })
                    break;
                }
            }
            if (!has) {
                state.realtimeData.push(data)
            }
        }
    },
    actions: {
        /*
           这里订阅分3种情况
           1. 只订阅某个列表数据，比如contractList(当前合约列表), 那么传 listKey：contractList，即可。此时ws只订阅此列表
           2. 需要同时订阅多个列表数据，则把symbol字段数组组合后，传 allKeys：所有symbol。此时ws会订阅 allKeys 所有数据
           3. 在订阅了 A 列表之后，还需要订阅 B 列表，甚至 C 列表时，通过 marketWatchKeys 实现，marketWatchKeys中的key会始终订阅，不影响后来的订阅。
       */
        subList({ commit, state }, { commitKey, listKey, allKeys }) {
            let proxyKeys = []
            if (listKey) {
                const proxyListValue = state[listKey]
                if (proxyListValue) {
                    proxyKeys = proxyListValue.map(item => item.symbol)
                }
            }
            if (allKeys) {
                proxyKeys = allKeys
            }

            //先从已获取过的实时数据里拿数据
            // (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
            //     const arr = state[ck].map(item => {
            //         const target = state.realtimeData.find(a => a.symbol == item.symbol)
            //         if (target) {
            //             return {
            //                 ...item,
            //                 ...target,
            //                 name: item.name || target.name
            //             }
            //         }
            //         return item
            //     })
            //     state[ck] = arr
            //     if (ck == 'marketWatchList') {
            //         sessionStorage.setItem('market_watch_list', JSON.stringify(arr))
            //     }
            // })

            const socket = startSocket(() => {
                const keys = Array.from(new Set([
                    ...proxyKeys,
                    ...state.marketWatchKeys,
                ]))
                console.error('订阅', keys)
                socket && socket.off('realtime')
                socket && socket.emit('realtime', keys.join(',')) // 价格变化
                socket && socket.on('realtime', res => {
                    if (res.code == 200) {
                        // if (res.data && res.data.length) {
                        //     res.data.map(_item => {
                        //         commit("setRealtimeItemData", _item)
                        //     })
                        // }
                        // 根据不同页面，同步页面内模块的数据
                        (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                            const arr = state[ck].map(item => { // 数据和观察列表里的数据融合
                                const target = res.data.find(a => a.symbol == item.symbol)
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

                        // 同步到当前 股票
                        const cStock = res.data.find(a => a.symbol == state.currStockItem.symbol)
                        if (cStock) {
                            let obj = JSON.parse(JSON.stringify(cStock))
                            delete obj.symbol
                            commit('setCurrStockItem', obj)
                        }
                        // 同步到当前 合约
                        const cConstract = res.data.find(a => a.symbol == state.currConstact.symbol)
                        if (cConstract) {
                            let obj = JSON.parse(JSON.stringify(cConstract))
                            delete obj.symbol
                            commit('setCurrConstract', obj)
                        }
                        // 同步到当前 ai
                        const cAi = res.data.find(a => a.symbol == state.currAi.symbol)
                        if (cAi) {
                            let obj = JSON.parse(JSON.stringify(cAi))
                            delete obj.symbol
                            commit('setCurrAi', obj)
                        }

                    }
                })


                socket && socket.off('snapshot')
                socket && socket.emit('snapshot', keys.join(',')) // 快照数据
                socket && socket.on('snapshot', res => {
                    if (res.code == 200) {
                        let points = '';
                        if (res.data) {
                            points = _getSnapshotLine(res.data)
                            // commit('setRealtimeItemData', {
                            //     symbol: res.symbol,
                            //     points
                            // })
                        }
                        // // 根据不同页面，同步页面内模块的数据2
                        (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                            const target = state[ck].find(item => item.symbol == res.symbol)
                            if (target) {
                                target.points = points
                            }
                        })
                    }
                })
            })
        },
        setMarketType({ commit, state }) {
            commit("setMarketType", state)
        },
        updateMarketWatchList({ commit }) {
            return new Promise((resolve) => {
                _watchlist()
                    .then(res => {
                        if (res.code == 200 && res.data) {
                            commit('setMarketWatchList', res.data)
                            resolve(res.data)
                        } else {
                            resolve(false)
                        }
                    })
                    .catch(() => resolve(false))
            })
        }
    },
    getters: {
        getMarketStockCurrentList(state) {
            switch (state.marketCurrent) {
                case 'all':
                    return state.marketStockDataList
                case 'us':
                    return state.marketStockUsDataList
                case 'india':
                    return state.marketStockIndiaDataList
                case 'japan':
                    return state.marketStockJapanDataList
                case 'korea':
                    return state.marketStockKoreaDataList
                case 'germany':
                    return state.marketStockGermanyDataList
                case 'uk':
                    return state.marketStockUkDataList
                case 'singapore':
                    return state.marketStockSingaporeDataList
                case 'hongkong':
                    return state.marketStockHongkongDataList
                case 'malaysia':
                    return state.marketStockMalaysiaDataList
            }
            return state.marketStockDataList
        },
        getMarketType(state) {
            return state.marketType;
        }
    }
}