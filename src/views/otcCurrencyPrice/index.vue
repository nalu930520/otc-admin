/* eslint-disable */
<template>
  <div class="app-main" v-loading="loading">
    <div class="content">
      <TableCom
        ref = "TableCom"
        :dataSource="list" 
        :columns="tablehead"
      />
    </div>
    <template v-if="dialogVisible">
      <PriceDialog
        :data = "rowData"
        @closeDialog = "closeDialog"
        @submitPass = "submitPass"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Getter } from 'vuex-class'
import { Component, Vue, Watch } from 'vue-property-decorator'
import TableCom from '@/components/TableCom'
import PriceDialog from '@/views/otcCurrencyPrice/priceDialog'
import { otcSetting } from '@/api/otcTransment'
import { queryCurrency } from '@/api/golbal'
import { setInterval } from 'timers'

@Component({
  components: {
    TableCom,
    PriceDialog
  }
})
export default class otcTransationManagementList extends Vue {
  @Getter('currency') currency
  currencyList: Array<any> = []
  loading: boolean = false
  dialogVisible: boolean = false
  rowData: any = {}
  list: any = {
    data: []
  }
  intervalFlg: boolean = false
  _i: any = ''
  tablehead: Array<any> = [
    {
      hasSort: false,
      isShow: true,
      prop: 'image_url',
      imageUrl: true,
      label: ''
    }, {
      hasSort: false,
      isShow: true,
      prop: 'source_currency_code',
      label: '交易币种',
      formatter(row, column, cellValue, index) {
        if (!cellValue) return cellValue
        return cellValue.toUpperCase()
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'towards_currency_code',
      label: '购买币种',
      formatter(row, column, cellValue, index) {
        if (!cellValue) return cellValue
        return cellValue.toUpperCase()
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'current_price',
      label: '当前价格',
      formatter: (row, column, cellValue, index) => {
        if (!cellValue) return cellValue
        const options: any = this.$options
        return options.filters.filterAmount(cellValue)
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'price_type',
      label: '价格类型',
      formatter: (row, column, cellValue, index) => {
        switch (cellValue) {
          case 1:
            return '固定价格'
          case 2:
            return '浮动价格'
          default:
            return '-'
        }
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'opration',
      label: '操作',
      operations: (row) => {
        return [{
          label: '修改',
          color: 'primary',
          func: (index, row) => {
            this.updatePrice(index, row)
          }
        }]
      }
    }
  ]
  @Watch('intervalFlg')
  onInputValueChange(val: boolean, oldVal: boolean) {
    if (val === true) {
      this.loopQueryList()
    } else {
      clearInterval(this._i._id)
    }
  }
  loopQueryList() {
    this.queryList()
    this._i = setInterval(() => {
      this.queryList()
    }, 30 * 1000)
  }
  created() {
    this.queryList()
  }
  destroyed() {
    clearInterval(this._i._id)
  }
  async queryList() {
    this.loading = true
    if (this.currency && this.currency.length) {
      this.currencyList = this.currency
    } else {
      const resCurrData = await queryCurrency()
      if (resCurrData.ret === 1) {
        this.$store.commit('SET_CURRENCY', resCurrData.currencies)
        this.currencyList = resCurrData.currencies
      }
    }
    const settingData = await otcSetting()
    if (settingData.ret === 'ok') {
      this.list.data = this.filterImgUrl(settingData.data.price_list)
      const temp = this.list.data.find(val => val.price_type === 2)
      this.$set(this, 'intervalFlg', !!temp)
    } else {
      if (this._i) {
        clearInterval(this._i._id)
      }
      this.messageAlert(settingData.ret || '获取列表失败', 'error')
    }
    this.loading = false
  }
  filterImgUrl(list) {
    if (list && list.length === 1) {
      list[0].image_url = 'http://mobi-res.mobimecdn.com/usdt.png?e=1551679253&token=paOH3LkKPuT47JK1qxxOpTI44-cRBSa9IUfQrWXZ:UPdx4Y-bqsSh3GiDBJLmZ7jI55M='
    } else {
      list.map(item => {
        this.currencyList.forEach(c => {
          if (c.code.toUpperCase() === item.source_currency_code) {
            item.image_url = c.image_url
          }
        })
      })
    }
    return list
  }
  updatePrice(index, row) {
    clearInterval(this._i._id)
    const options: any = this.$options
    this.rowData = {
      ...row,
      current_price: options.filters.filterAmount(row.current_price)
    }
    this.dialogVisible = true
  }
  closeDialog() {
    this.dialogVisible = false
  }
  submitPass(type) {
    this.dialogVisible = false
    this.messageAlert('修改成功', 'success', false, () => {
      if (type === 1) {
        this.queryList()
      } else {
        this.loopQueryList()
      }
    })
  }
  messageAlert(message:string, type?:any, showClose?:boolean, cb?:Function) {
    if (!cb) {
      cb = () => {}
    }
    this.$message({
      message: message,
      type: type || 'warning',
      showClose: showClose || false,
      onClose: cb()
    })
  }
}
</script>
<style lang='scss' scoped>
  .content{
    background-color: #fff;
    padding: 40px 20px;
    margin-top: 18px;
  }
</style>
