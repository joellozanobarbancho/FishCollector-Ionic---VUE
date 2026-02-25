<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
<style>
html,
body,
#app,
ion-app,
ion-router-outlet {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>