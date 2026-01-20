<template>
  <div class="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H11a2 2 0 01-2-2V5zm0 0a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2H9z"/>
        </svg>
        <h1 class="text-3xl font-bold text-slate-800">Estrategias de Trading 📈</h1>
      </div>
      <p class="text-slate-600">
        Gestiona tus estrategias de trading, define los pasos y selecciona una como predeterminada para tus sesiones.
      </p>
    </div>

    <!-- Estrategia predeterminada activa -->
    <div v-if="defaultStrategy" class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-6 mb-6">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-semibold text-green-700 mb-1">⭐ ESTRATEGIA PREDETERMINADA ACTIVA</p>
          <h3 class="text-xl font-bold text-green-900">{{ defaultStrategy.name }}</h3>
          <p class="text-green-800 mt-2">{{ defaultStrategy.description }}</p>
          <p class="text-sm text-green-700 mt-2">{{ defaultStrategy.steps.length }} pasos definidos</p>
        </div>
        <button
          @click="viewStrategy(defaultStrategy)"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          Ver Detalles
        </button>
      </div>
    </div>

    <!-- Formulario de Nueva/Edición Estrategia -->
    <StrategyForm
      v-if="showForm"
      :strategy="editingStrategy"
      :onSave="handleSaveStrategy"
      :onCancel="handleCancelForm"
    />

    <!-- Botón para nueva estrategia (si no hay formulario abierto) -->
    <button
      v-if="!showForm"
      @click="newStrategy"
      class="w-full mb-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
    >
      + Crear Nueva Estrategia
    </button>

    <!-- Lista de estrategias -->
    <div v-if="strategies.length > 0" class="space-y-4">
      <h2 class="text-lg font-bold text-slate-800">Mis Estrategias ({{ strategies.length }})</h2>

      <!-- Filtros -->
      <div class="flex gap-2 mb-4">
        <button
          @click="filterView = 'all'"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-colors',
            filterView === 'all'
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
          ]"
        >
          Todas
        </button>
        <button
          @click="filterView = 'active'"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-colors',
            filterView === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
          ]"
        >
          Activa
        </button>
        <button
          @click="filterView = 'inactive'"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-colors',
            filterView === 'inactive'
              ? 'bg-slate-600 text-white'
              : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
          ]"
        >
          Inactivas
        </button>
      </div>

      <!-- Grid de Estrategias -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StrategyCard
          v-for="strategy in filteredStrategies"
          :key="strategy.id"
          :strategy="strategy"
          :isDefault="strategy.id === defaultStrategyId"
          :onView="() => viewStrategy(strategy)"
          :onEdit="() => editStrategy(strategy)"
          :onSetDefault="() => setDefaultStrategy(strategy.id)"
          :onRemoveDefault="() => removeDefaultStrategy()"
          :onDelete="() => deleteStrategyHandler(strategy.id)"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!showForm" class="text-center py-16 bg-white rounded-lg shadow">
      <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-semibold text-slate-600 mb-2">Sin estrategias aún</h3>
      <p class="text-slate-500 mb-6">Crea tu primera estrategia para comenzar</p>
      <button
        @click="newStrategy"
        class="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Crear Estrategia
      </button>
    </div>

    <!-- Modal de Visualización -->
    <div
      v-if="viewingStrategy"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="viewingStrategy = null"
    >
      <div class="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8">
        <div class="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6">
          <h3 class="text-2xl font-bold">{{ viewingStrategy.name }}</h3>
          <button
            @click="viewingStrategy = null"
            class="p-2 hover:bg-indigo-400 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <p class="text-slate-600 mb-6">{{ viewingStrategy.description }}</p>

          <h4 class="text-lg font-bold text-slate-800 mb-4">Pasos de Ejecución:</h4>

          <div class="space-y-3">
            <div
              v-for="(step, index) in viewingStrategy.steps"
              :key="step.id"
              class="bg-slate-50 border-l-4 border-indigo-500 rounded p-4"
            >
              <div class="flex items-start gap-3 mb-2">
                <span class="inline-flex items-center justify-center w-6 h-6 bg-indigo-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                  {{ index + 1 }}
                </span>
                <p class="text-slate-800 font-medium flex-1">{{ step.text }}</p>
              </div>

              <div v-if="step.tags.length > 0" class="flex flex-wrap gap-2 ml-9">
                <span
                  v-for="tag in step.tags"
                  :key="tag"
                  :class="getTagClasses(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="viewingStrategy.steps.length === 0" class="text-center py-8 text-slate-400">
            <p>Esta estrategia no tiene pasos definidos aún.</p>
          </div>
        </div>

        <div class="bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
          <button
            @click="editStrategy(viewingStrategy)"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Editar
          </button>
          <button
            @click="viewingStrategy = null"
            class="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStrategies } from '../composables/useStrategies';
import StrategyForm from '../components/trading/StrategyForm.vue';
import StrategyCard from '../components/trading/StrategyCard.vue';

const {
  strategies,
  defaultStrategyId,
  getStrategy,
  getDefaultStrategy,
  setDefaultStrategy: setDefaultStrategyComposable,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  addStep,
  updateStep,
  deleteStep
} = useStrategies();

const showForm = ref(false);
const editingStrategy = ref(null);
const viewingStrategy = ref(null);
const filterView = ref('all');

const defaultStrategy = computed(() => getDefaultStrategy.value);

const filteredStrategies = computed(() => {
  if (filterView.value === 'active') {
    return strategies.value.filter(s => s.id === defaultStrategyId.value);
  } else if (filterView.value === 'inactive') {
    return strategies.value.filter(s => s.id !== defaultStrategyId.value);
  }
  return strategies.value;
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
  return `inline-block px-3 py-1 rounded-full text-xs font-semibold ${classes[tag] || 'bg-slate-100 text-slate-800'}`;
};

const newStrategy = () => {
  showForm.value = true;
  editingStrategy.value = null;
  viewingStrategy.value = null;
};

const handleSaveStrategy = (formData) => {
  if (editingStrategy.value) {
    // Actualizar estrategia existente
    updateStrategy(editingStrategy.value.id, formData.name, formData.description);

    // Actualizar steps
    const strategy = getStrategy(editingStrategy.value.id);
    if (strategy) {
      strategy.steps = formData.steps;
    }
  } else {
    // Crear nueva estrategia
    const newStrat = createStrategy(formData.name, formData.description);

    // Agregar steps
    formData.steps.forEach(step => {
      addStep(newStrat.id, step.text, step.tags);
    });
  }

  showForm.value = false;
  editingStrategy.value = null;
};

const handleCancelForm = () => {
  showForm.value = false;
  editingStrategy.value = null;
};

const editStrategy = (strategy) => {
  editingStrategy.value = strategy;
  showForm.value = true;
  viewingStrategy.value = null;
};

const viewStrategy = (strategy) => {
  viewingStrategy.value = strategy;
};

const setDefaultStrategy = (id) => {
  setDefaultStrategyComposable(id);
};

const removeDefaultStrategy = () => {
  setDefaultStrategyComposable(null);
};

const deleteStrategyHandler = (id) => {
  deleteStrategy(id);
};
</script>
