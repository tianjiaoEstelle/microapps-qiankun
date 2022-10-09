<!-- 简历表单集合 -->
<template>
  <!-- 内容 -->
  <el-main class="form-canvas" v-loading="canvasLoad">
    <!-- <div class="form-title" v-if="pageType !== 'companyDetail'">
      我的简历
      <span class="red"
        >(
        <el-icon class="check-box"><StarFilled /></el-icon>
        号为必填项)</span
      >
    </div> -->
    <!-- 企业端查看简历-精简模块 v-else-->
    <div v-if="pageType === 'companyDetail'">
      <div class="reduce-resume">
        <!-- <div class="avatar">
          <img :src="subAvatar" />
        </div> -->
        <div class="info">
          <!-- <div class="rtime">更新时间：</div> -->
          <!-- <div class="line">
            <div>
              <span>姓名：</span
              ><span class="cont">{{ form?.basic?.name }}</span>
            </div>
          </div> -->
          <div class="line">
            <div>
              <span>应聘职位：</span><span class="cont">{{ jobsName }}</span>
            </div>
          </div>
          <!-- <div class="line">
            <div><span>姓名：</span><span class="cont"></span></div>
            <div><span>性别：</span><span class="cont"></span></div>
            <div><span>出生年月：</span><span class="cont"></span></div>
            <div><span>学历：</span><span class="cont"></span></div>
          </div> -->
        </div>
      </div>
    </div>
    <div v-for="item in formList" :key="item.id" class="module-card">
      <!-- 逐一生成表单 -->
      <resume-single-form
        :moduleValue="item.moduleValue"
        :moduleKey="item.moduleKey"
        :fieldsList="item.fieldsList"
        :orgForm="form[item.moduleKey]"
        :dictMap="dictMap"
        :rules="rules[item.moduleKey]"
        @setFrameHeight="setFrameHeight"
        @updateFormByKey="updateFormByKey"
      />
    </div>
  </el-main>
</template>
<script lang="ts">
import { ref } from 'vue'
import { Options, Vue, prop } from 'vue-class-component'
import { api } from '@/utils/api'
import { useUserstore } from '@/store/user'
import { ElMessage } from 'element-plus'
import ResumeSingleForm from './resume-single-form.vue'
import type {
  formType,
  formItem,
  itemType,
  formListType,
  templateList,
  templateItem,
} from './resume-types'

