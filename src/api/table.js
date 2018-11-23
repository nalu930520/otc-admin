import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params
  })
}
