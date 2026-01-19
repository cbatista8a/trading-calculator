<template>
  <div class="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>
        </svg>
        <h1 class="text-3xl font-bold text-slate-800">Plan de Trading por Horarios - Italia 🇮🇹</h1>
      </div>
      <p class="text-slate-600 mb-4">
        Selecciona tu franja horaria disponible para ver los 2 mejores assets a vigilar.
        <span class="font-bold text-green-600"> Límite: 2 assets por sesión</span> para evitar sobreanalisis.
      </p>

      <div class="bg-green-50 border-2 border-green-300 rounded-lg p-4">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div class="text-sm text-green-900">
            <span class="font-bold">Regla de Oro:</span> Elige UNA sesión según tu disponibilidad.
            Monitorea SOLO los 2 assets recomendados. Si no hay setup con RR ≥ 1:2.5 en 1 hora → CIERRA plataforma y vuelve después.
          </div>
        </div>
      </div>
    </div>

    <!-- Trading Sessions -->
    <SessionCard
      v-for="(session, key) in tradingSessions"
      :key="key"
      :session="session"
    />

    <!-- Executive Summary Table -->
    <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">🎯 Resumen Ejecutivo</h2>
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-800 text-white">
            <th class="p-3 text-left">Sesión</th>
            <th class="p-3 text-left">Horario</th>
            <th class="p-3 text-left">Asset Principal</th>
            <th class="p-3 text-left">Asset Secundario</th>
            <th class="p-3 text-left">RR Esperado</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b bg-blue-50">
            <td class="p-3 font-bold">Mañana 🌅</td>
            <td class="p-3">09:00-13:00</td>
            <td class="p-3 font-semibold">EUR/USD</td>
            <td class="p-3">GBP/USD</td>
            <td class="p-3 text-green-600 font-bold">1:2.5 - 1:3.5</td>
          </tr>
          <tr class="border-b bg-orange-50">
            <td class="p-3 font-bold">Tarde ☀️</td>
            <td class="p-3">15:00-18:00</td>
            <td class="p-3 font-semibold">NAS100</td>
            <td class="p-3">GBP/JPY</td>
            <td class="p-3 text-green-600 font-bold">1:2.5 - 1:4.0</td>
          </tr>
          <tr class="border-b bg-purple-50">
            <td class="p-3 font-bold">Noche 🌙</td>
            <td class="p-3">21:00-23:00</td>
            <td class="p-3 font-semibold">BTC/USDT</td>
            <td class="p-3">AUD/USD</td>
            <td class="p-3 text-green-600 font-bold">1:2.0 - 1:3.5</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import SessionCard from './trading/SessionCard.vue';

const tradingSessions = {
  morning: {
    title: "MAÑANA",
    time: "09:00 - 13:00",
    icon: "🌅",
    color: "blue",
    description: "Overlap Europa + inicio Londres",
    marketOpen: ["Frankfurt (08:00)", "Londres (09:00)", "Milán (09:00)"],
    assets: [
      {
        name: "EUR/USD",
        type: "Forex Major",
        volatility: "Alta",
        avgPips: "40-70 pips",
        whyGood: "Mayor volumen del día, spread bajo, overlaps Europa-Londres",
        bestHours: "09:00-11:00 (apertura Londres)",
        rrPotential: "1:2.5 - 1:3.5",
        tips: "Espera confirmación post-apertura Londres (09:00). Evita primeros 15min por volatilidad extrema."
      },
      {
        name: "GBP/USD (Cable)",
        type: "Forex Major",
        volatility: "Muy Alta",
        avgPips: "60-100 pips",
        whyGood: "Máximo volumen en horario Londres, movimientos claros",
        bestHours: "09:30-11:30 (post-apertura Londres)",
        rrPotential: "1:3.0 - 1:4.0",
        tips: "Muy volátil, amplía SL 10-15 pips. Ideal para RR altos."
      }
    ],
    alternativeAssets: [
      { name: "DAX (GER40)", reason: "Alta volatilidad 09:00-10:00" },
      { name: "EUR/GBP", reason: "Puro play Europa" }
    ]
  },
  afternoon: {
    title: "TARDE",
    time: "15:00 - 18:00",
    icon: "☀️",
    color: "orange",
    description: "Overlap Europa + USA (máxima liquidez)",
    marketOpen: ["NYSE (15:30)", "NASDAQ (15:30)", "Londres activo", "Europa cerrando"],
    assets: [
      {
        name: "NAS100 (Nasdaq)",
        type: "Índice USA",
        volatility: "Muy Alta",
        avgPips: "150-250 puntos",
        whyGood: "Apertura USA = máxima volatilidad, tendencias claras",
        bestHours: "15:30-17:00 (primera hora USA)",
        rrPotential: "1:2.5 - 1:4.0",
        tips: "Espera setup completo antes de entrar. Posible gap en apertura."
      },
      {
        name: "GBP/JPY",
        type: "Forex Cross",
        volatility: "Extrema",
        avgPips: "80-150 pips",
        whyGood: "Overlap Londres-NY, movimientos explosivos en noticias",
        bestHours: "15:30-17:30 (overlap máximo)",
        rrPotential: "1:3.0 - 1:5.0",
        tips: "⚠️ Solo para traders experimentados. SL amplios (80-100 pips)."
      }
    ],
    alternativeAssets: [
      { name: "US30 (Dow Jones)", reason: "Menos volátil que NAS100" },
      { name: "USD/CAD", reason: "Correlación con petróleo WTI" }
    ]
  },
  night: {
    title: "NOCHE",
    time: "21:00 - 23:00",
    icon: "🌙",
    color: "purple",
    description: "Sesión Asia temprana + late USA",
    marketOpen: ["Tokio (02:00)", "Sydney (00:00)", "NYSE cerrando"],
    assets: [
      {
        name: "BTC/USDT",
        type: "Crypto",
        volatility: "Alta",
        avgPips: "€200-400 movimiento",
        whyGood: "24/7, sin gaps, volatilidad constante nocturna",
        bestHours: "21:00-23:00 (preparación Asia)",
        rrPotential: "1:2.0 - 1:3.5",
        tips: "Usa M5 o M15. Spreads estables. Ideal para tu horario flexible."
      },
      {
        name: "AUD/USD (Aussie)",
        type: "Forex Major",
        volatility: "Media-Alta",
        avgPips: "40-70 pips",
        whyGood: "Actividad pre-sesión Sydney, correlación con commodities",
        bestHours: "22:00-23:30 (anticipación Asia)",
        rrPotential: "1:2.0 - 1:3.0",
        tips: "Spreads aumentan levemente. Verifica noticias económicas Australia."
      }
    ],
    alternativeAssets: [
      { name: "ETH/USDT", reason: "Alternativa crypto con buena liquidez" },
      { name: "NZD/USD", reason: "Similar a AUD pero más volátil" }
    ]
  }
};
</script>
