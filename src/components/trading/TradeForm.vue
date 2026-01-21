<template>
  <div class="bg-slate-800 rounded-lg border border-slate-700 p-6 shadow-xl">
    <h2 class="text-xl font-semibold text-white mb-6">Registrar Nueva Operación</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Asset -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Asset</label>
          <input
            v-model="form.asset"
            type="text"
            placeholder="ej. EURUSD, AAPL, BTC"
            class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Asset Type -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Tipo de Asset</label>
          <select
            v-model="form.assetType"
            class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
            @change="updateLeverage"
          >
            <option value="">Selecciona tipo</option>
            <option value="forex">Forex</option>
            <option value="stock">Stock</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>

        <!-- Operation -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Operación</label>
          <div class="flex gap-2">
            <button
              type="button"
              @click="form.operation = 'Long'"
              :class="[
                'flex-1 py-2 px-3 rounded font-medium transition-colors',
                form.operation === 'Long'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              ]"
            >
              📈 Long
            </button>
            <button
              type="button"
              @click="form.operation = 'Short'"
              :class="[
                'flex-1 py-2 px-3 rounded font-medium transition-colors',
                form.operation === 'Short'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              ]"
            >
              📉 Short
            </button>
          </div>
        </div>

        <!-- Volumen -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Volumen (Lotes/Acciones)</label>
          <input
            v-model.number="form.volume"
            type="number"
            step="0.01"
            placeholder="ej. 1.5"
            class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Precio de Entrada -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Precio de Entrada</label>
          <input
            v-model.number="form.entryPrice"
            type="number"
            step="0.00001"
            placeholder="ej. 1.0850"
            class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Precio de Salida -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Precio de Salida</label>
          <input
            v-model.number="form.exitPrice"
            type="number"
            step="0.00001"
            placeholder="ej. 1.0950"
            class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Stop Loss -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Stop Loss</label>
          <input
            v-model.number="form.stopLoss"
            type="number"
            step="0.00001"
            placeholder="ej. 1.0800"
            class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Take Profit -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Take Profit</label>
          <input
            v-model.number="form.takeProfit"
            type="number"
            step="0.00001"
            placeholder="ej. 1.1000"
            class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Leverage -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Leverage</label>
          <input
            v-model.number="form.leverage"
            type="number"
            step="0.1"
            min="1"
            placeholder="ej. 1"
            class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <!-- Preview -->
      <div
        v-if="form.asset && form.operation && form.entryPrice && form.exitPrice"
        class="bg-slate-700 rounded p-4 mt-4"
      >
        <p class="text-sm font-medium text-slate-300 mb-2">Vista Previa:</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p class="text-slate-500">Tipo</p>
            <p class="text-white font-semibold">{{ form.operation }}</p>
          </div>
          <div>
            <p class="text-slate-500">Riesgo/Recompensa</p>
            <p
              :class="[
                'font-semibold',
                riskRewardRatio >= 1 ? 'text-green-400' : 'text-yellow-400'
              ]"
            >
              1:{{ riskRewardRatio.toFixed(2) }}
            </p>
          </div>
          <div>
            <p class="text-slate-500">P&L Estimado</p>
            <p
              :class="[
                'font-semibold',
                pnLMoney >= 0 ? 'text-green-400' : 'text-red-400'
              ]"
            >
              {{ formatCurrency(pnLMoney) }}
            </p>
          </div>
          <div>
            <p class="text-slate-500">Margen Requerido</p>
            <p class="text-white font-semibold">{{ formatCurrency(requiredMargin) }}</p>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors mt-6"
      >
        Registrar Operación
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useAccountSettings } from '../../composables/useAccountSettings'
import { useCurrencyFormat } from '../../composables/useCurrencyFormat'

const { getLeverage } = useAccountSettings()
const { formatCurrency } = useCurrencyFormat()

const emit = defineEmits(['trade-added'])

const form = reactive({
  asset: '',
  assetType: '',
  operation: '',
  volume: null,
  entryPrice: null,
  exitPrice: null,
  stopLoss: null,
  takeProfit: null,
  leverage: 1
})

const updateLeverage = () => {
  if (form.assetType) {
    form.leverage = getLeverage(form.assetType)
  }
}

const priceDifference = computed(() => {
  if (!form.entryPrice || !form.exitPrice) return 0
  return form.operation === 'Long'
    ? form.exitPrice - form.entryPrice
    : form.entryPrice - form.exitPrice
})

const pnLMoney = computed(() => {
  if (!form.volume || !form.entryPrice) return 0
  // P&L se calcula sin leverage: (precio diferencia) * volumen
  // El leverage solo afecta el margen requerido, no el P&L base
  return priceDifference.value * form.volume
})

const requiredMargin = computed(() => {
  if (!form.entryPrice || !form.volume || !form.leverage) return 0
  // Margen requerido = (precio entrada * volumen) / leverage
  return (form.entryPrice * form.volume) / form.leverage
})

const riskRewardRatio = computed(() => {
  if (!form.entryPrice) return 0
  const risk = Math.abs(form.entryPrice - form.stopLoss)
  const reward = Math.abs(form.takeProfit - form.entryPrice)
  return risk === 0 ? 0 : reward / risk
})

const handleSubmit = () => {
  emit('trade-added', { ...form })

  // Reset form
  form.asset = ''
  form.assetType = ''
  form.operation = ''
  form.volume = null
  form.entryPrice = null
  form.exitPrice = null
  form.stopLoss = null
  form.takeProfit = null
  form.leverage = 1
}

</script>
