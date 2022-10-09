<!-- 照片作品类图片列表 -->
<template>
  <div style="text-align: left" v-if="mod === 'detail'">
    <div class="pictures-canvas" v-for="(pic, idx) in picList" :key="idx">
      <img
        class="el-upload-list__item-thumbnail pictures"
        :src="pic.url"
        alt=""
      />
      <!-- <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-delete"
          @click="handlePictureCardPreview"
        >
          <el-icon><zoom-in /></el-icon>
        </span>
      </span> -->
    </div>
  </div>
  <el-upload
    v-else
    class="form-upload img-upload pictures-uploader"
    action="#"
    ref="uploadRef"
    list-type="picture-card"
    :auto-upload="false"
    v-model:file-list="picList"
    :on-change="imgSaveToUrl"
    :on-remove="handleRemove"
    :on-preview="handlePictureCardPreview"
  >
    <el-icon><Plus /></el-icon>
    <!-- <el-button type="primary">点击上传图片</el-button>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template> -->
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img
      w-full
      style="max-width: 90%"
      :src="dialogImageUrl"
      alt="Preview Image"
    />
  </el-dialog>
</template>
<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component'
import { ElMessage } from 'element-plus'
// import type { UploadFile } from 'element-plus'
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
  name: 'Pictures',
})
export default class Pictures extends Vue.with(Props) {
  dialogVisible = false
  dialogImageUrl = ''
  get picList() {
    const list: any = []
    console.log(this.data)
    if (Array.isArray(this.data)) {
      this.data.forEach((item: any) => {
        const url = item[this.fKey]
        if (url !== '') {
          list.push({
            name: '',
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

    // console.log(list)
    return list
  }
  //头像上传本地，预览
  async imgSaveToUrl(uploadFile: any, uploadFiles: any) {
    try {
      // console.log(uploadFile, uploadFiles)
      let fileFormData = new FormData()
      fileFormData.append('file', uploadFile.raw)
      const res: any = await api.resumeUpload(fileFormData)
      // console.log(res)
      this.$emit('setPicturesData', res.data)
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
    this.$emit('delPicturesData', file.url)
  }
  handlePictureCardPreview(uploadFile: any) {
    this.dialogImageUrl = uploadFile.url
    this.dialogVisible = true
  }
}
</script>
<style lang="less" scoped>
.form-upload {
  height: inherit;
  margin-top: 10px;
}
.pictures {
  display: inline-block;
  padding: 10px 30px;
  max-width: 400px;
  max-height: 270px;
}
::v-deep(.el-upload-list__item) {
  width: 300px;
  height: 180px;
}
::v-deep(.el-upload--picture-card) {
  width: 180px;
  height: 180px;
}
.pictures-canvas {
  position: relative;
  width: 400px;
  height: 270px;
  display: inline-block;
}

.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 20px;
  top: 10px;
  cursor: default;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity var(--el-transition-duration);
  &:hover {
    opacity: 1;
    cursor: pointer;
    span {
      display: inline-flex;
    }
  }
  .el-upload-list__item-delete {
    position: static;
    font-size: inherit;
    color: inherit;
  }
}
</style>
