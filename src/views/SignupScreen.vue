<template>
  <ion-page>
    <ion-content fullscreen class="screen-content ion-no-padding">
      <div class="screen form-screen">
        <div class="scene-bg welcome-bg"></div>
        <div class="popup-overlay" v-if="showSuccess"></div>
        <div class="catch-popup" v-if="showSuccess">
          Account created successfully!
        </div>
        <ion-grid class="form-layout">
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-sm="10" size-md="8" size-lg="6">
              <div class="form-group">
                <label class="form-label">Username:</label>
                <ion-input class="form-input" type="text" v-model="username" placeholder="Choose a username" />
              </div>
              <div class="form-group">
                <label class="form-label">Email:</label>
                <ion-input class="form-input" type="email" v-model="email" placeholder="Enter email" />
              </div>
              <div class="form-group">
                <label class="form-label">Password:</label>
                <ion-input class="form-input" type="password" v-model="password" placeholder="Choose password" />
              </div>
              <div class="form-group">
                <label class="form-label">Confirm password:</label>
                <ion-input class="form-input" type="password" v-model="confirmPassword" placeholder="Confirm password" />
              </div>
              <ion-button class="btn-main form-submit" @click="handleSignup">
                Create Account
              </ion-button>
              <ion-button fill="clear" class="form-link" @click="$router.push('/')">
                ← Back
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton } from '@ionic/vue';

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
