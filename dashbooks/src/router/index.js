import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HelpView from '../views/HelpView.vue';
import SettingsView from '../views/SettingsView.vue';
import RecordView from '../views/RecordView.vue';
import ProjectView from '../views/ProjectView.vue';
import InvoiceView from '../views/InvoiceView.vue';
import TimeSheetView from '../views/TimeSheetView.vue';
import BudgetView from '../views/BudgetView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/help',
    name: 'help',
    component: HelpView
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
  },
  {
    path: '/invoice',
    name: 'invoice',
    component: InvoiceView
  },
  {
    path: '/timesheet',
    name: 'timesheet',
    component: TimeSheetView
  },
  {
    path: '/budget',
    name: 'budget',
    component: BudgetView
  }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
