<template>
  <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">
        {{ isEditMode ? '✎ Editar Estrategia' : '+ Nueva Estrategia' }}
      </h2>
      <button
        v-if="isEditMode"
        @click="cancel"
        class="text-slate-500 hover:text-slate-700"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Nombre y Descripción -->
    <div class="space-y-4 mb-6">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Nombre de la Estrategia</label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="ej: Scalping en EUR/USD"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Descripción</label>
        <textarea
          v-model="formData.description"
          placeholder="Describe brevemente esta estrategia..."
          rows="3"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
        ></textarea>
      </div>
    </div>

    <!-- Pasos de la Estrategia -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-4">
        <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-lg font-bold text-slate-800">Pasos de Ejecución</h3>
      </div>

      <StepsList
        :steps="formData.steps"
        :onAddStep="addStep"
        :onUpdateStep="updateStep"
        :onDeleteStep="deleteStep"
      />
    </div>

    <!-- Botones de Acción -->
    <div class="flex gap-3 pt-6 border-t border-slate-200">
      <button
        @click="saveStrategy"
        :disabled="!isFormValid"
        :class="[
          'flex-1 font-semibold py-3 px-4 rounded-lg transition-colors',
          isFormValid
            ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
            : 'bg-slate-300 text-slate-600 cursor-not-allowed'
        ]"
      >
        {{ isEditMode ? '💾 Actualizar Estrategia' : '✚ Crear Estrategia' }}
      </button>
      <button
        v-if="isEditMode"
        @click="cancel"
        class="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import StepsList from './StepsList.vue';

const props = defineProps({
  strategy: {
    type: Object,
    default: null
  },
  onSave: Function,
  onCancel: Function
});

const isEditMode = computed(() => !!props.strategy);

const formData = ref({
  name: '',
  description: '',
  steps: []
});

// Inicializar con datos de estrategia existente si está en modo edición
if (isEditMode.value && props.strategy) {
  formData.value = {
    name: props.strategy.name,
    description: props.strategy.description,
    steps: JSON.parse(JSON.stringify(props.strategy.steps))
  };
}

const isFormValid = computed(() => {
  return formData.value.name.trim().length > 0 &&
         formData.value.description.trim().length > 0;
});

const addStep = (stepText, tags) => {
  const newStep = {
    id: Date.now().toString(),
    text: stepText,
    tags: tags,
    createdAt: new Date().toISOString()
  };
  formData.value.steps.push(newStep);
};

const updateStep = (stepId, stepText, tags) => {
  const step = formData.value.steps.find(s => s.id === stepId);
  if (step) {
    step.text = stepText;
    step.tags = tags;
  }
};

const deleteStep = (stepId) => {
  const index = formData.value.steps.findIndex(s => s.id === stepId);
  if (index > -1) {
    formData.value.steps.splice(index, 1);
  }
};

const saveStrategy = () => {
  if (isFormValid.value && props.onSave) {
    props.onSave({
      name: formData.value.name,
      description: formData.value.description,
      steps: formData.value.steps
    });
  }
};

const cancel = () => {
  if (props.onCancel) {
    props.onCancel();
  }
};
</script>
