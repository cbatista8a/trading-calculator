# 📊 ANÁLISIS DE FACTIBILIDAD: Calculadoras Multi-Activo

**Fecha:** 21 de enero de 2026
**Estado:** Análisis completado - Listo para implementación

---

## 🎯 OBJETIVO

Agregar calculadoras para Forex, Índices y Cryptos junto con la actual calculadora de Stock, manteniendo la reutilización de código y coherencia visual.

---

## 📈 ANÁLISIS COMPARATIVO DE CÁLCULOS

### 1. **STOCK (Actual)**
```
Entrada del usuario:
- Capital Inicial
- Riesgo Total (%)
- Stop Loss (%)
- Take Profit (%)
- Precio de Entrada
- Ratio R:R

Cálculos:
├─ Riesgo Total ($) = Capital × Riesgo%
├─ Riesgo por Acción = Precio × SL%
├─ Stop Loss = Precio - Riesgo/Acción
├─ Take Profit = Precio × (1 + TP%)
├─ TP (R:R) = Precio + (Riesgo/Acción × R:R)
└─ Lotaje = Riesgo Total / Riesgo/Acción
```

### 2. **FOREX**
```
Entrada del usuario:
- Capital Inicial
- Riesgo Total (%)
- Stop Loss (pips)
- Take Profit (pips)
- Precio de Entrada
- Ratio R:R

Cálculos:
├─ Riesgo Total ($) = Capital × Riesgo% [IDÉNTICO]
├─ Riesgo por Lote = (Precio × Volumen) × (Pips / 10000)
├─ Stop Loss = Precio - (SL_pips / 10000)
├─ Take Profit = Precio + (TP_pips / 10000)
├─ TP (R:R) = Precio + (SL_pips × R:R / 10000)
└─ Lotaje = Riesgo Total / Riesgo por Lote
```

**Diferencia clave:** Usa pips en lugar de porcentaje, conversión a precios diferentes

### 3. **ÍNDICES**
```
Entrada del usuario:
- Capital Inicial
- Riesgo Total (%)
- Stop Loss (puntos)
- Take Profit (puntos)
- Precio de Entrada
- Ratio R:R

Cálculos:
├─ Riesgo Total ($) = Capital × Riesgo% [IDÉNTICO]
├─ Riesgo por Contrato = Puntos × Point Value (varía por índice)
├─ Stop Loss = Precio - Puntos
├─ Take Profit = Precio + Puntos
├─ TP (R:R) = Precio + (Puntos × R:R)
└─ Lotaje = Riesgo Total / Riesgo por Contrato
```

**Diferencia clave:** Usa puntos + Point Value, configuración por índice

### 4. **CRYPTO**
```
Entrada del usuario:
- Capital Inicial
- Riesgo Total (%)
- Stop Loss (%)
- Take Profit (%)
- Precio de Entrada
- Ratio R:R

Cálculos:
├─ Riesgo Total ($) = Capital × Riesgo% [IDÉNTICO]
├─ Riesgo por Unidad = Precio × SL%
├─ Stop Loss = Precio × (1 - SL%)
├─ Take Profit = Precio × (1 + TP%)
├─ TP (R:R) = Precio × (1 + (Riesgo% × R:R))
└─ Lotaje = Riesgo Total / Riesgo por Unidad
```

**Diferencia clave:** IDÉNTICO al de Stock

---

## 🔍 CONCLUSIONES DEL ANÁLISIS

### ✅ SIMILITUDES (Reutilizables)

1. **Cálculo de Riesgo Total:** `Capital × Riesgo%` - MISMO PARA TODOS
2. **Concepto de Stop Loss y Take Profit:** Universal
3. **Ratio Riesgo/Beneficio:** Universal
4. **Interfaz gráfica base:** Los mismos campos principales
5. **Colores e iconos Long/Short:** Directamente reutilizables

### ❌ DIFERENCIAS (Requieren Variación)

| Aspecto | Stock | Forex | Índices | Crypto |
|---------|-------|-------|---------|--------|
| Unidad de SL/TP | % | Pips | Puntos | % |
| Conversión | x (1±%) | ÷ 10000 | × Point Value | x (1±%) |
| Campos extras | - | - | Point Value | - |
| Complejidad | Baja | Media | Media-Alta | Baja |
| Reutilización UI | 100% | 95% | 85% | 100% |

---

## 🏗️ RECOMENDACIÓN ARQUITECTÓNICA

### **OPCIÓN ELEGIDA: Arquitectura Híbrida Modular**

#### ✅ **PROS DE ESTA OPCIÓN:**
- Máxima reutilización de código (~80%)
- Mantenimiento centralizado
- UX coherente
- Escalabilidad
- Interfaz limpia

#### 📋 **ESTRUCTURA PROPUESTA:**

```
src/
├── composables/
│   └── calculators/
│       ├── useStockCalculator.js     [NUEVO] (Lógica Stock/Crypto)
│       ├── useForexCalculator.js     [NUEVO] (Lógica Forex)
│       ├── useIndicesCalculator.js   [NUEVO] (Lógica Índices)
│       └── usCalculatorCommon.js     [NUEVO] (Funciones comunes)
│
├── pages/
│   └── CalculatorHub.vue             [NUEVO] (Hub de selección)
│
├── components/
│   ├── TradingCalculator.vue         [REFACTOR] (Stock/Crypto)
│   ├── calculators/
│   │   ├── ForexCalculator.vue       [NUEVO]
│   │   ├── IndicesCalculator.vue     [NUEVO]
│   │   ├── CalculatorBase.vue        [NUEVO] (Componente base)
│   │   └── CalculatorSelector.vue    [NUEVO]
│   └── ...
│
└── router/
    └── index.js                       [ACTUALIZAR]
```

