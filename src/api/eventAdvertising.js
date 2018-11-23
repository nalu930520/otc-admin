import request from '@/utils/request'
// 活动广告
export function advertising(params) {
  return request({
    url: '/advertisement/activity',
    method: 'get',
    params
  })
}
// 广告列表
export function advertisingList(params) {
  return request({
    url: `/advertisement/activity/${params.activities_id}`,
    method: 'get',
    params
  })
}
// 删除活动
export function removeList(data) {
  return request({
    url: '/advertisement/activity',
    method: 'delete',
    data
  })
}
// 删除广告
export function removeAds(data) {
  return request({
    url: '/advertisement',
    method: 'delete',
    data
  })
}

// 修改活动名称

export function Editname(data) {
  return request({
    url: '/advertisement/activity',
    method: 'PATCH',
    data
  })
}

// 添加活动名称
export function addname(data) {
  return request({
    url: '/advertisement/activity',
    method: 'post',
    data
  })
}

// 回收站
export function recyclebin(params) {
  return request({
    url: '/advertisement/trash',
    method: 'get',
    params
  })
}
// 回收删除/恢复
export function recyclebinDelete(data) {
  return request({
    url: '/advertisement/trash/list',
    method: 'patch',
    data
  })
}
