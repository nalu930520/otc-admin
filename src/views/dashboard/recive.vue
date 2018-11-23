<template lang="html">
  <div class="recive-container">
    <div class="content">
      <el-tabs v-model="currency" @tab-click="handleClick">
        <el-tab-pane label="USDT" name="usdt">
          <h2>USDT地址</h2>
          <el-alert
            title="注意：进可发送USDT到该地址，发送到该地址的其他数字资产将会永久丢失。"
            type="info"
            show-icon
            :closable="false"
            >
          </el-alert>
          <div class="qrcode">
            <VueQrcode class="qrcode" :value="address" :options="{ size: 200 }"></VueQrcode>
          </div>
          <el-input v-model="address" placeholder="Please input" style='width:400px;'></el-input>
          <el-button type="primary" icon="document" @click='handleCopy(address,$event)'>copy</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as VueQrcode from '@xkeshi/vue-qrcode'
import clip from '@/utils/clipboard'
import { fetchUserWallet } from '@/api/wallet'
import filter from 'lodash.filter'

@Component({
  components: {
    VueQrcode
  }
})
export default class Recive extends Vue {
  currency: string = 'usdt'
  address: string = ''
  handleClick(tab, event) {
    console.log(tab, event)
  }
  handleCopy(text, event) {
    clip(text, event)
  }
  created() {
    fetchUserWallet().then(response => {
      if (response.ret === 'ok') {
        console.log("wallet:",response)
        const obj = filter(response.data.wallets, {currency_code: this.currency})
        this.address = obj[0].latest_addr
      } else {
        this.$message({
          message: response.ret,
          type: 'error'
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .recive{
    &-container{
      margin: 30px;
    }
  }
  .el-alert{
    &.el-alert--info{
      border: 1px solid #409EFF;
      background-color: rgb(230,247,254);
      color: #666;
    }
  }
  .el-alert__icon{
    color: #409EFF;
  }
  .content{
    background-color: #fff;
    padding: 40px 20px;
    margin-top: 18px;
    .qrcode{
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  }
</style>
