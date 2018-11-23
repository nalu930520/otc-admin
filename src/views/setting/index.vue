<template lang="html">
  <div class="setting-container">
    <div class="content">
      <div v-if="!changePassword">
        <h2>账户信息</h2>
        <p>
          用户名：{{userInfo.username}}
          <el-button type="primary" @click="dialogVisible = true">修改</el-button>
        </p>
        <h2>安全设置</h2>
        <p>
          密码设置：已设置
          <el-button type="primary" @click="changePassword = true">修改</el-button>
        </p>
      </div>
      <div class="password-content" v-else>
        <h2>修改登录密码</h2>
        <el-form ref="formPassword" :model="formPassword" :rules="rules" label-width="100px">
          <el-form-item label="原登录密码:" prop="origin">
            <el-input
              type="password"
              v-model="formPassword.origin"
              auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="新登录密码:" prop="newPassword">
            <Password v-on:listenToChildEvent="getPassword" auto-complete="off"></Password>
          </el-form-item>
          <el-form-item label="确认新密码:" prop="repeatPassword">
            <el-input type="password" v-model="formPassword.repeatPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpdatePsd('formPassword')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="修改用户名"
      :visible.sync="dialogVisible"
      width="500px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item
          label="用户名:"
          prop="name"
          :rules="[
            { min: 6, max: 20, message: '长度在6到20个字符之间', trigger: 'blur' }
          ]">
          <el-input v-model="form.name" placeholder="不能以mobi或btcc开头或结尾"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateUsername()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Password from '@/components/Password'
import { fetchUserProfile, setName, setPassword } from '@/api/setting'

interface formObj {
  origin: string;
  newPassword: string;
  repeatPassword: string;
}

@Component({
  components: {
    Password
  }
})
export default class Setting extends Vue {
  dialogVisible: boolean = false
  changePassword: boolean = false
  userInfo: any = {
    username: ''
  }
  form: any = {
    name: ''
  }
  formPassword: formObj = {
    origin: '',
    newPassword: '',
    repeatPassword: ''
  }
  validateRepeatPassword = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== this.formPassword.newPassword) {
      callback(new Error('两次输入密码不一致!'));
    } else {
      callback();
    }
  }
  rules: Object = {
    origin: [
      { required: true, message: '请输入原密码', trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, message: '最少6个字符', trigger: 'blur' }
    ],
    repeatPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      { validator: this.validateRepeatPassword, trigger: 'blur' }
    ],
  }
  created() {
    fetchUserProfile().then(res => {
      console.log("res:",res)
      this.userInfo.username = res.data.user_name
    })
  }
  getPassword(val) {
    this.formPassword.newPassword = val
  }
  submitUpdateUsername() {
    const refs: any = this.$refs.form
    refs.validate((valid:any) => {
      if (valid) {
        setName({'new_name': this.form.name}).then(res => {
          if(res.ret === 'ok'){
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.form = {
              name: ''
            }
            this.dialogVisible = false
          } else {
            this.$message({
              message: res.ret,
              type: 'error'
            })
          }
        });
      }else{
        return
      }
    })
  }
  submitUpdatePsd(formName) {
    const refs: any = this.$refs.formPassword
    refs.validate((valid:any) => {
      if (valid) {
        setPassword({'new_psd': this.formPassword.repeatPassword, 'old_psd': this.formPassword.origin}).then(res => {
          console.log("res:",res)
          if(res.ret === 'ok'){
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.formPassword = {
              origin: '',
              newPassword: '',
              repeatPassword: ''
            }
            setTimeout(()=>{
              this.changePassword = false
            }, 3000)
          } else {
            this.$message({
              message: res.ret,
              type: 'error'
            })
          }
        })
        return true
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss">
  .setting{
    &-container{
      margin: 30px;
    }
  }
  .el-button {
    margin-left: 1rem;
  }
  .content{
    background-color: #fff;
    padding: 20px;
    margin-top: 18px;
  }
  .password-content{
    width: 500px;
  }
</style>
