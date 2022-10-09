<!-- 简历表单-单个表单  -->
<template>
  <!-- 模块名item -->
  <div class="module-name">
    <el-icon class="check-box red"><StarFilled /></el-icon>{{ moduleValue }}
    <span v-if="pageType !== 'preview' && pageType !== 'companyDetail'">
      <el-button
        v-if="formType === 'edit'"
        size="small"
        class="title-btn"
        @click="goBack"
        >返回</el-button
      >
      <el-button
        v-if="formType === 'edit'"
        class="title-btn"
        type="primary"
        size="small"
        :loading="saveLoading"
        @click="onSubmit"
        >保存</el-button
      >
      <el-button
        v-if="formType === 'detail'"
        class="title-btn"
        type="primary"
        size="small"
        icon="Edit"
        @click="onEdit"
        >编辑</el-button
      >
    </span>
  </div>
  <div v-if="moduleKey === 'picture'">
    <pictures
      :data="form"
      :mod="formType"
      @setPicturesData="setPicturesData"
      @delPicturesData="delPicturesData"
    />
  </div>
  <div v-else-if="moduleKey === 'attach'">
    <Files
      :data="form"
      :mod="formType"
      @setFilesData="setFilesData"
      @delFilesData="delFilesData"
    />
  </div>
  <div v-else>
    <div v-if="fieldsList.length > 0">
      <!-- 支持多个form重复 -->
      <div class="fields-card" v-if="Array.isArray(form)">
        <el-form
          v-for="(fitem, idx) in form"
          :key="idx"
          :ref="moduleKey + 'Ref'"
          :class="['rep-form', { 'detail-form': formType === 'detail' }]"
          inline="true"
          :model="form[idx]"
          :rules="rules"
          hide-required-asterisk="true"
        >
          <el-form-item
            v-for="field in fieldsList"
            :key="field.id"
            :prop="field.key"
          >
            <!-- 字段名 field -->
            <template #label
              ><span>
                <el-icon v-if="!field.isEmpty" class="field-check-box red">
                  <StarFilled />
                </el-icon>
                {{ field.value }}:
              </span></template
            >
            <resume-form-item
              :form="form[idx]"
              :fKey="field.key"
              :field="field"
              :dictMap="dictMap"
              :formType="formType"
              :pageType="pageType"
              @setFrameHeight="setFrameHeight"
            ></resume-form-item>
          </el-form-item>
          <span v-if="formType === 'edit' || formType === 'preview'">
            <el-button
              v-if="idx > 0"
              class="card-del-icon"
              type="danger"
              icon="Delete"
              circle
              @click="delOneData(idx)"
          /></span>
        </el-form>
      </div>
      <!-- 单个form重复 -->
      <div class="fields-card" v-else>
        <el-form
          :ref="moduleKey + 'Ref'"
          :class="[{ 'detail-form': formType === 'detail' }]"
          inline="true"
          :model="form"
          :rules="rules"
          hide-required-asterisk="true"
        >
          <el-form-item
            v-for="field in fieldsList"
            :key="field.id"
            :prop="field.key"
          >
            <!-- 字段名 field -->
            <template #label
              ><span>
                <el-icon v-if="!field.isEmpty" class="field-check-box red">
                  <StarFilled />
                </el-icon>
                {{ field.value }}:
              </span></template
            >
            <resume-form-item
              :form="form"
              :fKey="field.key"
              :field="field"
              :dictMap="dictMap"
              :formType="formType"
              :pageType="pageType"
              @setFrameHeight="setFrameHeight"
            ></resume-form-item>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="formType === 'edit' || formType === 'preview'">
      <el-button
        v-if="Array.isArray(form)"
        plain
        type="primary"
        class="long-btn"
        @click="addOneData()"
        >添加一条</el-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component'
import { api } from '@/utils/api'
import { useUserstore, userType } from '@/store/user'
import { ElMessage } from 'element-plus'

import ResumeFormItem from './ResumeFormItem.vue'
import Pictures from './upload/Pictures.vue'
import Files from './upload/Files.vue'
class Props {
  moduleValue = prop<string>({
    required: true
  })
  moduleKey = prop<string>({
    required: true
  })
  fieldsList = prop<any>({
    required: true
  })
  orgForm = prop<any>({
    required: true
  })
  rules = prop<any>({
    required: true
  })
  dictMap = prop<any>({
    required: true
  })
}

@Options({
  name: 'ResumeSingleForm',
  components: {
    ResumeFormItem,
    Pictures,
    Files
  },
  watch: {
    orgForm: {
      handler(val: any) {
        // 特别注意，不能用箭头函数，箭头函数，this指向全局
        // console.log('orgForm changed', val)
        this.form = JSON.parse(JSON.stringify(val))
        this.lastForm = JSON.parse(JSON.stringify(val))
        // this.clearValidate()
        const _this = this
        setTimeout(function () {
          _this.clearValidate()
        }, 200)
      },
      deep: true // 可以深度检测到 obj 对象的属性值的变化
    }
  }
})
export default class ResumeSingleForm extends Vue.with(Props) {
  saveLoading = false
  formType = 'detail'

