import request from '@/utils/request'

export function fetchUserProfile() {
  return request({
    url: '/profile',
    method: 'get'
  })
}

export function setName(data) {
  return request({
    url: '/profile/name',
    method: 'PUT',
    data
  })
}

export function setPassword(data) {
  return request({
    url: '/profile/psd',
    method: 'PUT',
    data
  })
}
