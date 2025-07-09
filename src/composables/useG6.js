// File: src/composables/useG6.js
import { ref, watchEffect, toValue, nextTick, shallowRef } from 'vue';
import G6 from '@antv/g6';

// 定义一个颜色池，用于动态分配关系颜色
const RELATION_COLOR_PALETTE = [
  '#38bdf8', // sky-500
  '#4ade80', // green-400
  '#a78bfa', // violet-400
  '#f472b6', // pink-400
  '#fb923c', // orange-400
];

// 将交互状态定义为常量，避免魔法字符串
const INTERACTION_STATE = {
  IDLE: 'idle',
  NODE_SELECTED: 'node_selected',
  SEARCHING: 'searching',
};

export function useG6(data, options, emit) { // 接收 emit 以便向父组件通信
  const containerRef = ref(null);
  let graphInstance = null;
  let resizeObserver = null;
  let originalData = null;

  const legendData = shallowRef({});
  const interactionState = ref(INTERACTION_STATE.IDLE);

  const resetView = () => {
    graphInstance?.fitView(20);
  };

  const resizeHandler = () => {
    if (graphInstance && !graphInstance.get('destroyed') && containerRef.value) {
      const { clientWidth, clientHeight } = containerRef.value;
      graphInstance.changeSize(clientWidth, clientHeight);
      graphInstance.fitView(20);
    }
  };

  const clearAllStats = () => {
    if (!graphInstance || graphInstance.get('destroyed')) return;
    graphInstance.getNodes().forEach(n => graphInstance.clearItemStates(n));
    graphInstance.getEdges().forEach(e => graphInstance.clearItemStates(e));
  };

  const updateEdgeColorsAndLegend = (edges) => {
    const typeColorMapping = {};
    const uniqueEdgeTypes = [...new Set(edges.map(e => e.type).filter(Boolean))];

    uniqueEdgeTypes.forEach((type, index) => {
      typeColorMapping[type] = RELATION_COLOR_PALETTE[index % RELATION_COLOR_PALETTE.length];
    });

    legendData.value = typeColorMapping;

    graphInstance.edge(edgeModel => {
      const color = typeColorMapping[edgeModel.type] || 'rgba(14, 165, 233, 0.3)';
      return {
        style: {
          stroke: color,
          endArrow: {
            path: G6.Arrow.triangle(5, 6, 0),
            fill: color,
          }
        }
      };
    });
  };

  watchEffect((onCleanup) => {
    if (!containerRef.value) return;

    if (!graphInstance) {
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 20,
        itemTypes: ['node', 'edge'],
        className: 'g6-custom-tooltip',
        getContent: (e) => {
          const model = e.item.getModel();
          let text = `<strong>${model.label || '关系'}</strong>`;
          if (e.item.getType() === 'edge' && model.type && model.label) {
            text = `类型: ${model.type}<br>关系: ${model.label}`;
          }
          return text;
        },
        shouldBegin: (e) => !!(e.item.getModel().label)
      });

      graphInstance = new G6.Graph({
        container: containerRef.value,
        fitView: true,
        padding: 20,
        layout: { type: 'force', preventOverlap: true, linkDistance: 120, nodeStrength: -300, edgeStrength: 0.2 },
        defaultNode: { type: 'circle', style: { fill: 'rgba(14, 165, 233, 0.2)', stroke: '#0ea5e9', lineWidth: 1.5 }, labelCfg: { style: { fill: '#ffffff', fontSize: 12 } } },
        defaultEdge: { type: 'polyline', labelCfg: { autoRotate: true, refY: -10, style: { fill: '#94a3b8', fontSize: 10 } } },
        modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node'] },
        plugins: [tooltip],
        nodeStateStyles: {
          highlight: { stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.3)', lineWidth: 3, shadowColor: '#38bdf8', shadowBlur: 20 },
          search_highlight: { fill: 'rgba(251, 191, 36, 0.3)', stroke: '#fbbf24', lineWidth: 4, shadowColor: '#f59e0b', shadowBlur: 20 },
          dark: { opacity: 0.2 }
        },
        edgeStateStyles: {
          highlight: { stroke: '#38bdf8', lineWidth: 3 },
          dark: { opacity: 0.2 }
        },
        animate: true
      });

      graphInstance.on('node:click', (e) => {
        if (!e.item || e.item.destroyed) return;

        interactionState.value = INTERACTION_STATE.NODE_SELECTED;
        clearAllStats();

        const node = e.item;
        const relatedEdges = node.getEdges();
        const highlightNodes = new Set([node.getID()]);
        relatedEdges.forEach(edge => {
          graphInstance.setItemState(edge, 'highlight', true);
          highlightNodes.add(edge.getSource().getID());
          highlightNodes.add(edge.getTarget().getID());
        });
        graphInstance.getNodes().forEach(n => graphInstance.setItemState(n, highlightNodes.has(n.getID()) ? 'highlight' : 'dark'));
        graphInstance.getEdges().forEach(e => { if (!e.hasState('highlight')) graphInstance.setItemState(e, 'dark', true); });

        // if (emit) emit('search-cleared');
      });

      graphInstance.on('canvas:click', () => {
        interactionState.value = INTERACTION_STATE.IDLE;
        clearAllStats();
      });

      resizeObserver = new ResizeObserver(resizeHandler);
      resizeObserver.observe(containerRef.value);

      if (emit) emit('graph-mounted');
    }

    const graphOptions = toValue(options);
    const rawData = toValue(data);

    if (graphInstance && rawData?.nodes) {
      if (!originalData) {
        originalData = JSON.parse(JSON.stringify(rawData));
        updateEdgeColorsAndLegend(originalData.edges);
      }

      const { filters, searchTerm, layout } = graphOptions;

      const allowedEdgeTypes = Object.keys(filters).filter(k => filters[k]);
      const baseEdges = originalData.edges.filter(edge => allowedEdgeTypes.includes(edge.type));
      const activeNodeIds = new Set(baseEdges.flatMap(edge => [edge.source, edge.target]));
      const coreNode = originalData.nodes.find(n => n.isCore);
      if (coreNode) {
        activeNodeIds.add(coreNode.id);
      }
      const baseNodes = originalData.nodes.filter(node => activeNodeIds.has(node.id));

      const isStructureChanged = graphInstance.getNodes().length !== baseNodes.length || graphInstance.getEdges().length !== baseEdges.length;

      if (isStructureChanged) {
        interactionState.value = INTERACTION_STATE.IDLE;
        clearAllStats();
        graphInstance.changeData({ nodes: baseNodes, edges: baseEdges });
      }

      nextTick(() => {
        const lowerCaseSearchTerm = searchTerm?.trim().toLowerCase();

        if (lowerCaseSearchTerm) {
          interactionState.value = INTERACTION_STATE.SEARCHING;
          if (!isStructureChanged) clearAllStats();
          let searchResultsCount = 0;
          graphInstance.getNodes().forEach(node => {
            const model = node.getModel();
            if (model.label.toLowerCase().includes(lowerCaseSearchTerm)) {
              graphInstance.setItemState(node, 'search_highlight', true);
              searchResultsCount++;
            } else {
              graphInstance.setItemState(node, 'dark', true);
            }
          });
          graphInstance.getEdges().forEach(edge => {
            graphInstance.setItemState(edge, 'dark', true);
          });
          if (emit) emit('search-results', searchResultsCount);
        } else {
          if (interactionState.value === INTERACTION_STATE.SEARCHING) {
            interactionState.value = INTERACTION_STATE.IDLE;
          }
          if (interactionState.value !== INTERACTION_STATE.NODE_SELECTED) {
            if (!isStructureChanged) clearAllStats();
          }
        }
      });

      const currentLayoutType = graphInstance.get('layout').type;
      if (layout !== currentLayoutType) {
        const focusNodeId = originalData.nodes.find(n => n.isCore)?.id || baseNodes[0]?.id;
        const layoutConfig = layout === 'radial'
          ? { type: 'radial', unitRadius: 100, preventOverlap: true, linkDistance: 150, focusNode: focusNodeId }
          : { type: 'force', preventOverlap: true, linkDistance: 120, nodeStrength: -300, edgeStrength: 0.2 };
        graphInstance.updateLayout(layoutConfig);
      }
    }

    onCleanup(() => {
      if (graphInstance && !graphInstance.get('destroyed')) {
        graphInstance.destroy();
      }
      graphInstance = null;
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      originalData = null;
    });
  }, { flush: 'post' });

  return { containerRef, resetView, legendData };
}
