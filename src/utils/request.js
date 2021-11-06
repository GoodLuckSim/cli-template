import axios from 'axios'
import { Message } from 'element-ui'
import Dao from '@/utils/dao.js'
import { getToken } from '@/utils/auth'
import { getLanguage } from '@/utils/auth'
const protocol = window.location.protocol.indexOf('file:') > -1 ? 'https:' : window.location.protocol
const ORIGIN = protocol + process.env.VUE_APP_BASE_API
// create an axios instance
// import instance from '@/main'
const service = axios.create({
  baseURL: ORIGIN // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000, // request timeout
  // headers: { 'Content-Type': 'application/json' }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const userInfo = Dao.get('userInfo')
    const cookieToken = getToken()
    if (process.env.NODE_ENV === 'development') {
      if (userInfo) {
        const { accountId, accountName, token } = userInfo
        config.headers['accountId'] = accountId
        config.headers['accountName'] = accountName
        config.headers['fusetoken'] = token
      }
    } else {
      config.headers['fusetoken'] = cookieToken
    }
    config.headers['lang'] = getLanguage()
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code != '200' && !res.resultObj) {
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.code === 40001) {
        // 判断当前的运行环境是否是Electron应用
        const ipcRenderer = window.ipcRenderer
        if (ipcRenderer) {
          Dao.remove('userInfo')
          ipcRenderer.send('asynchronous-message', 'reLog')
        } else {
        // to re-login
          if (process.env.NODE_ENV === 'development') {
            window.location.href = location.origin + '/#/login'
          } else {
            window.location.href = location.origin + '/vn/app/#/login'
          }
        }
      } else if (res.code == 200003000 || res.code == 200002002) {
        Message({
          message: res.message || res.errorCode || 'Error',
          type: 'warning',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.message || res.errorCode || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // return Promise.reject(res)
      return ''
    } else {
      return res.data || res.resultObj || { status: true }
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return error
  }
)

export default service
