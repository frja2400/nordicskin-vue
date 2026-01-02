import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import loginView from '../views/loginView.vue'
import registerView from '../views/registerView.vue'
import dashboardView from '../views/dashboardView.vue'
import profileView from '../views/profileView.vue'
import productListView from '../views/productListView.vue'
import editProfileView from '../views/editProfileView.vue'
import editProductView from '../views/editProductView.vue'
import productInfoView from '../views/productInfoView.vue'
import addProductView from '../views/addProductView.vue'

const routes = [
  { path: '/', redirect: '/logga-in' },  // redirect till login först
  { path: '/logga-in', component: loginView },
  { path: '/registera-konto', component: registerView },
  { path: '/dashboard', component: dashboardView },
  { path: '/profil', component: profileView },
  { path: '/produktlista', component: productListView },
  { path: '/redigera-profil', component: editProfileView },
  { path: '/produkter/:id/redigera', component: editProductView },
  { path: '/produkter/:id', component: productInfoView },
  { path: '/skapa-produkt', component: addProductView }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// Navigation guard för att skydda routes
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Lista med öppna routes (login och register)
  const publicPages = ['/logga-in', '/registera-konto']
  const authRequired = !publicPages.includes(to.path)

  // Om sidan är publik, släpp igenom direkt
  if (!authRequired) {
    return next()
  }

  // Om vi inte vet auth-status ännu, fråga backend
  if (!auth.isAuthenticated) {
    try {
      const res = await fetch('https://nordicskin-restapi.onrender.com/api/me', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        auth.setUser(data)
        next() // fortsätt till önskad route
      } else {
        next('/logga-in') // inte inloggad
      }
    } catch (err) {
      next('/logga-in') // fel, skicka till login
    }
  } else {
    next() // allting är ok, fortsätt
  }
})

export default router
