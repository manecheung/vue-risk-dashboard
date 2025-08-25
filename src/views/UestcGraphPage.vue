<template>
  <div class="flex flex-col h-full p-4 lg:p-6 space-y-4">
    
    <!-- Tabs -->
    <div v-if="authStore.isAuthenticated" class="flex-shrink-0 border-b border-slate-700/80">
      <nav class="-mb-px flex space-x-6" aria-label="Tabs">
        <button 
          v-if="authStore.hasPermission(['uestc-graph:view'])"
          @click="activeTab = 'graph'" 
          :class="getTabClass('graph')">
          产业链图谱
        </button>
        <button 
          v-if="authStore.hasPermission(['model-management:view'])"
          @click="activeTab = 'model'" 
          :class="getTabClass('model')">
          模型管理
        </button>
      </nav>
    </div>

    <!-- 错误提示 -->
    <div v-if="uestcStore.error" class="flex-shrink-0">
      <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="text-red-400">❌</div>
          <div>
            <div class="text-red-300 font-medium">加载错误</div>
            <div class="text-sm text-red-400">{{ uestcStore.error }}</div>
          </div>
        </div>
        <button 
          @click="uestcStore.clearError()" 
          class="text-red-400 hover:text-red-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Tab Content: Graph -->
    <div v-if="activeTab === 'graph'" class="flex-grow flex flex-col gap-4 min-h-0">

      <!-- Filters -->
      <div class="flex-shrink-0 flex items-center space-x-4 flex-nowrap">
        <label for="industry-chain-select" class="text-slate-300 whitespace-nowrap">选择产业链:</label>
        <CustomSelect 
          id="industry-chain-select"
          :options="uestcStore.industryChains"
          v-model="uestcStore.selectedIndustryChain"
          @update:modelValue="onIndustryChainChange"
          label-key="name"
          value-key="id"
          class="w-64"
          :disabled="uestcStore.loading"
        />
        <label for="period-select" class="text-slate-300 whitespace-nowrap">选择时段:</label>
        <CustomSelect
          id="period-select"
          :options="uestcStore.periods"
          v-model="uestcStore.selectedPeriod"
          @update:modelValue="onPeriodChange"
          class="w-48"
          :disabled="uestcStore.loading || uestcStore.periods.length === 0"
        />
        
        <!-- 手动刷新按钮 -->
        <button 
          @click="manualRefresh" 
          class="btn btn-primary px-4 py-2 flex items-center space-x-2 whitespace-nowrap"
          :disabled="uestcStore.loading">
          <div v-if="uestcStore.loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>{{ uestcStore.loading ? '刷新中...' : '手动刷新' }}</span>
        </button>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="panel p-4 transition-colors hover:bg-slate-700/30">
          <p class="text-3xl font-bold text-red-500">{{ uestcStore.overview?.riskCompanyCount ?? '--' }}</p>
          <p class="text-sm text-slate-400 mt-1">风险企业数</p>
        </div>
        <div class="panel p-4 transition-colors hover:bg-slate-700/30">
          <p class="text-3xl font-bold text-slate-200">{{ uestcStore.overview?.totalCompanyCount ?? '--' }}</p>
          <p class="text-sm text-slate-400 mt-1">总企业数</p>
        </div>
        <div class="panel p-4 transition-colors hover:bg-slate-700/30">
          <p class="text-3xl font-bold text-sky-500">{{ uestcStore.nodeCount }}</p>
          <p class="text-sm text-slate-400 mt-1">节点数</p>
        </div>
        <div class="panel p-4 transition-colors hover:bg-slate-700/30">
          <p class="text-3xl font-bold text-teal-500">{{ uestcStore.edgeCount }}</p>
          <p class="text-sm text-slate-400 mt-1">关系数</p>
        </div>
      </div>

      <!-- Main Content: Graph -->
      <main class="flex-grow panel w-full h-full min-h-0 relative overflow-hidden">
        <!-- 全局加载状态 -->
        <div v-if="uestcStore.loading && !uestcStore.hasValidGraphData" 
             class="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm z-20">
          <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            <p class="text-slate-300">正在加载图谱数据...</p>
            <div class="text-xs text-slate-500">
              {{ uestcStore.selectedIndustryChain ? '获取图谱数据中' : '获取产业链列表中' }}
            </div>
          </div>
        </div>

        <!-- 图谱组件 -->
        <UestcKnowledgeGraph 
          v-if="!uestcStore.loading || uestcStore.hasValidGraphData"
          :data="uestcStore.riskGraph"
          :options="graphOptions"
          :reset-signal="resetSignal"
          @node-click="onNodeClick"
          @edge-click="onEdgeClick"
          @graph-ready="onGraphReady"
        />
      </main>
    </div>

    <!-- Tab Content: Model Management -->
    <div v-if="activeTab === 'model'" class="panel flex-grow min-h-0 flex flex-col relative">
      <!-- 模型管理内容保持不变 -->
      <div class="flex-grow overflow-auto">
        <DataTable
          :items="modelStore.models"
          :columns="modelColumns"
          :is-loading="modelStore.loading"
          :sort-key="modelStore.sort.key"
          :sort-direction="modelStore.sort.direction"
          @sort="handleSort"
          empty-message="没有匹配的数据。"
        >
          <template #cell-status="{ item }">
            <span>{{ statusMap[item.status] || item.status }}</span>
          </template>
          <template #cell-actions="{ item }">
            <button @click="showModelDetails(item)" class="btn btn-secondary text-xs px-2 py-1">查看</button>
          </template>
        </DataTable>
      </div>
      <footer class="flex-shrink-0 flex justify-between items-center p-3 border-t border-slate-700 text-sm text-slate-400">
        <div>共 {{ modelStore.pagination.total }} 条</div>
        <nav class="flex items-center space-x-4" aria-label="分页">
          <div class="flex items-center space-x-2">
            <label for="pageSize" class="text-xs">每页</label>
            <div class="w-20">
              <CustomSelect id="pageSize" :model-value="modelStore.pagination.size" @update:modelValue="onPageSizeChange($event)" :options="pageSizeOptions" direction="up" />
            </div>
          </div>
          <button @click="onPageChange(modelStore.pagination.current - 1)" :disabled="modelStore.pagination.current <= 1" class="btn btn-secondary text-xs px-3 py-1" aria-label="上一页">上一页</button>
          <span>{{ modelStore.pagination.current }} / {{ modelStore.pagination.pages }}</span>
          <button @click="onPageChange(modelStore.pagination.current + 1)" :disabled="modelStore.pagination.current >= modelStore.pagination.pages" class="btn btn-secondary text-xs px-3 py-1" aria-label="下一页">下一页</button>
        </nav>
      </footer>
    </div>

    <!-- Modal for Model Details -->
    <ConfirmModal
      :is-open="isModalOpen"
      title="模型详情与图表"
      @cancel="isModalOpen = false"
      :show-confirm-button="false"
      cancel-button-text="关闭"
      max-width="max-w-7xl"
    >
      <div v-if="selectedModel" class="grid grid-cols-1 gap-6">
        <div class="space-y-2 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <p><strong>ID:</strong> {{ selectedModel.id }}</p>
            <p><strong>模型名称:</strong> {{ selectedModel.trainedModelName }}</p>
            <p><strong>原始模型:</strong> {{ selectedModel.originalModelName }}</p>
            <p><strong>优化器:</strong> {{ selectedModel.optimizerName }}</p>
            <p><strong>数据集:</strong> {{ selectedModel.datasetName }}</p>
            <p><strong>状态:</strong> {{ statusMap[selectedModel.status] || selectedModel.status }}</p>
            <p><strong>描述:</strong> {{ selectedModel.description }}</p>
          </div>
          <div>
            <p><strong>训练轮次:</strong> {{ selectedModel.trainingEpochs }}</p>
            <p><strong>学习率:</strong> {{ selectedModel.learningRate }}</p>
            <p><strong>最佳轮次:</strong> {{ selectedModel.bestEpoch }}</p>
            <p><strong>模型大小:</strong> {{ selectedModel.modelSize }}</p>
            <p><strong>训练时长:</strong> {{ selectedModel.trainingDuration }}</p>
            <p><strong>创建时间:</strong> {{ selectedModel.createTime }}</p>
            <p><strong>更新时间:</strong> {{ selectedModel.updateTime }}</p>
          </div>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">训练图表</h3>
          <div v-if="modelStore.plotsLoading" class="flex justify-center items-center h-64">
            <p>加载中...</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="plot in modelStore.selectedModelPlots" :key="plot.filename" class="panel">
              <h4 class="panel-title text-sm">{{ plot.displayName }}</h4>
              <AuthenticatedImage :src="plot.url" :alt="plot.displayName" />
            </div>
          </div>
        </div>
      </div>
    </ConfirmModal>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch, nextTick } from 'vue';

