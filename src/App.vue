<script setup>
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'

const auth = useAuthStore()
</script>

<template>
  <!-- Navbar visas bara om användaren är inloggad -->
  <Navbar v-if="auth.isAuthenticated" />
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