//具有多选项控件枚举
const DictUIType = ['radio', 'select', 'checkbox']
class Props {
  jobsName = prop<string>({
    required: false,
  })
}
@Options({
  name: 'ResumeFormContainer',
  components: {
    ResumeSingleForm,
  },
  watch: {
    userId: function () {
      this.getResume()
    },
    resumeTmpId: function () {
      // console.log('aaa resumeTmpId变了', val)
      this.getTemplateFieldsById()
    },
  },
})
export default class ResumeFormContainer extends Vue.with(Props) {
  get pageType() {
    return this.userStore.pageType
  }
  get resumeTmpId() {
    return this.userStore.templateId
  }
  userStore = useUserstore()
  get userId() {
    return this.userStore.userId
  }
  get did() {
    return this.userStore.did
  }
  get subAvatar() {
    const form: formType<formItem<string>> = this.form
    if (Object.keys(form).includes('basic')) {
      const basic = form.basic
      let srcStr = basic.avatar
      if (srcStr === undefined || srcStr === '') {
        const sex = basic.sex
        if (sex === '女') {
          return require('@/assets/no_photo_female.png')
        } else {
          return require('@/assets/no_photo_male.png')
        }
      }
      return srcStr
    }
    return ''
  }
  canvasLoad = false
  isFixed = false
  ruleFormRef = ref()
  dictIds: string[] = [] //字典项id集合
  dictMap = {} //所有字典项对象-单选、多选、下拉框选项
  formList: formListType[] = [] //简历字段集合-用于绘制表单组件
  form = {} //简历表单数据结构
  lastForm = {} //简历表单数据结构-保存之前数据，用于返回恢复
  rules = {} //简历表单校验规则
  setHeight = null
  //根据简历模板id获取简历模板字段
  async getTemplateFieldsById() {
    // console.log('aaa请求接口')
    this.canvasLoad = true
    let detailRes: any = {}
    if (this.did) {
      detailRes = await api.getResumeByDid({ did: this.did })
    } else if (this.resumeTmpId) {
      detailRes = await api.getTemplateFieldsById({ id: this.resumeTmpId })
    } else {
      detailRes = await api.getDefaultTemplateFields({})
    }
    const { data } = detailRes
    const { fieldsFull = '[]' } = data
    const fieldsMap = JSON.parse(fieldsFull) || []
    // console.log(fieldsMap)
    this.formList = fieldsMap
    //获取选项集合
    this.fillDictIds(fieldsMap)
    //根据模板结构转换成表单结构
    this.convertFieldMapToFormData(fieldsMap)
    this.setFrameHeight()
    this.canvasLoad = false
  }
  //根据简历模板id获取简历模板字段
  async getResume() {
    let detailRes: any = {}
    if (this.did) {
      detailRes = await api.getResumeDataByDid({ did: this.did })
    } else {
      // const userStore: userType = this.userStore
      const userStore = this.userStore
      const jobsId: any = userStore?.jobsId
      const userId: any = userStore?.userId
      if (userId === '') {
        return
      }
      if (jobsId) {
        //根据申请岗位，弹出对应简历
        const params = {
          jobsId,
          userId,
          templateId: this.userStore.templateId,
        }
        detailRes = await api.getResume(params)
      } else {
        //查询个人默认简历
        detailRes = await api.getDefaultResume({ userId })
      }
    }

    const { data } = detailRes
    for (let key in data) {
      const str = data[key]
      const obj = JSON.parse(str)
      data[key] = obj
    }
    for (let key in this.form) {
      // form有数据，data也有数据
      if (data[key] !== undefined) {
        let subForm: formItem<string>[] = this.form[key]
        const dataForm = data[key]
        if (Array.isArray(subForm) && subForm.length > 0) {
          if (key === 'picture' || key === 'attach') {
            subForm = dataForm
          } else {
            //根据data数组个数，重置form个数
            const formLen = subForm.length
            const dataLen = dataForm.length
            if (dataLen !== 0) {
              if (formLen < dataLen) {
                const item: formItem<string> = subForm[0]
                let newSubForm: formItem<string>[] = []
                for (let index = 0; index < dataLen; index++) {
                  newSubForm.push({ ...item })
                }
                subForm = newSubForm
              }
            }

            subForm.forEach(function (subItem: any, index: any) {
              const dataItem = dataForm[index]
              for (let subKey in subItem) {
                if (dataItem[subKey] !== undefined) {
                  subItem[subKey] = dataItem[subKey]
                }
              }
            })
            // console.log(subForm)
          }
        } else {
          for (let subKey in subForm) {
            if (dataForm[subKey] !== undefined) {
              subForm[subKey] = dataForm[subKey]
            }
          }
        }
        this.form[key] = subForm
      } else {
        if (key === 'picture' || key === 'attach') {
          this.form[key] = []
        }
      }
    }

    this.lastForm = JSON.parse(JSON.stringify(this.form))
    this.$emit('updateForm', this.form)
    const _this = this
    setTimeout(function () {
      //表单重置
      const refs: any = _this.$refs
      for (let key in refs) {
        const ref = { ...refs[key] }
        for (let k in ref) {
          const refEl = { ...ref[k] }
          refEl.clearValidate()
        }
      }
      _this.setFrameHeight()
    }, 300)

    // const { fieldsFull = '[]' } = data
    // const fieldsMap = JSON.parse(fieldsFull)
    // console.log(data)
    // this.formList = fieldsMap
  }
  //根据模板结构转换成表单结构
  convertFieldMapToFormData(fieldsMap: any) {
    if (fieldsMap === null) return
    // console.log(fieldsMap)
    // const proxy = this
    let map = {}
    let rules = {}
    fieldsMap.forEach((item: templateList) => {
      const { moduleKey = '', fieldsList = [], moduleType = '1' } = item
      if (moduleKey !== '') {
        let subMap = {}
        let rulesSubMap = {}
        if (map[moduleKey] === undefined) {
          //判断模块是否可以重复
          if (moduleType === '1') {
            map[moduleKey] = {}
            subMap = map[moduleKey]
          } else if (moduleType === 'n') {
            map[moduleKey] = [{}]
            subMap = map[moduleKey][0]
          }
          rules[moduleKey] = {}
          rulesSubMap = rules[moduleKey]
        }

        //大模块小字段集合
        if (fieldsList.length > 0) {
          //遍历字段
          fieldsList.forEach((fItem: templateItem) => {
            const { key = '', uiType = 'string', isEmpty = true } = fItem

            //多选框，初始化为数组
            if (uiType === 'checkbox') {
              subMap[key] = []
            } else if (uiType === 'datePeriod') {
              subMap[key] = ['', '']
            } else {
              subMap[key] = '' //初始化字段值
            }
            if (!isEmpty && key) {
              if (uiType === 'string') {
                rulesSubMap[key] = [
                  {
                    required: !isEmpty,
                    message: '必填项',
                    trigger: 'change',
                  },
                ]
                //邮箱
                if (key === 'email') {
                  rulesSubMap[key].push({
                    validator: this.validateEmail,
                    trigger: 'change',
                  })
                } else if (key === 'phone') {
                  rulesSubMap[key].push({
                    validator: this.validatePhone,
                    trigger: 'change',
                  })
                }
              } else if (uiType === 'date') {
                rulesSubMap[key] = [
                  {
                    required: !isEmpty,
                    message: '必选项',
                    trigger: 'blur',
                  },
                ]
              } else if (uiType === 'datePeriod') {
                rulesSubMap[key] = [
                  {
                    validator: this.validateDatePeriod,
                    trigger: 'blur',
                  },
                ]
              } else if (DictUIType.indexOf(uiType) > -1) {
                rulesSubMap[key] = [
                  {
                    required: !isEmpty,
                    message: '必选项',
                    trigger: 'change',
                  },
                ]
              }
            }
          })
        }
      }
    })
    this.form = { ...this.form, ...map }
    // console.log(this.form, map)
    let newForm = {}
    for (const key in map) {
      const item = map[key] //结构
      if (this.form[key] !== undefined) {
        const formItem = this.form[key] //数据
        if (Array.isArray(item)) {
          newForm[key] = []
          const len = formItem.length
          for (let i = 0; i < len; i++) {
            newForm[key][i] = {}
            for (const k in item[i]) {
              newForm[key][i][k] = formItem[i][k]
            }
          }
        } else {
          newForm[key] = {}
          for (const k in item) {
            newForm[key][k] = formItem[k]
          }
        }
      }
    }
    this.form = newForm
    if (this.pageType !== 'preview') {
      this.rules = rules
    }
  }

