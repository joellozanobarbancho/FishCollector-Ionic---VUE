<template>
  <div class="screen form-screen">
    <div class="scene-bg welcome-bg"></div>
    <div class="popup-overlay" v-if="showSuccess"></div>
    <div class="catch-popup" v-if="showSuccess">
      Account created successfully!
    </div>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">Username:</label>
      <input class="form-input" type="text" v-model="username" placeholder="Choose a username" />
    </div>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">Email:</label>
      <input class="form-input" type="email" v-model="email" placeholder="Enter email" />
    </div>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">Password:</label>
      <input class="form-input" type="password" v-model="password" placeholder="Choose password" />
    </div>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">Confirm password:</label>
      <input class="form-input" type="password" v-model="confirmPassword" placeholder="Confirm password" />
    </div>
    <button class="btn-main form-submit" style="position: relative; z-index: 2" @click="handleSignup">
      Create Account
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
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showSuccess = ref(false);
let successTimer: ReturnType<typeof setTimeout> | null = null;

function handleSignup() {
  // Simple validation
  if (username.value && email.value && password.value && password.value === confirmPassword.value) {
    if (successTimer) return;
    showSuccess.value = true;
    successTimer = setTimeout(() => {
      showSuccess.value = false;
      successTimer = null;
      router.push('/login');
    }, 1800);
  }
}
</script>

<style scoped>
/* Styles are in global.css */
</style>
