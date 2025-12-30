<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function editProfile() {
  router.push('/redigera-profil')
}

function logout() {
  router.push('/')
}
</script>

<template>
  <h1>Profil</h1>
  <button @click="editProfile">
    REDIGERA
  </button><br>
  <button @click="logout">
    LOGGA UT
  </button>
</template>