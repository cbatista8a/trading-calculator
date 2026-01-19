<template>
  <div class="bg-slate-100 rounded-lg p-4">
    <div class="flex items-center gap-2 mb-2">
      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke-width="2"/>
        <path d="M12 2a10 10 0 0 1 10 10M2 12a10 10 0 0 1 10-10" stroke-width="2"/>
        <ellipse cx="12" cy="12" rx="10" ry="3" stroke-width="2"/>
      </svg>
      <h3 class="font-bold text-slate-800">Mercados Activos:</h3>
    </div>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(market, idx) in markets"
        :key="idx"
        class="px-3 py-1 bg-white rounded-full text-sm font-semibold text-slate-700 border-2 border-slate-300"
      >
        {{ market }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  markets: {
    type: Array,
    required: true
  }
});
</script>
