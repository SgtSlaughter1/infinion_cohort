import { createRouter, createWebHistory } from "vue-router";
import EditCampaign from "/src/views/EditCampaign.vue";
import ViewCampaign from "@/views/ViewCampaign.vue";
import LandingPage from "@/views/LandingPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import SignUp from "@/views/SignUp.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landingPage",
      component: LandingPage,
    },
    {
      path: "/login",
      name: "loginPage",
      component: LoginPage,
    },

    {
      path: '/edit-campaign/:id',
      name: 'EditCampaign',
      component: EditCampaign,
      props: true
  },
  {
      path: '/view-campaign/:id',
      name: 'ViewCampaign',
      component: ViewCampaign,
      props: true
  },

    {
      path: "/SignUp",
      name: "SignUp",
      component: SignUp,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashBoard.vue"),
      children: [
        {
          path: "new-campaign",
          name: "new-campaign",
          component: () => import("../views/NewCampaign.vue"),
        },
        {
          path: "overview",
          name: "Overview",
          component: () => import("../views/OverviewComp.vue"),
        },
        {
          path: "all-campaign",
          name: "AllCampaigns",
          component: () => import("../views/AllCampaign.vue"),
        },

        {
          path: "market-intelligence",
          name: "market-intelligence",
          component: () => import("../views/MarketIntelligence.vue"),
        },
        {
          path: "account-settings",
          name: "account-settings",
          component: () => import("../views/AccountSettings.vue"),
        },
      ],
    },
  ],
});

export default router;
