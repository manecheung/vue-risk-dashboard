<template>
  <div class="w-full h-full overflow-auto p-2 custom-scrollbar">
    <div ref="chartContainerRef" class="chart-container"></div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useChart } from '@/composables/useChart';
import { graphic } from 'echarts';
const props = defineProps({ data: { type: Object, required: true } });
const chartWidth = computed(() => {
  if (!props.data || !props.data.categories) return '100%';
  const itemWidth = 50;
  const calculatedWidth = props.data.categories.length * itemWidth;
  return calculatedWidth > 400 ? `${calculatedWidth}px` : '100%';
});
const chartOption = computed(() => {
  if (!props.data || !props.data.categories || !props.data.values) return null;
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'var(--border-color)', textStyle: { color: '#fff' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: props.data.categories, axisLabel: { color: '#94a3b8', interval: 0, rotate: 45 } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(14, 165, 233, 0.1)' } } },
    series: [{ name: '健康指数', type: 'bar', data: props.data.values, barWidth: '60%', itemStyle: { color: new graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(14, 165, 233, 0.8)' }, { offset: 1, color: 'rgba(14, 165, 233, 0.2)' }]) } }]
  };
});
const { chartContainerRef } = useChart(chartOption);
</script>

<style scoped>
.chart-container {
  width: v-bind(chartWidth);
  height: 100%;
}
</style>