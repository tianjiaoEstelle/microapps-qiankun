<!-- 报名表 -->
<template>
  <el-container>
    <el-header
      ><div class="top-title">
        <el-icon class="back-arr" title="返回" @click="goBack"
          ><ArrowLeftBold /></el-icon
        >{{ userStore.templateName }} 审核表/报名表
      </div>
    </el-header>
    <el-container class="preview-container">
      <!-- 内容 -->
      <el-main>
        <el-form ref="formRef" :model="form" label-width="120px">
          <el-form-item label="模板名称：">
            <el-input v-model="form.templateName" class="w-400" />
          </el-form-item>
          <!-- file 文件 -->
          <el-form-item label="上传模板：">
            <el-upload
              ref="uploadRef"
              limit="1"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :auto-upload="false"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              class="form-upload"
            >
              <el-button type="primary" v-show="form.file.length === 0"
                >点击上传</el-button
              >
              <!-- <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽到此处 或者 <em>点击上传</em>
              </div> -->
              <template #tip>
                <div class="el-upload__tip" v-show="form.file.length === 0">
                  仅可上传一份
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <!-- 富文本 -->
          <!-- <div class="editer-btns">
            <el-button plain type="primary" @click="clickInsertBtn"
              >插入字段</el-button
            >
            <el-button plain type="primary" @click="insertVal('ksmc')"
              >考试名称</el-button
            >
            <el-button plain type="primary" @click="insertVal('zwdm')"
              >职位代码</el-button
            >
          </div>
          <TinyEditor @tinymceIns="tinymceIns" /> -->

          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
  <!-- <el-dialog top="5vh" v-model="dialogFormVisible" title="选取插入字段">
    <div class="dia-body">
      <el-table
        class="conf-table"
        :data="allTableData"
        style="width: 100%"
        max-height="400"
        row-key="id"
        ref="fieldsTable"
        border
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name_en" label="英文名称" />
        <el-table-column prop="name_cn" label="中文名称" />
        <el-table-column prop="type_cn" label="控件类型" />
        <el-table-column prop="modalNameCn" label="所属模块" />
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSave">插入字段</el-button>
      </span>
    </template>
  </el-dialog> -->
</template>

<script lang="ts">
import { ref } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { useUserstore } from '@/store/user'
import { genFileId } from 'element-plus'
import type { UploadRawFile } from 'element-plus'

@Options({
  name: 'EnrollForm',
})
export default class EnrollForm extends Vue {
  userStore = useUserstore()
  dialogFormVisible = false
  allTableData = [
    {
      id: '101',
      name_en: 'xingming',
      name_cn: '姓名',
      type: 'text',
      type_cn: '文本框',
      category: '1',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '102',
      name_en: 'csrq',
      name_cn: '出生日期',
      type: 'date',
      type_cn: '日期框',
      category: '1',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '103',
      name_en: 'mz',
      name_cn: '民族',
      type: 'select',
      type_cn: '下拉框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    },
    {
      id: '104',
      name_en: 'jzd',
      name_cn: '居住地',
      type: 'cascader',
      type_cn: '省市级联框',
      category: '2',
      modalNameCn: '基本资料',
      modalName: 'jbzl'
    }
  ]
  selectedTableData = []
  form = {
    templateName: this.userStore.templateName,
    file: []
  }

  tinymce: any = ref({})
  tinymceIns(val: any) {
    this.tinymce = val
  }

  //文件
  handleFileChange(uploadFile: any, uploadFiles: any) {
    // console.log(uploadFile, uploadFiles)
    this.form['file'] = uploadFiles
  }
  handleExceed(files: any) {
    const $refs: any = this.$refs
    $refs.uploadRef.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    $refs.uploadRef.handleStart(file)
  }
  insertVal(val: string) {
    this.tinymce.activeEditor.execCommand(
      'mceInsertContent',
      false,
      '{' + val + '}'
    )
  }

  goBack() {
    this.$router.go(-1)
  }

  clickInsertBtn() {
    this.dialogFormVisible = true
    this.$nextTick(function () {
      const fieldsTable = this.$refs.fieldsTable as any
      fieldsTable.clearSelection()
    })
  }
  async onSubmit() {
    // const content = this.tinymce.activeEditor.getContent()
    // console.log(content)
    const $refs: any = this.$refs
    await $refs.formRef.validate((valid: any) => {
      if (valid) {
        console.log(valid, this.form)
      } else {
        console.log(this.form)
      }
    })
  }
  onSave() {
    const selectedTableData = (this.$refs.fieldsTable as any).getSelectionRows()
    selectedTableData.forEach((item: any) => {
      this.tinymce.activeEditor.execCommand(
        'mceInsertContent',
        false,
        '{' + item.name_en + '}'
      )
    })
    this.dialogFormVisible = false
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
  width: 400px;
  left: -8px;
}
.preview-container {
  // height: 100%;
  overflow-y: auto;
}
.tinymce-box {
  margin: 20px;
}
.editer-btns {
  margin: 0 20px;
  text-align: left;
}
.form-upload {
  text-align: left;
}
.w-400 {
  width: 400px;
}
</style>
