import { ref, computed } from 'vue'
import { useTradingJournal } from './useTradingJournal'

const STORAGE_KEY = 'trading_account_settings'

const defaultSettings = {
  amount: 1000,
  currency: 'EUR',
  leverages: {
    forex: 10,
    stock: 1,
    crypto: 10
  }
}

const accountSettings = ref(getStoredSettings())

function getStoredSettings() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Error parsing stored settings:', e)
      return { ...defaultSettings }
    }
  }
  return { ...defaultSettings }
}

export function useAccountSettings() {
  const settings = accountSettings
  const { getTotalPnL } = useTradingJournal()

  const updateSettings = (newSettings) => {
    accountSettings.value = {
      ...accountSettings.value,
      ...newSettings
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accountSettings.value))
  }

  const updateLeverage = (assetType, leverage) => {
    accountSettings.value.leverages[assetType] = leverage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accountSettings.value))
  }

  const updateCapitalInicial = (newAmount) => {
    accountSettings.value.amount = newAmount
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accountSettings.value))
  }

  // Capital Inicial - punto de partida, no cambia
  const getCapitalInicial = computed(() => {
    return accountSettings.value.amount
  })

  // Capital Disponible - capital inicial + P&L total
  const getCapitalDisponible = computed(() => {
    return accountSettings.value.amount + getTotalPnL.value
  })

  // Porcentaje de cambio del capital disponible
  const getCapitalDisponiblePercent = computed(() => {
    if (accountSettings.value.amount === 0) return 0
    return (getTotalPnL.value / accountSettings.value.amount) * 100
  })

  const getCurrency = computed(() => {
    return accountSettings.value.currency
  })

  const getLeverage = (assetType) => {
    return accountSettings.value.leverages[assetType] || 1
  }

  const resetSettings = () => {
    accountSettings.value = { ...defaultSettings }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accountSettings.value))
  }

  return {
    settings,
    updateSettings,
    updateLeverage,
    updateCapitalInicial,
    getCapitalInicial,
    getCapitalDisponible,
    getCapitalDisponiblePercent,
    getCurrency,
    getLeverage,
    resetSettings
  }
}
