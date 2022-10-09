<template>
  <div>123123</div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
// import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Options({})
export default class MicroApp extends Vue {
  // val = ''
  created() {
    const dataStr: any = this.$route?.params

    console.log(dataStr)
  }
}
</script>
