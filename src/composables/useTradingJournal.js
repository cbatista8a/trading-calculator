import { ref, computed } from 'vue'

const STORAGE_KEY = 'trading_journal'

const trades = ref(getStoredTrades())

function getStoredTrades() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Error parsing stored trades:', e)
      return []
    }
  }
  return []
}

export function useTradingJournal() {
  const addTrade = (tradeData) => {
    const trade = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      asset: tradeData.asset,
      operation: tradeData.operation, // 'Long' or 'Short'
      volume: parseFloat(tradeData.volume),
      entryPrice: parseFloat(tradeData.entryPrice),
      exitPrice: parseFloat(tradeData.exitPrice),
      stopLoss: parseFloat(tradeData.stopLoss),
      takeProfit: parseFloat(tradeData.takeProfit),
      assetType: tradeData.assetType, // 'forex', 'stock', 'crypto'
      leverage: parseFloat(tradeData.leverage) || 1,
      ...calculateTradeMetrics(tradeData)
    }
    trades.value.unshift(trade)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades.value))
    return trade
  }

  const calculateTradeMetrics = (tradeData) => {
    const volume = parseFloat(tradeData.volume)
    const entryPrice = parseFloat(tradeData.entryPrice)
    const exitPrice = parseFloat(tradeData.exitPrice)
    const leverage = parseFloat(tradeData.leverage) || 1
    const operation = tradeData.operation

    // Calculate pips/points difference
    let priceDifference = 0
    if (operation === 'Long') {
      priceDifference = exitPrice - entryPrice
    } else {
      // Short
      priceDifference = entryPrice - exitPrice
    }

    // Calculate profit/loss in currency units
    // Note: leverage affects margin required, not the base P&L calculation
    const pnLMoney = priceDifference * volume

    // Calculate percentage gain/loss (based on price movement)
    const pnLPercent = (priceDifference / entryPrice) * 100

    // Determine if trade is profitable
    const isWin = pnLMoney > 0

    return {
      priceDifference,
      pnLMoney,
      pnLPercent,
      isWin
    }
  }

  const updateTrade = (tradeId, updatedData) => {
    const index = trades.value.findIndex(t => t.id === tradeId)
    if (index !== -1) {
      const updatedTrade = {
        ...trades.value[index],
        ...updatedData,
        ...calculateTradeMetrics(updatedData)
      }
      trades.value[index] = updatedTrade
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades.value))
      return updatedTrade
    }
  }

  const deleteTrade = (tradeId) => {
    trades.value = trades.value.filter(t => t.id !== tradeId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades.value))
  }

  const getTrades = computed(() => trades.value)

  const getTradesByAsset = (asset) => {
    return computed(() => trades.value.filter(t => t.asset === asset))
  }

  const getTradesByAssetType = (assetType) => {
    return computed(() => trades.value.filter(t => t.assetType === assetType))
  }

  const getTotalPnL = computed(() => {
    return trades.value.reduce((sum, trade) => sum + trade.pnLMoney, 0)
  })

  const getTotalPnLPercent = computed(() => {
    if (trades.value.length === 0) return 0
    // Average percentage return
    const totalPercent = trades.value.reduce((sum, trade) => sum + trade.pnLPercent, 0)
    return totalPercent / trades.value.length
  })

  const getWinsCount = computed(() => {
    return trades.value.filter(t => t.isWin).length
  })

  const getLossesCount = computed(() => {
    return trades.value.filter(t => !t.isWin).length
  })

  const getWinRate = computed(() => {
    if (trades.value.length === 0) return 0
    return (getWinsCount.value / trades.value.length) * 100
  })

  const getAvgWin = computed(() => {
    const wins = trades.value.filter(t => t.isWin)
    if (wins.length === 0) return 0
    return wins.reduce((sum, trade) => sum + trade.pnLMoney, 0) / wins.length
  })

  const getAvgLoss = computed(() => {
    const losses = trades.value.filter(t => !t.isWin)
    if (losses.length === 0) return 0
    return losses.reduce((sum, trade) => sum + trade.pnLMoney, 0) / losses.length
  })

  const getProfitFactor = computed(() => {
    const totalWins = trades.value
      .filter(t => t.isWin)
      .reduce((sum, trade) => sum + trade.pnLMoney, 0)

    const totalLosses = Math.abs(
      trades.value
        .filter(t => !t.isWin)
        .reduce((sum, trade) => sum + trade.pnLMoney, 0)
    )

    if (totalLosses === 0) return totalWins > 0 ? Infinity : 0
    return totalWins / totalLosses
  })

  const clearAllTrades = () => {
    trades.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  const exportTrades = () => {
    return JSON.stringify(trades.value, null, 2)
  }

  const importTrades = (jsonData) => {
    try {
      const importedTrades = JSON.parse(jsonData)
      if (Array.isArray(importedTrades)) {
        trades.value = importedTrades
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trades.value))
        return true
      }
      return false
    } catch (e) {
      console.error('Error importing trades:', e)
      return false
    }
  }

  return {
    trades: getTrades,
    addTrade,
    updateTrade,
    deleteTrade,
    getTradesByAsset,
    getTradesByAssetType,
    getTotalPnL,
    getTotalPnLPercent,
    getWinsCount,
    getLossesCount,
    getWinRate,
    getAvgWin,
    getAvgLoss,
    getProfitFactor,
    clearAllTrades,
    exportTrades,
    importTrades
  }
}
