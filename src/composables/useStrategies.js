import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'trading_strategies';

export const useStrategies = () => {
  const strategies = ref([]);
  const defaultStrategyId = ref(null);

  // Cargar estrategias del localStorage
  const loadStrategies = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        strategies.value = data.strategies || [];
        defaultStrategyId.value = data.defaultStrategyId || null;
      }
    } catch (error) {
      console.error('Error loading strategies:', error);
    }
  };

  // Guardar estrategias en localStorage
  const saveStrategies = () => {
    try {
      const data = {
        strategies: strategies.value,
        defaultStrategyId: defaultStrategyId.value,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving strategies:', error);
    }
  };

  // Crear nueva estrategia
  const createStrategy = (name, description) => {
    const newStrategy = {
      id: Date.now().toString(),
      name,
      description,
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    strategies.value.push(newStrategy);
    saveStrategies();
    return newStrategy;
  };

  // Actualizar estrategia
  const updateStrategy = (id, name, description) => {
    const strategy = strategies.value.find(s => s.id === id);
    if (strategy) {
      strategy.name = name;
      strategy.description = description;
      strategy.updatedAt = new Date().toISOString();
      saveStrategies();
    }
  };

  // Eliminar estrategia
  const deleteStrategy = (id) => {
    const index = strategies.value.findIndex(s => s.id === id);
    if (index > -1) {
      strategies.value.splice(index, 1);
      // Si era la predeterminada, limpiar
      if (defaultStrategyId.value === id) {
        defaultStrategyId.value = null;
      }
      saveStrategies();
    }
  };

  // Obtener estrategia por ID
  const getStrategy = (id) => {
    return strategies.value.find(s => s.id === id);
  };

  // Obtener estrategia predeterminada
  const getDefaultStrategy = computed(() => {
    if (!defaultStrategyId.value) return null;
    return getStrategy(defaultStrategyId.value);
  });

  // Establecer estrategia predeterminada
  const setDefaultStrategy = (id) => {
    if (id === null || strategies.value.find(s => s.id === id)) {
      defaultStrategyId.value = id;
      saveStrategies();
    }
  };

  // Agregar step a estrategia
  const addStep = (strategyId, stepText, tags = []) => {
    const strategy = getStrategy(strategyId);
    if (strategy) {
      const newStep = {
        id: Date.now().toString(),
        text: stepText,
        tags: tags,
        createdAt: new Date().toISOString()
      };
      strategy.steps.push(newStep);
      strategy.updatedAt = new Date().toISOString();
      saveStrategies();
      return newStep;
    }
  };

  // Actualizar step
  const updateStep = (strategyId, stepId, stepText, tags) => {
    const strategy = getStrategy(strategyId);
    if (strategy) {
      const step = strategy.steps.find(s => s.id === stepId);
      if (step) {
        step.text = stepText;
        step.tags = tags;
        strategy.updatedAt = new Date().toISOString();
        saveStrategies();
      }
    }
  };

  // Eliminar step
  const deleteStep = (strategyId, stepId) => {
    const strategy = getStrategy(strategyId);
    if (strategy) {
      const index = strategy.steps.findIndex(s => s.id === stepId);
      if (index > -1) {
        strategy.steps.splice(index, 1);
        strategy.updatedAt = new Date().toISOString();
        saveStrategies();
      }
    }
  };

  // Watch para guardar automáticamente
  watch(strategies, () => {
    saveStrategies();
  }, { deep: true });

  // Cargar al inicializar
  loadStrategies();

  return {
    strategies,
    defaultStrategyId,
    getStrategy,
    getDefaultStrategy,
    setDefaultStrategy,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    addStep,
    updateStep,
    deleteStep,
    loadStrategies,
    saveStrategies
  };
};
