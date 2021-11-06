import Dao from '@/utils/dao.js'
const state = {
  cachedViews: [],
  closeCachedTag: []
}
const mutations = {
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },
  UPDATE_CACHED_VIEW: (state, view) => {
    state.cachedViews = view
  },
  UPDATE_CLOSE_CACHED_TAG: (state, tag) => {
    state.closeCachedTag = tag
  }
}
const actions = {
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
  updateCachedView({ commit }, view) {
    commit('UPDATE_CACHED_VIEW', view)
  },
  updateCloseCachedTag({ commit }, tag) {
    return new Promise(resolve => {
      Dao.set('closeCachedTag', tag)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
