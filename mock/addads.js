import Mock from 'mockjs';
// 活动分类/广告形式/跳转类型
let stillData = {
  Activity_classification: [
    { id: 100, value: '活动一' },
    { id: 101, value: '活动二' },
    { id: 102, value: '活动三' }
  ],
  advertisement_form: [
    { id: 111, value: '广一' },
    { id: 222, value: '广二' },
    { id: 333, value: '广三' }
  ],
  Jump_type: [
    { id: 123, value: '跳一' },
    { id: 234, value: '跳二' },
    { id: 345, value: '跳三' }
  ]
};

// 使用素材
let materialData = [
  { id: 1000, value: '素材一' },
  { id: 1010, value: '素材二' },
  { id: 1020, value: '素材三' }
];

// 投放人群
let dropthecrowdData = [
  { id: 1111, value: '投放一' },
  { id: 2222, value: '投放二' },
  { id: 3333, value: '投放三' }
];

// 保存
let formData = {
  msg: '保存成功',
  update_timer: '123132131'
};
// 全部删除

let deleteData = {
  msg: 'ok',
  update_timer: '成功删除'
};

export default {
  stillselect: config => {
    return stillData
  },
  materialselect: config => {
    return materialData
  },
  dropthecrowdselect: config => {
    return dropthecrowdData
  },
  formDatas: config => {
    return formData
  },
  deleteDatas: config => {
    return deleteData
  }
};
