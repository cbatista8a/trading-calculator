# Trading Journal - Documentación de Nuevas Funcionalidades

## Descripción General

Se han implementado dos nuevas secciones en la aplicación de Trading Advisor:

1. **Account Settings** - Configuración de cuenta de trading
2. **Trading Journal** - Registro y análisis de operaciones

## 1. Account Settings (Configuración de Cuenta)

### Ubicación
- Ruta: `/account-settings`
- Navegación: "Account" (⚙️)

### Funcionalidades

#### 1.1 Capital de Trading
- Permite establecer el monto total disponible para operar
- Soporta múltiples monedas (USD, EUR, GBP, JPY, AUD)
- Se persiste en localStorage automáticamente

#### 1.2 Configuración de Leverages
La aplicación permite configurar diferentes leverages para cada tipo de asset:

**Forex:**
- Rango: 1x - 500x
- Default: 50x
- Máximo recomendado: 100x

**Stocks:**
- Rango: 1x - 10x
- Default: 2x
- Máximo recomendado: 4x

**Crypto:**
- Rango: 1x - 100x
- Default: 5x
- Máximo recomendado: 20x

### Composable: `useAccountSettings.js`

```javascript
import { useAccountSettings } from '@/composables/useAccountSettings'

const {
  settings,           // Estado actual de la configuración
  updateSettings,     // Actualiza toda la configuración
  updateLeverage,     // Actualiza leverage específico
  getAccountBalance,  // Getter del balance
  getCurrency,        // Getter de la moneda
  getLeverage,        // Obtiene leverage por tipo
  resetSettings       // Restaura valores por defecto
} = useAccountSettings()
```

## 2. Trading Journal (Diario de Operaciones)

### Ubicación
- Ruta: `/trading-journal`
- Navegación: "Journal" (📓)

### Funcionalidades

#### 2.1 Registro de Operaciones
El formulario permite registrar los siguientes datos:

**Datos Requeridos:**
- **Asset**: Símbolo del activo (EURUSD, AAPL, BTC, etc.)
- **Tipo de Asset**: Forex, Stock o Crypto
- **Operación**: Long (📈) o Short (📉)
- **Volumen**: Cantidad de lotes/acciones
- **Precio de Entrada**: Precio al abrir la posición
- **Precio de Salida**: Precio al cerrar la posición
- **Stop Loss**: Nivel de pérdida máxima
- **Take Profit**: Nivel de ganancia objetivo
- **Leverage**: Se pre-llena automáticamente según el tipo de asset configurado

#### 2.2 Cálculos Automáticos
La aplicación calcula automáticamente:

**Por cada operación:**
- **P&L en dinero**: Ganancia/Pérdida en valor absoluto
  - Long: (Precio Salida - Precio Entrada) × Volumen × Leverage
  - Short: (Precio Entrada - Precio Salida) × Volumen × Leverage

- **P&L en porcentaje**: Retorno porcentual
  - ((Precio Salida - Precio Entrada) / Precio Entrada) × 100

- **Riesgo/Recompensa**: Relación entre riesgo y potencial de ganancia
  - Riesgo = |Precio Entrada - Stop Loss|
  - Recompensa = |Take Profit - Precio Entrada|
  - R/R = Recompensa / Riesgo

#### 2.3 Panel de Estadísticas
Muestra métricas consolidadas de todas las operaciones:

| Métrica | Descripción |
|---------|-------------|
| **P&L Total** | Ganancia/Pérdida acumulada en dinero y porcentaje |
| **Tasa de Acierto** | Porcentaje de trades ganadores |
| **Ganancia Promedio** | P&L promedio de operaciones ganadoras |
| **Pérdida Promedio** | P&L promedio de operaciones perdedoras |
| **Profit Factor** | Relación entre ganancias totales y pérdidas totales |
| **Total de Trades** | Número total de operaciones |
| **R/R Promedio** | Relación riesgo/recompensa promedio |
| **Mejor Trade** | Operación más rentable |
| **Peor Trade** | Operación con mayor pérdida |

#### 2.4 Resumen de Cuenta
Panel lateral que muestra:
- Capital configurado
- P&L total
- **Saldo Estimado**: Capital + P&L (con variación porcentual)
- Botón para acceder a configuración de cuenta
- Botón para exportar datos en formato JSON

#### 2.5 Listado de Operaciones
Visualiza todas las operaciones registradas con:
- Información básica (Asset, fecha, operación Long/Short)
- Datos de la operación (Volumen, precios, leverage)
- Métricas (P&L en dinero, P&L en %, R/R)
- Opción para filtrar solo operaciones ganadoras
- Botón para eliminar operaciones

### Composable: `useTradingJournal.js`

