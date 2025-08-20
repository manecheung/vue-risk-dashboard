<template>
  <div class="relative w-full h-full">
    <!-- Graph Container -->
    <div ref="container" class="w-full h-full bg-transparent"
      :style="{ visibility: shouldShowGraph ? 'visible' : 'hidden' }"></div>

    <!-- Graph Legend -->
    <div v-if="shouldShowGraph" class="absolute bottom-4 right-4 origin-bottom-right scale-50" :class="`bg-slate-800/90 backdrop-blur-sm border border-slate-600
           rounded-lg p-4 text-sm shadow-lg w-25`">
      <h4 class="font-semibold text-slate-200 mb-3 flex items-center">
        <span class="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
        图例说明
      </h4>

      <!-- Node States Legend -->
      <div class="space-y-2 mb-4">
        <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">节点状态</p>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-3 bg-green-500 rounded-sm border border-green-600 shadow-sm"></div>
          <span class="text-slate-300">正常</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-3 bg-amber-500 rounded-sm border border-amber-600 shadow-sm"></div>
          <span class="text-slate-300">预警</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-3 bg-red-500 rounded-sm border border-red-600 shadow-sm animate-pulse"></div>
          <span class="text-slate-300">高危</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-3 bg-slate-500 rounded-sm border border-slate-600"></div>
          <span class="text-slate-300">未知</span>
        </div>
      </div>

      <!-- Edge Types Legend -->
      <div class="space-y-2">
        <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">连接类型</p>

        <!-- Normal Supply Chain Link -->
        <div class="flex items-center space-x-2">
          <svg width="24" height="8" viewBox="0 0 24 8">
            <defs>
              <marker id="normalArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"
                markerUnits="strokeWidth">
                <polygon points="0,0 0,6 8,3" fill="#475569" />
              </marker>
            </defs>
            <line x1="2" y1="4" x2="22" y2="4" stroke="#475569" stroke-width="2" marker-end="url(#normalArrow)" />
          </svg>
          <span class="text-slate-300">供应链关系</span>
        </div>

        <!-- Active Risk Path -->
        <!-- <div class="flex items-center space-x-2">
          <svg width="24" height="8" viewBox="0 0 24 8">
            <defs>
              <marker id="activeArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <polygon points="0,0 0,6 8,3" fill="#ef4444" />
              </marker>
            </defs>
            <line x1="2" y1="4" x2="22" y2="4" stroke="#ef4444" stroke-width="3" stroke-dasharray="5,5" marker-end="url(#activeArrow)">
              <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />
            </line>
          </svg>
          <span class="text-slate-300">风险传播路径</span>
        </div> -->

        <!-- Dependency Link -->
        <div class="flex items-center space-x-2">
          <svg width="24" height="8" viewBox="0 0 24 8">
            <defs>
              <marker id="dependencyArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"
                markerUnits="strokeWidth">
                <polygon points="0,0 0,6 8,3" fill="#06b6d4" />
              </marker>
            </defs>
            <line x1="2" y1="4" x2="22" y2="4" stroke="#06b6d4" stroke-width="2" stroke-dasharray="3,3"
              marker-end="url(#dependencyArrow)" />
          </svg>
          <span class="text-slate-300">依赖关系</span>
        </div>

        <!-- Financial Link -->
        <!-- <div class="flex items-center space-x-2">
          <svg width="24" height="8" viewBox="0 0 24 8">
            <defs>
              <marker id="financialArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <polygon points="0,0 0,6 8,3" fill="#8b5cf6" />
              </marker>
            </defs>
            <line x1="2" y1="4" x2="22" y2="4" stroke="#8b5cf6" stroke-width="2" marker-end="url(#financialArrow)" />
          </svg>
          <span class="text-slate-300">资金流向</span>
        </div> -->
      </div>

      <!-- Interactive Hints -->
      <div class="mt-4 pt-3 border-t border-slate-600">
        <p class="text-xs text-slate-400">
          💡 点击节点查看详情<br />
          🔍 拖拽移动视图<br />
          🖱️ 滚轮缩放图谱
        </p>
      </div>
    </div>

    <!-- Status Overlay -->
    <div v-if="!shouldShowGraph" class="absolute inset-0 flex items-center justify-center bg-slate-900/50">
      <div class="text-center text-slate-400">
        <div v-if="store.isLoading">
          <p class="text-lg">正在加载图谱数据...</p>
          <p class="text-sm">请稍候</p>
        </div>
        <div v-else-if="store.error" class="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
          <p class="font-semibold">加载失败</p>
          <p class="text-sm">{{ store.error }}</p>
        </div>
        <div v-else-if="!store.graphData || store.graphData.nodes.length === 0">
          <p class="text-lg">无数据显示</p>
          <p class="text-sm">请在左侧控制面板中选择一个模拟场景</p>
        </div>
      </div>
    </div>

    <!-- Layout Switch -->
    <div v-if="shouldShowGraph" class="absolute top-4 left-4 w-36">
      <CustomSelect v-model="currentLayout" :options="layoutOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import G6 from '@antv/g6';
import { useSimulationStore } from '@/stores/simulationStore';
import CustomSelect from '@/components/common/CustomSelect.vue'; // Import CustomSelect

const store = useSimulationStore();
const container = ref(null);
const currentLayout = ref('grid');
let graph = null;
let resizeObserver = null;

const layoutOptions = ref([
  { value: 'grid', label: '网格布局' },
  { value: 'dagre', label: '层次布局' },
  { value: 'concentric', label: '同心圆' },
  { value: 'force', label: '力导向' },
]);

const shouldShowGraph = computed(() => {
  return !store.isLoading && !store.error && store.graphData && store.graphData.nodes.length > 0;
});

onMounted(() => {
  if (container.value) {
    initGraph();
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (graph) {
    graph.destroy();
    graph = null;
  }
});

const initGraph = () => {
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  graph = new G6.Graph({
    container: container.value,
    width,
    height,
    layout: {
      type: 'grid',
      preventOverlap: true,
      nodeSize: 60,
      sortBy: 'id',
    },
    defaultNode: {
      size: [80, 45],
      type: 'ellipse',
      style: {
        lineWidth: 2,
        stroke: '#475569',
        cursor: 'pointer',
        fill: '#64748b',
        fillOpacity: 0.8,
      },
      labelCfg: {
        style: {
          fill: '#e2e8f0',
          fontSize: 11,
          fontWeight: 500,
          textAlign: 'center',
          textBaseline: 'middle',
          stroke: '#0f172a',
          strokeWidth: 0.5,
        },
        position: 'center',
      },
    },
    defaultEdge: {
      type: 'cubic-horizontal',
      style: {
        stroke: '#475569',
        lineWidth: 2,
        opacity: 0.7,
        endArrow: {
          path: G6.Arrow.triangle(10, 12, 3),
          d: 3,
          fill: '#475569',
          stroke: '#475569',
        },
      },
      stateStyles: {
        // 活跃的风险传播路径
        active: {
          stroke: '#ef4444',
          lineWidth: 3,
          opacity: 1,
          lineDash: [8, 4],
          endArrow: {
            fill: '#ef4444',
            stroke: '#ef4444',
          },
          // 添加流动动画效果
          animate: {
            lineDashOffset: -20,
            repeat: true,
            duration: 2000,
          },
        },
        // 依赖关系
        dependency: {
          stroke: '#06b6d4',
          lineWidth: 2,
          opacity: 0.8,
          lineDash: [4, 4],
          endArrow: {
            fill: '#06b6d4',
            stroke: '#06b6d4',
          },
        },
        // 资金流向
        financial: {
          stroke: '#8b5cf6',
          lineWidth: 2,
          opacity: 0.8,
          endArrow: {
            fill: '#8b5cf6',
            stroke: '#8b5cf6',
          },
        },
        // 悬停高亮
        hover: {
          stroke: '#38bdf8',
          lineWidth: 3,
          opacity: 1,
          shadowBlur: 10,
          shadowColor: '#38bdf8',
        },
      },
    },
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    },
    nodeStateStyles: {
      hover: {
        lineWidth: 3,
        stroke: '#38bdf8',
        shadowBlur: 10,
        shadowColor: '#38bdf8',
      },
      normal: {
        fill: '#10b981',
        stroke: '#059669',
        shadowBlur: 5,
        shadowColor: '#10b981',
      },
      warning: {
        fill: '#f59e0b',
        stroke: '#d97706',
        shadowBlur: 8,
        shadowColor: '#f59e0b',
      },
      danger: {
        fill: '#ef4444',
        stroke: '#dc2626',
        shadowBlur: 12,
        shadowColor: '#ef4444',
        animate: {
          shadowBlur: [8, 16],
          repeat: true,
          duration: 1500,
          easing: 'easeCubic',
        },
      },
    },
    animate: true,
    animateCfg: {
      duration: 300,
      easing: 'easeLinear',
    },
  });

  setupGraphEvents();
  setupResizeObserver();

  nextTick(() => {
    renderExistingData();
  });
};

const setupGraphEvents = () => {
  graph.on('node:click', (evt) => {
    const { item } = evt;
    const model = item.getModel();
    store.setSelectedNodeById(model.id);
    highlightRiskPath(model.id);
  });

  graph.on('canvas:click', () => {
    store.clearSelectedNode();
    clearHighlight();
  });

  graph.on('node:mouseenter', (evt) => {
    graph.setItemState(evt.item, 'hover', true);
    // 高亮相关边
    highlightRelatedEdges(evt.item.getModel().id, 'hover');
  });

  graph.on('node:mouseleave', (evt) => {
    graph.setItemState(evt.item, 'hover', false);
    clearEdgeHighlight('hover');
  });

  graph.on('edge:mouseenter', (evt) => {
    graph.setItemState(evt.item, 'hover', true);
  });

  graph.on('edge:mouseleave', (evt) => {
    graph.setItemState(evt.item, 'hover', false);
  });

  graph.on('afterlayout', () => {
    // 布局完成后自动居中适配
    setTimeout(() => {
      if (graph && !graph.get('destroyed')) {
        graph.fitView(20); // 20px padding
      }
    }, 50);
  });
};

// 高亮风险传播路径
const highlightRiskPath = (nodeId) => {
  clearHighlight();
  highlightRelatedEdges(nodeId, 'active');
};

// 高亮相关边
const highlightRelatedEdges = (nodeId, state) => {
  const edges = graph.getEdges();
  edges.forEach(edge => {
    const model = edge.getModel();
    if (model.source === nodeId || model.target === nodeId) {
      graph.setItemState(edge, state, true);
    }
  });
};

// 清除特定状态的边高亮
const clearEdgeHighlight = (state) => {
  const edges = graph.getEdges();
  edges.forEach(edge => {
    graph.setItemState(edge, state, false);
  });
};

// 清除所有高亮
const clearHighlight = () => {
  const edges = graph.getEdges();
  edges.forEach(edge => {
    graph.clearItemStates(edge);
  });
};

const setupResizeObserver = () => {
  resizeObserver = new ResizeObserver(() => {
    if (!container.value || !graph || graph.get('destroyed')) {
      return;
    }
    graph.changeSize(container.value.clientWidth, container.value.clientHeight);
    graph.fitView(20);
  });
  resizeObserver.observe(container.value);
};

const renderExistingData = () => {
  if (store.graphData && store.graphData.nodes.length > 0) {
    renderGraphData(store.graphData);
  }

  if (store.nodeUpdates && store.nodeUpdates.length > 0) {
    applyNodeUpdatesSmooth(store.nodeUpdates);
  }
};

const renderGraphData = (data) => {
  if (!graph || !data || !data.nodes || data.nodes.length === 0) {
    return;
  }

  try {
    const graphData = JSON.parse(JSON.stringify(data));

    graphData.nodes.forEach(node => {
      node.type = 'ellipse';
      node.size = [80, 45];
      node.style = {
        fill: '#64748b',
        fillOpacity: 0.8,
        stroke: '#475569',
        lineWidth: 2,
      };
      node.label = node.name;
    });

    if (graphData.edges) {
      graphData.edges.forEach((edge, index) => {
        edge.type = 'cubic-horizontal';
        edge.style = {
          stroke: '#475569',
          lineWidth: 2,
          opacity: 0.7,
          endArrow: {
            path: G6.Arrow.triangle(10, 12, 3),
            d: 3,
            fill: '#475569',
          },
        };

        // 根据业务逻辑设置不同类型的边
        // 这里是示例，你可以根据实际数据结构调整
        if (edge.type === 'dependency') {
          edge.style.stroke = '#06b6d4';
          edge.style.lineDash = [4, 4];
        } else if (edge.type === 'financial') {
          edge.style.stroke = '#8b5cf6';
        }
      });
    }

    graph.data(graphData);
    graph.render();

    console.log('Graph data rendered successfully:', graphData.nodes.length, 'nodes');
  } catch (error) {
    console.error('Error rendering graph data:', error);
  }
};

const applyNodeUpdatesSmooth = (updates) => {
  if (!graph || !updates || updates.length === 0) {
    // 确保在没有更新时也解除锁定
    if (store.isAnimating) {
      store.setAnimating(false);
    }
    return;
  }

  store.setAnimating(true); // <--- 锁定UI

  let index = 0;
  const interval = 200; // 每个节点更新的间隔时间（毫秒）

  function processNextUpdate() {
    // 当所有节点都更新完毕时，退出并解锁
    if (index >= updates.length) {
      store.setAnimating(false); // <--- 解锁UI
      return;
    }

    const update = updates[index];
    try {
      const node = graph.findById(update.id);
      if (node && !node.destroyed) {
        const newState = getNodeState(update.state);

        // 清除节点的所有现有状态，为设置新状态做准备
        graph.clearItemStates(node, ['normal', 'warning', 'danger', 'hover']);
        
        // 设置新的状态，G6会根据nodeStateStyles自动应用样式
        if (newState) {
          graph.setItemState(node, newState, true);
        }
      }
    } catch (error) {
      console.error(`Error updating node ${update.id}:`, error);
    }

    index++;
    // 设置定时器，在指定间隔后处理下一个节点
    setTimeout(processNextUpdate, interval);
  }

  // 启动更新流程
  processNextUpdate();
};

const getNodeColor = (state) => {
  switch (state) {
    case 1: return '#10b981'; // green-500 正常
    case 2: return '#f59e0b'; // amber-500 预警  
    case 3: return '#ef4444'; // red-500 高危
    default: return '#64748b'; // slate-500 未知
  }
};

const getNodeState = (state) => {
  switch (state) {
    case 1: return 'normal';
    case 2: return 'warning';
    case 3: return 'danger';
    default: return null;
  }
};

// Watch for layout changes and switch the graph layout
watch(currentLayout, (newLayout) => {
  if (newLayout) {
    switchLayout(newLayout);
  }
});

const switchLayout = (layoutType) => {
  if (!graph) return;

  const width = graph.getWidth();
  const height = graph.getHeight();
  const nodeCount = graph.getNodes().length;

  // 正确的停止动画方法
  try {
    graph.stopAnimate();
  } catch (e) {
    // 如果没有这个方法就忽略
    console.log('stopAnimate not available');
  }

  const layoutConfigs = {
    dagre: {
      type: 'dagre',
      rankdir: 'TB',
      align: 'DL',
      nodesep: 80,
      ranksep: 120,
      controlPoints: true,
    },
    concentric: {
      type: 'concentric',
      center: [width / 2, height / 2],
      nodeSize: 60,
      minNodeSpacing: 100,
      preventOverlap: true,
      sortBy: 'degree',
      startRadius: 50,
    },
    grid: {
      type: 'grid',
      preventOverlap: true,
      nodeSize: 60,
      condense: false,
      rows: Math.ceil(Math.sqrt(nodeCount)),
      cols: Math.ceil(Math.sqrt(nodeCount)),
      sortBy: 'id',
    },
    force: {
      type: 'force',
      preventOverlap: true,
      linkDistance: 120,
      nodeStrength: -600,
      edgeStrength: 0.1,
      center: [width / 2, height / 2],
    }
  };

  const config = layoutConfigs[layoutType];
  if (!config) return;

  // 暂时禁用动画以避免闪烁
  const originalAnimate = graph.get('animate');
  graph.set('animate', false);

  // 清除之前的afterlayout监听器
  graph.off('afterlayout');

  // 添加一次性的布局完成监听
  graph.once('afterlayout', () => {
    setTimeout(() => {
      // 恢复动画设置
      graph.set('animate', originalAnimate);

      // 强制居中显示
      graph.fitView(30);

      // 重新添加常规的afterlayout监听器
      graph.on('afterlayout', () => {
        setTimeout(() => {
          if (graph && !graph.get('destroyed')) {
            graph.fitView(20);
          }
        }, 50);
      });

      console.log(`Layout switched to ${layoutType} and centered`);
    }, 100);
  });

  // 执行布局更新
  graph.updateLayout(config);
};

// 监听器
watch(() => store.graphData, (newData, oldData) => {
  if (newData === oldData || !graph) return;
  renderGraphData(newData);
}, { deep: true, immediate: false });

watch(() => store.nodeUpdates, (updates) => {
  if (!updates || updates.length === 0) return;
  applyNodeUpdatesSmooth(updates);
}, { deep: true, immediate: false });

watch(() => store.selectedNodeId, (nodeId) => {
  if (!graph) return;

  if (nodeId) {
    highlightRiskPath(nodeId);
  } else {
    clearHighlight();
  }
});

watch(() => [store.graphData, graph], ([data, graphInstance]) => {
  if (graphInstance && data && data.nodes && data.nodes.length > 0) {
    const currentNodes = graphInstance.getNodes();
    if (currentNodes.length === 0) {
      console.log('Graph is empty, re-rendering data...');
      renderGraphData(data);
    }
  }
}, { immediate: true });

</script>

<style scoped>
/* 自定义动画 */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 图例样式优化 */
.legend-container {
  backdrop-filter: blur(8px);
  border: 1px solid rgba(148, 163, 184, 0.2);
}
</style>