  validateEmail(rule: any, value: any, callback: any) {
    const regularEmail =
      /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+.([a-zA-Z]{2,4})$/ // 验证邮箱

    if (value === '' || !regularEmail.test(value)) {
      callback(new Error('请输入正确的邮箱格式'))
    }
    callback()
  }

  validatePhone(rule: any, value: any, callback: any) {
    const regularMobile = /^1[3456789]\d{9}$/ // 验证手机号

    if (value === '' || !regularMobile.test(value)) {
      callback(new Error('请输入正确的手机号格式'))
    }
    callback()
  }
  validateDatePeriod(rule: any, value: any, callback: any) {
    const valueStr = value.join(',')
    if (valueStr === ',') {
      callback(new Error('请选择完整时间范围'))
    }
    callback()
  }

  //添加一条集合数据
  addOneData(key: string) {
    const curList = this.form[key]
    const len = curList.length
    if (len >= 1) {
      const map = { ...curList[len - 1] }
      for (let key in map) {
        const mapVal = map[key]
        if (Array.isArray(mapVal)) {
          const len = mapVal.length
          map[key] = new Array(len).fill('')
        } else {
          map[key] = ''
        }
      }
      curList.push(map)
    }
    this.$nextTick(function () {
      this.setFrameHeight()
    })
  }
  //删除一条集合数据
  delOneData(key: string, idx: number) {
    const curList = this.form[key]
    const len = curList.length
    if (len > 0) {
      curList.splice(idx, 1)
    }
    this.$nextTick(function () {
      this.setFrameHeight()
    })
  }
  //根据id集合获取字典项
  async getDictMap() {
    if (this.dictIds.length === 0) return
    const ids = this.dictIds.join(',')
    const res: any = await api.getDictFieldsByIds({ resumeFieldsIds: ids })
    const { data } = res
    this.dictMap = data
    // console.log(data)
  }
  //筛选出需要根据id获取选项字典的id集合
  fillDictIds(fieldsMap: any) {
    if (fieldsMap === null) {
      return
    }
    fieldsMap.forEach((element: any) => {
      const fieldsList: itemType[] = element.fieldsList
      if (fieldsList.length > 0) {
        fieldsList.forEach((item: itemType) => {
          if (DictUIType.indexOf(item.uiType) > -1) {
            this.dictIds.push(item.id)
          }
        })
      }
    })
    //根据id集合获取字典项
    this.getDictMap()
  }
  updateFormByKey(form: any, key: string) {
    this.form[key] = form
    // console.log(this.form)
    this.$emit('updateForm', this.form)
  }

