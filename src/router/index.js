import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import EditCampaign from '@/views/EditCampaign.vue'
import NewCampaign from '@/views/NewCampaign.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "newCampaign",
      component: NewCampaign,
    },
    // {
    //   path: "/campaign/:id/edit",
    //   name: "editCampaign",
    //   component: () => import("@/views/EditCampaign.vue"),
    // },
  ],
});

export default router