```javascript
import { useTradingJournal } from '@/composables/useTradingJournal'

const {
  trades,                  // Array de todas las operaciones
  addTrade,                // Agrega nueva operación
  updateTrade,             // Actualiza operación existente
  deleteTrade,             // Elimina operación
  getTotalPnL,             // P&L total
  getTotalPnLPercent,      // P&L porcentaje
  getWinsCount,            // Cantidad de trades ganadores
  getLossesCount,          // Cantidad de trades perdedores
  getWinRate,              // Tasa de acierto
  getAvgWin,               // Ganancia promedio
  getAvgLoss,              // Pérdida promedio
  getProfitFactor,         // Factor de rentabilidad
  clearAllTrades,          // Borra todas las operaciones
  exportTrades,            // Exporta como JSON
  importTrades             // Importa desde JSON
} = useTradingJournal()
```

## 3. Almacenamiento de Datos

Ambas funcionalidades utilizan **localStorage** para persistencia:

- **Account Settings**: `trading_account_settings`
- **Trading Journal**: `trading_journal`

Los datos se guardan automáticamente después de cada cambio.

## 4. Componentes Creados

### TradeForm.vue
- Formulario para registrar nuevas operaciones
- Validación básica
- Preview de cálculos antes de guardar
- Combo box para seleccionar tipo de asset

### TradesList.vue
- Listado de operaciones con scroll
- Filtrado de operaciones ganadoras
- Eliminación de operaciones con confirmación
- Código de colores para Long/Short

### TradeStats.vue
- Panel de 9 estadísticas principales
- Actualización en tiempo real
- Indicadores de rentabilidad

## 5. Ejemplo de Uso

### Paso 1: Configurar Cuenta
1. Ir a "Account" (⚙️)
2. Ingresar capital: ej. $10,000
3. Seleccionar moneda
4. Ajustar leverages según preferencia
5. Guardar

### Paso 2: Registrar Operación
1. Ir a "Journal" (📓)
2. Completar formulario:
   - Asset: EURUSD
   - Tipo: Forex
   - Operación: Long
   - Volumen: 1.5
   - Entrada: 1.0850
   - Salida: 1.0950
   - SL: 1.0800
   - TP: 1.1000
3. Revisar preview de P&L
4. Registrar operación

### Paso 3: Analizar Resultados
- Ver estadísticas automáticas
- Monitores P&L acumulado
- Exportar datos para análisis externo

## 6. Integración con Router

Nuevas rutas agregadas en `src/router/index.js`:

```javascript
{
  path: '/trading-journal',
  name: 'Trading Journal',
  component: TradingJournal
},
{
  path: '/account-settings',
  name: 'Account Settings',
  component: AccountSettings
}
```

## 7. Navegación Actualizada

Se agregaron dos nuevas opciones en `Navigation.vue`:
- Journal (📓) → `/trading-journal`
- Account (⚙️) → `/account-settings`

## 8. Fórmulas de Cálculo

### P&L con Leverage (Long)
```
P&L = (Precio Salida - Precio Entrada) × Volumen × Leverage
```

### P&L con Leverage (Short)
```
P&L = (Precio Entrada - Precio Salida) × Volumen × Leverage
```

### P&L Porcentaje
```
P&L % = ((Precio Salida - Precio Entrada) / Precio Entrada) × 100
```

### Win Rate
```
Win Rate = (Trades Ganadores / Total Trades) × 100
```

### Profit Factor
```
Profit Factor = Ganancias Totales / |Pérdidas Totales|
```

## 9. Recomendaciones de Uso

1. **Siempre usar Stop Loss**: Protege tu capital
2. **Mantener R/R positivo**: Apunta a 1:2 mínimo
3. **Gestión de riesgo**: Riesgo 1-2% del capital por trade
4. **Revisar regularmente**: Analiza estadísticas semanales/mensuales
5. **Exportar backups**: Exporta datos regularmente

## 10. Estructura de Datos

### Account Settings
```javascript
{
  amount: 10000,
  currency: 'USD',
  leverages: {
    forex: 50,
    stock: 2,
    crypto: 5
  }
}
```

### Trade
```javascript
{
  id: 1705000000000,
  timestamp: '2025-01-20T10:30:00.000Z',
  asset: 'EURUSD',
  operation: 'Long',
  volume: 1.5,
  entryPrice: 1.0850,
  exitPrice: 1.0950,
  stopLoss: 1.0800,
  takeProfit: 1.1000,
  assetType: 'forex',
  leverage: 50,
  priceDifference: 0.0100,
  pnLMoney: 750,
  pnLPercent: 0.92,
  isWin: true
}
```

---

## Próximas Mejoras Sugeridas

- [ ] Gráficas de rendimiento en el tiempo
- [ ] Análisis por tipo de asset
- [ ] Alertas para gestión de riesgo
- [ ] Integración con API de precios en tiempo real
- [ ] Reportes PDF
- [ ] Sincronización con la nube
- [ ] Filtros avanzados en listado de trades
