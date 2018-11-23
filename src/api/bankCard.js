import request from '@/utils/request'

export function getCardList(params) {
  return request({
    url: '/card',
    method: 'get',
    params
  })
}
export function createBankCard(params) {
  return request({
    url: '/card',
    method: 'post',
    data: params
  })
}
export function deleteBankCard(params) {
  return request({
    url: `/card/${params}`,
    method: 'delete'
  })
}
export function updateBankCard(params, data) {
  return request({
    url: `/card/${params}`,
    method: 'put',
    data: data
  })
}
