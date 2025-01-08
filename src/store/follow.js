// 市场
import { _copyList, _copyMycopy } from '@/api/api'

export default {
  state: {
    followList: [], // 跟单列表
    myCopy: {}, // 我的跟单
  },
  mutations: {
    setFollowList(state, data) {
      state.followList = data || []
    },
    setMyCopy(state, data) {
      state.myCopy = data || {}
    },
  },
  actions: {
    updateFollowList({ commit }) {
      // 更新跟单列表
      return new Promise(resolve => {
        _copyList({page:1})
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
    updateMyCopy({ commit }) {
      // 更新跟单列表
      return new Promise(resolve => {
        _copyMycopy()
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setMyCopy', res.data || {})
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
