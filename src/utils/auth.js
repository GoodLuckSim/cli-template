import Cookies from 'js-cookie'

const TokenKey = 'fusetoken'
// const LanguageKey = 'LanguageSESSION'
import Dao from '@/utils/dao.js'

export function getUserInfo() {
  return Dao.get('userInfo')
}

export function setUserInfo(userInfo) {
  return Dao.set('userInfo', userInfo)
  // return Cookies.set(TokenKey, token)
}
export function getToken() {
  const { token } = Dao.get('userInfo')
  return Dao.get('userToken') || token
}

export function setToken(token) {
  return Dao.set('userToken', token)
}

export function getLanguage() { // 语言
  return Dao.get('userLanguage')
}

export function setLanguage(lang) {
  return Dao.set('userLanguage', lang)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUploadFilesHeaders() {
  const { token } = Dao.get('userInfo')
  return { 'fusetoken': token }
}
