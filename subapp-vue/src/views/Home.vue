<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div>
      <router-link to="/fields">表单字段</router-link>
    </div>
    <div>
      <router-link to="/enroll">模板列表</router-link>
    </div>
    <!-- <input v-model="val" />
    <el-input v-model="val"></el-input> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
// import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Options({
  // components: {
  //   HelloWorld
  // }
})
export default class Home extends Vue {
  val = ''
  created() {
    console.log('Home 组件加载')
  }
}
</script>
<style scoped lang="less">
.home {
  font-size: 18px;
  > div {
    padding: 10px;
  }
}
</style>
