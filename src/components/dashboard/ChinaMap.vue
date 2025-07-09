<template>
  <div v-if="mapError" class="w-full h-full flex items-center justify-center text-slate-500 p-4 text-center">
    {{ mapError }}
  </div>
  <div v-else ref="chartContainerRef" class="w-full h-full"></div>
</template>

<script setup>
import { computed } from 'vue';
import { useChart } from '@/composables/useChart';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const chartOption = computed(() => {
  if (!props.data || props.data.length === 0) return null;

  const riskColorMap = { '高': '#f87171', '中': '#fbbf24', '低': '#4ade80' };
  const seriesData = props.data.map(item => ({ 
    name: item.name, 
    value: item.value,
    risk: item.risk // Pass the risk level through
  }));

  return {
    tooltip: { 
      trigger: 'item', 
      formatter: params => params.data ? `${params.data.name}<br/>风险等级: ${params.data.risk}` : params.name, 
      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
      borderColor: 'var(--border-color)', 
      textStyle: { color: '#fff' } 
    },
    geo: { map: 'china', roam: true, zoom: 1.2, itemStyle: { areaColor: 'rgba(30, 64, 175, 0.3)', borderColor: 'rgba(14, 165, 233, 0.6)', borderWidth: 1 }, emphasis: { disabled: true } },
    series: [{
      name: '企业分布', type: 'effectScatter', coordinateSystem: 'geo', data: seriesData, symbolSize: val => val[2] / 6, encode: { value: 2 },
      showEffectOn: 'render',
      rippleEffect: { brushType: 'stroke', scale: 4, color: params => riskColorMap[params.data.risk] },
      itemStyle: { color: params => riskColorMap[params.data.risk] },
      label: { formatter: '{b}', position: 'right', show: false }, emphasis: { scale: true }
    }]
  };
});

const { chartContainerRef, mapError } = useChart(chartOption, true);
</script>