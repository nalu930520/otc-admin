import Mock from 'mockjs'
// import { param2Obj } from '../src/utils'

const List = []
const count = 80

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id()',
    crowd_name: '@name()',
    update_time: +Mock.Random.date('T'),
    operator: '@name()'
  }))
}
// const crowdDetail = {
//   crowd_name: '人群名称',
//   source: 'group', // file-上传文件,group-组合筛选
//   desc: '备注-----',
//   group: {
//     country: ['AD'],
//     assets: [{
//       currency: ['aed'],
//       query_class: 'limit', // order-排名 limit-限额
//       limit_group: {
//         begin: '10',
//         end: '200'
//       }
//     }, {
//       currency: ['btc', 'ech'],
//       query_class: 'order', // order-排名 limit-限额
//       limit_group: {
//         begin: '6',
//         end: '4444'
//       }
//     }],
//     OTCchain: [{
//       currency_chain: ['ech'],
//       query_class_chain: 'limit',
//       limit_group_chain: {
//         begin: '1',
//         end: '222'
//       }
//     }],
//     active_user: '1~20', // 1～20
//     platform: 'ios' // ios，android
//   },
//   file: {
//     file_name: 'sdssssssssss', // 文件名称
//     file_url: 'https://6m69p7.axshare.com/' // 文件url
//   }
// }
const countryOptions = [{
  label: ['中国'],
  key: 'zg',
  value: 'zhongguo'
}]
const currencyOptions = [{
  label: 'BTC',
  key: 'btc',
  value: 'btc'
}, {
  label: 'ECH',
  key: 'ech',
  value: 'ech'
}]
export default {
  // getCrowdDetail: config => {
  //   console.log('config:', config)
  //   return {
  //     detail: crowdDetail
  //   }
  // },
  // getCrowdList: config => {
  //   console.log('getAdminUserREQ', config)
  //   const { page, per_page } = param2Obj(config.url)
  //   const perPage = per_page || 10
  //   return {
  //     page: parseInt(page),
  //     per_page: parseInt(per_page),
  //     total: List.length,
  //     list: List.slice((page - 1) * perPage, page * perPage)
  //   }
  // },
  deleteCrowd: config => {
    console.log('getAdminUserREQ', config)
    return {
      success: true
    }
  },
  // getCrowdCalculate: config => {
  //   return {
  //     total_user: parseInt(Math.random() * 1000)
  //   }
  // },
  // saveCrowd: config => {
  //   return {
  //     success: true
  //   }
  // },
  countryList: config => {
    return {
      list: countryOptions
    }
  },
  currencyList: config => {
    return {
      list: currencyOptions
    }
  }
  // upload: config => {
  //   return {
  //     url: 'https://6m69p7.axshare.com/',
  //     total_user: parseInt(Math.random() * 1000)
  //   }
  // }
}
