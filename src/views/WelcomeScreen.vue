<template>
  <ion-page>
    <div class="screen" :style="{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }">
      <div class="scene-bg welcome-bg"></div>


      <div
        style="
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
        "
      >
        <p class="welcome-title" style="margin-bottom: 40px;">
          FISH<br />COLLECTOR:<br />IDLE
        </p>
        <div class="welcome-btns">
          <button class="btn-main" @click="$router.push('/login')">Log In</button>
          <button class="btn-main" @click="$router.push('/signup')">Sign In</button>
          <button class="btn-main" @click="$router.push('/game')">Play as Guest</button>
        </div>
      </div>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue';
</script>

<style scoped>
/* Styles are in global.css */
</style>
