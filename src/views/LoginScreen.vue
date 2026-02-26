<template>
  <ion-page>
    <ion-content fullscreen class="screen-content ion-no-padding">
      <div class="screen form-screen">
        <div class="scene-bg welcome-bg"></div>
        <ion-grid class="form-layout">
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-sm="10" size-md="8" size-lg="6">
              <div class="form-group">
                <label class="form-label">Username:</label>
                <ion-input class="form-input" type="text" v-model="username" placeholder="Enter username" />
              </div>
              <div class="form-group">
                <label class="form-label">Password:</label>
                <ion-input class="form-input" type="password" v-model="password" placeholder="Enter password" />
              </div>
              <ion-button class="btn-main form-submit" @click="handleLogin">
                Log In
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
