# 🚀 Guía Rápida - Trading Journal

## 📋 Inicio Rápido

### 1️⃣ Configura tu Cuenta Primero

**¿Por qué?** La aplicación necesita conocer tu capital y preferencias de leverage para calcular correctamente.

**Pasos:**
1. Haz clic en **"Account" (⚙️)** en la navegación
2. Ingresa tu **Capital** (ej: $10,000)
3. Selecciona tu **Moneda** (USD, EUR, GBP, etc.)
4. Ajusta los **Leverages**:
   - **Forex**: Cuánto leverage usas en pares de divisas
   - **Stocks**: Cuánto leverage usas en acciones
   - **Crypto**: Cuánto leverage usas en criptomonedas
5. Haz clic en **"Guardar Configuración"**

**💡 Consejo:** Si usas leverage 50x en Forex pero sin leverage en acciones, establece los valores según tu operativa.

---

### 2️⃣ Registra tus Operaciones

**¿Dónde?** En **"Journal" (📓)**

**¿Qué Datos Necesitas?**

Cuando abres una operación, anota:
- **Asset**: El símbolo (EURUSD, AAPL, BTC/USD, etc.)
- **Tipo de Asset**: Selecciona si es Forex, Stock o Crypto
- **Operación**: ¿Abriste Long (↑) o Short (↓)?
- **Volumen**: ¿Cuántos lotes/acciones?
- **Precio de Entrada**: ¿A qué precio abriste?

Cuando cierras la operación:
- **Precio de Salida**: ¿A qué precio cerraste?
- **Stop Loss**: ¿Dónde estaba tu SL?
- **Take Profit**: ¿Dónde estaba tu TP?

**Ejemplo Real:**
```
Asset: EURUSD
Tipo: Forex
Operación: Long
Volumen: 1.5 lotes
Entrada: 1.0850
Salida: 1.0950
SL: 1.0800
TP: 1.1000
Leverage: Se llena automáticamente (50x)
```

---

### 3️⃣ Mira tus Resultados

La aplicación **calcula automáticamente**:

✅ **P&L en dinero** - ¿Ganaste o perdiste en dólares?
```
Ganancia = (1.0950 - 1.0850) × 1.5 lotes × 50 leverage = $750
```

✅ **P&L en %** - ¿Cuál fue el retorno porcentual?
```
Retorno = ((1.0950 - 1.0850) / 1.0850) × 100 = 0.92%
```

✅ **Relación Riesgo/Recompensa** - ¿Fue un buen trade?
```
Riesgo = 1.0850 - 1.0800 = 0.0050
Recompensa = 1.1000 - 1.0850 = 0.0150
R/R = 0.0150 / 0.0050 = 3:1 (Excelente!)
```

---

## 📊 Panel de Estadísticas

### ¿Qué significan las métricas?

| Métrica | Qué es | Objetivo |
|---------|--------|----------|
| **P&L Total** | Tu ganancia/pérdida acumulada | ✓ Positivo |
| **Tasa de Acierto** | % de trades ganadores | ✓ >50% |
| **Ganancia Promedio** | Promedio ganado por trade ganador | ✓ Mayor |
| **Pérdida Promedio** | Promedio perdido por trade perdedor | ✗ Menor |
| **Profit Factor** | Ganancias ÷ Pérdidas | ✓ >1.5 es bueno |
| **Mejor Trade** | Tu trade más rentable | 🎯 Referencia |
| **Peor Trade** | Tu trade con mayor pérdida | ⚠️ Aprender de él |

---

## 🎯 Ejemplo Completo: De Principio a Fin

### Escenario: Operador de Forex

**Paso 1: Configurar Cuenta**
- Capital: $5,000
- Moneda: USD
- Forex Leverage: 50x

**Paso 2: Primera Operación**
```
Voy LONG en EURUSD
Entrada: 1.0850 (compro 1 lote = 100,000 EUR)
SL: 1.0800 (pérdida máxima = 500 pips)
TP: 1.1000 (ganancia objetivo = 1,500 pips)

Cierro en: 1.0950 (ganancia = 1,000 pips)
```

**Cálculos Automáticos:**
```
P&L = (1.0950 - 1.0850) × 1 lote × 50 leverage = $500
P&L % = 0.92%
R/R = (1.1000 - 1.0850) / (1.0850 - 1.0800) = 3:1
Estado: ✓ GANADOR
```

**Tu Panel muestra:**
- P&L Total: +$500 (10% del capital)
- Tasa Acierto: 100% (1/1)
- Profit Factor: ∞ (sin pérdidas aún)

---

## 💾 Exporta tus Datos

Haz clic en **"📥 Exportar Datos"** para descargar un JSON con:
- Tu configuración de cuenta
- Todos tus trades
- Fecha de exportación

**¿Para qué sirve?**
- Backup de seguridad
- Análisis en Excel o Google Sheets
- Comparación histórica
- Enviar a un mentor para revisar

---

## ⚠️ Cosas Importantes

### ✅ Buenas Prácticas

1. **Siempre agrega un Stop Loss**
   - Protege tu capital
   - Limita pérdidas potenciales

2. **Mantén R/R positivo** (mínimo 1:2)
   - Por cada $1 de riesgo, gana $2
   - Matemáticamente rentable a largo plazo

3. **Riesgo del 1-2% por operación**
   - De $5,000, riesgo máximo: $50-100
   - Preserva el capital

4. **Registra TODAS las operaciones**
   - Incluye las pequeñas
   - Así ves tu verdadero desempeño

### ❌ Errores Comunes

- ❌ No configurar la cuenta → cálculos incorrectos
- ❌ Olvidar registrar trades → estadísticas incompletas
- ❌ Cambiar el capital constantemente → dificulta el seguimiento
- ❌ No revisar las estadísticas → no mejoras

---

## 🔧 Si Necesitas Cambiar Algo

### Cambiar Capital
1. Ve a "Account" (⚙️)
2. Cambia el monto
3. Guarda

**Nota:** No afecta los trades ya registrados, solo futuras proyecciones

### Cambiar Leverage
1. Ve a "Account" (⚙️)
2. Usa los sliders
3. Guarda

**Próximas operaciones** usarán el nuevo leverage automáticamente

### Eliminar una Operación
1. En el listado de trades
2. Haz clic en la ✕
3. Confirma

---

## 📱 Acceso Rápido (desde cualquier lugar)

| Pantalla | Acceso | Uso |
|----------|--------|-----|
| **Home** | Inicio | Visión general |
| **Account** | ⚙️ | Configurar capital y leverage |
| **Journal** | 📓 | Registrar y ver operaciones |
| **Calculator** | 📊 | Calcular P&L de operaciones |
| **Strategies** | 📈 | Ver estrategias disponibles |
| **Checklist** | 📋 | Checklist pre-operación |

---

## 🎓 Términos Clave

- **Long**: Apuesta a que el precio sube
- **Short**: Apuesta a que el precio baja
- **Leverage**: Amplificación de ganancias/pérdidas (2x, 50x, etc.)
- **P&L**: Profit & Loss (Ganancia y Pérdida)
- **SL (Stop Loss)**: Nivel donde pierdes el máximo
- **TP (Take Profit)**: Nivel donde cierras ganancia
- **R/R Ratio**: Relación Riesgo/Recompensa
- **Profit Factor**: Rentabilidad general del sistema

---

## 🚀 Próximos Pasos

1. **Configura tu cuenta** hoy mismo
2. **Registra 10 operaciones** esta semana
3. **Analiza tus resultados**
4. **Ajusta tu estrategia**
5. **¡Repite!**

---

**¡Buena suerte con tu trading! 📈**
