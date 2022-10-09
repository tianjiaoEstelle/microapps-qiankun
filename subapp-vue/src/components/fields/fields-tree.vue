<template>
  <div>
    <el-menu
      :default-active="activeKey"
      class="el-menu-vertical-demo fields-menu"
    >
      <!-- <draggable
      v-model="list"
      group="people"
      @start="drag = true"
      @end="drag = false"
      item-key="index"
    >
      <template #item="{ element }">
        <el-menu-item :index="element.index">
          <el-icon><Avatar /></el-icon>
          <span>{{ element.name }}</span>
        </el-menu-item>
      </template>
    </draggable> -->
      <el-menu-item
        v-for="item in menuList"
        :key="item.moduleKey"
        :index="item.moduleKey"
        @click="handleSelect"
      >
        <component
          class="field-icon"
          :is="item.icon !== 'default' ? item.icon : 'Menu'"
        />
        <span
          >{{ item.moduleValue }}
          <span v-if="item.isDefault === 0 || userStore.companyId === ''">
            <el-icon title="编辑" @click.stop="editData(item)" class="edit"
              ><Edit
            /></el-icon>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除该字段模块?"
              @confirm="delData(item.id)"
            >
              <template #reference>
                <el-icon @click.stop title="删除" class="remove"
                  ><Remove
                /></el-icon>
              </template>
            </el-popconfirm>
          </span>
        </span>
      </el-menu-item>
    </el-menu>
    <el-button type="primary" size="small" @click="addRow" class="add-field-btn"
      ><el-icon><CirclePlus /></el-icon>添加字段模块</el-button
    >
  </div>
  <el-dialog width="380px" v-model="dialogFormVisible" :title="dialogTitle">
    <el-form :model="form" ref="fieldForm">
      <el-form-item label="模块英文名称：" :label-width="formLabelWidth">
        <el-input v-model="form.moduleKey" placeholder="请输入模块英文名称" />
      </el-form-item>
      <el-form-item label="模块中文名称：" :label-width="formLabelWidth">
        <el-input v-model="form.moduleValue" placeholder="请输入模块中文名称" />
      </el-form-item>
      <el-form-item label="模块提示语：" :label-width="formLabelWidth">
        <el-input v-model="form.tips" placeholder="请输入模块中文名称" />
      </el-form-item>
      <el-form-item label="模块图标：" :label-width="formLabelWidth">
        <el-radio-group v-model="form.icon" class="ml-3">
          <el-radio
            v-for="item in icons"
            :key="item.id"
            :label="item.itemKey"
            size="large"
            ><component class="group-field-icon" :is="item.itemKey"
          /></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="字段是否可重复：" :label-width="formLabelWidth">
        <el-switch
          class="field-switch"
          v-model="form.type"
          size="large"
          inline-prompt
          active-text="是"
          inactive-text="否"
          active-value="n"
          inactive-value="1"
        />
        <!-- <el-input-number
          class="input-number"
          v-model="form.type"
          :min="1"
          :max="20"
        /> -->
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="dialogSaveBtnLoading"
          @click="onSave"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { ElMessage } from 'element-plus'
import { useUserstore } from '@/store/user'
import { api } from '@/utils/api'

@Options({
  name: 'FieldsTree',
  components: {},
  watch: {
    companyId: function (val) {
      this.getEnrollModuleList()
    },
  },
})
export default class FieldsTree extends Vue {
  userStore = useUserstore()
  get companyId() {
    return this.userStore.companyId
  }
  dialogFormVisible = false
  dialogTitle = ''
  formLabelWidth = '130px'
  initForm = {
    id: '',
    icon: '',
    isDefault: '',
    moduleKey: '',
    moduleValue: '',
    type: '1',
    typeSwitch: false,
    tips: '',
  }
  form = { ...this.initForm }
  menuList: any = []
  icons: any = []
  dialogSaveBtnLoading = false
  // drag = true
  // list = [
  //   {
  //     index: 'aaa',
  //     name: '项目经验'
  //   },
  //   {
  //     index: 'bbb',
  //     name: '家庭成员'
  //   }
  // ]
  activeKey = '' //当前选中的菜单