// Stores
import { useUestcStore } from '@/stores/uestcStore';
import { useModelManagementStore } from '@/stores/modelManagementStore';
import { useAuthStore } from '@/stores/authStore';

// Common Components
import CustomSelect from '@/components/common/CustomSelect.vue';
import DataTable from '@/components/common/DataTable.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import AuthenticatedImage from '@/components/common/AuthenticatedImage.vue';

// Page-specific Components
import UestcKnowledgeGraph from '@/components/uestc/UestcKnowledgeGraph.vue';

// --- 状态管理 ---
const activeTab = ref('');
const authStore = useAuthStore();
const uestcStore = useUestcStore();
const resetSignal = ref(0);

// --- UI逻辑 ---
const getTabClass = (tabName) => [
  'flex items-center whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-base transition-all duration-200 ease-in-out transform',
  activeTab.value === tabName
    ? 'border-sky-500 text-sky-400'
    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500',
];

// --- 图谱配置 ---
const graphOptions = reactive({
  filters: { 
    supplier: true, 
    partner: true 
  },
  searchTerm: '',
  layout: {
    type: 'force',
    preventOverlap: true,
    linkDistance: 100,
    nodeStrength: -300,
    edgeStrength: 0.2,
    collideStrength: 0.7
  }
});

// --- 图谱交互事件 ---
const onNodeClick = (node) => {
  console.log('📍 节点点击:', node);
  // 可以添加节点点击后的具体业务逻辑
};

