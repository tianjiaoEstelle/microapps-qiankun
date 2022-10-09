<!-- 新建报名模板 -->
<template>
  <el-container>
    <el-header id="headerDom" :class="{ isFixed: isFixed }"
      ><div :class="['top-title']">
        <el-icon class="back-arr" title="返回" @click="goBack"
          ><ArrowLeftBold /></el-icon
        >{{ userStore.templateName }} 模板字段配置
        <el-button class="title-btn" @click="goToList">返回</el-button>
        <el-button
          class="title-btn"
          type="primary"
          :loading="saveLoading"
          @click="onSubmit"
          >保存配置</el-button
        >
      </div>
    </el-header>
    <el-container>
      <!-- 内容 -->
      <el-main>
        <el-alert
          class="tips-text"
          title="“单击” 可选中，“拖拽” 可排序"
          type="warning"
          show-icon
        />
        <div class="drag-canvas">
          <draggable
            class="left"
            v-model="enrollList"
            chosenClass="chosen"
            forceFallback="true"
            group="people"
            animation="200"
            @start="onStart"
            @end="onEnd"
          >
            <template #item="{ element }">
              <div
                :class="['item', { checked: element.checked }]"
                :key="element.moduleId"
                @click.stop="checkModule(element)"
              >
                <div :class="['module-title']">
                  <span>{{ element.moduleValue }}</span>
                  <el-checkbox
                    class="check-all"
                    label="全选字段"
                    v-model="element.checkedAll"
                    @click.stop
                    @change="(checked) => checkAll(checked, element)"
                  />
                </div>
                <draggable
                  v-model="element.fieldsList"
                  chosenClass="chosen"
                  forceFallback="true"
                  :group="{
                    name: 'child-' + element.moduleId,
                    pull: false,
                    put: false,
                  }"
                  animation="200"
                  @start="onStart"
                  @end="onEnd"
                >
                  <template #item="{ element }">
                    <div
                      :class="['sub-item', { checked: element.checked }]"
                      :key="element.fieldsId"
                      @click.stop="checkedField(element)"
                    >
                      <el-icon
                        class="check-box"
                        @click.stop="checkEmpty(element)"
                        ><StarFilled
                          class="check-icon"
                          v-if="!element.isEmpty" /><Star
                          class="check-icon"
                          v-else
                      /></el-icon>
                      <span class="field-val">{{ element.fieldsValue }}</span>
                    </div>
                  </template>
                </draggable>
              </div>
            </template>
          </draggable>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Options, Vue } from 'vue-class-component'

import draggable from 'vuedraggable'
import { api } from '@/utils/api'
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { useUserstore, userType } from '@/store/user'
@Options({
  name: 'EnrollTemplate',
  components: { draggable },
})
export default class EnrollTemplate extends Vue {
  userStore = useUserstore()

  headerRef = ref()
  enrollList: any = [
    {
      moduleId: 1,
      moduleKey: 'basic',
      moduleValue: '个人基本信息',
      fieldsList: [{ fieldsId: 1, fieldsKey: 'name', fieldsValue: '姓名' }],
    },
  ]
  drag = false
  isFixed = false
  selFieldsList: any = []
  saveLoading = false
  //开始拖拽事件
  onStart = () => {
    this.drag = true
  }
  //拖拽结束事件
  onEnd = () => {
    this.drag = false
    // console.log(this.enrollList)
  }
  //模块选中
  checkModule(element: any) {
    this.enrollList.forEach((item: any) => {
      if (item.moduleId === element.moduleId) {
        const newChecked = !item['checked']
        item['checked'] = newChecked //是否选中，默认不选中

        if (!newChecked) {
          item['checkedAll'] = newChecked //是否选中，默认不选中
          //模块不选中，子模块全不选中
          item.fieldsList.forEach((fieldItem: any) => {
            fieldItem['checked'] = false //是否选中，默认不选中
            fieldItem['isEmpty'] = !false //不选中
          })
        }
      }
    })
  }
  //字段选中
  checkedField(element: any) {
    this.enrollList.forEach((item: any) => {
      if (item.moduleId === element.moduleId && item.fieldsList.length > 0) {
        const fieldsListLen = item.fieldsList.length
        let checkedLen = 0
        item.fieldsList.forEach((fieldItem: any) => {
          if (fieldItem.fieldsId === element.fieldsId) {
            const newChecked = !fieldItem['checked'] //字段新状态
            fieldItem['checked'] = newChecked //是否选中，默认不选中
            if (newChecked) {
              //选中字段
              if (!item['checked']) {
                //模块没有被选中，跟随选中
                item['checked'] = true
              }

              fieldItem['isEmpty'] = !true //必填跟随选中
            } else {
              fieldItem['isEmpty'] = !false //是否跟随不选中
            }
          }
          if (fieldItem['checked']) {
            checkedLen++
          }
        })
        const flag = fieldsListLen === checkedLen
        item['checkedAll'] = flag
        if (checkedLen === 0) {
          item['checked'] = false
        }
      }
    })
  }
  //必填选中
  checkEmpty(element: any) {
    this.enrollList.forEach((item: any) => {
      if (item.moduleId === element.moduleId && item.fieldsList.length > 0) {
        item.fieldsList.forEach((fieldItem: any) => {
          if (fieldItem.fieldsId === element.fieldsId) {
            const newVal = !fieldItem['isEmpty']
            fieldItem['isEmpty'] = newVal //是否选中，默认不选中
            // fieldItem['isEmpty'] = 0 //是否必填
          }
        })
      }
    })
  }
  //全选
  checkAll(checked: boolean, element: any) {
    this.enrollList.forEach((item: any) => {
      if (item.moduleId === element.moduleId && item.fieldsList.length > 0) {
        item['checkedAll'] = checked
        item['checked'] = checked
        item.fieldsList.forEach((fieldItem: any) => {
          fieldItem['checked'] = checked
          fieldItem['isEmpty'] = !checked
        })
      }
    })
  }

