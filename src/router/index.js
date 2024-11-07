import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignUp from '@/views/SignUp.vue'
import Overview from '@/views/Overview.vue'
import NewCampaign from '@/views/NewCampaign.vue'
import Campaign from '@/views/Campaign.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landingPage',
      component: LandingPage
    },

    {
      path: '/login',
      name: 'loginPage',
      component: LoginPage
    },

    {
      path: '/SignUp',
      name: 'SignUp',
      component: SignUp
    },
    {

      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashBoard.vue'),
      children: [
        {
          path: 'new-campaign',
          name: 'new-campaign',
          component: () => import('../views/NewCampaign.vue')
        },
        {
          path: 'overview',
          name: 'OverviewComp',
          component: () => import('../views/OverviewComp.vue')
        },

        {
          path: 'market-intelligence',
          name: 'market-intelligence',
          component: () => import('../views/MarketIntelligence.vue')
        },
      ]
    },
  ]

})

export default router


