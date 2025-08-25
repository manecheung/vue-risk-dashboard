<template>
  <div class="knowledge-graph-container w-full h-full relative">
    <!-- 加载状态 -->
    <div 
      v-if="isInitializing || !hasValidData" 
      class="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm z-10"
    >
      <div class="flex flex-col items-center space-y-4">
        <div v-if="isInitializing" class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          <span class="text-slate-300">初始化图形引擎...</span>
        </div>
        <div v-else-if="!hasValidData" class="text-center space-y-2">
          <div class="text-yellow-400 text-lg">⚠️ 暂无图谱数据</div>
          <p class="text-xs text-slate-500">
            节点: {{ data?.nodes?.length || 0 }} | 
            边: {{ data?.edges?.length || 0 }}
          </p>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div 
      v-if="renderError" 
      class="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm z-10"
    >
      <div class="text-center space-y-3 p-6 bg-slate-800 rounded-lg border border-red-500/30 pointer-events-auto">
        <div class="text-red-400 text-lg">❌ 渲染错误</div>
        <p class="text-sm text-slate-300">{{ renderError }}</p>
        <button 
          @click="handleRefresh" 
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 图形容器 -->
    <div 
      ref="containerRef" 
      class="w-full h-full bg-transparent"
      :class="{ 'opacity-30': isInitializing }"
    ></div>

    <!-- 优化：使用 showUIToolay 统一控制UI浮层显示 -->
    <template v-if="showUIToolay">
      <!-- 工具栏 -->
      <div class="absolute top-4 right-4 flex flex-col space-y-2 z-20 pointer-events-none">
        <div class="w-24 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 border border-slate-600/50 space-y-1 pointer-events-auto">
          <button @click="handleRefresh" class="w-full text-xs text-slate-300 hover:text-slate-100 py-1 transition-colors" title="重新渲染">🔄 重新渲染</button>
          <button @click="fitView" class="w-full text-xs text-slate-300 hover:text-slate-100 py-1 transition-colors" title="适应视图">📐 适应</button>
          <button @click="zoomIn" class="w-full text-xs text-slate-300 hover:text-slate-100 py-1 transition-colors" title="放大">🔍+ 放大</button>
          <button @click="zoomOut" class="w-full text-xs text-slate-300 hover:text-slate-100 py-1 transition-colors" title="缩小">🔍- 缩小</button>
        </div>
      </div>

      <!-- 操作提示 -->
      <div class="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600/50 z-20 pointer-events-none">
        <div class="text-xs text-slate-400 space-y-1">
          <div>💡 <span class="text-slate-300">操作提示:</span></div>
          <div>• 拖拽画布移动视图</div>
          <div>• 滚轮缩放</div>
          <div>• 点击节点查看关联</div>
        </div>
      </div>

      <!-- 图例 -->
      <div v-if="showLegend" class="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600/50 z-20 max-w-xs pointer-events-none">
        <div class="text-xs space-y-2">
          <div class="text-slate-300 font-medium flex items-center justify-between">
            <span class="pointer-events-auto">图例</span>
            <button @click="showLegend = false" class="text-slate-400 hover:text-slate-200 transition-colors pointer-events-auto">✕</button>
          </div>
          <div class="space-y-1">
            <div class="flex items-center space-x-2" v-for="category in categories" :key="category.name">
              <div class="w-3 h-3 rounded-full border" :style="{ backgroundColor: category.color, borderColor: category.strokeColor }"></div>
              <span class="text-slate-400">{{ category.name }}</span>
              <span class="text-slate-500 ml-auto">{{ category.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 图例显示按钮 -->
      <button v-else @click="showLegend = true" class="absolute top-4 left-4 bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-md transition-colors text-xs z-20 pointer-events-auto" title="显示图例">📊 图例</button>
    </template>
  </div>
</template>

<script setup>
import { toRefs, computed, watch, ref } from 'vue';
import { useUestcG6 } from '@/composables/useUestcG6';

// ====================================================================
// 1. 组件接口定义 (Props & Emits)
// ====================================================================

const props = defineProps({
  /**
   * 图谱数据，包含节点和边
   * @type {{ nodes: Array, edges: Array }}
   */
  data: {
    type: Object,
    required: true,
    default: () => ({ nodes: [], edges: [] })
  },
  /**
   * @deprecated 未使用的选项属性
   */
  options: {
    type: Object,
    default: () => ({})
  },
  /**
   * 一个数字信号，当其值改变时，会触发图谱的强制刷新
   */
  resetSignal: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits([
  /**
   * 节点点击时触发
   * @param {object} node 被点击的节点数据模型
   */
  'node-click',
  /**
   * 边点击时触发
   * @param {object} edge 被点击的边数据模型
   */
  'edge-click',
  /**
   * 图谱引擎准备就绪或数据渲染更新后触发
   */
  'graph-ready'
]);

// ====================================================================
// 2. 核心逻辑 (Core Logic)
// ====================================================================

const { data, resetSignal } = toRefs(props);

// --- 内部状态 ---
const showLegend = ref(true);

// --- 计算属性 (Computed Properties) ---

// 是否有有效数据用于渲染
const hasValidData = computed(() => data.value?.nodes?.length > 0);

// 是否显示UI浮层
const showUIToolay = computed(() => hasValidData.value && !isInitializing.value);

// 从节点数据中计算出图例所需的分类统计
const categories = computed(() => {
  if (!hasValidData.value) return [];

  const colorMap = {
    '产品': { color: '#63b3ed', strokeColor: '#3182ce' },
    '核心企业': { color: '#f56565', strokeColor: '#c53030' },
    '上游企业': { color: '#4299e1', strokeColor: '#2b6cb0' },
    '下游企业': { color: '#48bb78', strokeColor: '#2f855a' },
    '风险': { color: '#f6ad55', strokeColor: '#c05621' },
    '未分类': { color: '#a0aec0', strokeColor: '#4a5568' },
  };

  const categoryCounts = data.value.nodes.reduce((acc, node) => {
    const category = node.category || '未分类';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name,
      count,
      ...colorMap[name]
    }))
    .sort((a, b) => b.count - a.count);
});

// --- G6实例管理 ---

const { 
  containerRef, 
  isInitializing, 
  renderError, 
  refresh,
  fitView,
  zoomIn,
  zoomOut
} = useUestcG6(data); // 直接将props的ref传入，useUestcG6内部会处理

// ====================================================================
// 3. 事件处理 (Event Handlers)
// ====================================================================

const handleRefresh = async () => {
  try {
    await refresh();
    emit('graph-ready');
  } catch (error) {
    console.error('❌ 刷新失败:', error);
  }
};

// --- 监听器 (Watchers) ---

watch(resetSignal, (newVal) => {
  if (newVal > 0) {
    console.log('📡 接收到重置信号:', newVal);
    handleRefresh();
  }
});

watch(showUIToolay, (isReady) => {
  if (isReady) {
    emit('graph-ready');
  }
});

</script>

<style scoped>
.knowledge-graph-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* G6 tooltip 自定义样式 */
:deep(.g6-custom-tooltip) {
  background: rgba(15, 23, 42, 0.95) !important;
  border: 1px solid #475569 !important;
  border-radius: 8px !important;
  padding: 8px 12px !important;
  font-size: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(8px) !important;
  z-index: 9999 !important;
}

:deep(.g6-custom-tooltip .tooltip-content) {
  color: #e2e8f0;
  line-height: 1.4;
}

:deep(.g6-custom-tooltip .tooltip-content strong) {
  color: #93c5fd;
  font-weight: 600;
}

:deep(.g6-custom-tooltip .tooltip-meta) {
  color: #94a3b8;
  font-size: 11px;
}

/* G6 画布样式优化 */
:deep(.g6-component-tooltip) {
  pointer-events: none;
  z-index: 1000;
}

/* 工具栏按钮动画 */
.z-20 > div,
.z-20 > button {
  transition: all 0.2s ease-in-out;
}

.z-20 > div:hover,
.z-20 > button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 图例样式 */
.max-w-xs {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .absolute.bottom-4.left-4,
  .absolute.top-4.left-4 {
    left: 0.5rem;
    bottom: 0.5rem;
    top: 0.5rem;
  }
  
  .absolute.top-4.right-4 {
    right: 0.5rem;
    top: 0.5rem;
  }
  
  .max-w-xs {
    max-width: calc(100vw - 2rem);
  }
}

/* 滚动条美化 */
:deep(::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(::-webkit-scrollbar-track) {
  background: rgba(71, 85, 105, 0.1);
  border-radius: 3px;
}

:deep(::-webkit-scrollbar-thumb) {
  background: rgba(71, 85, 105, 0.5);
  border-radius: 3px;
}

:deep(::-webkit-scrollbar-thumb:hover) {
  background: rgba(71, 85, 105, 0.7);
}

/* 加载动画优化 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 状态指示器 */
.opacity-30 {
  transition: opacity 0.3s ease-in-out;
}
</style>