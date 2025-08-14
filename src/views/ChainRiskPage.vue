<template>
  <main class="flex flex-col p-6" style="height: calc(100vh - 4rem);">
    <header class="flex-shrink-0 mb-4 text-sm text-slate-400" aria-label="面包屑导航">产业链风险预警 / 风险蔓延模拟</header>

    <div class="flex-grow grid grid-cols-12 gap-6 min-h-0">
      <!-- Left Panel: Simulation List -->
      <div class="col-span-12 lg:col-span-4 panel flex flex-col min-h-0">
        <h2 class="text-lg font-bold p-4 border-b border-slate-700 flex-shrink-0">操作面板</h2>

        <div class="p-4 flex-shrink-0 border-b border-slate-700 space-y-3">
          <button @click="openLiveRunModal" class="btn btn-primary w-full text-sm">实时风险蔓延</button>
          <button @click="isCreateModalOpen = true" class="btn btn-secondary w-full text-sm">创建新模拟</button>
        </div>

        <div class="p-4 flex-shrink-0 border-b border-slate-700">
          <input type="search" v-model="keyword" @keyup.enter="store.fetchSimulations(1, keyword)"
            placeholder="搜索已存模拟..." class="form-input w-full text-sm" />
        </div>

        <div class="flex-grow overflow-y-auto p-2">
          <div v-if="store.isLoading && store.simulations.length === 0" class="text-center p-8 text-slate-500">加载中...
          </div>
          <div v-else-if="store.error" class="text-center p-8 text-red-400">加载出错: {{ store.error }}</div>
          <ul v-else-if="store.simulations.length > 0" class="space-y-2">
            <li v-for="sim in store.simulations" :key="sim.id"
              class="p-3 rounded-lg transition-colors hover:bg-slate-800/50">
              <div class="font-semibold text-slate-200">{{ sim.name }}</div>
              <div class="text-xs text-slate-400 mt-1 truncate">{{ sim.description }}</div>
              <div class="text-xs text-slate-500 mt-2">创建者: {{ sim.creator }} | {{ new
                Date(sim.createTime).toLocaleString() }}</div>
              <div class="mt-3 flex items-center gap-2">
                <button @click="store.loadSimulationGraph(sim)"
                  class="btn btn-secondary text-xs flex-grow">加载预览</button>
                <button @click="openRunModal(sim)" class="btn btn-primary text-xs flex-grow">执行模拟</button>
                <button @click="openDeleteModal(sim)" class="btn btn-danger text-xs" title="删除">&times;</button>
              </div>
            </li>
          </ul>
          <div v-else class="text-center p-8 text-slate-500">无已存模拟</div>
        </div>
      </div>

      <!-- Right Panel: Graph Visualization -->
      <div class="col-span-12 lg:col-span-8 panel flex flex-col min-h-0 relative">
        <div v-if="store.isGraphLoading" class="absolute inset-0 bg-slate-800/50 flex items-center justify-center z-10">
          <p class="text-lg text-sky-400 animate-pulse">正在执行模拟...</p>
        </div>
        <h2 class="text-lg font-bold p-4 border-b border-slate-700 flex-shrink-0">
          图谱预览: <span class="text-sky-400">{{ store.currentGraph ? store.currentGraph.simulationName : '未加载' }}</span>
        </h2>

        <div ref="containerRef" class="flex-grow min-h-0 p-1 relative">
          <div v-if="!store.currentGraph" class="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <p class="text-slate-500">请从左侧列表加载一个模拟场景进行预览或执行</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ConfirmModal :is-open="isDeleteModalOpen" title="确认删除" @confirm="handleDelete" @cancel="isDeleteModalOpen = false">
      <p>您确定要删除模拟场景 “<strong class="text-amber-400">{{ simulationToProcess?.name }}</strong>” 吗？此操作无法撤销。</p>
    </ConfirmModal>

    <ChainRiskRunModal :is-open="isRunModalOpen" :nodes="nodesForRunModal" @run="handleRun"
      @close="isRunModalOpen = false" />

    <!-- A simple modal for creating a new simulation -->
    <div v-if="isCreateModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="panel w-full max-w-lg">
        <h3 class="p-4 border-b border-slate-700 font-bold">创建新模拟</h3>
        <div class="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label class="text-sm">名称</label>
            <input v-model="newSim.name" class="form-input w-full text-sm mt-1" />
          </div>
          <div>
            <label class="text-sm">描述</label>
            <textarea v-model="newSim.description" class="form-input w-full text-sm mt-1"></textarea>
          </div>
          <div>
            <label class="text-sm">节点 (JSON)</label>
            <textarea v-model="newSim.nodes" rows="5" class="form-input w-full text-xs font-mono mt-1"></textarea>
          </div>
          <div>
            <label class="text-sm">边 (JSON)</label>
            <textarea v-model="newSim.edges" rows="5" class="form-input w-full text-xs font-mono mt-1"></textarea>
          </div>
          <div>
            <label class="text-sm">风险路径 (JSON, 可选)</label>
            <textarea v-model="newSim.riskPath" rows="5" class="form-input w-full text-xs font-mono mt-1"></textarea>
          </div>
        </div>
        <div class="p-4 border-t border-slate-700 flex justify-end gap-4">
          <button @click="isCreateModalOpen = false" class="btn btn-secondary">取消</button>
          <button @click="handleCreate" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useChainRiskStore } from '@/stores/chainRiskStore';
