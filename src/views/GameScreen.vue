<template>
  <ion-page>
    <ion-content fullscreen class="screen-content game-content ion-no-padding">
      <div class="screen" @click="handleScreenClick">
        <div class="scene-bg" :class="[scene === 2 ? 'ocean-bg' : 'game-bg']"></div>

    <!-- Coin counter -->
    <div class="coin-counter">
      <span class="coin-count">{{ coins }}</span>
      <img
        class="coin-icon"
        src="@/assets/img/Coin.png"
        alt="coins"
      />
    </div>

    <!-- ── FISHING TAP ── -->
    <div class="fishing-tap-area" @click="tapFish" v-if="activeTab === 'fishing'">
      <span class="fishing-tap-text">Tap here<br />to fish!</span>
    </div>

    <!-- ── UPGRADES PANEL ── -->
    <div
      class="content-panel"
      v-if="activeTab === 'upgrades'"
      @click.stop
      @pointerdown="startPanelDrag"
      @pointermove="onPanelDrag"
      @pointerup="endPanelDrag"
      @pointerleave="endPanelDrag"
    >
      <div class="menu-panel-title">
        UPGRADES
      </div>
      <div class="upgrade-item" v-for="upg in upgrades" :key="upg.id">
        <div>
          <div class="upgrade-name">{{ upg.name }}</div>
          <div class="upgrade-cost">{{ upg.cost }}<img src="@/assets/img/Coin.png" class="coin-sm coin-tight" alt="coin" /></div>
          <div class="upgrade-desc">{{ upg.desc }}</div>
        </div>
        <ion-button class="btn-buy" :disabled="coins < upg.cost || upg.bought" @click="buyUpgrade(upg)">
          {{ upg.bought ? 'Owned' : 'Buy' }}
        </ion-button>
      </div>
    </div>

    <!-- ── INVENTORY PANEL ── -->
    <div
      class="content-panel"
      v-if="activeTab === 'inventory'"
      @click.stop
      @pointerdown="startPanelDrag"
      @pointermove="onPanelDrag"
      @pointerup="endPanelDrag"
      @pointerleave="endPanelDrag"
    >
      <div class="menu-panel-title">
        INVENTORY
      </div>
      <div class="inv-grid">
        <div class="inv-card" v-for="fish in inventory" :key="fish.id">
          <img :src="fish.img" :alt="fish.name" />
          <div class="fish-name">{{ fish.name }}</div>
          <div class="fish-count">x{{ fish.count }}</div>
          <ion-button class="btn-sell" @click="sellFish(fish)">
            <span class="btn-sell-label">SELL<br />+{{ fish.value }}🪙</span>
          </ion-button>
        </div>
        <div
          class="inv-card inv-empty"
          v-if="inventory.length === 0"
        >
          No fish yet! Go fishing first.
        </div>
      </div>
    </div>

    <!-- ── MISSIONS PANEL ── -->
    <div
      class="content-panel"
      v-if="activeTab === 'missions'"
      @click.stop
      @pointerdown="startPanelDrag"
      @pointermove="onPanelDrag"
      @pointerup="endPanelDrag"
      @pointerleave="endPanelDrag"
    >
      <div class="menu-panel-title">
        MISSIONS
      </div>
      <div class="mission-item" v-for="m in missions.filter(m => !m.completed)" :key="m.id">
        <div class="mission-head">
          <div class="mission-main">
            <div class="mission-title">{{ m.title }}</div>
            <div class="mission-desc">{{ m.desc }}</div>
            <div class="mission-progress">
              <ion-progress-bar
                class="mission-progressbar"
                :value="Math.min(1, m.progress / m.goal)"
              ></ion-progress-bar>
            </div>
            <div class="mission-reward">
              Reward: {{ m.reward }}<img src="@/assets/img/Coin.png" class="coin-sm coin-tight" alt="coin" /> | {{ m.progress }}/{{ m.goal }}
            </div>
          </div>
          <ion-button
            v-if="!m.accepted"
            class="btn-buy mission-action"
            @click="acceptMission(m)"
          >
            Accept
          </ion-button>
          <ion-button
            v-else-if="m.progress >= m.goal"
            class="btn-buy mission-action mission-done"
            @click="claimReward(m)"
          >
            Done
          </ion-button>
          <ion-button
            v-else
            class="btn-buy mission-action"
            disabled
          >
            Accepted
          </ion-button>
        </div>
      </div>
    </div>

    <!-- ── FORUM PANEL ── -->
    <div class="content-panel" v-if="activeTab === 'forum'" @click.stop>
      <div
        class="forum-scroll"
        @pointerdown="startForumDrag"
        @pointermove="onForumDrag"
        @pointerup="endForumDrag"
        @pointerleave="endForumDrag"
      >
        <section class="forum-pane">
          <div class="forum-pane-title">PLAYER CHAT</div>
          <div class="chat-msgs">
            <div class="chat-msg" v-for="msg in chatMessages" :key="msg.id">
              <div class="msg-user" :class="getUserColorClass(msg.user)">{{ msg.user }}</div>
              {{ msg.text }}
            </div>
          </div>
          <div class="chat-input-row">
            <ion-input
              class="chat-input"
              v-model="chatInput"
              placeholder="Type a message..."
              @keydown.enter="sendChat"
            />
            <ion-button class="btn-send" @click="sendChat">Send</ion-button>
          </div>
        </section>
        <section class="forum-pane">
          <div class="forum-pane-title">TRADE FORUM</div>
          <div class="chat-msgs">
            <div class="chat-msg" v-for="offer in tradeOffers" :key="offer.id">
              <div class="msg-user" :class="getUserColorClass(offer.user)">{{ offer.user }}</div>
              <div class="trade-rows">
                <div class="trade-row">
                  <span>Offering: {{ offer.offering }}</span>
                  <img
                    v-if="getOfferIcon(offer.offering)"
                    :src="getOfferIcon(offer.offering)!.src"
                    :alt="getOfferIcon(offer.offering)!.alt"
                    class="trade-icon"
                  />
                </div>
                <div class="trade-row">
                  <span>Wants: {{ offer.wants }}</span>
                  <img
                    v-if="getOfferIcon(offer.wants)"
                    :src="getOfferIcon(offer.wants)!.src"
                    :alt="getOfferIcon(offer.wants)!.alt"
                    class="trade-icon"
                  />
                </div>
              </div>
              <div class="trade-action-wrap">
                <ion-button
                  class="btn-buy"
                  :disabled="!canAcceptTrade(offer)"
                  @click="acceptTrade(offer)"
                >
                  Accept
                </ion-button>
              </div>
            </div>
          </div>
          <div class="chat-input-row">
            <ion-button class="btn-send forum-offer-btn">Publish an offer</ion-button>
          </div>
        </section>
      </div>
    </div>

    <!-- ── OPTIONS PANEL ── -->
    <div
      class="content-panel"
      v-if="activeTab === 'options'"
      @click.stop
      @pointerdown="startPanelDrag"
      @pointermove="onPanelDrag"
      @pointerup="endPanelDrag"
      @pointerleave="endPanelDrag"
    >
      <div class="menu-panel-title">
        OPTIONS
      </div>
      <div class="option-row">
        <span class="option-label">Music</span>
        <ion-toggle class="option-toggle" v-model="opts.music"></ion-toggle>
      </div>
      <div class="option-row">
        <span class="option-label">SFX</span>
        <ion-toggle class="option-toggle" v-model="opts.sfx"></ion-toggle>
      </div>
      <div class="option-row">
        <span class="option-label">Notifications</span>
        <ion-toggle class="option-toggle" v-model="opts.notifs"></ion-toggle>
      </div>
      <div class="option-row">
        <span class="option-label">Volume</span>
        <ion-range class="volume-slider" :min="0" :max="100" v-model="opts.volume"></ion-range>
      </div>
      <div class="option-row">
        <span class="option-label">Language</span>
        <ion-select class="option-select" value="English" interface="popover">
          <ion-select-option value="English">English</ion-select-option>
          <ion-select-option value="Español">Español</ion-select-option>
          <ion-select-option value="Català">Català</ion-select-option>
        </ion-select>
      </div>
      <div class="option-row">
        <span class="option-label option-label-lg">Account</span>
        <ion-button class="btn-buy" @click="$router.push('/')">Log Out</ion-button>
      </div>
      <div class="stats-divider"></div>
      <div class="stats-section">
        <div class="stats-title">PLAYER STATISTICS</div>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">{{ totalCoinsEarned }}</div>
            <div class="stat-label">Coins Earned</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ totalFishCaught }}</div>
            <div class="stat-label">Fish Caught</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ missions.filter(m => m.completed).length }}</div>
            <div class="stat-label">Missions Done</div>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="chartContainer" id="statsChart"></canvas>
        </div>
      </div>
    </div>

    <!-- catch popup -->
    <div class="popup-overlay" v-if="catchPopup"></div>
    <div class="catch-popup" v-if="catchPopup">
      Caught a {{ catchPopup.name }}!<br />
      <img :src="catchPopup.img" :alt="catchPopup.name" class="catch-popup-img" />
    </div>

    <!-- ── MENU BAR ── -->
        <nav class="menu-bar" @click.stop>
          <ion-grid class="menu-grid ion-no-padding">
            <ion-row class="ion-no-margin ion-no-padding ion-justify-content-between">
              <ion-col class="ion-no-padding">
                <ion-button class="menu-tab" :class="{ active: activeTab === 'upgrades' }" @click="toggleTab('upgrades')">
                  <img src="@/assets/img/Upgrades.png" alt="Upgrades" />
                </ion-button>
              </ion-col>
              <ion-col class="ion-no-padding">
                <ion-button class="menu-tab" :class="{ active: activeTab === 'inventory' }" @click="toggleTab('inventory')">
                  <img src="@/assets/img/Inventory.png" alt="Inventory" />
                </ion-button>
              </ion-col>
              <ion-col class="ion-no-padding">
                <ion-button class="menu-tab" :class="{ active: activeTab === 'missions' }" @click="toggleTab('missions')">
                  <img src="@/assets/img/Missions.png" alt="Missions" />
                </ion-button>
              </ion-col>
              <ion-col class="ion-no-padding">
                <ion-button class="menu-tab" :class="{ active: activeTab === 'forum' }" @click="toggleTab('forum')">
                  <img src="@/assets/img/Forum.png" alt="Forum" />
                </ion-button>
              </ion-col>
              <ion-col class="ion-no-padding">
                <ion-button class="menu-tab" :class="{ active: activeTab === 'options' }" @click="toggleTab('options')">
                  <img src="@/assets/img/Options.png" alt="Options" />
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </nav>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonInput,
  IonToggle,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonProgressBar,
} from '@ionic/vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';
import { Chart } from 'chart.js';
import { onMounted } from 'vue';

