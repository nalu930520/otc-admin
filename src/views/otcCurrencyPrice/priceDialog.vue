/* eslint-disable */
<template>
  <div>
    <el-dialog
    title="修改价格"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="40%"
    >
      <el-form
        label-position="center"
        ref="form"
        :rules="rules"
        label-width="100px"
        :model="form"
        @submit.native.prevent
      >
        <el-form-item label="基准价:">
          <span>{{data.base_price}} CNY/USDT</span>
        </el-form-item>
        <el-form-item label="价格类型:">
          <el-radio-group v-model="form.type">
            <el-radio label="固定价格" @change="changeType(1)"></el-radio>
            <el-radio label="浮动价格" @change="changeType(2)"></el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="type === 1">
          <el-form-item label="交易价格:" prop="current_price">
            <el-input v-model="form.current_price" placeholder="请输入"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="溢价率:" prop="premium_rate">
            <el-select v-model="form.premium_rate" placeholder="请选择">
              <el-option
                v-for="(item, index) in 61"
                :key="index"
                :label="item - 31 + '%'"
                :value="(item - 31) /100 + ''">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易价格:">
            <span>{{data.base_price * (1 + Number(form.premium_rate)) | filterAmount}}CNY/USDT</span>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { updateOtcSetting } from '@/api/otcTransment'

@Component({})
export default class priceDialog extends Vue {
  name: 'priceDialog'
  @Prop() data: any
  form = {
    type: '',
    current_price: '',
    premium_rate: ''
  }
  rules = {
    current_price: [{
      required: true,
      message: '请输入交易价格',
      trigger: 'blur'
    }, {
      validator: this.validateCurrent_price,
      trigger: 'blur'
    }],
    premium_rate: [{
      required: true,
      message: '请选择溢价率',
      trigger: 'blur'
    }]
  }
  dialogVisible: boolean = true
  type: any = ''
  created() {
    this.form = this.data
    this.form.type = this.data.price_type === 1 ? '固定价格' : '浮动价格'
    this.type = this.data.price_type
  }
  validateCurrent_price(rule, value, callback) {
    if (value < this.data.base_price * 0.7 || value > this.data.base_price * 1.3) {
      callback(new Error('价格有误'))
    }
    callback()
  }
  handleClose() {
    this.resetForm()
    this.$emit('closeDialog')
    this.dialogVisible = false
  }
  resetForm() {
    const refs: any = this.$refs.form
    refs.resetFields()
  }
  changeType(val) {
    this.resetForm()
    this.type = val
  }
  submit() {
    const refs: any = this.$refs.form
    refs.validate((valid:any) => {
      if (valid) {
        this.update(this.form)
        refs.resetFields()
        return true
      } else {
        return false
      }
    })
  }
  async update(val) {
    const params = {
      price_type: this.type,
      correspond_value: this.type === 1 ? val.current_price : val.premium_rate
    }
    const resData = await updateOtcSetting(params)
    if (resData.ret === 'ok') {
      this.$emit('submitPass', this.type)
    } else {
      this.$message({
        message: resData.ret,
        type: 'error'
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
