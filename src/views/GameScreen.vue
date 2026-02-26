<template>
  <div class="screen">
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

    <!-- ── FISHING TAP (scene 1 & 2) ── -->
    <div class="fishing-tap-area" @click="tapFish" v-if="activeTab === 'fishing'">
      <span class="fishing-tap-text">Tap here<br />to fish!</span>
    </div>

    <!-- ── UPGRADES PANEL ── -->
    <div class="content-panel" v-if="activeTab === 'upgrades'">
      <div style="padding: 18px; font-size: 20px; color: var(--amber); text-shadow: var(--text-shadow)">
        UPGRADES
      </div>
      <div class="upgrade-item" v-for="upg in upgrades" :key="upg.id">
        <div>
          <div class="upgrade-name">{{ upg.name }}</div>
          <div class="upgrade-cost"><img src="@/assets/img/Coin.png" class="coin-sm" alt="coin" /> {{ upg.cost }} coins</div>
          <div style="font-size: 14px; color: #aaa; font-family: var(--font)">{{ upg.desc }}</div>
        </div>
        <button class="btn-buy" :disabled="coins < upg.cost || upg.bought" @click="buyUpgrade(upg)">
          {{ upg.bought ? 'Owned' : 'Buy' }}
        </button>
      </div>
    </div>

    <!-- ── INVENTORY PANEL ── -->
    <div class="content-panel" v-if="activeTab === 'inventory'">
      <div style="padding: 18px; font-size: 20px; color: var(--amber); text-shadow: var(--text-shadow)">
        YOUR CATCH
      </div>
      <div class="inv-grid">
        <div class="inv-card" v-for="fish in inventory" :key="fish.id">
          <img :src="fish.img" :alt="fish.name" />
          <div class="fish-name">{{ fish.name }}</div>
          <div class="fish-count">x{{ fish.count }}</div>
          <button class="btn-sell" @click="sellFish(fish)">SELL +{{ fish.value }}🪙</button>
        </div>
        <div
          class="inv-card"
          v-if="inventory.length === 0"
          style="grid-column: 1/-1; color: #aaa; font-size: 16px; padding: 34px"
        >
          No fish yet! Go fishing first.
        </div>
      </div>
    </div>

    <!-- ── MISSIONS PANEL ── -->
    <div class="content-panel" v-if="activeTab === 'missions'">
      <div style="padding: 18px; font-size: 20px; color: var(--amber); text-shadow: var(--text-shadow)">
        MISSIONS
      </div>
      <div class="mission-item" v-for="m in missions.filter(m => !m.completed)" :key="m.id">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px">
          <div style="flex: 1">
            <div class="mission-title">{{ m.title }}</div>
            <div class="mission-desc">{{ m.desc }}</div>
            <div class="mission-progress">
              <div class="mission-bar" :style="{ width: Math.min(100, (m.progress / m.goal) * 100) + '%' }"></div>
            </div>
            <div class="mission-reward">
              Reward: <img src="@/assets/img/Coin.png" class="coin-sm" alt="coin" /> {{ m.reward }} | {{ m.progress }}/{{ m.goal }}
            </div>
          </div>
          <button
            v-if="!m.accepted"
            class="btn-buy mission-action"
            @click="acceptMission(m)"
            style="margin-top: 0;"
          >
            Accept
          </button>
          <button
            v-else-if="m.progress >= m.goal"
            class="btn-buy mission-action"
            @click="claimReward(m)"
            style="margin-top: 0; background: linear-gradient(to bottom, #4ade80, #22c55e);"
          >
            Done
          </button>
          <button
            v-else
            class="btn-buy mission-action"
            disabled
            style="margin-top: 0; opacity: 0.6; cursor: not-allowed;"
          >
            Accepted
          </button>
        </div>
      </div>
    </div>

    <!-- ── FORUM PANEL ── -->
    <div class="content-panel" v-if="activeTab === 'forum'" style="display: flex; flex-direction: column">
      <div class="forum-tabs">
        <button class="forum-tab" :class="{ active: forumTab === 'chat' }" @click="forumTab = 'chat'">
          💬 Chat
        </button>
        <button class="forum-tab" :class="{ active: forumTab === 'trade' }" @click="forumTab = 'trade'">
          🔄 Trade
        </button>
      </div>
      <div class="chat-msgs" v-if="forumTab === 'chat'">
        <div class="chat-msg" v-for="msg in chatMessages" :key="msg.id">
          <div class="msg-user">{{ msg.user }}</div>
          {{ msg.text }}
        </div>
      </div>
      <div class="chat-msgs" v-if="forumTab === 'trade'">
        <div class="chat-msg" v-for="offer in tradeOffers" :key="offer.id">
          <div class="msg-user">{{ offer.user }}</div>
          Offering: {{ offer.offering }} → Wants: {{ offer.wants }}
        </div>
      </div>
      <div class="chat-input-row">
        <input
          class="chat-input"
          v-model="chatInput"
          :placeholder="forumTab === 'chat' ? 'Type a message...' : 'Post a trade offer...'"
          @keyup.enter="sendChat"
        />
        <button class="btn-send" @click="sendChat">Send</button>
      </div>
    </div>

    <!-- ── OPTIONS PANEL ── -->
    <div class="content-panel" v-if="activeTab === 'options'">
      <div style="padding: 18px; font-size: 20px; color: var(--amber); text-shadow: var(--text-shadow)">
        OPTIONS
      </div>
      <div class="option-row">
        <span class="option-label">Music</span>
        <div class="toggle-switch" :class="{ on: opts.music }" @click="opts.music = !opts.music">
          <div class="toggle-knob"></div>
        </div>
      </div>
      <div class="option-row">
        <span class="option-label">SFX</span>
        <div class="toggle-switch" :class="{ on: opts.sfx }" @click="opts.sfx = !opts.sfx">
          <div class="toggle-knob"></div>
        </div>
      </div>
      <div class="option-row">
        <span class="option-label">Notifications</span>
        <div class="toggle-switch" :class="{ on: opts.notifs }" @click="opts.notifs = !opts.notifs">
          <div class="toggle-knob"></div>
        </div>
      </div>
      <div class="option-row">
        <span class="option-label">Volume</span>
        <input type="range" class="volume-slider" min="0" max="100" v-model="opts.volume" />
      </div>
      <div class="option-row">
        <span class="option-label">Language</span>
        <select
          style="
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            border: 2px solid var(--brown);
            border-radius: 8px;
            padding: 6px;
            font-family: var(--font);
            font-size: 14px;
          "
        >
          <option>English</option>
          <option>Español</option>
          <option>Català</option>
        </select>
      </div>
      <div class="option-row">
        <span class="option-label" style="font-size: 18px">Account</span>
        <button class="btn-buy" @click="$router.push('/')">Log Out</button>
      </div>
    </div>

    <!-- catch popup -->
    <div class="catch-popup" v-if="catchPopup">
      Caught a {{ catchPopup.name }}!<br />
      <img :src="catchPopup.img" :alt="catchPopup.name" style="width: 64px; height: 64px; object-fit: contain; margin-top: 6px;" />
    </div>

    <!-- ── MENU BAR ── -->
    <nav class="menu-bar">
      <div class="menu-tab" :class="{ active: activeTab === 'upgrades' }" @click="toggleTab('upgrades')">
        <img src="@/assets/img/Upgrades.png" alt="Upgrades" />
      </div>
      <div class="menu-tab" :class="{ active: activeTab === 'inventory' }" @click="toggleTab('inventory')">
        <img src="@/assets/img/Inventory.png" alt="Inventory" />
      </div>
      <div class="menu-tab" :class="{ active: activeTab === 'missions' }" @click="toggleTab('missions')">
        <img src="@/assets/img/Missions.png" alt="Missions" />
      </div>
      <div class="menu-tab" :class="{ active: activeTab === 'forum' }" @click="toggleTab('forum')">
        <img src="@/assets/img/Forum.png" alt="Forum" />
      </div>
      <div class="menu-tab" :class="{ active: activeTab === 'options' }" @click="toggleTab('options')">
        <img src="@/assets/img/Options.png" alt="Options" />
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

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
const forumTab = ref<string>('chat');
const scene = ref<number>(1);
const coins = ref(150);
const catchPopup = ref<Fish | null>(null);
const chatInput = ref('');

