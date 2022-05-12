import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import SettingsView from '../views/SettingsView.vue';
import RecordView from '../views/RecordView.vue';
import ProjectView from '../views/ProjectView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/records',
    name: 'records',
    component: RecordView
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectView
  }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