interface Fish {
  id: number;
  name: string;
  img: string;
  value: number;
  count?: number;
}

interface Upgrade {
  id: number;
  name: string;
  desc: string;
  cost: number;
  bought: boolean;
}

interface Mission {
  id: number;
  title: string;
  desc: string;
  goal: number;
  progress: number;
  reward: number;
  accepted: boolean;
  completed: boolean;
}

interface ChatMessage {
  id: number;
  user: string;
  text: string;
}

interface TradeOffer {
  id: number;
  user: string;
  offering: string;
  wants: string;
}

const FISH_TYPES: Fish[] = [
  {
    id: 1,
    name: 'Catfish',
    img: new URL('../assets/img/Catfish.png', import.meta.url).href,
    value: 5,
  },
  {
    id: 2,
    name: 'Goldfish',
    img: new URL('../assets/img/Goldfish.png', import.meta.url).href,
    value: 8,
  },
  {
    id: 3,
    name: 'Rainbow Trout',
    img: new URL('../assets/img/RainbowTrout.png', import.meta.url).href,
    value: 12,
  },
  {
    id: 4,
    name: 'Angelfish',
    img: new URL('../assets/img/Angelfish.png', import.meta.url).href,
    value: 15,
  },
  {
    id: 5,
    name: 'Pufferfish',
    img: new URL('../assets/img/Pufferfish.png', import.meta.url).href,
    value: 20,
  },
  {
    id: 6,
    name: 'Clownfish',
    img: new URL('../assets/img/Clownfish.png', import.meta.url).href,
    value: 18,
  },
  {
    id: 7,
    name: 'Anchovy',
    img: new URL('../assets/img/Anchovy.png', import.meta.url).href,
    value: 3,
  },
  {
    id: 8,
    name: 'Surgeonfish',
    img: new URL('../assets/img/Surgeonfish.png', import.meta.url).href,
    value: 25,
  },
];

