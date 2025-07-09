<template>
  <div ref="containerRef" class="w-full h-full"></div>
</template>

<script setup>
import { toRefs, watch } from 'vue';
import { useG6 } from '@/composables/useG6';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    required: true
  },
  resetSignal: {
    type: Number,
    required: true
  }
});

// 重点: 确保 defineEmits 中包含了 'search-cleared'
const emit = defineEmits(['search-results', 'search-cleared', 'graph-mounted']);

const { data, options, resetSignal } = toRefs(props);
const { containerRef, resetView, legendData } = useG6(data, options, emit);

watch(resetSignal, () => {
  if (resetView) {
    resetView();
  }
});

// 使用 defineExpose 将 useG6 返回的 legendData 暴露给父组件
defineExpose({
  legendData
});
</script>