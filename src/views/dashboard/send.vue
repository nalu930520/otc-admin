<template>
  <div class="send-container">
    <div class="content">
      <!-- <el-steps :active="step" align-center>
        <el-step title="输入信息"></el-step>
        <el-step title="验证密码"></el-step>
        <el-step title="成功"></el-step>
      </el-steps> -->
      <el-row v-if="step === 0">
        <el-col :xs="24" :sm="18">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="货币:">
              <el-select style="width:100%" v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="金额" prop="amount">
              <el-input v-model.number="form.amount"></el-input>
              <span>可用余额：{{!!getAsset('usdt') ? getAsset('usdt')[0].available_volume : '' | formatUSDAmount}} USDT</span>
            </el-form-item>
            <el-form-item label="网络费">
              <span>{{form.onchain_fee | formatUSDAmountFee}} USDT</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="openPasswordDailog">下一步</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- <el-row v-if="step === 1">
        <el-col :xs="24" :sm="18">
          <el-form ref="form" :model="formPassword" label-width="80px">
            <el-form-item label="交易密码:">
              <el-input v-model="formPassword.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="next">下一步</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row> -->
      <div class="result-content" v-if="step === 1">
        <div class="" v-if="sendResult">
          <i class="el-icon-circle-check"></i>
          <h2>发送成功</h2>
          <p>您已成功发送{{this.form.amount}}USDT至{{this.form.address}}，大约10分钟后，您可查看到该交易在区块链的确认记录。</p>
          <div>
            <router-link class="el-button el-button--primary" to="/dashboard/index" tag="div">返回账户概览</router-link>
            <router-link class="el-button" to="/wallet/usdt" tag="div">查看交易详情</router-link>
          </div>
        </div>
        <div class="" v-else>
          <i class="el-icon-circle-close"></i>
          <h2>发送失败</h2>
          <p>报错了，报错代码{}。如有问题，您可联系客服。</p>
          <div>
            <el-button type="primary" @click="toFirstSetp">重新发送</el-button>
          </div>
        </div>
      </div>
      <el-dialog
        title="请输入密码"
        :visible.sync="dialogVisible"
        width="500px"
        :before-close="handleClose">
        <el-form ref="formPassword" :model="formPassword" :rules="rulesPassword" label-width="100px">
          <el-form-item label="交易密码:" prop="password">
            <el-input type="password" v-model="formPassword.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog()">取 消</el-button>
          <el-button type="primary" @click="onSubmit()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { sendTransaction, fetchFee, fetchUserAssets } from '@/api/wallet'
import Filter from 'lodash.filter'

@Component
export default class send extends Vue {
  form: any = {
    type: 'usdt',
    address: '',
    amount: '',
    onchain_fee: '',
  }
  formPassword: any = {
    password: ''
  }
  rules: Object = {
    address: [
      { required: true, message: '请输入发送地址', trigger: 'blur' },
    ],
    amount: [
      { required: true, message: '请输入数量', trigger: 'blur' },
      { type: 'number', message: '数量必须为数字值'}
    ]
  }
  rulesPassword: Object = {
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
    ]
  }
  dialogVisible: boolean = false
  sendResult: boolean = false
  step: number = 0
  options: any[] = [{
    value: 'usdt',
    label: 'USDT'
  }]
  assets: any = []
  created() {
    fetchFee({currency_code: 'usdt'}).then(response => {
      console.log("fee:", response)
      if(response.ret === 'ok'){
        this.form.onchain_fee = response.data.low
      }
    })
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
  getAsset(currency){
    if (this.assets.length > 0) {
      return Filter(this.assets, {currency_code: currency})
    } else {
      return ''
    }
  }
  openPasswordDailog(){
    const refs: any = this.$refs.form
    refs.validate((valid:any) => {
      if (valid) {
        this.dialogVisible = true
      }else {
        return
      }
    })
  }
  cancelDialog() {
    this.dialogVisible = false
    const refs: any = this.$refs.formPassword
    refs.resetFields()
  }
  onSubmit() {
    const amount = this.form.amount
    const refs: any = this.$refs.formPassword
    refs.validate((valid:any) => {
      if (valid) {
        sendTransaction({
          currency_code: 'usdt',
          type: this.form.amount.type,
          address: this.form.address,
          amount: this.form.amount*100000000,
          onchain_fee: this.form.onchain_fee,
          password: this.formPassword.password
        }).then(response => {
          this.step = 1
          if(response.ret === 'ok'){
            this.sendResult = true
          } else {
            this.sendResult = false
          }
        })
        this.dialogVisible = false
      }else {
        return
      }
    })
  }
  handleClose(done) {
    this.$confirm('确认关闭？')
      .then(_ => {
        done()
      })
      .catch(_ => {})
  }
  toFirstSetp() {
    this.step = 0
  }
  next() {
    if (this.step++ > 1) this.step = 0
  }
}
</script>
<style lang="scss" scoped>
  .send{
    &-container{
      margin: 30px;
    }
  }
  .el-icon-circle-check{
    color: #67C23A;
  }
  .el-icon-circle-close{
    color:#F56C6C;
  }
  .el-icon-circle-check, .el-icon-circle-close{
    font-size: 100px;
  }
  .content{
    background-color: #fff;
    padding: 40px 20px;
    margin-top: 18px;
  }
  .result-content{
    text-align: center;
    padding: 3rem;

  }
</style>
