<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function createProfile() {
  router.push('/dashboard')
}
</script>

<template>
  <h1>Skapa adminkonto</h1>
  <button @click="createProfile">
    SKAPA KONTO
  </button>
</template>