const onEdgeClick = (edge) => {
  console.log('📍 边点击:', edge);
  // 可以添加边点击后的具体业务逻辑
};

const onGraphReady = () => {
  console.log('📊 图谱渲染完成');
};

// --- 数据获取和刷新 ---
const manualRefresh = async () => {
  console.log('🔄 手动刷新开始...');
  
  try {
    if (uestcStore.selectedIndustryChain) {
      await Promise.all([
        uestcStore.fetchRiskGraph(),
        uestcStore.fetchOverview()
      ]);
    } else {
      await uestcStore.fetchIndustryChains();
    }
    
    // 触发图谱重新渲染
    resetSignal.value += 1;
    
  } catch (error) {
    console.error('❌ 手动刷新失败:', error);
  }
  
  console.log('🔄 手动刷新完成');
};

const onIndustryChainChange = (value) => {
  console.log('🏭 产业链切换:', value);
  uestcStore.selectIndustryChain(value);
};

const onPeriodChange = (value) => {
  console.log('📅 时段切换:', value);
  uestcStore.selectPeriod(value);
};

// --- 模型管理逻辑 ---
const modelStore = useModelManagementStore();
const isModalOpen = ref(false);
const selectedModel = ref(null);

const statusMap = {
  'ACTIVE': '活跃',
  'ARCHIVED': '已归档',
  'DELETED': '已删除'
};

const pageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const modelColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'trainedModelName', label: '模型名称', sortable: true },
  { key: 'originalModelName', label: '原始模型', sortable: true },
  { key: 'datasetName', label: '数据集', sortable: true },
  { key: 'status', label: '状态', sortable: true },
  { key: 'createTime', label: '创建时间', sortable: true },
  { key: 'actions', label: '操作' },
];

const onPageChange = (page) => {
  if (page > 0 && page <= modelStore.pagination.pages) {
    modelStore.setPage(page);
  }
};

const onPageSizeChange = (size) => {
  modelStore.setPageSize(size);
};

const showModelDetails = (model) => {
  selectedModel.value = model;
  modelStore.fetchTrainingPlots(model.id);
  isModalOpen.value = true;
};

const handleSort = (key) => {
  modelStore.setSort(key);
};

// --- 监听器 ---
watch(() => uestcStore.riskGraph, (newData) => {
  console.log('📊 riskGraph 数据更新:', {
    nodeCount: newData?.nodes?.length || 0,
    edgeCount: newData?.edges?.length || 0
  });
}, { deep: true });

// --- 生命周期 ---
onMounted(async () => {
  console.log('🚀 主组件挂载开始...');
  
  // 设置初始活跃选项卡
  if (authStore.hasPermission(['uestc-graph:view'])) {
    activeTab.value = 'graph';
    console.log('✅ 设置活跃选项卡: graph');
  } else if (authStore.hasPermission(['model-management:view'])) {
    activeTab.value = 'model';
    console.log('✅ 设置活跃选项卡: model');
  }
  
  // 并行获取数据
  console.log('📡 开始获取初始数据...');
  
  try {
    const promises = [];
    
    // 根据权限获取对应数据
    if (authStore.hasPermission(['uestc-graph:view'])) {
      promises.push(uestcStore.fetchIndustryChains());
    }
    
    if (authStore.hasPermission(['model-management:view'])) {
      promises.push(modelStore.fetchModels());
    }
    
    await Promise.all(promises);
    console.log('✅ 初始数据获取完成');
    
  } catch (error) {
    console.error('❌ 初始数据获取失败:', error);
  }
  
  console.log('🏁 主组件挂载完成');
});
</script>

<style scoped>
/* 过渡动画 */
.panel {
  transition: all 0.2s ease-in-out;
}

.btn {
  transition: all 0.15s ease-in-out;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载状态动画优化 */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .grid-cols-2.md\:grid-cols-4 {
    gap: 0.75rem;
  }
}
</style>