  //全表单保存
  async onSubmit(msg: string) {
    // console.log(this.$refs)
    const refs: any = this.$refs
    let resultArr: any = [] //用来接受返回结果的数组
    for (let key in refs) {
      const ref = { ...refs[key] }
      for (let k in ref) {
        const refEl = { ...ref[k] }
        //逐一表单校验
        await refEl.validate((valid: any) => {
          if (valid) {
            resultArr.push(true)
          } else {
            resultArr.push(false)
          }
        })
      }
    }
    //表单验证全部通过后提交
    Promise.all(resultArr)
      .then((values) => {
        // console.log(values)
        if (values.indexOf(false) === -1) {
          this.saveData(msg) // 此时必填完成，做保存后的业务操作
        }
      })
      .catch((e: any) => {
        console.log(e)
      })
  }
  //数据提交
  async saveData(msg: string = '') {
    // console.log(msg)
    try {
      let dataStr = {}
      for (let key in this.form) {
        //对象字段转字符串
        dataStr[key] = JSON.stringify(this.form[key])
      }
      const params = {
        jobsId: this.userStore.jobsId,
        userId: this.userStore.userId,
        templateId: this.userStore.templateId,
        data: dataStr,
      }
      await api.saveResume(params)
      this.lastForm = JSON.parse(JSON.stringify(this.form))
      //成功提示
      if (msg !== '') {
        ElMessage({
          showClose: true,
          message: '保存模板成功',
          type: 'success',
          duration: 3 * 1000,
        })
      }

      this.userStore.updatePageType('detail')
      // console.log(this.form)
      // this.$emit('updateForm', this.form)
    } catch (error: any) {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
        duration: 3 * 1000,
      })
      this.$emit('submitFlag', false)
    }
  }
  //重置表单数据到上一次数据
  revertFormData() {
    this.form = JSON.parse(JSON.stringify(this.lastForm))
  }
  goBack() {
    this.$router.go(-1)
  }
  goToList() {
    this.$router.push({
      path: '/enroll',
    })
  }
  setFrameHeight() {
    setTimeout(function () {
      const formDom: any = document.getElementsByClassName('form-canvas')
      if (formDom.length > 0) {
        const formHeight = formDom[0].offsetHeight
        // console.log('setFrameHeight', formHeight)
        setTimeout(function () {
          window.parent.postMessage({ formHeight: formHeight }, '*')
        }, 200)
      }
    }, 100)
  }
  created() {
    this.$emit('revertFormDataFunc', this.revertFormData)
    this.getTemplateFieldsById()
    if (this.pageType !== 'preview') {
      this.getResume()
    }
  }
  updated() {
    if (this.pageType !== 'preview') {
      this.getResume()
    }
  }
}
</script>
<style scoped lang="less">
.red {
  color: crimson;
}
.form-canvas {
  padding-top: 10px;
  max-width: 1200px;
  margin: 0 auto;
  height: fit-content;
  .form-title {
    font-size: 18px;
    line-height: 1.75;
    text-align: left;
    .check-box {
      position: relative;
      top: 3px;
    }
  }
  .module-card:first-child {
    border-top: none;
  }
  .module-card {
    border-top: 1px #cecece solid;
    margin-top: 8px;
    .module-name {
      font-size: 16px;
      line-height: 2;
      text-align: left;
      .check-box {
        font-size: 14px;
        margin-right: 2px;
      }
    }
    .fields-card {
      ::v-deep(.el-form) {
        text-align: left;
        .el-form-item {
          // width: 30%;
          @media screen and (max-width: 1080px) {
            .el-form-item__label {
              min-width: 140px;
            }
          }
          @media screen and (min-width: 1081px) {
            .el-form-item__label {
              min-width: 150px;
            }
          }
        }
      }
      .field-check-box {
        font-size: 10px;
        position: relative;
        top: -1px;
      }
      .detail-form {
        ::v-deep(.el-form-item__label) {
          color: #8b8b8b;
        }
      }
      .rep-form {
        position: relative;
        border-bottom: 1px dashed #dddddd;
        padding-top: 20px;
        .card-del-icon {
          position: absolute;
          right: 10px;
          top: 20px;
        }
      }
      .rep-form:last-child {
        border-bottom: none;
      }
    }
    .long-btn {
      width: 100%;
    }
  }
}
.reduce-resume {
  display: flex;
  display: -webkit-flex;
  .avatar {
    margin-right: 40px;
    img {
      width: 140px;
      height: 140px;
    }
  }
  .info {
    flex: 1;
    text-align: left;
    .line {
      margin: 8px 0 16px;
      > div {
        display: inline-block;
        color: #8b8b8b;
        font-size: 15px;
        > span:first-child {
          width: 80px;
          text-align: right;
          display: inline-block;
          margin-right: 5px;
        }
        .cont {
          color: #2c3e50;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
