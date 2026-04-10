/**
 * App router.
 *
 * All pages from the HTML prototype are now converted. Each page maps
 * to the corresponding `.html` file in `Employer-Dashboard/`.
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardPage from '@/pages/DashboardPage.vue'
import LobbyPage from '@/pages/LobbyPage.vue'
import SetupFlowPage from '@/pages/SetupFlowPage.vue'
import EditPostPage from '@/pages/EditPostPage.vue'
import EditJobPage from '@/pages/EditJobPage.vue'
import JobPostingPage from '@/pages/JobPostingPage.vue'
import SharePreviewPage from '@/pages/SharePreviewPage.vue'
import AccountBillingPage from '@/pages/AccountBillingPage.vue'
import TroubleshootingPage from '@/pages/TroubleshootingPage.vue'

const routes: RouteRecordRaw[] = [
  // Land on /dashboard by default — matches the HTML prototype's index.html
  // which redirects to visual.html (the dashboard).
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage },
  { path: '/lobby', name: 'lobby', component: LobbyPage },
  { path: '/setup-flow', name: 'setup-flow', component: SetupFlowPage },
  { path: '/edit-post', name: 'edit-post', component: EditPostPage },
  { path: '/edit-job', name: 'edit-job', component: EditJobPage },
  { path: '/job-posting', name: 'job-posting', component: JobPostingPage },
  { path: '/share-preview', name: 'share-preview', component: SharePreviewPage },
  { path: '/account-billing', name: 'account-billing', component: AccountBillingPage },
  { path: '/troubleshooting', name: 'troubleshooting', component: TroubleshootingPage },
  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
