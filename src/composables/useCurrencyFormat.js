import { computed } from 'vue'
import { useAccountSettings } from './useAccountSettings'

/**
 * Composable para formatear valores de moneda de manera centralizada
 * Usa la Currency configurada en los Account Settings
 * Precisión: mínimo 2, máximo 4 decimales
 */
export function useCurrencyFormat() {
  const { getCurrency } = useAccountSettings()

  /**
   * Formatea un valor numérico como moneda
   * @param {number} value - Valor a formatear
   * @returns {string} Valor formateado con símbolo de moneda
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: getCurrency.value,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value)
  }

  /**
   * Formatea un número sin símbolo de moneda
   * Solo aplica el formato numérico con 2-4 decimales
   * @param {number} value - Valor a formatear
   * @returns {string} Número formateado
   */
  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value)
  }

  /**
   * Formatea un precio (típicamente con más decimales para precios de activos)
   * Mantiene 4 decimales para precisión en precios
   * @param {number} price - Precio a formatear
   * @returns {string} Precio formateado
   */
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(4)
  }

  /**
   * Formatea un porcentaje con 2 decimales
   * @param {number} percent - Valor de porcentaje (ej: 5.5 para 5.5%)
   * @returns {string} Porcentaje formateado con símbolo %
   */
  const formatPercent = (percent) => {
    return parseFloat(percent).toFixed(2) + '%'
  }

  return {
    formatCurrency,
    formatNumber,
    formatPrice,
    formatPercent
  }
}
