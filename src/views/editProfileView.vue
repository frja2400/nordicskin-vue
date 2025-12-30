<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function saveChanges() {
  router.push('/profil')
}
function deleteAccount() {
  router.push('/login')
}
</script>

<template>
  <h1>Redigera profil</h1>
  <button @click="saveChanges">
    SPARA ÄNDRINGAR
  </button><br>
  <button @click="deleteAccount">
    RADERA KONTO
  </button>
</template>