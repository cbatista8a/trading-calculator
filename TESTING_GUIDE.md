# 🧪 Guía de Pruebas - Trading Journal

## Escenarios de Prueba

### Test 1: Configuración Inicial
**Objetivo:** Verificar que la configuración de cuenta se guarde correctamente

**Pasos:**
1. Ir a `/account-settings`
2. Ingresar:
   - Capital: 10000
   - Moneda: USD
   - Forex: 50x
   - Stock: 2x
   - Crypto: 5x
3. Hacer clic en "Guardar Configuración"
4. Actualizar la página (F5)
5. **Verificar:** Los valores deben mantenerse

**Resultado esperado:** ✅ Los datos persisten en localStorage

---

### Test 2: Registro de Trade Long Ganador
**Objetivo:** Verificar cálculos correctos para Long ganador

**Pasos:**
1. Ir a `/trading-journal`
2. **Debería redirigir a `/account-settings`** si no hay configuración
3. Después de configurar, registrar:
   ```
   Asset: EURUSD
   Tipo: Forex (auto-completa Leverage: 50)
   Operación: Long
   Volumen: 1.0
   Entrada: 1.0850
   Salida: 1.0950
   SL: 1.0800
   TP: 1.1000
   ```

**Verificación de cálculos:**
- P&L = (1.0950 - 1.0850) × 1.0 × 50 = **$500** ✅
- P&L % = ((1.0950 - 1.0850) / 1.0850) × 100 = **0.92%** ✅
- R/R = (1.1000 - 1.0850) / (1.0850 - 1.0800) = **3:1** ✅
- isWin = true ✅

**Resultado esperado:** El trade aparece en verde en el listado

---

### Test 3: Registro de Trade Short Perdedor
**Objetivo:** Verificar cálculos correctos para Short perdedor

**Pasos:**
1. Registrar:
   ```
   Asset: GBPUSD
   Tipo: Forex (Leverage: 50)
   Operación: Short
   Volumen: 0.5
   Entrada: 1.3200
   Salida: 1.3300 (Peor precio para Short)
   SL: 1.3350
   TP: 1.3000
   ```

**Verificación de cálculos:**
- P&L = (1.3200 - 1.3300) × 0.5 × 50 = **-$250** ✅
- P&L % = ((1.3200 - 1.3300) / 1.3200) × 100 = **-0.76%** ✅
- isWin = false ✅

**Resultado esperado:** El trade aparece en rojo

---

### Test 4: Estadísticas con Múltiples Trades
**Objetivo:** Verificar agregación correcta de estadísticas

**Pasos:**
1. Registrar 5 trades:
   - 3 ganadores: $500, $300, $200 = $1000 total
   - 2 perdedores: -$150, -$100 = -$250 total

**Verificación:**
- P&L Total: $1000 - $250 = **$750** ✅
- Win Rate: 3/5 = **60%** ✅
- Avg Win: $1000 / 3 = **$333.33** ✅
- Avg Loss: $250 / 2 = **$125** ✅
- Profit Factor: $1000 / $250 = **4.0** ✅
- Mejor Trade: **$500** ✅
- Peor Trade: **-$250** ✅

**Resultado esperado:** Todas las métricas coinciden

---

### Test 5: Filtrado de Trades
**Objetivo:** Verificar que el filtro funciona

**Pasos:**
1. Tener múltiples trades (ganadores y perdedores)
2. Hacer clic en "✓ Ganancias"
3. **Verificar:** Solo aparecen los trades verdes
4. Hacer clic nuevamente en "📊 Todas"
5. **Verificar:** Vuelven todos los trades

**Resultado esperado:** El filtro funciona sin errores

---

### Test 6: Eliminación de Trade
**Objetivo:** Verificar que la eliminación funciona y actualiza estadísticas

**Pasos:**
1. Tener varios trades
2. Hacer clic en ✕ de un trade ganador
3. Confirmar eliminación
4. **Verificar:** El trade desaparece
5. **Verificar:** Las estadísticas se actualizan (P&L, Win Rate, etc.)

**Resultado esperado:** Trade eliminado y estadísticas recalculadas

---

### Test 7: Diferentes Tipos de Assets
**Objetivo:** Verificar que el leverage se auto-completa según tipo

**Pasos:**

**7a. Forex:**
- Seleccionar tipo Forex → Leverage debe ser 50 ✅

**7b. Stock:**
- Seleccionar tipo Stock → Leverage debe ser 2 ✅

**7c. Crypto:**
- Seleccionar tipo Crypto → Leverage debe ser 5 ✅

**Resultado esperado:** Cada tipo tiene su leverage correcto

---

### Test 8: Actualización de Capital
**Objetivo:** Verificar que cambiar capital no borra trades

**Pasos:**
1. Registrar 3 trades
2. Ir a `/account-settings`
3. Cambiar capital de 10000 a 20000
4. Guardar
5. Volver a `/trading-journal`
6. **Verificar:** Los 3 trades siguen allí
7. **Verificar:** El nuevo saldo estimado se calcula correctamente

**Resultado esperado:** Trades intactos, saldo actualizado

---

### Test 9: Exportar Datos
**Objetivo:** Verificar que la exportación JSON funciona

**Pasos:**
1. Tener datos configurados y trades registrados
2. Ir a `/trading-journal`
3. Hacer clic en "📥 Exportar Datos"
4. **Verificar:** Se descarga un archivo JSON
5. Abrir el JSON en editor de texto
6. **Verificar:** Contiene:
   ```json
   {
     "accountSettings": { ... },
     "trades": [ ... ],
     "exportDate": "2025-01-20T..."
   }
   ```

