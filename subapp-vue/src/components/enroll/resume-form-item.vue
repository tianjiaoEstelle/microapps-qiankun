<template>
  <div class="f-item" v-if="formType === 'detail' && pageType !== 'preview'">
    <span v-if="field.uiType === 'datePeriod'" class="inline-span">{{
      Array.isArray(form[fKey]) ? form[fKey].join(' ~ ') : form[fKey]
    }}</span>
    <pre class="block-pre" v-else-if="field.uiType === 'textarea'">{{
      form[fKey]
    }}</pre>
    <span v-else-if="field.uiType === 'img'" class="inline-span">
      <avatar v-if="field.key === 'avatar'" :data="form[fKey]" mod="detail" />

      <pictures
        v-else
        :data="form"
        :mod="formType"
        @setPicturesData="setPicturesData"
        @delPicturesData="delPicturesData"
      />
    </span>
    <span v-else class="inline-span">
      <span v-if="fKey === 'birthday'"
        >{{ form[fKey] }}{{ ageNum !== '' ? '(' + ageNum + '岁)' : '' }}</span
      >
      <span v-else>{{ form[fKey] }}</span>
    </span>
  </div>
  <div class="f-item" v-else>
    <!-- string 文本框 -->
    <el-input
      v-if="field.uiType === 'string'"
      v-model="form[fKey]"
      :placeholder="field.placeholder"
      class="w-200"
      @click="inputClick"
    ></el-input>
    <!-- textarea 多行文本框 -->
    <el-input
      v-if="field.uiType === 'textarea'"
      class="w-textarea resume-area"
      v-model="form[fKey]"
      :placeholder="field.placeholder"
      type="textarea"
    ></el-input>
    <!-- number 数字输入框 -->
    <div v-if="field.uiType === 'number'" class="mw-187">
      <el-input-number
        v-model="form[fKey]"
        step-strictly
        controls-position="right"
        :step="1"
        :min="0"
        class="w-100"
      ></el-input-number>
    </div>
    <!-- radio 单选框 -->
    <el-radio-group
      class="mw-200"
      v-if="field.uiType === 'radio'"
      v-model="form[fKey]"
    >
      <el-radio
        v-for="opt in dictMap[field.id]"
        :key="opt.id"
        :value="opt.itemLabel"
        :label="opt.itemLabel"
        >{{ opt.itemLabel }}</el-radio
      >
    </el-radio-group>
    <!-- checkbox 多选框 -->
    <div class="mw-200" v-if="field.uiType === 'checkbox'">
      <el-checkbox-group v-model="form[fKey]">
        <el-checkbox
          v-for="opt in dictMap[field.id]"
          :key="opt.id"
          :label="opt.itemLabel"
        />
      </el-checkbox-group>
    </div>
    <!-- select 下拉框 -->
    <el-select
      v-if="field.uiType === 'select'"
      v-model="form[fKey]"
      :placeholder="field.placeholder"
      class="w-200"
    >
      <el-option
        v-for="opt in dictMap[field.id]"
        :key="opt.id"
        :label="opt.itemLabel"
        :value="opt.itemLabel"
      />
    </el-select>
    <!-- year 年度框 -->
    <el-date-picker
      v-if="field.uiType === 'year'"
      v-model="form[fKey]"
      type="year"
      value-format="YYYY"
      :placeholder="field.placeholder"
      :disabledDate="disabledYearFun"
    />
    <!-- date 日期框 -->
    <el-date-picker
      v-if="field.uiType === 'date'"
      v-model="form[fKey]"
      type="date"
      value-format="YYYY-MM-DD"
      :placeholder="field.placeholder"
    />
    <!-- date 日期范围框 -->
    <div v-if="field.uiType === 'datePeriod'">
      <el-date-picker
        v-model="form[fKey][0]"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="开始日期"
        :disabled-date="disabledStartDate"
      />
      <span class="sep">至</span>
      <el-date-picker
        v-model="form[fKey][1]"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="结束日期"
        popper-class="customePopper"
        :disabled-date="disabledEndDate"
        :disabled="isToday"
      />

      <el-checkbox
        class="toToday"
        :checked="isToday"
        label="至今"
        @change="checkChange"
      />
    </div>

    <!-- Switch 开关 -->
    <el-switch
      v-if="field.uiType === 'switch'"
      v-model="form[fKey]"
      active-text="是"
      inactive-text="否"
      class="mw-200"
    />
    <!-- img 图片- 头像 -->
    <div v-if="field.uiType === 'img'">
      <avatar
        v-if="field.key === 'avatar'"
        :data="form[fKey]"
        mod="edit"
        @setData="setData"
      />
      <pictures
        v-else
        :data="form"
        mod="edit"
        :fKey="fKey"
        @setPicturesData="setPicturesData"
        @delPicturesData="delPicturesData"
      />
    </div>
    <Files
      v-if="field.uiType === 'file'"
      :data="form"
      mod="edit"
      :fKey="fKey"
      @setFilesData="setFilesData"
      @delFilesData="delFilesData"
    />
    <!-- tips 仅在文本框和多行文本框增加 -->
    <div
      class="fix-tip"
      v-if="
        (field.uiType === 'string' || field.uiType === 'textarea') && field.tips
      "
    >
      <el-tooltip effect="dark" placement="top">
        <template #content>
          <div style="max-width: 200px">{{ field.tips }}</div>
        </template>
        <el-icon class="field-check-box orange">
          <WarningFilled />
        </el-icon>
      </el-tooltip>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component'
