import { ref, computed } from 'vue';
import { useCalculatorCommon } from './usCalculatorCommon';

/**
 * Composable especializado para cálculos de Forex
 * Soporta posiciones Long y Short con conversión de pips
 */
export function useForexCalculator(initialCapitalRef = null) {
  const common = useCalculatorCommon();

  // Estado reactivo
  const positionType = ref('long'); // 'long' o 'short'
  const initialCapital = initialCapitalRef || ref(5000);
  const riskTotalPercentage = ref(1);
  const stopLossPips = ref(50); // Stop Loss en pips
  const takeProfitPips = ref(100); // Take Profit en pips
  const riskRewardRatio = ref(1.5);
  const entryPrice = ref(1.0850);
  const lotSize = ref(1); // Lotes para calcular riesgo monetario
  const breakEvenPercentage = ref(0.5); // En porcentaje para visualización

  // Resultados computados
  const riskTotalAmount = ref(0);
  const riskPerPip = ref(0);
  const riskPerLot = ref(0);
  const stopLoss = ref(0);
  const takeProfit = ref(0);
  const takeProfitPipsRRBased = ref(0);
  const takeProfitRRBased = ref(0);
  const breakEvenPrice = ref(0);
  const recommendedLotSize = ref(0);

  /**
   * Valida que los inputs de Forex sean válidos
   */
  const hasValidInputs = computed(() => {
    return (
      initialCapital.value > 0 &&
      riskTotalPercentage.value > 0 &&
      stopLossPips.value > 0 &&
      takeProfitPips.value > 0 &&
      riskRewardRatio.value > 0 &&
      entryPrice.value > 0 &&
      lotSize.value > 0
    );
  });

  /**
   * Convierte pips a precio (considerando pares normales y JPY)
   * @param {number} pips - Cantidad de pips
   * @param {boolean} isJPY - Si el par es JPY (0.01 por pip en lugar de 0.0001)
   * @returns {number} Valor del pip en puntos de precio
   */
  const pipsToPrice = (pips, isJPY = false) => {
    const pipValue = isJPY ? 0.01 : 0.0001;
    return pips * pipValue;
  };

  /**
   * Convierte precio a pips
   * @param {number} priceMove - Movimiento de precio
   * @param {boolean} isJPY - Si el par es JPY
   * @returns {number} Cantidad de pips
   */
  const priceToPips = (priceMove, isJPY = false) => {
    const pipValue = isJPY ? 0.01 : 0.0001;
    return Math.round(priceMove / pipValue);
  };

  /**
   * Calcula riesgo por pip basado en lotes
   * El riesgo por pip típicamente es: lotes * 10 dólares (en pares como EURUSD)
   */
  const calculateRiskPerPip = () => {
    // Para cálculos simplificados: 1 lote = $10 por pip en pares normales
    // En pares JPY: 1 lote = $1 por pip
    return lotSize.value * 10;
  };

  /**
   * Calcula todos los valores para posiciones de Forex
   * Soporta Long y Short automáticamente
   */
  const calculate = () => {
    if (!hasValidInputs.value) return;

    // Calcular riesgo total en dinero
    riskTotalAmount.value = common.calculateTotalRisk(
      initialCapital.value,
      riskTotalPercentage.value
    );

    // Calcular riesgo por pip
    riskPerPip.value = calculateRiskPerPip();

    // Calcular riesgo total en dinero del SL actual
    riskPerLot.value = stopLossPips.value * riskPerPip.value;

    if (positionType.value === 'long') {
      // POSICIÓN LONG: Precio sube
      // Stop Loss: Precio Entrada - SL pips
      stopLoss.value = entryPrice.value - pipsToPrice(stopLossPips.value);

      // Take Profit: Precio Entrada + TP pips
      takeProfit.value = entryPrice.value + pipsToPrice(takeProfitPips.value);

      // Take Profit basado en R:R (en pips)
      takeProfitPipsRRBased.value = Math.round(stopLossPips.value * riskRewardRatio.value);
      takeProfitRRBased.value = entryPrice.value + pipsToPrice(takeProfitPipsRRBased.value);

      // BreakEven: Entrada + breakEvenPercentage
      breakEvenPrice.value = entryPrice.value * (1 + breakEvenPercentage.value / 100);
    } else {
      // POSICIÓN SHORT: Precio baja
      // Stop Loss: Precio Entrada + SL pips
      stopLoss.value = entryPrice.value + pipsToPrice(stopLossPips.value);

      // Take Profit: Precio Entrada - TP pips
      takeProfit.value = entryPrice.value - pipsToPrice(takeProfitPips.value);

      // Take Profit basado en R:R (en pips)
      takeProfitPipsRRBased.value = Math.round(stopLossPips.value * riskRewardRatio.value);
      takeProfitRRBased.value = entryPrice.value - pipsToPrice(takeProfitPipsRRBased.value);

      // BreakEven: Entrada - breakEvenPercentage
      breakEvenPrice.value = entryPrice.value * (1 - breakEvenPercentage.value / 100);
    }

    // Calcular lotaje recomendado basado en riesgo total
    // recommendedLotSize = riesgo total / riesgo por pip / pips de SL
    recommendedLotSize.value = riskTotalAmount.value / (riskPerPip.value * stopLossPips.value);
  };

  /**
   * Reset a valores por defecto
   */
  const reset = () => {
    positionType.value = 'long';
    initialCapital.value = 5000;
    riskTotalPercentage.value = 1;
    stopLossPips.value = 50;
    takeProfitPips.value = 100;
    riskRewardRatio.value = 1.5;
    entryPrice.value = 1.0850;
    lotSize.value = 1;
    breakEvenPercentage.value = 0.5;
    calculate();
  };

  /**
   * Actualiza el capital inicial y recalcula
   */
  const updateInitialCapital = (newCapital) => {
    initialCapital.value = newCapital;
    calculate();
  };

  /**
   * Cambia el tipo de posición y recalcula
   */
  const setPositionType = (type) => {
    if (['long', 'short'].includes(type)) {
      positionType.value = type;
      calculate();
    }
  };

  /**
   * Exporta los resultados actuales
   */
  const exportResults = () => {
    return {
      positionType: positionType.value,
      inputs: {
        initialCapital: initialCapital.value,
        riskTotalPercentage: riskTotalPercentage.value,
        stopLossPips: stopLossPips.value,
        takeProfitPips: takeProfitPips.value,
        riskRewardRatio: riskRewardRatio.value,
        entryPrice: entryPrice.value,
        lotSize: lotSize.value,
        breakEvenPercentage: breakEvenPercentage.value
      },
      results: {
        riskTotalAmount: riskTotalAmount.value,
        riskPerPip: riskPerPip.value,
        riskPerLot: riskPerLot.value,
        stopLoss: stopLoss.value,
        takeProfit: takeProfit.value,
        takeProfitPipsRRBased: takeProfitPipsRRBased.value,
        takeProfitRRBased: takeProfitRRBased.value,
        breakEvenPrice: breakEvenPrice.value,
        recommendedLotSize: recommendedLotSize.value
      }
    };
  };

  /**
   * Importa configuración anterior
   */
  const importConfig = (config) => {
    if (!config || !config.inputs) return;

    const { inputs } = config;
    if (inputs.initialCapital !== undefined) initialCapital.value = inputs.initialCapital;
    if (inputs.riskTotalPercentage !== undefined) riskTotalPercentage.value = inputs.riskTotalPercentage;
    if (inputs.stopLossPips !== undefined) stopLossPips.value = inputs.stopLossPips;
    if (inputs.takeProfitPips !== undefined) takeProfitPips.value = inputs.takeProfitPips;
    if (inputs.riskRewardRatio !== undefined) riskRewardRatio.value = inputs.riskRewardRatio;
    if (inputs.entryPrice !== undefined) entryPrice.value = inputs.entryPrice;
    if (inputs.lotSize !== undefined) lotSize.value = inputs.lotSize;
    if (inputs.breakEvenPercentage !== undefined) breakEvenPercentage.value = inputs.breakEvenPercentage;
    if (config.positionType) positionType.value = config.positionType;

    calculate();
  };

  return {
    // Estado
    positionType,
    initialCapital,
    riskTotalPercentage,
    stopLossPips,
    takeProfitPips,
    riskRewardRatio,
    entryPrice,
    lotSize,
    breakEvenPercentage,

    // Resultados
    riskTotalAmount,
    riskPerPip,
    riskPerLot,
    stopLoss,
    takeProfit,
    takeProfitPipsRRBased,
    takeProfitRRBased,
    breakEvenPrice,
    recommendedLotSize,

    // Computed
    hasValidInputs,

    // Métodos
    pipsToPrice,
    priceToPips,
    calculateRiskPerPip,
    calculate,
    reset,
    updateInitialCapital,
    setPositionType,
    exportResults,
    importConfig
  };
}
