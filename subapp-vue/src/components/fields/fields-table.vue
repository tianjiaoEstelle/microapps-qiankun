<template>
  <div class="top-line">
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
    <el-button type="primary" size="small" class="add-field-btn" @click="addRow"
      ><el-icon><CirclePlus /></el-icon>添加字段</el-button
    >
  </div>
  <el-table
    class="conf-table"
    :data="filterTableData"
    row-key="id"
    style="width: 100%"
    :max-height="maxHeight"
    v-loading="tableLoad"
  >
    <el-table-column type="index" width="50" />
    <el-table-column prop="fieldsKey" label="英文名称" min-width="130" />
    <el-table-column prop="fieldsValue" label="中文名称" min-width="130" />
    <el-table-column prop="uiType" label="控件类型" align="center">
      <template #default="scope">
        <el-tag :title="scope.row.uiType">{{
          getTextByUIType(scope.row.uiType)
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      v-if="userStore.companyId !== ''"
      prop="isEdit"
      label="是否可编辑"
      min-width="110"
      align="center"
    >
      <template #default="scope">
        <el-tag type="success" v-if="scope.row.isEdit === 1">是</el-tag>
        <el-tag type="info" v-else>否</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="placeholder"
      label="字段默认说明"
      width="150"
      show-overflow-tooltip
    >
      <template #default="scope">
        <div class="inline-row">
          {{ scope.row.placeholder }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="tips" label="字段提示" width="150">
      <template #default="scope">
        <el-tooltip effect="dark" placement="top">
          <template #content>
            <div style="max-width: 200px">{{ scope.row.tips }}</div>
          </template>
          <div class="inline-row">
            {{ scope.row.tips }}
          </div>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="备注" width="150">
      <template #default="scope">
        <el-tooltip effect="dark" placement="left">
          <template #content>
            <div style="max-width: 200px">{{ scope.row.remark }}</div>
          </template>
          <div class="inline-row">
            {{ scope.row.remark }}
          </div>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100" align="center">
      <template #default="scope">
        <el-button
          v-if="scope.row.isDefault === 0 || userStore.companyId === ''"
          type="primary"
          icon="Edit"
          circle
          size="small"
          @click.stop="editData(scope)"
        />
        <el-popconfirm
          v-if="scope.row.isDefault === 0 || userStore.companyId === ''"
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="InfoFilled"
          icon-color="#626AEF"
          title="确定要删除该字段?"
          @confirm="delData(scope)"
        >
          <template #reference>
            <el-button
              v-if="scope.row.isDefault === 0 || userStore.companyId === ''"
              type="danger"
              icon="Delete"
              circle
              size="small"
            />
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <div class="total-dom">共{{ total }}条</div>
  <!-- </el-tab-pane>
  </el-tabs> -->

  <el-dialog
    width="360px"
    :inline="true"
    v-model="dialogFormVisible"
    :title="dialogTitle"
  >
    <el-form class="dialog-form" :model="form" :ref="fieldForm">
      <el-form-item
        label="英文名称："
        :label-width="formLabelWidth"
        prop="fieldsKey"
      >
        <el-input v-model="form.fieldsKey" placeholder="请输入字段英文名称" />
      </el-form-item>
      <el-form-item
        label="中文名称："
        :label-width="formLabelWidth"
        prop="fieldsValue"
      >
        <el-input v-model="form.fieldsValue" placeholder="请输入字段中文名称" />
      </el-form-item>
      <el-form-item
        label="字段类型："
        :label-width="formLabelWidth"
        prop="uiType"
      >
        <el-select v-model="form.uiType" placeholder="请选择控件类型">
          <el-option
            v-for="item in UITypeMap"
            :key="item.id"
            :label="`${item.itemLabel}(${item.itemKey})`"
            :value="item.itemKey"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="字典项："
        v-if="
          form.uiType === 'radio' ||
          form.uiType === 'select' ||
          form.uiType === 'checkbox'
        "
        :label-width="formLabelWidth"
      >
        <div class="dict-canvas">
          <el-tag
            class="dict-tag"
            v-for="(item, index) in dictList"
            :key="index"
            closable
            @close="removeTag(index)"
            >{{ item }}</el-tag
          >

          <el-input
            class="dict-input"
            v-model="dictInputVal"
            placeholder="请逐一添加"
            clearable
            @keyup.enter="dictInput"
          >
            <template #append>
              <el-button @click.stop="dictInput"
                ><el-icon><Plus /></el-icon
              ></el-button>
            </template>
          </el-input></div
      ></el-form-item>
      <el-form-item label="字段默认说明：" :label-width="formLabelWidth">
        <el-input v-model="form.placeholder" placeholder="请输入默认说明" />
      </el-form-item>
      <el-form-item label="字段提示：" :label-width="formLabelWidth">
        <el-input v-model="form.tips" placeholder="请输入字段提示" />
      </el-form-item>
      <el-form-item label="是否可编辑：" :label-width="formLabelWidth">
        <el-switch
          class="field-switch"
          v-model="form.isEdit"
          size="large"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="备注：" :label-width="formLabelWidth">
        <el-input v-model="form.remark" placeholder="请输入字段备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="onSave"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Options, Vue, prop } from 'vue-class-component'
import { api } from '@/utils/api'
import { ElMessage } from 'element-plus'
import { useUserstore, UITYpe } from '@/store/user'

import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'

const initForm = {
  dictValue: '', //字典项
  id: '', //字段id
  fieldsKey: '', //字段标识
  fieldsValue: '', //字段名称
  isEdit: true, //是否可编辑
  uiType: 'string',
  moduleKey: '',
  category: '1',
  placeholder: '',
  remark: '',
  tips: '',
}
class Props {
  activeId = prop<string>({
    required: true,
  })
}
@Options({
  name: 'FieldsTable',
  components: {
    // draggable,
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
  },
  watch: {
    companyId: function (val) {
      this.getEnrollModuleFieldsList()
    },
    activeId: function (val) {
      this.getEnrollModuleFieldsList()
    },
  },
})
export default class FieldsTable extends Vue.with(Props) {
  userStore = useUserstore()
  get companyId() {
    return this.userStore.companyId
  }
  // get flag() {
  //   return { companyId: this.companyId, activeId: this.activeId }
  // }
  dictList: any = []
  total = 0
  tableData = []
  filterTableData = []
  systemTableData = []
  dictInputVal: any = ''
  searchVal = ''
  saveLoading = false
  tableLoad = false
  dialogFormVisible = false
  dialogTitle = ''
  formLabelWidth = '110px'
  maxHeight = 'calc(100vh - 130px)'
  fieldForm = ref()
  form = { ...initForm }
  activeTab = 'system'

  get UITypeMap() {
    const map: Array<UITYpe> = this.userStore.UITypeMap || []
    return map
  }

  deleteRow(index: number) {
    this.tableData.splice(index, 1)
  }

  addRow() {
    this.form = { ...initForm }
    this.dialogTitle = '添加字段'
    this.dialogFormVisible = true
  }
  //转到报名表页面
  goToTemplate() {
    this.userStore.updateUserData({})
    this.$router.push({
      path: '/enroll/tempalte',
    })
  }
  editData(data: any) {
    let row = data?.row
    row.isEdit = row.isEdit === 1 ? true : false
    this.form = { ...row }
    this.dialogTitle = '编辑字段'
    this.dialogFormVisible = true
  }
  selectChange(val: any) {
    // console.log(val)
    this.form.uiType = val
  }
  getTextByUIType(val: string) {
    let label = ''
    this.UITypeMap.forEach((item: any) => {
      if (item.itemKey === val) label = item.itemLabel
    })
    return label
  }
  async delData(data: any) {
    let params = {
      id: data.row.id,
      companyId: this.userStore.companyId, //企业id
    }
    const res = await api.deleteEnrollModuleFieldsList(params)
    //成功提示
    ElMessage({
      showClose: true,
      message: '删除字段成功',
      type: 'success',
      duration: 3 * 1000,
    })
    this.getEnrollModuleFieldsList()
  }
  dictInput() {
    if (
      this.dictInputVal !== '' &&
      this.dictList.indexOf(this.dictInputVal) === -1
    ) {
      this.dictList.push(this.dictInputVal)
      this.dictInputVal = ''
    }
  }
  removeTag(index: number) {
    this.dictList.splice(index, 1)
  }

  async onSave() {
    try {
      let formData: any = { ...this.form }
      formData.moduleKey = this.activeId
      formData.isEdit = formData.isEdit ? 1 : 0

      formData.dictValue = this.dictList.join(',') //字典项转成,间隔
      formData.companyId = this.userStore.companyId
      formData.userId = this.userStore.userId
      // this.saveLoading = true;

      const res: any = await api.updateEnrollModuleFieldsList(formData)
      const data: any = res.data || []
      //成功提示
      ElMessage({
        showClose: true,
        message: formData.id === '' ? '添加字段成功' : '修改字段成功',
        type: 'success',
        duration: 3 * 1000,
      })
      this.saveLoading = false
      this.dialogFormVisible = false
      this.getEnrollModuleFieldsList()
    } catch (error: any) {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
        duration: 3 * 1000,
      })
      this.saveLoading = false
    }
  }

  // 行拖拽
  // rowDrop() {
  //   // 要侦听拖拽响应的DOM对象
  //   const tbody: any = document.querySelector('.el-table__body-wrapper tbody')
  //   const that = this
  //   Sortable.create(tbody, {
  //     // 结束拖拽后的回调函数
  //     onEnd({ newIndex, oldIndex }: any) {
  //       console.log('拖动序号：' + newIndex, oldIndex)
  //       const newRowData = that.tableData[newIndex]
  //       const oldRowData = that.tableData[oldIndex]
  //       console.log('拖动序号名字：' + newRowData.fieldsValue, oldRowData.fieldsValue)
  //       that.tableData[newIndex] = { ...oldRowData }
  //       that.tableData[oldIndex] = { ...newRowData }
  //       console.log(that.tableData)
  //     },
  //   })
  // }
  async getEnrollModuleFieldsList() {
    this.tableLoad = true
    // console.log('table companyId', this.userStore.companyId)
    const formData = {
      current: 1,
      // isDefault: 0,
      // isDefault: 1,//默认字段
      moduleKey: this.activeId,
      size: 9999,
      name: '',
      companyId: this.userStore.companyId, //企业id
    }
    try {
      const res: any = await api.getEnrollModuleFieldsList(formData)
      const data: any = res?.data || []
      this.tableData = data?.records || []
      this.total = data?.total || 0
      this.searchList()
      this.tableLoad = false
    } catch (error) {
      this.tableLoad = false
    }
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
  created() {
    if (this.activeId !== '') {
      this.getEnrollModuleFieldsList()
    }
  }
}
</script>

<style scoped lang="less">
.conf-table {
  overflow: initial;
  ::v-deep(.el-table__header) {
    thead th {
      background-color: #eeeeee;
    }
  }
}
.dialog-form {
  margin: -20px 0 -45px;
}
.field-switch {
  position: relative;
  top: -3px;
}
.add-field-btn {
  position: relative;
  right: 15px;
  bottom: -4px;
  float: right;
  .el-icon {
    padding-right: 7px;
    font-size: 14px;
  }
}
.config-btn {
  float: right;
  margin-right: 10px;
  position: relative;
  right: 15px;
  bottom: -4px;
  .el-icon {
    padding-right: 7px;
    font-size: 14px;
  }
}
.inline-row {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.top-line {
  height: 34px;
  .search-input {
    width: 260px;
    float: left;
    margin-bottom: 8px;
  }
}
.total-dom {
  float: right;
  position: relative;
  right: 24px;
  top: 10px;
  color: #686868;
  font-size: 14px;
}
.dict-canvas {
  text-align: left;
  .dict-title {
    text-align: left;
  }
  .dict-input {
    width: 210px;
  }
  .dict-tag {
    margin: 0 3px 10px 0;
  }
}
</style>