  ins: any = reactive({})

  async getEnrollModuleList() {
    const companyId = this.userStore.companyId //企业id

    // console.log('tree companyId', this.userStore.companyId)
    const res: any = await api.getEnrollModuleList({ companyId })

    const data: any = res.data || []
    if (data.length > 0) {
      if (this.activeKey === '') {
        const moduleKey: any = data[0].moduleKey
        this.activeKey = moduleKey
      }

      this.$emit('activeTab', this.activeKey)
    }
    this.menuList = data
  }

  handleSelect = (index: { index: string }) => {
    this.activeKey = index.index
    this.$emit('activeTab', index.index)
  }
  addRow() {
    this.form = { ...this.initForm }
    this.dialogTitle = '添加字段模块'
    this.dialogFormVisible = true
  }
  // changeSwitch(checked: boolean) {
  //   if (checked) {
  //     this.form.type = 'n'
  //   } else {
  //     this.form.type = '1'
  //   }
  // }
  async onSave() {
    try {
      this.dialogSaveBtnLoading = true
      let formData: any = { ...this.form }
      formData['companyId'] = this.userStore.companyId //企业id
      formData['userId'] = this.userStore.userId //用户id

      await api.updateEnrollModuleList(formData)
      //成功提示
      ElMessage({
        showClose: true,
        message: formData.id === '' ? '添加字段模块成功' : '修改字段模块成功',
        type: 'success',
        duration: 3 * 1000,
      })
      // 刷新列表
      this.getEnrollModuleList()
      // 按钮loading
      this.dialogSaveBtnLoading = false
      //dialog隐藏
      this.dialogFormVisible = false
    } catch (e: any) {
      ElMessage({
        showClose: true,
        message: e,
        type: 'error',
        duration: 3 * 1000,
      })
      this.dialogSaveBtnLoading = false
    }
  }
  editData(data: any) {
    this.form = { ...data }
    this.dialogTitle = '编辑字段模块'
    this.dialogFormVisible = true
  }
  async delData(id: string | number) {
    let params = {
      id,
      companyId: this.userStore.companyId, //企业id
    }
    await api.deleteEnrollModuleList(params)
    //成功提示
    ElMessage({
      showClose: true,
      message: '删除字段模块成功',
      type: 'success',
      duration: 3 * 1000,
    })
    // 刷新列表
    this.getEnrollModuleList()
  }
  //控件图标项
  async getModuleIcon() {
    const res: any = await api.getDictKey({ dictKeys: 'moduleIcon' })
    const data: any = res.data || []

    if (data.length > 0) {
      const itemKey = data[0].itemKey
      this.initForm.icon = itemKey
      this.form.icon = itemKey
    }
    this.icons = data
  }

  created() {
    this.getModuleIcon()
    // if (this.companyId !== '') {
    this.getEnrollModuleList()
    // }
  }
}
</script>
<style scoped lang="less">
.fields-menu {
  padding-top: 20px;
  border-right: none;
  height: calc(100vh - 90px);
  overflow-y: scroll;
  li {
    line-height: 40px;
    height: 40px;
    span {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
::v-deep(.input-number) {
  width: 110px;
}
.field-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
.group-field-icon {
  position: relative;
  top: 3px;
  width: 16px;
  height: 16px;
}
.edit,
.remove {
  font-size: 15px;
  position: absolute;
  top: 12px;
  &:hover {
    font-size: 18px;
  }
}
.field-switch {
  position: relative;
  top: -3px;
}
.remove {
  color: #f56c6c !important;
  right: 5px;
}
.edit {
  color: #409eff !important;
  right: 25px;
}
.add-field-btn {
  position: relative;
  left: -7px;
  margin-top: 10px;
  .el-icon {
    padding-right: 7px;
    font-size: 14px;
  }
}
</style>
