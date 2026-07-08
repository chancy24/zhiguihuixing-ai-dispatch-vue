import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AgentAssistantView from '@/views/AgentAssistantView.vue'
import DashboardView from '@/views/DashboardView.vue'
import DutySegmentsView from '@/views/DutySegmentsView.vue'
import EmergencyRescheduleView from '@/views/EmergencyRescheduleView.vue'
import FatigueRiskView from '@/views/FatigueRiskView.vue'
import LineManagementView from '@/views/LineManagementView.vue'
import LoginView from '@/views/LoginView.vue'
import OpcView from '@/views/OpcView.vue'
import PresentationModeView from '@/views/PresentationModeView.vue'
import ReportView from '@/views/ReportView.vue'
import ScheduleOptimizerView from '@/views/ScheduleOptimizerView.vue'
import TimetableView from '@/views/TimetableView.vue'
import WorkflowView from '@/views/WorkflowView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/app',
      component: AppLayout,
      redirect: '/app/dashboard',
      children: [
        { path: 'dashboard', name: 'dashboard', component: DashboardView },
        { path: 'workflow', name: 'workflow', component: WorkflowView },
        { path: 'lines', name: 'lines', component: LineManagementView },
        { path: 'timetable', name: 'timetable', component: TimetableView },
        { path: 'segments', name: 'segments', component: DutySegmentsView },
        { path: 'optimizer', name: 'optimizer', component: ScheduleOptimizerView },
        { path: 'emergency', name: 'emergency', component: EmergencyRescheduleView },
        { path: 'fatigue', name: 'fatigue', component: FatigueRiskView },
        { path: 'agent', name: 'agent', component: AgentAssistantView },
        { path: 'report', name: 'report', component: ReportView },
        { path: 'opc', name: 'opc', component: OpcView },
        { path: 'presentation', name: 'presentation', component: PresentationModeView }
      ]
    }
  ]
})

export default router
