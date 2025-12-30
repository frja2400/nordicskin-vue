import { createRouter, createWebHistory } from 'vue-router'
import loginView from '../views/loginView.vue'
import registerView from '../views/registerView.vue'
import dashboardView from '../views/dashboardView.vue'
import profileView from '../views/profileView.vue'
import productListView from '../views/productListView.vue'
import editProfileView from '../views/editProfileView.vue'

const routes = [
  { path: '/', redirect: '/login' },  // redirect till login först
  { path: '/login', component: loginView },
  { path: '/register', component: registerView },
  { path: '/dashboard', component: dashboardView },
  { path: '/profil', component: profileView },
  { path: '/produktlista', component: productListView },
  { path: '/redigera-profil', component: editProfileView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
