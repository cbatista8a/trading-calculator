<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Trading Journal</h1>
        <p class="text-slate-400">Registra y analiza tus operaciones de trading</p>
      </div>

      <!-- Stats Overview -->
      <div class="mb-8">
        <TradeStats :trades="trades" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form Section -->
        <div class="lg:col-span-2">
          <TradeForm @trade-added="handleTradeAdded" />
        </div>

        <!-- Account Summary -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-white mb-4">Resumen de Cuenta</h3>

          <div class="space-y-4">
            <div class="bg-slate-700 rounded p-4">
              <p class="text-sm text-slate-400 mb-1">💰 Capital Inicial</p>
              <p class="text-2xl font-bold text-white">
                {{ accountSettings.currency }} {{ formatNumber(accountSettings.amount) }}
              </p>
              <p class="text-xs text-slate-500 mt-1">Punto de partida</p>
            </div>

            <div class="bg-slate-700 rounded p-4 border border-slate-600">
              <p class="text-sm text-slate-400 mb-1">💵 Capital Disponible</p>
              <p
                class="text-2xl font-bold"
                :class="capitalDisponible >= accountSettings.amount ? 'text-green-400' : 'text-red-400'"
              >
                {{ accountSettings.currency }} {{ formatNumber(capitalDisponible) }}
              </p>
              <p class="text-xs text-slate-500 mt-1">
                {{ capitalDisponiblePercent >= 0 ? '+' : '' }}{{ Number(capitalDisponiblePercent).toFixed(2) }}% desde inicial
              </p>
            </div>

            <div class="bg-slate-700 rounded p-4">
              <p class="text-sm text-slate-400 mb-1">P&L Total</p>
              <p
                class="text-2xl font-bold"
                :class="totalPnL >= 0 ? 'text-green-400' : 'text-red-400'"
              >
                {{ formatCurrency(totalPnL) }}
              </p>
            </div>

            <div class="border-t border-slate-700 pt-4">
              <button
                @click="navigateToSettings"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors mb-2"
              >
                ⚙️ Configurar Cuenta
              </button>
              <button
                v-if="trades.length > 0"
                @click="exportData"
                class="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                📥 Exportar Datos
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Trades List -->
      <div class="mt-6">
        <TradesList :trades="trades" @trade-deleted="handleTradeDeleted" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import TradeForm from '../components/trading/TradeForm.vue'
import TradesList from '../components/trading/TradesList.vue'
import TradeStats from '../components/trading/TradeStats.vue'
import { useTradingJournal } from '../composables/useTradingJournal'
import { useAccountSettings } from '../composables/useAccountSettings'

const router = useRouter()
const { trades, addTrade, deleteTrade, getTotalPnL } = useTradingJournal()
const { settings: accountSettings, getCapitalDisponible, getCapitalDisponiblePercent } = useAccountSettings()

const totalPnL = computed(() => getTotalPnL.value)

const capitalDisponible = computed(() => {
  return getCapitalDisponible.value
})

const capitalDisponiblePercent = computed(() => {
  return getCapitalDisponiblePercent.value
})

const handleTradeAdded = (tradeData) => {
  addTrade(tradeData)

  // Show success feedback
  const message = document.createElement('div')
  message.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded shadow-lg z-50'
  message.textContent = '✓ Operación registrada exitosamente'
  document.body.appendChild(message)

  setTimeout(() => {
    message.remove()
  }, 3000)
}

const handleTradeDeleted = (tradeId) => {
  deleteTrade(tradeId)
}

const navigateToSettings = () => {
  router.push('/account-settings')
}

const exportData = () => {
  const data = {
    accountSettings: accountSettings.value,
    trades: trades.value,
    exportDate: new Date().toISOString()
  }

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `trading-journal-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(num)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value)
}

onMounted(() => {
  // Initialize account settings if they don't exist
  if (!accountSettings.value.amount) {
    router.push('/account-settings')
  }
})
</script>
