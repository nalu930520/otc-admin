import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/',
    method: 'post',
    data
  })
}

export function getCaptcha(params) {
  return request({
    url: '/user/captcha',
    method: 'get',
    params
  })
}
// 
// export function logout() {
//   return request({
//     url: '/user/logout',
//     method: 'post'
//   })
// }

export function getRedirectUrl(params) {
  return request({
    url: '/v1/oauth/authorize',
    method: 'get',
    params
  })
}

export function fetchOauthUrl(data) {
  return request({
    url: '/v1/oauth/authorize',
    method: 'post',
    data
  })
}

export function fetchUserPermission() {
  return request({
    url: '/v1/admin_user',
    method: 'get'
  })
}