// State
const activeTab = ref<string>('fishing');
const scene = ref<number>(1);
const coins = ref(150);
const catchPopup = ref<Fish | null>(null);
const chatInput = ref('');
const chartContainer = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// Statistics
const totalCoinsEarned = ref(0);
const totalFishCaught = ref(0);

// Upgrades
const upgrades = ref<Upgrade[]>([
  { id: 1, name: 'Fishing upgrade 1', desc: 'Catch rare fish more often', cost: 50, bought: false },
  { id: 2, name: 'Faster Fishing', desc: 'Reduce wait time by 20%', cost: 80, bought: false },
  { id: 3, name: 'Fishing upgrade 2', desc: 'Even better fishing rod', cost: 150, bought: false },
  { id: 4, name: 'Fish Spawn Rate Up', desc: 'More fish appear underwater', cost: 200, bought: false },
  { id: 5, name: 'Fishing upgrade 3', desc: 'The ultimate rod', cost: 400, bought: false },
  { id: 6, name: 'Lucky Lure', desc: '+5 to rare fish chance', cost: 300, bought: false },
]);

// Inventory
const inventory = ref<Fish[]>(FISH_TYPES.map((fish) => ({ ...fish, count: 5 })));

// Missions
const missions = ref<Mission[]>([
  { id: 1, title: 'First Catch', desc: 'Catch your first fish', goal: 1, progress: 0, reward: 20, accepted: false, completed: false },
  { id: 2, title: 'Fisher Novice', desc: 'Catch 10 fish total', goal: 10, progress: 0, reward: 100, accepted: false, completed: false },
  { id: 3, title: 'Golden Haul', desc: 'Catch 5 Goldfish', goal: 5, progress: 0, reward: 80, accepted: false, completed: false },
  { id: 4, title: 'Rare Hunter', desc: 'Catch a Surgeonfish', goal: 1, progress: 0, reward: 150, accepted: false, completed: false },
  { id: 5, title: 'Coin Collector', desc: 'Earn 500 coins total', goal: 500, progress: 0, reward: 200, accepted: false, completed: false },
]);

