import Mock from 'mockjs'
import loginAPI from './login'
import transactionAPI from './transactions'
import crowdAPI from './crowd'
import eventAdvertisingAPI from './eventAdvertising'
import addadsAPI from './addads'
import backManagementAPI from './backManagement'
import resourceManagementAPI from './resourceManagement'
// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// 人群相关
// Mock.mock(/\/crowd\/list/, 'get', crowdAPI.getCrowdList)
// Mock.mock(/\/crowd\/delete/, 'get', crowdAPI.deleteCrowd)
// Mock.mock(/\/crowd\/calculate/, 'post', crowdAPI.getCrowdCalculate)
// Mock.mock(/\/crowd\/save/, 'get', crowdAPI.saveCrowd)
// Mock.mock(/\/crowd\/countryList/, 'get', crowdAPI.countryList)
// Mock.mock(/\/crowd\/currencyList/, 'get', crowdAPI.currencyList)
// Mock.mock(/\/crowd\/upload/, 'post', crowdAPI.upload)

// 广告相关
Mock.mock(/\/advertising\/list/, 'get', eventAdvertisingAPI.getList)
Mock.mock(/\/eventAdvertising\/list/, 'get', eventAdvertisingAPI.editList)
Mock.mock(/\/remove\/list/, 'get', eventAdvertisingAPI.getList)
Mock.mock(/\/editname\/data/, 'get', eventAdvertisingAPI.getList)
Mock.mock(/\/addname\/data/, 'get', eventAdvertisingAPI.getList)
Mock.mock(/\/recyclebin\/data/, 'get', eventAdvertisingAPI.recyclebin)
Mock.mock(/\/addadsData\/list/, 'get', addadsAPI.stillselect)
Mock.mock(/\/materialData\/list/, 'get', addadsAPI.materialselect)
Mock.mock(/\/dropthecrowdData\/list/, 'get', addadsAPI.dropthecrowdselect)
Mock.mock(/\/saveFormData\/list/, 'get', addadsAPI.formDatas)
Mock.mock(/\/allDelete\/list/, 'get', addadsAPI.formDatas)
Mock.mock(/\/allRestore\/list/, 'get', addadsAPI.formDatas)
Mock.mock(/\/restoreList\/list/, 'get', addadsAPI.formDatas)
Mock.mock(/\/editAdvertising\/list/, 'get', addadsAPI.formDatas)
// 素材管理
// Mock.mock(/\/material/, 'get', resourceManagementAPI.getResourceList)
// Mock.mock(/\/material/, 'delete', resourceManagementAPI.getResourceList)

// 权限管理

// 获取后台用户列表
// Mock.mock(/\/admin_users/, 'get', backManagementAPI.getAdminUser)
// // 获取后台群组列表
// Mock.mock(/\/admin_roles/, 'get', backManagementAPI.getGroupList)
// // 获取群组用户列表
// Mock.mock(/\/admin\/roles_users/, 'get', backManagementAPI.getRolesUsers)
export default Mock