import dayjs from 'dayjs'
import Avatar from './upload/avatar.vue'
import Pictures from './upload/pictures.vue'
import Files from './upload/files.vue'
class Props {
  field = prop<any>({
    required: true,
  })
  form = prop<any>({
    required: true,
    default: {},
  })
  fKey = prop<any>({
    required: true,
  })

  dictMap = prop<any>({
    required: true,
  })
  formType = prop<any>({
    required: true,
  })
  pageType = prop<any>({
    required: true,
  })
}
@Options({
  name: 'ResumeFormItem',
  components: {
    Avatar,
    Pictures,
    Files,
  },
  watch: {
    formType(val) {
      if (val === 'edit') {
        if (
          this.field.uiType === 'datePeriod' &&
          this.form[this.fKey][1] === '至今'
        ) {
          this.isToday = true
        }
      }
    },
  },
})
export default class ResumeFormItem extends Vue.with(Props) {
  //年龄
  get ageNum() {
    if (this.fKey === 'birthday') {
      return this.calcAge()
    }
    return ''
  }
  //至今checkbox
  isToday = false
  checkChange(checked: boolean) {
    if (checked) {
      this.form[this.fKey][1] = '至今'
    } else {
      this.form[this.fKey][1] = null
    }
    this.isToday = checked
  }
  inputClick(e: Event) {
    const target = e.target as HTMLInputElement
    target.focus()
  }
  setData(val: string) {
    this.form[this.fKey] = val
  }

  //根据身份证号码计算年龄
  calcAge() {
    const birthday: string = this.form['birthday'] || ''
    if (birthday) {
      const date1 = dayjs(birthday)
      const date2 = dayjs()
      let diff = date2.diff(date1, 'year')
      // console.log(diff)
      return diff
    } else {
      const iNoStr = this.form['identifiedNo'] || ''
      if (iNoStr && iNoStr.length > 12) {
        const birthYear = iNoStr.substring(6, 14)
        const date1 = dayjs(birthYear)
        const date2 = dayjs()
        let diff = date2.diff(date1, 'year')
        // console.log(diff)
        return diff
      }
      return ''
    }
  }
  setPicturesData(val: any) {
    this.form.push({ picture: val })
    //清空校验
    this.$nextTick(function () {
      this.$emit('setFrameHeight')
    })
  }
  delPicturesData(val: any) {
    this.form = this.form.filter((item: any) => item.picture !== val)
    //清空校验
    this.$nextTick(function () {
      this.$emit('setFrameHeight')
    })
  }

