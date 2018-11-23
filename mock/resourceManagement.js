import Mock from 'mockjs'


const count = 10
const total = 100
export default {
  getResourceList: config => {
    const List = []
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: '@id()',
          name: '@csentence(5)',
          num: '@integer(1, 10)',
          activation_ads: '@integer(10, 20)',
          update_at: '@datetime()',
          update_people: '@first()'
        })
      )
    }
    return {
      total: total,
      items: List,
      page: JSON.parse(config.body).params.page,
      per_page: JSON.parse(config.body).params.per_page
    }
  },
  recyclebin: config => {
    const List = []
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: '@id()',
          activities: '@csentence(5)',
          adname: '@csentence(3, 5)',
          advertisementform: '@csentence(5)',
          update_timer: '@datetime()',
          operator: '@first()'
        })
      )
    }
    return {
      total: total,
      items: List,
      page: JSON.parse(config.body).params.page,
      per_page: JSON.parse(config.body).params.per_page
    }
  }
}
