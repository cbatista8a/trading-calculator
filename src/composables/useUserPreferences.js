import { ref, watch } from 'vue';

const DEFAULT_TIMEZONE = 'cet';
const STORAGE_KEY = 'trading_calculator_prefs';

export const useUserPreferences = () => {
  const selectedTimezone = ref(DEFAULT_TIMEZONE);

  // Cargar preferencias del localStorage
  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const prefs = JSON.parse(stored);
        if (prefs.timezone) {
          selectedTimezone.value = prefs.timezone;
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  // Guardar preferencias en localStorage
  const savePreferences = () => {
    try {
      const prefs = {
        timezone: selectedTimezone.value,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Watch para guardar automáticamente cuando cambia la zona horaria
  watch(selectedTimezone, () => {
    savePreferences();
  });

  // Cargar al inicializar
  loadPreferences();

  return {
    selectedTimezone,
    savePreferences,
    loadPreferences
  };
};
