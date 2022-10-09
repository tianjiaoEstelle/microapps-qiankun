import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const _import = (file: any) => require('@/views/' + file + '.vue').default // vue-loader at least v13.0.0+

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => _import('Home')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => _import('About')
  },
  {
    path: '/fields/:data?',
    name: 'Fields',
    component: () => _import('fields/index')
  },
  {
    path: '/enroll',
    component: () => _import('enroll/index'),
    children: [
      {
        path: '',
        name: 'Enroll',
        component: () => _import('enroll/EnrollList')
      },
      {
        path: 'list/:data?',
        name: 'EnrollList',
        component: () => _import('enroll/EnrollList')
      },
      {
        path: 'form',
        name: 'EnrollForm',
        component: () => _import('enroll/EnrollForm')
      },

      {
        path: 'tempalte',
        name: 'EnrollTemplate',
        component: () => _import('enroll/EnrollTemplate')
      },
      // {
      //   path: 'preview/:type',
      //   name: 'EnrollPreview',
      //   component: () => _import('enroll/EnrollPreview')
      // },
      {
        path: 'preview/:data?',
        name: 'EnrollPreview',
        component: () => _import('enroll/Resume')
      },
      {
        path: 'dragFields',
        name: 'DragFields',
        component: () => _import('enroll/DragFields')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
