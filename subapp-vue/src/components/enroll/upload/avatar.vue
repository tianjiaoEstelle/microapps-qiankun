<!-- 头像上传 -->
<template>
  <img v-if="mod === 'detail'" :src="data" class="avatar" />
  <el-upload
    v-else
    class="avatar-uploader"
    ref="uploadRef"
    action="#"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="imgSaveToUrl"
  >
    <template #default>
      <el-icon v-if="!data" class="avatar-uploader-icon"><Plus /></el-icon>
      <div v-else>
        <img class="el-upload-list__item-thumbnail" :src="data" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete">
            <el-icon @click.stop="handleRemove"><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
  <!-- <el-upload
    v-else
    class="form-upload img-upload avatar-uploader"
    action="#"
    :auto-upload="false"
    :on-change="imgSaveToUrl"
    :show-file-list="false"
  >
    <el-icon><Plus /></el-icon>
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
    </template>
  </el-upload> -->
  <!-- <el-upload
    v-else
    class="form-upload img-upload avatar-uploader"
    action="#"
    :auto-upload="false"
    :on-change="imgSaveToUrl"
  >
    <img v-if="data" :src="data" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload> -->
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
    default: {},
  })
}
@Options({
  name: 'Avatar',
})
export default class Avatar extends Vue.with(Props) {
  disabled = false
  //头像上传本地，预览
  async imgSaveToUrl(uploadFile: any, uploadFiles: any) {
    try {
      // console.log(uploadFile, uploadFiles)
      let fileFormData = new FormData()
      fileFormData.append('file', uploadFile.raw)
      const res: any = await api.resumeUpload(fileFormData)
      // console.log(res)
      this.$emit('setData', res.data)
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
  handleRemove() {
    this.$emit('setData', '')
  }
}
</script>
<style lang="less" scoped>
.form-upload {
  height: 200px;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  display: flex;
  ::v-deep(.el-upload) {
    flex: 1;
  }
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.el-upload-list__item-thumbnail {
  width: 120px;
  height: 120px;
}
.el-upload-list__item-actions {
  position: absolute;
  width: 120px;
  height: 120px;
  left: 0;
  top: 0;
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
