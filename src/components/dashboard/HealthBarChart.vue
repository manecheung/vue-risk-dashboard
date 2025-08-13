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

// 1. 创建一个计算属性来过滤数据
const filteredData = computed(() => {
  if (!props.data || !props.data.categories || !props.data.values) {
    return { categories: [], values: [] };
  }

  const categories = [];
  const values = [];
  
  props.data.categories.forEach((cat, index) => {
    // 过滤掉 '#N/A' 数据
    if (cat !== '#N/A') {
      categories.push(cat);
      values.push(props.data.values[index]);
    }
  });

  return { categories, values };
});

const chartWidth = computed(() => {
  if (!filteredData.value.categories) return '100%';
  const itemWidth = 50;
  const calculatedWidth = filteredData.value.categories.length * itemWidth;
  return calculatedWidth > 400 ? `${calculatedWidth}px` : '100%';
});

const chartOption = computed(() => {
  // 2. 使用过滤后的数据
  if (filteredData.value.categories.length === 0) return null;
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'var(--border-color)', textStyle: { color: '#fff' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: filteredData.value.categories, 
      axisLabel: { 
        color: '#94a3b8', 
        interval: 0, 
        rotate: 45,
        // 新增：格式化函数，用于截断长文本
        formatter: function (value) {
          if (value && value.length > 6) {
            return value.substring(0, 6) + '...';
          }
          return value;
        }
      } 
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(14, 165, 233, 0.1)' } } },
    series: [{ name: '健康指数', type: 'bar', data: filteredData.value.values, barWidth: '60%', itemStyle: { color: new graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(14, 165, 233, 0.8)' }, { offset: 1, color: 'rgba(14, 165, 233, 0.2)' }]) } }]
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