<template>
  <div class="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
    <div
      :class="['bg-gradient-to-r text-white p-6 cursor-pointer', getColorClass(session.color)]"
      @click="toggleExpanded"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="text-5xl">{{ session.icon }}</div>
          <div>
            <h2 class="text-3xl font-bold">{{ session.title }}</h2>
            <div class="flex items-center gap-2 mt-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke-width="2"/>
              </svg>
              <span class="text-xl font-semibold">{{ session.time }} (Horario Italiano)</span>
            </div>
            <p class="text-sm opacity-90 mt-1">{{ session.description }}</p>
          </div>
        </div>
        <svg v-if="isExpanded" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M18 15l-6-6-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="p-6">
      <MarketBadges :markets="session.marketOpen" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-6">
        <AssetCard v-for="(asset, idx) in session.assets" :key="idx" :asset="asset" />
      </div>

      <div class="bg-slate-100 rounded-lg p-4">
        <h4 class="font-bold text-slate-800 mb-2">Assets Alternativos (si no hay setups en principales):</h4>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(alt, idx) in session.alternativeAssets"
            :key="idx"
            class="bg-white rounded px-3 py-2 border border-slate-300"
          >
            <span class="font-semibold text-slate-800">{{ alt.name }}</span>
            <span class="text-xs text-slate-600 ml-2">• {{ alt.reason }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AssetCard from './AssetCard.vue';
import MarketBadges from './MarketBadges.vue';

const props = defineProps({
  session: {
    type: Object,
    required: true
  }
});

const isExpanded = ref(false);

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const getColorClass = (color) => {
  const colorMap = {
    'blue': 'from-blue-500 to-blue-600 border-blue-300',
    'orange': 'from-orange-500 to-orange-600 border-orange-300',
    'purple': 'from-purple-500 to-purple-600 border-purple-300'
  };
  return colorMap[color] || 'from-blue-500 to-blue-600 border-blue-300';
};
</script>
