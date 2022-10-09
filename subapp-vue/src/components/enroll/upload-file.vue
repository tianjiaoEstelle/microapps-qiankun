<!-- file 文件上传 -->
<template>
  <el-form class="dialog-form">
    <el-form-item label="模板名称：" prop="templateName">
      {{ userStore.templateName }}
    </el-form-item>
    <el-form-item label="上传报名表：">
      <el-upload
        ref="uploadRef"
        limit="1"
        action=""
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-exceed="handleExceed"
        class="form-upload"
      >
        <el-button type="primary" v-show="file.length === 0"
          >点击上传</el-button
        >

        <template #tip>
          <div class="el-upload__tip" v-show="file.length === 0">
            仅可上传一份
          </div>
        </template>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { toRaw } from 'vue'
import { Options, Vue } from 'vue-class-component'

import { genFileId, ElMessage } from 'element-plus'
import type { UploadRawFile } from 'element-plus'
import { useUserstore, userType } from '@/store/user'

import { api } from '@/utils/api'

@Options({
  name: 'UploadFile',
})
export default class UploadFile extends Vue {
  file: any = []
  userStore = useUserstore()
  get templateId() {
    return this.userStore.templateId || ''
  }
  //文件
  handleFileChange(uploadFile: any, uploadFiles: any) {
    // console.log(uploadFile, uploadFiles)
    this.file = uploadFiles
    if (uploadFiles.length > 0) {
      this.uplloadFileToServer(toRaw(uploadFiles[0]))
    }
  }
  async uplloadFileToServer(file: { raw: string | Blob }) {
    try {
      let fileFormData = new FormData()
      fileFormData.append('file', file.raw)
      fileFormData.append('templateId', this.templateId)

      const res: any = await api.uploadEntryForm(fileFormData)
      if (res.status === 200) {
        //成功提示
        ElMessage({
          showClose: true,
          message: '上传报名表成功',
          type: 'success',
          duration: 3 * 1000,
        })
        this.$emit('reloadList')
        // this.file = []
        const $refs: any = this.$refs
        $refs.uploadRef.clearFiles()
      }
    } catch (e: any) {
      ElMessage({
        showClose: true,
        message: e,
        type: 'error',
        duration: 3 * 1000,
      })
      this.file = []
      const $refs: any = this.$refs
      $refs.uploadRef.clearFiles()
    }
  }
  handleExceed(files: any) {
    const $refs: any = this.$refs
    $refs.uploadRef.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    $refs.uploadRef.handleStart(file)
  }
}
</script>

<style scoped lang="less">
::v-deep(.el-upload-list__item-file-name) {
  color: #409eff;
}
::v-deep(.el-upload-list) {
  position: absolute;
  top: -11px;
  width: 323px;
  left: -8px;
}
.form-upload {
  text-align: left;
}
</style>
