<template>
  <div>
    <el-upload
      list-type="picture"
      :limit="limit"
      :disabled="disabled || uploadBtnDisable"
      :action="actionLink"
      :headers="tokenHeader"
      :data="uploadData"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload">
      <!-- <div v-if="!showFileList">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div> -->
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator'
import { getToken } from '@/utils/auth'

@Component
export default class Upload extends Vue {
  @Prop() disabled: boolean
  @Prop() actionLink: string
  @Prop() uploadData: any
  @Prop() limit: number
  @Prop() lang: number
  @Prop() fileList: any[]
  tokenHeader: any = {}
  dialogImageUrl: string = ''
  dialogVisible: boolean = false
  uploadBtnDisable: boolean = false
  handleSuccess(res, file, fileList) {
    if (this.limit >= fileList.length) {
      this.uploadBtnDisable = true
    }
    this.$emit('listenToChildEvent', res, 1, this.lang, this.uploadData)
  }
  beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!(isJPG || isPNG)) {
      this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
    }
    if (!isLt10M) {
      this.$message.error('上传头像图片大小不能超过 10MB!')
    }
    return (isJPG || isPNG) && isLt10M
  }
  handleRemove(file, fileList) {
    this.uploadBtnDisable = false
    this.$emit('listenToChildEvent', fileList, 2, this.lang, this.uploadData)
  }
  handlePictureCardPreview(file) {
    console.log('handlePictureCardPreview')
    this.dialogVisible = true
    this.dialogImageUrl = file.url
  }
  created() {
    this.tokenHeader = { token: getToken() }
  }
}
</script>
