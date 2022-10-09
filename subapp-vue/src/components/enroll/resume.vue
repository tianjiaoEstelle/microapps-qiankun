<!-- 简历模板预览 -->
<template>
  <el-container>
    <el-header id="headerDom" :class="{ isFixed: isFixed }"
      ><div class="top-title">
        <el-icon
          v-if="pageType === 'preview'"
          class="back-arr"
          title="返回"
          @click="goBack"
          ><ArrowLeftBold /></el-icon
        >{{ userStore.templateName }} {{ pageTitle }}
        <el-button
          v-if="pageType === 'edit'"
          class="title-btn"
          @click="goToList"
          >返回</el-button
        >
        <el-button
          v-if="pageSource === 'jobApply' && pageType === 'detail'"
          class="title-btn red-btn"
          type="primary"
          :loading="applyLoading"
          @click="onConfirm"
          >申请岗位</el-button
        >
        <el-button
          v-if="reapply !== ''"
          class="title-btn red-btn"
          type="primary"
          :loading="applyLoading"
          @click="onConfirm"
          >重新申请岗位</el-button
        >
      </div>
    </el-header>
    <el-container
      :class="[
        'preview-container',
        {
          'preview-scroll':
            pageType === 'preview' || pageType === 'companyDetail',
        },
      ]"
    >
      <resume-form-container
        :jobsName="jobsName"
        @updateForm="updateForm"
        @revertFormDataFunc="revertFormDataFunc"
      ></resume-form-container>
    </el-container>
  </el-container>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { api } from '@/utils/api'
import { useUserstore, userType } from '@/store/user'
import { ElMessage } from 'element-plus'
import ResumeFormContainer from '@/components/enroll/resume-form-container.vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'

interface DataType {
  data?: string
}

@Options({
  name: 'Resume',
  components: {
    ResumeFormContainer,
  },
})
export default class Resume extends Vue {
  userStore = useUserstore()
  //preview 预览  edit 编辑  空 详情
  pageTitle: string = ''
  get pageType() {
    return this.userStore.pageType
  }
  get pageSource() {
    return this.userStore.pageSource
  }
  applyLoading = false
  isFixed = false
  form = {}
  jobsName = ''
  reapply = '' //重新提交

  revertFormData: Function | null = null
  revertFormDataFunc(func: Function) {
    this.revertFormData = func
  }
  onSubmit: Function | null = null
  onSubmitFunc(func: Function) {
    this.onSubmit = func
  }

  updateForm(form: object) {
    this.form = form
  }
  goBack() {
    this.$router.go(-1)
  }
  goToList() {
    if (this.pageType === 'edit') {
      this.userStore.updatePageType('detail')
      //重置数据，用于返回，不保存修改
      this.revertFormData !== null && this.revertFormData()
    } else {
      this.$router.push({
        path: '/enroll',
      })
    }
  }
  //监听滚动，吸顶
  listenScroll() {
    const proxy = this
    window.addEventListener('scroll', function () {
      const header: HTMLDivElement | null = document.querySelector('#headerDom')
      const offsetTop = header?.offsetTop || 0
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
  //确认申请岗位
  async onConfirm() {
    try {
      this.applyLoading = true
      let dataStr = {}
      for (let key in this.form) {
        //对象字段转字符串
        dataStr[key] = JSON.stringify(this.form[key])
      }
      let params = {
        jobsId: this.userStore.jobsId,
        userId: this.userStore.userId,
        data: dataStr,
        // isReapply: this.reapply === '' ? 0 : 1
      }
      if (this.userStore.did) {
        params['did'] = this.userStore.did
      }
      await api.applyResume(params)
      //成功提示
      ElMessage({
        showClose: true,
        message: '申请岗位成功',
        type: 'success',
        duration: 3 * 1000,
      })
      this.applyLoading = false
      if (this.userStore.did) {
        setTimeout(function () {
          window.parent.postMessage({ refresh: '' }, '*')
        }, 200)
      }
    } catch (error: any) {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
        duration: 3 * 1000,
      })
      this.applyLoading = false
    }
  }
  created() {
    this.listenScroll() //监听滚动，吸顶
    // console.log(this.$route?.params)
    const route: RouteLocationNormalizedLoaded = this.$route
    const params: DataType = route?.params || {}
    const dataStr: string = params?.data || ''
    let pageType: string = 'detail'
    if (dataStr !== '') {
      const dataList = dataStr.split('-')
      const len = dataList.length
      pageType = (len >= 1 && dataList[0]) || ''
      const userId = (len >= 2 && dataList[1]) || ''
      const jobsId = (len >= 3 && dataList[2]) || ''
      const resumeTemplateId = (len >= 4 && dataList[3]) || ''
      const did = (len >= 5 && dataList[4]) || ''
      this.jobsName = (len >= 6 && dataList[5]) || ''
      this.reapply = (len >= 7 && dataList[6]) || ''
      let params: userType = {
        userId,
        did,
        jobsId,
      }
      if (resumeTemplateId) {
        params['templateId'] = resumeTemplateId
        this.userStore.updatePageSource('jobApply') //标注当前是从岗位申请页面跳过来的
      }

      this.userStore.updateUserData(params)
    }

    this.userStore.updatePageType(pageType)
    if (pageType === 'preview') {
      this.pageTitle = '简历模板预览'
    } else if (pageType === 'edit') {
      this.pageTitle = '简历编辑'
    } else {
      if (this.pageSource === 'jobApply') {
        this.pageTitle = '岗位简历'
      } else if (pageType === 'companyDetail') {
        this.pageTitle = '个人简历'
      } else {
        this.pageTitle = '我的简历'
      }
    }
  }
}
</script>
<style scoped lang="less">
.isFixed {
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  background-color: #ffffff;
}
.title-btn {
  float: right;
  margin-right: 10px;
  position: relative;
  top: -4px;
}
.red-btn {
  background: #9b0000;
  border-color: #9b0000;
  &:hover {
    background: #c56363;
    border-color: #c56363;
  }
}
.preview-scroll {
  // height: 100%;
  overflow-y: auto;
}

// .preview-container {
//   overflow-y: auto;
// }
</style>
