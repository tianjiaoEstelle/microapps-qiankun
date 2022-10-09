<!-- 简历模板列表 -->
<template>
  <el-container class="form-canvas">
    <el-header
      ><div class="top-title">
        <el-icon class="back-arr" title="返回" @click="goBack"
          ><ArrowLeftBold /></el-icon
        >简历模板列表
      </div>
    </el-header>
    <el-container>
      <!-- 内容 -->
      <el-main>
        <el-tabs type="border-card" v-model="activeTab">
          <el-input
            @keyup.enter="searchList"
            @clear="searchList"
            v-model="searchVal"
            clearable
            class="search-input"
            placeholder="关键字搜索"
          >
            <template #append>
              <el-button icon="Search" @click="searchList" /> </template
          ></el-input>
          <el-tab-pane label="可用模板" name="usable">
            <el-button
              type="primary"
              size="small"
              class="add-field-btn"
              @click="addRow"
              ><el-icon><CirclePlus /></el-icon>新建模板</el-button
            >
            <el-table
              ref="confTable"
              class="conf-table"
              :data="filterTableData"
              :max-height="maxHeight"
              row-key="id"
              :default-sort="{ prop: 'createdTime', order: 'descending' }"
              v-loading="tableLoad"
            >
              <el-table-column type="index" width="50" fixed="left" />
              <el-table-column
                fixed="left"
                prop="templateName"
                label="模板名称"
                sortable
                :width="widthFlag ? 'auto' : 220"
              />
              <!-- <el-table-column
                prop="status"
                label="状态"
                width="90"
                sortable
                align="center"
              >
                <template #default="scope">
                  <el-tooltip placement="left" effect="grey">
                    <template #content
                      ><div>
                        <div>使用本模板的考试</div>
                        <div>《111》《222》《333》</div>
                      </div>
                    </template>
                    <el-tag v-if="scope.row.status === '0'" type="info"
                      >未使用</el-tag
                    >
                    <el-tag v-else type="success">已使用</el-tag>
                  </el-tooltip>
                </template>
              </el-table-column> -->
              <!-- <el-table-column
                prop="isDefault"
                label="系统默认模板"
                width="150"
                sortable
                align="center"
              >
                <template #default="scope">
                  <el-tag v-if="scope.row.isDefault === 1" type="success"
                    >是</el-tag
                  >
                  <el-tag v-else type="info">否</el-tag>
                </template>
              </el-table-column> -->

              <el-table-column
                prop="createdTime"
                label="创建时间"
                width="120"
                sortable
                align="center"
              />
              <el-table-column
                prop="fileName"
                label="报名表"
                sortable
                align="center"
                :width="widthFlag ? 'auto' : 220"
              >
                <template #default="scope">
                  <div
                    class="export-span"
                    title="下载报名表"
                    @click="exportFile(scope.row.fileUrl, scope.row.fileName)"
                  >
                    {{ scope.row.fileName }}
                    <el-icon v-if="scope.row.fileName" class="down-icon"
                      ><Download
                    /></el-icon>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="700">
                <template #default="scope">
                  <el-button
                    type="primary"
                    icon="Search"
                    size="small"
                    @click="toPreview(scope)"
                    >预览</el-button
                  >
                  <el-button
                    type="primary"
                    icon="Edit"
                    size="small"
                    v-if="scope.row.isDefault === 0"
                    @click="configFileds(scope)"
                    >字段配置</el-button
                  >
                  <el-button
                    type="primary"
                    icon="Upload"
                    size="small"
                    @click="toEntryForm(scope.row)"
                    v-if="scope.row.isDefault === 0"
                    >上传报名表</el-button
                  >
                  <el-button
                    type="primary"
                    icon="Download"
                    size="small"
                    @click="
                      exportFields(scope.row.templateId, scope.row.templateName)
                    "
                    v-if="scope.row.isDefault === 0"
                    >导出报名表字段</el-button
                  >
                  <el-button
                    type="primary"
                    icon="DocumentCopy"
                    size="small"
                    @click="copyTemplate(scope.row.templateId)"
                    v-if="scope.row.isDefault === 0"
                    >复制模板</el-button
                  >
                  <el-button
                    type="primary"
                    icon="Edit"
                    circle
                    size="small"
                    title="编辑"
                    v-if="scope.row.isDefault === 0"
                    @click="editData(scope)"
                  />
                  <el-popconfirm
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    icon="InfoFilled"
                    icon-color="#626AEF"
                    title="确定要删除该模板?"
                    @confirm="delData(scope)"
                  >
                    <template #reference>
                      <el-button
                        type="danger"
                        icon="Delete"
                        circle
                        title="删除"
                        size="small"
                        v-if="scope.row.isDefault === 0"
                      />
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
  <!-- 新建模板弹窗 -->
  <el-dialog
    width="360px"
    :inline="true"
    v-model="dialogFormVisible"
    :title="dialogTitle"
  >
    <el-form
      ref="dialogFormRef"
      class="dialog-form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item label="模板名称：" prop="templateName">
        <el-input v-model="form.templateName" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="onSubmit(dialogFormRef)"
          >保存</el-button
        >
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 报名表弹窗 -->
  <el-dialog
    width="450px"
    :inline="true"
    v-model="entryFormVisible"
    title="上传报名表"
  >
    <upload-file @reloadList="reloadList"></upload-file>
  </el-dialog>
