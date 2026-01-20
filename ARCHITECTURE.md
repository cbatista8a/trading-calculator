# 🏗️ Arquitectura - Trading Journal

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    TRADING ADVISOR APP                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Navigation.vue (⚙️ & 📓)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                      ↓                 ↓                     │
│         ┌────────────────────┐    ┌──────────────────┐     │
│         │  AccountSettings   │    │ TradingJournal   │     │
│         │      (Page)        │    │    (Page)        │     │
│         └────────────────────┘    └──────────────────┘     │
│                  ↓                          ↓                │
│      ┌──────────────────────┐    ┌────────────────────┐   │
│      │useAccountSettings    │    │useTradingJournal   │   │
│      │   (Composable)       │    │   (Composable)     │   │
│      └──────────────────────┘    └────────────────────┘   │
│                  ↓                          ↓                │
│      ┌──────────────────────┐    ┌────────────────────┐   │
│      │   localStorage       │    │   localStorage     │   │
│      │ (Persistencia)       │    │ (Persistencia)     │   │
│      └──────────────────────┘    └────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura de Carpetas

```
src/
├── composables/
│   ├── useAccountSettings.js      ← Gestión de cuenta
│   ├── useTradingJournal.js       ← Gestión de trades
│   ├── useMarketSchedule.js       (Existente)
│   ├── useStrategies.js           (Existente)
│   └── useUserPreferences.js      (Existente)
│
├── pages/
│   ├── AccountSettings.vue        ← Página configuración
│   ├── TradingJournal.vue         ← Página principal journal
│   ├── Home.vue                   (Existente)
│   ├── Checklist.vue              (Existente)
│   └── Strategies.vue             (Existente)
│
├── components/
│   └── trading/
│       ├── TradeForm.vue          ← Formulario de trades
│       ├── TradesList.vue         ← Listado de trades
│       ├── TradeStats.vue         ← Estadísticas
│       └── [otros componentes]    (Existentes)
│
└── router/
    └── index.js                   ← Rutas actualizadas
```

---

## Flujo de Datos

### 1. Configuración de Cuenta

```
AccountSettings.vue
    ↓ (v-model)
form (data reactivo)
    ↓ (click en guardar)
updateSettings() [useAccountSettings]
    ↓
localStorage.setItem('trading_account_settings')
    ↓
accountSettings.value (ref reactivo)
    ↓ (mounted en TradingJournal)
Disponible para cálculos
```

### 2. Registro de Trade

```
TradeForm.vue
    ↓ (emit trade-added)
TradingJournal.vue (handleTradeAdded)
    ↓
addTrade(tradeData) [useTradingJournal]
    ↓
calculateTradeMetrics() [función interna]
    ├─ priceDifference
    ├─ pnLMoney
    ├─ pnLPercent
    └─ isWin
    ↓
trades.value.unshift(newTrade)
    ↓
localStorage.setItem('trading_journal')
    ↓ (reactivo update)
TradeStats.vue (computed properties)
TradesList.vue (v-for trades)
```

### 3. Cálculo de Estadísticas

```
trades.value (Array reactivo)
    ↓ (computed properties)
    ├─ getTotalPnL
    ├─ getWinRate
    ├─ getAvgWin
    ├─ getAvgLoss
    ├─ getProfitFactor
    └─ otros...
    ↓
TradeStats.vue renderiza valores
    ↓ (Auto-actualiza en cada nuevo trade)
```

---

## Estados Reactivos

### useAccountSettings

```javascript
accountSettings (ref)
├─ amount: number
├─ currency: string
└─ leverages: object
   ├─ forex: number
   ├─ stock: number
   └─ crypto: number
```

### useTradingJournal

```javascript
trades (ref Array)
└─ trade object
   ├─ id: number (timestamp)
   ├─ timestamp: string (ISO)
   ├─ asset: string
   ├─ operation: string ('Long'|'Short')
   ├─ volume: number
   ├─ entryPrice: number
   ├─ exitPrice: number
   ├─ stopLoss: number
   ├─ takeProfit: number
   ├─ assetType: string ('forex'|'stock'|'crypto')
   ├─ leverage: number
   ├─ priceDifference: number [COMPUTED]
   ├─ pnLMoney: number [COMPUTED]
   ├─ pnLPercent: number [COMPUTED]
   └─ isWin: boolean [COMPUTED]
```

---

## Computed Properties (Reactividad)

### En TradeStats.vue