import { useChainRiskGraph } from '@/composables/useChainRiskGraph';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import ChainRiskRunModal from '@/components/chain-risk/ChainRiskRunModal.vue';

const store = useChainRiskStore();
const keyword = ref('');
const isLiveMode = ref(false);

// --- Graph Visualization ---
const { containerRef } = useChainRiskGraph(computed(() => store.currentGraph));

// --- Modal States & Logic ---
const isDeleteModalOpen = ref(false);
const isRunModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const simulationToProcess = ref(null);

const newSim = ref({
  name: '新模拟',
  description: '这是一个描述',
  nodes: JSON.stringify([{ id: 's', label: 'Source' }, { id: 'a', label: 'A' }], null, 2),
  edges: JSON.stringify([{ source: 's', target: 'a' }], null, 2),
  riskPath: JSON.stringify([['a']], null, 2),
});

const nodesForRunModal = computed(() => {
  if (isLiveMode.value) {
    return store.allCompanies;
  }
  if (!simulationToProcess.value) return [];
  try {
    return JSON.parse(simulationToProcess.value.nodes);
  } catch {
    return [];
  }
});

function openDeleteModal(sim) {
  simulationToProcess.value = sim;
  isDeleteModalOpen.value = true;
}

function handleDelete() {
  if (simulationToProcess.value) {
    store.removeSimulation(simulationToProcess.value.id);
  }
  isDeleteModalOpen.value = false;
}

function openRunModal(sim) {
  isLiveMode.value = false;
  simulationToProcess.value = sim;
  isRunModalOpen.value = true;
}

function openLiveRunModal() {
  isLiveMode.value = true;
  simulationToProcess.value = null; // Not needed for live run
  isRunModalOpen.value = true;
}

function handleRun(startNodeId) {
  if (isLiveMode.value) {
    const selectedCompany = store.allCompanies.find(c => c.id === startNodeId);
    if (selectedCompany) {
      store.runLiveSimulation(selectedCompany.label);
    }
  } else if (simulationToProcess.value) {
    store.startSimulation(simulationToProcess.value.id, startNodeId);
  }
  isRunModalOpen.value = false;
}

async function handleCreate() {
  try {
    const riskPathValue = newSim.value.riskPath.trim();
    const payload = {
      name: newSim.value.name,
      description: newSim.value.description,
      nodes: JSON.parse(newSim.value.nodes),
      edges: JSON.parse(newSim.value.edges),
      riskPath: riskPathValue ? JSON.parse(riskPathValue) : null,
    };
    await store.createSimulation(payload);
    isCreateModalOpen.value = false;
  } catch (err) {
    alert('创建失败，请检查JSON格式是否正确。' + err.message);
  }
}

// --- Lifecycle ---
onMounted(() => {
  store.fetchSimulations();
  store.fetchAllCompanies();
});
</script>