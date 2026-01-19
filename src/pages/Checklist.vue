<template>
  <div class="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <h1 class="text-3xl font-bold text-slate-800">Pre-Session Checklist 📋</h1>
      </div>
      <p class="text-slate-600">
        Completa este checklist antes de cada sesión de trading para asegurar que estés preparado mentalmente y técnicamente.
      </p>
    </div>

    <!-- Pre-Session Checklist -->
    <ChecklistCard
      title="📋 Checklist Pre-Sesión (5 minutos)"
      bgClass="bg-white"
      titleColorClass="text-slate-800"
      :sections="checklistSections"
      class="mb-6"
    />

    <!-- Anxiety Management Section -->
    <ChecklistCard
      title="⚠️ Gestión de Ansiedad y Disciplina"
      bgClass="bg-yellow-50"
      titleColorClass="text-yellow-900"
      :sections="anxietySections"
    />
  </div>
</template>

<script setup>
import ChecklistCard from '../components/trading/ChecklistCard.vue';

const checklistSections = [
  {
    id: 1,
    title: 'Antes de Abrir Gráficos',
    borderClass: 'border-blue-200',
    titleClass: 'text-blue-600',
    items: [
      { id: 1, text: 'Identifica tu sesión horaria disponible', isWarning: false },
      { id: 2, text: 'Revisa calendario económico (noticias high-impact)', isWarning: false },
      { id: 3, text: 'Confirma los 2 assets a vigilar', isWarning: false },
      { id: 4, text: 'Define tu RR mínimo del día (1:2.5+)', isWarning: false }
    ]
  }
];

const anxietySections = [
  {
    id: 1,
    title: 'Reglas de Disciplina',
    borderClass: 'border-yellow-300',
    titleClass: 'text-yellow-900',
    items: [
      { id: 1, text: 'Si después de 1 hora no hay setup válido: cierra la plataforma. El mercado estará ahí mañana', isWarning: true },
      { id: 2, text: 'Si encuentras setup pero RR < 1:2.5: recházalo y siéntete orgulloso de tu disciplina', isWarning: true },
      { id: 3, text: 'Máximo 2 trades por sesión. Si pierdes 2, cierra hasta la próxima sesión', isWarning: true },
      { id: 4, text: 'Recordatorio: Tu problema fue overtrading, NO falta de oportunidades. Menos es más', isWarning: true }
    ]
  }
];
</script>
