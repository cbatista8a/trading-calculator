<template>
  <div class="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>
        </svg>
        <h1 class="text-3xl font-bold text-slate-800">Plan de Trading por Horarios 🌍</h1>
      </div>
      <p class="text-slate-600 mb-4">
        Selecciona tu zona horaria para ver los mercados activos y los <span class="font-bold text-green-600">mejores 4 assets a vigilar</span> (2 principales + 2 secundarios).
      </p>

      <!-- Selector de Zona Horaria -->
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-5 mb-4">
        <label class="block text-sm font-bold text-blue-900 mb-3">
          📍 Selecciona tu Zona Horaria (GMT)
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            v-for="tz in availableTimezones"
            :key="tz.id"
            @click="onTimezoneChange(tz.id)"
            :class="[
              'p-3 rounded-lg font-semibold transition-all duration-200 text-sm text-left border-2',
              selectedTimezone === tz.id
                ? 'bg-blue-600 text-white border-blue-800 shadow-lg ring-2 ring-blue-300'
                : 'bg-white text-blue-900 border-blue-200 hover:bg-blue-50'
            ]"
          >
            <div class="font-bold">{{ tz.name }}</div>
            <div class="text-xs opacity-75">{{ tz.region }}</div>
          </button>
        </div>
      </div>

      <div class="bg-green-50 border-2 border-green-300 rounded-lg p-4">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div class="text-sm text-green-900">
            <span class="font-bold">Regla de Oro:</span> Elige TU zona horaria. Se mostrarán los mercados abiertos ahora mismo en tu hora local.
            Monitorea SOLO los 4 assets principales de cada mercado. Si no hay setup con RR ≥ 1:2.5 en 1 hora → CIERRA plataforma y vuelve después.
          </div>
        </div>
      </div>

      <!-- Info de hora actual -->
      <div v-if="currentTimeInfo" class="mt-4 bg-slate-100 rounded-lg p-3">
        <p class="text-sm font-semibold text-slate-700">
          ⏰ Hora actual en tu zona: <span class="text-lg text-slate-900">{{ formatCurrentTime }}</span>
        </p>
        <div v-if="activeMarkets.length > 0" class="mt-3">
          <p class="text-sm font-semibold text-green-700">✓ Mercados Abiertos AHORA:</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="market in activeMarkets"
              :key="market.id"
              class="inline-block bg-green-200 text-green-900 px-3 py-1 rounded-full text-xs font-bold"
            >
              {{ market.icon }} {{ market.name }}
            </span>
          </div>
        </div>
        <div v-else class="mt-3 text-sm text-orange-700">
          ℹ️ Sin mercados abiertos en este momento.
        </div>
        <div v-if="nextMarketInfo" class="mt-3 text-sm">
          <p class="font-semibold text-blue-700">⏱️ Próximo a abrir: <span class="text-blue-900">{{ nextMarketInfo.market.name }} en {{ nextMarketInfo.timeString }}</span></p>
        </div>
      </div>
    </div>

    <!-- Mercados Abiertos -->
    <div v-if="activeMarkets.length > 0" class="mt-6">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">🟢 Mercados Abiertos - Assets Recomendados</h2>
      <MarketCard
        v-for="market in activeMarkets"
        :key="market.id"
        :market="market"
      />
    </div>

    <!-- Estado de Todos los Mercados -->
    <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">📊 Estado de Mercados</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="market in allMarketsWithStatus"
          :key="market.id"
          :class="[
            'rounded-lg p-3 border-2 transition-all',
            market.isOpen
              ? 'bg-green-50 border-green-300 shadow-md'
              : 'bg-slate-50 border-slate-300 opacity-60'
          ]"
        >
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">{{ market.icon }}</span>
            <h3 class="font-bold text-slate-900">{{ market.name }}</h3>
            <span v-if="market.isOpen" class="ml-auto text-xs bg-green-600 text-white px-2 py-1 rounded-full font-bold">ABIERTO</span>
            <span v-else class="ml-auto text-xs bg-slate-400 text-white px-2 py-1 rounded-full font-bold">CERRADO</span>
          </div>
          <div class="text-xs text-slate-600">
            <p>⏰ {{ market.openTime }} - {{ market.closeTime }}</p>
            <p class="text-slate-500 mt-1">{{ market.timezone }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import MarketCard from './trading/MarketCard.vue';
import timezoneData from '../data/timezones.json';
import marketsData from '../data/markets.json';
import { useUserPreferences } from '../composables/useUserPreferences';
import { useMarketSchedule } from '../composables/useMarketSchedule';

const { selectedTimezone, loadPreferences } = useUserPreferences();
const { getCurrentTimeInTimezone, getActiveMarkets, getAllMarketsWithStatus, getNextOpeningMarket } = useMarketSchedule(selectedTimezone);

const availableTimezones = timezoneData.timezones;

let updateInterval = null;
const currentTimeInfo = ref(null);

// Cargar preferencias guardadas
onMounted(() => {
  loadPreferences();
  updateCurrentTime();
  // Actualizar cada minuto
  updateInterval = setInterval(updateCurrentTime, 60000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

// Actualizar hora actual
const updateCurrentTime = () => {
  if (selectedTimezone.value) {
    currentTimeInfo.value = getCurrentTimeInTimezone(selectedTimezone.value);
  }
};

// Watch para actualizar cuando cambia timezone
const onTimezoneChange = (newTz) => {
  selectedTimezone.value = newTz;
  updateCurrentTime();
};

// Mercados activos
const activeMarkets = computed(() => {
  return getActiveMarkets();
});

// Todos los mercados con estado
const allMarketsWithStatus = computed(() => {
  return getAllMarketsWithStatus();
});

// Próximo mercado a abrir
const nextMarketInfo = computed(() => {
  return getNextOpeningMarket();
});

// Hora formateada
const formatCurrentTime = computed(() => {
  if (!currentTimeInfo.value) return '--:--';
  const h = String(currentTimeInfo.value.hours).padStart(2, '0');
  const m = String(currentTimeInfo.value.minutes).padStart(2, '0');
  return `${h}:${m}`;
});

// Capitalizar nombre de mercado
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
</script>