// Chat
const chatMessages = ref<ChatMessage[]>([
  { id: 1, user: 'OceanMaster99', text: 'Just caught a rare Surgeonfish!' },
  { id: 2, user: 'FishKing', text: 'Anyone want to trade Angelfish for Goldfish?' },
  { id: 3, user: 'AquaHunter', text: 'The new update is amazing!' },
]);

const tradeOffers = ref<TradeOffer[]>([
  { id: 1, user: 'DeepSeaDave', offering: '3x Catfish', wants: '1x Pufferfish' },
  { id: 2, user: 'FishKing', offering: '2x Clownfish', wants: '5x Anchovy' },
  { id: 3, user: 'TroutTrader', offering: '2x Rainbow Trout', wants: '1x Angelfish' },
  { id: 4, user: 'PearlDiver', offering: '40 coins', wants: '1x Pufferfish' },
  { id: 5, user: 'ReefRider', offering: '3x Clownfish', wants: '2x Catfish' },
  { id: 6, user: 'SurgSniper', offering: '75 coins', wants: '1x Surgeonfish' },
  { id: 7, user: 'GoldGills', offering: '4x Goldfish', wants: '30 coins' },
]);

// Options
const opts = ref({ music: true, sfx: true, notifs: false, volume: 70 });



// Methods
function toggleTab(tabName: string) {
  // If clicking the currently active tab, close it
  if (activeTab.value === tabName) {
    activeTab.value = 'fishing';
  } else {
    // Otherwise open the clicked tab
    activeTab.value = tabName;
  }
}

