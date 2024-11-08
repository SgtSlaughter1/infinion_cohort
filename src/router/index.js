import { createRouter, createWebHistory } from 'vue-router';
import AllCampaign from '/src/views/AllCampaign.vue';
import EditCampaign from '/src/views/EditCampaign.vue';
import ViewCampaign from '@/views/ViewCampaign.vue';
import { createRouter, createWebHistory } from 'vue-router'

import OverviewComp from '@/views/OverviewComp.vue';
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
        path: '/',
        name: 'AllCampaigns',
        component: AllCampaign,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router;

