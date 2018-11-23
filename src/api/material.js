import request from '@/utils/request'

// 获取分类列表
export function fetchClassifyList(params) {
  return request({
    url: '/material/classify',
    method: 'get',
    params
  })
}

// 添加素材分类
export function addMaterialClassify(data) {
  return request({
    url: '/material/classify',
    method: 'post',
    data
  })
}

// 删除分类
export function deleteClassify(data) {
  return request({
    url: '/material/classify',
    method: 'delete',
    data
  })
}

// 编辑素材分类
export function updateMaterialClassify(data) {
  return request({
    url: '/material/classify',
    method: 'put',
    data
  })
}

// 获取素材列表
export function fetchMaterialList(params) {
  console.log('materialId:', params)
  const link = `/material/classify/${params.classify_id}`
  return request({
    url: link,
    method: 'get'
  })
}

// 删除分类
export function removeClassify(data) {
  return request({
    url: '/material/classify',
    method: 'delete',
    data
  })
}

// 添加素材
export function addMaterial(data) {
  return request({
    url: '/material',
    method: 'post',
    data
  })
}

// 获取素材详情
export function fetchMaterialDetail(params) {
  const link = `/material/${params.material_id}`
  delete params.material_id
  return request({
    url: link,
    method: 'get',
    params
  })
}

// 编辑素材
export function updateMaterial(data) {
  return request({
    url: `/material/${data.material_id}`,
    method: 'put',
    data
  })
}

// 修改素材状态
export function updateMaterialStatus(data) {
  return request({
    url: '/material/check_status',
    method: 'post',
    data
  })
}

// 删除素材 恢复素材
export function deleteMaterial(data) {
  return request({
    url: '/material/status',
    method: 'post',
    data
  })
}

// 回收列表
export function fetchTrashList(params) {
  return request({
    url: '/material/trash',
    method: 'get',
    params
  })
}

// 批量删除 批量恢复
export function updateAllTrashData(data) {
  return request({
    url: '/material/status',
    method: 'post',
    data
  })
}
