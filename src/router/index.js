import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignUp from '@/views/SignUp.vue'

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
    }
  ]
})

export default router
