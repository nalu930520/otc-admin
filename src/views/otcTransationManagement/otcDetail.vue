vue/* eslint-disable */
<template>
  <div class="app-container">
    <div class="content">
      <el-row>
        <el-col :span="1">
          <div class="img-left" >
            <img :src="infoImg" alt="">
          </div>
        </el-col>
        <el-col :span="22">
          <el-row :gutter="20">
            <el-col :span="20">
              <h3 class="order-title">订单号：{{detail.id}}</h3>
            </el-col>
            <el-col :span="4">
              <div class="btn-right">
                <el-button @click="release" type="primary" :disabled="curStep != 3">放币</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row align="bottom">
            <el-col :span="7">
              <p>创建时间：{{detail.created_at | timeFormat}}</p>
            </el-col>
            <el-col :span="5">
              <p>交易货币：{{detail.fiat_currency_code.toUpperCase()}}</p>
            </el-col>
            <el-col :span="4">
              <p>购买货币：{{detail.crypto_currency_code.toUpperCase()}}</p>
            </el-col>
            <el-col :span="4">
              <p class="shallow_color ta-right">状态</p>
            </el-col>
            <el-col :span="4">
              <p class="shallow_color ta-right">交易总金额</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <p v-if="curStep >3">付款时间：{{paymentTime | timeFormat}}</p>
              <p v-if="curStep === -1">取消时间：{{cancelTime | timeFormat}}</p>
              <p v-if="curStep === -2">超时时间：{{autoCancelTime | timeFormat}}</p>
              <p></p>
            </el-col>
            <el-col :span="5">
              <p>交易单价：{{price | priceFormat}}</p>
            </el-col>
            <el-col :span="4">
              <p>购买数量：{{detail.crypto_amount | numberFormat}}</p>
            </el-col>
            <el-col :span="4">
              <p class="large_font ta-right">{{status | statusFormat}}</p>
            </el-col>
            <el-col :span="4">
              <p class="large_font ta-right">￥{{detail.fiat_amount | formatUSDAmount}}</p>
            </el-col>
          </el-row>
          <el-row  v-if="curStep === 4">
            <el-col :span="7">
              <p>放币时间：{{releaseTime | timeFormat}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="detail-con">
        <p class="detail-title">
          订单交易进度
        </p>
        <template v-if="!statusCancel">
          <el-steps :active="curStep" align-center>
            <el-step title="创建订单"></el-step>
            <el-step :title="curStep < 3 ? '等待付款' : '已付款'"></el-step>
            <el-step :title="curStep < 4 ? '等待放币' : '已放币'"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          <el-row class="step-desc">
            <el-col :span="6">
              <template>  
                <p>{{detail.buyer_mobile}}</p>
                <p>{{createTime | timeFormat}}</p>
              </template>
            </el-col>
            <el-col :span="6">
              <template v-if="curStep > 2">
                <p>{{detail.buyer_mobile}}</p>
                <p>{{paymentTime | timeFormat}}</p>
              </template>
            </el-col>
            <el-col :span="6">
              <template v-if="curStep > 3">
                <p>商家：{{detail.seller_id}}</p>
                <p>{{releaseTime | timeFormat}}</p>
              </template>
            </el-col>
          </el-row>
        </template>
        <template v-if="statusCancel">
          <el-steps :active="3" align-center>
            <el-step title="创建订单"></el-step>
            <el-step :title="curStep === -1 ? '已取消': '已超时'"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          <el-row class="step-desc">
            <el-col :span="8">
              <template>  
                <p>{{detail.buyer_mobile}}</p>
                <p>{{createTime | timeFormat}}</p>
              </template>
            </el-col>
            <el-col :span="8">
              <template v-if="curStep === -1">  
                <p>{{detail.buyer_mobile}}</p>
                <p>{{cancelTime | timeFormat}}</p>
              </template>
              <template v-if="curStep === -2">  
                <p>{{detail.buyer_mobile}}</p>
                <p>{{autoCancelTime | timeFormat}}</p>
              </template>
            </el-col>
          </el-row>
        </template>
      </div>
    </div>
    <div class="content">
      <div class="detail-info-title">
        收款信息
      </div>
      <ul class="detail-info">
        <li>收款人：<span>{{payment_info.receive_name}}</span></li>
        <li>收款银行：<span>{{payment_info.receive_bank}}</span></li>
        <li>收款账号：<span>{{payment_info.receive_account}}</span></li>
        <li>附言：<span>{{ref_id}}</span></li>
      </ul>
    </div>
    <template v-if = "dialogVisible">
      <PasswordDialog
        :idList = "releaseId"
        @closeDialog = "closeDialog"
        @submitPass = "submitPass"
      />
    </template>   
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PasswordDialog from '@/views/otcTransationManagement/passwordDialog'
import detailInfo from '@/assets/info.png'
import * as moment from 'moment'
import Bg from 'bignumber.js'
import { orderDetail } from '@/api/otcTransment'

@Component({
  components: {
    PasswordDialog
  },
  filters: {
    numberFormat(num) {
      return new Bg(Number(num)).dividedBy(10 ** 8).toFormat()
    },
    priceFormat(num) {
      return new Bg(Number(num)).toFormat(2, 1)
    },
    timeFormat(time) {
      if (!time) return '-'
      return moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
    },
    statusFormat(status) {
      switch (Number(status)) {
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
  }
})
export default class otcTransationManagementDetail extends Vue {
  infoImg = detailInfo
  curStep: Number = -1
  dialogVisible: boolean = false
  detail: any ={
    fiat_currency_code: '',
    crypto_currency_code: ''
  }
  price: Number = 0
  loading: boolean = false
  releaseId: Array<any> = []
  statusCancel: boolean = false
  detailInfo: any = {}
  createTime: String = ''
  paymentTime: String = ''
  releaseTime: String = ''
  cancelTime: String = ''
  autoCancelTime: String = ''
  ref_id: String | Number = ''
  payment_info: any = {}
  status: Number = -1
  mounted() {
    this.detail = this.$route.query
    this.status = this.detail.status
    this.releaseId = [this.detail.id]
    this.price = Number(this.detail.fiat_amount / this.detail.crypto_amount)
    this.queryDetail()
  }
  setCurState(status) {
    this.statusCancel = false
    this.$set(this, 'statusCancel', false)
    switch (status) {
      case 1:
        return 2
      case 2:
        this.statusCancel = true
        this.$set(this, 'statusCancel', true)
        return -1
      case 3:
        this.statusCancel = true
        this.$set(this, 'statusCancel', true)
        return -2
      case 4:
        return 3
      case 5:
        return 4
      default: return 0
    }
  }
  async queryDetail() {
    this.loading = true
    const resData = await orderDetail(this.$route.query.id)
    if (resData.ret === 'ok') {
      const history = resData.data.order_ops
      this.$set(this, 'ref_id', resData.data.order.ref_id)
      this.$set(this, 'payment_info', JSON.parse(resData.data.advertisement_history.payment_info))
      this.curStep = this.setCurState(resData.data.order.status)
      this.$set(this, 'status', resData.data.order.status)
      history.forEach(item => {
        switch (item.code) {
          case 1:
            this.$set(this, 'createTime', item.time)
            break
          case 4:
            this.$set(this, 'paymentTime', item.time)
            break
          case 101:
            this.$set(this, 'releaseTime', item.time)
            break
          case 3:
            this.$set(this, 'cancelTime', item.time)
            break
          case 401:
            this.$set(this, 'autoCancelTime', item.time)
            break
          default: break
        }
      })
    } else {
      this.$message({
        message: resData.ret,
        type: 'error',
        showClose: false
      })
    }
    this.loading = false
  }
  release() {
    this.dialogVisible = true
  }
  submitPass() {
    this.dialogVisible = false
    this.queryDetail()
    this.$message({
      message: '放币成功',
      type: 'success',
      showClose: false
    })
  }
  closeDialog() {
    this.dialogVisible = false
  }
}
</script>
<style lang='scss' scoped>
  .content{
    background-color: #fff;
    padding: 20px;
    margin-top: 18px;
  }
  .btn-right {
    text-align: right;
  }
  .img-left {
    margin-top:5px;
    img {
      width: 30px;
      height: 30px;
    }
  }
  .order-title {
    padding: 0;
    margin: 10px;
    margin-left:0;
    font-size: 18px;
  }
  .shallow_color {
    color:  #666;
  }
  .large_font {
    font-size: 24px;
    margin-top: 8px;
  }
  .ta-right {
    text-align: right;
  }
  .detail-con {
    background-color: #fff;
  }
  .detail-title {
    padding: 18px 20px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    margin-bottom: 20px;
    font-weight: 800;
    font-size: 18px;
  }
  .step-desc {
    p {
      width: 100%;
      text-align: center;
      color: #666;
    }
  }
  .detail-info-title{
    padding-left: 20px;
    margin: 10px 0;
    font-weight: 800;
    font-size: 18px;
  }
  .detail-info{
    list-style: none;
    padding: 0;
    padding-left: 18px;
    margin: 0;
    li {
      padding: 10px 0;
      span {
        color: #444;
      }
    }
  }
</style>