**Resultado esperado:** Archivo válido con estructura correcta

---

### Test 10: Casos Edge/Extremos
**Objetivo:** Verificar comportamiento en casos especiales

**Test 10a: P&L Cero**
```
Entrada: 1.0850
Salida: 1.0850
P&L debe ser: $0.00
isWin debe ser: false (no positivo)
```

**Test 10b: Muy Pequeño**
```
Volumen: 0.01
Entrada: 1.0850
Salida: 1.0851
P&L = (1.0851 - 1.0850) × 0.01 × 50 = $0.05
Debe mostrar correctamente sin errores de redondeo
```

**Test 10c: Muy Grande**
```
Capital: 1000000
Leverage: 100
Volumen: 100
P&L debe calcularse correctamente sin overflow
```

**Resultado esperado:** Sin errores, cálculos precisos

---

### Test 11: Navegación
**Objetivo:** Verificar que toda la navegación funciona

**Pasos:**
1. Desde Home → Account ✅
2. Desde Account → Journal ✅
3. Desde Journal → Account ✅
4. Desde Journal → Home ✅
5. Verificar que todas las pestañas están visible en Mobile y Desktop

**Resultado esperado:** Navegación fluida sin errores

---

### Test 12: Responsividad
**Objetivo:** Verificar que funciona en diferentes tamaños

**Pasos:**
1. Abrir en Desktop (1920px)
   - Verificar 4 columnas de stats ✅

2. Abrir en Tablet (768px)
   - Verificar 2 columnas de stats ✅
   - Verificar formulario y account summary se apilan ✅

3. Abrir en Mobile (375px)
   - Verificar 1 columna de stats ✅
   - Verificar menu hamburguesa funciona ✅
   - Verificar scroll horizontal no aparece ✅

**Resultado esperado:** Interfaz adaptable sin broken layout

---

## Checklist de Testing Manual

```
ACCOUNT SETTINGS
□ Campo Capital acepta números
□ Currency dropdown funciona
□ Sliders Forex mueven 1-500
□ Sliders Stock mueven 1-10
□ Sliders Crypto mueven 1-100
□ Botón Guardar persiste datos
□ Botón Restablecer vuelve a default
□ Summary Card actualiza en tiempo real

TRADING JOURNAL - FORM
□ Campo Asset acepta texto
□ Dropdown Asset Type muestra 3 opciones
□ Botones Long/Short se seleccionan
□ Campos numéricos aceptan decimales
□ Leverage se auto-llena según Asset Type
□ Preview muestra P&L antes de guardar
□ Botón Registrar agrega a listado
□ Form se limpia después de registrar
□ Notificación de éxito aparece

TRADING JOURNAL - STATS
□ P&L Total se calcula correcto
□ Win Rate es 0-100%
□ Avg Win es positivo
□ Avg Loss es negativo
□ Profit Factor es > 1 para sistemas rentables
□ Best Trade es mayor P&L
□ Worst Trade es menor P&L
□ Todas las métricas se actualizan al agregar trade

TRADING JOURNAL - LIST
□ Trades aparecen en orden más reciente primero
□ Color verde para ganadores
□ Color rojo para perdedores
□ Botón ✕ elimina con confirmación
□ Filtro "✓ Ganancias" funciona
□ Botón "📥 Exportar" descarga JSON

PERSISTENCIA
□ Datos persisten al actualizar página
□ Datos persisten al cerrar navegador
□ LocalStorage contiene datos correctos

EDGE CASES
□ P&L = $0 se maneja correctamente
□ Números muy pequeños se redondean OK
□ Números muy grandes se calculan OK
□ Division por cero se maneja (R/R con SL = Entrada)
```

---

## Datos de Prueba Sugeridos

### Set Completo para Demo

```javascript
// Configuración
{
  amount: 10000,
  currency: 'USD',
  leverages: {
    forex: 50,
    stock: 2,
    crypto: 5
  }
}

// Trades
[
  { // Winner 1
    asset: 'EURUSD',
    operation: 'Long',
    volume: 1.0,
    entryPrice: 1.0850,
    exitPrice: 1.0950,
    stopLoss: 1.0800,
    takeProfit: 1.1000,
    assetType: 'forex',
    leverage: 50
  },
  { // Loser 1
    asset: 'GBPUSD',
    operation: 'Short',
    volume: 0.5,
    entryPrice: 1.3200,
    exitPrice: 1.3300,
    stopLoss: 1.3350,
    takeProfit: 1.3000,
    assetType: 'forex',
    leverage: 50
  },
  { // Winner 2
    asset: 'AAPL',
    operation: 'Long',
    volume: 100,
    entryPrice: 150.00,
    exitPrice: 155.00,
    stopLoss: 148.00,
    takeProfit: 160.00,
    assetType: 'stock',
    leverage: 2
  }
]
```

---

## Bugs Conocidos a Verificar

- [ ] Redondeo de decimales en porcentajes
- [ ] Overflow de números muy grandes
- [ ] Performance con >1000 trades
- [ ] Sincronización entre pestañas del navegador

---

## Notas de Testing

- Usar Chrome DevTools para inspeccionar localStorage
- Abrir en incógnito para empezar con datos limpios
- Probar en diferentes navegadores (Chrome, Safari, Firefox)
- Probar en diferentes dispositivos (Desktop, Tablet, Mobile)

