/* eslint-disable */
<template>
  <div  class="card-container-loading" v-loading="loading">
    <div class="card-contain">
      <el-row :gutter="20" class="card-item">
        <el-col :span="8">
          <div class="add-card" @click="addBankCard">
            <p>+ 新增银行卡</p>
          </div>
        </el-col>
        <el-col :span="8" v-for="(cardItem, index) in cardList"  :key="cardItem.id"  class="card-item">
          <el-card :class="[cardItem.editFlg ? 'edit-bg' : '', 'box-card', 'card-height']">
            <div class="text item" v-on:mouseenter="showSetDefault(index)" v-on:mouseleave="hideSetDefault">
              <div class="card-info" v-if="!cardItem.editFlg">
                <div class="bank-title">
                  <p>{{cardItem.bank_name}}</p>
                  <p class="set-default"  v-show="!cardItem.is_default && index == curIndex"><span @click="setDefaultBankCard(cardItem, index)">设为默认</span></p>
                </div>
                <p>收款人姓名：{{cardItem.card_owner}}</p>
                <p>收款人账号：{{cardItem.card_account}}</p>
              </div>
              <div class="edit-form" v-show="cardItem.editFlg">
                <el-form label-position="center" ref="cardForm" :rules="rulesEdit" label-width="100px" :model="cardItem" size="mini">
                  <el-form-item label="收款银行:" prop="bank_name_edit">
                    <el-input v-model="cardItem.bank_name_edit"></el-input>
                  </el-form-item>
                  <el-form-item label="收款人:" prop="card_owner_edit">
                    <el-input v-model="cardItem.card_owner_edit"></el-input>
                  </el-form-item>
                  <el-form-item label="收款账号:" prop="card_account_edit" required>
                    <el-input v-model="cardItem.card_account_edit"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="card-bottom">
                <p class="mid-btn font-red" v-show="!cardItem.editFlg"  @click="deleteCard(cardItem)">删除</p>
                <p class="mid-btn font-red" v-show="cardItem.editFlg" @click="cancelEdit(cardItem)">取消</p>
                <p class="mid-line">|</p>
                <p class="mid-btn font-blue" v-show="!cardItem.editFlg" @click="editCard(cardItem, index)">编辑</p>
                <p class="mid-btn font-blue" v-show="cardItem.editFlg" @click="submitEditCard(cardItem, index)">保存修改</p>
              </div>
              <template v-if="cardItem.is_default">  
                <div class="default-logo"></div>
                <p class="default-text">默认</p>
              </template>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page_no"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="totalPage">
        </el-pagination>
      </div>
      <el-dialog
      title="添加银行卡"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
      >
        <el-form label-position="center" ref="form" :rules="rules" label-width="100px" :model="form">
          <el-form-item label="收款银行:" prop="bank_name">
            <el-input v-model="form.bank_name"></el-input>
          </el-form-item>
          <el-form-item label="收款人:" prop="card_owner">
            <el-input v-model="form.card_owner"></el-input>
          </el-form-item>
          <el-form-item label="收款账号:" prop="card_account" required>
            <el-input v-model="form.card_account"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddCard">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { createBankCard, getCardList, deleteBankCard, updateBankCard } from '@/api/bankCard'

@Component({})
export default class bankCardManagement extends Vue {
  dialogVisible: boolean = false
  curIndex: Number = -1
  totalPage : Number = 0
  loading: boolean = false
  cardList: any[] = []
  page_no: any = 1
  currentPageCount: Number = 0