function handleScreenClick() {
  if (activeTab.value !== 'fishing') {
    activeTab.value = 'fishing';
  }
}

let catchTimer: NodeJS.Timeout | null = null;

async function tapFish() {
  if (catchTimer) return; // debounce

  // Vibración al pescar
  await Haptics.impact({ style: ImpactStyle.Light });

  const roll = Math.random();
  let fish: Fish;

  if (roll < 0.35) fish = FISH_TYPES[0]; // catfish
  else if (roll < 0.55) fish = FISH_TYPES[1]; // goldfish
  else if (roll < 0.7) fish = FISH_TYPES[2]; // rainbow trout
  else if (roll < 0.8) fish = FISH_TYPES[6]; // anchovy
  else if (roll < 0.88) fish = FISH_TYPES[3]; // angelfish
  else if (roll < 0.93) fish = FISH_TYPES[5]; // clownfish
  else if (roll < 0.97) fish = FISH_TYPES[4]; // pufferfish
  else fish = FISH_TYPES[7]; // surgeonfish rare

  // Add to inventory
  const existing = inventory.value.find((f) => f.id === fish.id);
  if (existing) {
    existing.count = (existing.count || 0) + 1;
  } else {
    inventory.value.push({ ...fish, count: 1 });
  }

  // Update statistics
  totalFishCaught.value += 1;
  updateChart();

  // Update missions (only for accepted missions)
  const firstCatch = missions.value.find(m => m.id === 1);
  if (firstCatch?.accepted) firstCatch.progress = Math.min(firstCatch.goal, firstCatch.progress + 1);

  const novice = missions.value.find(m => m.id === 2);
  if (novice?.accepted) novice.progress = Math.min(novice.goal, novice.progress + 1);

  const golden = missions.value.find(m => m.id === 3);
  if (golden?.accepted && fish.id === 2) golden.progress = Math.min(golden.goal, golden.progress + 1);

  const rareHunter = missions.value.find(m => m.id === 4);
  if (rareHunter?.accepted && fish.id === 8) rareHunter.progress = Math.min(rareHunter.goal, rareHunter.progress + 1);

  catchPopup.value = fish;
  
  // Vibración más fuerte al atrapar pez raro
  if (fish.value > 15) {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  }

  catchTimer = setTimeout(() => {
    catchPopup.value = null;
    catchTimer = null;
  }, 1600);
}

function buyUpgrade(upg: Upgrade) {
  if (coins.value >= upg.cost && !upg.bought) {
    coins.value -= upg.cost;
    upg.bought = true;
  }
}

function sellFish(fish: Fish) {
  if (!fish.count || fish.count <= 0) return;

  const val = fish.value;
  coins.value += val;

  // Update statistics
  totalCoinsEarned.value += val;
  updateChart();

  // Update coin collector mission (only if accepted)
  const coinCollector = missions.value.find(m => m.id === 5);
  if (coinCollector?.accepted) {
    coinCollector.progress = Math.min(coinCollector.goal, coinCollector.progress + val);
  }

  fish.count -= 1;
  if (fish.count <= 0) {
    inventory.value = inventory.value.filter((f) => f.id !== fish.id);
  }
}

