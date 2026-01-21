<template>
  <div class="max-w-xl mx-auto px-4 py-8 md:px-6 w-full">
    <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">
      Calculadora de Trading
    </h2>

    <!-- Estrategia Predeterminada Activa -->
    <div v-if="defaultStrategy" class="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-300 rounded-lg p-4 mb-6">
      <p class="text-xs font-semibold text-indigo-700 mb-1">📈 ESTRATEGIA ACTIVA</p>
      <p class="text-sm font-bold text-indigo-900">{{ defaultStrategy.name }}</p>
      <p class="text-xs text-indigo-800 mt-1">{{ defaultStrategy.steps.length }} pasos - <router-link to="/strategies" class="font-semibold hover:underline">Ver estrategia</router-link></p>
    </div>

    <div class="space-y-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <!-- Selector de Tipo de Posición -->
      <div class="flex gap-3 mb-4">
        <button
          @click="positionType = 'long'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200',
            positionType === 'long'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          📈 Long
        </button>
        <button
          @click="positionType = 'short'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200',
            positionType === 'short'
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
            v-model.number="initialCapital"
            @input="calculate"
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
            v-model.number="riskTotalPercentage"
            @input="calculate"
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
            v-model.number="riskOperationPercentage"
            @input="calculate"
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
            v-model.number="rewardPercentage"
            @input="calculate"
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
            v-model.number="riskRewardRatio"
            @input="calculate"
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
            v-model.number="breakEvenPercentage"
            @input="calculate"
            step="0.01"
            class="input-field"
            placeholder="0.60"
          >
          <span class="form-label-addon">%</span>
        </div>

        <div class="form-group md:col-span-2">
          <label class="form-label" for="stockPrice">
            Precio de Entrada
          </label>
          <input
            type="number"
            id="stockPrice"
            v-model.number="stockPrice"
            @input="calculate"
            step="0.01"
            class="input-field"
            placeholder="260.00"
          >
          <span class="form-label-addon">$</span>
        </div>
      </div>
    </div>

    <div v-if="hasValidInputs"
         class="result-card transform transition-all duration-300 hover:shadow-2xl">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>Resultados</span>
        <span :class="[
          'text-lg font-bold',
          positionType === 'long' ? 'text-green-600' : 'text-red-600'
        ]">
          {{ positionType === 'long' ? '📈 Long' : '📉 Short' }}
        </span>
        <span class="text-sm font-normal text-gray-400">(Estimados)</span>
      </h3>

      <div class="space-y-6">
        <!-- Lotaje Recomendado (destacado arriba) -->
        <div :class="[
          'result-row p-4 rounded-xl',
          positionType === 'long' ? 'bg-green-50/50' : 'bg-red-50/50'
        ]">
          <span class="result-label text-lg">Lotaje Recomendado</span>
          <span :class="[
            'result-value text-3xl font-bold',
            positionType === 'long' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ lotSize.toFixed(0) }}
          </span>
        </div>

        <!-- Grid de resultados en 2 columnas -->
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Riesgo Total y Riesgo por Acción -->
          <div class="result-row">
            <span class="result-label">Riesgo Total</span>
            <span class="result-value text-blue-600">
              {{ formatCurrency(riskTotalAmount) }}
            </span>
          </div>

          <div class="result-row">
            <span class="result-label">Riesgo por Acción</span>
            <span class="result-value text-blue-600">
              {{ formatCurrency(riskPerAction) }}
            </span>
          </div>

          <!-- Stop Loss y Take Profit -->
          <div class="result-row">
            <span class="result-label">Stop Loss</span>
            <div class="flex flex-col items-end">
              <span class="result-value text-red-600">{{ formatCurrency(stopLoss) }}</span>
              <span class="text-xs text-gray-400">{{ formatNumber(riskPerAction) }} points</span>
            </div>
          </div>

          <div class="result-row">
            <span class="result-label">Take Profit</span>
            <div class="flex flex-col items-end">
              <span :class="[
                'result-value',
                positionType === 'long' ? 'text-green-600' : 'text-green-600'
              ]">{{ formatCurrency(takeProfit) }}</span>
              <span class="text-xs text-gray-400">{{ formatNumber(takeProfitPoints) }} points</span>
            </div>
          </div>

          <!-- TP con R/R y BreakEven -->
          <div class="result-row">
            <span class="result-label">Take Profit (R:R)</span>
            <div class="flex flex-col items-end">
              <span :class="[
                'result-value',
                positionType === 'long' ? 'text-green-600' : 'text-green-600'
              ]">{{ formatCurrency(takeProfitRRBased) }}</span>
              <span class="text-xs text-gray-400">{{ riskRewardRatio }}:1</span>
            </div>
          </div>

          <div class="result-row">
            <span class="result-label">BreakEven</span>
            <div class="flex flex-col items-end">
              <span class="result-value text-blue-600">{{ formatCurrency(breakEvenPoint) }}</span>
              <span class="text-xs text-gray-400">{{ formatPercent(breakEvenPercentage) }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStrategies } from '../composables/useStrategies';
