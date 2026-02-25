import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import WelcomeScreen from '../views/WelcomeScreen.vue';
import LoginScreen from '../views/LoginScreen.vue';
import SignupScreen from '../views/SignupScreen.vue';
import GameScreen from '../views/GameScreen.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomeScreen,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginScreen,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupScreen,
  },
  {
    path: '/game',
    name: 'Game',
    component: GameScreen,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
