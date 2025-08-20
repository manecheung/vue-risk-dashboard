<template>
  <div class="h-screen w-full flex flex-col bg-slate-900 text-slate-300 p-4 lg:p-6 gap-4 lg:gap-6">
    <main class="flex-grow flex overflow-hidden gap-4 lg:gap-6">
      <!-- Left Panel: Controls -->
      <div class="w-1/5 panel">
        <ControlPanel />
      </div>

      <!-- Center Panel: Graph -->
      <div class="w-3/5 panel">
        <GraphCanvas />
      </div>

      <!-- Right Panel: Details -->
      <div class="w-1/5 panel">
        <DetailsPanel />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import ControlPanel from '@/components/simulation/ControlPanel.vue';
import GraphCanvas from '@/components/simulation/GraphCanvas.vue';
import DetailsPanel from '@/components/simulation/DetailsPanel.vue';
import { useSimulationStore } from '@/stores/simulationStore';


const store = useSimulationStore();

// Fetch initial data when the component is mounted
onMounted(async () => {
  await store.fetchSimulations();
  // 如果之前有选择的模拟场景，重新加载其数据
  if (store.selectedSimulationId) {
    await store.selectSimulation(store.selectedSimulationId);
  }
});
</script>

<style scoped>
.panel {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100% - 1rem); /* 减去底部间距 */
  margin-bottom: 1rem; /* 添加底部间距 */
}

/* 大屏幕设备使用更大的间距 */
@media (min-width: 1024px) {
  .panel {
    height: calc(100% - 4rem);
    margin-bottom: 4rem;
  }
}
</style>

<script>
// Explicitly naming the component for <keep-alive>
export default {
  name: 'ChainRiskPage'
}
</script>