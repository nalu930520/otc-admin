import request from '@/utils/request'

export function fetchUserWallet() {
  return request({
    url: '/wallet',
    method: 'get'
  })
}

export function fetchUserAssets() {
  return request({
    url: '/wallet/asset',
    method: 'get'
  })
}

export function fetchTransaction(data) {
  return request({
    url: '/transaction',
    method: 'post',
    data
  })
}

export function sendTransaction(data) {
  return request({
    url: '/transfer',
    method: 'post',
    data
  })
}

export function fetchFee(params) {
  return request({
    url: '/transfer/onchain_fee',
    method: 'get',
    params
  })
}
