<!-- 新建报名模板 -->
<template>
  <el-container>
    <el-header
      ><div class="top-title">
        <el-icon class="back-arr" title="返回" @click="goBack"
          ><ArrowLeftBold /></el-icon
        >{{ userStore.templateName }}-模板字段配置
      </div>
    </el-header>
    <el-container>
      <!-- 内容 -->
      <el-main>
        <el-form :model="form" label-width="120px">
          <el-form-item label="模板名称：">
            <el-input v-model="form.templateName" />
          </el-form-item>
          <el-form-item label="已选字段：">
            <el-button
              type="primary"
              size="small"
              class="box-field-btn"
              @click="changeFields"
              ><el-icon><Box /></el-icon>选取字段</el-button
            >
            <el-table
              class="conf-table"
              :data="selectedTableData"
              style="width: 100%"
              max-height="400"
              row-key="id"
              border
            >
              <el-table-column type="index" width="50" />
              <el-table-column prop="name_en" label="英文名称" />
              <el-table-column prop="name_cn" label="中文名称" />
              <el-table-column prop="type_cn" label="控件类型" />
              <el-table-column prop="modalNameCn" label="所属模块" />
              <el-table-column
                fixed="right"
                label="操作"
                width="60"
                align="center"
              >
                <template #default="scope">
                  <el-button
                    type="danger"
                    icon="Delete"
                    circle
                    size="small"
                    title="删除"
                    @click="delData(scope)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">创建模板</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { reactive } from 'vue'
import { Options, Vue } from 'vue-class-component'

import { useUserstore, userType } from '@/store/user'
@Options({
  name: 'EnrollTemplate',
  components: {}
})
export default class EnrollTemplate extends Vue {
  userStore = useUserstore()
  pageName = ''
  templateData: any = ''
  form = {
    templateName: ''
  }
  dialogFormVisible = false
  allTableData = reactive([
    {
      id: '101',
      name_en: 'xingming',
      name_cn: '姓名',
      type: 'text',
      type_cn: '文本框',
      category: '1',
      modalNameCn: '基本资料',
      modalName: 'jbzl',
      children: [
        {
          id: '1011',
          name_en: 'csrq',
          name_cn: '出生日期',
          type: 'date',
          type_cn: '日期框',
          category: '1',
          modalNameCn: '基本资料',
          modalName: 'jbzl'
        },
        {
          id: '1012',
          name_en: 'mz',
          name_cn: '民族',
          type: 'select',
          type_cn: '下拉框',
          category: '2',
          modalNameCn: '基本资料',
          modalName: 'jbzl'
        }
      ]
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
  ])
  selectedTableData = []

  delData(data: any) {
    const id = data.row.id
    this.selectedTableData = this.selectedTableData.filter(
      (item: any) => item.id !== id
    )
    console.log('delData', data)
  }
  changeFields() {
    this.dialogFormVisible = true
    this.$nextTick(function () {
      const fieldsTable = this.$refs.fieldsTable as any
      fieldsTable.clearSelection()
      this.selectedTableData.forEach((item: any) => {
        fieldsTable.toggleRowSelection(item, true)
      })
    })
  }
  created() {
    console.log(this.userStore)
    // let dataString: any = this.$route.params?.data || '{}'
    // const data: any = JSON.parse(dataString) || {}
    // if (data.id !== undefined) {
    //   this.pageName = '编辑'
    //   this.form.templateName = data.templateName
    // } else {
    //   this.pageName = '新增'
    // }
    // this.templateData = data
  }
  onSubmit() {
    const params = {
      ...this.form,
      companyId: this.userStore.companyId,
      userId: this.userStore.userId,
      id: this.templateData.id
    }
    console.log(params)
  }
  onSave() {
    this.selectedTableData = (this.$refs.fieldsTable as any).getSelectionRows()

    this.dialogFormVisible = false
  }
  goBack() {
    this.$router.go(-1)
  }
}
</script>
<style scoped lang="less">
.conf-table {
  margin-top: 10px;
  ::v-deep(.el-table__header) {
    thead th {
      background-color: #eeeeee;
    }
  }
}
.box-field-btn {
  position: relative;
  top: 3px;
  .el-icon {
    padding-right: 7px;
    font-size: 14px;
  }
}

.dia-body {
  margin: -35px 0 -20px 0;
}
</style>
