<template>
  <div class="flex items-start gap-2">
    <span :class="isWarning ? 'text-red-600 font-bold' : 'text-green-600 font-bold'">
      {{ isWarning ? '✗' : '✓' }}
    </span>
    <span>{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  isWarning: {
    type: Boolean,
    default: false
  }
});
</script>