</template>

<script lang="ts">
import { ref, toRaw } from 'vue'
import { Options, Vue } from 'vue-class-component'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { api } from '@/utils/api'
import { useUserstore, userType } from '@/store/user'

import UploadFile from '@/components/enroll/upload-file.vue'
const initForm = {
  templateName: '',
  id: '',
}
@Options({
  name: 'EnrollList',
  components: {
    UploadFile,
  },
  watch: {
    companyId: function (val) {
      if (val !== '') {
        this.getTemplateList()
      }
    },
  },
})
export default class EnrollList extends Vue {
  dialogFormRef: any = ref()
  activeTab = 'usable'
  tableLoad = false
  total = 0
  searchVal = ''
  maxHeight = 'calc(100vh - 180px)'
  tableData: any = []
  filterTableData: any = []
  form = { ...initForm }
  formRules = {
    templateName: [
      {
        required: true,
        message: '模板名称不能为空',
      },
    ],
  }
  dialogFormVisible = false
  entryFormVisible = false
  saveLoading = false
  dialogTitle = ''
  widthFlag = false

  userStore = useUserstore()
  get companyId() {
    return this.userStore.companyId
  }
  configFileds(data: any) {
    this.userStore.updateUserData(data.row)
    this.$router.push({
      path: '/enroll/tempalte',
    })
  }
  addRow() {
    this.dialogTitle = '新建模板'
    this.form = { ...initForm }
    this.dialogFormVisible = true
    this.$nextTick(function () {
      this.dialogFormRef.clearValidate()
    })
  }
  toEntryForm(data: any) {
    this.userStore.updateUserData(data)
    this.entryFormVisible = true
  }
  toPreview(data: any) {
    this.userStore.updateUserData(data.row)
    // console.log('toEntryForm', data.row, this.userStore)
    this.$router.push({
      path: '/enroll/preview/preview',
    })
  }
  reloadList() {
    this.getTemplateList()
    this.entryFormVisible = false
  }
  //导出报名表
  exportFile(url: string, fileName: string) {
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  }

