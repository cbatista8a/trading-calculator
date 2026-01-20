<template>
  <div class="space-y-4">
    <!-- Agregar Step -->
    <div class="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
      <div class="space-y-3">
        <input
          v-model="newStepText"
          type="text"
          placeholder="Descripción del paso..."
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          @keyup.enter="addNewStep"
        />

        <!-- Tag Selector -->
        <div class="flex flex-wrap gap-2">
          <label v-for="tag in availableTags" :key="tag" class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              :value="tag"
              v-model="selectedTags"
              class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-semibold">{{ getTagBadge(tag) }}</span>
          </label>
        </div>

        <button
          @click="addNewStep"
          class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          + Agregar Paso
        </button>
      </div>
    </div>

    <!-- Lista de Steps -->
    <div v-if="steps.length > 0" class="space-y-2">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="bg-white border-l-4 border-indigo-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">
                {{ index + 1 }}
              </span>
              <p class="text-slate-800 font-medium flex-1">{{ step.text }}</p>
            </div>

            <!-- Tags del Step -->
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

          <div class="flex items-center gap-2">
            <button
              @click="editStep(step)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteStepItem(step.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-slate-400">
      <p class="text-sm">No hay pasos agregados aún. ¡Comienza agregando el primer paso!</p>
    </div>

    <!-- Modal de Edición -->
    <div v-if="editingStep" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Editar Paso</h3>

        <input
          v-model="editingStepText"
          type="text"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 mb-4"
        />

        <div class="flex flex-wrap gap-2 mb-4">
          <label v-for="tag in availableTags" :key="tag" class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              :value="tag"
              v-model="editingStepTags"
              class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-semibold">{{ getTagBadge(tag) }}</span>
          </label>
        </div>

        <div class="flex gap-3">
          <button
            @click="saveEditedStep"
            class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Guardar
          </button>
          <button
            @click="cancelEdit"
            class="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  steps: {
    type: Array,
    default: () => []
  },
  onAddStep: Function,
  onUpdateStep: Function,
  onDeleteStep: Function
});

const availableTags = ['Check', 'Trigger', 'SL', 'TP', 'In', 'Out', 'RR'];

const newStepText = ref('');
const selectedTags = ref([]);
const editingStep = ref(null);
const editingStepText = ref('');
const editingStepTags = ref([]);

const getTagBadge = (tag) => {
  const badges = {
    Check: '✓ Check',
    Trigger: '⚡ Trigger',
    SL: '🛑 SL',
    TP: '🎯 TP',
    In: '📥 In',
    Out: '📤 Out',
    RR: '📊 RR'
  };
  return badges[tag] || tag;
};

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

const addNewStep = () => {
  if (newStepText.value.trim()) {
    if (props.onAddStep) {
      props.onAddStep(newStepText.value, selectedTags.value);
    }
    newStepText.value = '';
    selectedTags.value = [];
  }
};

const editStep = (step) => {
  editingStep.value = step;
  editingStepText.value = step.text;
  editingStepTags.value = [...step.tags];
};

const saveEditedStep = () => {
  if (editingStepText.value.trim() && editingStep.value) {
    if (props.onUpdateStep) {
      props.onUpdateStep(editingStep.value.id, editingStepText.value, editingStepTags.value);
    }
    cancelEdit();
  }
};

const cancelEdit = () => {
  editingStep.value = null;
  editingStepText.value = '';
  editingStepTags.value = [];
};

const deleteStepItem = (stepId) => {
  if (props.onDeleteStep) {
    props.onDeleteStep(stepId);
  }
};
</script>
