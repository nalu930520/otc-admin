import request from '@/utils/request'

export function stillselect(params) {
  return request({
    url: '/advertisement/activity',
    method: 'get',
    params
  })
}
// 获取使用素材select
export function materialselect(params) {
  return request({
    url: '/material/list',
    method: 'get',
    params
  })
}

export function dropthecrowdselect(params) {
  return request({
    url: '/dropthecrowdData/list',
    method: 'get',
    params
  })
}
//   保存接口
export function saveForm(data) {
  return request({
    url: '/advertisement',
    method: 'post',
    data
  })
}
//   保存接口
export function saveFormPut(data) {
  return request({
    url: '/advertisement',
    method: 'put',
    data
  })
}


// 编辑数据
export function editAdvertising(params) {
  return request({
    url: '/advertisement',
    method: 'get',
    params
  })
}

// 人群
export function crowdIds() {
  return request({
    url: '/crowd/all',
    method: 'get'
  })
}


