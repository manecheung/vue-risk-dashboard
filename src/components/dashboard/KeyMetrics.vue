<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
    <div v-for="(metric, index) in metrics" :key="metric.title" class="panel !flex-row items-center p-4 space-x-4">
      <div class="p-3 bg-sky-500/10 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-400"
          aria-hidden="true">
          <path :d="metric.icon"></path>
        </svg>
      </div>
      <div>
        <p class="text-sm text-slate-400">{{ metric.title }}</p>
        <p class="text-2xl font-bold" :ref="el => metricRefs[index] = el"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUpdate, nextTick } from 'vue';
import { CountUp } from 'countup.js';

const props = defineProps({
  metrics: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(metric =>
        typeof metric === 'object' &&
        metric !== null &&
        'title' in metric &&
        'value' in metric &&
        'icon' in metric &&
        typeof metric.title === 'string' &&
        typeof metric.value === 'number' &&
        typeof metric.icon === 'string'
      );
    }
  }
});

let metricRefs = ref([]);

onBeforeUpdate(() => {
  metricRefs.value = [];
});

watch(() => props.metrics, (newMetrics) => {
  if (newMetrics && newMetrics.length > 0) {
    nextTick(() => {
      newMetrics.forEach((metric, index) => {
        const targetElement = metricRefs.value[index];
        if (targetElement) {
          const countUpInstance = new CountUp(targetElement, metric.value, {
            duration: 2,
            separator: ',',
            useEasing: true
          });
          if (!countUpInstance.error) {
            countUpInstance.start();
          } else {
            console.error(countUpInstance.error);
          }
        }
      });
    });
  }
}, {
  immediate: true,
  deep: true
});
</script>