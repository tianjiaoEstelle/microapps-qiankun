<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <!-- <div>123{{ new Date() }}</div> -->
  <router-view />
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { useUserstore, userType } from '@/store/user'

import { api } from '@/utils/api'

@Options({
  name: 'App',
})
export default class App extends Vue {
  userStore = useUserstore()
  //控件字典项
  async getUIType() {
    const res: any = await api.getDictKey({ dictKeys: 'uiType' })
    const data: any = res.data || []
    this.userStore.updateUIType(data)
  }
  mounted() {
    this.getUIType()
  }
}
</script>
<style lang="less">
@import './styles/index.less';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
