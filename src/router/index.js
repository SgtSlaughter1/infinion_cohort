import { createRouter, createWebHistory } from 'vue-router'

import OverviewComp from '@/views/OverviewComp.vue';
import NewCampaign from '@/views/NewCampaign.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'OverviewComp',
      component: OverviewComp
    },
    {
      path: "/NewCampaign",
      name: "NewCampaign",
      component: NewCampaign,
    },
 
  ],
  
})

export default router