  form = {
    bank_name: '',
    card_owner: '',
    card_account: ''
  }
  validatePass = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入收款账号'))
    } else {
      if (isNaN(Number(value))) {
        callback(new Error('请输入正确的收款账号'))
      }
      callback()
    }
  }
  rules = {
    bank_name: [{
      required: true,
      message: '请输入收款银行',
      trigger: 'blur'
    }],
    card_owner: [{
      required: true,
      message: '请输入收款人',
      trigger: 'blur'
    }],
    card_account: [{
      validator: this.validatePass,
      trigger: 'blur'
    }]
  }
  rulesEdit = {
    bank_name_edit: [{
      required: true,
      message: '请输入收款银行',
      trigger: 'blur'
    }],
    card_owner_edit: [{
      required: true,
      message: '请输入收款人',
      trigger: 'blur'
    }],
    card_account_edit: [{
      validator: this.validatePass,
      trigger: 'blur'
    }]
  }
  mounted() {
    this.getCardList(1, 10)
  }
  handleCurrentChange(val) {
    this.page_no = val
    this.getCardList(val, 10)
  }
  async getCardList(page_no, limit) {
    this.loading = true
    const resData = await getCardList({ page_no, limit })
    if (resData.ret === 'ok') {
      this.cardList = resData.data.cards
      this.totalPage = resData.data.count
      this.currentPageCount = page_no - 10 > 0 ? resData.data.count % (10 * (page_no - 1)) : resData.data.count
    } else {
      this.messageAlert(resData.ret || '保存失败', 'error')
    }
    this.loading = false
  }
  showSetDefault(index) {
    this.curIndex = index
  }
  hideSetDefault() {
    this.curIndex = -1
  }
  addBankCard() {
    this.dialogVisible = true
    const formRef: any = this.$refs.form
    if (formRef) {
      formRef.resetFields()
    }
  }
  submitAddCard() {
    const refs: any = this.$refs.form
    refs.validate((valid:any) => {
      if (valid) {
        this.dialogVisible = false
        this.saveCardHandle()
        return true
      } else {
        return false
      }
    })
  }
  async saveCardHandle() {
    this.loading = true
    const { bank_name, card_owner, card_account } = this.form
    const resData = await createBankCard({ bank_name, card_owner, card_account })
    if (resData.ret === 'ok') {
      this.messageAlert('保存成功', 'success', false, () => {
        this.getCardList(this.page_no, 10)
      })
    } else {
      this.messageAlert(resData.ret || '保存失败', 'error')
    }
    this.loading = false
  }
  submitEditCard(cardItem, index) {
    const card: any = this.$refs.cardForm
    const temp: any = card[index]
    temp.validate((valid:any) => {
      if (valid) {
        this.dialogVisible = false
        this.updateBankCard(cardItem, false)
        return true
      } else {
        return false
      }
    })
  }
  async updateBankCard(cardItem, opFlg) {
    this.loading = true
    const bank_name = cardItem.bank_name_edit
    const card_owner = cardItem.card_owner_edit
    const card_account = cardItem.card_account_edit
    const op = opFlg ? 1 : 0
    const resData = await updateBankCard(cardItem.id, { op, bank_name, card_owner, card_account })
    if (resData.ret === 'ok') {
      this.messageAlert(resData.data.success_message, 'success', false, () => {
        this.$set(cardItem, 'editFlg', false)
        this.getCardList(this.page_no, 10)
      })
    } else {
      this.$set(cardItem, 'editFlg', false)
      this.messageAlert(resData.ret || '保存失败', 'error')
    }
    this.loading = false
  }
  editCard(cardItem, index) {
    this.$set(cardItem, 'editFlg', true)
    this.$set(cardItem, 'bank_name_edit', cardItem.bank_name)
    this.$set(cardItem, 'card_owner_edit', cardItem.card_owner)
    this.$set(cardItem, 'card_account_edit', cardItem.card_account)
  }
  cancelEdit(cardItem) {
    this.$set(cardItem, 'editFlg', false)
  }
  setDefaultBankCard(cardItem, index) {
    this.updateBankCard(cardItem, true)
  }
  deleteCard(curItem) {
    if (curItem.is_default) {
      this.messageAlert('默认银行卡不可删除', 'info', false)
      return
    }
    this.$confirm('您确定要删除这张银行卡吗？', '确认信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        deleteBankCard(curItem.id)
          .then(data => {
            if (data.ret === 'ok') {
              this.messageAlert('删除成功', 'success', false, () => {
                let queryPage = this.page_no
                if (this.currentPageCount === 1) {
                  queryPage = this.page_no - 1 > 0 ? this.page_no - 1 : 1
                }
                this.getCardList(queryPage, 10)
              })
            } else {
              this.messageAlert(data.ret, 'error', false)
            }
          })
      })
      .catch(action => {
        this.messageAlert('已取消删除', 'info', false)
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
<style lang='less' scoped>
.card-container-loading {
  min-height: 100%;
  .card-contain {
    padding: 10px;
    .add-card {
      height: 220px;
      width: 100%;
      border: 1px dashed #999;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, .4);
      cursor: pointer;
    }
    .card-item {
      margin-bottom:20px;
    }
    .card-height {
      height: 220px;
      position: relative;
      padding: 0;
      .card-info {
        p {
          color: rgba(0, 0, 0, .4);
          margin: 4px 0 15px 0;
          padding: 0;
          font-size: 14px;
        }
        .bank-title {
          display: flex;
          width: 100%;
          p {
            font-size: 18px;
            font-weight: 600;
            color:rgba(0, 0, 0, .8);
            margin: 20px 0;
            flex-flow: 1;
            width:100%;
          }
          .set-default {
            font-size: 16px;
            text-align: center;
            color: #3399FF;
            span {
              cursor: pointer;
            }
          }
        }
      }
    }
    .edit-bg {
      background-color: rgba(230, 247, 255, 1)
    }
    .card-bottom {
      position: absolute;
      bottom: 0;
      left: 0px;
      height: 48px;
      background-color: rgba(247, 249, 250, 1); 
      display: flex;
      width:100%;
      border-top: 1px solid rgba(233, 233, 233, 1);
      .mid-btn {
        width: 50%;
        text-align: center;
        cursor: pointer;
      }
      .mid-line {
        width: 2px;
        color: rgba(233, 233, 233, 1);
      }
      .font-red {
        color: rgba(255, 0, 0, 0.6);
      }
      .font-blue {
        color: #3399FF;
      }
    }
    .default-logo {
      width: 0;
      height: 0;
      border-width: 0px 44px 44px 0 ;
      border-style: solid;
      border-color: transparent #3399FF transparent transparent;
      top: 0px;
      right: 0px;
      position: absolute;
      font-size: 12px;
    }
    .default-text {
      top: 0px;
      right: 0px;
      position: absolute;
      font-size: 12px;
      padding: 0;
      margin: 4px;
      color: #fff;
      font-weight: 600;
    }
  }
  .block {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
