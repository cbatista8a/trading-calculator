<template>
  <div class="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
    <div
      :class="['bg-gradient-to-r text-white p-6 cursor-pointer', getColorClass()]"
      @click="toggleExpanded"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="text-5xl">{{ market.icon }}</div>
          <div>
            <h2 class="text-3xl font-bold">{{ market.name }}</h2>
            <div class="flex items-center gap-2 mt-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke-width="2"/>
              </svg>
              <span class="text-xl font-semibold">{{ market.openTime }} - {{ market.closeTime }}</span>
              <span class="ml-2 text-sm opacity-90">({{ market.timezone }})</span>
            </div>
            <p class="text-sm opacity-90 mt-1">{{ market.description }}</p>
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
      <!-- Top 4 Assets Principales -->
      <div v-if="topFourAssets.length > 0">
        <h3 class="text-xl font-bold text-slate-800 mb-4">⭐ Top 4 Assets Recomendados</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AssetCard
            v-for="(asset, idx) in topFourAssets"
            :key="`${asset.name}-${idx}`"
            :asset="asset"
            :is-primary="idx < 2"
            :rank="idx + 1"
          />
        </div>
      </div>

      <!-- Top 10 Assets - Vista General -->
      <div v-if="allTopAssets.length > 0" class="bg-slate-100 rounded-lg p-4">
        <h4 class="font-bold text-slate-800 mb-3">📋 Top 10 Assets (Completo)</h4>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(asset, idx) in allTopAssets"
            :key="`${asset.name}-${idx}`"
            class="bg-white rounded p-3 border-l-4 hover:shadow-md transition-shadow"
            :class="getBorderColorByAssetType(asset.assetType)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center">
                    {{ idx + 1 }}
                  </span>
                  <h5 class="font-bold text-slate-800">{{ asset.name }}</h5>
                  <span class="text-xs text-slate-600">{{ asset.assetType }}</span>
                </div>
                <p class="text-sm text-slate-600 mt-1">{{ asset.whyGood }}</p>
              </div>
              <div class="text-right ml-4">
                <span :class="getVolatilityClass(asset.volatility)" class="inline-block">
                  Vol: {{ (asset.volatility * 10).toFixed(0) }}%
                </span>
                <p class="text-xs font-bold text-green-600 mt-1">{{ asset.rrPotential }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AssetCard from './AssetCard.vue';
import { useMarketSchedule } from '../../composables/useMarketSchedule';

const props = defineProps({
  market: {
    type: Object,
    required: true
  }
});

const isExpanded = ref(false);

const { getTopAssetsForMarket, getTopFourAssets } = useMarketSchedule(ref(props.market.timezone));

// Top 4 assets (2 principales + 2 secundarios)
const topFourAssets = computed(() => {
  return getTopFourAssets(props.market);
});

// Top 10 assets (vista general)
const allTopAssets = computed(() => {
  return getTopAssetsForMarket(props.market, 10);
});

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const getColorClass = () => {
  const colorMap = {
    'forex': 'from-blue-500 to-blue-600',
    'indices': 'from-purple-500 to-purple-600',
    'stocks': 'from-green-500 to-green-600',
    'crypto': 'from-yellow-500 to-yellow-600',
    'commodities': 'from-orange-500 to-orange-600'
  };
  return `bg-gradient-to-r ${colorMap[props.market.type] || 'from-slate-500 to-slate-600'}`;
};

const getVolatilityClass = (volatility) => {
  const baseClass = 'px-2 py-1 rounded text-xs font-bold';

  if (volatility >= 9.5) {
    return `${baseClass} bg-red-600 text-white`;
  } else if (volatility >= 9) {
    return `${baseClass} bg-orange-600 text-white`;
  } else if (volatility >= 8.5) {
    return `${baseClass} bg-yellow-600 text-white`;
  } else {
    return `${baseClass} bg-blue-600 text-white`;
  }
};

const getBorderColorByAssetType = (assetType) => {
  const colorMap = {
    'forex': 'border-blue-400',
    'indices': 'border-purple-400',
    'stocks': 'border-green-400',
    'crypto': 'border-yellow-400',
    'commodities': 'border-orange-400'
  };
  return colorMap[assetType] || 'border-gray-400';
};
</script>