  get pageType() {
    return this.userStore.pageType
  }
  userStore = useUserstore()
  get userId() {
    return this.userStore.userId
  }
  lastForm: any = JSON.parse(JSON.stringify(this.orgForm)) //简历表单数据结构-保存之前数据，用于返回恢复
  form: any = JSON.parse(JSON.stringify(this.orgForm))

  //添加一条集合数据
  addOneData() {
    const curList = this.form
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
      this.$emit('setFrameHeight')
    })
  }
  //删除一条集合数据
  delOneData(idx: number) {
    const curList = this.form
    const len = curList.length
    if (len > 0) {
      curList.splice(idx, 1)
    }
    this.$nextTick(function () {
      this.$emit('setFrameHeight')
    })
  }
  //编辑按钮
  onEdit() {
    this.formType = 'edit'

    //清空校验
    this.$nextTick(function () {
      this.clearValidate()
      this.$emit('setFrameHeight')
    })
  }
  //返回按钮
  goBack() {
    this.formType = 'detail'
    this.form = this.lastForm
    //清空校验
    this.$nextTick(function () {
      this.clearValidate()
    })
    this.$emit('setFrameHeight')
  }

  setPicturesData(val: any) {
    this.form.push({ picture: val })
    //清空校验
    this.$nextTick(function () {
      this.clearValidate()
      this.$emit('setFrameHeight')
    })
  }
  delPicturesData(val: any) {
    this.form = this.form.filter((item: any) => item.picture !== val)
    //清空校验
    this.$nextTick(function () {
      this.clearValidate()
      this.$emit('setFrameHeight')
    })
  }
  setFilesData(fileName: string, val: any) {
    this.form.push({ attach: val, name: fileName })
    //清空校验
    this.$nextTick(function () {
      this.clearValidate()
      this.$emit('setFrameHeight')
    })
  }
  delFilesData(fileName: string) {
    this.form = this.form.filter((item: any) => item.name !== fileName)
    //清空校验
    this.$nextTick(function () {
      this.clearValidate()
      this.$emit('setFrameHeight')
    })
  }
  clearValidate() {
    const $refs: any = this.$refs[this.moduleKey + 'Ref']
    if (Array.isArray($refs)) {
      $refs.forEach(($ref) => {
        $ref?.clearValidate()
      })
    } else {
      const refEl: any = { ...$refs }
      Object.keys(refEl).includes('clearValidate') && refEl.clearValidate()
    }
  }
  setFrameHeight() {
    this.$emit('setFrameHeight')
  }

  //保存
  async onSubmit() {
    try {
      this.saveLoading = true
      // console.log(this.$refs)
      const refs: any = this.$refs || {}
      let resultArr: any = [] //用来接受返回结果的数组
      for (let key in refs) {
        const ref = { ...refs[key] } || {}
        if (Object.keys(ref).includes('validate')) {
          await ref.validate((valid: any) => {
            if (valid) {
              resultArr.push(true)
            } else {
              resultArr.push(false)
            }
          })
        } else {
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
      }
      //表单验证全部通过后提交
      Promise.all(resultArr)
        .then((values) => {
          // console.log(values)
          if (values.indexOf(false) === -1) {
            this.saveData() // 此时必填完成，做保存后的业务操作
          } else {
            this.saveLoading = false
          }
        })
        .catch((e: any) => {
          console.log(e)
          this.saveLoading = false
        })
    } catch (error: any) {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
        duration: 3 * 1000
      })
      this.saveLoading = false
    }
  }
  //数据提交
  async saveData() {
    // console.log(this.form)
    try {
      let dataStr = {}
      let formData = {}
      formData = {
        [this.moduleKey]: this.form
      }
      for (let key in formData) {
        //对象字段转字符串
        dataStr[key] = JSON.stringify(formData[key])
      }
      const params = {
        jobsId: this.userStore.jobsId,
        userId: this.userStore.userId,
        templateId: this.userStore.templateId,
        data: dataStr
      }
      const res = await api.saveResume(params)
      this.lastForm = JSON.parse(JSON.stringify(this.form))
      //成功提示
      ElMessage({
        showClose: true,
        message: '保存模板成功',
        type: 'success',
        duration: 3 * 1000
      })
      this.formType = 'detail'
      this.saveLoading = false
      //清空校验
      this.$nextTick(function () {
        this.$emit('updateFormByKey', this.form, this.moduleKey)
        this.$emit('setFrameHeight')
      })
      // console.log(res)
    } catch (error: any) {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
        duration: 3 * 1000
      })
      this.saveLoading = false
    }
  }
  revertFormData() {
    this.form = JSON.parse(JSON.stringify(this.lastForm))
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
  .module-card {
    border-top: 1px #cecece solid;
    margin-top: 8px;
    .module-name {
      position: relative;
      font-size: 16px;
      line-height: 2;
      text-align: left;
      .check-box {
        font-size: 14px;
        margin-right: 2px;
      }
      .title-btn {
        float: right;
        margin-top: 5px;
        margin-right: 5px;
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
::v-deep(.el-overlay-dialog) {
  .el-dialog {
    width: 90% !important;
  }
}
</style>
