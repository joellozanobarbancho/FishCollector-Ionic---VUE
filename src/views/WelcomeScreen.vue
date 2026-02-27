<template>
  <ion-page>
    <ion-content fullscreen class="screen-content ion-no-padding">
      <div class="screen welcome-screen">
        <div class="scene-bg welcome-bg"></div>
        <ion-grid class="welcome-layout">
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <ion-col size="12" class="ion-text-center">
              <p class="welcome-title welcome-title-spacing">
                FISH<br />COLLECTOR:<br />IDLE
              </p>
            </ion-col>
            <ion-col size="12" size-sm="10" size-md="8">
              <div class="welcome-btns">
                <ion-button class="btn-main" @click="$router.push('/login')">Log In</ion-button>
                <ion-button class="btn-main" @click="$router.push('/signup')">Sign Up</ion-button>
                <ion-button class="btn-main" @click="$router.push('/game')">Play as Guest</ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton } from '@ionic/vue';
</script>

<style scoped>
/* Styles are in global.css */
</style>
