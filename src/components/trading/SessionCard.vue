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
              <span class="text-xl font-semibold">{{ session.time }}</span>
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
      <!-- Mercados Activos -->
      <div v-if="activeMarkets.length > 0" class="mb-6">
        <h3 class="font-bold text-slate-800 mb-3">Mercados Activos en tu zona horaria:</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="market in activeMarkets"
            :key="market"
            class="inline-block bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-4 py-2 rounded-full border-2 border-green-300 font-semibold text-sm"
          >
            {{ capitalizeMarket(market) }}
          </span>
        </div>
      </div>

      <MarketBadges :markets="session.marketOpen" />

      <!-- Top Assets para esta sesión -->
      <div v-if="topAssets.length > 0" class="mt-6">
        <h3 class="font-bold text-slate-800 mb-3">
          Top Assets (ordenados por volatilidad)
          <span class="text-sm font-normal text-slate-600">- {{ topAssets.length }} recomendados</span>
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AssetCard
            v-for="(asset, idx) in topAssets"
            :key="`${asset.name}-${idx}`"
            :asset="asset"
            :is-primary="idx < 2"
            :rank="idx + 1"
          />
        </div>
      </div>

      <!-- Assets Dinámicos de todos los mercados activos -->
      <div v-if="allActiveMarketAssets.length > 0" class="bg-slate-100 rounded-lg p-4">
        <h4 class="font-bold text-slate-800 mb-3">Assets Adicionales por Mercado Activo:</h4>
        <div class="space-y-3">
          <div v-for="(marketGroup, idx) in groupedAssets" :key="idx" class="bg-white rounded-lg p-3 border-l-4" :class="getBorderColor(marketGroup.type)">
            <h5 class="font-semibold text-slate-700 mb-2 capitalize">{{ capitalizeMarket(marketGroup.type) }}</h5>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="asset in marketGroup.assets.slice(0, 5)"
                :key="asset.name"
                class="bg-slate-50 rounded px-3 py-2 border border-slate-300 text-sm"
              >
                <span class="font-semibold text-slate-800">{{ asset.name }}</span>
                <span class="text-xs text-slate-600 ml-2">• Vol: {{ (asset.volatility * 10).toFixed(0) }}%</span>
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
import MarketBadges from './MarketBadges.vue';
import { useMarketSchedule } from '../../composables/useMarketSchedule';

const props = defineProps({
  session: {
    type: Object,
    required: true
  },
  selectedTimezone: {
    type: String,
    default: 'cet'
  }
});

const isExpanded = ref(false);

// Crear una referencia reactiva de la zona horaria
const timezoneRef = ref(props.selectedTimezone);
const { getTopAssetsForSession } = useMarketSchedule(timezoneRef);

// Mercados activos para esta sesión
const activeMarkets = computed(() => {
  return props.session.activeMarkets || [];
});

// Top 4 assets de esta sesión
const topAssets = computed(() => {
  return getTopAssetsForSession(props.session);
});

// Todos los assets agrupados por mercado
const allActiveMarketAssets = computed(() => {
  const assets = [];
  props.session.activeMarkets?.forEach(marketType => {
    if (props.session.markets[marketType]) {
      assets.push(...props.session.markets[marketType]);
    }
  });
  return assets;
});

// Assets agrupados por tipo de mercado
const groupedAssets = computed(() => {
  const groups = [];
  props.session.activeMarkets?.forEach(marketType => {
    if (props.session.markets[marketType]) {
      const assets = props.session.markets[marketType]
        .slice()
        .sort((a, b) => b.volatility - a.volatility);
      groups.push({
        type: marketType,
        assets
      });
    }
  });
  return groups;
});

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

const capitalizeMarket = (market) => {
  const map = {
    'forex': 'Forex',
    'indices': 'Índices',
    'stocks': 'Acciones',
    'crypto': 'Criptomonedas',
    'commodities': 'Commodities'
  };
  return map[market] || market;
};

const getBorderColor = (market) => {
  const colorMap = {
    'forex': 'border-blue-400',
    'indices': 'border-purple-400',
    'stocks': 'border-green-400',
    'crypto': 'border-yellow-400',
    'commodities': 'border-orange-400'
  };
  return colorMap[market] || 'border-gray-400';
};
</script>
