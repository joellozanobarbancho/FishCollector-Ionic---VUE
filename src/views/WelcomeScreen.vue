<template>
  <div class="screen" :style="{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }">
    <div class="scene-bg welcome-bg"></div>

    <!-- decorative fish -->
    <img
      class="deco-fish"
      style="top: 53px; left: 147px; width: 96px; height: 96px"
      src="https://www.figma.com/api/mcp/asset/e04f371a-f1d4-48f1-95e6-f62504e1580f"
      alt=""
    />
    <img
      class="deco-fish"
      style="top: 820px; left: 137px; width: 69px; height: 69px"
      src="https://www.figma.com/api/mcp/asset/f603750f-066c-484c-abf6-fa65e7784ed6"
      alt=""
    />
    <img
      class="deco-fish"
      style="top: 379px; left: 307px; width: 69px; height: 69px"
      src="https://www.figma.com/api/mcp/asset/f603750f-066c-484c-abf6-fa65e7784ed6"
      alt=""
    />
    <img
      class="deco-fish"
      style="top: 511px; left: 23px; width: 80px; height: 80px"
      src="https://www.figma.com/api/mcp/asset/75ecca58-a1a9-4f78-9c16-6efc7304f659"
      alt=""
    />
    <img
      class="deco-fish"
      style="top: 855px; left: 302px; width: 80px; height: 80px"
      src="https://www.figma.com/api/mcp/asset/75ecca58-a1a9-4f78-9c16-6efc7304f659"
      alt=""
    />
    <img
      class="deco-fish"
      style="top: 640px; left: 337px; width: 71px; height: 71px; transform: scaleY(-1) rotate(180deg)"
      src="https://www.figma.com/api/mcp/asset/bdc0108d-b943-4f40-b1ec-5177d85769b5"
      alt=""
    />
    <img
      class="deco-fish"
      style="top: 17px; left: 311px; width: 71px; height: 71px"
      src="https://www.figma.com/api/mcp/asset/bdc0108d-b943-4f40-b1ec-5177d85769b5"
      alt=""
    />

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
      <p class="welcome-title">
        FISH<br />COLLECTOR:<br />IDLE
      </p>
      <div class="welcome-btns">
        <button class="btn-main" @click="$router.push('/login')">Log In</button>
        <button class="btn-main" @click="$router.push('/signup')">Sign In</button>
        <button class="btn-main" @click="$router.push('/game')">Play as Guest</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
/* Styles are in global.css */
</style>
