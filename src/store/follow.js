// 市场
import { _copyList, _copyMyData, _copyMyList } from '@/api/api'

export default {
  state: {
    followList: [], // 首页跟单列表
    myCopy: [], // 我的跟单
    copyItem: JSON.parse(sessionStorage.getItem('copyItem')),
    myCopyData: {},
    copyItemDetail: JSON.parse(sessionStorage.getItem('copyItemDetail'))
  },
  mutations: {
    setFollowList(state, data) {
      state.followList = data || []
    },
    setCopyItemDetail(state, data) {
      state.copyItemDetail = data
      sessionStorage.setItem('copyItemDetail', JSON.stringify(data))
    },
    setMyCopyData(state, data) {
      state.myCopyData = data
    },
    setCopyItem(state, data) {
      state.copyItem = data
    },

    setMyCopy(state, data) {
      state.myCopy = data || []
    },
  },
  actions: {
    updateFollowList({ commit }) {
      // 更新跟单列表
      return new Promise(resolve => {
        _copyList({ page: 1 })
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setFollowList', res.data || [])
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
    updateMyFollowList({ commit, state }) {
      // 更新我的跟单列表
      return new Promise(resolve => {
        _copyMyList()
          .then(res => {
            if (res.code == 200) {
              res.data = res.data || []
              commit('setMyCopy', res.data)
              if (state.copyItemDetail) {
                res.data.map(item => {
                  if (item.id == state.copyItemDetail.id) {
                    commit('setCopyItemDetail', item)
                  }
                })
              }
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
    updateMyCopyData({ commit }) {
      // 更新我的跟单列表
      return new Promise(resolve => {
        _copyMyData()
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setMyCopyData', res.data || [])
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
