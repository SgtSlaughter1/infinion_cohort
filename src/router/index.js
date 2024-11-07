import { createRouter, createWebHistory } from 'vue-router'

import OverviewComp from '@/views/OverviewComp.vue';
import NewCampaign from '@/views/NewCampaign.vue'


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
      name: 'OverviewComp',
      component: OverviewComp

      name: 'landingPage',
      component: LandingPage     

    },
    
    {

      path: "/NewCampaign",
      name: "NewCampaign",
      component: NewCampaign,
    },

    {

      path: '/overview',
      name: 'Overview',
      component: Overview
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


