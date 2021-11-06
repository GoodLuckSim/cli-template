const getters = {
  timeZone: state => state.settings.timeZone,
  lang: state => state.settings.lang,
  currency: state => state.settings.currency,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
