import { ref, computed } from 'vue';
import { useCalculatorCommon } from './usCalculatorCommon';

/**
 * Composable especializado para cálculos de Stock
 * Soporta posiciones Long y Short
 */
export function useStockCalculator(initialCapitalRef = null) {
  const common = useCalculatorCommon();

  // Estado reactivo
  const positionType = ref('long'); // 'long' o 'short'
  const initialCapital = initialCapitalRef || ref(5000);
  const riskTotalPercentage = ref(1);
  const riskOperationPercentage = ref(0.70);
  const rewardPercentage = ref(0.90);
  const riskRewardRatio = ref(1.5);
  const stockPrice = ref(260);
  const breakEvenPercentage = ref(0.60);

  // Resultados computados
  const riskTotalAmount = ref(0);
  const riskPerAction = ref(0);
  const stopLoss = ref(0);
  const takeProfit = ref(0);
  const takeProfitPoints = ref(0);
  const takeProfitRRBased = ref(0);
  const breakEvenPoint = ref(0);
  const lotSize = ref(0);

  /**
   * Valida que los inputs de Stock sean válidos
   */
  const hasValidInputs = computed(() => {
    return (
      initialCapital.value > 0 &&
      riskTotalPercentage.value > 0 &&
      riskOperationPercentage.value > 0 &&
      riskRewardRatio.value > 0 &&
      stockPrice.value > 0 &&
      breakEvenPercentage.value > 0
    );
  });

  /**
   * Calcula todos los valores para posiciones de Stock
   * Soporta Long y Short automáticamente
   */
  const calculate = () => {
    if (!hasValidInputs.value) return;

    // Calcular riesgo total en dinero
    riskTotalAmount.value = common.calculateTotalRisk(
      initialCapital.value,
      riskTotalPercentage.value
    );

    // Calcular riesgo por acción en puntos
    riskPerAction.value = common.percentageToPoints(
      stockPrice.value,
      riskOperationPercentage.value
    );

    if (positionType.value === 'long') {
      // POSICIÓN LONG: Precio sube
      // Stop Loss: Precio Entrada - Riesgo
      stopLoss.value = stockPrice.value - riskPerAction.value;

      // Take Profit: Precio Entrada + Recompensa
      takeProfit.value = stockPrice.value * (1 + rewardPercentage.value / 100);

      // Puntos de Take Profit
      takeProfitPoints.value = takeProfit.value - stockPrice.value;

      // Take Profit basado en R:R
      takeProfitRRBased.value = stockPrice.value + (riskPerAction.value * riskRewardRatio.value);

      // BreakEven
      breakEvenPoint.value = stockPrice.value * (1 + breakEvenPercentage.value / 100);
    } else {
      // POSICIÓN SHORT: Precio baja
      // Stop Loss: Precio Entrada + Riesgo
      stopLoss.value = stockPrice.value + riskPerAction.value;

      // Take Profit: Precio Entrada - Recompensa
      takeProfit.value = stockPrice.value * (1 - rewardPercentage.value / 100);

      // Puntos de Take Profit
      takeProfitPoints.value = stockPrice.value - takeProfit.value;

      // Take Profit basado en R:R
      takeProfitRRBased.value = stockPrice.value - (riskPerAction.value * riskRewardRatio.value);

      // BreakEven
      breakEvenPoint.value = stockPrice.value * (1 - breakEvenPercentage.value / 100);
    }

    // Calcular Lotaje (igual para ambos tipos)
    lotSize.value = common.calculateLotSize(
      riskTotalAmount.value,
      riskPerAction.value
    );
  };

  /**
   * Reset a valores por defecto
   */
  const reset = () => {
    positionType.value = 'long';
    initialCapital.value = 1000;
    riskTotalPercentage.value = 1;
    riskOperationPercentage.value = 0.70;
    rewardPercentage.value = 0.90;
    riskRewardRatio.value = 2;
    stockPrice.value = 100;
    breakEvenPercentage.value = 0.60;
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
        riskOperationPercentage: riskOperationPercentage.value,
        rewardPercentage: rewardPercentage.value,
        riskRewardRatio: riskRewardRatio.value,
        stockPrice: stockPrice.value,
        breakEvenPercentage: breakEvenPercentage.value
      },
      results: {
        riskTotalAmount: riskTotalAmount.value,
        riskPerAction: riskPerAction.value,
        stopLoss: stopLoss.value,
        takeProfit: takeProfit.value,
        takeProfitPoints: takeProfitPoints.value,
        takeProfitRRBased: takeProfitRRBased.value,
        breakEvenPoint: breakEvenPoint.value,
        lotSize: lotSize.value
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
    if (inputs.riskOperationPercentage !== undefined) riskOperationPercentage.value = inputs.riskOperationPercentage;
    if (inputs.rewardPercentage !== undefined) rewardPercentage.value = inputs.rewardPercentage;
    if (inputs.riskRewardRatio !== undefined) riskRewardRatio.value = inputs.riskRewardRatio;
    if (inputs.stockPrice !== undefined) stockPrice.value = inputs.stockPrice;
    if (inputs.breakEvenPercentage !== undefined) breakEvenPercentage.value = inputs.breakEvenPercentage;
    if (config.positionType) positionType.value = config.positionType;

    calculate();
  };

  return {
    // Estado
    positionType,
    initialCapital,
    riskTotalPercentage,
    riskOperationPercentage,
    rewardPercentage,
    riskRewardRatio,
    stockPrice,
    breakEvenPercentage,

    // Resultados
    riskTotalAmount,
    riskPerAction,
    stopLoss,
    takeProfit,
    takeProfitPoints,
    takeProfitRRBased,
    breakEvenPoint,
    lotSize,

    // Computed
    hasValidInputs,

    // Métodos
    calculate,
    reset,
    updateInitialCapital,
    setPositionType,
    exportResults,
    importConfig
  };
}