```javascript
// Deriva de trades.value
totalPnL → suma de todos los pnLMoney
winRate → porcentaje de isWin === true
getAvgWin → promedio de ganancias
getAvgLoss → promedio de pérdidas
profitFactor → ganancias / pérdidas
bestTrade → trade con mayor pnLMoney
worstTrade → trade con menor pnLMoney

// Actualiza automáticamente cuando trades cambia
```

---

## Ciclo de Vida de un Trade

### 1. Creación
```
Usuario completa TradeForm
    ↓
@submit emite 'trade-added'
    ↓
handleTradeAdded(tradeData)
```

### 2. Procesamiento
```
addTrade(tradeData)
    ├─ parseFloat en campos numéricos
    ├─ Calcular metrics (P&L, %)
    ├─ Crear objeto completo con ID (timestamp)
    └─ trades.value.unshift() → lo pone primero
```

### 3. Persistencia
```
localStorage.setItem('trading_journal', JSON.stringify(trades))
    ↓
Disponible en próxima sesión
```

### 4. Visualización
```
v-for en TradesList renderiza cada trade
Computed properties generan estadísticas
TradeStats muestra agregados
```

### 5. Edición/Eliminación
```
updateTrade(tradeId, updatedData)
    └─ Recalcula metrics

deleteTrade(tradeId)
    └─ Filtra del array
```

---

## Persistencia en localStorage

### Estructura
```javascript
// Clave: 'trading_account_settings'
{
  "amount": 10000,
  "currency": "USD",
  "leverages": {
    "forex": 50,
    "stock": 2,
    "crypto": 5
  }
}

// Clave: 'trading_journal'
[
  {
    "id": 1705000000000,
    "timestamp": "2025-01-20T10:30:00.000Z",
    "asset": "EURUSD",
    "operation": "Long",
    "volume": 1.5,
    "entryPrice": 1.0850,
    "exitPrice": 1.0950,
    "stopLoss": 1.0800,
    "takeProfit": 1.1000,
    "assetType": "forex",
    "leverage": 50,
    "priceDifference": 0.01,
    "pnLMoney": 750,
    "pnLPercent": 0.92,
    "isWin": true
  }
]
```

### Inicialización
```javascript
// Al montar la app
getStoredSettings() → lee localStorage
    ├─ Si existe: JSON.parse y devuelve
    ├─ Si no existe: devuelve defaultSettings
    └─ Si error: devuelve defaultSettings

getStoredTrades() → lee localStorage
    ├─ Si existe: JSON.parse y devuelve Array
    ├─ Si no existe: devuelve []
    └─ Si error: devuelve []
```

---

## Cálculos Detallados

### P&L Dinero

**LONG:**
```
P&L = (Precio Salida - Precio Entrada) × Volumen × Leverage

Ejemplo: EURUSD Long
= (1.0950 - 1.0850) × 1.0 × 50
= 0.0100 × 1.0 × 50
= 0.50 × 50
= $500
```

**SHORT:**
```
P&L = (Precio Entrada - Precio Salida) × Volumen × Leverage

Ejemplo: GBPUSD Short
= (1.3200 - 1.3300) × 0.5 × 50
= -0.0100 × 0.5 × 50
= -0.005 × 50
= -$250
```

### P&L Porcentaje

```
P&L % = ((Precio Salida - Precio Entrada) / Precio Entrada) × 100

Ejemplo:
= ((1.0950 - 1.0850) / 1.0850) × 100
= (0.0100 / 1.0850) × 100
= 0.00921 × 100
= 0.92%
```

### Win Rate

```
Win Rate = (Trades Ganadores / Total Trades) × 100

Ejemplo: 3 wins, 2 losses
= (3 / 5) × 100
= 60%
```

### Profit Factor

```
Profit Factor = Ganancia Total / |Pérdida Total|

Ejemplo: Wins $1000, Losses $250
= 1000 / 250
= 4.0x

Interpretación:
- > 1.5: Muy bueno
- > 2.0: Excelente
- > 3.0: Excepcional
```

### Risk/Reward Ratio

```
Risk = |Entrada - Stop Loss|
Reward = |Take Profit - Entrada|
R/R = Reward / Risk

Ejemplo: EURUSD
Risk = |1.0850 - 1.0800| = 0.0050
Reward = |1.1000 - 1.0850| = 0.0150
R/R = 0.0150 / 0.0050 = 3:1
```

---

## Validaciones

### TradeForm.vue
```javascript
// Validaciones HTML5
- asset: required, type="text"
- assetType: required, select
- operation: required, botones (Long/Short)
- volume: required, type="number", step="0.01"
- entryPrice: required, type="number", step="0.00001"
- exitPrice: required, type="number", step="0.00001"
- stopLoss: required, type="number", step="0.00001"
- takeProfit: required, type="number", step="0.00001"
- leverage: required, type="number", min="1"
```

