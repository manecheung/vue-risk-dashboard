import { ref, watch, onUnmounted, nextTick } from 'vue';
import G6 from '@antv/g6';

// ====================================================================
// 1. 常量定义 (Constants)
// ====================================================================

const CATEGORY_COLOR_MAP = {
  '产品': '#63b3ed', '核心企业': '#f56565', '上游企业': '#4299e1',
  '下游企业': '#48bb78', '风险': '#f6ad55', '默认': '#a0aec0',
};

const STROKE_COLOR_MAP = {
  '产品': '#3182ce', '核心企业': '#c53030', '上游企业': '#2b6cb0',
  '下游企业': '#2f855a', '风险': '#c05621', '默认': '#4a5568',
};

// ====================================================================
// 2. 工具函数 (Utilities)
// ====================================================================

function debounce(func, delay = 100) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// ====================================================================
// 3. 核心Composable逻辑 (Main Composable Logic)
// ====================================================================

export function useUestcG6(graphData) {
  const containerRef = ref(null);
  const graphInstanceRef = ref(null);
  const isInitializing = ref(false);
  const renderError = ref(null);

  const destroyGraph = () => {
    if (graphInstanceRef.value) {
      try {
        graphInstanceRef.value.destroy();
        graphInstanceRef.value = null;
        console.log('📊 G6图形实例已销毁');
      } catch (error) {
        console.error('❌ 销毁G6图形时出错:', error);
      }
    }
  };

  const initGraph = async () => {
    if (!containerRef.value || isInitializing.value) return;

    isInitializing.value = true;
    renderError.value = null;

    try {
      await nextTick();
      const container = containerRef.value;
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) throw new Error('容器尺寸无效');

      destroyGraph();

      const graph = new G6.Graph({
        container,
        width,
        height,
        renderer: 'webgl', // 优化：启用WebGL渲染器
        fitView: true,
        fitViewPadding: [40, 40, 40, 40],
        fitCenter: true,
        minZoom: 0.1,
        maxZoom: 3,
        layout: getLayoutConfig(0),
        animate: true,
        animateCfg: { duration: 300, easing: 'easeCubic' },
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
        },
        defaultNode: {
          type: 'circle',
          size: [30, 30],
          labelCfg: {
            position: 'center',
            style: { fill: '#E2E8F0', fontSize: 10, fontWeight: 'bold' },
          },
          style: {
            fill: CATEGORY_COLOR_MAP['默认'],
            stroke: STROKE_COLOR_MAP['默认'],
            lineWidth: 2,
            cursor: 'pointer',
          },
        },
        defaultEdge: {
          type: 'line',
          style: {
            stroke: '#6b7280', lineWidth: 1.5, opacity: 0.6,
            endArrow: { path: G6.Arrow.triangle(6, 8, 8), d: 8, fill: '#6b7280' },
          },
        },
        nodeStateStyles: {
          hover: { shadowColor: '#fbbf24', shadowBlur: 10, lineWidth: 3 },
          active: { 
            stroke: '#f59e0b', 
            lineWidth: 4, 
            shadowColor: '#f59e0b', 
            shadowBlur: 15, 
            fill: '#4A5568'
          },
          dim: { opacity: 0.3 },
        },
        edgeStateStyles: {
          active: { stroke: '#f59e0b', lineWidth: 2.5, opacity: 1 },
          dim: { opacity: 0.2 },
        },
        plugins: [createTooltip()],
      });

      setupGraphInteractions(graph);
      graphInstanceRef.value = graph;
      console.log('✅ G6图形初始化成功');
    } catch (error) {
      console.error('❌ G6图形初始化失败:', error);
      renderError.value = error.message;
    } finally {
      isInitializing.value = false;
    }
  };

  const renderGraphData = async (data) => {
    const graph = graphInstanceRef.value;
    if (!graph || !data) return;

    try {
      const clonedData = JSON.parse(JSON.stringify(data));
      const processedNodes = (clonedData.nodes || []).map(node => ({
        ...node,
        style: {
          fill: CATEGORY_COLOR_MAP[node.category] || CATEGORY_COLOR_MAP['默认'],
          stroke: STROKE_COLOR_MAP[node.category] || STROKE_COLOR_MAP['默认'],
          lineWidth: 2,
        },
      }));

      graph.data({ nodes: processedNodes, edges: clonedData.edges || [] });
      if (processedNodes.length > 0) {
        graph.updateLayout(getLayoutConfig(processedNodes.length));
      }
      graph.render();
      console.log('✅ 图形数据渲染完成');

      await nextTick();
      if (processedNodes.length > 0) {
        graph.fitView(40, null, true);
      }
    } catch (error) {
      console.error('❌ 渲染图形数据时出错:', error);
      renderError.value = `渲染失败: ${error.message}`;
    }
  };

  const clearAllHighlights = (graph) => {
    graph.getNodes().forEach(node => graph.clearItemStates(node, ['active', 'dim', 'hover']));
    graph.getEdges().forEach(edge => graph.clearItemStates(edge, ['active', 'dim', 'hover']));
  };

  const highlightNodeAndNeighbors = (graph, targetNode) => {
    clearAllHighlights(graph);
    const relatedEdges = targetNode.getEdges();
    const relatedNodeIds = new Set([targetNode.getID()]);
    relatedEdges.forEach(edge => {
      relatedNodeIds.add(edge.getSource().getID());
      relatedNodeIds.add(edge.getTarget().getID());
    });

    graph.getNodes().forEach(node => {
      if (relatedNodeIds.has(node.getID())) {
        graph.setItemState(node, 'active', true);
      } else {
        graph.setItemState(node, 'dim', true);
      }
    });

    graph.getEdges().forEach(edge => {
      if (relatedNodeIds.has(edge.getSource().getID()) && relatedNodeIds.has(edge.getTarget().getID())) {
        graph.setItemState(edge, 'active', true);
      } else {
        graph.setItemState(edge, 'dim', true);
      }
    });
  };

  const setupGraphInteractions = (graph) => {
    let pinnedNode = null;
    const debouncedRefresh = debounce(() => graph.refresh(), 100);
    graph.on('viewportchange', debouncedRefresh);
    graph.on('aftercrash', () => renderError.value = '图形渲染崩溃，请刷新重试');

    graph.on('node:mouseenter', e => {
      if (!pinnedNode) { highlightNodeAndNeighbors(graph, e.item); }
      graph.setItemState(e.item, 'hover', true);
    });

    graph.on('node:mouseleave', e => {
      if (!pinnedNode) { clearAllHighlights(graph); }
      graph.setItemState(e.item, 'hover', false);
    });

    graph.on('node:click', e => {
      const clickedNode = e.item;
      if (pinnedNode && pinnedNode.getID() === clickedNode.getID()) {
        pinnedNode = null;
        clearAllHighlights(graph);
      } else {
        pinnedNode = clickedNode;
        highlightNodeAndNeighbors(graph, clickedNode);
      }
    });

    let mousedownPos = null;
    graph.on('canvas:mousedown', e => { mousedownPos = { x: e.x, y: e.y }; });
    graph.on('canvas:mouseup', e => {
      if (mousedownPos) {
        const dist = (e.x - mousedownPos.x) ** 2 + (e.y - mousedownPos.y) ** 2;
        if (dist < 25) { pinnedNode = null; clearAllHighlights(graph); }
      }
      mousedownPos = null;
    });
    graph.on('canvas:mouseleave', () => { mousedownPos = null; });

    graph.on('afterviewportchange', () => {
      const zoom = graph.getZoom();
      const shouldHideLabel = zoom < 0.4;
      graph.getNodes().forEach(node => {
        const shapes = node.getContainer().get('children');
        const labelShape = shapes.find(s => s.get('type') === 'text');
        if (labelShape) { shouldHideLabel ? labelShape.hide() : labelShape.show(); }
      });
    });
  };

  const createTooltip = () => new G6.Tooltip({ offsetX: 10, offsetY: 20, trigger: 'mouseenter', itemTypes: ['node', 'edge'], className: 'g6-custom-tooltip', getContent: (e) => { try { const m = e.item.getModel(); return e.item.getType()==='node'?`<div class="tooltip-content"><strong>${m.label||m.id}</strong><br><span class="tooltip-meta">类型: ${m.category||'未分类'}</span></div>`:`<div class="tooltip-content"><strong>关系: ${m.label||'关联'}</strong></div>`; } catch (err) { return '数据加载错误'; } } });
  const getLayoutConfig = (nodeCount) => ({ type: 'force', preventOverlap: true, linkDistance: nodeCount > 40 ? 100 : 80, nodeStrength: -300, edgeStrength: 0.2 });

  watch(
    () => [containerRef.value, graphData.value],
    async ([container, data]) => {
      if (!container) return;
      if (!graphInstanceRef.value && !isInitializing.value) {
        await initGraph();
      }
      if (graphInstanceRef.value && data) {
        await renderGraphData(data);
      }
    },
    { deep: true, immediate: true }
  );

  onUnmounted(destroyGraph);

  const refresh = () => renderGraphData(graphData.value);
  const fitView = () => graphInstanceRef.value?.fitView(40, null, true);
  const zoomIn = () => graphInstanceRef.value?.zoom(1.2, null, true);
  const zoomOut = () => graphInstanceRef.value?.zoom(0.8, null, true);

  return { containerRef, isInitializing, renderError, refresh, fitView, zoomIn, zoomOut };
}