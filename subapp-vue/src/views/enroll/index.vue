<!-- 报名模板 -->
<template>
  <div class="common-layout">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  name: 'EnrollIndex'
})
export default class EnrollIndex extends Vue {}
</script>

<style scoped lang="less">
.common-layout {
  height: 100vh;
  display: flex;
  ::v-deep(.el-header) {
    height: fit-content;
    box-shadow: 2px 2px 5px #e5e5e5;
    z-index: 1;
    .top-title {
      text-align: left;
      font-size: 18px;
      padding: 10px 0;
    }
  }
}
</style>
<style lang="less">
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
