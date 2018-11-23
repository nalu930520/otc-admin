import request from '@/utils/request'

export function queryOrderList(params) {
  return request({
    url: '/order',
    method: 'post',
    data: params
  })
}

export function queryOrderRelease(params) {
  return request({
    url: '/order/release/coin',
    method: 'post',
    data: params
  })
}

export function commonSelOpt() {
  return request({
    url: '/common',
    method: 'get'
  })
}

export function orderDetail(params) {
  return request({
    url: `/order/${params}`,
    method: 'get'
  })
}

export function otcSetting() {
  return request({
    url: '/otc_setting/',
    method: 'get'
  })
}

export function updateOtcSetting(params) {
  return request({
    url: '/otc_setting/',
    method: 'put',
    data: params
  })
}
