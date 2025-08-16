<template>
  <div class="flex flex-col h-full">
    <h2 class="panel-title flex-shrink-0">节点详情</h2>
    
    <div v-if="isLoading" class="flex items-center justify-center flex-grow">
      <p class="text-slate-400">正在加载详情...</p>
    </div>

    <div v-else-if="details" class="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-grow">
      <div>
        <h3 class="font-bold text-lg text-cyan-400">{{ details.Name }}</h3>
        <p class="text-sm text-slate-500">公司ID: {{ details.ID }}</p>
      </div>

      <div class="space-y-3">
        <div class="detail-card">
          <p class="card-title">风险状态</p>
          <p class="text-xl font-bold" :class="stateColor">{{ stateText }}</p>
        </div>
        <div class="detail-card">
          <p class="card-title">KRI评分</p>
          <p class="text-lg font-semibold text-slate-200">{{ (Number(details.KRIs?.KRIScore) || 0).toFixed(4) }}</p>
        </div>
        <div class="detail-card">
          <p class="card-title">内部因素</p>
          <p class="text-lg font-semibold text-slate-200">{{ (Number(details.InnerFactor) || 0).toFixed(4) }}</p>
        </div>
      </div>

      <!-- Products List -->
      <div v-if="details.Products && details.Products.length > 0">
        <h4 class="font-semibold text-slate-300 mt-4 mb-2">产品列表</h4>
        <ul class="space-y-2 text-sm">
          <li v-for="product in details.Products" :key="product.Name" class="list-item">
            <p class="font-medium text-slate-300">{{ product.Name }}</p>
            <p class="text-slate-400">权重: {{ (Number(product.W) || 0).toFixed(2) }}</p>
          </li>
        </ul>
      </div>

      <!-- Materials List -->
      <div v-if="details.Materials && details.Materials.length > 0">
        <h4 class="font-semibold text-slate-300 mt-4 mb-2">原材料</h4>
        <ul class="space-y-2 text-sm">
          <li v-for="material in details.Materials" :key="material.Name" class="list-item">
            <p class="font-medium text-slate-300">{{ material.Name }}</p>
            <p class="text-slate-400">权重: {{ (Number(material.W) || 0).toFixed(4) }}</p>
          </li>
        </ul>
      </div>

    </div>
    
    <div v-else class="flex items-center justify-center flex-grow text-center text-slate-500 px-4">
      <p>点击网络图中的节点查看详细信息。</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSimulationStore } from '@/stores/simulationStore';

const store = useSimulationStore();
const details = computed(() => store.selectedNodeDetails);
const isLoading = computed(() => store.isLoadingDetails);

const stateText = computed(() => {
  if (!details.value) return '';
  switch (details.value.State) {
    case 1: return '正常';
    case 2: return '预警';
    case 3: return '高危';
    default: return '未知';
  }
});

const stateColor = computed(() => {
  if (!details.value) return 'text-slate-400';
  switch (details.value.State) {
    case 1: return 'text-green-400';
    case 2: return 'text-amber-400';
    case 3: return 'text-red-400';
    default: return 'text-slate-400';
  }
});
</script>

<style scoped>
.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #1e293b; /* slate-800 */
  color: #e2e8f0; /* slate-200 */
}

.detail-card {
  padding: 0.75rem;
  background-color: #1e293b; /* slate-800 */
  border-radius: 0.375rem;
  border: 1px solid #334155; /* slate-700 */
}

.card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8; /* slate-400 */
}

.list-item {
  padding: 0.5rem 0.75rem;
  background-color: #1e293b; /* slate-800 */
  border-radius: 0.375rem;
  border-left: 2px solid #38bdf8; /* cyan-400 */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0f172a;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
