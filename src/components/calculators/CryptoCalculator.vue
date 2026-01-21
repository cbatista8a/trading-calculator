<template>
  <div class="max-w-xl mx-auto px-4 py-8 md:px-6 w-full">
    <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">
      🪙 Calculadora de Crypto
    </h2>

    <div class="space-y-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <!-- Selector de Tipo de Posición -->
      <div class="flex gap-3 mb-4">
        <button
          @click="calculator.setPositionType('long')"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200',
            calculator.positionType.value === 'long'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          📈 Long
        </button>
        <button
          @click="calculator.setPositionType('short')"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200',
            calculator.positionType.value === 'short'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          📉 Short
        </button>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="form-group">
          <label class="form-label" for="initialCapital">
            Capital Inicial
          </label>
          <input
            type="number"
            id="initialCapital"
            v-model.number="calculator.initialCapital.value"
            @input="calculator.calculate"
            class="input-field"
            placeholder="5000"
          >
          <span class="form-label-addon">$</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="riskPercentage">
            Riesgo Total
          </label>
          <input
            type="number"
            id="riskPercentage"
            v-model.number="calculator.riskTotalPercentage.value"
            @input="calculator.calculate"
            step="0.01"
            class="input-field"
            placeholder="1.00"
          >
          <span class="form-label-addon">%</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="riskOperationPercentage">
            Stop Loss (SL)
          </label>
          <input
            type="number"
            id="riskOperationPercentage"
            v-model.number="calculator.riskOperationPercentage.value"
            @input="calculator.calculate"
            step="0.01"
            class="input-field"
            placeholder="0.70"
          >
          <span class="form-label-addon">%</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="rewardOperationPercentage">
            Take Profit (TP)
          </label>
          <input
            type="number"
            id="rewardOperationPercentage"
            v-model.number="calculator.rewardPercentage.value"
            @input="calculator.calculate"
            step="0.01"
            class="input-field"
            placeholder="0.90"
          >
          <span class="form-label-addon">%</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="riskRewardRatio">
            Ratio R:R
          </label>
          <input
            type="number"
            id="riskRewardRatio"
            v-model.number="calculator.riskRewardRatio.value"
            @input="calculator.calculate"
            step="0.1"
            class="input-field"
            placeholder="1.5"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="breakEvenPercentage">
            BreakEven
          </label>
          <input
            type="number"
            id="breakEvenPercentage"
            v-model.number="calculator.breakEvenPercentage.value"
            @input="calculator.calculate"
            step="0.01"
            class="input-field"
            placeholder="0.60"
          >
          <span class="form-label-addon">%</span>
        </div>

        <div class="form-group md:col-span-2">
          <label class="form-label" for="cryptoPrice">
            Precio de Entrada
          </label>
          <input
            type="number"
            id="cryptoPrice"
            v-model.number="calculator.stockPrice.value"
            @input="calculator.calculate"
            step="0.0001"
            class="input-field"
            placeholder="45250.50"
          >
          <span class="form-label-addon">$</span>
        </div>
      </div>
    </div>

    <div v-if="calculator.hasValidInputs.value"
         class="result-card transform transition-all duration-300 hover:shadow-2xl">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>Resultados</span>
        <span :class="[
          'text-lg font-bold',
          calculator.positionType.value === 'long' ? 'text-green-600' : 'text-red-600'
        ]">
          {{ calculator.positionType.value === 'long' ? '📈 Long' : '📉 Short' }}
        </span>
        <span class="text-sm font-normal text-gray-400">(Estimados)</span>
      </h3>

      <div class="space-y-6">
        <!-- Lotaje Recomendado (destacado arriba) -->
        <div :class="[
          'result-row p-4 rounded-xl',
          calculator.positionType.value === 'long' ? 'bg-green-50/50' : 'bg-red-50/50'
        ]">
          <span class="result-label text-lg">Cantidad Recomendada</span>
          <span :class="[
            'result-value text-3xl font-bold',
            calculator.positionType.value === 'long' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ calculator.lotSize.value.toFixed(4) }}
          </span>
        </div>

        <!-- Grid de resultados en 2 columnas -->
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Riesgo Total y Riesgo por Unidad -->
          <div class="result-row">
            <span class="result-label">Riesgo Total</span>
            <span class="result-value text-blue-600">
              {{ formatCurrency(calculator.riskTotalAmount.value) }}
            </span>
          </div>

          <div class="result-row">
            <span class="result-label">Riesgo por Unidad</span>
            <span class="result-value text-blue-600">
              {{ formatCurrency(calculator.riskPerAction.value) }}
            </span>
          </div>

          <!-- Stop Loss y Take Profit -->
          <div class="result-row">
            <span class="result-label">Stop Loss</span>
            <div class="flex flex-col items-end">
              <span class="result-value text-red-600">{{ formatCurrency(calculator.stopLoss.value) }}</span>
              <span class="text-xs text-gray-400">{{ formatNumber(calculator.riskPerAction.value) }} puntos</span>
            </div>
          </div>

          <div class="result-row">
            <span class="result-label">Take Profit</span>
            <div class="flex flex-col items-end">
              <span :class="[
                'result-value',
                calculator.positionType.value === 'long' ? 'text-green-600' : 'text-green-600'
              ]">{{ formatCurrency(calculator.takeProfit.value) }}</span>
              <span class="text-xs text-gray-400">{{ formatNumber(calculator.takeProfitPoints.value) }} puntos</span>
            </div>
          </div>

          <!-- TP con R/R y BreakEven -->
          <div class="result-row">
            <span class="result-label">Take Profit (R:R)</span>
            <div class="flex flex-col items-end">
              <span :class="[
                'result-value',
                calculator.positionType.value === 'long' ? 'text-green-600' : 'text-green-600'
              ]">{{ formatCurrency(calculator.takeProfitRRBased.value) }}</span>
              <span class="text-xs text-gray-400">{{ calculator.riskRewardRatio.value }}:1</span>
            </div>
          </div>

          <div class="result-row">
            <span class="result-label">BreakEven</span>
            <div class="flex flex-col items-end">
              <span class="result-value text-blue-600">{{ formatCurrency(calculator.breakEvenPoint.value) }}</span>
              <span class="text-xs text-gray-400">{{ formatPercent(calculator.breakEvenPercentage.value) }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useAccountSettings } from '../../composables/useAccountSettings';
import { useCurrencyFormat } from '../../composables/useCurrencyFormat';
import { useStockCalculator } from '../../composables/calculators/useStockCalculator';

export default {
  name: 'CryptoCalculator',
  setup() {
    const { getCapitalDisponible } = useAccountSettings();
    const { formatCurrency, formatNumber, formatPercent } = useCurrencyFormat();

    // Inicializar calculator con capital disponible
    const calculator = useStockCalculator(ref(getCapitalDisponible.value));

    // Watchers
    watch(getCapitalDisponible, (newValue) => {
      calculator.updateInitialCapital(newValue);
    });

    // Inicializar en mounted
    onMounted(() => {
      calculator.updateInitialCapital(getCapitalDisponible.value);
    });

    return {
      calculator,
      formatCurrency,
      formatNumber,
      formatPercent
    };
  }
}
</script>

<style>
/* Tailwind classes are being used instead of scoped styles */
</style>
