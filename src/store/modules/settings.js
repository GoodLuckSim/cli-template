
import { setLanguage } from '@/main'
import { setToken } from '@/utils/auth'
const state = {
  timeZone: 8,
  lang: 'en',
  currency: 'vn',
  roles: [],
  cachedViews: [] // 已经打开的路由表
}
const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  }
}
const actions = {
  // 主系统基础信息变更时，子项目同步信息
  changeSetting({ commit }, data) {
    const { settings } = data
    if (settings && settings.key == 'lang') {
      setLanguage(settings.value)
    }
    commit('CHANGE_SETTING', settings)
  },
  setDefaultSetting({ commit }, data) {
    const { lang, timeZone, currency, token } = data
    commit('CHANGE_SETTING', { key: 'lang', value: lang })
    commit('CHANGE_SETTING', { key: 'timeZone', value: timeZone })
    commit('CHANGE_SETTING', { key: 'currency', value: currency })
    setToken(token)
    setLanguage(lang)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
