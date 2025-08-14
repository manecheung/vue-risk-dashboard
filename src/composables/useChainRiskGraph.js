import { ref, onMounted, onUnmounted, watch } from 'vue';
import G6 from '@antv/g6';

// --- 辅助函数 ---
function getRiskColor(riskValue) {
  if (riskValue > 0.7) return '#ef4444'; // red-500
  if (riskValue > 0.4) return '#f97316'; // orange-500
  if (riskValue > 0.1) return '#eab308'; // yellow-500
  return '#22c55e'; // green-500
}

// --- G6 图表配置 ---
function createGraphConfig(container) {
  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    itemTypes: ['node'],
    className: 'g6-custom-tooltip',
    getContent: (e) => {
      const model = e.item.getModel();
      let content = model.label;
      if (model.riskValue !== undefined) {
        content += `<br>风险值: ${model.riskValue.toFixed(3)}`;
      }
      if (model.level !== undefined) {
        content += `<br>层级: ${model.level}`;
      }
      return content;
    },
  });

  return {
    container,
    fitView: true,
    padding: 30,
    layout: { type: 'dagre', rankdir: 'LR', align: 'UL', nodesep: 30, ranksep: 60 },
    defaultNode: { type: 'rect', size: [120, 40], style: { radius: 4, fill: 'rgba(56, 189, 248, 0.2)', stroke: '#38bdf8' }, labelCfg: { style: { fill: '#fff', fontSize: 12 } } },
    defaultEdge: { type: 'polyline', style: { radius: 10, offset: 20, stroke: 'rgba(14, 165, 233, 0.5)', endArrow: { path: G6.Arrow.triangle(4, 5, 2), d: 2 } } },
    modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node'] },
    plugins: [tooltip],
    nodeStateStyles: {
      'risk-origin': {
        stroke: '#ef4444', // red-500
        lineWidth: 3,
        shadowColor: '#ef4444',
        shadowBlur: 20,
        fill: 'rgba(239, 68, 68, 0.3)'
      },
      risk: { fill: 'var(--risk-high-color)', stroke: '#fca5a5' },
      source: { fill: 'var(--risk-medium-color)', stroke: '#fca5a5' }
    },
    edgeStateStyles: {
      active: { stroke: '#fbbf24', lineWidth: 2, shadowColor: '#fbbf24', shadowBlur: 10 }
    }
  };
}

/**
 * 一个重构后的、用于渲染 G6 图表的 Composable
 * @param {Ref<Object>} graphDataRef - 包含图表数据的 Vue Ref
 */
export function useChainRiskGraph(graphDataRef) {
  const containerRef = ref(null);
  let graph = null;
  let resizeObserver = null;

  const updateGraph = (data) => {
    if (!graph || graph.get('destroyed')) return;

    // 1. 清除所有之前的状态
    graph.getNodes().forEach(node => graph.clearItemStates(node));
    graph.getEdges().forEach(edge => graph.clearItemStates(edge));

    // 2. 加载新数据
    const plainData = JSON.parse(JSON.stringify(data));
    graph.changeData(plainData);

    setTimeout(() => {
        const container = containerRef.value;
        if (graph && !graph.get('destroyed') && container && container.clientWidth > 0 && container.clientHeight > 0) {
            graph.fitView(30);
        }
    }, 0);

    const isLiveSimulation = data.nodes && data.nodes.some(n => n.riskValue !== undefined);

    if (isLiveSimulation) {
      plainData.nodes.forEach(nodeModel => {
        const node = graph.findById(nodeModel.id);
        if (!node) return;

        const model = node.getModel();
        const riskValue = model.riskValue || 0;
        const color = getRiskColor(riskValue);
        const size = 40 + (riskValue * 40);

        graph.updateItem(node, {
          style: {
            ...model.style,
            fill: color,
            stroke: color,
            shadowColor: color,
            shadowBlur: riskValue > 0.1 ? 15 : 0,
          },
          size: [120, size],
        });
      });
    } else if (data && data.riskPath && data.riskPath.length > 0) {
      const atRiskNodes = new Set();
      const atRiskEdges = new Set();
      const riskSources = new Set(data.nodes?.filter(n => n.isSource).map(n => n.id) || []);

      riskSources.forEach(nodeId => atRiskNodes.add(nodeId));
      data.riskPath.flat().forEach(nodeId => atRiskNodes.add(nodeId));

      graph.getEdges().forEach(edge => {
        const model = edge.getModel();
        if (atRiskNodes.has(model.source) && atRiskNodes.has(model.target)) {
          atRiskEdges.add(model.id || edge.getID());
        }
      });

      atRiskNodes.forEach(nodeId => {
        const node = graph.findById(nodeId);
        if (node) {
          graph.setItemState(node, riskSources.has(nodeId) ? 'source' : 'risk', true);
        }
      });
      atRiskEdges.forEach(edgeId => {
        const edge = graph.findById(edgeId);
        if (edge) {
          graph.setItemState(edge, 'active', true);
        }
      });
    }

    // 在所有样式更新后，高亮风险源头
    if (data.startNodeId) {
      const sourceNode = graph.findById(data.startNodeId);
      if (sourceNode) {
        graph.setItemState(sourceNode, 'risk-origin', true);
      }
    }
  };

  const initGraph = (container) => {
    if (graph || !container) return;

    graph = new G6.Graph(createGraphConfig(container));

    if (graphDataRef.value) {
      updateGraph(graphDataRef.value);
    }

    resizeObserver = new ResizeObserver(() => {
        if (graph && !graph.get('destroyed') && container) {
            if (container.clientWidth === 0 || container.clientHeight === 0) {
                return;
            }
            graph.changeSize(container.clientWidth, container.clientHeight);
            graph.fitView(30);
        }
    });
    resizeObserver.observe(container);
  };

  watch(containerRef, (newContainer) => {
    if (newContainer) {
      initGraph(newContainer);
    }
  });

  watch(graphDataRef, (newData) => {
    if (graph && newData) {
      updateGraph(newData);
    } else if (graph && !newData) {
      graph.clear();
    }
  }, { deep: true });

  onUnmounted(() => {
    resizeObserver?.disconnect();
    graph?.destroy();
  });

  return { containerRef };
}