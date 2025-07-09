<template>
  <div ref="chartContainerRef" class="w-full h-full"></div>
</template>
<script setup>
import { computed } from 'vue';
import { useChart } from '@/composables/useChart';
const props = defineProps({ data: { type: Array, required: true } });
const chartOption = computed(() => {
  if (!props.data || props.data.length === 0) return null;
  return {
    tooltip: { trigger: 'item', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'var(--border-color)', textStyle: { color: '#fff' } },
    legend: { bottom: '2%', left: 'center', textStyle: { color: '#94a3b8', fontSize: 12 }, itemGap: 10, icon: 'circle', itemWidth: 8 },
    series: [{ name: '风险分布', type: 'pie', radius: ['30%', '75%'], center: ['50%', '45%'], roseType: 'area', data: props.data, label: { show: false } }],
    color: ['#f87171', '#fbbf24', '#4ade80']
  };
});
const { chartContainerRef } = useChart(chartOption);
</script>