<template>
  <div class="wallet-container">
    <div class='card-panel'>
      <div class="card-panel-icon-wrapper">
        <img src="../../assets/wallet.jpg" alt="">
      </div>
      <div class="card-panel-description">
        <el-row>
          <el-col :span="8">
            <div class="card-panel-text">总金额</div>
            <div class="card-panel-title">{{!!getAsset('usdt') ? getAsset('usdt')[0].total_volume : '' | formatUSDAmount}}<span class="card-panel-text"> USDT</span></div>
          </el-col>
          <el-col :span="8">
            <div class="card-panel-text">可用金额</div>
            <div class="card-panel-title">{{!!getAsset('usdt') ? getAsset('usdt')[0].available_volume : '' | formatUSDAmount}}<span class="card-panel-text"> USDT</span></div>
          </el-col>
          <el-col :span="8">
            <div class="card-panel-text">冻结金额</div>
            <div class="card-panel-title">{{!!getAsset('usdt') ? getAsset('usdt')[0].frozen_volume : '' | formatUSDAmount}}<span class="card-panel-text"> USDT</span></div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :xs="24" :sm="11">
            <el-form-item label="活动时间:">
              <el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="timestamp" @change="onDateChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :offset="1">
            <el-form-item label="交易类型:">
              <el-select style="width:100%" v-model="form.type" multiple placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  default-first-option>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <el-row>
            <el-col :span="12">
              <el-button @click="downloadFile">下载csv文件</el-button>
            </el-col>
            <el-col :span="12" style="textAlign:right">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="onReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-alert
       title="手续费不包含在交易金额中"
       type="info"
       :closable="false"
       show-icon>
      </el-alert>
      <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="fetchData" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TableCom from '@/components/TableCom'
import { fetchTransaction, fetchUserAssets } from '@/api/wallet'
import * as moment from 'moment'
import Filter from 'lodash.filter'

@Component({
  components: {
    TableCom
  }
})

export default class WalletDetail extends Vue {
  list: any = {}
  listLoading = true
  form: any = {
    date: [],
    type: []
  }
  date: any = []
  assets: any = []

  options: any[] = [
    {
      value: 3,
      label: '支付'
    },
    {
      value: 4,
      label: '系统退款'
    },
    {
      value: 5,
      label: 'offchain转账'
    },
    {
      value: 6,
      label: 'onchain转出'
    },
    {
      value: 7,
      label: 'onchain充值'
    },
    {
      value: 9,
      label: '平台转账'
    },
    {
      value: 11,
      label: '币种兑换'
    },
    {
      value: 12,
      label: '兑换撤销'
    },
    {
      value: 13,
      label: 'WC支付'
    },
    {
      value: 14,
      label: '卡月费'
    },
    {
      value: 15,
      label: 'twitter发送'
    },
    {
      value: 16,
      label: 'twitter退款'
    },
    {
      value: 17,
      label: 'payment withdraw'
    },
    {
      value: 18,
      label: 'wavecrest deposit'
    },
    {
      value: 19,
      label: 'otc send'
    },
    {
      value: 20,
      label: 'otc refund'
    },
  ]
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'created_at', // <String>  对应属性名
    label: '创建时间', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return moment.unix(cellValue).format('YYYY-MM-DD HH:mm:ss')
    }
  },{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'SN', // <String>  对应属性名
    label: '订单号' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'type', // <String>  对应属性名
    label: '交易类型', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.transactionType(cellValue) : ''
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'status', // <String>  对应属性名
    label: '交易状态', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.transactionStatus(cellValue) : ''
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'payer_nickname', // <String>  对应属性名
    label: '账户' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'amount', // <String>  对应属性名
    label: '交易金额', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.formatUSDAmount(cellValue) + " " + row.currency_code.toUpperCase() : ''
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'fee', // <String>  对应属性名
    label: '手续费', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.formatUSDAmountFee(cellValue) + " " + row.currency_code.toUpperCase() : ''
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'balance', // <String>  对应属性名
    label: '交易后余额', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.formatUSDAmount(cellValue) + " " + row.currency_code.toUpperCase() : ''
    }
  }
]
  onDateChange(value){
    this.form.date[0] = value[0] / 1000
    this.form.date[1] = value[1] / 1000
  }
  created() {
    const $route: any = this.$route
    this.fetchData(1, 10, {currency_code: $route.params.currency, ...this.form})
    fetchUserAssets().then(response => {
      if (response.ret === 'ok') {
        console.log("wallet:",response)
        this.assets = response.data.coin_asset
      } else {
        this.$message({
          message: response.ret,
          type: 'error'
        })
      }
    })
  }
  fetchData(page, per_page, data) {
    this.listLoading = true
    fetchTransaction({
      page_no: page-1,
      limit: per_page,
      ...data
    }).then(response => {
      if (response.ret === 'ok') {
        this.list = {
          data: response.data.transactions,
          page: page,
          per_page: per_page,
          total: response.data.total
        }
      } else if(data.is_download) {
        if (response && response.ret) {
          this.$message({message: '保存失败', type: 'error'})
          return
        }
        let url = window.URL.createObjectURL(new Blob([response]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        const time = moment().format('YYYYMMDDHHmmss')
        link.setAttribute('download', `${time}.csv`)
        document.body.appendChild(link)
        link.click()
      } else {
        this.$message({
          message: response.ret,
          type: 'error'
        })
      }
    })
  }

  getAsset(currency){
    if (this.assets.length > 0) {
      return Filter(this.assets, {currency_code: currency})
    } else {
      return ''
    }
  }
  // 查询
  onSubmit() {
    console.log('Date:', this.form.date)
    this.fetchData(1, 10, {currency_code: 'usdt', is_download: false, ...this.form})
  }
  downloadFile() {
    this.fetchData(1, 10, {currency_code: 'usdt', ...this.form, is_download: true})
  }
  // 重置
  onReset() {
    this.form = {
      date: [],
      type: []
    }
    this.date = []
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wallet {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  .content {
    background: #fff;
    padding: 20px;
    margin-top: 18px;
  }
  .card-panel {
    background: #fff;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    padding: 20px;
    margin-top: 18px;
    display: flex;
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
      width: 100%;
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
