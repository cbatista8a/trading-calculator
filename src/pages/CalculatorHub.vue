<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          🧮 Calculadoras de Trading
        </h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto">
          Elige el tipo de activo que deseas calcular. Cada calculadora está optimizada para proporcionar resultados precisos según el mercado.
        </p>
      </div>

      <!-- Grid de Calculadoras -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <!-- Stock Calculator -->
        <div
          @click="navigateTo('stock')"
          class="group cursor-pointer"
        >
          <div class="h-full bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center">
            <div class="text-5xl mb-4">📈</div>
            <h2 class="text-2xl font-bold text-white mb-2">Stock</h2>
            <p class="text-green-100 text-sm">
              Acciones y valores en el mercado
            </p>
            <div class="mt-4 text-xs text-green-100">
              <span class="inline-block bg-green-700/50 px-2 py-1 rounded">Long/Short</span>
            </div>
          </div>
        </div>

        <!-- Forex Calculator -->
        <div
          @click="navigateTo('forex')"
          class="group cursor-pointer"
        >
          <div class="h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center">
            <div class="text-5xl mb-4">💱</div>
            <h2 class="text-2xl font-bold text-white mb-2">Forex</h2>
            <p class="text-blue-100 text-sm">
              Pares de divisas en el mercado de cambios
            </p>
            <div class="mt-4 text-xs text-blue-100">
              <span class="inline-block bg-blue-700/50 px-2 py-1 rounded">Pips</span>
            </div>
          </div>
        </div>

        <!-- Indices Calculator -->
        <div
          @click="navigateTo('indices')"
          class="group cursor-pointer"
        >
          <div class="h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center">
            <div class="text-5xl mb-4">📊</div>
            <h2 class="text-2xl font-bold text-white mb-2">Índices</h2>
            <p class="text-purple-100 text-sm">
              Índices bursátiles y mercados
            </p>
            <div class="mt-4 text-xs text-purple-100">
              <span class="inline-block bg-purple-700/50 px-2 py-1 rounded">Puntos</span>
            </div>
          </div>
        </div>

        <!-- Crypto Calculator -->
        <div
          @click="navigateTo('crypto')"
          class="group cursor-pointer"
        >
          <div class="h-full bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center">
            <div class="text-5xl mb-4">🪙</div>
            <h2 class="text-2xl font-bold text-white mb-2">Crypto</h2>
            <p class="text-yellow-100 text-sm">
              Criptomonedas y activos digitales
            </p>
            <div class="mt-4 text-xs text-yellow-100">
              <span class="inline-block bg-orange-700/50 px-2 py-1 rounded">Long/Short</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="bg-slate-700/50 border border-slate-600 rounded-xl p-8 backdrop-blur-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="text-3xl mb-2">✅</div>
            <h3 class="text-lg font-bold text-white mb-2">Cálculos Precisos</h3>
            <p class="text-slate-300 text-sm">
              Algoritmos optimizados para cada tipo de mercado con máxima precisión
            </p>
          </div>
          <div>
            <div class="text-3xl mb-2">⚡</div>
            <h3 class="text-lg font-bold text-white mb-2">Resultados Instantáneos</h3>
            <p class="text-slate-300 text-sm">
              Cálculos en tiempo real mientras escribes tus parámetros
            </p>
          </div>
          <div>
            <div class="text-3xl mb-2">💾</div>
            <h3 class="text-lg font-bold text-white mb-2">Guarda tus Datos</h3>
            <p class="text-slate-300 text-sm">
              Tus últimos cálculos se guardan automáticamente para uso posterior
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalculatorHub',
  methods: {
    navigateTo(assetType) {
      // Todas las calculadoras están disponibles
      this.$router.push(`/calculators/${assetType}`);
    }
  }
}
</script>

<style scoped>
/* Los estilos utilizan Tailwind, no necesita CSS adicional */
</style>
