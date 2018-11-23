import Mock from 'mockjs'


const count = 10
const total = 100
let page=1
export default {
  getList: config => {
    const List = []
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: "@id()",
          name: "@csentence(5)",
          number_ads: "@integer(1, 10)",
          activation_ads: "@integer(10, 20)",
          update_timer: "@natural(1000000000,2000000000)",
          operator: "@first()"
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
  editList: config => {
    const List = []
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: "@id()",
          name: "@csentence(5)",
          advertisement_form: "@csentence(5)",
          status: "@csentence(3)",
          scheduled_task: "@natural(1000000000,2000000000)",
          update_timer: "@natural(3022200000,5000000000)",
          operator: "@first()"
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
  recyclebin: config =>{
    const List = []
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: "@id()",
          activities: "@csentence(5)",
          adname: "@csentence(3, 5)",
          advertisementform: "@csentence(5)",
          update_timer: "@datetime()",
          operator: "@first()"
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