  convertToReqList() {
    let enrollList: any = JSON.parse(JSON.stringify(this.enrollList))
    enrollList = enrollList.filter((item: any) => {
      return item.checked
    })
    enrollList.forEach((item: any) => {
      let fieldsList = [...item.fieldsList]
      fieldsList = fieldsList.filter((fieldItem: any) => {
        return fieldItem.checked
      })
      item.fieldsList = fieldsList
    })

    return enrollList
  }
  async onSubmit() {
    try {
      this.saveLoading = true
      const resList = this.convertToReqList()
      // console.log(resList)
      let params = {
        moduleList: resList,
        templateId: this.userStore.templateId,
        userId: this.userStore.userId,
      }
      const res = await api.updateTemplateFielsd(params)
      this.saveLoading = false
      //成功提示
      let msg = '模板字段配置成功，是否返回列表?'
      if (this.userStore.companyId === '0') {
        msg = '模板字段配置成功！'
      }
      ElMessageBox.confirm(msg, '成功', {
        confirmButtonText: '返回',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.goToList()
      })
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

  goBack() {
    this.$router.go(-1)
  }
  goToList() {
    if (this.userStore.templateId && this.userStore.companyId) {
      this.$router.push({
        path: '/enroll',
      })
    } else {
      this.$router.go(-1)
    }
  }
  fillDataFields(data: any) {
    data.forEach((item: any) => {
      item['checkedAll'] = false //全选选中，默认不选中
      item['checked'] = false //是否选中，默认不选中
      item['isEmpty'] = !false //是否非必填 true:非必填 false:必填
      const moduleId = item.moduleId
      if (item.fieldsList.length > 0) {
        item.fieldsList.forEach((fieldItem: any) => {
          fieldItem['checked'] = false //是否选中，默认不选中
          fieldItem['isEmpty'] = !false //是否必填
          fieldItem['moduleId'] = moduleId //父模块id
        })
      }
    })
    return data
  }
  //查找模块字段全值
  async getFieldsTree() {
    try {
      const companyId = this.userStore.companyId //企业id

      const res: any = await api.getFieldsTree({ companyId })
      let data = res.data || []
      if (data.length > 0) {
        data = this.fillDataFields(data)
      }
      this.enrollList = data
      this.getTemplateFieldsById()
    } catch (error: any) {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
        duration: 3 * 1000,
      })
    }
  }
  async getTemplateFieldsById() {
    const templateId = this.userStore.templateId
    let detailRes: any = {}
    if (templateId === '') {
      const userId = this.userStore.userId
      detailRes = await api.getDefaultTemplateFields({})
    } else {
      detailRes = await api.getTemplateFieldsById({ id: templateId })
    }
    const { data } = detailRes
    let fieldsFull = data.fieldsFull
    if (fieldsFull) {
      fieldsFull === null ? (fieldsFull = '[]') : fieldsFull
      const selList = JSON.parse(fieldsFull)
      //回填选中模块
      if (selList.length > 0) {
        this.fillSelectedModules(selList)
      }
    }
    // console.log(selList)
  }
  //回填选中模块
  fillSelectedModules(selList: any) {
    let enrollList = [...this.enrollList]
    const selListLen = selList.length
    let addModuleList = []
    //倒叙遍历
    for (let i = selListLen - 1; i >= 0; i--) {
      //选中模块
      const selItem = selList[i]
      const selModuleId = selItem.moduleId //模块id
      const selFieldsList = selItem.fieldsList //模块子字段集合
      for (let n = 0; n < enrollList.length; n++) {
        //字段对象
        const item: any = enrollList[n]
        //选中字段
        const moduleId = item.moduleId
        if (selModuleId === moduleId) {
          item['checked'] = true
          const fieldsList = item.fieldsList
          const selFieldsListLen = selFieldsList.length
          const fieldsListLen = fieldsList.length
          if (fieldsListLen > 0 && selFieldsListLen > 0) {
            if (fieldsListLen === selFieldsListLen) {
              item['checkedAll'] = true
            }
            //回填选中字段
            const newFieldsList = this.fillSelectedFields(
              fieldsList,
              selFieldsList
            )
            item.fieldsList = newFieldsList
            addModuleList.unshift(item)
            enrollList.splice(n, 1)
          }
        }
      }
    }
    addModuleList.push(...enrollList)
    this.enrollList = addModuleList
    // console.log(addModuleList)
  }
  //回填选中字段
  fillSelectedFields(fieldsList: any, selFieldsList: any) {
    let fList = [...fieldsList]
    const selFieldsListLen = selFieldsList.length
    let addList = []
    //倒叙遍历
    for (let i = selFieldsListLen - 1; i >= 0; i--) {
      const selItem: any = selFieldsList[i] //选中字段
      const selId = selItem.id
      const isEmpty = selItem.isEmpty

      for (let n = 0; n < fList.length; n++) {
        //全部字段
        const item: any = fList[n]
        const fieldsId = item.fieldsId
        if (selId === fieldsId) {
          item['checked'] = true
          item['isEmpty'] = isEmpty
          const _item = { ...item }
          // console.log(_item)
          //根据选中的字段排序
          addList.unshift(_item)
          fList.splice(n, 1)
        }
      }
    }
    addList.push(...fList)
    return addList
  }
  listenScroll() {
    const proxy = this
    window.addEventListener('scroll', function () {
      const header: any = document.querySelector('#headerDom')
      const offsetTop = header.offsetTop
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (scrollTop > offsetTop) {
        proxy.isFixed = true
      } else {
        proxy.isFixed = false
      }
    })
  }
  showNotice() {
    ElNotification({
      title: '',
      dangerouslyUseHTMLString: true,
      message:
        '<span style="color: #e58d21;"><strong>单击</strong> 为选中，<strong>拖拽</strong> 可排序</span>',
      type: 'warning',
      duration: 10 * 1000,
      offset: 50,
      position: 'top-left',
    })
  }
  created() {
    // console.log({ ...this.userStore })
    this.getFieldsTree() //获取字段树结构
    this.listenScroll() //监听滚动，吸顶
    // this.showNotice() //操作提示语
  }
}
</script>
<style scoped lang="less">
::v-deep(.el-container) {
  height: 100%;
  overflow-y: auto;
}
.title-btn {
  float: right;
  margin-right: 10px;
  position: relative;
  top: -4px;
}
.isFixed {
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  background-color: #ffffff;
}
.drag-canvas {
  .left {
    .item {
      line-height: 30px;
      background-color: #f7f7f7;
      margin: 15px;
      border-radius: 3px;
      &:hover {
        cursor: pointer;
        box-shadow: 0px 0px 5px rgb(110, 110, 110);
      }
      .module-title {
        padding: 5px 0;
        background-color: #e9e9e9;
        border-bottom: 1px solid rgb(196, 195, 195);
        position: relative;
        .check-all {
          position: absolute;
          right: 15px;
        }
      }
      > div:nth-child(2) {
        text-align: left;
        margin: 5px 10px;
      }
    }

    .item.checked {
      box-shadow: 0 0 6px #4285c9;
      .module-title {
        background-color: rgb(199, 227, 255);
        color: rgb(66, 133, 201);
      }
    }
    .sub-item {
      padding: 0 8px;
      display: inline-block;
      background-color: #ddd;
      margin: 5px;
      border-radius: 2px;
      &:hover {
        cursor: pointer;
        box-shadow: 3px 3px 5px rgb(110, 110, 110);
      }
    }
    .sub-item.checked {
      background-color: rgb(199, 227, 255);
      .check-box {
        color: #e58d21;
      }
      span {
        color: rgb(66, 133, 201);
      }
    }
    .check-box {
      margin-right: 5px;
      height: 100%;
      line-height: 100%;
    }
    .field-val {
      font-size: 14px;
      color: #494949;
      position: relative;
      top: -2px;
      height: 100%;
      line-height: 100%;
    }
    .checkgroup-box {
      float: left;
      left: 10px;
      position: relative;
    }
  }
}
.tips-text {
  width: calc(100% - 30px);
  margin-left: 15px;
  ::v-deep(.el-alert__title) {
    font-size: 16px;
  }
  ::v-deep(.el-alert__icon) {
    width: 18px;
    font-size: 18px;
  }
}
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
