<!-- 附件简历列表 -->
<template>
  <div style="text-align: left" v-if="mod === 'detail'">
    <a
      class="file-item"
      v-for="(item, idx) in fileList"
      :key="idx"
      :href="item.url"
      title="点击下载附件"
    >
      {{ item.name }}
    </a>
  </div>
  <el-upload
    v-else
    ref="uploadRef"
    v-model:file-list="fileList"
    :auto-upload="false"
    multiple
    :on-change="handleFileChange"
    :on-remove="handleRemove"
  >
    <el-button class="long-btn" plain type="primary">点击上传附件</el-button>
    <!-- <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500KB.
      </div>
    </template> -->
  </el-upload>
</template>
<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component'
import { ElMessage } from 'element-plus'
import { api } from '@/utils/api'
class Props {
  mod = prop<any>({
    required: true,
  })
  data = prop<any>({
    required: true,
    default: [],
  })
  fKey = prop<any>({
    required: true,
    default: '',
  })
}
@Options({
  name: 'Files',
})
export default class Files extends Vue.with(Props) {
  get fileList() {
    const list: any = []
    if (Array.isArray(this.data)) {
      this.data.forEach((item: any) => {
        const url = item[this.fKey]
        const name = item.name || ''
        if (url !== '') {
          list.push({
            name,
            url,
          })
        }
      })
    } else {
      for (const key in this.data) {
        const url = this.data[key]
        if (this.fKey === key && url !== '') {
          list.push({
            name: '',
            url,
          })
        }
      }
    }
    console.log(list)
    return list
  }
  //头像上传本地，预览
  async handleFileChange(uploadFile: any, uploadFiles: any) {
    try {
      // console.log(uploadFile, uploadFiles)
      let fileFormData = new FormData()
      fileFormData.append('file', uploadFile.raw)
      const res: any = await api.resumeUpload(fileFormData)
      // console.log(res)
      this.$emit('setFilesData', uploadFile.name, res.data)
    } catch (e: any) {
      ElMessage({
        showClose: true,
        message: e,
        type: 'error',
        duration: 3 * 1000,
      })

      const $refs: any = this.$refs
      $refs.uploadRef.clearFiles()
    }
  }
  handleRemove(file: any) {
    this.$emit('delFilesData', file.name)
  }
}
</script>
<style lang="less" scoped>
.long-btn {
  width: 930px;
  margin: 10px 0;
}

::v-deep(.el-upload-list__item-name) {
  font-size: 18px;
}

.file-item {
  display: block;
  padding: 8px 0;
  margin-left: 30px;
  color: #409eff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
