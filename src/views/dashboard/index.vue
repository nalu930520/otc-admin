<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name:{{name}}</div>
    <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div> -->
    <div class='card-panel'>
      <div class="card-panel-icon-wrapper">
        <img src="../../assets/wallet.jpg" alt="">
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">总资产</div>
        <div class="card-panel-title">{{!!getAsset('usdt') ? getAsset('usdt')[0].total_volume : '' | formatUSDAmount}}<span class="card-panel-text"> USDT</span></div>
      </div>
      <div class="card-btn">
        <router-link class="el-button el-button--primary" to="/wallet/send">
          发送
        </router-link>
        <router-link  class="el-button el-button--primary" to="/wallet/recive">接收</router-link>
      </div>
    </div>
    <div class="card-panel">
      <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="fetchData" />
    </div>
  </div>
</template>

<script lang="ts">
import { Getter } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import TableCom from '@/components/TableCom'
import { fetchUserWallet, fetchUserAssets } from '@/api/wallet'
import * as moment from 'moment'
import Filter from 'lodash.filter'
import Bg from 'bignumber.js'

@Component({
  components: {
    TableCom,
  }
})

export default class dashboard extends Vue {
  @Getter('name') name
  @Getter('roles') roles
  list: any = {
    data: []
  }
  listLoading = true
  classifyId: String = ''
  classifyName: String = ''
  assets: any = []
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'currency_code', // <String>  对应属性名
    label: '货币', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.filterCrypto(cellValue) : ''
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'available_volume', // <String>  对应属性名
    label: '可用金额', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return new Bg(cellValue / 100000000).toFormat(2, 1) + " " + row.currency_code.toUpperCase()
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'frozen_volume', // <String>  对应属性名
    label: '冻结金额', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.formatUSDAmount(cellValue) + " " + row.currency_code.toUpperCase() : ''
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'total_volume', // <String>  对应属性名
    label: '总金额', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.formatUSDAmount(cellValue) + " " + row.currency_code.toUpperCase() : ''
    }
  },
  {
    hasSort: false,
    isShow: true,
    prop: 'operation',
    label: '操作',
    operations: (row) => {
      return [{
        label: '查看',
        color: 'primary',
        func: (index, row) => {
          this.toWalletDetail(row.currency_code)
        }
      }]
    }
  }
]
  created() {
    this.fetchData(1, 10)
  }
  fetchData(page, per_page) {
    this.listLoading = true
    fetchUserAssets().then(response => {
      if (response.ret === 'ok') {
        this.list = {
          data: response.data.coin_asset
        }
      } else {
        this.$message({
          message: response.ret,
          type: 'error'
        })
      }
    })
  }
  getAsset(currency){
    if (this.list.data.length > 0) {
      return Filter(this.list.data, {currency_code: currency})
    } else {
      return ''
    }
  }
  // 编辑
  toWalletDetail(index) {
    this.$router.push({
      path: `/wallet/${index}`
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  .card-panel {
    background: #fff;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    padding: 20px;
    margin-top: 18px;
    .card-btn{
      float: right;
      margin-top: 40px;
    }
    .card-panel-icon-wrapper {
      float: left;
      width: 100px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      img{
        width: 100%;
      }
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 18px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-title {
        font-size: 30px;
        font-weight: normal;
        color: #000;
        line-height: 30px;
      }
    }
}
</style>
