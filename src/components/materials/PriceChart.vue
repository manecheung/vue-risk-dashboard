<template>
  <div ref="chartContainerRef" class="w-full h-full"></div>
</template>

<script setup>
import { computed } from 'vue';
import { useChart } from '@/composables/useChart';
import { graphic } from 'echarts';

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({ labels: [], datasets: [] })
  }
});

const chartOption = computed(() => {
  if (!props.chartData || !props.chartData.labels || props.chartData.labels.length === 0) {
    return null;
  }

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'var(--border-color)',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: props.chartData.datasets.map(ds => ds.label),
      top: 10,
      textStyle: {
        color: '#94a3b8'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '18%', // Add some space for legend
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.chartData.labels,
      axisLabel: {
        color: '#94a3b8'
      }
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        color: '#94a3b8'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(14, 165, 233, 0.1)'
        }
      }
    },
    series: props.chartData.datasets.map(ds => ({
      name: ds.label,
      type: 'line',
      data: ds.data,
      smooth: true,
      itemStyle: {
        color: ds.borderColor
      },
      lineStyle: {
        width: 2,
        color: ds.borderColor
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: ds.backgroundColor.replace('33', '80') },
          { offset: 1, color: ds.backgroundColor.replace('33', '00') } 
        ])
      }
    }))
  };
});

const { chartContainerRef } = useChart(chartOption);

</script>
