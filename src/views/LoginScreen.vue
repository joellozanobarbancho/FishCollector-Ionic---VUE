<template>
  <div class="screen form-screen">
    <div class="scene-bg welcome-bg"></div>
    <p class="form-title welcome-title-sm" style="position: relative; z-index: 2">LOG IN</p>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">Username:</label>
      <input class="form-input" type="text" v-model="username" placeholder="Enter username" />
    </div>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">Password:</label>
      <input class="form-input" type="password" v-model="password" placeholder="Enter password" />
    </div>
    <button class="btn-main form-submit" style="position: relative; z-index: 2" @click="handleLogin">
      Log In
    </button>
    <button class="form-link" style="position: relative; z-index: 2" @click="$router.push('/')">
      ← Back
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

function handleLogin() {
  // Simple validation and redirect to game
  if (username.value && password.value) {
    router.push('/game');
  }
}
</script>

<style scoped>
/* Styles are in global.css */
</style>
