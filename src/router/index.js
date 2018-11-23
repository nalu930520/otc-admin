import Layout from '../views/layout/Layout'
import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/',
    redirect: '/dashboard/index'
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '概览',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '概览', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/wallet',
    component: Layout,
    meta: { title: '钱包', icon: 'dashboard' },
    hidden: true,
    children: [
      {
        path: 'send',
        name: '发送',
        component: () => import('@/views/dashboard/send'),
        meta: { title: '发送', icon: 'dashboard' }
      },
      {
        path: 'recive',
        name: '接收',
        component: () => import('@/views/dashboard/recive'),
        meta: { title: '接收', icon: 'dashboard' }
      },
      {
        path: ':currency',
        name: '钱包',
        component: () => import('@/views/dashboard/walletDetail'),
        meta: { title: '钱包', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/otcTransationManagement',
    name: 'OTC交易管理',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'OTC交易管理', icon: 'example', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'otcTransationManagementList',
        name: 'otcTransationManagementList',
        component: () => import('@/views/otcTransationManagement'),
        meta: { title: 'OTC交易管理', icon: 'table', roles: ['admin', 'editor'] }
      },
      {
        path: 'otcTransationManagementDetail',
        name: 'otcTransationManagementDetail',
        hidden: true,
        component: () => import('@/views/otcTransationManagement/otcDetail'),
        meta: { title: 'OTC交易管理详情', icon: 'table', roles: ['admin', 'editor'] }
      },
      {
        path: 'otcCurrencyPrice',
        name: 'otcCurrencyPrice',
        component: () => import('@/views/otcCurrencyPrice'),
        meta: { title: '价格设置', icon: 'table', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    path: '/bankCardManagement',
    name: '银行卡管理',
    component: Layout,
    redirect: '/bankCardManagement/index',
    meta: { title: '银行卡管理', icon: 'example', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'bankCardManagement',
        name: 'bankCardManagement',
        component: () => import('@/views/bankCardManagement'),
        meta: { title: '银行卡管理', icon: 'table', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: 'noredirect',
    children: [{
      path: 'account',
      component: () => import('@/views/setting/index'),
      name: 'setting',
      meta: { title: '账号设置', icon: 'user' }
    }]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
