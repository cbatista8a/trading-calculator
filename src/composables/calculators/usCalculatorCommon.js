import { ref, computed } from 'vue';

/**
 * Composable con funciones compartidas para todas las calculadoras
 * Reutilizable entre Stock, Forex, Índices y Crypto
 */
export function useCalculatorCommon() {
  /**
   * Calcula el riesgo total en dinero basado en capital inicial y porcentaje
   * @param {number} capitalInicial - Capital inicial en moneda base
   * @param {number} riskPercentage - Porcentaje de riesgo (ej: 1 = 1%)
   * @returns {number} Riesgo total en dinero
   */
  const calculateTotalRisk = (capitalInicial, riskPercentage) => {
    if (!capitalInicial || !riskPercentage) return 0;
    return capitalInicial * (riskPercentage / 100);
  };

  /**
   * Calcula el lotaje basado en riesgo total y riesgo por unidad
   * @param {number} totalRisk - Riesgo total en dinero
   * @param {number} riskPerUnit - Riesgo por unidad (acción, lote, contrato, etc.)
   * @returns {number} Cantidad de lotes/unidades
   */
  const calculateLotSize = (totalRisk, riskPerUnit) => {
    if (!totalRisk || !riskPerUnit || riskPerUnit === 0) return 0;
    return totalRisk / riskPerUnit;
  };

  /**
   * Calcula el Ratio Riesgo:Recompensa
   * @param {number} risk - Monto de riesgo
   * @param {number} reward - Monto de recompensa
   * @returns {number} Ratio R:R
   */
  const calculateRiskRewardRatio = (risk, reward) => {
    if (!risk || risk === 0) return 0;
    return Math.abs(reward / risk);
  };

  /**
   * Valida que los inputs sean válidos para cálculos
   * @param {object} inputs - Objeto con los inputs a validar
   * @returns {boolean} true si todos los inputs son válidos
   */
  const isValidInputs = (inputs) => {
    const { initialCapital, riskPercentage, entryPrice, stopLossValue } = inputs;
    return (
      initialCapital > 0 &&
      riskPercentage > 0 &&
      entryPrice > 0 &&
      stopLossValue > 0
    );
  };

  /**
   * Redondea un número a decimales específicos
   * @param {number} value - Valor a redondear
   * @param {number} decimals - Cantidad de decimales (default: 2)
   * @returns {number} Valor redondeado
   */
  const roundToDecimals = (value, decimals = 2) => {
    if (!value) return 0;
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  };

  /**
   * Calcula la diferencia de precio absoluta
   * @param {number} price1 - Primer precio
   * @param {number} price2 - Segundo precio
   * @returns {number} Diferencia absoluta
   */
  const calculatePriceDifference = (price1, price2) => {
    if (!price1 || !price2) return 0;
    return Math.abs(price1 - price2);
  };

  /**
   * Convierte un valor porcentual a puntos/pips basado en un precio
   * @param {number} price - Precio base
   * @param {number} percentage - Porcentaje
   * @returns {number} Valor en puntos/pips
   */
  const percentageToPoints = (price, percentage) => {
    if (!price || !percentage) return 0;
    return price * (percentage / 100);
  };

  /**
   * Convierte puntos/pips a porcentaje basado en un precio
   * @param {number} price - Precio base
   * @param {number} points - Puntos/pips
   * @returns {number} Porcentaje
   */
  const pointsToPercentage = (price, points) => {
    if (!price || !points) return 0;
    return (points / price) * 100;
  };

  /**
   * Calcula ganancias/pérdidas en porcentaje
   * @param {number} entryPrice - Precio de entrada
   * @param {number} exitPrice - Precio de salida
   * @param {string} operation - 'long' o 'short'
   * @returns {number} Ganancia/pérdida en porcentaje
   */
  const calculatePnLPercent = (entryPrice, exitPrice, operation = 'long') => {
    if (!entryPrice || !exitPrice) return 0;
    const change = ((exitPrice - entryPrice) / entryPrice) * 100;
    return operation === 'short' ? -change : change;
  };

  /**
   * Calcula ganancias/pérdidas en dinero
   * @param {number} risk - Riesgo (valor de SL)
   * @param {number} reward - Recompensa (valor de TP)
   * @param {number} lotSize - Cantidad de lotes
   * @returns {object} { riskMoney, rewardMoney }
   */
  const calculatePnLMoney = (risk, reward, lotSize) => {
    if (!risk || !reward || !lotSize) return { riskMoney: 0, rewardMoney: 0 };
    return {
      riskMoney: risk * lotSize,
      rewardMoney: reward * lotSize
    };
  };

  return {
    calculateTotalRisk,
    calculateLotSize,
    calculateRiskRewardRatio,
    isValidInputs,
    roundToDecimals,
    calculatePriceDifference,
    percentageToPoints,
    pointsToPercentage,
    calculatePnLPercent,
    calculatePnLMoney
  };
}
