import request from '@/utils/request'

export function fetchAdminUsers(parmas) {
  return request({
    url: '/v1/admin_users',
    method: 'get',
    params: parmas
  })
}

export function fetchAdminRoles(params) {
  return request({
    url: '/v1/admin_roles',
    method: 'get',
    params
  })
}

export function fetchRolesUsers(params) {
  return request({
    url: '/v1/admin/roles_users',
    method: 'get',
    params
  })
}

export function deleteAdminUser(data) {
  return request({
    url: '/v1/admin_user',
    method: 'delete',
    data
  })
}

export function deleteAdminRole(data) {
  return request({
    url: '/v1/admin_role',
    method: 'delete',
    data
  })
}

export function editAdminUserRole(data) {
  return request({
    url: '/v1/admin_user',
    method: 'patch',
    data
  })
}

export function editRolesUsers(data) {
  return request({
    url: '/v1/admin/roles_users',
    method: 'put',
    data
  })
}

export function fetchAdminUsersPublic() {
  return request({
    url: '/v1/admin_users/public',
    method: 'get'
  })
}

export function createRole (data) {
  return request({
    url: '/v1/admin_role',
    method: 'post',
    data
  })
}
