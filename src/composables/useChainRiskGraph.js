import { ref, onMounted, onUnmounted, watch } from 'vue';
import G6 from '@antv/g6';

// --- G6 Graph Configuration ---
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
    defaultNode: { type: 'rect', size: [120, 40], style: { radius: 4, fill: 'rgba(56, 189, 248, 0.2)', stroke: '#38bdf8' }, labelCfg: { style: { fill: '#fff', fontSize: 12 } } },
    defaultEdge: { type: 'polyline', style: { radius: 10, offset: 20, stroke: 'rgba(14, 165, 233, 0.5)', endArrow: { path: G6.Arrow.triangle(4, 5, 2), d: 2 } } },
    modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node'] },
    plugins: [tooltip],
    nodeStateStyles: { 
      risk: { fill: 'var(--risk-high-color)', stroke: '#fca5a5' },
      source: { fill: 'var(--risk-medium-color)', stroke: '#fca5a5' }
    },
    edgeStateStyles: { 
      active: { stroke: '#fbbf24', lineWidth: 2, shadowColor: '#fbbf24', shadowBlur: 10 }
    }
  };
}

/**
 * A refactored composable for rendering a G6 graph.
 * @param {Ref<Object>} graphDataRef - A Vue Ref containing the graph data { nodes, edges, riskPath }.
 */
export function useChainRiskGraph(graphDataRef) {
  const containerRef = ref(null);
  let graph = null;
  let resizeObserver = null;

  const updateGraph = (data) => {
    if (!graph || graph.get('destroyed')) return;

    // 1. Clear all previous states
    graph.getNodes().forEach(node => graph.clearItemStates(node));
    graph.getEdges().forEach(edge => graph.clearItemStates(edge));

    // 2. Load new data
    const plainData = JSON.parse(JSON.stringify(data));
    graph.changeData(plainData);
    
    setTimeout(() => {
        graph.fitView(30);
    }, 0);

    // 3. Apply new states based on riskPath
    if (data && data.riskPath && data.riskPath.length > 0) {
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
  };

  const initGraph = (container) => {
    if (graph || !container) return;

    graph = new G6.Graph(createGraphConfig(container));

    if (graphDataRef.value) {
      updateGraph(graphDataRef.value);
    }

    resizeObserver = new ResizeObserver(() => {
        if (graph && !graph.get('destroyed') && container) {
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