  async copyTemplate(templateId: string) {
    const params = {
      templateId: templateId + '',
      userId: this.userStore.userId,
      companyId: this.userStore.companyId,
    }
    const res = await api.copyResume(params)
    this.getTemplateList()
  }
  async exportFields(templateId: string, templateName: string) {
    const res = await api.exportFields({ templateId })
    this.download(templateName + '字段表.xls', res)
  }
  // 下载文件
  download(fileName: string, data: any) {
    // let bstr = window.atob(data)
    // let n = bstr.length
    // let u8arr = new Uint8Array(n)
    // while (n--) {
    //   //返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数
    //   u8arr[n] = bstr.charCodeAt(n)
    // }
    // 构造一个blob对象来处理数据 type 'application/vnd.ms-excel'
    // let blob = new Blob([u8arr], { type: 'application/vnd.ms-excel' })
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
    let url = URL.createObjectURL(blob)
    let link = document.createElement('a')
    // link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
  }
  editData(data: any) {
    // console.log('editData', data)
    const row = { ...data.row }
    this.dialogTitle = '修改模板'
    this.form.templateName = row.templateName
    this.form.id = row.templateId
    this.dialogFormVisible = true
    // this.$router.push({
    //   name: 'EnrollTemplate',
    //   params: {
    //     data: JSON.stringify(row)
    //   }
    // })
  }
  async delData(data: any) {
    let params = {
      id: data.row.templateId,
      companyId: this.userStore.companyId, //企业id
    }
    const res = await api.delResumeTemplateList(params)
    //成功提示
    ElMessage({
      showClose: true,
      message: '删除模板成功',
      type: 'success',
      duration: 3 * 1000,
    })
    this.getTemplateList()
  }
  searchList() {
    const searchVal = this.searchVal
    let newDatas = this.tableData.filter((item: any) => {
      let flag = false
      Object.keys(item).forEach(function (key: any) {
        const str = item[key] + ''
        if (str.indexOf(searchVal) !== -1) {
          flag = true
        }
      })
      return flag
    })

    this.filterTableData = newDatas
  }
  async getTemplateList() {
    this.tableLoad = true
    const formData = {
      current: 1,
      size: 999,
      companyId: this.userStore.companyId,
    }
    try {
      const res: any = await api.getResumeTemplateList(formData)
      const data: any = res?.data || []
      console.log(toRaw(data))
      this.tableData = data?.records || []
      this.total = data?.total || 0
      this.searchList()
      this.tableLoad = false
      this.$nextTick(function () {
        this.setFrameHeight()
        const tableRef: any = this.$refs.confTable
        const resizeWidth: number = tableRef.resizeState.width
        const bodyWidth: number = tableRef.bodyWidth.replace(/px/, '') * 1
        this.widthFlag = resizeWidth >= bodyWidth
      })
    } catch (error) {
      this.tableLoad = false
    }
  }
  setFrameHeight() {
    const formDom: any = document.getElementsByClassName('form-canvas')
    if (formDom.length > 0) {
      const formHeight = formDom[0].offsetHeight
      // console.log('setFrameHeight', formHeight)
      setTimeout(function () {
        window.parent.postMessage({ formHeight: formHeight }, '*')
      }, 200)
    }
  }
  async onSubmit(formEl: FormInstance | undefined) {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        try {
          this.saveLoading = true
          let formData: any = { ...this.form }
          formData.companyId = this.userStore.companyId
          formData.userId = this.userStore.userId
          const res: any = await api.updateResumeTemplateList(formData)
          this.saveLoading = false
          this.dialogFormVisible = false
          this.getTemplateList()
        } catch (error) {
          this.saveLoading = false
        }
      }
    })
  }
  goBack() {
    history.go(-1)
  }
  created() {
    const dataStr: any = this.$route?.params?.data || ''
    if (dataStr !== '') {
      const dataList = dataStr.split('-')
      const len = dataList.length
      const userId = len >= 1 && dataList[0]
      const companyId = (len >= 2 && dataList[1]) || ''
      const uid = (len >= 3 && dataList[2]) || ''
      const isDefault = (len >= 4 && dataList[3]) || ''
      this.userStore.updateUserData({
        userId,
        companyId,
        uid,
        isDefault,
      })
    }
    if (this.companyId !== '') {
      this.getTemplateList()
    }
  }
}
</script>
<style lang="less">
.el-popper.is-grey {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(175, 183, 185), rgb(229, 230, 228));
}

.el-popper.is-grey .el-popper__arrow::before {
  background: linear-gradient(45deg, rgb(229, 230, 228), rgb(229, 230, 228));
  right: 0;
}
</style>
<style scoped lang="less">
.conf-table {
  ::v-deep(.el-table__header) {
    thead th {
      background-color: #eeeeee;
    }
  }
  ::v-deep(.el-scrollbar__view) {
    display: block;
  }
  .export-span {
    color: #207ddc;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
    .down-icon {
      padding-left: 6px;
      position: relative;
      top: 4px;
      font-size: 16px;
    }
  }
}
.search-input {
  width: 260px;
  float: left;
  margin-bottom: 8px;
}
.back-arr {
  position: relative;
  top: 3px;
  padding-right: 5px;
  color: rgb(133, 133, 133);
  &:hover {
    cursor: pointer;
    color: #000;
  }
}
.add-field-btn {
  position: relative;
  right: 15px;
  bottom: -8px;
  float: right;
  .el-icon {
    padding-right: 7px;
    font-size: 14px;
  }
}
</style>
