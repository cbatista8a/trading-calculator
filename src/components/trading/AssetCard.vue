<template>
  <div class="border-2 border-green-300 rounded-lg p-5 bg-green-50">
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="text-2xl font-bold text-green-900">{{ asset.name }}</h3>
        <span class="text-sm text-green-600 font-semibold">{{ asset.type }}</span>
      </div>
      <span :class="getVolatilityClass(asset.volatility)">
        {{ asset.volatility }}
      </span>
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
  }
});

const getVolatilityClass = (volatility) => {
  const baseClass = 'px-3 py-1 rounded-full text-xs font-bold';
  const volatilityMap = {
    'Extrema': `${baseClass} bg-red-600 text-white`,
    'Muy Alta': `${baseClass} bg-orange-600 text-white`,
    'Alta': `${baseClass} bg-yellow-600 text-white`,
    'Media-Alta': `${baseClass} bg-blue-600 text-white`
  };
  return volatilityMap[volatility] || baseClass + ' bg-blue-600 text-white';
};
</script>
