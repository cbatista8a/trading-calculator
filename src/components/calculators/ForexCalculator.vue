<template>
  <div class="max-w-xl mx-auto px-4 py-8 md:px-6 w-full">
    <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">
      💱 Calculadora de Forex
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
          <label class="form-label" for="stopLossPips">
            Stop Loss (Pips)
          </label>
          <input
            type="number"
            id="stopLossPips"
            v-model.number="calculator.stopLossPips.value"
            @input="calculator.calculate"
            step="1"
            class="input-field"
            placeholder="50"
          >
          <span class="form-label-addon">pips</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="takeProfitPips">
            Take Profit (Pips)
          </label>
          <input
            type="number"
            id="takeProfitPips"
            v-model.number="calculator.takeProfitPips.value"
            @input="calculator.calculate"
            step="1"
            class="input-field"
            placeholder="100"
          >
          <span class="form-label-addon">pips</span>
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
          <label class="form-label" for="lotSize">
            Tamaño de Lote
          </label>
          <input
            type="number"
            id="lotSize"
            v-model.number="calculator.lotSize.value"
            @input="calculator.calculate"
            step="0.01"
            class="input-field"
            placeholder="1"
          >
          <span class="form-label-addon">lotes</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="breakEvenPercentage">
            BreakEven (%)
          </label>
          <input
            type="number"
            id="breakEvenPercentage"
            v-model.number="calculator.breakEvenPercentage.value"
            @input="calculator.calculate"
            step="0.01"
            class="input-field"
            placeholder="0.50"
          >
          <span class="form-label-addon">%</span>
        </div>

        <div class="form-group md:col-span-2">
          <label class="form-label" for="entryPrice">
            Precio de Entrada
          </label>
          <input
            type="number"
            id="entryPrice"
            v-model.number="calculator.entryPrice.value"
            @input="calculator.calculate"
            step="0.00001"
            class="input-field"
            placeholder="1.0850"
          >
          <span class="form-label-addon">precio</span>
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
        <!-- Lotaje Recomendado -->
        <div :class="[
          'result-row p-4 rounded-xl',
          calculator.positionType.value === 'long' ? 'bg-green-50/50' : 'bg-red-50/50'
        ]">
          <span class="result-label text-lg">Lotaje Recomendado</span>
          <span :class="[
            'result-value text-3xl font-bold',
            calculator.positionType.value === 'long' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ calculator.recommendedLotSize.value.toFixed(2) }}
          </span>
        </div>

        <!-- Grid de resultados en 2 columnas -->
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Riesgo Total y Riesgo por Pip -->
          <div class="result-row">
            <span class="result-label">Riesgo Total</span>
            <span class="result-value text-blue-600">
              {{ formatCurrency(calculator.riskTotalAmount.value) }}
            </span>
          </div>

          <div class="result-row">
            <span class="result-label">Riesgo por Pip</span>
            <span class="result-value text-blue-600">
              {{ formatCurrency(calculator.riskPerPip.value) }}
            </span>
          </div>

          <!-- Stop Loss y Take Profit en Precio -->
          <div class="result-row">
            <span class="result-label">Stop Loss</span>
            <div class="flex flex-col items-end">
              <span class="result-value text-red-600">{{ formatNumber(calculator.stopLoss.value, 5) }}</span>
              <span class="text-xs text-gray-400">{{ calculator.stopLossPips.value }} pips</span>
            </div>
          </div>

          <div class="result-row">
            <span class="result-label">Take Profit</span>
            <div class="flex flex-col items-end">
              <span class="result-value text-green-600">{{ formatNumber(calculator.takeProfit.value, 5) }}</span>
              <span class="text-xs text-gray-400">{{ calculator.takeProfitPips.value }} pips</span>
            </div>
          </div>

          <!-- TP con R:R y BreakEven -->
          <div class="result-row">
            <span class="result-label">Take Profit (R:R)</span>
            <div class="flex flex-col items-end">
              <span class="result-value text-green-600">{{ formatNumber(calculator.takeProfitRRBased.value, 5) }}</span>
              <span class="text-xs text-gray-400">{{ calculator.takeProfitPipsRRBased.value }} pips</span>
            </div>
          </div>

          <div class="result-row">
            <span class="result-label">BreakEven</span>
            <div class="flex flex-col items-end">
              <span class="result-value text-blue-600">{{ formatNumber(calculator.breakEvenPrice.value, 5) }}</span>
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
import { useForexCalculator } from '../../composables/calculators/useForexCalculator';

export default {
  name: 'ForexCalculator',
  setup() {
    const { getCapitalDisponible } = useAccountSettings();
    const { formatCurrency, formatNumber, formatPercent } = useCurrencyFormat();

    // Inicializar calculator con capital disponible
    const calculator = useForexCalculator(ref(getCapitalDisponible.value));

    // Watcher para capital disponible
    watch(getCapitalDisponible, (newValue) => {
      calculator.updateInitialCapital(newValue);
    });

    // Inicializar en mounted
    onMounted(() => {
      calculator.updateInitialCapital(getCapitalDisponible.value);
    });

    // Función auxiliar para formatear números con decimales específicos
    const formatNumberWithDecimals = (value, decimals = 2) => {
      return Number(value).toFixed(decimals);
    };

    return {
      calculator,
      formatCurrency,
      formatNumber: (value, decimals = 2) => formatNumberWithDecimals(value, decimals),
      formatPercent
    };
  }
}
</script>

<style>
/* Tailwind classes are being used instead of scoped styles */
</style>
