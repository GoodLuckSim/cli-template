import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'f4/api/sso/user/login',
    method: 'post',
    data
  })
}
