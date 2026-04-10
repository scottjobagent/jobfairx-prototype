/**
 * App router.
 *
 * Only /lobby is fully implemented in this sample. Other routes render
 * a placeholder so the TopBar nav links don't 404. Add real pages by
 * importing them and replacing the corresponding placeholder route.
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LobbyPage from '@/pages/LobbyPage.vue'
import PlaceholderPage from '@/pages/PlaceholderPage.vue'

const routes: RouteRecordRaw[] = [
  // Land on /lobby by default so the sample page is what dev sees first.
  { path: '/', redirect: '/lobby' },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: PlaceholderPage,
    props: { title: 'Dashboard' },
  },
  {
    path: '/lobby',
    name: 'lobby',
    component: LobbyPage,
  },
  {
    path: '/jobs',
    name: 'jobs',
    component: PlaceholderPage,
    props: { title: 'Jobs' },
  },
  {
    path: '/candidates',
    name: 'candidates',
    component: PlaceholderPage,
    props: { title: 'Candidates' },
  },
  // Catch-all → dashboard placeholder
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
