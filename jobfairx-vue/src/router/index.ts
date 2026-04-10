/**
 * App router.
 *
 * Only the dashboard is wired up for the Phase 1 rebuild (per developer
 * feedback: get sidebar + topbar + dashboard 1:1 with visual.html, then do
 * the rest). Interviews and Messaging become their own routes later.
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: DashboardPage },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
