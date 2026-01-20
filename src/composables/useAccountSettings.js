import { ref, computed } from 'vue'

const STORAGE_KEY = 'trading_account_settings'

const defaultSettings = {
  amount: 10000,
  currency: 'USD',
  leverages: {
    forex: 50,
    stock: 2,
    crypto: 5
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

  const getAccountBalance = computed(() => {
    return accountSettings.value.amount
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
    getAccountBalance,
    getCurrency,
    getLeverage,
    resetSettings
  }
}
