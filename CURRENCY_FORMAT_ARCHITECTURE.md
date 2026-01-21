# 💱 Arquitectura del Formateo Centralizado de Monedas

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│           Account Settings (useAccountSettings)             │
│  - Currency: USD / EUR / GBP / JPY / AUD                    │
│  - Almacenado en localStorage                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │   useCurrencyFormat()           │
        │   (Nuevo Composable)            │
        │                                 │
        │  ✓ formatCurrency()   (€/$ etc) │
        │  ✓ formatNumber()     (decimales│
        │  ✓ formatPrice()      (4 decs)  │
        │  ✓ formatPercent()    (% format)│
        └────────┬─────────────────────────┘
                 │
        ┌────────┴──────────┬──────────┬──────────┬──────────┐
        │                   │          │          │          │
        ▼                   ▼          ▼          ▼          ▼
   ┌──────────┐      ┌───────────┐ ┌────────┐ ┌──────┐ ┌────────┐
   │Calculadora│      │  Journal  │ │Account │ │Trade │ │Trade  │
   │  (Trading)│      │           │ │Settings│ │Stats │ │Form   │
   └──────────┘      └───────────┘ └────────┘ └──────┘ └────────┘
        │                   │          │          │          │
        └───────────────────┴──────────┴──────────┴──────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   UI con Valores  │
                  │  Formateados      │
                  │                   │
                  │  € 1.234,50       │
                  │  $ 2.000,00       │
                  │  £ 3.456,78       │
                  └──────────────────┘
```

## Componentes Integrados

### 1️⃣ **Calculadora de Trading**
```
TradingCalculator.vue
├── formatCurrency() → Riesgo Total
├── formatCurrency() → Riesgo por Acción
├── formatCurrency() → Stop Loss
├── formatCurrency() → Take Profit
├── formatCurrency() → Take Profit (R:R)
├── formatCurrency() → BreakEven
└── formatPercent() → Ratio R:R
```

### 2️⃣ **Trading Journal**
```
TradingJournal.vue
├── formatNumber() → Capital Inicial
├── formatNumber() → Capital Disponible
├── formatPercent() → % desde inicial
└── formatCurrency() → P&L Total
```

### 3️⃣ **Configuración de Cuenta**
```
AccountSettings.vue
├── formatNumber() → Capital Inicial
├── formatNumber() → Capital Disponible
└── formatPercent() → % desde capital inicial
```

### 4️⃣ **Estadísticas de Trades**
```
TradeStats.vue
├── formatCurrency() → P&L Total
├── formatCurrency() → Ganancia Promedio
├── formatCurrency() → Pérdida Promedio
├── formatCurrency() → Mejor Trade
└── formatCurrency() → Peor Trade
```

### 5️⃣ **Formulario de Trade**
```
TradeForm.vue
├── formatCurrency() → P&L Estimado
└── formatCurrency() → Margen Requerido
```

### 6️⃣ **Lista de Trades**
```
TradesList.vue
├── formatCurrency() → P&L ($)
└── formatPrice() → Entrada/Salida (4 decimales)
```

## Matriz de Precisión

| Tipo de Valor | Precisión | Ejemplo | Función |
|---|---|---|---|
| **Monedas** | 2-4 decimales | € 1.234,50 | `formatCurrency()` |
| **Números** | 2-4 decimales | 1.234,50 | `formatNumber()` |
| **Precios** | 4 decimales | 1.0850 | `formatPrice()` |
| **Porcentajes** | 2 decimales | 5,50% | `formatPercent()` |

## Cambio de Moneda en Tiempo Real

**Antes:**
```javascript
// Hardcodeado
"currency: 'EUR'"
// Necesitaba actualizar cada componente
```

**Ahora:**
```javascript
// Dinámico y centralizado
const { getCurrency } = useAccountSettings()
// Se actualiza automáticamente en toda la app
```

## Ventajas de la Implementación

✅ **Mantenibilidad**: Un único punto de control
✅ **Consistencia**: Mismo formato en toda la app
✅ **Flexibilidad**: Cambios globales sin revisar componentes
✅ **Reactividad**: Cambios en tiempo real en la UI
✅ **Escalabilidad**: Fácil de extender con nuevos formatos
✅ **Localización**: Usa locale es-ES para números españoles

## Cambio de Moneda - Paso a Paso

```
1. Usuario selecciona moneda en Account Settings
   ↓
2. Se guarda en localStorage
   ↓
3. useAccountSettings.getCurrency actualiza
   ↓
4. useCurrencyFormat detecta cambio (reactividad)
   ↓
5. Todos los componentes se re-renderizan
   ↓
6. Nuevos símbolos de moneda aparecen en toda la app
```

## Ejemplos de Formateo

### Moneda (EUR)
```
1.5      → €1,50
1.234    → €1,23
1.23456  → €1,2346
```

### Número
```
1.5      → 1,50
1.234    → 1,23
1.23456  → 1,2346
```

### Precio
```
1.5      → 1.5000
1.234    → 1.2340
1.23456  → 1.2346
```

### Porcentaje
```
5.5      → 5,50%
5.234    → 5,23%
5.23456  → 5,23%
```
