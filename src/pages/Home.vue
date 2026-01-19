<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <p class="text-lg text-slate-600 mb-8">
          Bienvenido a tu plataforma de trading. Selecciona un módulo del menú para comenzar.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <router-link
            to="/trading-calculator"
            class="group p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <div class="text-white">
              <h2 class="text-2xl font-bold mb-2">📊 Stock Calculator</h2>
              <p class="text-blue-100">Calcula posiciones, ratios de riesgo/recompensa y gestión de capital</p>
            </div>
          </router-link>

          <router-link
            to="/trading-timing"
            class="group p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <div class="text-white">
              <h2 class="text-2xl font-bold mb-2">🕐 Timing</h2>
              <p class="text-green-100">Plan de trading por horarios y sesiones de mercado</p>
            </div>
          </router-link>
        </div>

        <div class="mt-12 bg-indigo-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 class="text-xl font-bold text-indigo-900 mb-3">💡 Consejos:</h3>
          <ul class="space-y-2 text-indigo-800">
            <li>✓ Usa el menú superior para navegar entre módulos</li>
            <li>✓ Cada módulo está diseñado para una tarea específica</li>
            <li>✓ Los datos se guardan automáticamente en el navegador</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
