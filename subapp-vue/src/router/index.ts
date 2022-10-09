import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// const _import = (file: any) => require('@/views/' + file + '.vue').default // vue-loader at least v13.0.0+
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/fields/:data?',
    name: 'Fields',
    component: () => import('../views/fields/index.vue'),
  },
  {
    path: '/enroll',
    component: () => import('../views/enroll/index.vue'),
    children: [
      {
        path: '',
        name: 'Enroll',
        component: () => import('../components/enroll/enroll-list.vue'),
      },
      {
        path: 'list/:data?',
        name: 'EnrollList',
        component: () => import('../components/enroll/enroll-list.vue'),
      },
      {
        path: 'list/default/:data?',
        name: 'EnrollDefaultList',
        component: () => import('../components/enroll/enroll-default-list.vue'),
      },
      {
        path: 'form',
        name: 'EnrollForm',
        component: () => import('../components/enroll/enroll-form.vue'),
      },

      {
        path: 'tempalte',
        name: 'EnrollTemplate',
        component: () => import('../components/enroll/enroll-template.vue'),
      },
      {
        path: 'preview/:data?',
        name: 'EnrollPreview',
        component: () => import('../components/enroll/resume.vue'),
      },
      {
        path: 'dragFields',
        name: 'DragFields',
        component: () => import('../components/enroll/drag-fields.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/micro_vue',
  },

  //匹配到 micro_vue或micro_react 放入this.$route.params.micro内
  // 匹配到 后面的放到this.$route.params.endPath 内
  // 例如 http://localhost:10000/micro_vue/list/aaa
  // 捕获到的：
  // this.$route?.params = {c
  //   endPath: "/list/aaa"
  //   micro: "micro_vue"
  // }
  // {
  //   path: '/:micro(micro_vue|micro_react):endPath(.*)',
  //   name: 'MicroApp',
  //   meta: { title: '微前端应用' },
  //   component: () => import('../views/MicroApp.vue'),
  // },
]
console.log('process.env.BASE_URL', process.env.BASE_URL)
const router = createRouter({
  history: createWebHistory('/micro_vue'),
  routes,
})

export default router
