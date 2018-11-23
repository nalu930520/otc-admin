import { param2Obj } from '../src/utils'

let adminUserList = []
let groupList = []
let rolesUsersList = []
for (let i = 0; i < 100; i += 1) {
  adminUserList.push({
    id: i,
    createdAt: new Date(`2018-07-${Math.floor(i / 2) + 1}`),
    username: `xn111111  ${i}`,
    email: 'nx222222',
    rolename: '15397300863'
  })
}
for (let i = 0; i < 20; i += 1) {
  groupList.push({
    id: i,
    createdAt: new Date(`2018-07-${Math.floor(i / 2) + 1}`),
    rolename: `public ${i}`
  })
}
for (let i = 0; i < 21; i += 1) {
  rolesUsersList.push({
    id: i,
    rolename: 'aaaa',
    users: [{ id: i, username: 'test' }, { id: i, username: 'test' }, { id: i, username: 'test' }, { id: i, username: 'test' }]
  })
}
export default {
  getAdminUser: config => {
    console.log('getAdminUserREQ', config)
    const { page, per_page } = param2Obj(config.url)
    return {
      page: parseInt(page),
      per_page: parseInt(per_page),
      total: adminUserList.length,
      users: adminUserList.slice((page - 1) * per_page, page * per_page)
    }
  },
  getGroupList: config => {
    console.log('getGroupList', config)
    const { page, per_page } = param2Obj(config.url)
    console.log(page)
    console.log(per_page)
    console.log(param2Obj(config.url))
    if (!param2Obj(config.url)) {
      return groupList
    }
    return {
      page: parseInt(page),
      per_page: parseInt(per_page),
      total: groupList.length,
      roles: groupList.slice((page - 1) * per_page, page * per_page)
    }
  },
  getRolesUsers: config => {
    console.log('getRolesUsers', config)
    console.log(rolesUsersList)
    const { page, per_page } = param2Obj(config.url)
    return {
      page: parseInt(page),
      per_page: parseInt(per_page),
      total: rolesUsersList.length,
      roles_users: rolesUsersList.slice((page - 1) * per_page, page * per_page)
    }
  }
}