function acceptMission(mission: Mission) {
  mission.accepted = true;
}

function claimReward(mission: Mission) {
  coins.value += mission.reward;
  mission.completed = true;
}

async function sendChat() {
  if (!chatInput.value.trim()) return;

  chatMessages.value.push({
    id: Date.now(),
    user: 'You',
    text: chatInput.value,
  });

  chatInput.value = '';

  // Ocultar teclado automáticamente
  await Keyboard.hide();
}

const isForumDragging = ref(false);
const forumDragStartX = ref(0);
const forumDragStartY = ref(0);
const forumScrollStartX = ref(0);
const forumChatScrollStartY = ref(0);
const forumChatScrollEl = ref<HTMLElement | null>(null);

function isInteractiveTarget(event: PointerEvent): boolean {
  const path = event.composedPath();
  return path.some((node) => {
    if (!(node instanceof HTMLElement)) return false;
    const tag = node.tagName;
    return (
      tag === 'BUTTON' ||
      tag === 'INPUT' ||
      tag === 'SELECT' ||
      tag === 'TEXTAREA' ||
      tag === 'ION-BUTTON' ||
      tag === 'ION-INPUT' ||
      tag === 'ION-SELECT' ||
      tag === 'ION-TOGGLE' ||
      tag === 'ION-RANGE'
    );
  });
}

function startForumDrag(event: PointerEvent) {
  const target = event.target as HTMLElement | null;
  if (isInteractiveTarget(event)) return;
  const el = event.currentTarget as HTMLElement;
  isForumDragging.value = true;
  forumDragStartX.value = event.clientX;
  forumDragStartY.value = event.clientY;
  forumScrollStartX.value = el.scrollLeft;
  forumChatScrollEl.value = target?.closest('.chat-msgs') as HTMLElement | null;
  forumChatScrollStartY.value = forumChatScrollEl.value ? forumChatScrollEl.value.scrollTop : 0;
  el.setPointerCapture(event.pointerId);
}

function onForumDrag(event: PointerEvent) {
  if (!isForumDragging.value) return;
  const el = event.currentTarget as HTMLElement;
  const deltaX = event.clientX - forumDragStartX.value;
  const deltaY = event.clientY - forumDragStartY.value;
  el.scrollLeft = forumScrollStartX.value - deltaX;
  if (forumChatScrollEl.value) {
    forumChatScrollEl.value.scrollTop = forumChatScrollStartY.value - deltaY;
  }
}

function endForumDrag(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement;
  if (isForumDragging.value) {
    isForumDragging.value = false;
    forumChatScrollEl.value = null;
    try {
      el.releasePointerCapture(event.pointerId);
    } catch {
      // no-op
    }
  }
}

const isPanelDragging = ref(false);
const panelDragStartY = ref(0);
const panelScrollStartY = ref(0);

function startPanelDrag(event: PointerEvent) {
  if (isInteractiveTarget(event)) return;
  const el = event.currentTarget as HTMLElement;
  isPanelDragging.value = true;
  panelDragStartY.value = event.clientY;
  panelScrollStartY.value = el.scrollTop;
  el.setPointerCapture(event.pointerId);
}

function onPanelDrag(event: PointerEvent) {
  if (!isPanelDragging.value) return;
  const el = event.currentTarget as HTMLElement;
  const delta = event.clientY - panelDragStartY.value;
  el.scrollTop = panelScrollStartY.value - delta;
}

function endPanelDrag(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement;
  if (isPanelDragging.value) {
    isPanelDragging.value = false;
    try {
      el.releasePointerCapture(event.pointerId);
    } catch {
      // no-op
    }
  }
}

function getFishByName(label: string): Fish | undefined {
  const clean = label
    .replace(/\d+\s*x\s*/i, '')
    .replace(/\d+\s*/i, '')
    .trim()
    .toLowerCase();
  return FISH_TYPES.find((fish) => fish.name.toLowerCase() === clean);
}

