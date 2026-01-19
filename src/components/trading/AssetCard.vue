<template>
  <div :class="[isPrimary ? 'border-4 border-green-500 bg-green-50 shadow-lg' : 'border-2 border-green-300 bg-green-50', 'rounded-lg p-5']">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <div class="flex items-center gap-3">
          <div v-if="rank" :class="[isPrimary ? 'text-2xl font-bold text-white w-8 h-8 flex items-center justify-center rounded-full' : 'text-lg font-bold text-green-700', isPrimary ? 'bg-green-600' : '']">
            #{{ rank }}
          </div>
          <div>
            <h3 class="text-2xl font-bold text-green-900">{{ asset.name }}</h3>
            <span class="text-sm text-green-600 font-semibold">{{ asset.type }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <span :class="getVolatilityClass(asset.volatility)">
          Vol: {{ (asset.volatility * 10).toFixed(0) }}%
        </span>
        <span v-if="isPrimary" class="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
          ⭐ PRINCIPAL
        </span>
      </div>
    </div>

    <div class="space-y-3">
      <div class="bg-white rounded p-3 border border-green-200">
        <div class="text-xs text-green-600 font-semibold mb-1">Movimiento Promedio</div>
        <div class="text-lg font-bold text-green-900">{{ asset.avgPips }}</div>
      </div>

      <div class="bg-white rounded p-3 border border-green-200">
        <div class="text-xs text-green-600 font-semibold mb-1">Mejor Horario</div>
        <div class="text-sm font-bold text-green-900">{{ asset.bestHours }}</div>
      </div>

      <div class="bg-white rounded p-3 border border-green-200">
        <div class="text-xs text-green-600 font-semibold mb-1">RR Potencial</div>
        <div class="text-xl font-bold text-green-900">{{ asset.rrPotential }}</div>
      </div>

      <div class="bg-blue-50 rounded p-3 border border-blue-200">
        <div class="text-xs text-blue-600 font-semibold mb-1">¿Por qué operar?</div>
        <div class="text-sm text-blue-900">{{ asset.whyGood }}</div>
      </div>

      <div class="bg-yellow-50 rounded p-3 border border-yellow-300">
        <div class="text-xs text-yellow-700 font-semibold mb-1">💡 Tips Clave</div>
        <div class="text-sm text-yellow-900">{{ asset.tips }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  asset: {
    type: Object,
    required: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  rank: {
    type: Number,
    default: null
  }
});

const getVolatilityClass = (volatility) => {
  const baseClass = 'px-3 py-1 rounded-full text-xs font-bold';

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
</script>
