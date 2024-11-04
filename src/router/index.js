import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import EditCampaign from '@/views/EditCampaign.vue'
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
    // {
    //   path: "/EditCampaign",
    //   name: "EditCampaign",
    //   component: EditCampaign,
    // },
  ],
  
})

export default router