function getOfferIcon(label: string): { src: string; alt: string } | null {
  if (/\bcoins?\b/i.test(label) || /\b\d+\s*coins?\b/i.test(label)) {
    return { src: new URL('../assets/img/Coin.png', import.meta.url).href, alt: 'Coins' };
  }
  const fish = getFishByName(label);
  return fish ? { src: fish.img, alt: fish.name } : null;
}

function getUserColorClass(name: string): string {
  const totalColors = 7;
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % totalColors;
  }
  return `user-color-${hash}`;
}

function parseOffer(label: string): { type: 'coins' | 'fish'; qty: number; fish?: Fish } | null {
  const coinMatch = label.match(/(\d+)\s*coins?/i);
  if (coinMatch) {
    return { type: 'coins', qty: Number(coinMatch[1]) };
  }

  const qtyMatch = label.match(/(\d+)\s*x\s*/i);
  const qty = qtyMatch ? Number(qtyMatch[1]) : 1;
  const fish = getFishByName(label);
  if (!fish) return null;
  return { type: 'fish', qty, fish };
}

function getInventoryCount(fishId: number): number {
  const item = inventory.value.find((f) => f.id === fishId);
  return item?.count || 0;
}

function addFish(fish: Fish, qty: number) {
  const existing = inventory.value.find((f) => f.id === fish.id);
  if (existing) {
    existing.count = (existing.count || 0) + qty;
  } else {
    inventory.value.push({ ...fish, count: qty });
  }
}

function removeFish(fishId: number, qty: number) {
  const existing = inventory.value.find((f) => f.id === fishId);
  if (!existing || (existing.count || 0) < qty) return;
  const newCount = (existing.count || 0) - qty;
  if (newCount <= 0) {
    inventory.value = inventory.value.filter((f) => f.id !== fishId);
  } else {
    existing.count = newCount;
  }
}

function canAcceptTrade(offer: TradeOffer): boolean {
  const wants = parseOffer(offer.wants);
  const giving = wants;
  if (!giving) return false;
  if (giving.type === 'coins') return coins.value >= giving.qty;
  return getInventoryCount(giving.fish!.id) >= giving.qty;
}

function acceptTrade(offer: TradeOffer) {
  if (!canAcceptTrade(offer)) return;

  const wants = parseOffer(offer.wants);
  const offering = parseOffer(offer.offering);
  if (!wants || !offering) return;

  if (wants.type === 'coins') {
    coins.value -= wants.qty;
  } else {
    removeFish(wants.fish!.id, wants.qty);
  }

  if (offering.type === 'coins') {
    coins.value += offering.qty;
  } else {
    addFish(offering.fish!, offering.qty);
  }

  tradeOffers.value = tradeOffers.value.filter((o) => o.id !== offer.id);
}

// Statistics chart
function initChart() {
  if (!chartContainer.value) return;
  
  // Destroy previous chart if exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  const fishCounts = FISH_TYPES.map(fish => {
    const inv = inventory.value.find(f => f.id === fish.id);
    return inv?.count || 0;
  });

  chartInstance = new Chart(chartContainer.value, {
    type: 'doughnut',
    data: {
      labels: FISH_TYPES.map(f => f.name),
      datasets: [{
        data: fishCounts,
        backgroundColor: [
          '#54d4ff',
          '#007ea8',
          '#fcdc2c',
          '#884000',
          '#88dd88',
          '#ff88cc',
          '#ffaa00',
          '#00ffff'
        ],
        borderColor: 'rgba(107, 107, 107, 0.55)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#fff',
            font: { family: 'Fixedsys, monospace', size: 10 },
            padding: 12
          }
        }
      }
    }
  });
}

function updateChart() {
  // Re-initialize chart with updated data
  if (chartInstance) {
    initChart();
  }
}

onMounted(() => {
  // Initialize chart when component mounts
  setTimeout(() => {
    initChart();
  }, 100);
});
</script>

<style scoped>
/* Styles are in global.css */
</style>
