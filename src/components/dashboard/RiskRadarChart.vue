<template>
  <div ref="chartContainerRef" class="w-full h-full"></div>
</template>
<script setup>
import { computed } from 'vue';
import { useChart } from '@/composables/useChart';
const props = defineProps({ data: { type: Object, required: true } });
const chartOption = computed(() => {
  if (!props.data || !props.data.indicator || !props.data.data) return null;
  return {
    tooltip: { trigger: 'item', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'var(--border-color)', textStyle: { color: '#fff' } },
    legend: { data: props.data.data.map(d => d.name), bottom: '2%', textStyle: { color: '#94a3b8', fontSize: 12 }, icon: 'circle', itemWidth: 8 },
    radar: {
      indicator: props.data.indicator,
      center: ['50%', '45%'],
      radius: '65%',
      axisName: { color: '#e2e8f0' },
      splitArea: { areaStyle: { color: ['rgba(14, 165, 233, 0.05)', 'rgba(14, 165, 233, 0.1)'] } },
      splitLine: { lineStyle: { color: 'rgba(14, 165, 233, 0.2)' } }
    },
    series: [{ type: 'radar', data: props.data.data }],
    color: ['#0ea5e9', '#4ade80', '#fbbf24']
  };
});
const { chartContainerRef } = useChart(chartOption);
</script>