### Composable Validations
```javascript
// useTradingJournal.addTrade()
- parseFloat para garantizar números
- Cálculos solo si todos los valores existen
- Manejo de división por cero en R/R
```

---

## Manejo de Errores

### localStorage

```javascript
try {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
} catch (e) {
  console.error('Error parsing stored data:', e)
  return defaultValue
}
```

### División por Cero

```javascript
// En getProfitFactor
if (totalLosses === 0) {
  return totalWins > 0 ? Infinity : 0
}
```

### R/R Ratio

```javascript
// En calculateRR
if (risk === 0) {
  return 0  // Entrada = Stop Loss
}
```

---

## Performance

### Optimizaciones Implementadas

1. **Computed Properties:** En lugar de recalcular cada vez
2. **Array.unshift():** Nuevos trades primero (mejor UX)
3. **Scroll en TradesList:** max-h-96 overflow-y-auto
4. **Filtrado local:** Sin API calls

### Posibles Mejoras

- [ ] Virtualización de lista para 10000+ trades
- [ ] Web Workers para cálculos pesados
- [ ] Indexación en localStorage para búsqueda rápida
- [ ] Caché de estadísticas para histórico

---

## Seguridad

### Consideraciones Actuales

1. **localStorage:** No está encriptado
   - Datos visibles en DevTools
   - Bueno para demo/pruebas
   - No usar datos sensibles reales

2. **Input Sanitization:**
   - HTML5 validation
   - Type coercion con parseFloat
   - No ejecutar código dinámico

### Recomendaciones para Producción

- [ ] Usar encriptación para localStorage
- [ ] Sincronizar con backend seguro
- [ ] Autenticación de usuario
- [ ] Auditoría de cambios

---

## Testing

### Unit Tests Sugeridos

```javascript
// composables/__tests__/useAccountSettings.spec.js
- updateSettings() actualiza correctamente
- getLeverage() devuelve leverage por tipo
- resetSettings() restaura defaults
- localStorage se persiste

// composables/__tests__/useTradingJournal.spec.js
- addTrade() con cálculos correctos
- getTotalPnL() suma correcta
- getWinRate() porcentaje correcto
- deleteTrade() remueve y actualiza
```

### Integration Tests

```javascript
// AccountSettings.vue
- Form binding bidireccional
- Guardado persiste
- Actualización en tiempo real

// TradingJournal.vue
- Flujo completo: configurar → registrar → analizar
- Sincronización entre componentes
- Exportación de datos
```

---

## Extensibilidad

### Cómo Agregar Nuevas Funcionalidades

**1. Nuevo Tipo de Asset:**
```javascript
// En useAccountSettings.js
leverages: {
  forex: 50,
  stock: 2,
  crypto: 5,
  commodities: 20  // ← Nuevo
}
```

**2. Nuevas Métricas:**
```javascript
// En useTradingJournal.js
const getMaxDrawdown = computed(() => {
  // Implementar lógica
})
```

**3. Nuevos Componentes:**
```javascript
// TradeChart.vue para gráficas
// TradeFilter.vue para filtros avanzados
// TradeExport.vue para formatos múltiples
```

---

## Diagrama de Componentes

```
App.vue
├── Navigation.vue
│   ├── router-link /account-settings
│   └── router-link /trading-journal
├── RouterView
│   ├── AccountSettings.vue
│   │   └── useAccountSettings (composable)
│   └── TradingJournal.vue
│       ├── TradeStats.vue
│       │   └── useTradingJournal (composable)
│       ├── TradeForm.vue
│       │   └── emit 'trade-added'
│       ├── TradesList.vue
│       │   ├── v-for trades
│       │   └── emit 'trade-deleted'
│       └── useAccountSettings + useTradingJournal
```

---

## Notas para Desarrolladores

1. **Reactivity:** Siempre usar `.value` para refs
2. **Computed:** Se recalculan automáticamente cuando deps cambian
3. **localStorage:** Sincronizar después de cada cambio
4. **Números:** Usar parseFloat para garantizar tipo
5. **Fechas:** Usar ISO string para portabilidad

---

## Roadmap Futuro

- [ ] Backend API para sincronización
- [ ] Análisis técnico (MA, RSI, etc.)
- [ ] Alertas de P&L
- [ ] Backtesting engine
- [ ] Social trading (comparar con otros)
- [ ] Mobile app nativa
- [ ] Machine Learning para recomendaciones

