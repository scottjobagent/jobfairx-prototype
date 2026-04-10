/**
 * App router.
 *
 * Pages that share the sidebar + topbar (DashboardLayout):
 *   /dashboard, /account-billing, /edit-post, /edit-job, /setup-flow
 *
 * Standalone pages (own layout, no sidebar):
 *   /job-posting, /lobby, /share-preview, /troubleshooting
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import AccountBillingPage from '@/pages/AccountBillingPage.vue'
import EditPostPage from '@/pages/EditPostPage.vue'
import EditJobPage from '@/pages/EditJobPage.vue'
import SetupFlowPage from '@/pages/SetupFlowPage.vue'
import JobPostingPage from '@/pages/JobPostingPage.vue'
import LobbyPage from '@/pages/LobbyPage.vue'
import SharePreviewPage from '@/pages/SharePreviewPage.vue'
import TroubleshootingPage from '@/pages/TroubleshootingPage.vue'

const routes: RouteRecordRaw[] = [
  // ── Pages with sidebar + topbar ──
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: DashboardPage },
      { path: 'account-billing', name: 'account-billing', component: AccountBillingPage },
      { path: 'edit-post', name: 'edit-post', component: EditPostPage },
      { path: 'edit-job', name: 'edit-job', component: EditJobPage },
      { path: 'setup-flow', name: 'setup-flow', component: SetupFlowPage },
    ],
  },

  // ── Standalone pages (own layout) ──
  { path: '/job-posting', name: 'job-posting', component: JobPostingPage },
  { path: '/lobby', name: 'lobby', component: LobbyPage },
  { path: '/share-preview', name: 'share-preview', component: SharePreviewPage },
  { path: '/troubleshooting', name: 'troubleshooting', component: TroubleshootingPage },

  // Catch-all redirect
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
