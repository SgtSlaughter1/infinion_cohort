import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './App.vue'
import router from './router'
import LandingPage from './views/LandingPage.vue'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

const app = createApp(LandingPage)

app.use(createPinia())
app.use(router)

app.mount('#app')
