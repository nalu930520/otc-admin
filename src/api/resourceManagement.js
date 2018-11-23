import request from '@/utils/request'

// 获取素材列表
export function getResourceList(params) {
  return request({
    url: '/material',
    method: 'get',
    data: {
      params
    }
  })
}

// 删除
export function removeList(params) {
  return request({
    url: '/material',
    method: 'delete',
    data: {
      params
    }
  })
}

// 添加素材分类
export function addResourceSort(parmas) {
  return request({
    url: '/material/classify',
    method: 'POST',
    data: {
      parmas
    }
  })
}
