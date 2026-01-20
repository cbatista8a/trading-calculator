<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4" :class="borderColorClass">
    <div class="p-6">
      <!-- Header con nombre y acciones -->
      <div class="flex items-start justify-between gap-4 mb-3">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-slate-800 mb-1">{{ strategy.name }}</h3>
          <p class="text-sm text-slate-500">
            Actualizada {{ formatDate(strategy.updatedAt) }}
          </p>
        </div>

        <!-- Badge de predeterminada -->
        <div v-if="isDefault" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
          ⭐ Predeterminada
        </div>
      </div>

      <!-- Descripción -->
      <p class="text-slate-600 text-sm mb-4 line-clamp-2">{{ strategy.description }}</p>

      <!-- Info de pasos -->
      <div class="mb-4 p-3 bg-slate-50 rounded-lg">
        <p class="text-sm text-slate-700">
          <span class="font-semibold">{{ strategy.steps.length }}</span>
          {{ strategy.steps.length === 1 ? 'paso' : 'pasos' }}
        </p>

        <!-- Tags utilizados en la estrategia -->
        <div v-if="tagsUsed.length > 0" class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="tag in tagsUsed"
            :key="tag"
            class="inline-block px-2 py-1 text-xs font-semibold rounded"
            :class="getTagClasses(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex gap-2">
        <button
          @click="viewStrategy"
          class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          👁️ Ver
        </button>
        <button
          @click="editStrategy"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          ✎ Editar
        </button>
        <button
          v-if="!isDefault"
          @click="setAsDefault"
          class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          ⭐ Usar
        </button>
        <button
          v-else
          @click="removeDefault"
          class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          ✕ Desuso
        </button>
        <button
          @click="deleteStrategy"
          class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  strategy: {
    type: Object,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  onView: Function,
  onEdit: Function,
  onSetDefault: Function,
  onRemoveDefault: Function,
  onDelete: Function
});

const borderColorClass = computed(() => {
  const colors = ['border-blue-500', 'border-green-500', 'border-purple-500', 'border-indigo-500', 'border-pink-500'];
  const hash = props.strategy.id.charCodeAt(0) % colors.length;
  return colors[hash];
});

const tagsUsed = computed(() => {
  const allTags = new Set();
  props.strategy.steps.forEach(step => {
    step.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags).sort();
});

const getTagClasses = (tag) => {
  const classes = {
    Check: 'bg-green-100 text-green-800',
    Trigger: 'bg-yellow-100 text-yellow-800',
    SL: 'bg-red-100 text-red-800',
    TP: 'bg-blue-100 text-blue-800',
    In: 'bg-purple-100 text-purple-800',
    Out: 'bg-indigo-100 text-indigo-800',
    RR: 'bg-orange-100 text-orange-800'
  };
  return classes[tag] || 'bg-slate-100 text-slate-800';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'hace poco';
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays === 1) return 'hace 1 día';
  if (diffDays < 30) return `hace ${diffDays}d`;

  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
};

const viewStrategy = () => {
  if (props.onView) props.onView();
};

const editStrategy = () => {
  if (props.onEdit) props.onEdit();
};

const setAsDefault = () => {
  if (props.onSetDefault) props.onSetDefault();
};

const removeDefault = () => {
  if (props.onRemoveDefault) props.onRemoveDefault();
};

const deleteStrategy = () => {
  if (confirm(`¿Estás seguro de que quieres eliminar la estrategia "${props.strategy.name}"?`)) {
    if (props.onDelete) props.onDelete();
  }
};
</script>
