<template>
  <div class="bg-slate-800 rounded-lg border border-slate-700 p-6 shadow-xl">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-white">Resumen de Operaciones</h2>
      <div class="flex gap-2">
        <button
          v-if="trades.length > 0"
          @click="toggleFilter"
          class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded transition-colors"
        >
          {{ showWinsOnly ? '📊 Todas' : '✓ Ganancias' }}
        </button>
      </div>
    </div>

    <div v-if="trades.length === 0" class="text-center py-12">
      <p class="text-slate-400 text-lg">No hay operaciones registradas aún</p>
      <p class="text-slate-500 text-sm mt-2">Comienza registrando tu primera operación</p>
    </div>

    <div v-else class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="trade in filteredTrades"
        :key="trade.id"
        class="bg-slate-700 rounded p-4 border-l-4"
        :class="trade.isWin ? 'border-green-500' : 'border-red-500'"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              :class="trade.operation === 'Long' ? 'bg-green-900' : 'bg-red-900'"
            >
              <span :class="trade.operation === 'Long' ? 'text-green-400' : 'text-red-400'">
                {{ trade.operation === 'Long' ? '↑' : '↓' }}
              </span>
            </div>
            <div>
              <p class="font-semibold text-white">{{ trade.asset }}</p>
              <p class="text-xs text-slate-400">
                {{ new Date(trade.timestamp).toLocaleDateString('es-ES') }}
              </p>
            </div>
          </div>
          <button
            @click="deleteTradeHandler(trade.id)"
            class="text-slate-500 hover:text-red-400 transition-colors p-2"
            title="Eliminar operación"
          >
            ✕
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
          <div>
            <p class="text-slate-500">Volumen</p>
            <p class="text-white font-medium">{{ trade.volume }}</p>
          </div>
          <div>
            <p class="text-slate-500">Entrada</p>
            <p class="text-white font-medium">{{ formatPrice(trade.entryPrice) }}</p>
          </div>
          <div>
            <p class="text-slate-500">Salida</p>
            <p class="text-white font-medium">{{ formatPrice(trade.exitPrice) }}</p>
          </div>
          <div>
            <p class="text-slate-500">Leverage</p>
            <p class="text-white font-medium">{{ trade.leverage }}x</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-slate-600 bg-opacity-50 rounded">
          <div>
            <p class="text-xs text-slate-400">P&L ($)</p>
            <p
              :class="[
                'text-lg font-bold',
                trade.pnLMoney >= 0 ? 'text-green-400' : 'text-red-400'
              ]"
            >
              {{ formatCurrency(trade.pnLMoney) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-400">P&L (%)</p>
            <p
              :class="[
                'text-lg font-bold',
                trade.pnLPercent >= 0 ? 'text-green-400' : 'text-red-400'
              ]"
            >
              {{ (trade.pnLPercent).toFixed(2) }}%
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-400">RR Ratio</p>
            <p class="text-lg font-bold text-blue-400">
              1:{{ calculateRR(trade).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  trades: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['trade-deleted'])

const showWinsOnly = ref(false)

const filteredTrades = computed(() => {
  if (!showWinsOnly.value) return props.trades
  return props.trades.filter(t => t.isWin)
})

const toggleFilter = () => {
  showWinsOnly.value = !showWinsOnly.value
}

const deleteTradeHandler = (tradeId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta operación?')) {
    emit('trade-deleted', tradeId)
  }
}

const formatPrice = (price) => {
  return parseFloat(price).toFixed(4)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const calculateRR = (trade) => {
  const risk = Math.abs(trade.entryPrice - trade.stopLoss)
  const reward = Math.abs(trade.takeProfit - trade.entryPrice)
  return risk === 0 ? 0 : reward / risk
}
</script>
