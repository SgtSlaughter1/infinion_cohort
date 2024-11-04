import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Dashboard from '@/Dashboard.vue'
import Overview from '@/views/Overview.vue'
import NewCampaign from '@/views/NewCampaign.vue'
import Campaign from '@/views/Campaign.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Overview',
      component: Overview
    },
    {
      path: '/newcampaign',
      name: 'newcampaign',
  
      component: NewCampaign
    },
    {
      path: '/campaign',
      name: 'campaign',
  
      component: Campaign
    }
  ]
})

export default router