#### 🔄 **FLUJO PROPUESTO:**

```
Home.vue
   ↓ (click en "Calculadora")
   ↓
CalculatorHub.vue (Selecciona tipo de activo)
   ├─ 📈 Stock
   ├─ 💱 Forex
   ├─ 📊 Índices
   └─ 🪙 Crypto
   ↓
TradingCalculator.vue O ForexCalculator.vue O IndicesCalculator.vue
   ├─ Comparte: useCalculatorCommon.js
   ├─ Comparte: Estructura visual 80%
   └─ Diferencia: Lógica específica en cada composable
```

---

## 📊 TABLA COMPARATIVA DE OPCIONES

| Criterio | Opción A (Única) | Opción B (Múltiples) | **Opción C (Híbrida)** |
|----------|------------------|----------------------|----------------------|
| **Reutilización código** | 85% | 50% | **95%** |
| **Complejidad** | 🔴 Alta | 🟢 Baja | 🟡 Media |
| **Mantenimiento** | 🔴 Difícil | 🟢 Fácil | 🟡 Moderado |
| **UX** | 🟡 Confusa | 🟢 Clara | **✅ Óptima** |
| **Escalabilidad** | 🔴 Limitada | 🟢 Excelente | **✅ Excelente** |
| **Tiempo dev** | 8-10h | 4-6h | **6-8h** |

---

## ✨ IMPLEMENTACIÓN RECOMENDADA

### **Paso 1: Crear Infraestructura Base** (2h)
- [ ] `usCalculatorCommon.js` - Funciones compartidas
- [ ] Crear carpeta `calculators/`
- [ ] `CalculatorBase.vue` - Componente base (estilos/estructura)

### **Paso 2: Refactorizar Stock** (1.5h)
- [ ] Extraer lógica a `useStockCalculator.js`
- [ ] Heredar de `CalculatorBase.vue`
- [ ] `TradingCalculator.vue` mantiene compatibilidad

### **Paso 3: Crear Forex Calculator** (1.5h)
- [ ] `useForexCalculator.js` con lógica de pips
- [ ] `ForexCalculator.vue`
- [ ] Campos específicos (pips en lugar de %)

### **Paso 4: Crear Índices Calculator** (2h)
- [ ] `useIndicesCalculator.js` con Point Value
- [ ] `IndicesCalculator.vue`
- [ ] Selector de índice

### **Paso 5: Agregar Crypto Calculator** (1h)
- [ ] Reutilizar `useStockCalculator.js`
- [ ] `CryptoCalculator.vue` (hereda de Stock)

### **Paso 6: Crear Hub y Rutas** (1h)
- [ ] `CalculatorHub.vue` - Página de selección
- [ ] Actualizar `router/index.js`
- [ ] Actualizar `Navigation.vue`

---

## 🎨 CAMBIOS VISUALES MÍNIMOS

### **Componente Base Compartido:**
```
┌─────────────────────────────────┐
│      Título + Asistencia        │  ← Compartido
├─────────────────────────────────┤
│  Long | Short (Selector)        │  ← Compartido
├─────────────────────────────────┤
│   Capital Inicial               │  ← Compartido
│   Riesgo Total (%)              │  ← Compartido
│   [Campo específico del activo] │  ← Diferente
│   [Campos según tipo]           │  ← Diferente
├─────────────────────────────────┤
│   📊 RESULTADOS                 │  ← Compartido (mismo estilo)
│   ├─ Lotaje                     │
│   ├─ Riesgo / Acción            │
│   ├─ Stop Loss / SL             │
│   ├─ Take Profit / TP           │
│   └─ BreakEven                  │
└─────────────────────────────────┘
```

---

## 💾 DATOS A PERSISTIR

```javascript
// localStorage para cada tipo de calculadora
{
  "calc_stock": {
    lastInputs: { capital, riskTotal, riskOp, reward, price, ... },
    lastResults: { lotSize, stopLoss, takeProfit, ... }
  },
  "calc_forex": { ... },
  "calc_indices": { ... },
  "calc_crypto": { ... }
}
```

---

## 🚀 VENTAJAS DE LA OPCIÓN ELEGIDA

✅ **Máxima Reutilización** - 95% de código compartido
✅ **Bajo Acoplamiento** - Cada lógica en su composable
✅ **Fácil Mantenimiento** - Cambios centralizados
✅ **Escalabilidad** - Agregar CFD, Futuros es trivial
✅ **UX Óptima** - Hub intuitivo, interfaz coherente
✅ **Tiempo de Dev Razonable** - ~6-8 horas
✅ **Testing** - Cada calculadora testeable por separado

---

## ⚠️ CONSIDERACIONES

1. **Point Value en Índices** - Necesita tabla de referencia (ES-100, DAX, etc.)
2. **Pips en Forex** - Considerar pares JPY (0.01 vs 0.0001)
3. **Leverage** - Ya soportado en Account Settings
4. **Persistencia** - Guardar últimos valores usados

---

## 📝 CONCLUSIÓN

**SE RECOMIENDA PROCEDER CON LA OPCIÓN C (Híbrida):**

La mejor estrategia es **una calculadora por tipo de activo** con una **infraestructura base compartida**, ofreciendo:
- ✨ Claridad de UX
- 📦 Máxima reutilización de código
- 🔧 Facilidad de mantenimiento
- 🚀 Escalabilidad para futuros activos

**Tiempo total estimado:** 6-8 horas
**Complejidad:** Media (código modular y limpio)

---
