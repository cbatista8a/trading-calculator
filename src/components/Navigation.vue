<template>
  <nav class="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between gap-6">
        <!-- Logo / Home Link -->
        <router-link to="/" class="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors">
          <span class="text-2xl font-bold">📈 Trading Advisor</span>
        </router-link>

        <!-- Navigation Menu -->
        <ul class="items-center gap-1 hidden md:flex">
          <li v-for="route in navigationRoutes" :key="route.path">
            <router-link
              :to="route.path"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all duration-300',
                isActive(route.path)
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              ]"
            >
              {{ route.icon }} {{ route.label }}
            </router-link>
          </li>
        </ul>

        <!-- Mobile Menu Button (Optional) -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden mt-4 flex flex-col gap-2">
        <router-link
          v-for="route in navigationRoutes"
          :key="route.path"
          :to="route.path"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all duration-300',
            isActive(route.path)
              ? 'bg-indigo-500 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          ]"
          @click="isMobileMenuOpen = false"
        >
          {{ route.icon }} {{ route.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isMobileMenuOpen = ref(false);

const navigationRoutes = [
  { path: '/trading-calculator', label: 'Calculator', icon: '📊' },
  { path: '/trading-timing', label: 'Timing', icon: '🕐' },
  { path: '/checklist', label: 'Checklist', icon: '📋' }
];

const isActive = (path) => {
  return route.path === path;
};
</script>