  setFilesData(fileName: string, val: any) {
    this.form.push({ attach: val, name: fileName })
    //清空校验
    this.$nextTick(function () {
      this.$emit('setFrameHeight')
    })
  }
  delFilesData(fileName: string) {
    this.form = this.form.filter((item: any) => item.name !== fileName)
    //清空校验
    this.$nextTick(function () {
      this.$emit('setFrameHeight')
    })
  }
  //年份隐藏大于当前年份的
  disabledYearFun(time: Date) {
    const today: string = dayjs().format('YYYY')
    const day: string = dayjs(time).format('YYYY')
    return today < day
  }
  //开始日期隐藏大于今天的
  disabledStartDate(time: Date) {
    return time.getTime() > Date.now()
  }
  //结束日期隐藏大于今天的，小于开始日期的
  disabledEndDate(time: Date) {
    const startTime = this.form[this.fKey][0]
    if (startTime === '' || startTime === undefined) {
      return false
    }
    const startTmps = dayjs(this.form[this.fKey][0]).valueOf()
    return time.getTime() < startTmps || time.getTime() > Date.now()
  }
}
</script>
<style lang="less" scoped>
.f-item {
  position: relative;
  .w-100 {
    width: 100px;
  }
  .w-200 {
    width: 200px;
  }
  .mw-200 {
    min-width: 200px;
  }
  .mw-187 {
    min-width: 187px;
  }
  .w-400 {
    width: 400px;
  }
  .resume-area {
    ::v-deep(.el-textarea__inner) {
      min-height: 120px !important;
    }
  }
  @media screen and (max-width: 1080px) {
    .w-textarea {
      width: 780px;
    }
    .block-pre {
      width: 780px;
    }
  }
  @media screen and (min-width: 1081px) {
    .w-textarea {
      width: 850px;
    }
    .block-pre {
      width: 850px;
    }
  }

  ::v-deep(.el-upload-list__item-name) {
    min-width: 200px !important;
  }
  ::v-deep(.el-date-editor--daterange) {
    width: 300px !important;
  }
  ::v-deep(.el-date-editor) {
    width: 200px !important;
  }
  .fix-tip {
    display: inline-block;
    position: absolute;
    right: -22px;
    color: #ff6600;
    font-size: 16px;
    top: 3px;
    &:hover {
      cursor: pointer;
    }
  }

  .inline-span {
    display: inline-block;
    min-width: 120px;
  }
}
.sep {
  padding: 0 8px;
}
.toToday {
  margin-left: 10px;
}
</style>
<style>
.el-upload-dragger {
  padding: 0;
}
.el-upload-dragger .el-icon {
  margin-top: 20px;
}
.el-upload-dragger .el-upload__text {
  margin-bottom: 20px;
}
.form-upload {
  height: 200px;
}
.img-upload .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.img-upload .el-upload:hover {
  border-color: var(--el-color-primary);
}

.customePopper .el-picker-panel [slot='sidebar'] + .el-picker-panel__body,
.customePopper .el-picker-panel__sidebar + .el-picker-panel__body {
  margin-left: 0;
  margin-bottom: 30px;
}
.customePopper .el-picker-panel [slot='sidebar'],
.customePopper .el-picker-panel__sidebar {
  top: unset;
  left: 0;
  right: 0;
  border-right: none;
  width: unset;
  padding: 0;
}
.customePopper .el-picker-panel__sidebar .el-picker-panel__shortcut {
  text-align: center;
  padding: 0;
  line-height: 50px;
}
.customePopper .el-date-picker.has-sidebar {
  width: unset;
}
</style>
