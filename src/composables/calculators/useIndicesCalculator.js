import { ref, computed } from 'vue';
import { useCalculatorCommon } from './usCalculatorCommon';

/**
 * Composable especializado para cálculos de Índices
 * Soporta posiciones Long y Short con Point Value
 */
export function useIndicesCalculator(initialCapitalRef = null) {
  const common = useCalculatorCommon();

  // Índices disponibles con su Point Value (el valor en dólares de un punto)
  const indicesData = {
    'ES': { name: 'E-mini S&P 500', pointValue: 50 },
    'NQ': { name: 'E-mini Nasdaq-100', pointValue: 20 },
    'YM': { name: 'E-mini Dow Jones', pointValue: 5 },
    'DAX': { name: 'DAX', pointValue: 25 },
    'FTSE': { name: 'FTSE 100', pointValue: 10 },
    'NIKKEI': { name: 'Nikkei 225', pointValue: 1 }
  };

  // Estado reactivo
  const positionType = ref('long'); // 'long' o 'short'
  const initialCapital = initialCapitalRef || ref(5000);
  const riskTotalPercentage = ref(1);
  const stopLossPoints = ref(50); // Stop Loss en puntos
  const takeProfitPoints = ref(100); // Take Profit en puntos
  const riskRewardRatio = ref(1.5);
  const entryPrice = ref(4500); // Precio de entrada del índice
  const selectedIndex = ref('ES'); // Índice seleccionado
  const contracts = ref(1); // Contratos
  const breakEvenPercentage = ref(0.5);

  // Resultados computados
  const riskTotalAmount = ref(0);
  const riskPerPoint = ref(0);
  const riskPerContract = ref(0);
  const stopLoss = ref(0);
  const takeProfit = ref(0);
  const takeProfitPointsRRBased = ref(0);
  const takeProfitRRBased = ref(0);
  const breakEvenPrice = ref(0);
  const recommendedContracts = ref(0);

  /**
   * Obtiene el Point Value del índice seleccionado
   */
  const getPointValue = () => {
    return indicesData[selectedIndex.value]?.pointValue || 50;
  };

  /**
   * Obtiene el nombre del índice
   */
  const getIndexName = () => {
    return indicesData[selectedIndex.value]?.name || 'E-mini S&P 500';
  };

  /**
   * Valida que los inputs de Índices sean válidos
   */
  const hasValidInputs = computed(() => {
    return (
      initialCapital.value > 0 &&
      riskTotalPercentage.value > 0 &&
      stopLossPoints.value > 0 &&
      takeProfitPoints.value > 0 &&
      riskRewardRatio.value > 0 &&
      entryPrice.value > 0 &&
      contracts.value > 0
    );
  });

  /**
   * Calcula todos los valores para posiciones de Índices
   * Soporta Long y Short automáticamente
   */
  const calculate = () => {
    if (!hasValidInputs.value) return;

    const pointValue = getPointValue();

    // Calcular riesgo total en dinero
    riskTotalAmount.value = common.calculateTotalRisk(
      initialCapital.value,
      riskTotalPercentage.value
    );

    // Calcular riesgo por punto = riesgo por contrato / puntos de SL
    riskPerPoint.value = pointValue;

    // Calcular riesgo por contrato = puntos de SL * Point Value
    riskPerContract.value = stopLossPoints.value * pointValue;

    if (positionType.value === 'long') {
      // POSICIÓN LONG: Precio sube
      // Stop Loss: Precio Entrada - SL puntos
      stopLoss.value = entryPrice.value - stopLossPoints.value;

      // Take Profit: Precio Entrada + TP puntos
      takeProfit.value = entryPrice.value + takeProfitPoints.value;

      // Take Profit basado en R:R (en puntos)
      takeProfitPointsRRBased.value = Math.round(stopLossPoints.value * riskRewardRatio.value);
      takeProfitRRBased.value = entryPrice.value + takeProfitPointsRRBased.value;

      // BreakEven: Entrada + breakEvenPercentage
      breakEvenPrice.value = entryPrice.value * (1 + breakEvenPercentage.value / 100);
    } else {
      // POSICIÓN SHORT: Precio baja
      // Stop Loss: Precio Entrada + SL puntos
      stopLoss.value = entryPrice.value + stopLossPoints.value;

      // Take Profit: Precio Entrada - TP puntos
      takeProfit.value = entryPrice.value - takeProfitPoints.value;

      // Take Profit basado en R:R (en puntos)
      takeProfitPointsRRBased.value = Math.round(stopLossPoints.value * riskRewardRatio.value);
      takeProfitRRBased.value = entryPrice.value - takeProfitPointsRRBased.value;

      // BreakEven: Entrada - breakEvenPercentage
      breakEvenPrice.value = entryPrice.value * (1 - breakEvenPercentage.value / 100);
    }

    // Calcular contratos recomendados
    // recommendedContracts = riesgo total / riesgo por contrato
    if (riskPerContract.value > 0) {
      recommendedContracts.value = riskTotalAmount.value / riskPerContract.value;
    }
  };

  /**
   * Reset a valores por defecto
   */
  const reset = () => {
    positionType.value = 'long';
    initialCapital.value = 5000;
    riskTotalPercentage.value = 1;
    stopLossPoints.value = 50;
    takeProfitPoints.value = 100;
    riskRewardRatio.value = 1.5;
    entryPrice.value = 4500;
    selectedIndex.value = 'ES';
    contracts.value = 1;
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
   * Cambia el índice seleccionado y recalcula
   */
  const setSelectedIndex = (indexCode) => {
    if (indicesData[indexCode]) {
      selectedIndex.value = indexCode;
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
        stopLossPoints: stopLossPoints.value,
        takeProfitPoints: takeProfitPoints.value,
        riskRewardRatio: riskRewardRatio.value,
        entryPrice: entryPrice.value,
        selectedIndex: selectedIndex.value,
        contracts: contracts.value,
        breakEvenPercentage: breakEvenPercentage.value
      },
      results: {
        riskTotalAmount: riskTotalAmount.value,
        riskPerPoint: riskPerPoint.value,
        riskPerContract: riskPerContract.value,
        stopLoss: stopLoss.value,
        takeProfit: takeProfit.value,
        takeProfitPointsRRBased: takeProfitPointsRRBased.value,
        takeProfitRRBased: takeProfitRRBased.value,
        breakEvenPrice: breakEvenPrice.value,
        recommendedContracts: recommendedContracts.value
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
    if (inputs.stopLossPoints !== undefined) stopLossPoints.value = inputs.stopLossPoints;
    if (inputs.takeProfitPoints !== undefined) takeProfitPoints.value = inputs.takeProfitPoints;
    if (inputs.riskRewardRatio !== undefined) riskRewardRatio.value = inputs.riskRewardRatio;
    if (inputs.entryPrice !== undefined) entryPrice.value = inputs.entryPrice;
    if (inputs.selectedIndex !== undefined) selectedIndex.value = inputs.selectedIndex;
    if (inputs.contracts !== undefined) contracts.value = inputs.contracts;
    if (inputs.breakEvenPercentage !== undefined) breakEvenPercentage.value = inputs.breakEvenPercentage;
    if (config.positionType) positionType.value = config.positionType;

    calculate();
  };

  return {
    // Estado
    positionType,
    initialCapital,
    riskTotalPercentage,
    stopLossPoints,
    takeProfitPoints,
    riskRewardRatio,
    entryPrice,
    selectedIndex,
    contracts,
    breakEvenPercentage,

    // Resultados
    riskTotalAmount,
    riskPerPoint,
    riskPerContract,
    stopLoss,
    takeProfit,
    takeProfitPointsRRBased,
    takeProfitRRBased,
    breakEvenPrice,
    recommendedContracts,

    // Datos
    indicesData,

    // Computed
    hasValidInputs,

    // Métodos
    getPointValue,
    getIndexName,
    calculate,
    reset,
    updateInitialCapital,
    setPositionType,
    setSelectedIndex,
    exportResults,
    importConfig
  };
}
