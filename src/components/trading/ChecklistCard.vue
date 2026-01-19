<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-slate-800 mb-4">📋 Checklist Pre-Sesión (5 minutos)</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="border-2 border-blue-200 rounded-lg p-4">
        <h3 class="font-bold text-blue-600 mb-3">Antes de Abrir Gráficos</h3>
        <div class="space-y-2 text-sm">
          <ChecklistItem text="Identifica tu sesión horaria disponible" />
          <ChecklistItem text="Revisa calendario económico (noticias high-impact)" />
          <ChecklistItem text="Confirma los 2 assets a vigilar" />
          <ChecklistItem text="Define tu RR mínimo del día (1:2.5+)" />
        </div>
      </div>

      <div class="border-2 border-green-200 rounded-lg p-4">
        <h3 class="font-bold text-green-600 mb-3">Al Abrir Gráficos</h3>
        <div class="space-y-2 text-sm">
          <ChecklistItem text="D1: Marca zonas Supply/Demand" />
          <ChecklistItem text="H4: Confirma estructura y tendencia" />
          <ChecklistItem text="H1: Busca confirmación de reversión" />
          <ChecklistItem text="NO abrir otros assets por si acaso" :isWarning="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChecklistItem from './ChecklistItem.vue';
</script>
