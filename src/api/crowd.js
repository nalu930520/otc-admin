import request from '@/utils/request'

export function getCrowdList(params) {
  return request({
    url: '/crowd/lists',
    method: 'get',
    params
  })
}
export function delToReycleBin(params) {
  return request({
    url: '/crowd',
    method: 'patch',
    data: params
  })
}
export function getCrowdDetail(params) {
  return request({
    url: '/crowd',
    method: 'get',
    params
  })
}
export function getCrowdCalculate(params) {
  return request({
    url: '/crowd/customer_count',
    method: 'post',
    data: params
  })
}
export function saveCrowd(params) {
  return request({
    url: '/crowd',
    method: 'post',
    data: params['calData']
  })
}
export function updateCrowd(params) {
  return request({
    url: '/crowd',
    method: 'put',
    data: params['calData']
  })
}
export function upload_file(data) {
  console.info(data, 'data----')
  return request({
    url: '/crowd/upload_file',
    method: 'post',
    data
  })
}
export function deleteCrowd(params) {
  return request({
    url: '/crowd',
    method: 'delete',
    data: params
  })
}
export function trashCrowd(params) {
  return request({
    url: '/crowd/trash',
    method: 'post',
    data: params
  })
}
export function batchOperaCrowd(params) {
  return request({
    url: '/crowd/trash/list',
    method: 'patch',
    data: params
  })
}
