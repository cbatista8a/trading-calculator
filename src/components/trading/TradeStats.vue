<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total P&L -->
    <div
      class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg"
      :class="totalPnL >= 0 ? 'border-green-600' : 'border-red-600'"
    >
      <p class="text-slate-400 text-sm mb-1">P&L Total</p>
      <p
        class="text-3xl font-bold"
        :class="totalPnL >= 0 ? 'text-green-400' : 'text-red-400'"
      >
        {{ formatCurrency(totalPnL) }}
      </p>
      <p class="text-xs text-slate-500 mt-1">
        {{ totalPnLPercent.toFixed(2) }}%
      </p>
    </div>

    <!-- Win Rate -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg">
      <p class="text-slate-400 text-sm mb-1">Tasa de Acierto</p>
      <p class="text-3xl font-bold text-blue-400">
        {{ winRate.toFixed(1) }}%
      </p>
      <p class="text-xs text-slate-500 mt-1">
        {{ wins }}/{{ totalTrades }} trades
      </p>
    </div>

    <!-- Average Win -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg">
      <p class="text-slate-400 text-sm mb-1">Ganancia Promedio</p>
      <p class="text-3xl font-bold text-green-400">
        {{ formatCurrency(avgWin) }}
      </p>
      <p class="text-xs text-slate-500 mt-1">
        por operación ganadora
      </p>
    </div>

    <!-- Average Loss -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg">
      <p class="text-slate-400 text-sm mb-1">Pérdida Promedio</p>
      <p class="text-3xl font-bold text-red-400">
        {{ formatCurrency(avgLoss) }}
      </p>
      <p class="text-xs text-slate-500 mt-1">
        por operación perdedora
      </p>
    </div>

    <!-- Profit Factor -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg">
      <p class="text-slate-400 text-sm mb-1">Profit Factor</p>
      <p
        class="text-3xl font-bold"
        :class="profitFactor > 1.5 ? 'text-green-400' : profitFactor > 1 ? 'text-yellow-400' : 'text-red-400'"
      >
        {{ profitFactor === Infinity ? '∞' : profitFactor.toFixed(2) }}
      </p>
      <p class="text-xs text-slate-500 mt-1">
        Ganancias / Pérdidas
      </p>
    </div>

    <!-- Total Trades -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg">
      <p class="text-slate-400 text-sm mb-1">Total de Trades</p>
      <p class="text-3xl font-bold text-white">{{ totalTrades }}</p>
      <p class="text-xs text-slate-500 mt-1">
        {{ wins }} ✓ / {{ losses }} ✕
      </p>
    </div>

    <!-- Risk/Reward Ratio -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg">
      <p class="text-slate-400 text-sm mb-1">R/R Promedio</p>
      <p class="text-3xl font-bold text-purple-400">
        {{ avgRiskReward.toFixed(2) }}
      </p>
      <p class="text-xs text-slate-500 mt-1">
        Relación riesgo/recompensa
      </p>
    </div>

    <!-- Mejor Trade -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg">
      <p class="text-slate-400 text-sm mb-1">Mejor Trade</p>
      <p class="text-3xl font-bold text-green-400">
        {{ bestTrade ? formatCurrency(bestTrade.pnLMoney) : '—' }}
      </p>
      <p class="text-xs text-slate-500 mt-1">
        {{ bestTrade ? bestTrade.asset : 'Sin trades' }}
      </p>
    </div>

    <!-- Peor Trade -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-lg">
      <p class="text-slate-400 text-sm mb-1">Peor Trade</p>
      <p class="text-3xl font-bold text-red-400">
        {{ worstTrade ? formatCurrency(worstTrade.pnLMoney) : '—' }}
      </p>
      <p class="text-xs text-slate-500 mt-1">
        {{ worstTrade ? worstTrade.asset : 'Sin trades' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  trades: {
    type: Array,
    required: true
  }
})

const totalTrades = computed(() => props.trades.length)

const wins = computed(() => props.trades.filter(t => t.isWin).length)

const losses = computed(() => props.trades.filter(t => !t.isWin).length)

const winRate = computed(() => {
  if (totalTrades.value === 0) return 0
  return (wins.value / totalTrades.value) * 100
})

const totalPnL = computed(() => {
  return props.trades.reduce((sum, trade) => sum + trade.pnLMoney, 0)
})

const totalPnLPercent = computed(() => {
  if (totalTrades.value === 0) return 0
  const avgPercent = props.trades.reduce((sum, trade) => sum + trade.pnLPercent, 0)
  return avgPercent / totalTrades.value
})

const avgWin = computed(() => {
  const winTrades = props.trades.filter(t => t.isWin)
  if (winTrades.length === 0) return 0
  return winTrades.reduce((sum, trade) => sum + trade.pnLMoney, 0) / winTrades.length
})

const avgLoss = computed(() => {
  const lossTrades = props.trades.filter(t => !t.isWin)
  if (lossTrades.length === 0) return 0
  return lossTrades.reduce((sum, trade) => sum + trade.pnLMoney, 0) / lossTrades.length
})

const profitFactor = computed(() => {
  const totalWins = props.trades
    .filter(t => t.isWin)
    .reduce((sum, trade) => sum + trade.pnLMoney, 0)

  const totalLosses = Math.abs(
    props.trades
      .filter(t => !t.isWin)
      .reduce((sum, trade) => sum + trade.pnLMoney, 0)
  )

  if (totalLosses === 0) return totalWins > 0 ? Infinity : 0
  return totalWins / totalLosses
})

const avgRiskReward = computed(() => {
  if (totalTrades.value === 0) return 0
  const rrRatios = props.trades.map(trade => {
    const risk = Math.abs(trade.entryPrice - trade.stopLoss)
    const reward = Math.abs(trade.takeProfit - trade.entryPrice)
    return risk === 0 ? 0 : reward / risk
  })
  return rrRatios.reduce((sum, rr) => sum + rr, 0) / totalTrades.value
})

const bestTrade = computed(() => {
  if (totalTrades.value === 0) return null
  return props.trades.reduce((best, current) =>
    current.pnLMoney > best.pnLMoney ? current : best
  )
})

const worstTrade = computed(() => {
  if (totalTrades.value === 0) return null
  return props.trades.reduce((worst, current) =>
    current.pnLMoney < worst.pnLMoney ? current : worst
  )
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>
