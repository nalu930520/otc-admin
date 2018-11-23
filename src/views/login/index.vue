<template>
  <div class="login-container">
    <div class="header">
      <div class="container">
        <ul class="navbar">
          <li class="logo">
            <img :src="imgLogo" alt=""></img>
          </li>
          <li>
            <router-link to="">
              首页
            </router-link>
          </li>
          <li>
            <router-link to="">
              联系我们
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="container">
      <el-form :model="form" status-icon  ref="form" class="demo-ruleForm">
        <el-alert
          v-if="showError"
          :title="errorMessage"
          type="error"
          show-icon>
        </el-alert>
        <el-form-item >
          <el-input type="text" v-model="form.username" auto-complete="off" placeholder="用户名" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="form.login_password" auto-complete="off" placeholder="登录密码" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input type="text" v-model="form.captcha_code" auto-complete="off" placeholder="验证码" prefix-icon="el-icon-search"></el-input>
            </el-col>
            <el-col :span="8">
              <div class="qrcode" :style="{backgroundImage: 'url('+captchaImg+')'}" @click="refreshCaptcha">
                <!-- <img :src="captchaImg" alt=""> -->
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-form autoComplete="on" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
        <h3 class="title"><svg-icon icon-class="logo" class="logo"/>Mobi 运营投放后台</h3>
        <el-form-item>
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            Sign in
          </el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <p class="copyright">Copyright © 2018 Mobi Me Limited</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { login, getCaptcha } from '@/api/login'
import img_logo from '@/assets/logo_colors.png'
import * as uuid from 'uuid/v4'
@Component
export default class Login extends Vue {
  request_id: string = ''
  requestUrl: string = ''
  captchaImg: string = ''
  showError: boolean = false
  errorMessage: string = ''
  form: any = {
    username: '',
    login_password: '',
    captcha_code: ''
  }
  imgLogo = img_logo
  created () {
    this.request_id = uuid()
    const env = process.env.NODE_ENV
    switch (env) {
      case 'dev':
      case 'staging':
        this.requestUrl = 'https://staging-b-api.mobiapp.cn/user/captcha?request_id='
        break
      case 'preProduction':
        this.requestUrl = 'https://api.mobiapp.cn/user/captcha?request_id='
        break
      case 'production':
        this.requestUrl = 'https://api.mobimecdn.com/business/user/captcha?request_id='
        break
      default:
        break
    }
    this.captchaImg = `${this.requestUrl}${this.request_id}`
  }
  refreshCaptcha() {
    this.request_id = uuid()
    this.captchaImg = `${this.requestUrl}${this.request_id}`
  }
  async handleLogin() {
    this.$store.dispatch('Login', { ...this.form, request_id: this.request_id })
      .then(res => {
        this.$router.push({
          path: '/dashboard/index'
        })
        this.$store.dispatch('GetCurrency')
      })
      .catch(res => {
        if (res === 'request_id 不存在') {
          this.refreshCaptcha()
        }
        this.errorMessage = res
        this.showError = true
        setTimeout(() => {
          this.showError = false
          this.errorMessage = ''
        }, 3000)
      })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    background-color: $bg;
    .el-form{
      margin: 0 auto;
    }
    @media (min-width: 992px){
      .container {
        width: 970px;
      }
      .el-form{
        width: 100%;
      }
    }
    @media (min-width: 768px){
      .container {
        width: 750px;
      }
      .el-form{
        width: 400px;
      }
    }
    @media (min-width: 1200px){
      .container {
        width: 1170px;
      }
      .el-form{
        width: 400px;
      }
    }
    .container {
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
      display: flex;
      height: 100%;
      .el-form{
        margin: auto;
        width: 100%;
        // margin-top: 20%;
        position: relative;
        top: -5rem;
        max-width: 300px;
        .el-alert{
          position: absolute;
          top: -3.5rem;
          margin-bottom: 1rem;
        }
      }
    }
    .header{
      background-color: #fff;
      height: 70px;
      // box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 4px 0px;
      .navbar{
        list-style: none;
        margin: 0;
        padding: 0;
        li{
          line-height: 70px;
          height: 70px;
          display: inline-block;
          &:not(:first-of-type){
            margin-left: 2rem;
          }
        }
        .logo{
          width: 88px;
          height: 70px;
          float: left;
          img{
            width: 100%;
            padding-top: 21px;
          }
        }
      }
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .qrcode{
      width: 100%;
      height: 40px;
      background-color: #fff;
      border-radius: 4px;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .copyright{
      color: #fff;
      position: absolute;
      bottom: 0;
      line-height: 30px;
      width: 100%;
      text-align: center;
    }
  }
</style>
