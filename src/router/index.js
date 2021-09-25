import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/equipment',
    children: [{
      path: 'equipment',
      name: 'Equipment',
      component: () => import('@/views/equipment/index'),
      meta: { title: '设备管理', icon: 'dashboard' }
    }]
  },

  {
    path: '/beautyHead',
    component: Layout,
    children: [{
      path: '',
      name: 'BeautyHead',
      component: () => import('@/views/beautyHead/index'),
      meta: { title: '美容头端管理', icon: 'beautyHead' }
    }]
  },

  {
    path: '/professional',
    name: 'Professional',
    component: Layout,
    children: [{
      path: '',
      name: 'Professional',
      component: () => import('@/views/professional/index'),
      meta: { title: '专业人士管理', icon: 'professional' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
