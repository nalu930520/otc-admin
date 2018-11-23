import request from '@/utils/request'
// 全部删除
export function allDelete(params) {
  return request({
    url: '/allDelete/list',
    method: 'get',
    data: {
      params
    }
  })
}

// 全部恢复
export function allRestore(params) {
  return request({
    url: '/allRestore/list',
    method: 'get',
    data: {
      params
    }
  })
}

// 恢复
export function restoreList(params) {
  return request({
    url: '/restoreList/list',
    method: 'get',
    data: {
      params
    }
  })
}
