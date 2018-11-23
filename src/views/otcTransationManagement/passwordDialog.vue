/* eslint-disable */
<template>
  <div>
    <el-dialog
    title="请输入密码"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="40%"
    >
      <el-form label-position="center" ref="passForm" :rules="passRules" label-width="100px" :model="passForm" @submit.native.prevent>
        <el-form-item label="交易密码:" prop="password">
          <el-input v-model="passForm.password" placeholder="交易密码" type="password"></el-input>
          <span v-if="errorFlg" class="error-msg">{{chance}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { queryOrderRelease } from '@/api/otcTransment'

@Component({})
export default class passwordDialog extends Vue {
  name: 'passwordDialog'
  @Prop() idList: any[]
  passForm = {
    password: ''
  }
  dialogVisible: boolean = true
  passRules = {
    password: [{
      required: true,
      message: '请输入交易密码',
      trigger: 'blur'
    }]
  }
  chance: String | Number = ''
  errorFlg: boolean = false
  handleClose() {
    const refs: any = this.$refs.passForm
    refs.resetFields()
    this.$emit('closeDialog')
    this.dialogVisible = false
  }
  submitPassword() {
    const refs: any = this.$refs.passForm
    refs.validate((valid:any) => {
      if (valid) {
        this.submitPass(this.passForm)
        refs.resetFields()
        return true
      } else {
        return false
      }
    })
  }
  async submitPass(val) {
    const { password } = val
    const params = {
      id_arr: this.idList,
      password
    }
    const resData = await queryOrderRelease(params)
    if (resData.ret === 'ok') {
      this.$emit('submitPass', this.passForm)
    } else {
      this.chance = resData.ret
      this.errorFlg = true
    }
  }
}
</script>
<style lang='scss' scoped>
  .error-msg {
    color: #f56c6c;
    font-size: 12px;
  }
</style>
