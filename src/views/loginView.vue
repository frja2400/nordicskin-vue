<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function login() {
  router.push('/dashboard')
}

function register() {
  router.push('/register')
}
</script>

<template>
  <h1>Logga in</h1>
  <button @click="login">
    LOGGA IN
  </button><br>
  <button @click="register">
    REGISTRERA DIG
  </button>
</template>