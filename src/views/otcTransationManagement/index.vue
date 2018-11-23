/* eslint-disable */
<template>
  <div class="app-main" v-loading="loading">
    <div class="content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <el-form-item label="订单状态：" prop="status">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedStatus" @change="handlecheckedStatusChange" class="group-inline">
            <el-checkbox v-for="sItem in statusList" :label="sItem" :key="sItem">{{sItem}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="选择日期：" prop="date">
            <el-date-picker
              style="width:100%"
              v-model="ruleForm.date"
              type="daterange"
              value-format="timestamp"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交易总金额">
            <el-col :span="11">
              <el-form-item prop="fiat_amount_begin">
                <el-input v-model="ruleForm.fiat_amount_begin"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line ta-c" :span="2"> - </el-col>
            <el-col :span="11">
              <el-form-item prop="fiat_amount_end">
                <el-input v-model="ruleForm.fiat_amount_end"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单号：" prop="id">
            <el-input v-model="ruleForm.id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款备注号：" prop="ref_id">
            <el-input v-model="ruleForm.ref_id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交易货币：" prop="fiat_currency_code">
            <el-select v-model="ruleForm.fiat_currency_code" style="width:100%">
              <el-option
                v-for="item in fiatList"
                :key="item.code"
                :label="item.code.toUpperCase()"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购买货币：" prop="crypto_currency_code">
            <el-select v-model="ruleForm.crypto_currency_code" style="width:100%">
              <el-option
                v-for="item in cryptoList"
                :key="item.code"
                :label="item.code.toUpperCase()"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款人">
            <el-col :span="4">
              <el-form-item prop="tel_header">
                <el-input v-model="ruleForm.tel_header"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line ta-c" :span="1"> - </el-col>
            <el-col :span="19">
              <el-form-item prop="tel">
                <el-input v-model="ruleForm.tel"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="btn-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </div>
        </el-col>
      </el-form>
      <el-col :span="24">
        <el-button @click="betchRelease" :disabled="!releaseFlg">批量放币</el-button>
        <el-button @click="downloadFile">下载csv文件</el-button>
      </el-col>
      <el-col :span="24">
        <div class="table-title">
          <i class="el-icon-warning icon-color"></i>
          已选择 <span>{{totalNumber}}</span> 项 交易金额总计：<b>{{totalAmount | formatUSDAmount}} CNY</b>
          <span class="pointer" @click="resetSelection">清空</span>
        </div>
      </el-col>
      <TableCom
      ref = "TableCom"
      :dataSource="list" 
      :columns="tablehead" 
      :handleTableChange = "queryList" 
      :hasSelection = true
      @multipleSelection = "multipleSelection"
      />
    </div>
    <template v-if = "dialogVisible">
      <PasswordDialog
        :idList = "releaseList"
        @closeDialog = "closeDialog"
        @submitPass = "submitPass"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as moment from 'moment'
import TableCom from '@/components/TableCom'
import PasswordDialog from '@/views/otcTransationManagement/passwordDialog'
import { commonSelOpt, queryOrderList } from '@/api/otcTransment'
import { State } from 'vuex-class'
import Bg from 'bignumber.js'

interface formObj {
  date: any[],
  id: string,
  fiat_currency_code: string,
  fiat_amount_begin: string,
  fiat_amount_end: string,
  crypto_currency_code: string,
  ref_id: string,
  tel: string,
  tel_header: string
}
@Component({
  components: {
    TableCom,
    PasswordDialog
  }
})
export default class otcTransationManagementList extends Vue {
  @State('golbal') stateGolbal
  statusList = ['待付款', '待放币', '已完成', '已取消', '已超时']
  statusCodeList = [ {
    label: '待付款',
    code: 1
  }, {
    label: '待放币',
    code: 4
  }, {
    label: '已完成',
    code: 5
  }, {
    label: '已取消',
    code: 2
  }, {
    label: '已超时',
    code: 3
  }]
  ruleForm: formObj = {
    date: [],
    id: '',
    fiat_currency_code: '',
    fiat_amount_begin: '',
    fiat_amount_end: '',
    crypto_currency_code: '',
    ref_id: '',
    tel: '',
    tel_header: ''
  }
  passForm = {
    password: ''
  }
  rules = {
    // status: [{
    //   required: true,
    //   message: '请选择订单状态',
    //   trigger: 'blur'
    // }]
  }
  passRules = {
    password: [{
      required: true,
      message: '请输入交易密码',
      trigger: 'blur'
    }]
  }
  dialogVisible: boolean = false
  tableNotice: string = ''
  loading: boolean = false
  releaseFlg: boolean = false
  releaseList: Array<any> = []
  list: any = {}
  title: string = ''
  page_no: number = 1
  limit: number = 10
  totalNumber: number = 0
  totalAmount: number = 0
  tablehead: Array<any> = [
    {
      hasSort: false,
      isShow: true,
      prop: 'created_at',
      label: '创建时间',
      formatter(row, column, cellValue, index) {
        return moment.unix(cellValue).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'id',
      label: '订单号'
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'status',
      label: '订单状态',
      formatter: (row, column, cellValue, index) => {
        switch (cellValue) {
          case 1:
            return '待付款'
          case 2:
            return '已取消'
          case 3:
            return '已超时'
          case 4:
            return '待放币'
          case 5:
            return '已完成'
          default:
            return '-'
        }
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'fiat_currency_code',
      label: '交易货币',
      formatter(row, column, cellValue, index) {
        if (!cellValue) return cellValue
        return cellValue.toUpperCase()
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'fiat_amount',
      label: '交易总金额',
      formatter(row, column, cellValue, index) {
        if (!cellValue) return cellValue
        return new Bg(Number(cellValue)).dividedBy(10 ** 8).toFormat(2, 1)
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'crypto_currency_code',
      label: '购买货币',
      formatter(row, column, cellValue, index) {
        if (!cellValue) return cellValue
        return cellValue.toUpperCase()
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'crypto_amount',
      label: '购买总数量',
      formatter(row, column, cellValue, index) {
        if (!cellValue) return cellValue
        return new Bg(Number(cellValue)).dividedBy(10 ** 8).toFormat()
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'ref_id',
      label: '付款备注号'
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'buyer_mobile',
      label: '付款人'
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'opration',
      label: '操作',
      operations: (row) => {
        if (row.status === 4) {
          return [{
            label: '放币',
            color: 'primary',
            func: (index, row) => {
              this.singleRelease(index, row)
            }
          }, {
            label: '查看',
            color: 'primary',
            func: (index, row) => {
              this.bankCardDetail(index, row)
            }
          }]
        } else {
          return [{
            label: '查看',
            color: 'primary',
            func: (index, row) => {
              this.bankCardDetail(index, row)
            }
          }]
        }
      }
    }
  ]
  fiatList: Array<any> = []
  cryptoList: Array<any> = []
  checkAll: boolean = true
  isIndeterminate: boolean = false
  checkedStatus: Array<any> = ['待付款', '待放币', '已完成', '已取消', '已超时']
  created() {
    this.queryCommonSelOption()
  }
  async queryCommonSelOption() {
    if (this.stateGolbal['fiat_list'] && this.stateGolbal['fiat_list'].length && this.stateGolbal['crypto_list'] && this.stateGolbal['crypto_list'].length) {
      this.$set(this, 'fiatList', this.stateGolbal['fiat_list'])
      this.$set(this, 'cryptoList', this.stateGolbal['crypto_list'])
    } else {
      this.loading = true
      const resData = await commonSelOpt()
      if (resData.ret === 'ok') {
        this.$store.commit('SET_FIATLIST', resData.data.fiat_list)
        this.$store.commit('SET_CRYPTOLIST', resData.data.crypto_list)
        this.$set(this, 'fiatList', resData.data.fiat_list)
        this.$set(this, 'cryptoList', resData.data.crypto_list)
      }
      this.loading = false
    }
  }
  handleCheckAllChange(val) {
    this.checkedStatus = val ? this.statusList : []
    this.isIndeterminate = false
  }
  handlecheckedStatusChange(value) {
    let checkedCount = value.length
    this.checkAll = checkedCount === this.statusCodeList.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.statusCodeList.length
  }
  mounted() {
  }
  singleRelease(index, row) {
    this.dialogVisible = true
    this.releaseList = [row.id]
  }
  closeDialog() {
    this.dialogVisible = false
  }
  onSubmit() {
    const refs: any = this.$refs.ruleForm
    refs.validate((valid:any) => {
      if (valid) {
        this.queryList(1, 10, false)
        return true
      } else {
        return false
      }
    })
  }
  resetForm() {
    const ruleForm: any = this.$refs.ruleForm
    ruleForm.resetFields()
    this.checkedStatus = []
    this.checkAll = false
  }
  async queryList(page_no, limit, downloadFlg) {
    this.loading = true
    this.resetSelection()
    const { id, ref_id, crypto_currency_code, fiat_currency_code } = this.ruleForm
    let formNameData = Object.assign(
      { id, ref_id, crypto_currency_code, fiat_currency_code },
      {
        page_no: page_no - 1,
        limit,
        status: this.formateStatusCode()
      }
    )
    if (this.ruleForm.date && this.ruleForm.date.length) {
      formNameData['date'] = [this.ruleForm.date[0] / 1000, this.ruleForm.date[1] / 1000]
    }
    if (this.ruleForm.fiat_amount_begin && this.ruleForm.fiat_amount_end) {
      formNameData['amount'] = [Number(this.ruleForm.fiat_amount_begin) * 100000000, Number(this.ruleForm.fiat_amount_end) * 100000000]
    }
    if (this.ruleForm.tel_header && this.ruleForm.tel) {
      formNameData['mobile'] = [this.ruleForm.tel_header, this.ruleForm.tel]
    }
    if (downloadFlg) {
      formNameData['is_download'] = true
      delete formNameData['page_no']
      delete formNameData['limit']
    }
    for (const key in formNameData) {
      if (!formNameData[key] && formNameData[key] !== 0) {
        delete formNameData[key]
      }
    }
    const resData = await queryOrderList(formNameData)
    if (!downloadFlg) {
      if (resData.ret === 'ok') {
        this.list = {
          data: resData.data.orders,
          page: page_no,
          per_page: limit,
          total: resData.data.total
        }
        this.page_no = page_no
        this.limit = limit
      } else {
        this.messageAlert(resData.ret || '保存失败', 'error')
      }
    } else {
      if (resData && resData.ret) {
        this.messageAlert(resData.ret || '保存失败', 'error')
        return
      }
      let url = window.URL.createObjectURL(new Blob([resData]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      const time = moment().format('YYYYMMDDHHmmss')
      link.setAttribute('download', `${time}.csv`)
      document.body.appendChild(link)
      link.click()
    }
    this.loading = false
  }
  formateStatusCode() {
    const temp = this.statusCodeList.filter(item => {
      return this.checkedStatus.indexOf(item.label) > -1
    })
    const tempCodeList = temp.map(code => code.code)
    return tempCodeList
  }
  multipleSelection(val) {
    this.totalNumber = val.length
    if (this.totalNumber) {
      this.releaseFlg = true
    } else {
      this.releaseFlg = false
    }
    this.totalAmount = 0
    this.releaseList = val.map(item => {
      this.totalAmount = this.totalAmount + Number(item.fiat_amount)
      if (item.status !== 4) {
        this.releaseFlg = false
      }
      return item.id
    })
  }
  resetSelection() {
    this.totalAmount = 0
    this.totalNumber = 0
    const tableComp: any = this.$refs.TableCom
    tableComp.handleResetSelection()
  }
  betchRelease() {
    this.dialogVisible = true
  }
  submitPass() {
    this.dialogVisible = false
    this.messageAlert('放币成功', 'success', false, () => {
      this.queryList(1, 10, false)
      this.page_no = 1
      this.limit = 10
    })
  }
  downloadFile() {
    this.queryList(1, 10, true)
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
  bankCardDetail(index, rowItem) {
    this.$router.push({
      path: '/otcTransationManagement/otcTransationManagementDetail',
      query: rowItem
    })
  }
}
</script>
<style lang='scss' scoped>
  .content{
    background-color: #fff;
    padding: 40px 20px;
    margin: 30px;
  }
  .ta-c{
    text-align: center;
  }
  .btn-right{
    text-align: right;
  }
  .table-title{
    height: 40px;
    background-color: rgba(230, 247, 255, 1);
    border: 1px solid rgba(186, 231, 255, 1);
    border-radius: 4px;
    font-size: 14px;
    line-height: 40px;
    padding-left: 20px;
    margin-top: 20px;
    .icon-color {
      color: #0E77D1;
    }
    span {
      padding: 0 10px;
      font-weight: 800;
      color: #0E77D1;
    }
    .pointer {
      cursor: pointer;
    }
  }
  .group-inline{
    padding-left:20px;
    display: inline-block;
  }
</style>
