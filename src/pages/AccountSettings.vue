<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Configuración de Cuenta</h1>
        <p class="text-slate-400">Configura los parámetros de tu cuenta de trading</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Account Information Card -->
        <div class="lg:col-span-2">
          <div class="bg-slate-800 rounded-lg border border-slate-700 p-6 shadow-xl">
            <h2 class="text-xl font-semibold text-white mb-6">Información de Cuenta</h2>

            <!-- Amount -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-300 mb-2">
                Capital de Trading
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="formData.amount"
                  type="number"
                  step="100"
                  class="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Ingresa el capital"
                />
                <span class="text-slate-400">{{ formData.currency }}</span>
              </div>
              <p class="mt-1 text-xs text-slate-500">
                Capital total disponible para operar
              </p>
            </div>

            <!-- Currency -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-300 mb-2">
                Moneda
              </label>
              <select
                v-model="formData.currency"
                class="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
                <option>AUD</option>
              </select>
            </div>

            <!-- Leverage Settings -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-white mb-4">Leverages por Tipo de Asset</h3>
              <div class="space-y-4">
                <!-- Forex Leverage -->
                <div class="bg-slate-700 rounded p-4">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-slate-300">
                      <span class="inline-block w-6 h-6 bg-blue-500 rounded-full mr-2 text-center text-white text-xs leading-6">€</span>
                      Forex
                    </label>
                    <span class="text-2xl font-bold text-blue-400">{{ formData.leverages.forex }}x</span>
                  </div>
                  <input
                    v-model.number="formData.leverages.forex"
                    type="range"
                    min="1"
                    max="500"
                    class="w-full"
                  />
                  <p class="mt-1 text-xs text-slate-500">Máximo leverage recomendado: 100x</p>
                </div>

                <!-- Stock Leverage -->
                <div class="bg-slate-700 rounded p-4">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-slate-300">
                      <span class="inline-block w-6 h-6 bg-green-500 rounded-full mr-2 text-center text-white text-xs leading-6">📈</span>
                      Stocks
                    </label>
                    <span class="text-2xl font-bold text-green-400">{{ formData.leverages.stock }}x</span>
                  </div>
                  <input
                    v-model.number="formData.leverages.stock"
                    type="range"
                    min="1"
                    max="10"
                    class="w-full"
                  />
                  <p class="mt-1 text-xs text-slate-500">Máximo leverage recomendado: 4x</p>
                </div>

                <!-- Crypto Leverage -->
                <div class="bg-slate-700 rounded p-4">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-slate-300">
                      <span class="inline-block w-6 h-6 bg-orange-500 rounded-full mr-2 text-center text-white text-xs leading-6">₿</span>
                      Crypto
                    </label>
                    <span class="text-2xl font-bold text-orange-400">{{ formData.leverages.crypto }}x</span>
                  </div>
                  <input
                    v-model.number="formData.leverages.crypto"
                    type="range"
                    min="1"
                    max="100"
                    class="w-full"
                  />
                  <p class="mt-1 text-xs text-slate-500">Máximo leverage recomendado: 20x</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 mt-8">
              <button
                @click="saveSettings"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Guardar Configuración
              </button>
              <button
                @click="resetToDefaults"
                class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Card -->
        <div>
          <div class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg border border-blue-700 p-6 shadow-xl">
            <h3 class="text-lg font-semibold text-white mb-4">Resumen</h3>

            <div class="space-y-4">
              <div class="bg-blue-700 bg-opacity-50 rounded p-4">
                <p class="text-xs text-blue-300 mb-1">Capital Disponible</p>
                <p class="text-2xl font-bold text-white">
                  {{ formData.currency }} {{ formatNumber(formData.amount) }}
                </p>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-300">Forex Leverage</span>
                  <span class="font-semibold text-blue-400">{{ formData.leverages.forex }}x</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-300">Stock Leverage</span>
                  <span class="font-semibold text-green-400">{{ formData.leverages.stock }}x</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-300">Crypto Leverage</span>
                  <span class="font-semibold text-orange-400">{{ formData.leverages.crypto }}x</span>
                </div>
              </div>

              <div class="border-t border-blue-700 pt-4 mt-4">
                <p class="text-xs text-blue-300 mb-2">⚠️ Recomendaciones:</p>
                <ul class="text-xs text-blue-200 space-y-1">
                  <li>• Usa leverage conservador</li>
                  <li>• Mantén SL siempre activos</li>
                  <li>• Riesgo: 1-2% por trade</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useAccountSettings } from '../composables/useAccountSettings'

const { settings, updateSettings, resetSettings } = useAccountSettings()

const formData = reactive({
  amount: 1000,
  currency: 'EUR',
  leverages: {
    forex: 10,
    stock: 1,
    crypto: 10
  }
})

onMounted(() => {
  if (settings.value) {
    formData.amount = settings.value.amount
    formData.currency = settings.value.currency
    formData.leverages = { ...settings.value.leverages }
  }
})

const saveSettings = () => {
  updateSettings({
    amount: formData.amount,
    currency: formData.currency,
    leverages: { ...formData.leverages }
  })

  // Visual feedback
  const button = event.target
  const originalText = button.textContent
  button.textContent = '✓ Guardado'
  button.classList.add('bg-green-600')
  button.classList.remove('bg-blue-600')

  setTimeout(() => {
    button.textContent = originalText
    button.classList.remove('bg-green-600')
    button.classList.add('bg-blue-600')
  }, 2000)
}

const resetToDefaults = () => {
  resetSettings()
  formData.amount = settings.value.amount
  formData.currency = settings.value.currency
  formData.leverages = { ...settings.value.leverages }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(num)
}
</script>

<style scoped>
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #3b82f6, #3b82f6);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  outline: none;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #1e293b;
}

input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #1e293b;
}
</style>
