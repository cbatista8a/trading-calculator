<template>
  <div :class="['rounded-lg shadow-lg p-6', bgClass]">
    <h2 :class="['text-2xl font-bold mb-4', titleColorClass]">{{ title }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="section in sections"
        :key="section.id"
        :class="['border-2 rounded-lg p-4', section.borderClass]"
      >
        <h3 :class="['font-bold mb-3', section.titleClass]">{{ section.title }}</h3>
        <div class="space-y-2 text-sm">
          <ChecklistItem
            v-for="item in section.items"
            :key="item.id"
            :text="item.text"
            :isWarning="item.isWarning"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChecklistItem from './ChecklistItem.vue';

defineProps({
  title: {
    type: String,
    default: '📋 Checklist'
  },
  bgClass: {
    type: String,
    default: 'bg-white'
  },
  titleColorClass: {
    type: String,
    default: 'text-slate-800'
  },
  sections: {
    type: Array,
    required: true,
    validator: (sections) => {
      return sections.every(section =>
        section.title &&
        section.items &&
        Array.isArray(section.items) &&
        section.items.every(item => item.text)
      );
    }
  }
});
</script>