// Upgrades
const upgrades = ref<Upgrade[]>([
  { id: 1, name: 'Fishing Rod Upgrade 1', desc: 'Catch rare fish more often', cost: 50, bought: false },
  { id: 2, name: 'Faster Fishing', desc: 'Reduce wait time by 20%', cost: 80, bought: false },
  { id: 3, name: 'Fishing Rod Upgrade 2', desc: 'Even better fishing rod', cost: 150, bought: false },
  { id: 4, name: 'Fish Spawn Rate Up', desc: 'More fish appear underwater', cost: 200, bought: false },
  { id: 5, name: 'Fishing Rod Upgrade 3', desc: 'The ultimate rod', cost: 400, bought: false },
  { id: 6, name: 'Lucky Lure', desc: '+5 to rare fish chance', cost: 300, bought: false },
]);

// Inventory
const inventory = ref<Fish[]>([]);

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
  { id: 2, user: 'FishKing', offering: '5x Anchovy', wants: '2x Clownfish' },
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

let catchTimer: NodeJS.Timeout | null = null;

function tapFish() {
  if (catchTimer) return; // debounce

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
  const val = fish.value * (fish.count || 0);
  coins.value += val;
  
  // Update coin collector mission (only if accepted)
  const coinCollector = missions.value.find(m => m.id === 5);
  if (coinCollector?.accepted) {
    coinCollector.progress = Math.min(coinCollector.goal, coinCollector.progress + val);
  }
  
  inventory.value = inventory.value.filter((f) => f.id !== fish.id);
}

function acceptMission(mission: Mission) {
  mission.accepted = true;
}

function claimReward(mission: Mission) {
  coins.value += mission.reward;
  mission.completed = true;
}

function sendChat() {
  if (!chatInput.value.trim()) return;

  if (forumTab.value === 'chat') {
    chatMessages.value.push({
      id: Date.now(),
      user: 'You',
      text: chatInput.value,
    });
  } else {
    tradeOffers.value.push({
      id: Date.now(),
      user: 'You',
      offering: chatInput.value,
      wants: '?',
    });
  }

  chatInput.value = '';
}
</script>

<style scoped>
/* Styles are in global.css */
</style>
