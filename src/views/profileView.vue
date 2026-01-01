<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const logout = async () => {
  await fetch('https://nordicskin-restapi.onrender.com/api/logout', {
    method: 'POST',
    credentials: 'include'
  })

  auth.logout()
  router.push('/logga-in')
}
</script>

<template>
  <button @click="logout">Logga ut</button>
</template>