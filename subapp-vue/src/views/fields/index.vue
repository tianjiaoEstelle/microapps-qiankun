<!-- 表单字段模块 -->
<template>
  <div class="common-layout">
    <el-container>
      <el-header
        ><div class="top-title">
          <el-icon class="back-arr" title="返回" @click="goBack"
            ><ArrowLeftBold /></el-icon
          >{{ userStore.companyId === '' ? '默认' : '' }}字段配置
        </div>
      </el-header>
      <el-container>
        <!-- 左侧边栏 -->
        <el-aside class="common-aside" width="220px">
          <FieldsTree edit="true" @activeTab="activeTab" />
        </el-aside>
        <!-- 内容 -->
        <el-main>
          <FieldsTable :activeId="activeId" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FieldsTable from '@/components/fields/fields-table.vue'
import FieldsTree from '@/components/fields/fields-tree.vue'
import { useUserstore } from '@/store/user'

@Options({
  name: 'FormIndex',
  components: {
    FieldsTable,
    FieldsTree
  }
})
export default class FormIndex extends Vue {
  activeId = ''
  backUrl = ''
  userStore = useUserstore()
  activeTab(val: any) {
    this.activeId = val
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
        isDefault
      })
    }
  }
}
</script>

<style scoped lang="less">
.common-layout {
  height: 100vh;
  display: flex;
  ::v-deep(.el-header) {
    height: inherit;
    box-shadow: 2px 2px 5px #e5e5e5;
    z-index: 1;
    .top-title {
      text-align: left;
      font-size: 18px;
      padding: 10px 0;
    }
  }
  ::v-deep(.el-aside) {
    border-right: solid 1px var(--el-menu-border-color);
  }
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
</style>
