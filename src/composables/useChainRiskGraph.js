import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import G6 from '@antv/g6';

// 定义常量，避免魔法字符串
const NODE_STATE_RISK = 'risk';
const EDGE_STATE_ACTIVE = 'active';

/**
 * 创建 G6 图表配置的辅助函数，提高代码整洁度
 * (从composable函数中移出，避免重复创建)
 */
function createGraphConfig(container) {
  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    itemTypes: ['node'],
    className: 'g6-custom-tooltip',
    getContent: (e) => e.item.getModel().label,
  });

  return {
    container,
    fitView: true,
    padding: 30,
    layout: { type: 'dagre', rankdir: 'LR', align: 'UL', nodesep: 30, ranksep: 60 },
    defaultNode: { type: 'rect', size: [100, 35], style: { radius: 4, fill: 'rgba(56, 189, 248, 0.2)', stroke: '#38bdf8' }, labelCfg: { style: { fill: '#fff', fontSize: 12 } } },
    defaultEdge: { type: 'polyline', style: { radius: 10, offset: 20, stroke: 'rgba(14, 165, 233, 0.5)', endArrow: { path: G6.Arrow.triangle(4, 5, 2), d: 2 } } },
    modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node'] },
    plugins: [tooltip],
    nodeStateStyles: { [NODE_STATE_RISK]: { fill: 'var(--risk-high-color)', stroke: '#fca5a5' } },
    edgeStateStyles: { [EDGE_STATE_ACTIVE]: { stroke: '#fbbf24', lineWidth: 2, shadowColor: '#fbbf24', shadowBlur: 15, lineDash: [5, 5], animate: true, endArrow: { path: G6.Arrow.triangle(5, 6, 3), d: 3, fill: '#fbbf24' } } }
  };
}


export function useChainRiskGraph(store) {
  const containerRef = ref(null);
  // graph 实例本身不需要是响应式的
  let graph = null;
  let resizeObserver = null;

  // 使用 computed 缓存计算结果，只有在依赖项变化时才重新计算
  const riskSourceNodeIds = computed(() =>
    store.graphData.nodes
      .filter(n => n.style?.fill === 'var(--risk-high-color)')
      .map(n => n.id)
  );

  const riskPath = computed(() => store.graphData.riskPath || []);

  // 核心优化：将状态更新逻辑拆分并封装
  const updateGraphStates = () => {
    if (!graph || graph.get('destroyed')) return;

    // 清空所有旧状态
    graph.getNodes().forEach(node => graph.setItemState(node, NODE_STATE_RISK, false));
    graph.getEdges().forEach(edge => graph.setItemState(edge, EDGE_STATE_ACTIVE, false));

    // 计算当前受影响的所有节点
    const allAtRiskNodes = new Set(riskSourceNodeIds.value);
    for (let i = 0; i < store.currentStep; i++) {
      riskPath.value[i]?.forEach(id => allAtRiskNodes.add(id));
    }

    // 更新节点状态
    allAtRiskNodes.forEach(nodeId => {
      const node = graph.findById(nodeId);
      if (node) {
        graph.setItemState(node, NODE_STATE_RISK, true);
      }
    });

    // 更新边的状态
    if (store.currentStep > 0 && store.currentStep <= riskPath.value.length) {
      const currentStepNodes = new Set(riskPath.value[store.currentStep - 1] || []);
      const previousRiskNodes = new Set(riskSourceNodeIds.value);
      for (let i = 0; i < store.currentStep - 1; i++) {
        riskPath.value[i]?.forEach(id => previousRiskNodes.add(id));
      }

      graph.getEdges().forEach(edge => {
        const model = edge.getModel();
        if (currentStepNodes.has(model.target) && previousRiskNodes.has(model.source)) {
          graph.setItemState(edge, EDGE_STATE_ACTIVE, true);
        }
      });
    }
  };

  // 优化点：使用独立的 watch 监听数据源变化，职责更单一
  watch(() => store.graphData, (newGraphData) => {
    if (graph && newGraphData) {
      // 使用 changeData 性能更优，如果拓扑结构完全不同，再考虑 data + render
      // 注意：G6 需要纯净的 JS 对象，如果 newGraphData 是 Proxy，需要处理
      const plainData = JSON.parse(JSON.stringify(newGraphData));
      graph.changeData(plainData);
      updateGraphStates(); // 数据更新后，立即根据当前步骤更新状态
    }
  }, { deep: true }); // deep watch 监听对象内部变化

  // 优化点：单独监听步骤变化，只执行状态更新，不重新渲染图
  watch(() => store.currentStep, () => {
    if (graph) {
      updateGraphStates();
    }
  });

  const resizeHandler = () => {
    if (graph && !graph.get('destroyed') && containerRef.value) {
      graph.changeSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
    }
  };

  // 优化点：使用 onMounted/onUnmounted 管理生命周期，更符合 Vue 范式
  onMounted(() => {
    if (!containerRef.value) return;

    graph = new G6.Graph(createGraphConfig(containerRef.value));

    // 初始加载数据
    if (store.graphData) {
      const plainData = JSON.parse(JSON.stringify(store.graphData));
      graph.data(plainData);
      graph.render();
      updateGraphStates();
    }

    // 监听容器尺寸变化
    resizeObserver = new ResizeObserver(resizeHandler);
    resizeObserver.observe(containerRef.value);
  });

  onUnmounted(() => {
    resizeObserver?.disconnect();
    graph?.destroy();
    graph = null;
    resizeObserver = null;
  });

  return { containerRef };
}