<template>
  <div class="screen form-screen">
    <div class="scene-bg welcome-bg"></div>
    <p class="form-title" style="position: relative; z-index: 2">SIGN IN</p>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">USERNAME</label>
      <input class="form-input" type="text" v-model="username" placeholder="Choose a username" />
    </div>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">EMAIL</label>
      <input class="form-input" type="email" v-model="email" placeholder="Enter email" />
    </div>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">PASSWORD</label>
      <input class="form-input" type="password" v-model="password" placeholder="Choose password" />
    </div>
    <div class="form-group" style="position: relative; z-index: 2">
      <label class="form-label">CONFIRM PASSWORD</label>
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

function handleSignup() {
  // Simple validation
  if (username.value && email.value && password.value && password.value === confirmPassword.value) {
    router.push('/game');
  }
}
</script>

<style scoped>
/* Styles are in global.css */
</style>