import { useAccountSettings } from '../composables/useAccountSettings';
import { useCurrencyFormat } from '../composables/useCurrencyFormat';

export default {
  name: 'TradingCalculator',
  setup() {
    const { getDefaultStrategy } = useStrategies();
    const { getCapitalDisponible } = useAccountSettings();
    const { formatCurrency, formatNumber, formatPercent } = useCurrencyFormat();

    return {
      defaultStrategy: computed(() => getDefaultStrategy.value),
      capitalDisponible: getCapitalDisponible,
      formatCurrency,
      formatNumber,
      formatPercent
    };
  },
  data() {
    return {
      positionType: 'long', // 'long' o 'short'
      initialCapital: 5000,
      riskTotalPercentage: 1, // Porcentaje de riesgo total del capital
      riskOperationPercentage: 0.70, // Porcentaje de riesgo por operación para SL
      rewardPercentage: 0.90, // Porcentaje de recompensa por operación para TP
      riskRewardRatio: 1.5,
      stockPrice: 260,
      breakEvenPercentage: 0.60,
      riskTotalAmount: 0,
      riskPerAction: 0,
      stopLoss: 0,
      takeProfit: 0,
      takeProfitPoints: 0,
      takeProfitRRBased: 0,
      breakEvenPoint: 0,
      lotSize: 0
    }
  },
  computed: {
    hasValidInputs() {
      return this.initialCapital > 0 &&
             this.riskTotalPercentage > 0 &&
             this.riskOperationPercentage > 0 &&
             this.riskRewardRatio > 0 &&
             this.stockPrice > 0 &&
             this.breakEvenPercentage > 0;
    }
  },
  methods: {
    calculate() {
      if (!this.hasValidInputs) return;

      // Calcular riesgo total en dinero usando capital disponible
      this.riskTotalAmount = this.initialCapital * (this.riskTotalPercentage / 100);

      // Calcular riesgo por acción en puntos
      this.riskPerAction = this.stockPrice * (this.riskOperationPercentage / 100);

      if (this.positionType === 'long') {
        // POSICIÓN LONG: Precio sube
        // Stop Loss: Precio Entrada - Riesgo
        this.stopLoss = this.stockPrice - this.riskPerAction;

        // Take Profit: Precio Entrada + Recompensa
        this.takeProfit = this.stockPrice * (1 + this.rewardPercentage / 100);

        // Puntos de Take Profit
        this.takeProfitPoints = this.takeProfit - this.stockPrice;

        // Take Profit basado en R:R
        this.takeProfitRRBased = this.stockPrice + (this.riskPerAction * this.riskRewardRatio);

        // BreakEven
        this.breakEvenPoint = this.stockPrice * (1 + this.breakEvenPercentage / 100);
      } else {
        // POSICIÓN SHORT: Precio baja
        // Stop Loss: Precio Entrada + Riesgo
        this.stopLoss = this.stockPrice + this.riskPerAction;

        // Take Profit: Precio Entrada - Recompensa
        this.takeProfit = this.stockPrice * (1 - this.rewardPercentage / 100);

        // Puntos de Take Profit
        this.takeProfitPoints = this.stockPrice - this.takeProfit;

        // Take Profit basado en R:R
        this.takeProfitRRBased = this.stockPrice - (this.riskPerAction * this.riskRewardRatio);

        // BreakEven
        this.breakEvenPoint = this.stockPrice * (1 - this.breakEvenPercentage / 100);
      }

      // Calcular Lotaje (el cálculo es igual para ambos tipos)
      this.lotSize = this.riskTotalAmount / this.riskPerAction;
    }
  },
  watch: {
    capitalDisponible(newValue) {
      // Actualizar el capital inicial cuando el disponible cambia
      this.initialCapital = newValue;
      this.calculate();
    },
    positionType() {
      // Recalcular cuando cambia el tipo de posición
      this.calculate();
    }
  },
  mounted() {
    // Inicializar con el capital disponible actual
    this.initialCapital = this.capitalDisponible;
    this.calculate();
  }
}
</script>

<style>
/* Tailwind classes are being used instead of scoped styles */
</style>